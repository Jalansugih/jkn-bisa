# BinaUsaha — Production Deploy

## Arsitektur yang sudah diperbaiki

- **Firebase Authentication**: login/register Google + email/password.
- **Cloud Firestore**: order, users, products, articles, RFQ.
- **Admin**: otorisasi server-side melalui Firestore Rules.
- **Order**: order customer masuk ke `orders`, real-time terlihat di Admin.
- **Update order**: status, catatan, nomor registrasi, dan link dokumen hanya dapat diubah admin.
- **Order tracking**: tamu memakai Cloud Function `trackOrder`; tidak lagi membaca koleksi `orders` secara publik.
- **Notifikasi order**: `onOrderCreated` dapat mengirim email ke admin jika SMTP dikonfigurasi.
- **AI API**: `/api/gemini/consult` dan `/api/gemini/rfq-analysis` diarahkan ke Firebase Functions agar tetap bekerja di Firebase Hosting.

## 1. Firebase project

Paket ini sudah diarahkan ke project Firebase `bisa-id-2b352`, agar konsisten dengan konfigurasi `VITE_FIREBASE_PROJECT_ID` yang digunakan aplikasi.

## 2. Buat `.env.local` untuk frontend

Salin `.env.example` menjadi `.env.local`, lalu isi:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_USE_AUTH_EMULATOR=false
VITE_USE_FIRESTORE_EMULATOR=false
VITE_USE_FUNCTIONS_EMULATOR=false
```

Jangan commit `.env.local`.

## 3. Konfigurasi Firebase Authentication

Di Firebase Console:

1. Authentication → Sign-in method.
2. Aktifkan **Email/Password**.
3. Aktifkan **Google**.
4. Tambahkan domain production ke Authorized domains.

## 4. Deploy Firestore Rules + Index

Dari folder project:

```powershell
firebase login
firebase use <FIREBASE_PROJECT_ID>
firebase deploy --only firestore:rules,firestore:indexes
```

Rules sekarang:
- customer hanya dapat membaca order miliknya;
- admin dapat membaca dan mengelola seluruh order;
- customer tidak dapat mengubah status order;
- order guest tetap dapat dibuat;
- tracking publik tidak lagi memakai `allow get: if true`.

## 5. Konfigurasi Firebase Functions

Buat:

`functions/.env`

Isi minimal:

```env
GEMINI_API_KEY=
ADMIN_EMAIL=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

`GEMINI_API_KEY` diperlukan untuk endpoint AI.

SMTP bersifat opsional. Jika kosong, order tetap tersimpan; hanya email notifikasi yang dilewati.

Install dan deploy:

```powershell
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 6. Build & deploy frontend

```powershell
npm install
npm run build
firebase deploy --only hosting
```

Firebase Hosting akan melayani folder `dist`.

## 7. Admin

Dua email administrator bawaan yang diizinkan oleh Rules:

- `databasemanb@gmail.com`
- `admin@binausaha.id`

Jika ingin mengganti email administrator, ubah daftar email secara konsisten di:

- `src/lib/authService.ts`
- `firestore.rules`
- `src/components/admin/AdminUsersPage.tsx`

Setelah mengubah `firestore.rules`, deploy ulang rules.

## 8. Alur order production

1. Customer memilih produk.
2. Customer memilih add-on dan voucher.
3. Customer mengisi nama, brand, WhatsApp, email, catatan.
4. Sistem membuat `BU-XXXXXXXXX`.
5. Order disimpan ke Firestore.
6. Admin menerima order secara real-time.
7. Admin mengubah status:
   - Verifikasi
   - Pengerjaan
   - QC & Training
   - Selesai
8. Customer dapat melihat progres dari Order ID.
9. Jika SMTP aktif, admin mendapat email ketika order baru dibuat.

## Penting: kredensial lama

File yang Anda upload sebelumnya berisi credential nyata di `.env.local`, termasuk API key dan password database. File tersebut **tidak dimasukkan ke paket hasil perbaikan**.

Sebaiknya segera:
- rotate/revoke Gemini API key;
- ganti password database yang tercantum;
- jangan commit `.env.local`;
- gunakan environment variables di Firebase/Vercel/hosting production.
