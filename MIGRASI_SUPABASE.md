# Panduan Migrasi: Firebase → Supabase

Project ini sudah dimigrasi dari Firebase (Auth + Firestore + Cloud Functions)
ke Supabase (Auth + Postgres + Realtime). Ikuti langkah di bawah untuk
menyalakannya di project Supabase Anda.

## 1. Jalankan skema database

1. Buka **Supabase Dashboard** → project Anda → **SQL Editor**.
2. Buka file `supabase/schema.sql` di repo ini, copy semua isinya.
3. Paste ke SQL Editor lalu klik **Run**.

Ini akan membuat:
- Tabel `profiles`, `orders`, `rfqs`, `products`, `articles`
- RLS (Row Level Security) policy yang setara dengan `firestore.rules` lama
- Fungsi `is_admin()` dan `is_admin_email()` — daftar email admin ada di sini,
  **harus selalu disinkronkan manual** dengan `ADMIN_EMAILS` di
  `src/lib/authService.ts` (persis seperti aturan lama di Firestore Rules).
- Trigger `on_auth_user_created` — otomatis membuat baris `profiles` setiap
  ada user baru daftar (email/password maupun Google).
- Fungsi `track_order(search_term)` — dipakai fitur "Lacak Pesanan" publik
  tanpa login, pengganti Cloud Function `trackOrder`.
- Publication realtime untuk `orders`, `rfqs`, `products`, `articles`,
  `profiles` (dipakai `subscribeToXxx()` di semua service).

Aman dijalankan ulang di project yang sama (pakai `create table if not exists`,
`drop policy if exists`, dst).

## 2. Aktifkan Google Sign-In (opsional, kalau dipakai)

1. Supabase Dashboard → **Authentication → Providers → Google** → aktifkan.
2. Isi **Client ID** dan **Client Secret** dari Google Cloud Console
   (OAuth 2.0 Client ID, tipe **Web application**).
3. Di Google Cloud Console, tambahkan Authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`
4. Di **Authentication → URL Configuration**, tambahkan domain situs Anda
   (dan `http://localhost:3000` untuk development) ke **Redirect URLs**.

Catatan penting: alur Google login di Supabase berbeda dari Firebase.
Firebase pakai popup (`signInWithPopup`) yang langsung resolve dengan data
user. Supabase me-**redirect** seluruh halaman ke Google lalu kembali lagi
ke situs Anda. `loginWithGoogle()` di `authService.ts` sudah disesuaikan;
data user final diterima lewat `subscribeToAuthChanges` setelah redirect
kembali, bukan dari return value `loginWithGoogle()` itu sendiri.

## 3. Isi environment variables

Copy `.env.local.example` menjadi `.env.local`, lalu isi:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...          # anon/public key, BUKAN service_role key
```

Ambil di **Project Settings → API**.

Untuk notifikasi email order baru (opsional — kalau dikosongi, checkout
tetap jalan normal, cuma notifikasi email dilewati):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-sender@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@binausaha.co.id
```

## 4. Install & jalankan

```bash
npm install
npm run dev
```

## 5. Apa yang berubah secara arsitektur

| Sebelumnya (Firebase) | Sekarang (Supabase) |
|---|---|
| `src/lib/firebase.ts` | `src/lib/supabase.ts` |
| Firestore collections (`users`, `orders`, `rfqs`, `products`, `articles`) | Tabel Postgres yang sama namanya (kecuali `users` → `profiles`, karena `users` dipakai Supabase Auth secara internal) |
| `firestore.rules` | RLS policies di `supabase/schema.sql` |
| `onSnapshot()` real-time listener | `supabase.channel(...).on('postgres_changes', ...)` |
| Cloud Function `trackOrder` (callable) | Postgres function `track_order()` (RPC, `SECURITY DEFINER`) |
| Cloud Function `onOrderCreated` (kirim email) | Endpoint Express `/api/notify-order` di `server.ts`, dipanggil dari client setelah insert order sukses |
| `signInWithPopup` (Google) | `signInWithOAuth` — redirect, bukan popup |
| `serverTimestamp()` | `now()` / `default now()` di kolom `created_at` / `updated_at` (otomatis via trigger) |

Semua nama fungsi yang dipakai komponen React (`registerWithEmail`,
`loginWithEmail`, `loginWithGoogle`, `checkIsAdmin`, `createOrder`,
`subscribeToMyOrders`, `subscribeToProducts`, dst) **sengaja dipertahankan
sama persis**, jadi tidak ada komponen `.tsx` lain yang perlu diubah selain
2 baris import di `App.tsx`.

## 6. Yang TIDAK ikut termigrasi otomatis

- **Data lama di Firestore** tidak dipindahkan (sesuai kesepakatan: mulai
  bersih di Supabase). Kalau nanti butuh migrasi data produksi, export
  Firestore ke JSON lalu tulis skrip insert ke tabel Supabase yang sesuai.
- **Firebase Storage** (kalau ada gambar yang di-upload ke Firebase
  Storage) — project ini sepertinya hanya memakai URL gambar eksternal
  (Unsplash dll), jadi tidak ada migrasi storage yang diperlukan. Kalau
  ternyata ada upload file, gunakan **Supabase Storage** sebagai
  penggantinya (belum diimplementasikan di sini).
- Folder `functions/` (Firebase Cloud Functions lama) sudah dihapus;
  logikanya sudah dipindah ke `supabase/schema.sql` (`track_order`) dan
  `server.ts` (`/api/notify-order`).

## 7. Checklist sebelum deploy produksi

- [ ] `supabase/schema.sql` sudah dijalankan di project Supabase produksi
- [ ] Email admin di `is_admin_email()` (SQL) sudah sinkron dengan
      `ADMIN_EMAILS` di `src/lib/authService.ts`
- [ ] Google OAuth provider aktif + redirect URL produksi terdaftar
- [ ] `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` sudah diisi di env
      hosting (Vercel/Netlify/VPS dsb) — **bukan cuma di `.env.local`**
- [ ] Coba daftar 1 akun baru → cek baris muncul di tabel `profiles`
- [ ] Coba checkout 1 order tamu (tanpa login) → cek masuk ke tabel `orders`
- [ ] Login sebagai admin → cek dashboard admin bisa lihat semua order/user
- [ ] Login sebagai customer biasa → pastikan **tidak bisa** akses `/admin`
