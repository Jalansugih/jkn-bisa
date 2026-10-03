import React from 'react';
import { LegalPageLayout, LegalKind, LegalSection } from './LegalPageLayout';
import { LEGAL_INFO } from '../../data/legalInfo';

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
  onNavigate: (kind: LegalKind) => void;
}

const { entityName, website, address } = LEGAL_INFO;

const SECTIONS: LegalSection[] = [
  {
    id: 'pendahuluan',
    title: 'Pendahuluan',
    blocks: [
      {
        type: 'p',
        text: `Kebijakan Privasi ini menjelaskan bagaimana ${entityName} (“BinaUsaha”, “kami”) mengumpulkan, menggunakan, menyimpan, membagikan, dan melindungi data pribadi Anda ketika Anda mengunjungi ${website}, membuat akun, memesan layanan, mengisi formulir konsultasi atau permintaan penawaran, dan mengikuti program referral.`,
      },
      {
        type: 'p',
        text: 'Kami memproses data pribadi sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) dan peraturan terkait di Indonesia. Dengan menggunakan layanan kami, Anda menyatakan telah membaca kebijakan ini. Jika Anda tidak menyetujuinya, mohon hentikan penggunaan layanan kami.',
      },
      {
        type: 'note',
        text: '**Ringkasnya:** kami hanya meminta data yang diperlukan untuk memproses pesanan dan menghubungi Anda, kami **tidak menjual** data pribadi Anda, dan Anda dapat meminta akses, perbaikan, atau penghapusan data kapan saja melalui {{email}}.',
      },
    ],
  },
  {
    id: 'pengendali',
    title: 'Pengendali Data Pribadi',
    blocks: [
      {
        type: 'p',
        text: `Pengendali data pribadi Anda adalah **${entityName}**, beralamat di ${address}. Untuk pertanyaan atau permintaan terkait data pribadi, hubungi kami di {{email}} atau WhatsApp {{wa}}.`,
      },
    ],
  },
  {
    id: 'data-dikumpulkan',
    title: 'Data yang Kami Kumpulkan',
    blocks: [
      {
        type: 'table',
        headers: ['Kategori', 'Contoh data', 'Kapan dikumpulkan'],
        rows: [
          [
            'Akun',
            'Nama lengkap, email, nomor WhatsApp, nama usaha, minat layanan, dan kata sandi (disimpan dalam bentuk ter-hash oleh layanan autentikasi, bukan teks asli). Jika masuk dengan Google: nama, email, dan foto profil dari akun Google Anda.',
            'Saat mendaftar atau masuk',
          ],
          [
            'Pesanan',
            'Nama, nama usaha/merek, WhatsApp, email, paket dan add-on yang dipilih, catatan pesanan, metode dan status pembayaran, nomor pesanan, serta tautan dokumen hasil layanan.',
            'Saat checkout dan selama pesanan diproses',
          ],
          [
            'Konsultasi dan permintaan penawaran (RFQ)',
            'Nama, perusahaan, WhatsApp, email, kategori kebutuhan, lokasi, rincian kebutuhan, jumlah, dan target waktu.',
            'Saat Anda mengisi formulir',
          ],
          [
            'Dokumen legalitas',
            'Jika layanan mengharuskan: KTP, NPWP, pasfoto, alamat usaha, akta atau dokumen perusahaan, dan data pendukung lainnya.',
            'Saat Anda mengirimkannya ke tim kami melalui kanal yang disepakati (misalnya WhatsApp atau email)',
          ],
          [
            'Program referral',
            'Kode referral, pesanan yang dikaitkan dengan kode tersebut, dan nilai komisi.',
            'Saat Anda membagikan tautan atau ada pesanan yang berasal dari tautan referral',
          ],
          [
            'Data teknis',
            'Alamat IP, jenis perangkat dan browser, halaman yang dilihat, waktu akses, dan sumber kunjungan.',
            'Otomatis saat Anda menggunakan situs',
          ],
          [
            'Komunikasi',
            'Pesan yang Anda kirim melalui WhatsApp, email, atau formulir di situs.',
            'Saat Anda menghubungi kami',
          ],
        ],
      },
      {
        type: 'note',
        text: 'Kami **tidak meminta** nomor kartu kredit/debit, PIN, kata sandi perbankan, atau kode OTP. Pembayaran dilakukan melalui transfer bank, QRIS, atau e-wallet langsung ke rekening resmi BinaUsaha, dan kami tidak menyimpan kredensial perbankan Anda.',
      },
    ],
  },
  {
    id: 'tujuan',
    title: 'Tujuan dan Dasar Pemrosesan',
    blocks: [
      { type: 'p', text: 'Kami menggunakan data pribadi Anda untuk:' },
      {
        type: 'ul',
        items: [
          'membuat dan mengelola akun serta memverifikasi identitas Anda;',
          'memproses pesanan: menerbitkan invoice, memverifikasi pembayaran, mengerjakan layanan, dan memberi tahu status pesanan;',
          'mengurus legalitas dan perizinan ke instansi berwenang (misalnya OSS dan AHU) atas permintaan Anda;',
          'menanggapi konsultasi, permintaan penawaran, dan layanan bantuan;',
          'menjalankan program referral: menghitung, memverifikasi, dan membayarkan komisi, serta mencegah penyalahgunaan seperti pemesanan dengan kode sendiri;',
          'menjaga keamanan layanan, mencegah penipuan, dan menegakkan Syarat & Ketentuan;',
          'memahami penggunaan situs dan meningkatkan layanan (analitik);',
          'mengirim informasi layanan atau promosi, hanya jika Anda menyetujuinya;',
          'memenuhi kewajiban hukum, seperti pembukuan, perpajakan, dan permintaan resmi dari aparat berwenang.',
        ],
      },
      {
        type: 'p',
        text: 'Dasar pemrosesan kami adalah persetujuan Anda, pelaksanaan perjanjian dengan Anda (pesanan layanan), pemenuhan kewajiban hukum, dan kepentingan sah kami yang tidak melanggar hak Anda. Anda dapat menarik persetujuan kapan saja sebagaimana dijelaskan pada bagian Hak Anda.',
      },
    ],
  },
  {
    id: 'cookie',
    title: 'Cookie dan Penyimpanan Lokal',
    blocks: [
      {
        type: 'p',
        text: 'Situs kami menggunakan cookie dan penyimpanan lokal (local storage) di browser Anda untuk hal-hal berikut:',
      },
      {
        type: 'table',
        headers: ['Jenis', 'Fungsi', 'Masa simpan'],
        rows: [
          ['Sesi login', 'Menjaga Anda tetap masuk ke akun. Bersifat esensial.', 'Sampai Anda keluar atau sesi berakhir'],
          ['Kode referral', 'Mengaitkan pesanan dengan pemilik tautan referral yang Anda buka.', 'Hingga 30 hari'],
          ['Artikel favorit', 'Menyimpan artikel yang Anda tandai.', 'Sampai Anda menghapusnya atau membersihkan data browser'],
          ['Google Analytics', 'Statistik kunjungan agregat untuk memahami penggunaan situs.', 'Sesuai kebijakan Google'],
        ],
      },
      {
        type: 'p',
        text: 'Anda dapat menghapus atau memblokir cookie melalui pengaturan browser. Perlu diketahui bahwa sebagian fitur, seperti tetap masuk ke akun, mungkin tidak berfungsi tanpa penyimpanan tersebut.',
      },
    ],
  },
  {
    id: 'pihak-ketiga',
    title: 'Pihak Ketiga yang Terlibat',
    blocks: [
      {
        type: 'p',
        text: 'Untuk menjalankan layanan, kami bekerja sama dengan penyedia berikut. Mereka hanya memproses data sebatas yang diperlukan dan tunduk pada kebijakan privasi masing-masing.',
      },
      {
        type: 'table',
        headers: ['Pihak', 'Peran', 'Data yang terlibat'],
        rows: [
          ['Supabase', 'Basis data, autentikasi akun, dan penyimpanan berkas.', 'Data akun, pesanan, formulir, dan berkas yang diunggah'],
          ['Vercel', 'Hosting situs dan fungsi server.', 'Data teknis permintaan (misalnya alamat IP)'],
          ['Google', 'Masuk dengan Google, Google Analytics, dan Google Fonts.', 'Data profil Google yang Anda izinkan, serta data teknis dan statistik kunjungan'],
          ['WhatsApp (Meta)', 'Kanal komunikasi saat Anda menekan tombol WhatsApp.', 'Nomor dan isi pesan yang Anda kirim'],
          ['Bank, e-wallet, dan penyelenggara QRIS', 'Pemrosesan pembayaran yang Anda lakukan.', 'Data transaksi menurut kebijakan masing-masing'],
          ['Mitra profesional dan instansi (notaris, konsultan, OSS, AHU, otoritas pajak, dan sejenisnya)', 'Pengerjaan layanan yang Anda pesan.', 'Hanya data yang diperlukan untuk layanan tersebut'],
        ],
      },
      {
        type: 'p',
        text: 'Kami **tidak menjual atau menyewakan** data pribadi Anda. Data hanya dibagikan sejauh diperlukan untuk layanan yang Anda minta, kepada pihak yang terikat kewajiban kerahasiaan, atau apabila diwajibkan oleh hukum.',
      },
      {
        type: 'p',
        text: 'Sebagian penyedia di atas dapat menyimpan atau memproses data di server di luar Indonesia. Dalam hal ini kami berupaya memastikan tingkat pelindungan data yang memadai sesuai UU PDP.',
      },
    ],
  },
  {
    id: 'referral',
    title: 'Program Referral dan Privasi',
    blocks: [
      {
        type: 'ul',
        items: [
          'Saat Anda membuka tautan referral, kode referral disimpan sementara di browser Anda (hingga 30 hari) semata-mata untuk mengaitkan pesanan dengan pemilik kode.',
          'Pemilik kode referral hanya dapat melihat nomor pesanan, nilai komisi, dan status komisi. Pemilik kode **tidak dapat melihat** nama, kontak, atau data pribadi pembeli.',
          'Tim admin kami dapat melihat keterkaitan antara pesanan dan pemilik kode untuk memverifikasi serta membayarkan komisi, dan untuk mencegah kecurangan.',
        ],
      },
    ],
  },
  {
    id: 'penyimpanan',
    title: 'Lama Penyimpanan Data',
    blocks: [
      { type: 'p', text: 'Kami menyimpan data pribadi hanya selama diperlukan untuk tujuan di atas:' },
      {
        type: 'ul',
        items: [
          '**Data akun:** selama akun Anda aktif, hingga Anda meminta penghapusan.',
          '**Data pesanan dan transaksi:** selama diperlukan untuk menyelesaikan layanan, penanganan keluhan, dan memenuhi kewajiban pembukuan serta perpajakan sesuai peraturan.',
          '**Konsultasi dan permintaan penawaran yang tidak berlanjut menjadi pesanan:** selama diperlukan untuk menindaklanjuti permintaan Anda.',
          '**Kode referral di browser:** hingga 30 hari.',
        ],
      },
      {
        type: 'p',
        text: 'Setelah tidak lagi diperlukan, data akan dihapus atau dianonimkan, kecuali kami diwajibkan oleh hukum untuk menyimpannya lebih lama.',
      },
    ],
  },
  {
    id: 'keamanan',
    title: 'Keamanan Data',
    blocks: [
      { type: 'p', text: 'Kami menerapkan langkah-langkah teknis dan organisasi yang wajar untuk melindungi data Anda, antara lain:' },
      {
        type: 'ul',
        items: [
          'koneksi terenkripsi (HTTPS) antara perangkat Anda dan situs kami;',
          'kata sandi disimpan dalam bentuk ter-hash dan tidak dapat dibaca oleh tim kami;',
          'pembatasan akses di tingkat basis data (Row Level Security) sehingga pengguna hanya dapat membaca pesanan miliknya sendiri;',
          'akses panel admin dibatasi untuk akun yang berwenang;',
          'aturan akses pada penyimpanan berkas.',
        ],
      },
      {
        type: 'p',
        text: 'Tidak ada sistem yang sepenuhnya bebas risiko. Jaga kerahasiaan kata sandi Anda dan jangan membagikannya kepada siapa pun. Jika terjadi kegagalan pelindungan data pribadi, kami akan memberi tahu Anda dan pihak berwenang secara tertulis paling lambat 3 × 24 jam sesuai UU PDP.',
      },
    ],
  },
  {
    id: 'hak',
    title: 'Hak Anda',
    blocks: [
      { type: 'p', text: 'Sesuai UU PDP, Anda berhak untuk:' },
      {
        type: 'ul',
        items: [
          'mendapatkan informasi tentang kejelasan identitas, dasar hukum, dan tujuan pemrosesan data Anda;',
          'mengakses dan memperoleh salinan data pribadi Anda;',
          'melengkapi dan memperbaiki data yang tidak akurat;',
          'meminta penghapusan atau pemusnahan data pribadi Anda;',
          'menarik persetujuan pemrosesan yang telah Anda berikan;',
          'mengajukan keberatan atas pemrosesan tertentu dan meminta pembatasan pemrosesan;',
          'meminta data Anda dipindahkan (portabilitas) dalam format yang umum digunakan, sepanjang memungkinkan;',
          'menggugat dan menerima ganti rugi atas pelanggaran pemrosesan data pribadi sesuai ketentuan peraturan.',
        ],
      },
      {
        type: 'p',
        text: 'Untuk menggunakan hak tersebut, kirim permintaan ke {{email}} dengan subjek “Permintaan Data Pribadi”. Kami dapat meminta verifikasi identitas terlebih dahulu demi keamanan data Anda dan akan menanggapi dalam waktu yang wajar.',
      },
      {
        type: 'p',
        text: 'Permintaan tertentu dapat ditolak atau ditunda sebagian, misalnya jika data masih wajib kami simpan berdasarkan hukum (seperti data transaksi), atau jika pemenuhannya membahayakan keamanan dan hak pihak lain. Penghapusan data dapat membuat sebagian layanan, seperti akses ke riwayat pesanan, tidak dapat lagi digunakan.',
      },
    ],
  },
  {
    id: 'anak',
    title: 'Data Anak',
    blocks: [
      {
        type: 'p',
        text: 'Layanan kami ditujukan bagi pelaku usaha dewasa (minimal 18 tahun). Kami tidak dengan sengaja mengumpulkan data pribadi anak tanpa persetujuan orang tua atau wali. Jika Anda mengetahui data anak terkumpul tanpa persetujuan tersebut, hubungi kami agar data itu dapat dihapus.',
      },
    ],
  },
  {
    id: 'tautan-luar',
    title: 'Tautan ke Situs Lain',
    blocks: [
      {
        type: 'p',
        text: 'Situs kami memuat tautan ke layanan pihak lain seperti Instagram, YouTube, TikTok, dan WhatsApp. Kami tidak mengendalikan dan tidak bertanggung jawab atas praktik privasi pihak tersebut. Mohon baca kebijakan privasi mereka sebelum membagikan data pribadi Anda.',
      },
    ],
  },
  {
    id: 'perubahan',
    title: 'Perubahan Kebijakan',
    blocks: [
      {
        type: 'p',
        text: 'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Versi terbaru selalu tersedia di halaman ini lengkap dengan tanggal pembaruannya. Untuk perubahan yang penting, kami akan memberi tahu Anda melalui situs, email, atau WhatsApp. Dengan terus menggunakan layanan setelah perubahan berlaku, Anda dianggap menerima kebijakan yang telah diperbarui.',
      },
      { type: 'p', text: 'Penggunaan layanan kami juga tunduk pada {{terms}}.' },
    ],
  },
  {
    id: 'kontak',
    title: 'Hubungi Kami',
    blocks: [
      {
        type: 'p',
        text: `Pertanyaan, keluhan, atau permintaan terkait data pribadi dapat disampaikan kepada ${entityName} melalui {{email}}, WhatsApp {{wa}}, atau surat ke ${address}.`,
      },
    ],
  },
];

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBackToHome, onNavigate }) => (
  <LegalPageLayout
    kind="privacy"
    title="Kebijakan Privasi"
    subtitle="Bagaimana BinaUsaha mengumpulkan, menggunakan, dan melindungi data pribadi Anda."
    sections={SECTIONS}
    onBackToHome={onBackToHome}
    onNavigate={onNavigate}
  />
);
