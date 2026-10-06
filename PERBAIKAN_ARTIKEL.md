# Perbaikan Fitur Artikel

## Yang berubah
1. **Halaman utama** hanya menampilkan **6 artikel** (artikel pilihan dulu, lalu terbaru).
   Di HP tampil 3, di tablet/desktop tampil 6. Search & filter dipindah ke menu **Artikel**.
   Tombol "Lihat Semua Artikel" membuka halaman `/artikel` yang berisi seluruh artikel.
2. **Share URL** berfungsi ke WhatsApp, Facebook, X, Telegram, LinkedIn, dan salin tautan.
   Link yang dibagikan berbentuk `https://domain-anda/artikel/<slug>` (sebelumnya link tidak ikut terkirim).
   Di HP, tombol Bagikan membuka menu share bawaan HP.
3. **Preview link** (judul + gambar + deskripsi) muncul di WA/FB/Telegram lewat `api/artikel.ts`.
4. **Jumlah pembaca** benar-benar dihitung: 1 pengunjung = 1x per artikel per hari, dijaga di server.
5. Urutan "terbaru" diperbaiki (sebelumnya selalu sama karena membaca format tanggal Firestore lama).

## Langkah wajib setelah deploy
1. Supabase → SQL Editor → jalankan `supabase/migrations/20260929000100_article_views.sql` (sekali saja).
2. Deploy ulang ke Vercel. Pastikan env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` terisi
   (fungsi `api/artikel.ts` memakai keduanya).
3. Uji link di https://developers.facebook.com/tools/debug/ (klik "Scrape Again" bila cache lama).

## Catatan
- Gambar artikel harus URL `https://...` (upload Storage sudah OK). Gambar base64 tidak bisa jadi preview;
  akan dipakai `/logo-login.png` sebagai cadangan.
- Views di data contoh (`mockData.ts`) hanya tampil bila database artikel kosong.
