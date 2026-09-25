import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';

interface TopPromoBarProps {
  onClaimPtPro?: () => void;
  onSelectPtPro?: () => void;
}

export const TopPromoBar: React.FC<TopPromoBarProps> = ({ onClaimPtPro, onSelectPtPro }) => {
  const handleClaim = onClaimPtPro || onSelectPtPro;
  return (
    <div
      id="top-promo-bar"
      className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap z-[60] relative shadow-xs"
    >
      <span className="bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
        PROMO SPESIAL
      </span>
      <span>
        🎉 Dapatkan <strong className="font-bold underline decoration-amber-300">GRATIS Aplikasi Sistem Keuangan Usaha</strong> jika memilih <strong className="font-bold underline decoration-amber-300">Paket Pendirian PT Pro</strong>!
      </span>
      <button
        id="btn-claim-pt-pro-header"
        onClick={handleClaim}
        className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-0.5 rounded-full text-[11px] font-bold transition shadow-xs ml-1 flex items-center gap-1 cursor-pointer"
      >
        <Gift className="w-3.5 h-3.5 text-slate-900" />
        <span>Klaim Paket PT Pro</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
