import React from 'react';
import { ShieldCheck, Store, FileBarChart, MessageCircle } from 'lucide-react';

export const TrustBadgeBar: React.FC = () => {
  return (
    <section className="py-6 bg-blue-50/50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-4">
          Solusi Terverifikasi & Terintegrasi untuk Pengelolaan Keuangan & Legalitas Usaha
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2.5 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800 text-left">100% Legalitas Resmi AHU</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2.5 shadow-xs">
            <Store className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800 text-left">Kasir POS Cloud 24/7</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2.5 shadow-xs">
            <FileBarChart className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800 text-left">Rekap Laporan Instan</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2.5 shadow-xs">
            <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800 text-left">Support WhatsApp 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
};
