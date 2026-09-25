import React from 'react';
import { AlertCircle, TrendingDown, Clock, FileX } from 'lucide-react';

interface PainPointsSectionProps {
  onOpenConsultation?: () => void;
}

export const PainPointsSection: React.FC<PainPointsSectionProps> = ({ onOpenConsultation }) => {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-rose-700 font-bold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 inline-block mb-3 shadow-xs">
            Tantangan Pengelolaan Bisnis
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4 leading-tight">
            Masih Mengelola Keuangan & Usaha dengan Cara Lama?
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Banyak pemilik usaha kehilangan potensi omset dan waktu berharga karena sistem pencatatan & operasional yang terpisah-pisah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:bg-rose-50/20 hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900">Arus Kas Tidak Teratur</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uang pribadi dan kas toko sering tercampur sehingga laba bersih usaha tidak terlacak secara akurat.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:bg-rose-50/20 hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
              <FileX className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900">Legalitas Belum Lengkap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sulit membuka rekening bank perusahaan, ikut tender proyek, atau bermitra dengan korporasi besar tanpa izin resmi.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:bg-rose-50/20 hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900">Pencatatan Stok Manual</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stok barang sering selisih atau habis tanpa disadari karena masih mencatat nota manual di buku tulis.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 hover:bg-rose-50/20 hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900">Toko Belum Punya Website</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hanya mengandalkan sosial media tanpa katalog online mandiri yang bisa diakses dan dicheckout 24 jam nonstop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
