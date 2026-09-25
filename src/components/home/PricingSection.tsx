import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectProduct: (prodKey: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectProduct }) => {
  return (
    <section className="py-20 bg-white border-t border-slate-200" id="harga">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Investasi Bisnis Transparan
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4 leading-tight">
            Paket Layanan Tanpa Biaya Tersembunyi
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Pilih paket yang sesuai dengan tahapan bisnis Anda. Semua paket sudah termasuk garansi pendampingan dan dukungan teknis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: STARTER */}
          <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between relative">
            <div>
              <div className="mb-6 pb-6 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full">
                  Starter System
                </span>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-3 mb-1">
                  RajaKas POS Digital
                </h3>
                <p className="text-xs text-slate-500">Sistem kasir digital & pencatatan transaksi harian simpel.</p>
                <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-extrabold font-heading text-slate-900">Rp 1.118.600</span>
                  <span className="text-xs text-slate-400 line-through font-medium">Rp 2.237.200</span>
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                    -50%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ tahun</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>1 Lisensi Software Kasir RajaKas POS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pencatatan kasir & cetak struk Bluetooth</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Laporan omset harian & rekap stok</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Bisa diakses dari HP, Tablet & PC</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Support teknis WhatsApp 3 Bulan</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectProduct('rajakas_pos')}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-3.5 rounded-xl font-bold text-xs transition duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pilih Paket Starter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tier 2: PROFESSIONAL (PALING POPULER) */}
          <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-7 border-2 border-blue-500 text-white shadow-xl shadow-blue-900/20 flex flex-col justify-between relative transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
              🔥 Paling Direkomendasikan
            </div>

            <div>
              <div className="mb-6 pb-6 border-b border-white/20">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full">
                  Growth & Digital
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white mt-3 mb-1">
                  Website UMKM Pro + POS
                </h3>
                <p className="text-xs text-blue-100/90">Kombinasi website toko online katalog & kasir digital.</p>
                <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl md:text-4xl font-extrabold font-heading text-white">Rp 3.147.900</span>
                  <span className="text-xs text-blue-200/70 line-through font-medium">Rp 10.493.000</span>
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                    -70%
                  </span>
                  <span className="text-xs text-blue-200 font-medium">/ sekali bayar</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-blue-50 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span>Website Katalog Toko Online Domain .com/.id</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span>Checkout Order Otomatis Terhubung WA Toko</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span>Software Kasir RajaKas POS Multi-Outlet</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span>Laporan Keuangan Laba-Rugi Instan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span>Support Pendampingan WA 6 Bulan</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectProduct('website_pro')}
              className="w-full bg-white hover:bg-blue-50 text-blue-800 py-4 rounded-xl font-bold text-xs transition duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pilih Paket Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tier 3: AKSELERASI LEGALITAS */}
          <div className="bg-slate-50 rounded-3xl p-7 border border-emerald-300 shadow-xs hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between relative">
            <div>
              <div className="mb-6 pb-6 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                  All-In-One Scale-Up
                </span>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-3 mb-1">
                  Paket PT Pro & Keuangan
                </h3>
                <p className="text-xs text-slate-500">Pendirian PT Umum Dengan Bonus Aplikasi System Keuangan.</p>
                <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-extrabold font-heading text-emerald-600">Rp 5.498.600</span>
                  <span className="text-xs text-slate-400 line-through font-medium">Rp 15.997.200</span>
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                    -50%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ paket resmi</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pendirian PT Resmi (Akta Notaris & SK AHU)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>NIB RBA & NPWP Perusahaan Badan Hukum</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-emerald-700">FREE System Keuangan Usaha (Laba Rugi)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>FREE Website Katalog & Kasir RajaKas POS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Konsultasi Legalitas Prioritas 12 Bulan</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectProduct('pt_pro')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-xs transition duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pilih Paket PT Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
