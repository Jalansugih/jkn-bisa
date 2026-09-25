import React, { useState, useEffect } from 'react';
import {
  TreePine,
  Sprout,
  Sun,
  Droplets,
  Wind,
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
  Flower2,
  Leaf,
  Check,
  Recycle,
  Wheat,
} from 'lucide-react';
import { ServiceNavTabs, ServicePageKey } from './ServiceNavTabs';

interface AgroServicePageProps {
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

export const AgroServicePage: React.FC<AgroServicePageProps> = ({
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
  const [activeTab, setActiveTab] = useState<'greenhouse' | 'landscape' | 'saprotan' | 'green-energy'>('greenhouse');

  useEffect(() => {
    if (initialTab && ['greenhouse', 'landscape', 'saprotan', 'green-energy'].includes(initialTab)) {
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

  // Interactive Agro Estimator
  const [agroType, setAgroType] = useState<'greenhouse' | 'drip' | 'rooftop' | 'landscape'>('greenhouse');
  const [landArea, setLandArea] = useState<number>(100);
  const [includeIot, setIncludeIot] = useState<boolean>(true);
  const [includeTraining, setIncludeTraining] = useState<boolean>(true);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calculateAgroCost = () => {
    let ratePerSqm = 0;
    if (agroType === 'greenhouse') ratePerSqm = 450000;
    else if (agroType === 'drip') ratePerSqm = 180000;
    else if (agroType === 'rooftop') ratePerSqm = 350000;
    else if (agroType === 'landscape') ratePerSqm = 220000;

    let subtotal = landArea * ratePerSqm;
    if (includeIot) subtotal += 3500000;
    if (includeTraining) subtotal += 1500000;

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
      q: 'Apakah tim BinaUsaha menyediakan pendampingan sampai panen?',
      a: 'Ya! Setiap paket pembangunan Greenhouse dan sistem Hidroponik komersial sudah termasuk pendampingan agronomi langsung dari pakar pertanian kami selama 1 siklus panen penuh (30–60 hari).',
    },
    {
      q: 'Berapa luas lahan minimum untuk membangun Smart Greenhouse komersial?',
      a: 'Ukuran ideal untuk skala bisnis komersial mulai dari 100 m² (misalnya 10m x 10m). Namun kami juga melayani instalasi skala mikro atau rooftop kafe mulai dari luas 20 m².',
    },
    {
      q: 'Apa itu sistem Smart Greenhouse berbasis IoT?',
      a: 'Sistem ini dilengkapi sensor suhu, kelembaban, dan otomasi pompa nutrisi yang bisa dipantau dan dikendalikan otomatis dari smartphone Anda, sehingga menghemat tenaga kerja dan air hingga 60%.',
    },
    {
      q: 'Apakah bisa membantu penyerapan (off-taker) hasil panen?',
      a: 'Kami memiliki jaringan mitra horeka (hotel, restoran, supermarket, dan distributor sayur segar) yang siap menghubungkan hasil panen kebun Anda dengan pasar berdaya beli tinggi.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Nav Switcher */}
      <ServiceNavTabs
        activeService="agro"
        onSelectService={onSelectService}
        onBackToHome={onBackToHome}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-green-950 to-slate-900 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold tracking-wide uppercase">
                <Sprout className="w-3.5 h-3.5 text-green-400" />
                <span>Divisi Pertanian Presisi & Industri Berkelanjutan</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
                Pertanian Modern & Green Industry, <span className="text-green-400">Produktif & Ramah Lingkungan</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Tingkatkan produktivitas hasil panen hingga 300% dengan pembangunan Smart Greenhouse, irigasi tetes otomatis, landscape taman komersial, pengadaan bibit bersertifikasi, serta solusi energi terbarukan.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onAskWhatsapp('Konsultasi Solusi Agro & Smart Greenhouse BinaUsaha')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-green-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konsultasi Agronomi via WA</span>
                </button>
                <button
                  onClick={() => onOpenRfq('Agro & Green Industry')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Ajukan Rencana Lahan Tani</span>
                </button>
                <a
                  href="#agro-estimator"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20 transition flex items-center gap-2"
                >
                  <span>Simulasi Biaya Lahan</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Key Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                <div>
                  <p className="text-2xl font-black text-green-400 font-heading">180+</p>
                  <p className="text-xs text-slate-400">Greenhouse Dibangun</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-blue-400 font-heading">60%</p>
                  <p className="text-xs text-slate-400">Hemat Penggunaan Air</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-400 font-heading">3x Lipat</p>
                  <p className="text-xs text-slate-400">Peningkatan Hasil Panen</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-purple-400 font-heading">SOP & Garansi</p>
                  <p className="text-xs text-slate-400">Pendampingan Panen</p>
                </div>
              </div>
            </div>

            {/* Feature Highlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-green-500/30 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center font-bold">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Smart Farming System</h3>
                      <p className="text-xs text-slate-400">IoT & Irigasi Otomatis Presisi</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-[11px] font-bold border border-green-500/30">
                    High Yield
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Struktur Baja Ringan & Plastik UV 200 Micron</h4>
                      <p className="text-[11px] text-slate-400">Perlindungan optimal dari hama serangga dan cuaca ekstrem sepanjang tahun.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Sistem Drip Irrigation & Nutrisi AB Mix Presisi</h4>
                      <p className="text-[11px] text-slate-400">Pemberian nutrisi otomatis tepat takaran ke setiap titik akar tanaman.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Akses Pasar & Jaringan Mitra Penyerapan</h4>
                      <p className="text-[11px] text-slate-400">Dukungan distribusi panen melon premium, selada hidroponik, cabai, dan sayur segar.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenRfq('Agro & Green Industry')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Rencanakan Kebun / Smart Greenhouse</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pillars Tabs */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Layanan Agro Terpadu
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              Solusi Pertanian Modern & Industri Hijau
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Transformasikan lahan Anda menjadi sumber keuntungan yang berkelanjutan dengan teknologi ramah lingkungan.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: 'greenhouse', label: 'Smart Greenhouse & Hidroponik', icon: Sprout },
              { id: 'landscape', label: 'Landscape & Taman Komersial', icon: TreePine },
              { id: 'saprotan', label: 'Sarana Tani, Nutrisi & Bibit', icon: Wheat },
              { id: 'green-energy', label: 'Energi Surya & Olah Limbah', icon: Sun },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                    isSelected
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
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
            {activeTab === 'greenhouse' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 text-green-800 text-xs font-bold">
                    <Sprout className="w-4 h-4" />
                    <span>Smart Greenhouse & Sistem Hidroponik Komersial</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Panen Berkualitas Tinggi Bebas Pestisida Sepanjang Musim
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kami merancang dan membangun greenhouse skala komersial menggunakan rangka baja ringan anti karat, plastik UV impor 200 micron, insect net 50 mesh, instalasi gully hidroponik NFT/DFT, dan irigasi tetes otomatis.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Rangka Baja Ringan Kokoh Tahan Angin',
                      'Plastik UV 200 Micron & Insect Net 50 Mesh',
                      'Instalasi Pipa & Gully Hidroponik Food Grade',
                      'Sistem Fertigasi & Pompa Tandon Otomatis',
                      'Sensor Suhu & Kelembaban Udara IoT',
                      'Pendampingan Agronomi Sampai Panen',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Pembangunan Smart Greenhouse')}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Ajukan Survey Pembangunan Greenhouse
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Konsultasi Bisnis Greenhouse Melon / Sayur')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Tanya Ahli Agronomi
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Komoditas Favorit Greenhouse Komersial:
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <p className="font-bold text-green-950">🍈 Melon Premium Jepang / Korea (Inthanon, Golden Aroma)</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">Nilai jual tinggi (Rp 40.000 - Rp 90.000/kg) dengan siklus panen 65-75 hari.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <p className="font-bold text-green-950">🥬 Sayuran Daun Hidroponik (Selada Romaine, Butterhead, Kale)</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">Siklus panen cepat (setiap 30-35 hari) untuk pasokan tetap hotel & resto.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <p className="font-bold text-green-950">🍅 Tomat Cherry & Paprika</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">Produktivitas tinggi dengan harga jual stabil sepanjang tahun.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'landscape' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <TreePine className="w-4 h-4" />
                    <span>Penataan Landscape & Taman Estetik Tempat Usaha</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Ciptakan Suasana Asri & Instagrammable yang Memikat Pelanggan
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Taman tempat usaha (kafe outdoor, hotel, resort, kantor) yang tertata rapi meningkatkan daya tarik visual dan kenyamanan pengunjung. Kami merancang taman tropis, vertical garden, hingga rooftop garden modern.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Desain Landscape 3D Taman Komersial',
                      'Vertical Garden Otomatis (Indoor / Outdoor)',
                      'Rooftop Garden Kafe & Restoran',
                      'Pemasangan Rumput Gajah Mini & Sintetis',
                      'Sistem Sprinkler Penyiraman Otomatis',
                      'Pemilihan Pohon Peneduh & Tanaman Hias',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Penataan Landscape & Taman')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Ajukan Desain Landscape Taman
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Konsultasi Landscape Kafe/Kantor')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Kirim Foto Area via WA
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Solusi Area Hijau Komersial:
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="font-bold text-emerald-900">Vertical Garden Dinding</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Solusi hemat ruang untuk mempercantik area foto selfie pengunjung kafe.</p>
                    </li>
                    <li className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="font-bold text-emerald-900">Drainase & Beban Ringan Rooftop</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Media tanam perlite/cocopeat ringan yang aman untuk struktur atap dak beton.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'saprotan' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                    <Wheat className="w-4 h-4" />
                    <span>Sarana Produksi Pertanian (Saprotan) & Bibit Unggul</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Nutrisi Formula Tepat & Benih Bersertifikasi Resmi
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kami menyuplai nutrisi AB Mix murni dengan kelarutan 100%, pupuk organik cair fermentasi mikroba, media tanam steril (cocopeat, rockwool, sekam bakar), benih hibrida F1 berdaya kecambah lebih dari 90%, dan alat ukur digital (TDS/EC meter & pH meter).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Nutrisi AB Mix Sayur & Buah Premium',
                      'Benih Unggul F1 Bersertifikat Resmi',
                      'Media Tanam Rockwool Cultilene & Cocopeat',
                      'Pupuk Organik Cair Hayati Berkualitas',
                      'Alat Ukur TDS, EC & pH Meter Kalibrasi',
                      'Pengiriman Grosir ke Seluruh Indonesia',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Pengadaan Nutrisi & Benih Tani')}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Pesan Pasokan Saprotan
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Tanya Stok Nutrisi AB Mix & Benih')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Daftar Harga Grosir via WA
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Kelebihan Nutrisi & Benih BinaUsaha:
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900">Formula Unsur Hara Makro & Mikro Lengkap</p>
                      <p className="text-slate-500 text-[11px]">Mencegah daun kuning, buah rontok, dan defisiensi kalsium.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'green-energy' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">
                    <Sun className="w-4 h-4" />
                    <span>Pompa Solar Panel & Pengolahan Limbah Agro</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Efisiensi Biaya Operasional dengan Energi Bersih & Daur Ulang
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Pangkas tagihan listrik pompa irigasi kebun menggunakan sistem Pompa Tenaga Surya (PLTS On/Off-Grid), serta olah limbah organik pertanian / peternakan menjadi biogas dan pupuk kompos bernilai ekonomis tinggi.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Instalasi Pompa Irigasi Tenaga Surya (PLTS)',
                      'Sistem Komposter Limbah Organik Cepat',
                      'Reaktor Biogas Skala Komersial',
                      'Daur Ulang Air Nutrisi Sirkulasi Tertutup',
                      'Audit Efisiensi Energi Operasional',
                      'Sertifikasi Usaha Ramah Lingkungan',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Solusi Solar Panel & Green Energy')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Ajukan Solusi Green Energy
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Tanya PLTS Pompa Surya')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Konsultasi Energi Terbarukan
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Manfaat Penerapan Green Industry:
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-900">Bebas Biaya Listrik PLN untuk Pompa Kebun</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Sangat cocok untuk kebun di lokasi pelosok tanpa jaringan tiang listrik.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Agro Cost & Land Estimator */}
      <section id="agro-estimator" className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    Kalkulator Agro Modern
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 mt-2">
                    Simulasi Estimasi Biaya Pembangunan Lahan Tani
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Pilih tipe sistem pertanian modern dan sesuaikan luas area lahan untuk melihat rincian biaya pembangunan.
                  </p>
                </div>

                {/* Step 1: System type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Tipe Sistem Pertanian / Area Hijau:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'greenhouse', label: 'Smart Greenhouse', desc: 'Baja Ringan + UV' },
                      { id: 'drip', label: 'Drip Irigasi Kebun', desc: 'Sistem Tetes Otomatis' },
                      { id: 'rooftop', label: 'Rooftop Cafe Garden', desc: 'Taman Atas Gedung' },
                      { id: 'landscape', label: 'Landscape Taman', desc: 'Taman Estetik Usaha' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAgroType(item.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          agroType === item.id
                            ? 'border-green-600 bg-green-50/70 text-green-900 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-xs leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Land Area Slider */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Luas Area Lahan: {landArea} m²
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={10}
                    value={landArea}
                    onChange={(e) => setLandArea(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>20 m² (Mikro/Rooftop)</span>
                    <span>100 m² (Greenhouse Standar)</span>
                    <span>500 m² (Komersial Besar)</span>
                  </div>
                </div>

                {/* Step 3: Addon inclusions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Termasuk Otomasi & Pendampingan:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeIot}
                        onChange={(e) => setIncludeIot(e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
                      />
                      <span>Sensor Suhu, Kelembaban & Otomasi Pompa IoT (+ Rp 3.500.000)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={includeTraining}
                        onChange={(e) => setIncludeTraining(e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
                      />
                      <span>Pendampingan Agronomi Langsung 1 Siklus Panen (+ Rp 1.500.000)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Estimate Summary Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-green-950 text-white p-6 sm:p-8 rounded-2xl border border-green-900 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-400">
                    Hasil Simulasi Investasi
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">Estimasi Total Proyek Agro</h4>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Sistem Pertanian</span>
                    <span className="font-bold text-white uppercase">{agroType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luas Lahan</span>
                    <span className="font-bold text-white">{landArea} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durasi Pembangunan</span>
                    <span className="font-bold text-green-400">10 – 20 Hari Kerja</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garansi Konstruksi</span>
                    <span className="font-bold text-emerald-400">1 Tahun Resmi</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-400">Perkiraan Biaya Instalasi:</p>
                  <p className="text-3xl font-black font-heading text-green-400 mt-1">
                    {formatRupiah(calculateAgroCost())}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    *Estimasi awal. Biaya mencakup konstruksi rangka, atap UV, instalasi fertigasi, dan bibit awal.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      const text = `Halo Agronom BinaUsaha, saya telah melakukan simulasi Agro:\n- Sistem: ${agroType}\n- Luas: ${landArea} m2\n- Perkiraan: ${formatRupiah(
                        calculateAgroCost()
                      )}\nMohon info dan jadwal konsultasi lahan.`;
                      onAskWhatsapp(text);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Konsultasi Lahan via WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onOpenRfq('Agro & Green Industry')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Kirim Detail Lokasi Lahan (RFQ)</span>
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
            <span className="text-xs font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              FAQ Seputar Agro & Green Industri
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
                        isOpen ? 'rotate-180 text-green-600' : ''
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
          <div className="mt-12 bg-gradient-to-r from-green-700 to-emerald-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-bold font-heading">
              Mulai Usaha Pertanian Modern yang Menguntungkan
            </h3>
            <p className="text-green-100 text-sm max-w-xl mx-auto">
              Hubungi tim agronomist kami untuk survey kelayakan lahan dan perencanaan sistem greenhouse hidroponik hari ini.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => onAskWhatsapp('Halo BinaUsaha, saya ingin mulai konsultasi pertanian modern')}
                className="bg-white text-green-950 hover:bg-green-50 font-bold text-sm px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Hubungi Agronomist via WhatsApp
              </button>
              <button
                onClick={() => onOpenRfq('Agro & Green Industry')}
                className="bg-green-950 hover:bg-black text-white font-bold text-sm px-6 py-3 rounded-xl border border-green-400/40 transition cursor-pointer"
              >
                Ajukan RFQ Proyek Agro
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
