-- =====================================================================
-- FIX AFILIASI: user yang sudah daftar tidak lagi diminta daftar ulang
-- + data untuk "Pendapatan Afiliasi" di dashboard user.
-- Jalankan di Supabase -> SQL Editor SETELAH migrasi referral sebelumnya.
-- Aman dijalankan berulang.
-- =====================================================================

-- 1) Guard kode referral: profil tanpa kode otomatis dibuatkan ----------------
--    (sebelumnya kode hanya dibuat saat INSERT; profil yang kodenya NULL
--     tidak pernah bisa pulih karena UPDATE dari user dikembalikan ke NULL)
create or replace function public.profiles_guard_referral_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.referral_code := public.gen_referral_code();
  elsif old.referral_code is null then
    -- kode kosong: selalu dibuatkan server, nilai kiriman klien diabaikan
    new.referral_code := public.gen_referral_code();
  elsif new.referral_code is distinct from old.referral_code
        and auth.uid() is not null
        and not public.is_admin() then
    new.referral_code := old.referral_code;
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_referral_code on public.profiles;
create trigger trg_profiles_referral_code
  before insert or update on public.profiles
  for each row execute function public.profiles_guard_referral_code();

-- Lengkapi semua profil yang masih kosong
update public.profiles set referral_code = public.gen_referral_code() where referral_code is null;

-- 2) RPC: pastikan user login punya profil + kode referral ---------------------
create or replace function public.ensure_my_referral_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  uid  uuid := auth.uid();
  code text;
begin
  if uid is null then return null; end if;

  select referral_code into code from public.profiles where id = uid;
  if code is not null then return code; end if;

  -- profil belum ada (trigger signup gagal/terlambat) -> buat
  if not exists (select 1 from public.profiles where id = uid) then
    insert into public.profiles (id, name, email, provider, role, joined_at)
    select u.id,
           coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', 'Mitra UMKM'),
           u.email,
           public._safe_provider(
             case when u.raw_app_meta_data ->> 'provider' = 'google' then 'google' else 'form' end
           )::public.auth_provider,
           'customer',
           to_char(u.created_at, 'DD Month YYYY')
    from auth.users u where u.id = uid
    on conflict (id) do nothing;
  else
    -- profil ada tapi kode kosong -> sentuh baris supaya trigger membuat kode
    update public.profiles set referral_code = null where id = uid and referral_code is null;
  end if;

  select referral_code into code from public.profiles where id = uid;
  return code;
end $$;

revoke all on function public.ensure_my_referral_code() from public;
grant execute on function public.ensure_my_referral_code() to authenticated;

-- 3) RPC: statistik afiliasi milik user yang sedang login -----------------------
--    (user tidak bisa membaca order orang lain lewat RLS, jadi dihitung di server)
create or replace function public.my_referral_stats()
returns table (referred_orders bigint, paid_orders bigint)
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint                                       as referred_orders,
         count(*) filter (where payment_status = 'Lunas')::bigint as paid_orders
  from public.orders
  where referred_by = auth.uid();
$$;

revoke all on function public.my_referral_stats() from public;
grant execute on function public.my_referral_stats() to authenticated;
