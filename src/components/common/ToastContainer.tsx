import React from 'react';
import { ToastMessage } from '../../types';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove?: (id: string) => void;
  onCloseToast?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove, onCloseToast }) => {
  const handleRemove = onRemove || onCloseToast || (() => {});
  return (
    <div
      id="toastContainer"
      className="fixed bottom-24 right-6 z-[200] flex flex-col gap-3 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        let bg = 'bg-slate-900';
        let Icon = Info;
        if (toast.type === 'success') {
          bg = 'bg-emerald-600';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-600';
          Icon = AlertTriangle;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-600';
          Icon = XCircle;
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            onClick={() => handleRemove(toast.id)}
            className={`p-3.5 rounded-2xl shadow-float text-xs font-bold text-white flex items-center gap-2.5 transition-all duration-300 pointer-events-auto cursor-pointer animate-in fade-in slide-in-from-bottom-2 ${bg}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
