import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState<boolean>(false);

  // If user fully closes the widget, show a discreet, compact restore button
  if (!isVisible) {
    return (
      <div className="fixed bottom-5 right-5 z-[180]">
        <button
          id="btn-reopen-whatsapp"
          onClick={() => {
            setIsVisible(true);
            setIsTooltipDismissed(false);
          }}
          title="Buka Chat WhatsApp CS"
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 text-xs font-bold rounded-full shadow-lg border border-emerald-200 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
          <span>Chat CS</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-5 right-5 z-[180] flex items-end gap-2.5 transition-all duration-300"
    >
      {/* Floating Prompt Card / Tooltip with Close Button */}
      {!isTooltipDismissed && (
        <div
          id="whatsapp-cta-card"
          className="relative flex items-center gap-3 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold pl-3.5 pr-8 py-2.5 rounded-2xl shadow-xl border border-emerald-100/80 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
          <div>
            <div className="font-bold text-slate-900 text-[11px] sm:text-xs leading-tight">
              Customer Support WhatsApp 24/7
            </div>
            <div className="text-[10px] text-slate-500 font-normal">
              Konsultasi & bantuan cepat
            </div>
          </div>

          {/* Close Tooltip Button */}
          <button
            id="btn-close-whatsapp-tooltip"
            onClick={(e) => {
              e.stopPropagation();
              setIsTooltipDismissed(true);
            }}
            title="Tutup pesan"
            aria-label="Tutup pesan bantuan WhatsApp"
            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Floating WhatsApp Action Container */}
      <div className="relative group">
        {/* Global Widget Dismiss (X) button */}
        <button
          id="btn-dismiss-whatsapp-widget"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          title="Sembunyikan tombol WhatsApp"
          aria-label="Sembunyikan tombol WhatsApp"
          className="absolute -top-1.5 -right-1.5 z-20 w-5 h-5 bg-slate-700/85 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>

        {/* FAB WhatsApp Link Button */}
        <a
          id="fab-whatsapp-btn"
          href="https://wa.me/6285195979888?text=Halo%20BinaUsaha,%20saya%20butuh%20bantuan%20dan%20konsultasi%20layanan%20instan."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Customer Support via WhatsApp"
          className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Pulsing outer ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none"></span>

          {/* Online status badge */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full z-10"></span>

          {/* Official WhatsApp SVG Icon */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10 drop-shadow-xs"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

