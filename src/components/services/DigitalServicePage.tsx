import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Code,
  Store,
  Globe,
  Zap,
  Server,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  FilePlus,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  Sparkles,
  Smartphone,
  Cpu,
  Monitor,
  Printer,
  Headphones,
  Check,
  TrendingUp,
} from 'lucide-react';
import { ServiceNavTabs, ServicePageKey } from './ServiceNavTabs';

interface DigitalServicePageProps {
  onBackToHome: () => void;
  onSelectService: (service: ServicePageKey) => void;
  onOpenOrder: (productKey: string) => void;
  onOpenRfq: (kategori: string) => void;
  onOpenConsultation: () => void;
  onAskWhatsapp: (topic: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  initialTab?: string;
  scrollTarget?: string;
}

export const DigitalServicePage: React.FC<DigitalServicePageProps> = ({
  onBackToHome,
  onSelectService,
  onOpenOrder,
  onOpenRfq,
  onOpenConsultation,
  onAskWhatsapp,
  showToast,
  initialTab,
  scrollTarget,
}) => {
  // Active Tab for service details
  const [activeTab, setActiveTab] = useState<'website' | 'pos' | 'custom-app' | 'infrastructure'>('website');

  useEffect(() => {
    if (initialTab && ['website', 'pos', 'custom-app', 'infrastructure'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
    if (scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialTab, scrollTarget]);

  // Interactive Price Estimator State
  const [estType, setEstType] = useState<'landing' | 'company' | 'ecommerce' | 'pos_hardware' | 'custom_system'>('company');
  const [estPages, setEstPages] = useState<number>(5);
  const [includeDomain, setIncludeDomain] = useState<boolean>(true);
  const [includeSeo, setIncludeSeo] = useState<boolean>(true);
  const [includeTraining, setIncludeTraining] = useState<boolean>(true);
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(false);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculate estimated price
  const calculateEstimate = () => {
    let base = 0;
    if (estType === 'landing') base = 978600;
    else if (estType === 'company') base = 2500000;
    else if (estType === 'ecommerce') base = 3500000;
    else if (estType === 'pos_hardware') base = 3078600;
    else if (estType === 'custom_system') base = 6500000;

    let addons = 0;
    if (estType !== 'pos_hardware') {
      if (estPages > 5) addons += (estPages - 5) * 200000;
      if (includeDomain) addons += 150000;
      if (includeSeo) addons += 450000;
      if (includeTraining) addons += 200000;
      if (includeMaintenance) addons += 600000;
    } else {
      if (includeTraining) addons += 250000;
      if (includeMaintenance) addons += 400000;
    }

    return base + addons;
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const faqs = [
    {
      q: 'Berapa lama proses pembuatan website atau software kasir?',
      a: 'Untuk Landing Page Express pengerjaan 2–3 hari kerja. Website Bisnis Pro / Toko Online membutuhkan waktu 5–7 hari kerja. Sedangkan untuk Custom Web Application dan Mini ERP berkisar antara 2–4 minggu sesuai kompleksitas fitur.',
    },
    {
      q: 'Apakah website yang dibuat sudah termasuk Domain dan Hosting?',
      a: 'Ya! Semua paket Website Bisnis Pro sudah termasuk nama domain (.com atau .id) selama 1 tahun, cloud hosting berkecepatan tinggi dengan SSL (HTTPS aman), email bisnis resmi, dan maintenance teknis.',
    },
    {
      q: 'Bagaimana jika kami belum memiliki materi teks atau foto produk?',
      a: 'Tim copywriter dan desainer kami siap membantu menyusun struktur copywriting bisnis, memilih aset gambar bebas royalti, hingga mengedit foto katalog produk usaha Anda secara profesional.',
    },
    {
      q: 'Apakah ada pelatihan cara mengelola website dan aplikasi kasir?',
      a: 'Tentu saja. Kami menyediakan sesi pelatihan (training) via Zoom/Google Meet dan modul video panduan lengkap langkah demi langkah sampai tim atau kasir Anda mahir mengoperasikannya.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Nav Switcher */}
      <ServiceNavTabs
        activeService="digital"
        onSelectService={onSelectService}
        onBackToHome={onBackToHome}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Divisi Solusi Digital & IT Terpadu</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
                Transformasi Digital Usaha Anda, <span className="text-blue-400">Mudah & Siap Pakai</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Tingkatkan omzet dan otomatisasi operasional bisnis Anda dengan website profesional, aplikasi kasir POS terintegrasi, custom sistem manajemen, serta instalasi jaringan & infrastruktur IT handal.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onAskWhatsapp('Konsultasi Solusi Digital & IT BinaUsaha')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konsultasi WA Langsung</span>
                </button>
                <button
                  onClick={() => onOpenRfq('Digital & Teknologi')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Ajukan Kebutuhan Proyek</span>
                </button>
                <a
                  href="#estimator"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20 transition flex items-center gap-2"
                >
                  <span>Hitung Estimasi Biaya</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Key Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                <div>
                  <p className="text-2xl font-black text-blue-400 font-heading">500+</p>
                  <p className="text-xs text-slate-400">Website & App Selesai</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400 font-heading">99.8%</p>
                  <p className="text-xs text-slate-400">Uptime Server SLA</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-400 font-heading">4.9 / 5</p>
                  <p className="text-xs text-slate-400">Kepuasan Klien UMKM</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-purple-400 font-heading">24/7</p>
                  <p className="text-xs text-slate-400">Support Teknis Cepat</p>
                </div>
              </div>
            </div>

            {/* Visual Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Teknologi Modern</h3>
                      <p className="text-xs text-slate-400">Cepat, Aman & Mobile-First</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    Live Demo Ready
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Desain Eksklusif Sesuai Branding</h4>
                      <p className="text-[11px] text-slate-400">Tampilan modern, elegan, dan dioptimasi untuk menghasilkan konversi penjualan tinggi.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Integrasi WhatsApp & Payment Gateway</h4>
                      <p className="text-[11px] text-slate-400">Pelanggan bisa langsung order via WA atau bayar otomatis via QRIS & Transfer Bank.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Garansi Error & Pendampingan 100%</h4>
                      <p className="text-[11px] text-slate-400">Tim teknisi kami standby mendampingi pengelolaan teknis tanpa biaya tersembunyi.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenOrder('website_pro')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Pesan Paket Website Pro Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Pillars (Tabs Section) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Layanan Utama
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              Solusi Digital Lengkap untuk Setiap Skala Usaha
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Pilih spesifikasi layanan teknologi yang paling sesuai dengan target pertumbuhan bisnis Anda.
            </p>
          </div>

          {/* Interactive Pillars Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: 'website', label: 'Website & Toko Online', icon: Globe },
              { id: 'pos', label: 'Software Kasir POS', icon: Store },
              { id: 'custom-app', label: 'Custom App & Mini ERP', icon: Cpu },
              { id: 'infrastructure', label: 'Jaringan & IT Support', icon: Server },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
            {activeTab === 'website' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                    <Globe className="w-4 h-4" />
                    <span>Website Bisnis & E-Commerce</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Hadirkan Toko & Portofolio Bisnis 24 Jam Non-Stop di Google
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Website bukan sekadar brosur online, melainkan mesin konversi penjualan yang membangun kredibilitas brand Anda di mata calon pembeli dan investor.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Domain .com / .id Gratis 1 Tahun',
                      'Katalog Produk + Foto HD',
                      'Checkout WhatsApp Otomatis',
                      'Optimasi SEO Google Page #1',
                      'Fast Loading & Mobile Friendly',
                      'Email Bisnis (info@namabisnis.com)',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenOrder('website_pro')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Pesan Website Pro (Rp 3.147.900)
                    </button>
                    <button
                      onClick={() => onOpenOrder('website_express')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Landing Page Kilat (Rp 978.600)
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Pilihan Paket Website BinaUsaha:
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Paket Website UMKM Pro</p>
                        <p className="text-[11px] text-slate-500">Cocok untuk toko ritel, jasa, kuliner, dan manufaktur</p>
                      </div>
                      <span className="text-xs font-extrabold text-blue-700">Rp 3.147.900</span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Landing Page Express (1 Halaman)</p>
                        <p className="text-[11px] text-slate-500">Cocok untuk iklan sosmed & campaign produk spesifik</p>
                      </div>
                      <span className="text-xs font-extrabold text-slate-700">Rp 978.600</span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Custom E-Commerce Portal</p>
                        <p className="text-[11px] text-slate-500">Multi-vendor, membership, kalkulator ongkir otomatis</p>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-700">Mulai Rp 5.500.000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pos' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
                    <Store className="w-4 h-4" />
                    <span>Aplikasi Kasir POS & Hardware Lengkap</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Cegah Kebocoran Kas & Kelola Stok Barang Otomatis
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Sistem RajaKas POS memberikan kontrol penuh terhadap transaksi harian kasir, laporan laba rugi real-time, cetak struk bluetooth, dan pemantauan banyak cabang dari smartphone Anda.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Aplikasi Kasir Android & Web',
                      'Laporan Laba Rugi & Omzet Harian',
                      'Manajemen Multi-Outlet / Cabang',
                      'Stok & Pengingat Minimum Inventori',
                      'Hardware Printer Thermal 58mm',
                      'Laci Kasir Besi Otomatis (Cash Drawer)',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenOrder('pos_hardware_set')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Pesan Hardware Set Kasir (Rp 3.078.600)
                    </button>
                    <button
                      onClick={() => onOpenOrder('rajakas_pos')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Software Kasir App Saja (Rp 1.118.600)
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Fitur Unggulan RajaKas POS:
                  </h4>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900 mb-1">⚡ Cetak Struk & E-Receipt WA</p>
                      <p>Kirim bukti pembelian langsung ke nomor WhatsApp customer tanpa buang kertas.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900 mb-1">📊 Pantau Penjualan dari Mana Saja</p>
                      <p>Owner bisa mengecek performa kasir dan sisa stok barang secara live kapan saja.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900 mb-1">🔒 Hak Akses Kasir & Supervisor</p>
                      <p>Cegah manipulasi harga dan hapus item tanpa persetujuan PIN supervisor.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'custom-app' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>Custom Web & Mobile Application</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Bangun Sistem Operasional Khusus Sesuai Alur Bisnis Anda
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Setiap bisnis memiliki proses unik. Kami mengembangkan software kustom seperti ERP Mini, CRM Pelanggan, Sistem Ticketing, Sistem Gudang & Distribusi, hingga Aplikasi Booking Layanan.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Analisis Alur Kerja & SOP Bisnis',
                      'Arsitektur Database Scalable',
                      'Integrasi API Pihak Ketiga',
                      'Dashboard Analitik Manajemen',
                      'Keamanan Data & Role Permission',
                      'UAT & Pelatihan Karyawan',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Custom Application & ERP')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Ajukan Kebutuhan Custom App
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Konsultasi Kebutuhan Custom Software / App')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Diskusi dengan Tech Lead
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Contoh Sistem yang Telah Kami Bangun:
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-900">1. Sistem Manajemen Logistik & Truk</span>
                      <p className="text-slate-600 mt-0.5">Tracking armada, surat jalan digital, dan kalkulasi tonase muatan otomatis.</p>
                    </li>
                    <li className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-900">2. Portal Reservasi Klinik & Spa</span>
                      <p className="text-slate-600 mt-0.5">Jadwal dokter, rekam medis digital, dan reminder WhatsApp otomatis ke pasien.</p>
                    </li>
                    <li className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-900">3. B2B Wholesale Ordering System</span>
                      <p className="text-slate-600 mt-0.5">Portal pesanan distributor grosir dengan tiering harga khusus agen.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'infrastructure' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-bold">
                    <Server className="w-4 h-4" />
                    <span>Infrastruktur Jaringan & IT Support</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Jaringan Kantor Stabil, CCTV Aman & Pengadaan Hardware
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Pastikan operasional kantor, toko, atau kafe Anda berjalan lancar dengan instalasi LAN terstruktur, Wi-Fi bisnis anti lemot, CCTV online berkecepatan tinggi, dan pemeliharaan komputer berkala.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Instalasi Kabel LAN & Router Mikrotik',
                      'Wi-Fi Mesh Area Luas untuk Kafe/Kantor',
                      'Paket CCTV IP Camera HD Online 24 Jam',
                      'Pengadaan PC/Laptop Kerja Spesifikasi Bisnis',
                      'Setup Printer Sharing & File Server Lokal',
                      'Maintenance Berkala & IT Helpdesk',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Infrastruktur Jaringan & CCTV')}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Ajukan Survey Lokasi & Penawaran
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Tanya Paket Jaringan & CCTV Kantor')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Tanya Teknisi Jaringan
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Paket Solusi IT Kantor & Retail:
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <p className="font-bold text-slate-900">Paket Wi-Fi Kafe / Resto Anti Ngelag</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Sistem captive portal login sosmed + manajemen bandwidth pengunjung vs kasir.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <p className="font-bold text-slate-900">Paket CCTV Toko 4-8 Kamera HD</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Pantau rekaman audio-video langsung dari HP tanpa repot setting port.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <p className="font-bold text-slate-900">Kontrak Maintenance IT Bulanan</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Pembersihan virus, backup database, optimasi kecepatan PC kerja.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Project Cost Estimator */}
      <section id="estimator" className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Kalkulator Transparan
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 mt-2">
                    Simulasi Estimasi Biaya Digitalisasi Usaha
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Sesuaikan pilihan fitur kebutuhan usaha Anda untuk melihat perkiraan biaya transparan tanpa biaya tersembunyi.
                  </p>
                </div>

                {/* Step 1: Select Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Jenis Solusi Digital yang Dibutuhkan:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'landing', label: 'Landing Page (1 Hal)', base: 'Rp 978 Rb' },
                      { id: 'company', label: 'Website Bisnis Pro', base: 'Rp 2.5 Jt' },
                      { id: 'ecommerce', label: 'Toko Online E-Com', base: 'Rp 3.5 Jt' },
                      { id: 'pos_hardware', label: 'POS + Hardware Kasir', base: 'Rp 3.0 Jt' },
                      { id: 'custom_system', label: 'Custom Web / App', base: 'Rp 6.5 Jt' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setEstType(item.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          estType === item.id
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-xs leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.base}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Options */}
                {estType !== 'pos_hardware' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      2. Jumlah Halaman / Modul (Estimasi: {estPages} Halaman)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={estPages}
                      onChange={(e) => setEstPages(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1 Halaman</span>
                      <span>10 Halaman</span>
                      <span>20 Halaman</span>
                    </div>
                  </div>
                )}

                {/* Step 3: Add-on checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Opsi Tambahan & Layanan:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeDomain}
                        onChange={(e) => setIncludeDomain(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Domain Bisnis (.com / .id) & SSL Enkripsi (+ Rp 150.000)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeSeo}
                        onChange={(e) => setIncludeSeo(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Optimasi SEO Google & Setup Google Bisnis (+ Rp 450.000)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeTraining}
                        onChange={(e) => setIncludeTraining(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Sesi Training Admin Online & Video Tutorial (+ Rp 200.000)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeMaintenance}
                        onChange={(e) => setIncludeMaintenance(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Paket Maintenance & Backup Bulanan (+ Rp 600.000)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Estimate Summary Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                    Hasil Perhitungan Estimasi
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">Ringkasan Investasi Digital</h4>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Tipe Proyek</span>
                    <span className="font-bold text-white capitalize">{estType.replace('_', ' ')}</span>
                  </div>
                  {estType !== 'pos_hardware' && (
                    <div className="flex justify-between">
                      <span>Estimasi Halaman</span>
                      <span className="font-bold text-white">{estPages} Halaman</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Waktu Pengerjaan</span>
                    <span className="font-bold text-emerald-400">3 – 7 Hari Kerja</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garansi Error</span>
                    <span className="font-bold text-amber-400">Full 30 Hari</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-400">Perkiraan Total Investasi:</p>
                  <p className="text-3xl font-black font-heading text-blue-400 mt-1">
                    {formatRupiah(calculateEstimate())}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    *Harga final dapat disesuaikan kembali setelah sesi konsultasi detail spesifikasi.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      const text = `Halo BinaUsaha, saya telah melakukan estimasi digital:\n- Tipe: ${estType}\n- Perkiraan: ${formatRupiah(
                        calculateEstimate()
                      )}\nMohon info dan penawaran resminya.`;
                      onAskWhatsapp(text);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Dapatkan Penawaran via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onOpenRfq('Digital & Teknologi')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Isi Form Detail Kebutuhan (RFQ)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process & Workflow */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Alur Kerja Profesional
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              5 Langkah Mudah Menuju Go-Live
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Proses pengerjaan transparan dan terstruktur dengan update berkala di setiap tahap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Konsultasi & Brief',
                desc: 'Diskusi tujuan bisnis, fitur wajib, serta pengumpulan materi brand dan produk.',
              },
              {
                step: '02',
                title: 'Desain & Wireframe',
                desc: 'Pembuatan layout UI/UX modern yang disesuaikan dengan identitas visual usaha Anda.',
              },
              {
                step: '03',
                title: 'Development & Code',
                desc: 'Pengembangan fungsionalitas sistem, integrasi database, kasir, dan pembayaran.',
              },
              {
                step: '04',
                title: 'Testing & Training',
                desc: 'Uji coba seluruh fitur dan pelatihan langsung staf/kasir sampai siap pakai.',
              },
              {
                step: '05',
                title: 'Go-Live & Support',
                desc: 'Peluncuran resmi ke publik dan pendampingan teknis garansi tanpa khawatir.',
              },
            ].map((st, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative group hover:bg-blue-50/50 hover:border-blue-300 transition duration-200"
              >
                <span className="text-2xl font-black font-heading text-blue-600/40 group-hover:text-blue-600 transition">
                  {st.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              FAQ Seputar Jasa Digital & Teknologi
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Card */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-bold font-heading">
              Siap Memulai Proyek Digital Usaha Anda?
            </h3>
            <p className="text-blue-100 text-sm max-w-xl mx-auto">
              Diskusikan kebutuhan spesifik Anda dengan konsultan teknologi kami. Dapatkan penawaran harga terbaik dan demo sistem gratis hari ini!
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => onAskWhatsapp('Halo BinaUsaha, saya ingin mulai konsultasi proyek Digital')}
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Hubungi Konsultan via WhatsApp
              </button>
              <button
                onClick={() => onOpenRfq('Digital & Teknologi')}
                className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm px-6 py-3 rounded-xl border border-blue-400/40 transition cursor-pointer"
              >
                Ajukan RFQ Online
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
