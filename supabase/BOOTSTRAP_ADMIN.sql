-- BinaUsaha — Bootstrap Admin Pertama
-- 1) Buat akun melalui halaman Daftar di website.
-- 2) Buka Supabase Dashboard -> Authentication -> Users.
-- 3) Salin UUID akun tersebut.
-- 4) Ganti UUID di bawah, lalu jalankan SQL ini.

update public.profiles
set role = 'admin', updated_at = now()
where id = 'UUID_USER_ANDA';

-- Verifikasi
select id, email, name, role
from public.profiles
where id = 'UUID_USER_ANDA';
