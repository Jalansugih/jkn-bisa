-- Jalankan SEKALI di Supabase > SQL Editor.
-- Menambahkan 25 kategori baru ke enum article_category (aman: tidak menghapus data,
-- dan dilewati bila nilainya sudah ada).
-- Catatan: jalankan TANPA dibungkus transaksi (ALTER TYPE ADD VALUE tidak bisa dipakai
-- di transaksi yang sama dengan penggunaannya).

ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'bisnis-umkm';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'teknologi-digital';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'marketing-penjualan';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'keuangan-investasi';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'legalitas';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'konstruksi-properti';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'pertanian-peternakan';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'industri-manufaktur';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'perdagangan-retail';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'logistik-distribusi';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'pendidikan-karier';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'kuliner-fnb';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'kesehatan-kecantikan';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'kreatif-desain';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'administrasi-produktivitas';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'berita-tren-bisnis';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'otomotif-transportasi';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'energi-lingkungan';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'pariwisata-perhotelan';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'pemerintahan-kebijakan-publik';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'ekonomi-keuangan-digital';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'franchise-kemitraan';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'properti-investasi';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'gaya-hidup-produktivitas';
ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'tips-tutorial';
