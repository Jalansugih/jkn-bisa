import React, { useState, useEffect } from 'react';
import {
  Wrench,
  HardHat,
  Building,
  Ruler,
  Paintbrush,
  Hammer,
  Truck,
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
  Home,
  Check,
  MapPin,
} from 'lucide-react';
import { ServiceNavTabs, ServicePageKey } from './ServiceNavTabs';

interface KonstruksiServicePageProps {
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

export const KonstruksiServicePage: React.FC<KonstruksiServicePageProps> = ({
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
  const [activeTab, setActiveTab] = useState<'renovasi' | 'interior' | 'sipil' | 'material'>('renovasi');

  useEffect(() => {
    if (initialTab && ['renovasi', 'interior', 'sipil', 'material'].includes(initialTab)) {
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

  // Interactive Construction Estimator
  const [projType, setProjType] = useState<'kafe' | 'ruko' | 'kantor' | 'booth'>('kafe');
  const [areaSqm, setAreaSqm] = useState<number>(50);
  const [specGrade, setSpecGrade] = useState<'standard' | 'premium'>('standard');
  const [includeMe, setIncludeMe] = useState<boolean>(true);
  const [includeFurniture, setIncludeFurniture] = useState<boolean>(true);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calculateRab = () => {
    let ratePerSqm = 0;
    if (projType === 'kafe') ratePerSqm = specGrade === 'standard' ? 1800000 : 2800000;
    else if (projType === 'ruko') ratePerSqm = specGrade === 'standard' ? 1500000 : 2400000;
    else if (projType === 'kantor') ratePerSqm = specGrade === 'standard' ? 1600000 : 2500000;
    else if (projType === 'booth') ratePerSqm = specGrade === 'standard' ? 2200000 : 3200000;

    let subtotal = areaSqm * ratePerSqm;
    if (includeMe) subtotal += areaSqm * 250000;
    if (includeFurniture) subtotal += areaSqm * 400000;

    return subtotal;
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
      q: 'Apakah survey lokasi dan konsultasi awal dikenakan biaya?',
      a: 'Tidak! Kami memberikan layanan Survey Lokasi & Konsultasi Tata Ruang GRATIS untuk seluruh area Jabodetabek dan kota-kota besar mitra BinaUsaha.',
    },
    {
      q: 'Bagaimana sistem pembayaran proyek konstruksi / renovasi?',
      a: 'Pembayaran dilakukan secara bertahap (termin) sesuai progress fisik di lapangan: DP Awal (30%), Termin Progress (40%), Termin Finishing (25%), dan Retensi Garansi (5%) setelah serah terima.',
    },
    {
      q: 'Apakah ada garansi setelah pengerjaan selesai?',
      a: 'Pasti! Setiap pekerjaan konstruksi dan interior mendapatkan Garansi Pemeliharaan resmi selama 3 hingga 6 bulan untuk kebocoran, kelistrikan, dan struktur.',
    },
    {
      q: 'Apakah tim BinaUsaha bisa membuatkan Desain 3D dan RAB sebelum deal?',
      a: 'Tentu. Tim arsitek kami akan membuatkan visualisasi 3D rendering dan Rencana Anggaran Biaya (RAB) yang transparan per item material sebelum penandatanganan Surat Perjanjian Kerja (SPK).',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Nav Switcher */}
      <ServiceNavTabs
        activeService="konstruksi"
        onSelectService={onSelectService}
        onBackToHome={onBackToHome}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-amber-950/80 to-slate-900 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
                <HardHat className="w-3.5 h-3.5 text-amber-400" />
                <span>Kontraktor Komersial & Supplier Material Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
                Bangun & Renovasi Tempat Usaha, <span className="text-amber-400">Rapi & Tepat Waktu</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Wujudkan konsep kafe estetik, renovasi ruko siap buka, kantor modern, dan booth custom dengan RAB transparan, tenaga ahli bersertifikasi, serta garansi pemeliharaan proyek 100%.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onAskWhatsapp('Halo BinaUsaha, saya ingin jadwalkan Survey Lokasi Proyek Konstruksi')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Jadwalkan Survey Lokasi Gratis</span>
                </button>
                <button
                  onClick={() => onOpenRfq('Konstruksi & Material')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Ajukan Rincian RAB Proyek</span>
                </button>
                <a
                  href="#rab-estimator"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20 transition flex items-center gap-2"
                >
                  <span>Simulasi Biaya Fit-Out</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Key Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                <div>
                  <p className="text-2xl font-black text-amber-400 font-heading">350+</p>
                  <p className="text-xs text-slate-400">Tempat Usaha Selesai</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400 font-heading">6 Bulan</p>
                  <p className="text-xs text-slate-400">Garansi Pemeliharaan</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-blue-400 font-heading">100%</p>
                  <p className="text-xs text-slate-400">Transparansi RAB</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-purple-400 font-heading">Gratis</p>
                  <p className="text-xs text-slate-400">Survey & Desain 3D Awal</p>
                </div>
              </div>
            </div>

            {/* Feature Highlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Standar Pengerjaan Sipil</h3>
                      <p className="text-xs text-slate-400">On-Time & Sesuai Spesifikasi</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                    Garansi SPK
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Desain Arsitektur & 3D Rendering</h4>
                      <p className="text-[11px] text-slate-400">Lihat visualisasi tempat usaha Anda sebelum pembangunan dimulai.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Material SNI & Fabrikasi Sendiri</h4>
                      <p className="text-[11px] text-slate-400">Workshop interior & workshop baja ringan langsung memangkas biaya perantara.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Pengawasan Mandor & Laporan Berkala</h4>
                      <p className="text-[11px] text-slate-400">Owner menerima dokumentasi progres foto & video mingguan secara transparan.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenRfq('Konstruksi & Material')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Konsultasikan Rencana Tempat Usaha</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Pillars */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Layanan Konstruksi & Material
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              Solusi Fisik & Ruang Usaha Menarik Pengunjung
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Dari konsep awal hingga serah terima kunci, kami siap mewujudkan outlet impian Anda.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: 'renovasi', label: 'Fit-Out & Renovasi Ruko/Kafe', icon: Home },
              { id: 'interior', label: 'Interior Custom & Furniture', icon: Paintbrush },
              { id: 'sipil', label: 'Pekerjaan Sipil, MEP & Plafon', icon: Hammer },
              { id: 'material', label: 'Pengadaan Material Konstruksi', icon: Truck },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
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
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
            {activeTab === 'renovasi' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                    <Home className="w-4 h-4" />
                    <span>Fit-Out Ruko, Kafe, Restoran & Outlet Retail</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Ubah Ruangan Kosong Menjadi Tempat Usaha Ramai Pengunjung
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kami menangani seluruh aspek renovasi tempat usaha komersial: pembongkaran, partisi dinding, lantai vinyl/keramik, instalasi exhaust kitchen, hingga fasad depan ruko dengan panel ACP estetik.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Renovasi Fasad Depan Ruko & Toko',
                      'Penataan Ruang Makan & Kasir Kafe',
                      'Instalasi Kitchen Exhaust Hood Resto',
                      'Partisi Kaca & Pintu Frameless',
                      'Pemasangan Kanopi Baja Ringan & Kaca',
                      'Pekerjaan Cat Dinding & Waterproofing',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Renovasi & Fit-Out Kafe/Ruko')}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Ajukan Survey Fit-Out
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Konsultasi Renovasi Ruko/Kafe')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Tanya Arsitek via WA
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Keunggulan Kontraktor BinaUsaha:
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <span className="font-bold text-amber-900">Jaminan Garansi Waktu Pengerjaan</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Komitmen penalti keterlambatan jika pengerjaan meleset dari jadwal SPK.</p>
                    </li>
                    <li className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <span className="font-bold text-amber-900">Material SNI Berkualitas Terjamin</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Tidak ada penurunan mutu spesifikasi di tengah jalan tanpa konfirmasi tertulis.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'interior' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                    <Paintbrush className="w-4 h-4" />
                    <span>Desain Interior & Furniture Custom Workshop</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Furniture Presisi Tinggi Langsung dari Workshop Produksi
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kami memproduksi meja barista, rak display produk, backdrop resepsionis, kitchen set komersial, dan partisi akustik dengan finishing HPL, duco, atau solid wood berkualitas tinggi.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Meja Barista & Kasir Ergonomis',
                      'Display Rak Toko & Gondola Display',
                      'Backdrop Resepsionis & Logo Signage',
                      'Meja & Kursi Kerja Kantor Custom',
                      'Finishing HPL Anti Gores & Air',
                      'Tata Cahaya Warm Accent Lamp',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Custom Interior & Furniture')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Pesan Furniture Custom
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Tanya Harga Furniture Custom')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Kirim Contoh Desain ke WA
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Material Furniture yang Digunakan:
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900">Bahan Baku Plywood / Multiplek Meranti (Bukan Serbuk MDF)</p>
                      <p className="text-slate-500 text-[11px]">Tahan terhadap kelembaban udara dan rayap, awet bertahun-tahun.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900">Finishing HPL Taco / Carta & Edging Rapi</p>
                      <p className="text-slate-500 text-[11px]">Pilihan ratusan motif kayu, marmer, solid, dan metallic modern.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sipil' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">
                    <Hammer className="w-4 h-4" />
                    <span>Pekerjaan Sipil, Kelistrikan & Plafon</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Struktur Kokoh, Kelistrikan Aman & Lantai Tahan Beban
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kami mengerjakan instalasi mekanikal, elektrikal, dan plumbing (MEP) standar keselamatan kerja, pemasangan lantai vinyl komersial, epoxy lantai gudang/dapur, dan perbaikan dak bocor.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Instalasi Panel MCB & Kabel Kelistrikan',
                      'Lantai Vinyl Tebal 3mm & SPC Interlock',
                      'Epoxy Lantai Dapur & Gudang Industri',
                      'Plafon Gypsum Drop Ceiling Estetik',
                      'Saluran Pembuangan Grease Trap Resto',
                      'Perbaikan Struktur & Pengecoran',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Pekerjaan Sipil & Kelistrikan')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Ajukan Pekerjaan Sipil & MEP
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Tanya Pekerjaan Sipil & MEP')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Konsultasi Teknis MEP
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Standar Keselamatan Kelistrikan Komersial:
                  </h4>
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-600">
                      Tempat usaha seperti kafe dan restoran memiliki beban listrik tinggi (mesin espresso, chiller, fryer). Tim kami memastikan pembagian grup beban merata untuk mencegah korsleting dan trip MCB.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'material' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <Truck className="w-4 h-4" />
                    <span>Pengadaan Material Konstruksi & Suplai Proyek</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Suplai Material Bangunan Langsung dari Pabrik & Distributor
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    BinaUsaha bekerjasama dengan jaringan produsen material terkemuka untuk menyediakan baja ringan, bata ringan (hebel), semen mortar, panel ACP, kaca tempered, sanitary, dan cat tembok dengan harga grosir terbaik.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Baja Ringan & Hollow Plafon Galvalum',
                      'Panel ACP (Aluminium Composite Panel)',
                      'Kaca Tempered 8mm, 10mm, 12mm',
                      'Cat Interior & Eksterior Weatherproof',
                      'Lantai Granit Tile 60x60 & 80x80',
                      'Pengiriman Cepat Armada Sendiri',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Pengadaan Material Proyek')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Minta Penawaran Harga Material
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Tanya Suplai Material Konstruksi')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Chat Tim Pengadaan Material
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Keuntungan B2B Procurement Material:
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="font-bold text-emerald-900">Harga Khusus Mitra & Kontraktor</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Diskon volume untuk pengadaan proyek berskala menengah hingga besar.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive RAB Estimator */}
      <section id="rab-estimator" className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Kalkulator RAB
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 mt-2">
                    Simulasi Estimasi Biaya Fit-Out Tempat Usaha
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Ketahui perkiraan biaya renovasi dan interior berdasarkan tipe dan luas area tempat usaha Anda.
                  </p>
                </div>

                {/* Step 1: Select Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Tipe Tempat Usaha:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'kafe', label: 'Kafe / Resto', desc: 'Estetik & F&B' },
                      { id: 'ruko', label: 'Ruko / Toko Retail', desc: 'Display & Fasad' },
                      { id: 'kantor', label: 'Kantor / Studio', desc: 'Partisi & Workstation' },
                      { id: 'booth', label: 'Booth Kontainer', desc: 'Compact & Mobile' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setProjType(item.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          projType === item.id
                            ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-xs leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Area Range Slider */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Luas Area Tempat Usaha: {areaSqm} m²
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={300}
                    step={5}
                    value={areaSqm}
                    onChange={(e) => setAreaSqm(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>15 m² (Booth Kecil)</span>
                    <span>100 m² (Ruko Standar)</span>
                    <span>300 m² (Resto Besar)</span>
                  </div>
                </div>

                {/* Step 3: Spec Grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Grade Spesifikasi Material:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSpecGrade('standard')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        specGrade === 'standard'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <p className="text-xs">Standard Commercial</p>
                      <p className="text-[10px] text-slate-400">Plywood, HPL Standard, Vinyl 2mm, Cat Pro</p>
                    </button>
                    <button
                      onClick={() => setSpecGrade('premium')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        specGrade === 'premium'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <p className="text-xs">Premium Luxury</p>
                      <p className="text-[10px] text-slate-400">SPC Interlock, HPL Texture/Marmer, Tempered Glass</p>
                    </button>
                  </div>
                </div>

                {/* Step 4: Include options */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    4. Termasuk Paket Pekerjaan Tambahan:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeMe}
                        onChange={(e) => setIncludeMe(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>Instalasi Kelistrikan & Tata Cahaya Lampu Warm Accent</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeFurniture}
                        onChange={(e) => setIncludeFurniture(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>Custom Furniture (Meja Barista / Kasir & Rak Display)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Estimate Summary Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white p-6 sm:p-8 rounded-2xl border border-amber-900 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                    Hasil Simulasi RAB
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">Estimasi Total Proyek Fit-Out</h4>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Tipe Proyek</span>
                    <span className="font-bold text-white uppercase">{projType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luas Bangunan</span>
                    <span className="font-bold text-white">{areaSqm} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Durasi Kerja</span>
                    <span className="font-bold text-amber-400">14 – 30 Hari Kerja</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garansi Pemeliharaan</span>
                    <span className="font-bold text-emerald-400">6 Bulan Resmi</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-400">Perkiraan Biaya Fit-Out:</p>
                  <p className="text-3xl font-black font-heading text-amber-400 mt-1">
                    {formatRupiah(calculateRab())}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    *Estimasi awal. Biaya akurat akan ditentukan setelah pengukuran di lokasi dan gambar 3D.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      const text = `Halo Kontraktor BinaUsaha, saya telah melakukan simulasi RAB:\n- Tipe: ${projType}\n- Luas: ${areaSqm} m2\n- Perkiraan: ${formatRupiah(
                        calculateRab()
                      )}\nMohon dijadwalkan survey lokasi gratis.`;
                      onAskWhatsapp(text);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Jadwalkan Survey via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onOpenRfq('Konstruksi & Material')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Kirim Dokumen Ukuran / Denah</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              FAQ Seputar Konstruksi & Material
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
                        isOpen ? 'rotate-180 text-amber-600' : ''
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

          {/* Bottom CTA Banner */}
          <div className="mt-12 bg-gradient-to-r from-amber-700 to-amber-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-bold font-heading">
              Wujudkan Tempat Usaha Impian Anda Bersama Ahlinya
            </h3>
            <p className="text-amber-100 text-sm max-w-xl mx-auto">
              Dapatkan konsultasi tata ruang dan survey gratis sekarang untuk memastikan outlet Anda selesai tepat waktu sebelum grand opening.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => onAskWhatsapp('Halo BinaUsaha, saya ingin mulai konsultasi renovasi tempat usaha')}
                className="bg-white text-amber-950 hover:bg-amber-50 font-bold text-sm px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Chat WhatsApp Tim Kontraktor
              </button>
              <button
                onClick={() => onOpenRfq('Konstruksi & Material')}
                className="bg-amber-950 hover:bg-black text-white font-bold text-sm px-6 py-3 rounded-xl border border-amber-400/40 transition cursor-pointer"
              >
                Ajukan RFQ Proyek
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
