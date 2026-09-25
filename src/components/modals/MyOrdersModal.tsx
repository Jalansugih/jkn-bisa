import React from 'react';
import { OrderItem } from '../../types';
import { ShoppingBag, X, MessageCircle, Clock } from 'lucide-react';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  onOpenOrderTrack: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOpenOrderTrack,
}) => {
  if (!isOpen) return null;

  const handleWhatsappConfirm = (order: OrderItem) => {
    const text = `Halo BinaUsaha, saya ingin menanyakan progress pesanan saya:\n\n*Order ID:* ${order.id}\n*Usaha:* ${order.brand}\n*Paket:* ${order.product}`;
    window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      id="myOrdersModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" /> Daftar Pesanan Saya
        </h3>

        <div id="myOrdersList" className="space-y-3 flex-1 overflow-y-auto pr-1">
          {orders.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 italic">Belum ada pesanan tersimpan di perangkat ini.</p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 hover:border-blue-300 hover:bg-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-start font-bold text-slate-900">
                  <div>
                    <span className="text-sm block text-slate-900">{o.brand}</span>
                    <span className="text-[11px] font-mono text-slate-500 font-normal">ID: {o.id}</span>
                  </div>
                  <span className="text-blue-600 font-extrabold text-sm">{o.total}</span>
                </div>

                <p className="text-slate-700 font-medium">{o.product}</p>

                {o.addons && o.addons.length > 0 && (
                  <p className="text-[11px] text-slate-500">Addons: {o.addons.join(', ')}</p>
                )}

                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Tgl: {o.date}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ● Status: {o.status}
                  </span>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => handleWhatsappConfirm(o)}
                    className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-lg border border-emerald-200 flex items-center justify-center gap-1 cursor-pointer transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat Status WA
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOrderTrack();
                    }}
                    className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-lg border border-blue-200 flex items-center justify-center gap-1 cursor-pointer transition"
                  >
                    <Clock className="w-3.5 h-3.5" /> Lacak Timeline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
