import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import OrderStatusBadge from './OrderStatusBadge';
import { OrderItem } from '../../types';
import { ShoppingBag, MessageSquare, Search, Receipt, ArrowRight } from 'lucide-react';

interface UserDashboardProps {
  user: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    businessName?: string | null;
    whatsapp?: string | null;
  } | null;
  orders?: OrderItem[];
  onGoHome?: () => void;
  onOpenOrder?: (serviceId?: string) => void;
  onOpenTracker?: () => void;
  onSelectOrderInvoice?: (order: OrderItem) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  orders = [],
  onGoHome,
  onOpenOrder,
  onOpenTracker,
  onSelectOrderInvoice,
}) => {
  // ==============================
  // STATISTIK PESANAN
  // ==============================
  const totalOrders = orders.length;

  const processingOrders = orders.filter((order) => {
    const s = (order.status || '').toLowerCase();
    return s.includes('proses') || s.includes('verifikasi') || s.includes('pengerjaan') || s.includes('qc') || s === 'processing';
  }).length;

  const completedOrders = orders.filter((order) => {
    const s = (order.status || '').toLowerCase();
    return s.includes('selesai') || s === 'completed';
  }).length;

  const handleChatWhatsapp = (order?: OrderItem) => {
    const text = order
      ? `Halo CS BinaUsaha, saya ingin menanyakan progres pesanan *#${order.id}* (${order.product} - ${order.brand}). Mohon update-nya. Terima kasih.`
      : `Halo CS BinaUsaha, saya ingin konsultasi layanan untuk usaha saya.`;
    window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==============================
          HEADER
      ============================== */}
      <DashboardHeader
        user={user}
        onGoHome={onGoHome}
        onNewOrder={() => onOpenOrder?.('pt_pro')}
      />

      {/* ==============================
          CONTENT
      ============================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ==============================
            STATISTIK
        ============================== */}
        <DashboardStats
          totalOrders={totalOrders}
          processingOrders={processingOrders}
          completedOrders={completedOrders}
        />

        {/* ==============================
            PESANAN SAYA
        ============================== */}
        <div>
          {/* Judul & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pesanan Saya
              </h2>
              <p className="text-sm text-slate-500">
                Riwayat dan pelacakan progres layanan yang terhubung dengan akun Anda
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenTracker && (
                <button
                  onClick={onOpenTracker}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lacak Resi / ID</span>
                </button>
              )}
            </div>
          </div>

          {/* ==============================
              JIKA BELUM ADA PESANAN
          ============================== */}
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-xs">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <h3 className="font-bold text-slate-900 text-base">
                Belum Ada Pesanan Aktif
              </h3>

              <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
                Anda belum memiliki pesanan terdaftar di akun ini. Pilih paket legalitas, website toko online, atau kasir POS untuk memulai usaha Anda.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onOpenOrder?.('pt_pro')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pesan Paket Usaha Sekarang</span>
                </button>
                <button
                  onClick={() => handleChatWhatsapp()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Konsultasi Gratis via WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            /* ==============================
               JIKA ADA PESANAN
            ============================== */
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={order.id || index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Informasi Pesanan */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                          #{order.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          {order.date}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">
                        {order.product || 'Paket Layanan Usaha'}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Brand/Usaha: <strong className="text-slate-700 font-semibold">{order.brand}</strong></span>
                        <span>•</span>
                        <span>Pemohon: <span className="text-slate-700">{order.name}</span></span>
                      </div>

                      {order.addons && order.addons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {order.addons.map((add, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              + {add}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right space-y-1">
                        <p className="text-xs text-slate-400">Total Biaya</p>
                        <p className="text-base font-black text-slate-900">{order.total}</p>
                        <div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:ml-4">
                        {onSelectOrderInvoice && (
                          <button
                            onClick={() => onSelectOrderInvoice(order)}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                            title="Lihat Invoice"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleChatWhatsapp(order)}
                          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                          title="Tanya Progres ke WhatsApp CS"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>CS Progres</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
