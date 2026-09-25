import React from 'react';
import { FileText, X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="termsModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 border-b border-slate-200 pb-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold border border-blue-200 flex-shrink-0 shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-block shadow-xs">
              Dokumen Resmi Legalitas
            </span>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Syarat & Ketentuan Layanan BinaUsaha
            </h3>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
          <p className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 font-medium text-blue-900">
            Selamat datang di BinaUsaha. Dengan mendaftar, memesan paket layanan, atau menggunakan sistem kami, Anda secara resmi menyetujui seluruh syarat dan ketentuan penggunaan di bawah ini:
          </p>

          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Cakupan Layanan Platform
              </h4>
              <p className="pl-7 text-slate-600">
                BinaUsaha adalah ekosistem pendampingan digital UMKM yang menyediakan pengurusan legalitas badan usaha (PT, CV, NIB, Sertifikasi Halal), pembuatan website bisnis, integrasi kasir digital POS (RajaKas), serta konsultasi operasional usaha.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Keabsahan & Kelengkapan Dokumen
              </h4>
              <p className="pl-7 text-slate-600">
                Pelanggan wajib menyediakan dokumen identitas (KTP, NPWP, Pasfoto) dan informasi perusahaan yang valid serta sah menurut hukum Republik Indonesia. BinaUsaha tidak bertanggung jawab atas penolakan dari sistem pemerintah (OSS/AHU) yang timbul dari ketidakabsahan berkas dari pemohon.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Ketentuan Pembayaran & Kwitansi
              </h4>
              <p className="pl-7 text-slate-600">
                Seluruh biaya pemesanan paket dicatat transparan dan diterbitkan melalui Invoice/Kwitansi Resmi BinaUsaha. Pembayaran yang sudah disetorkan untuk biaya pendaftaran ke dinas/kemenkumham bersifat final sesuai tahap verifikasi yang sedang berjalan.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                  4
                </span>
                Jaminan Kerahasiaan Data (NDA)
              </h4>
              <p className="pl-7 text-slate-600">
                Seluruh berkas rahasia, akta usaha, dan data keuangan Anda dilindungi penuh oleh enkripsi sistem BinaUsaha dan tidak akan pernah disebarluaskan kepada pihak ketiga yang tidak berkepentingan.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Terakhir Diperbarui: {new Date().getFullYear()}</span>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              Saya Mengerti & Setuju
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
