-- =====================================================================
-- Penghitung pembaca artikel yang benar-benar bekerja
-- Jalankan sekali di Supabase → SQL Editor. Aman dijalankan ulang.
--
-- Cara kerja:
--  * Browser memanggil RPC increment_article_view(artikel, id_pengunjung).
--  * 1 pengunjung dihitung maksimal 1x per artikel per hari (WIB),
--    dijaga di server lewat tabel article_view_log, bukan hanya di browser.
--  * Hanya artikel berstatus PUBLISHED yang dihitung.
--  * Pengunjung umum TIDAK bisa mengubah kolom views langsung
--    (policy update tetap khusus admin); hanya lewat fungsi ini.
-- =====================================================================

-- 1) Log kunjungan (untuk mencegah hitungan ganda).
create table if not exists public.article_view_log (
  article_id text not null references public.articles(id) on delete cascade,
  visitor_id text not null,
  viewed_on  date not null default ((now() at time zone 'Asia/Jakarta')::date),
  primary key (article_id, visitor_id, viewed_on)
);

alter table public.article_view_log enable row level security;
-- Sengaja TANPA policy: tabel ini hanya disentuh fungsi security definer di bawah.

-- 2) Fungsi penambah views.
create or replace function public.increment_article_view(p_article_id text, p_visitor_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_views    integer;
  v_inserted integer;
begin
  if not exists (
    select 1 from public.articles where id = p_article_id and status = 'PUBLISHED'
  ) then
    return null;
  end if;

  -- id pengunjung tidak valid → jangan hitung, cukup kembalikan angka saat ini
  if p_visitor_id is null or length(p_visitor_id) < 8 or length(p_visitor_id) > 64 then
    select views into v_views from public.articles where id = p_article_id;
    return coalesce(v_views, 0);
  end if;

  insert into public.article_view_log (article_id, visitor_id)
  values (p_article_id, p_visitor_id)
  on conflict do nothing;

  get diagnostics v_inserted = row_count;

  if v_inserted > 0 then
    update public.articles
       set views = coalesce(views, 0) + 1
     where id = p_article_id
    returning views into v_views;
  else
    select views into v_views from public.articles where id = p_article_id;
  end if;

  return coalesce(v_views, 0);
end;
$$;

revoke all on function public.increment_article_view(text, text) from public;
grant execute on function public.increment_article_view(text, text) to anon, authenticated;

-- 3) Naiknya views tidak boleh dianggap "artikel diedit":
--    jaga updated_at bila satu-satunya perubahan hanyalah kolom views.
create or replace function public.set_articles_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.views is distinct from old.views
     and (to_jsonb(new) - 'views' - 'updated_at') = (to_jsonb(old) - 'views' - 'updated_at') then
    new.updated_at = old.updated_at;
  else
    new.updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at before update on public.articles
  for each row execute function public.set_articles_updated_at();

-- 4) Pastikan views tidak pernah NULL.
update public.articles set views = 0 where views is null;
alter table public.articles alter column views set default 0;
alter table public.articles alter column views set not null;
