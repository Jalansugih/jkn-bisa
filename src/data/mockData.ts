import { Product, Article, FaqItem } from '../types';

export const PRODUCTS_DATA: Record<string, Product> = {
  website_pro: {
    id: 'website_pro',
    name: 'Paket Website UMKM Pro',
    category: 'website',
    price: 3147900,
    originalPrice: 10493000,
    discountPct: 70,
    priceUnit: '/ sekali bayar',
    description: 'Website bisnis modern, katalog produk & form order WA langsung.',
    badge: 'Terpopuler',
    badgeType: 'popular',
    iconName: 'Globe',
    popular: true,
    features: [
      'Domain .id / .com gratis 1 tahun',
      'Katalog hingga 50 produk + foto HD',
      'Tombol pesan langsung WhatsApp Toko',
      'Tampilan Mobile Friendly & Fast Loading',
      'Integrasi Google Maps & Peta Lokasi Usaha',
    ],
  },
  website_express: {
    id: 'website_express',
    name: 'Landing Page Express',
    category: 'website',
    price: 978600,
    originalPrice: 1957200,
    discountPct: 50,
    priceUnit: '/ paket',
    description: 'Website 1 halaman cepat untuk promosi produk/promo UMKM.',
    badge: 'Hemat Super',
    badgeType: 'super',
    iconName: 'Zap',
    features: [
      'Design Landing Page 1 Halaman Modern',
      'Tombol pesan langsung WhatsApp Auto-Fill',
      'Subdomain / Domain Setup & High Speed Hosting',
      'Desain Ringan, Fast Loading & Mobile Optimized',
      'Proses Pengerjaan Kilat 2 Hari Kerja',
    ],
  },
  rajakas_pos: {
    id: 'rajakas_pos',
    name: 'RajaKas POS - Kasir Digital',
    category: 'pos',
    price: 1118600,
    originalPrice: 2237200,
    discountPct: 50,
    priceUnit: '/ tahun',
    description: 'Sistem pencatatan transaksi & stok barang otomatis terpadu.',
    badge: 'Hemat 50%',
    badgeType: 'primary',
    iconName: 'Store',
    features: [
      'Aplikasi Kasir Android & Web Browser',
      'Cetak Struk Bluetooth & E-Receipt WA',
      'Laporan Penjualan & Untung-Rugi Harian',
      'Manajemen Stok / Inventaris Otomatis',
      'Support Multi-Kasir & Multi-Outlet',
    ],
  },
  pos_hardware_set: {
    id: 'pos_hardware_set',
    name: 'Hardware Set Kasir Complete',
    category: 'pos',
    price: 3078600,
    originalPrice: 6157200,
    discountPct: 50,
    priceUnit: '/ set lengkap',
    description: 'Aplikasi POS + Printer Bluetooth + Cash Drawer Besi + Kertas.',
    badge: 'Hardware + App',
    badgeType: 'hardware',
    iconName: 'Printer',
    features: [
      'Lisensi RajaKas POS Kasir Full 1 Tahun',
      'Printer Thermal Bluetooth Wireless 58mm',
      'Cash Drawer (Laci Kasir Besi Otomatis)',
      'Bonus 10 Roll Kertas Thermal Struk Kasir',
      'Plug & Play Tinggal Pakai Langsung Kirim',
    ],
  },
  pt_perorangan: {
    id: 'pt_perorangan',
    name: 'Paket PT Perorangan',
    category: 'legalitas',
    price: 700000,
    originalPrice: 2100000,
    discountPct: 67,
    priceUnit: '/ paket',
    description: 'Pendirian PT Perorangan resmi AHU Kemenkumham (tanpa akta penegasan Notaris).',
    badge: 'Hemat 67%',
    badgeType: 'super',
    iconName: 'Building2',
    popular: true,
    features: [
      'Pernyataan Pendirian PT Perorangan Resmi AHU',
      'Sertifikat Pendaftaran Kemenkumham RI',
      'NIB (Nomor Induk Berusaha) OSS RBA',
      'NPWP Badan Usaha PT Perorangan & SKT Pajak',
      'Pernyataan Mandiri K3L & Tata Ruang',
      'Tanpa Akta Penegasan Notaris (Opsi Notaris Rp 1.700.000)',
      'Proses Cepat 1-2 Hari Kerja',
    ],
  },
  pt_perorangan_notaris: {
    id: 'pt_perorangan_notaris',
    name: 'PT Perorangan + Akta Notaris',
    category: 'legalitas',
    price: 1700000,
    originalPrice: 3400000,
    discountPct: 50,
    priceUnit: '/ paket komplit',
    description: 'Pendirian PT Perorangan lengkap dengan Akta Penegasan Notaris resmi & legalitas penuh.',
    badge: 'Plus Akta Notaris',
    badgeType: 'primary',
    iconName: 'Building2',
    features: [
      'Akta Penegasan Notaris Resmi & Berita Acara',
      'Sertifikat Pendaftaran Kemenkumham RI & AHU',
      'NIB (Nomor Induk Berusaha) OSS RBA',
      'NPWP Badan Usaha PT Perorangan & SKT Pajak',
      'Draft Rekening Giro Perusahaan di Bank',
      'Proses Kilat 2-4 Hari Kerja',
    ],
  },
  yayasan_pro: {
    id: 'yayasan_pro',
    name: 'Paket Pendirian Yayasan',
    category: 'legalitas',
    price: 5200000,
    originalPrice: 7800000,
    discountPct: 33,
    priceUnit: '/ paket resmi',
    description: 'Pendirian badan hukum Yayasan untuk sosial, pendidikan, kemanusiaan & keagamaan.',
    badge: 'Sosial & Edukasi',
    badgeType: 'primary',
    iconName: 'Landmark',
    features: [
      'Akta Pendirian Yayasan Notaris Resmi',
      'SK Pengesahan Kemenkumham RI',
      'NPWP Badan Yayasan & SKT Pajak',
      'NIB OSS RBA & Izin Operasional Lembaga',
      'Struktur Pembina, Pengurus & Pengawas',
      'Pendampingan Rekening Bank Giro Yayasan',
      'Proses 5-7 Hari Kerja Resmi',
    ],
  },
  koperasi_pro: {
    id: 'koperasi_pro',
    name: 'Paket Pendirian Koperasi',
    category: 'legalitas',
    price: 5500000,
    originalPrice: 7900000,
    discountPct: 30,
    priceUnit: '/ paket resmi',
    description: 'Pendirian badan hukum Koperasi resmi terdaftar di Kemenkumham & Kemenkop UKM.',
    badge: 'Badan Usaha Koperasi',
    badgeType: 'primary',
    iconName: 'Users',
    features: [
      'Berita Acara Rapat Pembentukan & Akta Notaris NPAK',
      'SK Pengesahan Badan Hukum Kemenkumham RI',
      'NPWP Badan Koperasi & SKT Pajak',
      'NIB OSS RBA Koperasi Simpan Pinjam / Konsumen / Jasa',
      'Penyusunan AD/ART Koperasi Bersama Notaris',
      'Pendampingan Rekening Bank Giro Koperasi',
      'Proses 7-10 Hari Kerja',
    ],
  },
  pt_pro: {
    id: 'pt_pro',
    name: 'Pendirian PT Pro',
    category: 'legalitas',
    price: 5498600,
    originalPrice: 7997200,
    discountPct: 50,
    priceUnit: '/ paket lengkap',
    description: 'Pendirian PT resmi AHU + Gratis System Keuangan Usaha.',
    badge: 'GRATIS SYSTEM KEUANGAN',
    badgeType: 'bonus',
    bonus: '🎁 BONUS SPESIAL: GRATIS Aplikasi System Keuangan UMKM (Senilai Rp 2.100.000)!',
    iconName: 'Building2',
    popular: true,
    features: [
      'Akta Pendirian Notaris & SK Kemenkumham Resmi',
      'NIB RBA, KBLI, NPWP Perusahaan & Sertifikat Standar',
      'GRATIS Paket Aplikasi System Keuangan (Worth Rp 2.100.000)',
      'Pencatatan Kas, Pemasukan, Pengeluaran & Laba Rugi',
      'Proses Cepat 5-7 Hari Kerja & Dampingi Buka Rekening PT',
    ],
  },
  cv_pro: {
    id: 'cv_pro',
    name: 'Pendirian CV Pro',
    category: 'legalitas',
    price: 5498600,
    originalPrice: 7997200,
    discountPct: 50,
    priceUnit: '/ paket lengkap',
    description: 'Pendirian badan usaha Persekutuan Komanditer (CV) legal.',
    iconName: 'Building',
    features: [
      'Akta Notaris Pendirian & SK Kemenkumham CV',
      'NIB RBA, KBLI & NPWP Perusahaan CV',
      'Pendaftaran Domisili & Sertifikat Standar',
      'Pendampingan Pembukaan Rekening Bank CV',
      'Proses Cepat 5-7 Hari Kerja',
    ],
  },
  legalitas_nib: {
    id: 'legalitas_nib',
    name: 'Pengurusan NIB & Halal',
    category: 'legalitas',
    price: 1398600,
    originalPrice: 2797200,
    discountPct: 50,
    priceUnit: '/ paket',
    description: 'Izin usaha resmi NIB RBA & Sertifikasi Halal Self Declare.',
    iconName: 'Stamp',
    features: [
      'Penerbitan NIB RBA Resmi Kementerian',
      'Pendampingan Sertifikat Halal BPJPH',
      'Persetujuan KBLI & Klasifikasi Usaha',
      'Dokumen IUMK & Cetak Sertifikat PDF',
      'Proses cepat 3-5 Hari Kerja',
    ],
  },
  haki_brand: {
    id: 'haki_brand',
    name: 'Pendaftaran Merek (HAKI)',
    category: 'legalitas',
    price: 2590000,
    originalPrice: 5180000,
    discountPct: 50,
    priceUnit: '/ merek',
    description: 'Perlindungan hak cipta nama brand & logo resmi di DJKI.',
    iconName: 'ShieldCheck',
    features: [
      'Analisis & Pengecekan Potensi Kelulusan Merek',
      'Pendaftaran Sertifikat Merek Resmi DJKI',
      'Proteksi Hak Cipta Nama Usaha & Logo Brand',
      'Surat Pengusulan Rekomendasi Dinas UMKM',
      'Garansi Re-Apply Jika Ada Masalah Teknis',
    ],
  },
  branding_kit: {
    id: 'branding_kit',
    name: 'Branding & Marketing Kit',
    category: 'website',
    price: 1750000,
    originalPrice: 3500000,
    discountPct: 50,
    priceUnit: '/ paket',
    description: 'Identitas visual profesional untuk media sosial & kemasan produk.',
    iconName: 'Palette',
    features: [
      'Desain Logo Vector + Master File (PNG, SVG)',
      '12 Template Feed Instagram (Canva editable)',
      'Desain Label Stiker / Kemasan Produk',
      'Brand Palette & Font Guide',
    ],
  },
  socmed_ads: {
    id: 'socmed_ads',
    name: 'Kelola Socmed & Ads',
    category: 'website',
    price: 2450000,
    originalPrice: 4900000,
    discountPct: 50,
    priceUnit: '/ bulan',
    description: 'Manajemen konten Instagram/TikTok & Iklan Berbayar.',
    iconName: 'Megaphone',
    features: [
      '15 Content Feed + Video Reels / TikTok',
      'Riset Caption, Copywriting & Hashtag Viral',
      'Setup & Optimization Meta Ads / TikTok Ads',
      'Laporan Analytics Performa Iklan Bulanan',
      'Dedicated Social Media Specialist',
    ],
  },
  bundling_allinone: {
    id: 'bundling_allinone',
    name: 'Paket Akselerasi All-In-One',
    category: 'bundling',
    price: 5458600,
    originalPrice: 10917200,
    discountPct: 50,
    priceUnit: '/ paket komplit',
    description: 'Website + POS Kasir 1 Thn + Legalitas NIB/Halal + Branding Kit.',
    badge: 'Paling Komplit',
    badgeType: 'best',
    iconName: 'Layers',
    popular: true,
    features: [
      'Website Pro + Domain Gratis 1 Tahun',
      'RajaKas POS Kasir Full License 1 Tahun',
      'Legalitas NIB RBA & Pendampingan Halal',
      'Kit Branding Logo & Feeds Sosial Media',
      'Pendampingan Prioritas 3 Bulan',
    ],
  },
  pengadaan_it: {
    id: 'pengadaan_it',
    name: 'Pengadaan Komputer & Jaringan Kantor',
    category: 'pos',
    price: 4850000,
    originalPrice: 9700000,
    discountPct: 50,
    priceUnit: '/ paket setup',
    description: 'Pengadaan PC/Laptop kantor, router Wi-Fi bisnis, printer & instalasi LAN.',
    badge: 'Pengadaan Kantor',
    badgeType: 'hardware',
    iconName: 'Printer',
    features: [
      'Setup Unit PC / Laptop Kerja Siap Pakai OS Resmi',
      'Instalasi Router & Jaringan LAN / Wi-Fi Kantor Cepat',
      'Printer Multifungsi (Print, Scan, Copy) & Scanner',
      'Software Office & Antivirus Berlisensi Resmi',
      'Garansi Hardware & Dukungan Teknisi Standby',
    ],
  },
  custom_system: {
    id: 'custom_system',
    name: 'Custom Software & Sistem Usaha',
    category: 'website',
    price: 6500000,
    originalPrice: 13000000,
    discountPct: 50,
    priceUnit: '/ modul awal',
    description: 'Pengembangan software khusus, ERP mini, sistem inventaris & invoice terintegrasi.',
    badge: 'Custom Solution',
    badgeType: 'super',
    iconName: 'Zap',
    features: [
      'Analisis Kebutuhan Sistem & Workflow Bisnis Anda',
      'Dashboard Manajemen Multi-User & Hak Akses Bertingkat',
      'Modul Inventaris, Pembukuan & Laporan Ekspor Excel/PDF',
      'Deployment Cloud Server Cepat, Aman & Backup Otomatis',
      'Pelatihan Tim & Maintenance Support Prioritas',
    ],
  },
};

export const ARTICLES_DATA: Record<string, Article> = {
  art_1: {
    id: 'art_1',
    title: 'Panduan Lengkap Mengurus NIB untuk UMKM Kuliner & Ritel di 2026',
    category: 'legalitas',
    categoryLabel: 'Legalitas',
    date: '12 Juli 2026',
    readTime: '5 Min baca',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
    excerpt: 'NIB adalah kunci untuk membuka akses perbankan, perizinan edar, dan tender pemerintah. Ketahui syarat terbaru dan alur daftar OSS RBA.',
    author: 'Tim BinaUsaha Legal',
    authorRole: 'Konsultan Perizinan Bisnis',
    featured: true,
    views: 3420,
    tags: ['NIB RBA', 'OSS', 'Legalitas UMKM', 'Izin Usaha'],
    contentHtml: `
      <p>Mempunyai Nomor Induk Berusaha (NIB) merupakan hal mendasar yang wajib dimiliki setiap pemilik usaha di Indonesia. Sesuai PP No. 5 Tahun 2021 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko, NIB tidak hanya berfungsi sebagai identitas tunggal pelaku usaha, tetapi juga menggantikan Tanda Daftar Perusahaan (TDP), Angka Pengenal Impor (API), serta hak akses kepabeanan.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Mengapa NIB Sangat Krusial untuk Usaha Anda?</h4>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
        <li><b>Kemudahan Akses Perbankan & KUR:</b> Bank mewajibkan NIB sebagai syarat utama pengajuan Kredit Usaha Rakyat dan rekening giro perusahaan.</li>
        <li><b>Legalitas Tempat Usaha:</b> Menghindarkan tempat usaha dari penertiban izin operasional dinas tata ruang dan perizinan terpadu.</li>
        <li><b>Syarat Sertifikasi Halal & BPOM:</b> Seluruh pengajuan sertifikat halal BPJPH dan izin edar BPOM wajib mencantumkan nomor NIB yang aktif.</li>
        <li><b>Akses Bantuan & Pelatihan Pemerintah:</b> Terdaftar resmi dalam database kementerian Koperasi & UMKM.</li>
      </ul>

      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Langkah Mengurus NIB melalui OSS RBA:</h4>
      <ol class="list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
        <li>Siapkan KTP/NIK, NPWP pribadi/badan, dan Email aktif penanggung jawab usaha.</li>
        <li>Buka portal oss.go.id dan pilih Pendaftaran Hak Akses Usaha Mikro dan Kecil (UMK).</li>
        <li>Pilih kode Klasifikasi Baku Lapangan Usaha Indonesia (KBLI 2020) yang sesuai dengan produk atau jasa utama Anda.</li>
        <li>Lengkapi data modal usaha, estimasi tenaga kerja, dan alamat fisik lokasi kegiatan operasional.</li>
        <li>Verifikasi pernyataan komitmen mandiri (tata ruang, lingkungan SPPL, K3).</li>
        <li>Unduh & cetak dokumen NIB ber-QR Code resmi Kementerian Investasi/BKPM.</li>
      </ol>
      
      <p class="mt-4">Jika Anda tidak memiliki waktu mengurus sistem OSS atau bingung menentukan kode KBLI yang tepat, tim konsultan BinaUsaha siap membantu pengurusan NIB RBA usaha Anda tuntas dalam 3-5 hari kerja.</p>
    `,
  },
  art_2: {
    id: 'art_2',
    title: '5 Alasan Mengapa Bisnis Anda Wajib Punya Website Sendiri di Era Digital',
    category: 'digital',
    categoryLabel: 'Digital & Website',
    date: '08 Juli 2026',
    readTime: '4 Min baca',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    excerpt: 'Mengandalkan sosmed saja memiliki risiko algoritma. Pelajari bagaimana website meningkatkan kepercayaan pelanggan dan omset penjualan.',
    author: 'Tim BinaUsaha Digital',
    authorRole: 'Web & Growth Specialist',
    featured: true,
    views: 2890,
    tags: ['Website Bisnis', 'Digital Marketing', 'Toko Online', 'SEO Local'],
    contentHtml: `
      <p>Banyak pengusaha beranggapan bahwa memiliki akun media sosial sudah cukup untuk berjualan. Padahal, media sosial adalah "rumah sewa" yang peraturannya bisa berubah sewaktu-waktu karena algoritma. Website adalah "properti digital mandiri" milik bisnis Anda sepenuhnya.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Keuntungan Memiliki Website Toko Mandiri:</h4>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
        <li><b>Kredibilitas & Trust Tinggi:</b> Pelanggan 3x lebih percaya pada brand yang memiliki website berdomain resmi (.id / .co.id / .com) dibanding sekadar katalog linktree gratisan.</li>
        <li><b>Toko Buka 24 Jam Nonstop:</b> Konsumen bisa menjelajah katalog produk, melihat testimoni, dan checkout langsung via WhatsApp secara otomatis setiap saat.</li>
        <li><b>Bebas Potongan Biaya Admin Komisi:</b> Berjualan melalui website mandiri memberikan margin laba 100% tanpa potongan 5-15% seperti di platform marketplace.</li>
        <li><b>Membangun Database Pelanggan:</b> Anda mengumpulkan data kontak pelanggan secara aman untuk retargeting promosi WhatsApp dan email marketing.</li>
      </ul>

      <p class="mt-4">BinaUsaha menyediakan paket Website UMKM Pro siap pakai dengan desain profesional responsif, SSL keamanan, domain gratis 1 tahun, dan tombol pesan cepat WhatsApp terintegrasi.</p>
    `,
  },
  art_3: {
    id: 'art_3',
    title: 'Cara Memisahkan Uang Pribadi dan Uang Usaha Tanpa Pusing',
    category: 'keuangan',
    categoryLabel: 'Keuangan',
    date: '02 Juli 2026',
    readTime: '6 Min baca',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
    excerpt: 'Kesalahan fatal pebisnis pemula adalah mencampur aduk dana. Berikut tips dan trik sederhana untuk menata arus kas harian.',
    author: 'Tim BinaUsaha Finansial',
    authorRole: 'Konsultan Keuangan UMKM',
    views: 2150,
    tags: ['Arus Kas', 'Manajemen Keuangan', 'Aplikasi POS', 'Laba Rugi'],
    contentHtml: `
      <p>Banyak UMKM yang penjualannya ramai namun ketika akhir bulan pemiliknya bingung karena tidak ada sisa uang kas. Penyebab utamanya adalah tercampurnya rekening dompet pribadi dengan uang modal operasional usaha.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">3 Langkah Disiplin Keuangan UMKM:</h4>
      <ol class="list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
        <li><b>Buka rekening khusus bisnis:</b> Pisahkan secara tegas rekening pembayaran konsumen dan pembayaran ke supplier dari rekening kebutuhan keluarga.</li>
        <li><b>Gaji diri sendiri secara konsisten:</b> Tentukan nominal gaji tetap tiap bulan dan jangan mengambil kas harian sembarangan untuk keperluan pribadi.</li>
        <li><b>Gunakan sistem kasir digital otomatis:</b> Catat setiap uang masuk dan keluar secara real-time menggunakan aplikasi POS seperti RajaKas. Hindari pencatatan manual di kertas yang mudah tercecer.</li>
      </ol>

      <p class="mt-4">Dengan laporan keuangan yang rapi dan transparan, Anda dapat dengan mudah mengajukan permodalan usaha ke perbankan dan memantau laba bersih harian toko Anda.</p>
    `,
  },
  art_4: {
    id: 'art_4',
    title: 'Strategi Iklan Instagram & TikTok Ads yang Efektif untuk UMKM Budget Terbatas',
    category: 'pemasaran',
    categoryLabel: 'Pemasaran',
    date: '28 Juni 2026',
    readTime: '5 Min baca',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    excerpt: 'Jangan buang budget iklan Anda percuma! Pelajari formula konten hook 3 detik, targeting lokal, dan optimasi konversi WhatsApp.',
    author: 'Tim BinaUsaha Digital',
    authorRole: 'Meta & TikTok Ads Specialist',
    views: 1980,
    tags: ['Instagram Ads', 'TikTok Ads', 'Pemasaran Digital', 'Lead Gen'],
    contentHtml: `
      <p>Banyak pemilik bisnis merasa kapok beriklan di Meta Ads atau TikTok karena sudah menghabiskan ratusan ribu namun minim penjualan. Rahasianya bukan pada besaran budget, melainkan pada relevansi konten dan targeting audiens yang tepat.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Formula Iklan Berbayar Berkonversi Tinggi:</h4>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
        <li><b>Hook 3 Detik Pertama:</b> Tampilkan langsung masalah yang dialami calon pembeli atau hasil memukau dari produk Anda dalam 3 detik awal video.</li>
        <li><b>Targeting Radius Lokal:</b> Untuk bisnis kuliner dan retail fisik, batasi penayangan iklan dalam radius 3-7 km dari outlet Anda agar konversi lebih padat.</li>
        <li><b>Call to Action (CTA) Jelas:</b> Arahkan penonton langsung ke tombol chat WhatsApp atau halaman website promo dengan penawaran gratis ongkir/diskon terbatas.</li>
      </ul>

      <p class="mt-4">Ingin tim profesional yang mengatur strategi konten dan iklan bisnis Anda? Manfaatkan layanan Kelola Socmed & Ads dari BinaUsaha untuk hasil yang terukur.</p>
    `,
  },
  art_5: {
    id: 'art_5',
    title: 'Bedah Perbedaan PT Perorangan, PT Biasa, dan CV: Mana yang Tepat untuk Anda?',
    category: 'legalitas',
    categoryLabel: 'Legalitas',
    date: '20 Juni 2026',
    readTime: '7 Min baca',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&h=400&fit=crop',
    excerpt: 'Pahami konsekuensi hukum, pemisahan harta pribadi, dan batasan modal sebelum memilih bentuk badan usaha yang legal.',
    author: 'Tim BinaUsaha Legal',
    authorRole: 'Konsultan Hukum Bisnis',
    views: 3100,
    tags: ['PT Perorangan', 'PT Biasa', 'Pendirian CV', 'Hukum Bisnis'],
    contentHtml: `
      <p>Memilih badan hukum yang tepat merupakan pondasi jangka panjang. Banyak pengusaha bingung antara mendirikan PT Biasa, PT Perorangan, atau CV.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Ringkasan Perbandingan Badan Usaha:</h4>
      <div class="overflow-x-auto my-2">
        <table class="w-full text-left text-xs border border-slate-200 rounded-lg">
          <thead class="bg-slate-100 font-bold text-slate-900">
            <tr>
              <th class="p-2 border-b">Kriteria</th>
              <th class="p-2 border-b">PT Biasa</th>
              <th class="p-2 border-b">PT Perorangan</th>
              <th class="p-2 border-b">CV</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700">
            <tr>
              <td class="p-2 font-medium">Jumlah Pendiri</td>
              <td class="p-2">Minimal 2 orang</td>
              <td class="p-2">Cukup 1 orang (WNI)</td>
              <td class="p-2">Minimal 2 orang</td>
            </tr>
            <tr>
              <td class="p-2 font-medium">Status Harta</td>
              <td class="p-2 text-emerald-600 font-bold">Terpisah dari pribadi</td>
              <td class="p-2 text-emerald-600 font-bold">Terpisah dari pribadi</td>
              <td class="p-2 text-amber-600">Menyatu (tanggung renteng)</td>
            </tr>
            <tr>
              <td class="p-2 font-medium">Pengesahan</td>
              <td class="p-2">Akta Notaris & SK Kemenkumham</td>
              <td class="p-2">Pernyataan Online AHU</td>
              <td class="p-2">Akta Notaris & SKT Kemenkumham</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="mt-4">BinaUsaha menyediakan paket pendirian PT Pro lengkap dengan SK Kemenkumham, NPWP Badan, NIB OSS, dan bonus software keuangan gratis seumur hidup.</p>
    `,
  },
  art_6: {
    id: 'art_6',
    title: 'Standar Operasional Prosedur (SOP) Toko Ritel: Kunci Sukses Delegasi Karyawan',
    category: 'operasional',
    categoryLabel: 'Operasional',
    date: '15 Juni 2026',
    readTime: '6 Min baca',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop',
    excerpt: 'Ingin toko tetap berjalan rapi tanpa harus Anda tunggu setiap hari? Susun SOP pembukaan, stok opname, dan pelayanan pelanggan.',
    author: 'Tim BinaUsaha Konsultan',
    authorRole: 'Operasional & Manufaktur',
    views: 1640,
    tags: ['SOP Toko', 'Manajemen Karyawan', 'Stok Opname', 'Operasional'],
    contentHtml: `
      <p>Banyak pemilik toko terjebak bekerja 14 jam sehari karena seluruh keputusan bergantung pada dirinya. Untuk mengembangkan cabang baru, Anda wajib memiliki Standard Operating Procedure (SOP) tertulis yang dipahami seluruh tim.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">4 SOP Utama yang Wajib Diterapkan:</h4>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
        <li><b>SOP Opening & Closing Kasir:</b> Hitung modal awal kas kecil, cetak laporan Z harian, dan setorkan uang fisik ke brankas/bank.</li>
        <li><b>SOP Penerimaan Barang Masuk:</b> Cek kesesuaian faktur surat jalan supplier dengan jumlah fisik dan kondisi fisik produk.</li>
        <li><b>SOP Pelayanan Pelanggan (Service Excellence):</b> Senyum, salam, sapa, dan penawaran up-selling produk promo di meja kasir.</li>
        <li><b>SOP Stok Opname Mingguan:</b> Bandingkan jumlah stok aktual di rak dengan data sistem POS untuk mencegah selisih atau kehilangan barang.</li>
      </ul>

      <p class="mt-4">Dengan mengintegrasikan SOP bersama software kasir RajaKas POS, pemilik usaha dapat memantau aktivitas penjualan dan inventori secara real-time dari handphone.</p>
    `,
  },
  art_7: {
    id: 'art_7',
    title: 'Panduan Praktis Sertifikasi Halal Self-Declare untuk Makanan & Minuman',
    category: 'legalitas',
    categoryLabel: 'Legalitas',
    date: '10 Juni 2026',
    readTime: '5 Min baca',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    excerpt: 'Pemerintah mewajibkan sertifikasi halal bagi seluruh produk makanan dan minuman. Ketahui syarat bahan dan alur pendampingan BPJPH.',
    author: 'Tim BinaUsaha Halal',
    authorRole: 'Pendamping Proses Produk Halal',
    views: 2430,
    tags: ['Sertifikasi Halal', 'BPJPH', 'Kuliner Halal', 'Self Declare'],
    contentHtml: `
      <p>Sertifikat Halal bukan lagi sekadar label keagamaan, melainkan syarat perizinan resmi dan keunggulan kompetitif yang meningkatkan rasa percaya jutaan konsumen di Indonesia.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Syarat Program Halal Self-Declare:</h4>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
        <li>Memiliki Nomor Induk Berusaha (NIB) berbasis risiko mikro atau kecil.</li>
        <li>Produk tidak berisiko tinggi (misal: produk olahan daging sembelihan memerlukan skema reguler).</li>
        <li>Bahan baku yang digunakan sudah memiliki sertifikat halal atau merupakan bahan alam yang sudah dipastikan kehalalannya (positive list).</li>
        <li>Memiliki proses produksi yang bersih, higienis, dan terbebas dari kontaminasi zat non-halal.</li>
      </ul>

      <p class="mt-4">BinaUsaha mendampingi Anda dari penyusunan Manual Sistem Jaminan Produk Halal (SJPH), verifikasi bahan di SiHalal BPJPH, hingga sertifikat resmi terbit.</p>
    `,
  },
  art_8: {
    id: 'art_8',
    title: 'Kiat Membangun Brand Identity yang Berkesan dengan Modal Terjangkau',
    category: 'pemasaran',
    categoryLabel: 'Pemasaran',
    date: '04 Juni 2026',
    readTime: '5 Min baca',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop',
    excerpt: 'Brand bukan cuma logo! Pelajari cara menentukan persona brand, palet warna, tipografi, dan packaging yang membuat produk Anda naik kelas.',
    author: 'Tim BinaUsaha Kreatif',
    authorRole: 'Brand Designer',
    views: 1820,
    tags: ['Branding Kit', 'Desain Kemasan', 'Logo Usaha', 'Identitas Visual'],
    contentHtml: `
      <p>Mengapa dua cangkir kopi dengan biji yang sama bisa dijual dengan harga Rp 5.000 dan Rp 35.000? Kuncinya terletak pada kekuatan branding dan persepsi nilai yang dirasakan konsumen.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Langkah Membangun Identitas Brand UMKM:</h4>
      <ol class="list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
        <li><b>Tentukan USP (Unique Selling Proposition):</b> Apa satu alasan kuat mengapa orang harus membeli dari Anda dan bukan dari kompetitor?</li>
        <li><b>Gunakan Warna yang Konsisten:</b> Batasi palet visual brand maksimal 2-3 warna utama di kemasan, banner, feed Instagram, dan seragam karyawan.</li>
        <li><b>Desain Kemasan yang Aesthetic & Fungsional:</b> Kemasan yang menarik sering difoto dan diunggah secara sukarela oleh pelanggan ke media sosial (free organic marketing).</li>
        <li><b>Daftarkan Hak Merek (HAKI) ke DJKI:</b> Lindungi nama dan logo Anda sebelum ditiru atau didahului pihak lain.</li>
      </ol>

      <p class="mt-4">Dapatkan paket Branding & Marketing Kit lengkap dari BinaUsaha untuk meremajakan citra visual produk Anda.</p>
    `,
  },
  art_9: {
    id: 'art_9',
    title: 'Strategi Scale Up UMKM: Kapan Waktu yang Tepat Buka Cabang Baru?',
    category: 'skala-usaha',
    categoryLabel: 'Skala Usaha',
    date: '28 Mei 2026',
    readTime: '8 Min baca',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    excerpt: 'Jangan terburu-buru ekspansi sebelum 4 indikator kesehatan bisnis ini terpenuhi. Simak checklist kelayakan sebelum membuka cabang kedua.',
    author: 'Tim BinaUsaha Konsultan',
    authorRole: 'Business Growth Advisor',
    views: 2280,
    tags: ['Scale Up', 'Ekspansi Bisnis', 'Buka Cabang', 'Franchise'],
    contentHtml: `
      <p>Banyak pengusaha terburu-buru membuka cabang baru saat toko pertama sedang ramai, namun berakhir menutup kedua toko karena kas tersedot dan tim kewalahan. Ekspansi membutuhkan kesiapan sistem, bukan hanya euforia.</p>
      
      <h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Checklist Kelayakan Buka Cabang Baru:</h4>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
        <li><b>Toko Pertama Sudah Profit Konsisten Minimal 6 Bulan:</b> Cash flow operasional stabil tanpa suntikan modal pribadi tambahan.</li>
        <li><b>Bisnis Bisa Berjalan Tanpa Kehadiran Pemilik:</b> Anda sudah memiliki manajer atau supervisor terlatih yang memegang SOP harian.</li>
        <li><b>Sistem Supply Chain & Gudang Sudah Siap:</b> Pasokan bahan baku untuk multi-outlet sudah terpusat dan memiliki kontrak harga grosir tetap.</li>
        <li><b>Sistem IT Terintegrasi Multi-Outlet:</b> Gunakan software kasir cloud POS yang dapat memantau omzet seluruh cabang dalam satu dashboard.</li>
      </ul>

      <p class="mt-4">Konsultasikan rencana ekspansi dan transformasi digital multi-cabang usaha Anda bersama konsultan senior BinaUsaha.</p>
    `,
  },
};

export const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq1',
    category: 'pengerjaan legalitas',
    badge: 'PT',
    question: 'Berapa lama proses pengerjaan Pendirian PT Pro dan NIB?',
    answerHtml: 'Proses pendirian PT Pro di BinaUsaha membutuhkan waktu sekitar <strong>5 - 7 hari kerja</strong> setelah draft akta disetujui para pendiri dan kelengkapan dokumen identitas diserahkan. Untuk pengurusan NIB RBA dan Sertifikat Halal Self-Declare biasanya selesai lebih cepat dalam <strong>3 - 5 hari kerja</strong>.',
  },
  {
    id: 'faq2',
    category: 'legalitas',
    badge: '🎁',
    highlight: true,
    question: 'Apakah promo Gratis Aplikasi System Keuangan di Paket PT Pro benar-benar tanpa biaya tambahan?',
    answerHtml: '<strong>Ya, 100% Benar!</strong> Khusus pemesanan Paket Pendirian PT Pro, Anda mendapatkan lisensi penuh Aplikasi System Keuangan UMKM (Pencatatan Kas, Pemasukan, Pengeluaran & Laba Rugi senilai Rp 2.100.000) secara GRATIS tanpa langganan bulanan maupun biaya tersembunyi.',
  },
  {
    id: 'faq3',
    category: 'legalitas',
    badge: 'DOC',
    question: 'Apa saja syarat dokumen awal yang dibutuhkan untuk mendirikan PT?',
    answerHtml: 'Anda hanya perlu menyiapkan:<ul class="list-disc ml-5 mt-2 space-y-1"><li>KTP & NPWP para pendiri PT (minimal 2 orang untuk PT Biasa / 1 orang untuk PT Perorangan)</li><li>3 Pilihan Nama PT (terdiri dari 3 kata berbahasa Indonesia)</li><li>Alamat domisili usaha</li></ul>Tim konsultan kami yang menangani penyusunan KBLI, draft Akta Notaris, SK Kemenkumham, NPWP Perusahaan, hingga NIB RBA.',
  },
  {
    id: 'faq4',
    category: 'website',
    badge: 'WEB',
    question: 'Apakah pembuatan Website UMKM Pro sudah termasuk Domain & Hosting?',
    answerHtml: '<strong>Sudah lengkap All-In-One!</strong> Setiap pembuatan Website UMKM Pro sudah mencakup domain <code>.com</code> atau <code>.id</code> gratis selama 1 tahun, cloud hosting berkecepatan tinggi, sertifikat SSL keamanan (HTTPS), desain toko online responsif, serta integrasi checkout langsung ke nomor WhatsApp bisnis Anda.',
  },
  {
    id: 'faq5',
    category: 'website',
    badge: 'POS',
    question: 'Perangkat apa saja yang bisa digunakan untuk Kasir Digital RajaKas POS?',
    answerHtml: 'Aplikasi RajaKas POS berbasis Cloud dan fleksibel digunakan di berbagai perangkat: <strong>Smartphone Android, Tablet, iPad, maupun Laptop/PC Browser</strong>. Mendukung pula koneksi printer thermal Bluetooth untuk cetak struk nota belanja langsung di toko.',
  },
  {
    id: 'faq6',
    category: 'pembayaran',
    badge: 'PAY',
    question: 'Metode pembayaran apa saja yang diterima? Bisakah DP 50%?',
    answerHtml: 'Kami menerima pembayaran melalui <strong>Transfer Bank (BCA, Mandiri, BRI, BNI), QRIS Instan, e-Wallet (GoPay, OVO, Dana)</strong>, serta Kartu Kredit. Untuk sebagian besar paket layanan, kami juga menyediakan skema <strong>DP (Down Payment) 50%</strong> di awal dan pelunasan saat pengerjaan selesai.',
  },
  {
    id: 'faq7',
    category: 'pembayaran',
    badge: 'GAR',
    question: 'Apakah ada garansi revisi dan pendampingan setelah layanan selesai?',
    answerHtml: '<strong>Tentu saja ada!</strong> Setiap layanan di BinaUsaha dilengkapi garansi pendampingan dan revisi (3 - 6 bulan tergantung paket yang dipilih). Tim support teknis kami siap membantu jika ada kendala sistem, kendala hosting, atau penyesuaian dokumen.',
  },
  {
    id: 'faq8',
    category: 'pengerjaan',
    badge: 'TRK',
    question: 'Bagaimana cara melacak progress status pesanan saya secara real-time?',
    answerHtml: 'Anda dapat memeriksa posisi pengerjaan pesanan kapan saja dengan mengeklik menu <strong>"Cek Pesanan"</strong> di menu navigasi bagian atas website ini. Cukup masukkan ID Order Anda (misal: <code>BU-10293</code>) atau Nomor WhatsApp yang terdaftar.',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Owner, Kopi Nusantara Group',
    initials: 'BS',
    gradient: 'from-blue-600 to-indigo-700',
    package: 'Paket PT Pro & App Keuangan',
    packageIcon: 'CheckCircle2',
    packageClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    review: '"Pengurusan Akta PT dan NIB sangat cepat hanya 5 hari selesai. Bonus aplikasi keuangan dari BinaUsaha sangat membantu memantau omset 3 cabang kedai kopi saya secara real-time tanpa pusing!"',
    rating: 5.0,
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    role: 'Owner, Resto Dapur Halal Mama',
    initials: 'SR',
    gradient: 'from-emerald-500 to-teal-700',
    package: 'NIB & Sertifikat Halal',
    packageIcon: 'Stamp',
    packageClass: 'bg-green-50 text-green-700 border-green-100',
    review: '"BinaUsaha mendampingi proses sertifikasi Halal dan NIB RBA usaha kuliner saya dari awal sampai sertifikat resmi terbit. Sangat transparan, tepat waktu, dan staf konsultannya ramah banget!"',
    rating: 5.0,
  },
  {
    id: 3,
    name: 'Hendra Wijaya',
    role: 'Founder, Toko Sembako Jaya',
    initials: 'HW',
    gradient: 'from-purple-600 to-indigo-800',
    package: 'Hardware Set Kasir POS',
    packageIcon: 'Store',
    packageClass: 'bg-purple-50 text-purple-700 border-purple-100',
    review: '"Hardware Set Kasir RajaKas POS sampai di Surabaya cepat dan aman. Printer Bluetooth dan laci kasir tinggal colok langsung pakai. Struk transaksi jadi rapi dan persediaan stok selalu up to date."',
    rating: 5.0,
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    role: 'Owner, Fashion Hijab Elegance',
    initials: 'DL',
    gradient: 'from-pink-500 to-rose-700',
    package: 'Website UMKM Pro',
    packageIcon: 'Globe',
    packageClass: 'bg-blue-50 text-primary border-blue-100',
    review: '"Desain website toko online saya kelihatan mewah dan cepat sekali diakses dari HP. Tombol beli langsung terhubung ke WhatsApp CS, bikin konversi pembeli online meningkat pesat!"',
    rating: 5.0,
  },
  {
    id: 5,
    name: 'Ahmad Rizky',
    role: 'Founder, SneakerCare Semarang',
    initials: 'AR',
    gradient: 'from-cyan-600 to-blue-800',
    package: 'Pendaftaran Merek DJKI (HAKI)',
    packageIcon: 'ShieldCheck',
    packageClass: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    review: '"Akhirnya nama brand dan logo usaha jasa cuci sepatu saya aman terdaftar HAKI di DJKI via BinaUsaha. Pengecekan awal potensi kelulusan sangat mendalam sehingga tidak khawatir ditolak."',
    rating: 5.0,
  },
  {
    id: 6,
    name: 'Maya Indah',
    role: 'CEO, Keripik Renyah Organik',
    initials: 'MI',
    gradient: 'from-amber-500 to-orange-700',
    package: 'Paket Akselerasi All-In-One',
    packageIcon: 'Zap',
    packageClass: 'bg-amber-50 text-amber-800 border-amber-200',
    review: '"Ambil Paket Akselerasi All-In-One. Semua terintegrasi dari website, sistem kasir, hingga izin operasional. BinaUsaha adalah partner terbaik buat pengusaha yang mau skala usahanya naik tingkat."',
    rating: 5.0,
  },
];

export const CATEGORIES_MARQUEE = [
  {
    id: 'digital',
    name: 'Digital & Teknologi',
    desc: 'Pengadaan hardware IT, komputer kantor, website bisnis, aplikasi custom, hosting & domain, digital marketing, jaringan internet, CCTV, serta infrastruktur teknologi usaha.',
    colorBg: 'bg-blue-100',
    colorText: 'text-primary',
    hoverBorder: 'hover:border-primary/40',
    hoverBg: 'group-hover:bg-primary',
    btnText: 'Ajukan Kebutuhan Digital',
    icon: 'Laptop',
  },
  {
    id: 'legalitas',
    name: 'Legalitas & Administrasi',
    desc: 'Pendirian PT, CV, Yayasan, Koperasi, pengurusan NIB RBA, perizinan berusaha, sertifikasi halal, pendaftaran merek HAKI, serta dokumen administrasi hukum bisnis.',
    colorBg: 'bg-emerald-100',
    colorText: 'text-emerald-700',
    hoverBorder: 'hover:border-emerald-500/40',
    hoverBg: 'group-hover:bg-emerald-600',
    btnText: 'Ajukan Kebutuhan Legalitas',
    icon: 'FileCheck',
  },
  {
    id: 'konstruksi',
    name: 'Konstruksi & Perlengkapan',
    desc: 'Pengadaan bahan bangunan, peralatan konstruksi, furniture kantor, rak & etalase toko, serta perlengkapan fisik operasional tempat usaha.',
    colorBg: 'bg-amber-100',
    colorText: 'text-amber-700',
    hoverBorder: 'hover:border-amber-500/40',
    hoverBg: 'group-hover:bg-amber-600',
    btnText: 'Ajukan Kebutuhan Konstruksi',
    icon: 'HardHat',
  },
  {
    id: 'agro',
    name: 'Agro & Green Industry',
    desc: 'Pengadaan bibit tanaman unggul, pupuk organik/kimia, alat pertanian, peralatan perkebunan, instalasi hidroponik, serta pembuatan penataan landscape.',
    colorBg: 'bg-green-100',
    colorText: 'text-green-700',
    hoverBorder: 'hover:border-green-500/40',
    hoverBg: 'group-hover:bg-green-600',
    btnText: 'Ajukan Kebutuhan Agro',
    icon: 'Sprout',
  },
];

export const BUSINESS_MATRIX = [
  {
    id: 'memulai-usaha',
    title: 'Memulai Usaha Baru',
    desc: 'Butuh perizinan legalitas awal (NIB/PT), pembuatan website profil, pendaftaran logo/brand, hingga pembuatan kasir toko.',
    linkText: 'Ajukan Paket Rintisan',
    icon: 'Rocket',
    bgIcon: 'bg-blue-50 text-primary',
    textColor: 'text-primary',
    categoryKey: 'legalitas',
  },
  {
    id: 'digitalisasi',
    title: 'Digitalisasi & Sistem Bisnis',
    desc: 'Butuh sistem kasir POS, katalog produk online terintegrasi WhatsApp, rekap keuangan otomatis, dan pengadaan komputer.',
    linkText: 'Ajukan Solusi Digital',
    icon: 'Cpu',
    bgIcon: 'bg-indigo-50 text-indigo-600',
    textColor: 'text-indigo-600',
    categoryKey: 'digital',
  },
  {
    id: 'renovasi',
    title: 'Renovasi / Buka Tempat Usaha',
    desc: 'Butuh suplai bahan bangunan, perkakas konstruksi, rak/etalase, furniture kantor, serta sistem pengawasan CCTV.',
    linkText: 'Ajukan Suplai Material',
    icon: 'Building',
    bgIcon: 'bg-amber-50 text-amber-700',
    textColor: 'text-amber-700',
    categoryKey: 'konstruksi',
  },
  {
    id: 'kantor',
    title: 'Mengurus Perizinan & Legalitas',
    desc: 'Butuh perubahan akta PT/CV, perpanjangan NIB, sertifikasi halal produk makanan/minuman, hingga pendaftaran hak cipta merek.',
    linkText: 'Ajukan Urus Perizinan',
    icon: 'ShieldCheck',
    bgIcon: 'bg-emerald-50 text-emerald-700',
    textColor: 'text-emerald-700',
    categoryKey: 'legalitas',
  },
  {
    id: 'pertanian',
    title: 'Sektor Pertanian & Hijau',
    desc: 'Butuh bibit unggul, pupuk berkualitas, sistem irigasi/hidroponik, alat perkebunan, serta pembuatan lanskap hijau.',
    linkText: 'Ajukan Kebutuhan Agro',
    icon: 'Leaf',
    bgIcon: 'bg-green-50 text-green-700',
    textColor: 'text-green-700',
    categoryKey: 'agro',
  },
  {
    id: 'proyek',
    title: 'Proyek & Pengadaan Khusus',
    desc: 'Butuh penyedia jasa/barang terverifikasi untuk pengadaan instansi, tender swasta, atau volume kebutuhan skala sedang-besar.',
    linkText: 'Ajukan Penawaran Proyek',
    icon: 'Layers',
    bgIcon: 'bg-purple-50 text-purple-700',
    textColor: 'text-purple-700',
    categoryKey: 'pengadaan',
  },
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Temukan kebutuhan Anda',
    desc: 'Cari produk, jasa, atau solusi yang Anda butuhkan melalui katalog atau matriks kebutuhan.',
    badge: 'Eksplorasi Solusi',
    icon: 'Search',
    color: 'bg-primary',
  },
  {
    step: '02',
    title: 'Ajukan kebutuhan',
    desc: 'Kirim detail kebutuhan melalui formulir BinaUsaha untuk dikurasi tim spesialis.',
    badge: 'Kirim Formulir',
    icon: 'Send',
    color: 'bg-blue-600',
  },
  {
    step: '03',
    title: 'Kami mencarikan solusi',
    desc: 'BinaUsaha menghubungkan kebutuhan Anda dengan mitra penyedia yang sesuai.',
    badge: 'Kurasi Mitra',
    icon: 'RefreshCw',
    color: 'bg-indigo-600',
  },
  {
    step: '04',
    title: 'Terima penawaran',
    desc: 'BinaUsaha membantu proses penawaran berdasarkan kebutuhan spesifik Anda.',
    badge: 'Penawaran Transparan',
    icon: 'FileText',
    color: 'bg-purple-600',
  },
  {
    step: '05',
    title: 'Proses pemenuhan',
    desc: 'Setelah disepakati, produk atau jasa dipenuhi oleh mitra terkait secara terkawal.',
    badge: 'Pemenuhan Selesai',
    icon: 'CheckCircle',
    color: 'bg-emerald-600',
  },
];
