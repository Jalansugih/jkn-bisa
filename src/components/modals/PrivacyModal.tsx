import React from 'react';
import { Lock, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacyModal"
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
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-block shadow-xs">
              Perlindungan Data Pelanggan
            </span>
            <h3 className="font-heading font-bold text-xl text-slate-900">Kebijakan Privasi BinaUsaha</h3>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
          <p className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 font-medium text-blue-900">
            Kebijakan Privasi ini menjelaskan komitmen BinaUsaha dalam mengumpulkan, menjaga, dan melindungi privasi serta keamanan data pribadi pengguna.
          </p>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">1. Informasi Yang Dikumpulkan</h4>
            <p className="text-slate-600">
              Kami mengumpulkan informasi penting seperti nama lengkap, nomor WhatsApp, email, identitas usaha, KTP/NPWP, serta alamat tempat usaha khusus untuk memproses administrasi legalitas dan pendampingan bisnis.
            </p>

            <h4 className="font-bold text-slate-900 text-sm pt-2">2. Penggunaan & Keamanan Data</h4>
            <p className="text-slate-600">
              Data Anda tersimpan dalam server terenkripsi dengan proteksi berlapis. Informasi hanya diakses oleh konsultan legal dan teknis internal yang bertugas langsung menangani proyek Anda.
            </p>

            <h4 className="font-bold text-slate-900 text-sm pt-2">3. Hak Akses Pelanggan</h4>
            <p className="text-slate-600">
              Anda dapat mengajukan permohonan pembaruan, perbaikan, atau penghapusan arsip dokumen kapan saja dengan menghubungi tim customer support BinaUsaha.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              Tutup Kebijakan Privasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
