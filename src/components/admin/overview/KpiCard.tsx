import React from 'react';

export type KpiTone = 'blue' | 'amber' | 'indigo' | 'emerald' | 'rose';

const ICON_TONE: Record<KpiTone, string> = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-100 text-amber-700',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
};

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: KpiTone;
  /** Baris keterangan di bawah angka. */
  footer?: React.ReactNode;
  /** true = kartu menyala (ada yang harus dikerjakan). */
  attention?: boolean;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon: Icon, tone, footer, attention, onClick }) => {
  const Wrapper: React.ElementType = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`text-left bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between gap-3 transition-all ${
        attention ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200/80'
      } ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''}`}
    >
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          {attention && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />}
          <span className="truncate">{label}</span>
        </p>
        <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 truncate">{value}</h3>
        {footer && <div className="text-[11px] font-semibold">{footer}</div>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ICON_TONE[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </Wrapper>
  );
};
