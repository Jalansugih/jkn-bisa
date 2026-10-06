-- =====================================================================
-- Slug artikel (URL /artikel/<slug>) + Storage gambar artikel
-- Jalankan sekali di Supabase → SQL Editor. Aman dijalankan ulang.
-- =====================================================================

-- 1) Isi slug untuk artikel lama yang slug-nya kosong (dari judul).
update public.articles
set slug = left(
      trim(both '-' from regexp_replace(lower(coalesce(title, id)), '[^a-z0-9]+', '-', 'g')),
      80
    )
where slug is null or btrim(slug) = '';

-- 2) Slug kembar → tambahkan akhiran id supaya unik.
with dup as (
  select id,
         row_number() over (partition by lower(slug) order by created_at, id) as rn
  from public.articles
)
update public.articles a
set slug = a.slug || '-' || right(a.id, 6)
from dup
where a.id = dup.id and dup.rn > 1;

-- 3) Slug wajib unik (case-insensitive).
create unique index if not exists articles_slug_unique
  on public.articles (lower(slug));

-- 4) Bucket publik untuk gambar artikel (maks 2 MB per file, hanya gambar).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('articles', 'articles', true, 2097152,
        array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

-- 5) Policy: siapa saja boleh melihat, hanya admin yang boleh mengubah.
drop policy if exists "articles_storage_read"   on storage.objects;
drop policy if exists "articles_storage_insert" on storage.objects;
drop policy if exists "articles_storage_update" on storage.objects;
drop policy if exists "articles_storage_delete" on storage.objects;

create policy "articles_storage_read" on storage.objects
  for select using (bucket_id = 'articles');

create policy "articles_storage_insert" on storage.objects
  for insert with check (bucket_id = 'articles' and public.is_admin());

create policy "articles_storage_update" on storage.objects
  for update using (bucket_id = 'articles' and public.is_admin())
  with check (bucket_id = 'articles' and public.is_admin());

create policy "articles_storage_delete" on storage.objects
  for delete using (bucket_id = 'articles' and public.is_admin());
