-- BinaUsaha: perbaikan identity/admin untuk project Supabase yang sudah berjalan.
-- Jalankan setelah schema lama. Tidak mengubah akun Auth.

-- Hapus fungsi legacy email-admin jika ada.
drop function if exists public.is_admin_email(text);

-- Sumber kebenaran admin hanya profiles.role.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- User biasa boleh membuat profil customer miliknya sendiri.
-- Mereka TIDAK boleh memasukkan role=admin.
drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (
    auth.uid() = id and role = 'customer'
  );

-- Hanya admin yang boleh mengubah role. User biasa hanya boleh
-- memperbarui profilnya sendiri selama role tetap customer.
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (public.is_admin() or auth.uid() = id)
  with check (
    public.is_admin()
    or (auth.uid() = id and role = 'customer')
  );

-- Semua akun baru selalu customer. Promosi admin dilakukan oleh admin
-- yang sudah ada atau melalui bootstrap SQL untuk admin pertama.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar, provider, role, joined_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Mitra UMKM'),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    case when new.raw_app_meta_data ->> 'provider' = 'google' then 'google' else 'form' end,
    'customer',
    to_char(new.created_at, 'DD Month YYYY')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Bootstrap admin pertama (jalankan MANUAL setelah akun dibuat):
-- update public.profiles set role = 'admin', updated_at = now()
-- where id = 'UUID_USER_ANDA';
