import React, { useState } from 'react';
import { CATEGORIES_MARQUEE } from '../../data/mockData';
import {
  Laptop,
  FileCheck,
  HardHat,
  Sprout,
  Pause,
  Play,
  ArrowRight,
} from 'lucide-react';

interface KategoriMarqueeSectionProps {
  onSelectCategory: (catId: string) => void;
}

export const KategoriMarqueeSection: React.FC<KategoriMarqueeSectionProps> = ({ onSelectCategory }) => {
  const [isPaused, setIsPaused] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-6 h-6" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6" />;
      case 'HardHat':
        return <HardHat className="w-6 h-6" />;
      case 'Sprout':
        return <Sprout className="w-6 h-6" />;
      default:
        return <Laptop className="w-6 h-6" />;
    }
  };

  const renderCard = (cat: typeof CATEGORIES_MARQUEE[0], index: number, setNum: number) => (
    <div
      key={`${setNum}-${cat.id}-${index}`}
      className="w-[310px] sm:w-[360px] lg:w-[400px] flex-shrink-0 bg-white rounded-2xl p-7 border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between group shadow-xs"
    >
      <div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-xs transition-colors bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white"
        >
          {getIcon(cat.icon)}
        </div>
        <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">{cat.name}</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">{cat.desc}</p>
      </div>
      <div className="pt-4 border-t border-slate-100">
        <a
          href="#kebutuhan"
          onClick={() => onSelectCategory(cat.id)}
          className="text-xs font-bold text-blue-600 flex items-center gap-1.5 hover:underline cursor-pointer group-hover:text-blue-700"
        >
          <span>{cat.btnText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-200 overflow-hidden" id="kategori">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Solusi Lengkap
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4 leading-tight">
            Kategori Utama Kebutuhan Usaha
          </h2>
          <p className="text-slate-600 text-sm md:text-base mb-4">
            Jelajahi berbagai segmen kebutuhan usaha yang siap kami hubungkan dengan jaringan mitra profesional.
          </p>
          <div className="inline-flex items-center justify-center gap-3">
            <button
              id="toggleMarqueeBtn"
              onClick={() => setIsPaused(!isPaused)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isPaused
                  ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-600" /> : <Pause className="w-3.5 h-3.5 text-blue-600" />}
              <span>{isPaused ? 'Putar Gerakan' : 'Jeda Gerakan'}</span>
            </button>
            <span className="text-xs text-slate-300 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Arahkan kursor pada kartu untuk menghentikan sementara
            </span>
          </div>
        </div>
      </div>

      {/* Marquee Cards Container moving from Right to Left */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Blur Shadow Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10"></div>

        <div
          id="kategoriMarqueeTrack"
          className={`animate-marquee-track flex gap-6 px-4 ${isPaused ? 'is-paused' : ''}`}
        >
          {/* SET 1 */}
          {CATEGORIES_MARQUEE.map((cat, index) => renderCard(cat, index, 1))}
          {/* SET 2 (Duplicate for smooth infinite marquee loop) */}
          {CATEGORIES_MARQUEE.map((cat, index) => renderCard(cat, index, 2))}
        </div>
      </div>
    </section>
  );
};
