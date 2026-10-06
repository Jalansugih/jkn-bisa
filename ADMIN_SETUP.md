# Setup Admin BinaUsaha

## Supabase environment
Isi sendiri saat deploy/build:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Jangan commit `.env.local`.

## Admin pertama
1. Daftar akun dari website.
2. Di Supabase: Authentication -> Users -> salin UUID akun.
3. Buka SQL Editor dan jalankan isi `supabase/BOOTSTRAP_ADMIN.sql` setelah mengganti `UUID_USER_ANDA`.
4. Logout lalu login kembali.

## Admin berikutnya
Masuk sebagai admin -> Admin -> Pengguna -> `Jadikan Admin`.

## Database yang sudah lama
Jalankan migration `supabase/migrations/20260926000100_fix_admin_identity.sql`.
