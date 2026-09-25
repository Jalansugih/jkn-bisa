import React from 'react';
import { Globe, Stamp, Store, ArrowRight } from 'lucide-react';

interface SolutionsGridSectionProps {
  onSelectProduct: (prodKey: string) => void;
}

export const SolutionsGridSection: React.FC<SolutionsGridSectionProps> = ({ onSelectProduct }) => {
  return (
    <section className="py-20 bg-white border-t border-slate-200" id="solusi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-700 font-semibold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Ekosistem Terpadu
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Solusi Lengkap UMKM Indonesia
          </h2>
          <p className="text-slate-600 text-base">
            Semua yang dibutuhkan untuk mempermudah operasional dan menaikkan omset usaha Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition group flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-5 shadow-xs border border-blue-200">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">Website Profesional</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Situs toko online dan katalog produk berdesain menarik dengan integrasi WhatsApp.
              </p>
            </div>
            <button
              onClick={() => onSelectProduct('website_pro')}
              className="text-xs font-bold text-blue-600 flex items-center gap-1 cursor-pointer hover:underline text-left group-hover:text-blue-700"
            >
              Order Paket Website <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/5 transition group flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-5 shadow-xs border border-emerald-200">
                <Stamp className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">Legalitas NIB & Halal</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Pengurusan NIB RBA dan sertifikasi Halal agar usaha siap kerja sama besar.
              </p>
            </div>
            <button
              onClick={() => onSelectProduct('legalitas_nib')}
              className="text-xs font-bold text-emerald-600 flex items-center gap-1 cursor-pointer hover:underline text-left group-hover:text-emerald-700"
            >
              Order Legalitas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-900/5 transition group flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-5 shadow-xs border border-purple-200">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">RajaKas Kasir Digital</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Aplikasi POS pintar pencatatan stok dan laporan omset harian yang akurat.
              </p>
            </div>
            <button
              onClick={() => onSelectProduct('rajakas_pos')}
              className="text-xs font-bold text-purple-600 flex items-center gap-1 cursor-pointer hover:underline text-left group-hover:text-purple-700"
            >
              Order RajaKas POS <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
