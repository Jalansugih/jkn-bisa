import React, { useEffect, useState } from 'react';
import { OrderItem } from '../../types';
import { updateOrderStatus, deleteOrder } from '../../lib/adminService';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  PhoneCall,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  X,
  FileText,
  Save,
  Loader2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface AdminOrdersPageProps {
  orders: OrderItem[];
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  // Order forwarded from another page (e.g. Overview) that should immediately
  // open in the edit modal. Once consumed, the parent should clear it via
  // onOrderToOpenConsumed so it doesn't re-trigger on re-renders.
  orderToOpen?: OrderItem | null;
  onOrderToOpenConsumed?: () => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  orders,
  showToast,
  orderToOpen,
  onOrderToOpenConsumed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form states
  const [editStatus, setEditStatus] = useState<OrderItem['status']>('Verifikasi');
  const [editNotes, setEditNotes] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editDocumentLink, setEditDocumentLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      ord.id.toLowerCase().includes(q) ||
      ord.name.toLowerCase().includes(q) ||
      ord.brand.toLowerCase().includes(q) ||
      ord.wa.toLowerCase().includes(q) ||
      ord.product.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  const handleOpenEdit = (order: OrderItem) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditNotes(order.notes || '');
    setEditTrackingNumber(order.trackingNumber || '');
    setEditDocumentLink(order.documentLink || '');
    setIsEditModalOpen(true);
  };

  // If an order was forwarded from another page (e.g. clicked in the
  // Overview's "Pesanan Terbaru" list), open its edit modal immediately,
  // then notify the parent so it clears the forwarded order.
  useEffect(() => {
    if (orderToOpen) {
      handleOpenEdit(orderToOpen);
      onOrderToOpenConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderToOpen]);

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsSubmitting(true);
    try {
      await updateOrderStatus(selectedOrder.id, {
        status: editStatus,
        notes: editNotes,
        trackingNumber: editTrackingNumber,
        documentLink: editDocumentLink,
      });
      showToast(`Status pesanan ${selectedOrder.id} berhasil diperbarui!`, 'success');
      setIsEditModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan perubahan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm(`Yakin ingin menghapus pesanan ${orderId}? Data tidak dapat dikembalikan.`)) {
      return;
    }
    try {
      await deleteOrder(orderId);
      showToast(`Pesanan ${orderId} berhasil dihapus.`, 'info');
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
        setIsEditModalOpen(false);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus pesanan.', 'error');
    }
  };

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
          </span>
        );
      case 'QC & Training':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3" />
            <span>QC & Training</span>
          </span>
        );
      case 'Pengerjaan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            <span>Pengerjaan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            <span>Verifikasi</span>
          </span>
        );
    }
  };

  return (
    <div id="admin-orders-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Filters */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-slate-900">
            Daftar Manajemen Pesanan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {orders.length} transaksi tercatat di database Firestore
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID, nama, brand, no. WA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full sm:w-64"
            />
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Verifikasi">Verifikasi</option>
              <option value="Pengerjaan">Pengerjaan</option>
              <option value="QC & Training">QC & Training</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Paket Layanan</th>
                <th className="px-5 py-3.5">Klien / Brand</th>
                <th className="px-5 py-3.5">Kontak WhatsApp</th>
                <th className="px-5 py-3.5">Total Harga</th>
                <th className="px-5 py-3.5">Status Pengerjaan</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada pesanan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ord.id}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{ord.date}</div>
                    </td>
                    <td className="px-5 py-4 min-w-[180px]">
                      <div className="font-bold text-slate-900">{ord.product}</div>
                      {ord.addons && ord.addons.length > 0 && (
                        <div className="text-[10px] text-blue-600 mt-0.5">
                          + {ord.addons.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{ord.brand}</div>
                      <div className="text-[11px] text-slate-500">{ord.name}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <a
                        href={`https://wa.me/${ord.wa.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 font-mono transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{ord.wa}</span>
                      </a>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900">
                      {ord.total}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ord)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition cursor-pointer"
                        title="Edit Status & Catatan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ord.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                        title="Hapus Pesanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order Modal */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded border border-blue-200">
                  Update Progres Pesanan
                </span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveStatus} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{selectedOrder.product}</div>
                <div className="text-slate-600">
                  Pemesan: <strong>{selectedOrder.name}</strong> ({selectedOrder.brand}) • {selectedOrder.wa}
                </div>
                <div className="text-slate-600 font-semibold text-blue-700">
                  Nilai: {selectedOrder.total}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ubah Status Pengerjaan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Verifikasi', 'Pengerjaan', 'QC & Training', 'Selesai'] as OrderItem['status'][]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setEditStatus(st)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition cursor-pointer ${
                        editStatus === st
                          ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{st}</span>
                      {editStatus === st && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Catatan Progres Untuk Klien (Tampil di Tracker)
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Misal: Draft akta notaris selesai, menunggu verifikasi tanda tangan Kemenkumham..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Legal Tracking / SK AHU Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor Registrasi / SK AHU / Resi Pengiriman
                </label>
                <input
                  type="text"
                  value={editTrackingNumber}
                  onChange={(e) => setEditTrackingNumber(e.target.value)}
                  placeholder="Contoh: AHU-0012938.AH.01.11.TAHUN 2026 atau Resi JNE..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-mono"
                />
              </div>

              {/* Document Download Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tautan File Dokumen / Serah Terima (Google Drive / PDF)
                </label>
                <input
                  type="url"
                  value={editDocumentLink}
                  onChange={(e) => setEditDocumentLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              {/* WhatsApp Notification Shortcut */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${selectedOrder.wa.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Halo Kak ${selectedOrder.name} (${selectedOrder.brand}), berikut update pesanan #${selectedOrder.id}:\n\n` +
                      `*Status:* ${editStatus}\n` +
                      `*Catatan:* ${editNotes || 'Sedang diproses tim teknis BinaUsaha.'}\n` +
                      (editTrackingNumber ? `*No. Registrasi / Resi:* ${editTrackingNumber}\n` : '') +
                      `\nCek progres lengkap di website: https://binausaha.id`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Notifikasi Update via WhatsApp</span>
                </a>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
