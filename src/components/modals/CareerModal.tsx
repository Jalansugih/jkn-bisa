import React from 'react';
import { Briefcase, X, MessageCircle } from 'lucide-react';

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="careerModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold border border-blue-200 shadow-xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-block shadow-xs">
              Bergabung Bersama Kami
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900">Karier & Peluang Magang</h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          BinaUsaha terus berkembang membantu ribuan UMKM dan pelaku usaha di seluruh Indonesia. Kami mengundang talenta muda dan profesional berkarya bersama kami:
        </p>

        <div className="space-y-3 mb-5">
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Fullstack Web Developer</h4>
                <p className="text-[11px] text-slate-500">Divisi Teknologi • Full-time / Remote</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                Terbuka
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Legal Officer & Perizinan Usaha</h4>
                <p className="text-[11px] text-slate-500">Divisi Legalitas • Full-time / Hybrid</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                Terbuka
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Account Executive & Konsultan Usaha</h4>
                <p className="text-[11px] text-slate-500">Divisi Partnership • Full-time</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                Terbuka
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-900">Tertarik Bergabung?</p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Kirimkan CV dan Portofolio terbaru Anda ke email recruitment kami atau hubungi Tim HRD via WhatsApp.
          </p>
          <div className="pt-2 flex gap-2">
            <a
              href="https://wa.me/6285195979888?text=Halo%20HRD%20BinaUsaha,%20saya%20tertarik%20melamar%20posisi%20di%20BinaUsaha"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi HRD via WA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
