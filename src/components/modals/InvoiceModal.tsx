import React from 'react';
import { OrderItem } from '../../types';
import { CheckCircle, CreditCard, MessageCircle, Copy } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null;
  onCopyBca: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  onCopyBca,
}) => {
  if (!isOpen || !order) return null;

  const handleWhatsappConfirm = () => {
    const text = `Halo BinaUsaha, saya sudah melakukan order *${order.id}* untuk *${order.brand}* seharga ${order.total}. Mohon bantu verifikasi pembayaran.`;
    window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      id="invoiceModal"
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center relative border-b border-blue-700">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/20">
            <CheckCircle className="w-6 h-6 text-emerald-300" />
          </div>
          <h3 className="font-heading font-extrabold text-xl">Pesanan Berhasil Dibuat!</h3>
          <p className="text-xs text-blue-100 mt-1">
            Kode Transaksi: <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-white">{order.id}</span>
          </p>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700 overflow-y-auto max-h-[60vh]">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Nama Usaha:</span>
              <span className="font-bold text-slate-900">{order.brand}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Pemilik:</span>
              <span className="font-medium text-slate-900">{order.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Paket Dipesan:</span>
              <span className="font-bold text-slate-900">{order.product}</span>
            </div>
            {order.addons && order.addons.length > 0 && (
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Layanan Tambahan:</span>
                <span className="font-medium text-slate-900 text-right">{order.addons.join(', ')}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Tanggal:</span>
              <span className="font-medium text-slate-700">{order.date}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
              <span>Total Tagihan:</span>
              <span className="text-blue-600 font-extrabold text-base">{order.total}</span>
            </div>
          </div>

          {/* Bank / QRIS Transfer Info */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h5 className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" /> Rekening Pembayaran Resmi BinaUsaha:
            </h5>
            <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <p className="font-bold text-slate-900">Bank BCA</p>
                <p className="text-xs font-mono text-slate-600 font-medium">4020322841</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">a.n. PT Bina Usaha Digital</span>
                <button
                  onClick={onCopyBca}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer transition border border-slate-200"
                  title="Salin Nomor Rekening"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Tim BinaUsaha telah mengirimkan salinan invoice ini ke WhatsApp & Email Anda. Silakan melakukan konfirmasi setelah transfer.
          </p>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition shadow-xs"
          >
            Tutup
          </button>
          <button
            onClick={handleWhatsappConfirm}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi WA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
