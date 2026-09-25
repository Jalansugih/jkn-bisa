# Panduan Setup Backend (Firebase)

Aplikasi ini sekarang punya backend asli menggunakan **Firebase**:

- **Auth asli** — Register/Login pakai Email+Password atau Google (bukan lagi simulasi).
- **Order & Invoice tersimpan permanen** di Firestore (bukan localStorage lagi).
- **Notifikasi email ke admin** setiap ada order baru masuk (Cloud Function).
- **Lacak Pesanan** memanggil backend asli (Cloud Function), bukan array lokal.

Tanpa langkah-langkah di bawah, fitur login & order akan menampilkan pesan
"Backend belum dikonfigurasi" — situs tetap tampil normal, tapi fitur-fitur
ini tidak aktif sampai Firebase disambungkan.

## 1. Buat Project Firebase

1. Buka https://console.firebase.google.com → **Add project** → beri nama (mis. `binausaha-prod`).
2. Setelah project dibuat, buka **Build > Authentication** → tab **Sign-in method** → aktifkan:
   - **Email/Password**
   - **Google**
3. Buka **Build > Firestore Database** → **Create database** → pilih mode **Production** → pilih lokasi terdekat (mis. `asia-southeast2` / Jakarta).
4. Buka **Project settings (ikon gerigi) > General**, scroll ke **Your apps** → klik ikon web `</>` → daftarkan app → salin objek `firebaseConfig`.

## 2. Isi Environment Variable Frontend

Salin `.env.example` menjadi `.env.local`, lalu isi bagian `VITE_FIREBASE_*` dengan nilai dari `firebaseConfig` yang barusan disalin:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Jalankan lokal: `npm install && npm run dev`

## 3. Install Firebase CLI & Login

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pilih project yang barusan dibuat
```

## 4. Set Kredensial Email Notifikasi (Cloud Function Secrets)

Order baru akan mengirim email ke admin lewat SMTP. Kalau pakai Gmail, buat
**App Password** dulu di Google Account > Security > 2-Step Verification > App passwords.

```bash
firebase functions:secrets:set SMTP_HOST      # isi: smtp.gmail.com
firebase functions:secrets:set SMTP_PORT      # isi: 587
firebase functions:secrets:set SMTP_USER      # isi: alamat gmail pengirim
firebase functions:secrets:set SMTP_PASS      # isi: App Password (bukan password biasa)
firebase functions:secrets:set ADMIN_EMAIL    # isi: email admin yang menerima notifikasi
```

## 5. Deploy Firestore Rules + Cloud Functions

```bash
cd functions && npm install && cd ..
firebase deploy --only firestore:rules,firestore:indexes,functions
```

Ini akan men-deploy:
- `firestore.rules` — aturan keamanan (user hanya bisa baca datanya sendiri).
- `onOrderCreated` — kirim email admin tiap ada order baru.
- `trackOrder` — dipakai fitur "Lacak Pesanan" agar tamu (belum login) tetap bisa cek status.

## 6. Build & Deploy Frontend (Hosting)

```bash
npm run build
firebase deploy --only hosting
```

## Menjalankan Semua Secara Lokal (Emulator, opsional)

```bash
cd functions && npm install && cd ..
firebase emulators:start --only auth,firestore,functions
```

## Ringkasan Yang Sudah Real vs Yang Masih Perlu Kamu Isi

| Fitur | Status |
|---|---|
| Register/Login (Email & Google) | ✅ Real, via Firebase Auth |
| Order tersimpan di database | ✅ Real, via Firestore (`orders` collection) |
| Lacak Pesanan (guest) | ✅ Real, via Cloud Function `trackOrder` |
| "Pesanan Saya" (user login) | ✅ Real-time dari Firestore |
| Email notifikasi order baru | ✅ Kode sudah ada, **perlu kamu isi SMTP secrets** (langkah 4) |
| Pembayaran otomatis (payment gateway) | ⏳ Belum — saat ini masih transfer manual + konfirmasi WhatsApp |
| Form RFQ & Konsultasi tersimpan ke database | ⏳ Belum — saat ini masih notifikasi via WhatsApp/toast saja |
| Panel admin untuk update status pesanan | ⏳ Belum — update status saat ini perlu langsung lewat Firebase Console |

Kalau kamu mau saya lanjutkan yang masih ⏳ (misalnya integrasi payment gateway seperti Midtrans/Xendit, simpan RFQ ke Firestore + notifikasi, atau bikin panel admin), tinggal bilang saja.
