-- =====================================================================
-- FIX: daftar via Google & email gagal ("Database error saving new user")
-- Jalankan di Supabase -> SQL Editor (aman dijalankan berulang).
--
-- Penyebab yang diperbaiki:
--  1. Trigger referral di tabel profiles membuat pendaftaran ikut gagal
--     kalau ada error kecil. Sekarang fungsinya SECURITY DEFINER dengan
--     search_path tetap, dan tidak bisa lagi memblokir signup.
--  2. handle_new_user sekarang TIDAK PERNAH menggagalkan signup: kalau
--     insert profil error, hanya dicatat sebagai WARNING (klien sudah
--     punya cadangan upsert di authService.fetchOrCreateProfile).
--  3. WhatsApp & nama usaha dari form daftar ikut disimpan oleh trigger
--     (sebelumnya hilang kalau "Confirm email" aktif).
--  4. Guard kode referral tidak lagi mengembalikan kode ke NULL saat
--     dijalankan dari SQL Editor / service role (auth.uid() = null).
-- =====================================================================

alter table public.profiles add column if not exists referral_code text;
create unique index if not exists profiles_referral_code_key on public.profiles (referral_code);

create or replace function public.gen_referral_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare c text;
begin
  loop
    c := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists (select 1 from public.profiles where referral_code = c);
  end loop;
  return c;
end $$;

create or replace function public.profiles_guard_referral_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.referral_code := public.gen_referral_code();
  elsif new.referral_code is distinct from old.referral_code
        and auth.uid() is not null          -- request dari user login (bukan SQL Editor/service role)
        and not public.is_admin() then
    new.referral_code := old.referral_code;
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_referral_code on public.profiles;
create trigger trg_profiles_referral_code
  before insert or update on public.profiles
  for each row execute function public.profiles_guard_referral_code();

-- Kolom profiles.provider di database Anda bertipe ENUM (auth_provider),
-- bukan text. Fungsi ini memastikan nilai yang dikirim adalah label enum yang valid.
create or replace function public._safe_provider(p text)
returns text
language plpgsql
stable
set search_path = public
as $$
declare t oid;
begin
  select a.atttypid into t
  from pg_attribute a
  where a.attrelid = 'public.profiles'::regclass
    and a.attname = 'provider' and not a.attisdropped;

  if not exists (select 1 from pg_enum where enumtypid = t) then
    return p;                                   -- kolom text biasa
  end if;
  if exists (select 1 from pg_enum where enumtypid = t and enumlabel = p) then
    return p;                                   -- label ada (mis. 'google')
  end if;
  return (select enumlabel from pg_enum          -- label cadangan
          where enumtypid = t and enumlabel in ('form','email','password')
          order by enumsortorder limit 1);
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.profiles (id, name, email, whatsapp, business_name, avatar, provider, role, joined_at)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Mitra UMKM'),
      new.email,
      nullif(new.raw_user_meta_data ->> 'whatsapp', ''),
      nullif(new.raw_user_meta_data ->> 'business_name', ''),
      coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
      public._safe_provider(
        case when new.raw_app_meta_data ->> 'provider' = 'google' then 'google' else 'form' end
      )::public.auth_provider,
      'customer',
      to_char(new.created_at, 'DD Month YYYY')
    )
    on conflict (id) do nothing;
  exception when others then
    -- Jangan gagalkan signup hanya karena profil; klien akan membuatnya sebagai cadangan.
    raise warning 'handle_new_user gagal untuk %: % (%)', new.id, sqlerrm, sqlstate;
  end;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lengkapi user lama yang belum punya profil / kode referral
-- (role tidak diisi: memakai default 'customer' dari tabel)
insert into public.profiles (id, name, email, provider, joined_at)
select u.id,
       coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', 'Mitra UMKM'),
       u.email,
       public._safe_provider(
         case when u.raw_app_meta_data ->> 'provider' = 'google' then 'google' else 'form' end
       )::public.auth_provider,
       to_char(u.created_at, 'DD Month YYYY')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

update public.profiles set referral_code = public.gen_referral_code() where referral_code is null;
