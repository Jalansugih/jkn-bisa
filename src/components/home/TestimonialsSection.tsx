import React from 'react';
import { TESTIMONIALS } from '../../data/mockData';
import { Star, CheckCircle2, Stamp, Store, Globe, ShieldCheck, Zap } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const getPackageIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Stamp':
        return <Stamp className="w-3.5 h-3.5" />;
      case 'Store':
        return <Store className="w-3.5 h-3.5" />;
      case 'Globe':
        return <Globe className="w-3.5 h-3.5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="py-20 bg-white border-t border-slate-200" id="testimoni">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-700 font-semibold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Testimoni Pelanggan
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Ulasan & Pengalaman Klien BinaUsaha
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Dengarkan kisah sukses nyata dari pemilik usaha mikro, kecil, dan menengah yang telah mempercayakan pertumbuhan bisnisnya kepada BinaUsaha.
          </p>
        </div>

        {/* Testimonials Summary Bar */}
        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 shadow-xs mb-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mb-1 flex items-center justify-center gap-1">
              4.9
              <span className="text-amber-500 text-xl inline-flex items-center">
                <Star className="w-5 h-5 fill-amber-500" />
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Rata-rata Rating Kepuasan</p>
          </div>
          <div className="p-2 pt-4 md:pt-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-blue-600 mb-1">500+</div>
            <p className="text-xs text-slate-600 font-medium">UMKM Telah Beralih Digital</p>
          </div>
          <div className="p-2 pt-4 md:pt-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-600 mb-1">100%</div>
            <p className="text-xs text-slate-600 font-medium">Garansi Legalitas Resmi AHU</p>
          </div>
          <div className="p-2 pt-4 md:pt-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-blue-800 mb-1">24/7</div>
            <p className="text-xs text-slate-600 font-medium">Dukungan Pendampingan WhatsApp</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                  <span className="text-xs text-slate-500 font-semibold ml-1.5">{item.rating.toFixed(1)}</span>
                </div>
                {/* Review Body */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6">"{item.review}"</p>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 border border-blue-200 text-blue-700 mb-4"
                >
                  {getPackageIcon(item.packageIcon)}
                  <span>{item.package}</span>
                </span>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.gradient} text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
