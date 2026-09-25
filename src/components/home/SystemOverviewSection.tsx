import React from 'react';
import { LayoutGrid, Store, ShieldCheck } from 'lucide-react';

interface SystemOverviewSectionProps {
  onSelectProduct: (id: string) => void;
}

export const SystemOverviewSection: React.FC<SystemOverviewSectionProps> = ({ onSelectProduct }) => {
  return (
    <section className="py-8 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  RajaKas & BinaUsaha System
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">Overview Keuangan & Operasional Usaha</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Live
            </span>
          </div>

          {/* Dashboard Mockup Content */}
          <div className="space-y-3.5 flex-1 pr-1">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-100/70 border border-blue-200 px-2.5 py-1 rounded-lg">
                  Laporan Keuangan Bulan Ini
                </span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  +18.4% Omset
                </span>
              </div>
              <h4 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">
                Rp 42.850.000
              </h4>
              <div className="w-full bg-slate-200 rounded-full h-2 my-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full w-[82%] transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Target Penjualan Kasir POS</span>
                <span className="font-bold text-slate-900">82% Tercapai</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 border border-purple-200 rounded-lg">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Kasir Digital POS</p>
                  <p className="text-xs font-bold text-slate-900">2 Outlet Active</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Legalitas & NIB</p>
                  <p className="text-xs font-bold text-emerald-700">100% Legal</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 border border-blue-500 rounded-xl p-4 text-white shadow-md shadow-blue-700/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-blue-100">Aplikasi Keuangan Gratis</p>
                <h5 className="font-heading font-bold text-sm text-white">Termasuk di Paket PT Pro</h5>
                <p className="text-[11px] text-blue-200">Bonus senilai Rp 2.100.000</p>
              </div>
              <button
                onClick={() => onSelectProduct('pt_pro')}
                className="bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition text-center cursor-pointer"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
