import React, { useState } from 'react';
import {
  Building,
  Search,
  ArrowRight,
  Send,
  Compass,
  CheckCircle,
  ShieldCheck,
  Clock,
  Laptop,
  FileText,
  HardHat,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface HeroSectionProps {
  onSearch?: (keyword: string) => void;
  onOpenRfqModal?: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenOrderPtPro?: () => void;
  onOpenConsultation?: () => void;
  onOpenOrderTrack?: () => void;
}

const POPULAR_SEARCH_TAGS = [
  'Pendirian PT Pro',
  'Website Toko Online',
  'RajaKas POS Kasir',
  'NIB & Halal',
  'Paket Bundling',
  'Komputer Kantor',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenRfqModal,
}) => {
  const [keyword, setKeyword] = useState('');

  const triggerSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    } else {
      const el = document.getElementById('produk');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(keyword.trim());
  };

  const handleTagClick = (tag: string) => {
    setKeyword(tag);
    triggerSearch(tag);
  };

  return (
    <section
      id="beranda"
      className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-gradient-to-b from-blue-50/70 via-sky-50/30 to-white text-slate-900 border-b border-slate-200/80"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.08) 0%, transparent 65%), linear-gradient(to right, rgba(37, 99, 235, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 99, 235, 0.04) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 48px 48px, 48px 48px',
      }}
    >
      {/* Architectural Glow Accents */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-400/10 filter blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-sky-400/10 filter blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Platform Pemasaran & Penghubung Kebutuhan Usaha</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 leading-[1.18]">
              Temukan Produk dan Solusi untuk{' '}
              <span className="text-blue-600">
                Kebutuhan Usaha Anda
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
              BinaUsaha menghadirkan berbagai produk, jasa, dan solusi dari jaringan mitra terpilih untuk membantu memenuhi kebutuhan usaha, proyek, institusi, dan organisasi Anda.
            </p>

            {/* Interactive Quick Search Bar */}
            <div className="space-y-3 max-w-2xl">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xl shadow-blue-900/5 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center gap-2.5 px-3 py-2 flex-1 w-full relative">
                  <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    id="heroSearchInput"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Anda sedang mencari apa? (Contoh: website, PT, POS kasir, NIB...)"
                    className="w-full text-xs md:text-sm text-slate-900 bg-transparent focus:outline-none placeholder-slate-400 pr-6"
                  />
                  {keyword && (
                    <button
                      type="button"
                      onClick={() => setKeyword('')}
                      className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                      title="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  id="btn-hero-search"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition duration-300 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Solusi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Popular Search Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Populer:</span>
                </span>
                {POPULAR_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 transition duration-150 text-[11px] font-semibold cursor-pointer shadow-xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#kebutuhan"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center transition duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 flex items-center gap-2 group cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Ajukan Kebutuhan</span>
              </a>
              <a
                href="#produk"
                onClick={(e) => {
                  e.preventDefault();
                  triggerSearch('');
                }}
                className="bg-white hover:bg-blue-50/60 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-sm text-center transition duration-300 flex items-center gap-2 backdrop-blur-md shadow-xs cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Jelajahi Katalog</span>
              </a>
              <a
                id="btn-hero-rajakas"
                href="https://rajakas.id"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center transition duration-300 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 flex items-center gap-2 cursor-pointer group"
              >
                <span>Buka RajaKas.ID</span>
                <ExternalLink className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Trust / Positioning Badges */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200">
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-800 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span>Penghubung Kebutuhan</span>
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-800 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Mitra Terverifikasi</span>
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-800 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Penawaran Cepat</span>
              </div>
            </div>
          </div>

          {/* Hero Side Card Preview */}
          <div className="lg:col-span-5 relative w-full h-auto min-h-[420px] rounded-3xl">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xl shadow-blue-900/10 text-slate-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    Proses Cepat
                  </span>
                  <h3 className="font-heading font-bold text-base text-slate-900 mt-1.5">
                    Pengajuan Kebutuhan Usaha
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs">
                  HUB
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3 hover:border-blue-300 hover:bg-blue-50/40 transition">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Pengadaan IT & Perangkat Kantor</div>
                    <div className="text-[11px] text-slate-500">Komputer, laptop, printer & jaringan kantor</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3 hover:border-emerald-300 hover:bg-emerald-50/40 transition">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Legalitas & Perizinan Resmi</div>
                    <div className="text-[11px] text-slate-500">Pendirian PT/CV, NIB RBA, HAKI & Sertifikat</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3 hover:border-amber-300 hover:bg-amber-50/40 transition">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Konstruksi & Material Bangunan</div>
                    <div className="text-[11px] text-slate-500">Bahan bangunan, perlengkapan & perkakas</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-center">
                <p className="text-xs font-semibold text-blue-900 mb-2.5">
                  Punya Kebutuhan Spesifik / Proyek Lain?
                </p>
                <button
                  onClick={onOpenRfqModal}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 w-full cursor-pointer"
                >
                  <span>Kirim Detail Kebutuhan Anda</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
