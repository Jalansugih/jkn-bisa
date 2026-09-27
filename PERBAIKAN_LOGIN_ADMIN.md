# Catatan Perbaikan: Sistem Admin, Login/Register, & Pembersihan Kode

Lanjutan dari `MIGRASI_SUPABASE.md`. Perbaikan berikut menyasar 3 hal yang diminta:
kebersihan kode, sistem admin, dan diferensiasi UI login vs register.

## 1. Sistem Admin — satu sumber kebenaran

**Sekarang:** status admin hanya berasal dari `profiles.role = admin`.
di-hardcode di **5 tempat berbeda**: `schema.sql`, `authService.ts` (`profiles.role`),
`AdminGuard.tsx` (2x, hanya teks tampilan), `AdminUsersPage.tsx` (3x, logika proteksi
"Super Admin"). Kalau satu lupa diupdate, status admin bisa tidak sinkron antara
client dan database.

**Sesudah:** hanya **satu** tempat yang boleh menyebut email admin:
`supabase/schema.sql` → fungsi `profiles.role = admin`, dipakai oleh trigger saat user
baru mendaftar. Semua kode client sekarang murni percaya pada kolom `profiles.role`
dari database:

- `checkIsAdmin(user)` di `authService.ts` disederhanakan jadi `user?.role === 'admin'`.
- `profiles.role` export dihapus total.
- `AdminGuard.tsx`: teks yang menampilkan email admin dihapus (sekaligus menutup
  kebocoran info & duplikasi).
- `AdminUsersPage.tsx`: proteksi "tidak bisa dicabut" yang tadinya berbasis
  daftar email hardcoded, diganti proteksi yang lebih masuk akal — **admin tidak
  bisa mencabut hak admin dari akun dirinya sendiri** (mencegah self-lockout),
  dicek lewat `currentUserId` yang dioper dari `AdminDashboard`.

Untuk menambah/mencabut admin sekarang ada 2 cara resmi: (1) edit
`profiles.role = admin` di `schema.sql` untuk auto-assign saat user baru daftar,
atau (2) tombol "Jadikan Admin" di halaman Admin → Pengguna (memanggil
`updateUserRole()`, sudah ada sebelumnya).

## 2. Sistem Login diperbaiki (bukan cuma UI)

- **Bug nyata diperbaiki:** `friendlyAuthError` sebelumnya mencocokkan kode error
  gaya **Firebase** (`auth/wrong-password`, dst) padahal project sudah pakai
  Supabase Auth, yang kode errornya berbeda (`invalid_credentials`, `email_exists`,
  dst). Akibatnya hampir semua error jatuh ke pesan generik "Terjadi kesalahan".
  Sekarang ada `getAuthErrorMessage()` di `authService.ts` yang memetakan kode
  error resmi Supabase Auth, dengan fallback pencocokan teks pesan untuk jaga-jaga.
- **Fitur baru: Lupa Kata Sandi.** Sebelumnya tidak ada sama sekali — kalau
  pelanggan lupa password, mereka mentok. Sekarang:
  - `requestPasswordReset(email)` & `updatePassword(newPassword)` ditambahkan
    di `authService.ts`.
  - Link "Lupa kata sandi?" muncul **khusus di mode Login** pada `AuthModal`.
  - `ResetPasswordModal.tsx` (baru) otomatis terbuka saat user kembali dari link
    email reset (dideteksi lewat event Supabase `PASSWORD_RECOVERY`, diteruskan
    sebagai custom event `binausaha:password-recovery` dan didengarkan di `App.tsx`).

## 3. UI Login vs Register benar-benar dibedakan

`AuthModal.tsx` dirombak supaya kedua mode terasa berbeda, bukan cuma toggle field:

| | Register (belum punya akun) | Login (sudah punya akun) |
|---|---|---|
| Warna header | Gradasi biru–indigo (fresh, "bergabung") | Gradasi slate gelap–biru tua ("profesional, kembali") |
| Ikon status | Sparkles | Zap |
| Banner | Keuntungan member baru (diskon, gratis konsultasi) | Info keamanan akun ("akun Anda aman & tersimpan") |
| Field form | Nama, WhatsApp, Nama Usaha, Email, Kata Sandi, Minat Layanan | Hanya Email + Kata Sandi |
| Link tambahan | — | "Lupa kata sandi?" |
| Tombol submit | Biru, "Selesaikan Pendaftaran Akun" | Slate gelap, "Masuk ke Akun" |
| Link penutup | "Sudah punya akun? Masuk di sini" | "Belum punya akun? Daftar gratis" |

Jadi begitu modal dibuka, secara visual & tekstual langsung terasa beda antara
alur "saya baru" vs "saya sudah pelanggan" — bukan sekadar form yang sama dengan
tab aktif berbeda warna.

## 4. Pembersihan kode

- `App.tsx`: alias membingungkan `logout as firebaseLogout` dikembalikan jadi
  `logout` biasa (fungsinya memang sudah Supabase, bukan Firebase lagi).
- `App.tsx`: `handleOpenLogin` yang didefinisikan tapi tidak pernah dipakai —
  ternyata ada inline handler duplikat persis sama di `AdminDashboard`. Inline
  handler itu dihapus, diganti pakai `handleOpenLogin` yang sudah ada.
- `App.tsx`: import `isSupabaseConfigured` yang tidak terpakai dihapus; 4 handler
  `onOpenRfq={(kategori) => ...}` dengan parameter tak terpakai disederhanakan.
- Import ikon `lucide-react` yang tidak dipakai dibersihkan di `AdminGuard.tsx`,
  `AdminLayout.tsx`, `AdminUsersPage.tsx`.
- Diverifikasi dengan `tsc --noEmit --noUnusedLocals --noUnusedParameters` dan
  `vite build` — semua file yang disentuh 100% bersih, build produksi sukses.

## Catatan

Masih ada unused-import kosmetik (ikon lucide-react yang diimpor tapi tidak
dipakai) di puluhan file **lain** yang tidak tersentuh pekerjaan ini (halaman
service, halaman admin lain, dsb) — peninggalan lama, tidak berdampak ke
fungsi atau ukuran bundle produksi (di-tree-shake Vite), tapi tetap bisa
dirapikan lebih lanjut kalau diinginkan.
