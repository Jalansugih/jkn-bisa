import React from 'react';
import { LegalPageLayout, LegalKind, LegalSection } from './LegalPageLayout';
import { LEGAL_INFO } from '../../data/legalInfo';
import { COMMISSION_RATE } from '../../lib/referral';

interface TermsOfServicePageProps {
  onBackToHome: () => void;
  onNavigate: (kind: LegalKind) => void;
}

const { entityName, website, disputeCourt } = LEGAL_INFO;
// Ikut berubah otomatis jika COMMISSION_RATE di referral.ts diubah
const commissionPct = `${Math.round(COMMISSION_RATE * 100)}%`;

const SECTIONS: LegalSection[] = [
  {
    id: 'penerimaan',
    title: 'Penerimaan Syarat',
    blocks: [
      {
        type: 'p',
        text: `Syarat & Ketentuan ini (“Syarat”) mengatur penggunaan situs, akun, dan layanan ${entityName} (“BinaUsaha”, “kami”) di ${website}. Dengan mengakses situs, membuat akun, memesan paket, atau menggunakan layanan kami, Anda menyatakan telah membaca, memahami, dan menyetujui Syarat ini beserta {{privacy}}.`,
      },
      {
        type: 'p',
        text: 'Anda menyatakan berusia minimal 18 tahun (atau cakap hukum menurut hukum Indonesia) dan, jika memesan atas nama usaha atau badan hukum, berwenang mewakilinya. Jika Anda tidak menyetujui Syarat ini, mohon tidak menggunakan layanan kami.',
      },
    ],
  },
  {
    id: 'layanan',
    title: 'Tentang BinaUsaha dan Ruang Lingkup Layanan',
    blocks: [
      {
        type: 'p',
        text: 'BinaUsaha adalah platform digital dan penghubung kebutuhan legalitas serta operasional usaha bagi UMKM. Layanan yang tersedia meliputi:',
      },
      {
        type: 'ul',
        items: [
          'pengurusan legalitas dan perizinan usaha (misalnya PT, CV, NIB/OSS, dan sertifikasi halal);',
          'pembuatan website bisnis dan sistem kasir digital (POS RajaKas);',
          'layanan konstruksi, material, serta agro dan industri hijau melalui jaringan mitra;',
          'konsultasi operasional usaha dan konten edukasi.',
        ],
      },
      {
        type: 'p',
        text: 'Pekerjaan dilakukan oleh tim BinaUsaha dan/atau mitra profesional terverifikasi. Lingkup, rincian, dan harga setiap layanan tertera pada halaman paket, invoice, atau penawaran yang kami kirimkan kepada Anda.',
      },
      {
        type: 'note',
        text: 'BinaUsaha bukan instansi pemerintah, kantor notaris, atau kantor akuntan publik. Keputusan akhir atas permohonan perizinan ada pada instansi berwenang (seperti OSS, AHU, dan otoritas pajak), bukan pada kami.',
      },
    ],
  },
  {
    id: 'akun',
    title: 'Akun Pengguna',
    blocks: [
      {
        type: 'ul',
        items: [
          'Anda dapat memesan sebagai tamu atau membuat akun (dengan email dan kata sandi, atau akun Google). Akun diperlukan untuk dashboard pesanan, artikel favorit, dan program referral.',
          'Data akun harus benar, lengkap, dan selalu Anda perbarui.',
          'Anda bertanggung jawab menjaga kerahasiaan kata sandi dan seluruh aktivitas di akun Anda. Segera hubungi kami jika ada akses tanpa izin.',
          'Satu orang untuk satu akun. Akun tidak boleh dijual atau dialihkan.',
          'Kami dapat menangguhkan atau menutup akun yang melanggar Syarat ini, memberikan data palsu, atau terindikasi penipuan dan penyalahgunaan.',
        ],
      },
    ],
  },
  {
    id: 'pemesanan',
    title: 'Proses Pemesanan',
    blocks: [
      {
        type: 'ol',
        items: [
          'Pilih paket dan add-on, lalu isi data pemesanan dengan benar.',
          'Kami menerbitkan invoice berisi nomor pesanan dan instruksi pembayaran.',
          'Anda melakukan pembayaran, lalu kami memverifikasinya.',
          'Pesanan diproses melalui tahapan Verifikasi, Pengerjaan, QC & Training, dan Selesai. Anda dapat memantau statusnya lewat menu Cek Status Pesanan atau dashboard akun.',
        ],
      },
      {
        type: 'p',
        text: 'Pesanan diproses setelah data lengkap dan pembayaran terverifikasi, kecuali disepakati lain secara tertulis. Pekerjaan di luar lingkup paket, atau perubahan besar di tengah pengerjaan, dapat dikenakan biaya tambahan yang kami sampaikan dan sepakati terlebih dahulu.',
      },
      {
        type: 'p',
        text: 'Kami berhak menolak atau membatalkan pesanan jika data tidak lengkap atau tidak benar, layanan tidak dapat dikerjakan secara hukum, atau terindikasi penyalahgunaan. Pembayaran yang telah kami terima untuk pesanan tersebut akan diperlakukan sesuai bagian Pembatalan dan Pengembalian Dana.',
      },
    ],
  },
  {
    id: 'pembayaran',
    title: 'Harga dan Pembayaran',
    blocks: [
      {
        type: 'ul',
        items: [
          'Harga dinyatakan dalam Rupiah (IDR) sebagaimana tertera saat pemesanan. Harga dapat berubah sewaktu-waktu, namun tidak berlaku surut bagi pesanan yang sudah dibuat.',
          'Rincian biaya yang termasuk dan tidak termasuk dalam paket (misalnya biaya instansi, notaris, meterai, domain, atau hosting) dijelaskan pada deskripsi paket dan invoice. Biaya yang tidak termasuk menjadi tanggungan pemesan.',
          'Metode pembayaran: transfer bank (BCA, Mandiri, BRI), QRIS, dan e-wallet (DANA, GoPay), sesuai pilihan pada halaman pemesanan.',
          'Pembayaran diverifikasi secara manual. Status pembayaran: Belum Dibayar, Menunggu Verifikasi, dan Lunas. Simpan bukti pembayaran Anda dan hubungi kami jika status belum berubah.',
          'Invoice dan kwitansi diterbitkan atas nama sesuai data pemesanan. Pajak, bila berlaku, dinyatakan pada invoice.',
        ],
      },
      {
        type: 'note',
        text: '**Waspada penipuan.** Bayar hanya ke rekening, QRIS, atau e-wallet resmi yang tercantum pada invoice. BinaUsaha tidak pernah meminta PIN, OTP, atau kata sandi Anda. Pastikan komunikasi berasal dari kanal resmi kami: {{email}} dan WhatsApp {{wa}}.',
      },
    ],
  },
  {
    id: 'kewajiban',
    title: 'Kewajiban Pemesan: Data dan Dokumen',
    blocks: [
      {
        type: 'ul',
        items: [
          'Anda wajib menyerahkan data dan dokumen yang benar, sah, dan terbaru (misalnya KTP, NPWP, pasfoto, alamat, dan informasi usaha).',
          'Tanggapi permintaan kami tepat waktu. Dokumen yang terlambat atau tidak lengkap dapat menunda pengerjaan.',
          'Anda menjamin berhak atas logo, foto, teks, dan materi lain yang Anda serahkan, dan bahwa materi tersebut tidak melanggar hak pihak lain.',
          'Penolakan atau keterlambatan dari instansi akibat berkas tidak sah, tidak lengkap, atau tidak sesuai bukan tanggung jawab BinaUsaha. Pengajuan ulang dapat dikenakan biaya tambahan.',
        ],
      },
    ],
  },
  {
    id: 'waktu',
    title: 'Estimasi Waktu Pengerjaan',
    blocks: [
      {
        type: 'p',
        text: 'Estimasi waktu yang kami sampaikan bersifat perkiraan, bukan jaminan. Lama pengerjaan bergantung pada kelengkapan dokumen, antrean dan kebijakan instansi, serta kecepatan respons Anda. Kami akan memberi tahu Anda jika ada kendala yang memengaruhi jadwal.',
      },
    ],
  },
  {
    id: 'pembatalan',
    title: 'Pembatalan, Revisi, dan Pengembalian Dana',
    blocks: [
      {
        type: 'ul',
        items: [
          'Ajukan pembatalan melalui {{email}} atau WhatsApp {{wa}} dengan menyebutkan nomor pesanan.',
          'Jika pengerjaan belum dimulai dan belum ada biaya pihak ketiga yang dibayarkan, pembayaran dapat dikembalikan, dikurangi biaya transfer atau pembayaran yang telah timbul.',
          'Jika pengerjaan sudah berjalan, pengembalian dihitung secara proporsional terhadap pekerjaan yang belum dilakukan.',
          'Biaya yang telah dibayarkan kepada instansi, notaris, atau mitra (pihak ketiga) bersifat final dan tidak dapat dikembalikan.',
          'Jika layanan tidak sesuai karena kesalahan kami, kami akan memperbaikinya tanpa biaya tambahan atau, bila tidak memungkinkan, mengembalikan dana sesuai bagian yang tidak terpenuhi.',
          'Pengembalian dana dilakukan ke rekening atau e-wallet atas nama pemesan dalam waktu yang wajar setelah disetujui.',
          'Jumlah dan batas revisi mengikuti deskripsi paket. Revisi di luar batas tersebut dapat dikenakan biaya.',
        ],
      },
      {
        type: 'note',
        text: 'Ketentuan ini tidak mengurangi hak Anda sebagai konsumen berdasarkan peraturan perundang-undangan yang berlaku.',
      },
    ],
  },
  {
    id: 'digital',
    title: 'Layanan Digital (Website dan POS)',
    blocks: [
      {
        type: 'ul',
        items: [
          'Hasil kerja diserahkan setelah pembayaran lunas dan tahap QC & Training selesai.',
          'Setelah lunas, Anda berhak menggunakan desain, tampilan, dan konten yang dibuat khusus untuk usaha Anda. Komponen pihak ketiga (template, font, ikon, pustaka kode, plugin, dan foto stok) tunduk pada lisensi masing-masing. BinaUsaha tetap memegang hak atas sistem, kode, dan perangkat generik miliknya.',
          'Domain, hosting, dan langganan POS (RajaKas) berlaku selama masa aktif paket. Perpanjangan dapat dikenakan biaya yang kami informasikan sebelumnya.',
          'Anda bertanggung jawab atas isi, produk, dan transaksi usaha Anda, serta atas pencadangan data penting Anda.',
          'Kami dapat menampilkan hasil kerja sebagai portofolio, kecuali Anda menyatakan keberatan secara tertulis.',
        ],
      },
    ],
  },
  {
    id: 'legalitas',
    title: 'Layanan Legalitas dan Perizinan',
    blocks: [
      {
        type: 'ul',
        items: [
          'Dengan memesan, Anda memberi kuasa kepada BinaUsaha dan mitra kami untuk memproses permohonan atas nama Anda, sebatas layanan yang dipesan.',
          'Dokumen resmi diterbitkan oleh instansi berwenang dan diserahkan kepada Anda setelah selesai.',
          'Kewajiban setelah legalitas terbit (misalnya pelaporan pajak, laporan kegiatan usaha, dan perpanjangan izin) tetap menjadi tanggung jawab Anda, kecuali termasuk dalam paket yang dipesan.',
          'Persyaratan dan biaya resmi instansi dapat berubah sewaktu-waktu mengikuti peraturan.',
          'Informasi pada artikel dan konsultasi bersifat umum, dan bukan pengganti nasihat hukum, pajak, atau keuangan untuk kondisi spesifik Anda.',
        ],
      },
    ],
  },
  {
    id: 'referral',
    title: 'Program Referral',
    blocks: [
      { type: 'p', text: 'Pengguna terdaftar mendapatkan kode dan tautan referral pribadi. Ketentuannya:' },
      {
        type: 'ul',
        items: [
          `**Komisi:** saat ini sebesar ${commissionPct} dari harga paket untuk pesanan yang berasal dari tautan atau kode Anda, dihitung ketika pesanan berstatus Lunas. Persentase dapat berubah; komisi yang sudah terbentuk memakai persentase pada saat terbentuk.`,
          '**Pengaitan pesanan:** pesanan dikaitkan dengan kode Anda jika pembeli membuka tautan Anda lalu memesan dalam 30 hari di browser yang sama.',
          '**Status komisi:** Menunggu, Disetujui (dapat dicairkan), lalu Dicairkan. Komisi dibatalkan jika pesanan terkait dibatalkan atau dananya dikembalikan.',
          '**Pencairan:** diproses admin setelah komisi disetujui, ke rekening atau e-wallet atas nama yang sesuai. Ketentuan teknis seperti batas minimum dan jadwal disampaikan melalui WhatsApp atau email.',
          '**Dilarang:** memesan memakai kode sendiri atau melalui akun, nomor WhatsApp, atau email yang sama atau terafiliasi; spam; iklan yang menyesatkan; mengaku sebagai karyawan atau perwakilan resmi BinaUsaha; dan menjanjikan hasil yang tidak benar.',
          'Kami berhak menolak, menahan, atau membatalkan komisi, serta menghentikan keikutsertaan Anda, jika terjadi pelanggaran atau indikasi kecurangan.',
          'Program ini bukan hubungan kerja, keagenan, atau kemitraan. Kewajiban pajak atas penghasilan komisi menjadi tanggung jawab penerima.',
          'Kami dapat mengubah atau menghentikan program dengan pemberitahuan. Komisi yang sudah disetujui sebelum perubahan tetap dihormati.',
        ],
      },
    ],
  },
  {
    id: 'hki',
    title: 'Hak Kekayaan Intelektual',
    blocks: [
      {
        type: 'p',
        text: 'Merek, logo, desain situs, artikel, tampilan, dan kode di situs ini adalah milik BinaUsaha atau pemberi lisensinya dan dilindungi hukum. Anda tidak diperbolehkan menyalin, mengubah, atau mendistribusikannya tanpa izin tertulis, kecuali membagikan tautan ke halaman kami. Materi yang Anda serahkan kepada kami hanya akan kami gunakan untuk mengerjakan pesanan Anda.',
      },
    ],
  },
  {
    id: 'larangan',
    title: 'Penggunaan yang Dilarang',
    blocks: [
      { type: 'p', text: 'Anda dilarang:' },
      {
        type: 'ul',
        items: [
          'memberikan data, dokumen, atau bukti pembayaran palsu;',
          'memakai layanan untuk kegiatan yang melanggar hukum, termasuk penipuan dan pencucian uang;',
          'mengakses sistem tanpa izin, mengganggu layanan, menguji kerentanan tanpa izin, mengambil data secara berlebihan (scraping), atau menyebarkan perangkat lunak berbahaya;',
          'memanipulasi sistem, termasuk program referral;',
          'melanggar hak pihak lain atau peraturan perundang-undangan, termasuk UU ITE.',
        ],
      },
      {
        type: 'p',
        text: 'Pelanggaran dapat berakibat pada penangguhan akun, pembatalan pesanan, dan pelaporan kepada pihak berwenang.',
      },
    ],
  },
  {
    id: 'tanggung-jawab',
    title: 'Batasan Tanggung Jawab',
    blocks: [
      { type: 'p', text: 'Sejauh diizinkan oleh hukum, BinaUsaha tidak bertanggung jawab atas:' },
      {
        type: 'ul',
        items: [
          'keputusan, kebijakan, atau keterlambatan instansi pemerintah;',
          'kerugian akibat data atau dokumen yang tidak benar dari pemesan;',
          'gangguan layanan pihak ketiga di luar kendali wajar kami (misalnya jaringan internet, listrik, hosting, bank, WhatsApp, atau Google);',
          'kerugian tidak langsung, seperti hilangnya keuntungan atau peluang usaha.',
        ],
      },
      {
        type: 'p',
        text: 'Jika kami terbukti bertanggung jawab, tanggung jawab total kami dibatasi sebesar nilai yang telah Anda bayarkan untuk pesanan yang bersangkutan, kecuali hukum menentukan lain. Ketentuan ini tidak menghilangkan hak Anda sebagai konsumen berdasarkan peraturan perundang-undangan yang berlaku.',
      },
    ],
  },
  {
    id: 'force-majeure',
    title: 'Keadaan Memaksa',
    blocks: [
      {
        type: 'p',
        text: 'Kami tidak dianggap lalai atas keterlambatan atau kegagalan yang disebabkan keadaan di luar kendali wajar kami, seperti bencana alam, kebakaran, banjir, perang, kerusuhan, pandemi, pemadaman listrik atau jaringan secara luas, gangguan sistem instansi pemerintah, atau perubahan kebijakan pemerintah. Kami akan memberi tahu Anda secepatnya dan melanjutkan pekerjaan setelah keadaan tersebut berakhir atau menyepakati solusi bersama.',
      },
    ],
  },
  {
    id: 'privasi',
    title: 'Privasi dan Data Pribadi',
    blocks: [
      {
        type: 'p',
        text: 'Pengumpulan dan penggunaan data pribadi Anda diatur dalam {{privacy}}, yang merupakan bagian tidak terpisahkan dari Syarat ini.',
      },
    ],
  },
  {
    id: 'perubahan',
    title: 'Perubahan Syarat',
    blocks: [
      {
        type: 'p',
        text: 'Kami dapat memperbarui Syarat ini dari waktu ke waktu. Versi terbaru dipublikasikan di halaman ini lengkap dengan tanggal pembaruannya, dan perubahan yang penting akan kami beritahukan melalui situs, email, atau WhatsApp. Perubahan berlaku untuk pesanan yang dibuat setelah tanggal berlakunya; pesanan yang sedang berjalan tetap mengikuti Syarat saat pesanan dibuat, kecuali Anda menyetujui yang baru. Dengan terus menggunakan layanan setelah perubahan berlaku, Anda dianggap menerima Syarat yang diperbarui.',
      },
    ],
  },
  {
    id: 'hukum',
    title: 'Hukum yang Berlaku dan Penyelesaian Sengketa',
    blocks: [
      {
        type: 'p',
        text: 'Syarat ini tunduk pada hukum Republik Indonesia. Jika ada keluhan atau perselisihan, silakan hubungi kami terlebih dahulu melalui {{email}} atau WhatsApp {{wa}} agar dapat diselesaikan secara musyawarah. Bila tidak tercapai kesepakatan, penyelesaian dapat ditempuh melalui Badan Penyelesaian Sengketa Konsumen (BPSK) atau ' +
          disputeCourt +
          ', tanpa mengurangi hak Anda sebagai konsumen untuk menempuh jalur lain yang disediakan hukum.',
      },
    ],
  },
  {
    id: 'kontak',
    title: 'Hubungi Kami',
    blocks: [
      {
        type: 'p',
        text: `Pertanyaan tentang Syarat ini dapat disampaikan kepada ${entityName} melalui {{email}}, WhatsApp {{wa}}, atau surat ke ${LEGAL_INFO.address}.`,
      },
    ],
  },
];

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBackToHome, onNavigate }) => (
  <LegalPageLayout
    kind="terms"
    title="Syarat & Ketentuan"
    subtitle="Aturan penggunaan situs dan layanan BinaUsaha, mulai dari pemesanan, pembayaran, hingga pembatalan dan program referral."
    sections={SECTIONS}
    onBackToHome={onBackToHome}
    onNavigate={onNavigate}
  />
);
