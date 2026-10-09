import React, { useEffect, useMemo, useState } from 'react';
import { OrderItem } from '../../types';
import { AdminSeed, OrderViewKey } from '../../types/admin';
import { updateOrderStatus, deleteOrder } from '../../lib/adminService';
import { adminGetOrderCommission } from '../../lib/commissionService';
import { countOrders, matchesOrderView, orderTime } from '../../lib/adminAnalytics';
import { SITE_URL, downloadCsv, formatRupiah, timeAgo, waLink } from '../../lib/adminUtils';
import { useAdminDialogs } from './AdminDialogs';
import {
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  X,
  Save,
  Loader2,
  MessageCircle,
  Pencil,
  Download,
  ArrowRight,
  BadgeCheck,
  Link2,
} from 'lucide-react';

interface AdminOrdersPageProps {
  orders: OrderItem[];
  ordersLoaded: boolean;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  seed?: AdminSeed | null;
  onSeedConsumed?: () => void;
}

type OrderStatus = OrderItem['status'];
type PaymentStatus = NonNullable<OrderItem['paymentStatus']>;

const STATUS_FLOW: OrderStatus[] = ['Verifikasi', 'Pengerjaan', 'QC & Training', 'Selesai'];
const PAYMENT_FLOW: PaymentStatus[] = ['Belum Dibayar', 'Menunggu Verifikasi', 'Lunas'];
const PAGE_SIZE = 30;

const VIEWS: { key: OrderViewKey; label: string; hint: string }[] = [
  { key: 'all', label: 'Semua', hint: 'Seluruh pesanan' },
  { key: 'verify', label: 'Verifikasi Bayar', hint: 'Bukti bayar masuk, perlu dicek' },
  { key: 'unpaid', label: 'Belum Dibayar', hint: 'Menunggu klien membayar' },
  { key: 'queue', label: 'Antrean Kerja', hint: 'Sudah lunas, belum dikerjakan' },
  { key: 'progress', label: 'Dikerjakan', hint: 'Pengerjaan dan QC' },
  { key: 'done', label: 'Selesai', hint: 'Pesanan tuntas' },
];

const STATUS_STYLE: Record<OrderStatus, { cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  Verifikasi: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },
  Pengerjaan: { cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  'QC & Training': { cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: Sparkles },
  Selesai: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
};

const PAYMENT_STYLE: Record<PaymentStatus, string> = {
  'Belum Dibayar': 'bg-slate-100 text-slate-600 border-slate-200',
  'Menunggu Verifikasi': 'bg-amber-50 text-amber-700 border-amber-200',
  Lunas: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const { cls, icon: Icon } = STATUS_STYLE[status] || STATUS_STYLE.Verifikasi;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cls}`}>
      <Icon className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
};

const PaymentBadge: React.FC<{ status?: PaymentStatus }> = ({ status = 'Belum Dibayar' }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${PAYMENT_STYLE[status]}`}>
    {status === 'Lunas' && <BadgeCheck className="w-3 h-3" />}
    <span>{status}</span>
  </span>
);

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  orders,
  ordersLoaded,
  showToast,
  seed,
  onSeedConsumed,
}) => {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<OrderViewKey>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { confirm, dialogs } = useAdminDialogs();

  // Form ubah pesanan
  const [editStatus, setEditStatus] = useState<OrderStatus>('Verifikasi');
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('Belum Dibayar');
  const [editNotes, setEditNotes] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editDocumentLink, setEditDocumentLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const counts = useMemo(() => countOrders(orders), [orders]);

  const filteredOrders = useMemo(() => {
    const q = query.toLowerCase().trim();
    return orders.filter((ord) => {
      if (!matchesOrderView(ord, view)) return false;
      if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
      if (!q) return true;
      return (
        ord.id.toLowerCase().includes(q) ||
        ord.name.toLowerCase().includes(q) ||
        ord.brand.toLowerCase().includes(q) ||
        ord.wa.toLowerCase().includes(q) ||
        ord.product.toLowerCase().includes(q) ||
        (ord.email || '').toLowerCase().includes(q) ||
        (ord.referredByCode || '').toLowerCase().includes(q)
      );
    });
  }, [orders, query, view, statusFilter]);

  useEffect(() => setVisible(PAGE_SIZE), [query, view, statusFilter]);

  const openEdit = (order: OrderItem) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus || 'Belum Dibayar');
    setEditNotes(order.notes || '');
    setEditTrackingNumber(order.trackingNumber || '');
    setEditDocumentLink(order.documentLink || '');
  };

  const closeEdit = () => setSelectedOrder(null);

  // Perintah dari pencarian global / lonceng / kartu Ikhtisar
  useEffect(() => {
    if (!seed) return;
    if (seed.openId) {
      if (!ordersLoaded) return; // tunggu data pertama
      const found = orders.find((o) => o.id === seed.openId);
      if (found) openEdit(found);
      else showToast(`Pesanan ${seed.openId} tidak ditemukan. Mungkin sudah dihapus.`, 'warning');
    } else {
      setQuery(seed.query ?? '');
      setView(seed.orderView ?? 'all');
      setStatusFilter(seed.orderStatus ?? 'all');
    }
    onSeedConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, ordersLoaded]);

  // Tutup modal dengan Esc
  useEffect(() => {
    if (!selectedOrder) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) closeEdit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedOrder, isSubmitting]);

  // Tetap sinkron kalau data pesanan berubah (realtime) saat modal terbuka
  const liveSelected = selectedOrder ? orders.find((o) => o.id === selectedOrder.id) || selectedOrder : null;

  const referralNote = (o: OrderItem) =>
    o.referredByCode && o.referralAccepted
      ? `\n\nPesanan ini memakai referral ${o.referredByCode}: komisi mitra dibuat otomatis saat pesanan Lunas.`
      : '';

  /** Verifikasi pembayaran dalam satu klik: Lunas + otomatis mulai pengerjaan. */
  const markPaid = async (o: OrderItem) => {
    const startWork = o.status === 'Verifikasi';
    const ok = await confirm({
      title: `Tandai ${o.id} Lunas?`,
      message:
        `Pembayaran ${o.total} dari ${o.brand || o.name} dinyatakan sudah diterima.` +
        (startWork ? '\nStatus pengerjaan otomatis pindah ke "Pengerjaan".' : '') +
        referralNote(o),
      confirmLabel: 'Ya, sudah Lunas',
    });
    if (!ok) return;
    setBusyId(o.id);
    try {
      await updateOrderStatus(o.id, {
        status: startWork ? 'Pengerjaan' : o.status,
        paymentStatus: 'Lunas',
      });
      showToast(`Pesanan ${o.id} Lunas${startWork ? ' dan mulai dikerjakan' : ''}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menandai Lunas.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const advance = async (o: OrderItem) => {
    const next = STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1];
    if (!next) return;
    if (next === 'Selesai' && o.paymentStatus !== 'Lunas') {
      const ok = await confirm({
        title: 'Pembayaran belum Lunas',
        message: `Pesanan ${o.id} berstatus pembayaran "${o.paymentStatus || 'Belum Dibayar'}". Tetap tandai Selesai?`,
        confirmLabel: 'Tetap Selesai',
      });
      if (!ok) return;
    }
    setBusyId(o.id);
    try {
      await updateOrderStatus(o.id, { status: next });
      showToast(`Pesanan ${o.id} pindah ke "${next}".`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal memindahkan tahap.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const hasChanges =
    !!liveSelected &&
    (editStatus !== liveSelected.status ||
      editPaymentStatus !== (liveSelected.paymentStatus || 'Belum Dibayar') ||
      editNotes !== (liveSelected.notes || '') ||
      editTrackingNumber !== (liveSelected.trackingNumber || '') ||
      editDocumentLink !== (liveSelected.documentLink || ''));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveSelected) return;
    const o = liveSelected;
    const wasPaid = o.paymentStatus === 'Lunas';

    if (wasPaid && editPaymentStatus !== 'Lunas' && o.referralAccepted) {
      const ok = await confirm({
        title: 'Batalkan status Lunas?',
        message: `Pesanan ini memakai referral ${o.referredByCode}. Mengubah pembayaran dari Lunas akan MEMBATALKAN komisi mitra yang masih Menunggu atau Disetujui (komisi yang sudah dibayar tidak berubah).`,
        confirmLabel: 'Ya, ubah',
        tone: 'danger',
      });
      if (!ok) return;
    }
    if (editStatus === 'Selesai' && editPaymentStatus !== 'Lunas') {
      const ok = await confirm({
        title: 'Pembayaran belum Lunas',
        message: `Pesanan akan ditandai Selesai padahal pembayaran "${editPaymentStatus}". Lanjutkan?`,
        confirmLabel: 'Lanjutkan',
      });
      if (!ok) return;
    }

    setIsSubmitting(true);
    try {
      await updateOrderStatus(o.id, {
        status: editStatus,
        paymentStatus: editPaymentStatus,
        notes: editNotes,
        trackingNumber: editTrackingNumber,
        documentLink: editDocumentLink.trim(),
      });
      showToast(`Pesanan ${o.id} berhasil diperbarui.`, 'success');
      closeEdit();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan perubahan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Tabel komisi terhubung ON DELETE CASCADE ke pesanan: menghapus pesanan ikut menghapus
   * komisinya. Karena itu pesanan yang komisinya sudah masuk pencairan/dibayar tidak boleh dihapus.
   */
  const handleDelete = async (o: OrderItem) => {
    setBusyId(o.id);
    try {
      let message = `Pesanan ${o.id} (${o.brand || o.name}) akan dihapus permanen dan tidak bisa dikembalikan.`;
      if (o.paymentStatus === 'Lunas') message += '\nPesanan ini sudah Lunas, jadi omset ikut berkurang.';

      if (o.referralAccepted) {
        const commission = await adminGetOrderCommission(o.id);
        if (commission && (commission.status === 'paid' || commission.payout_id)) {
          showToast(
            `Pesanan ${o.id} tidak bisa dihapus: komisi ${formatRupiah(commission.amount)} sudah masuk pencairan/dibayar. Biarkan sebagai arsip, atau tandai Selesai.`,
            'warning'
          );
          return;
        }
        if (commission) {
          message += `\nKomisi referral ${formatRupiah(commission.amount)} (${commission.status === 'approved' ? 'Disetujui' : 'Menunggu'}) ikut terhapus.`;
        }
      }

      const ok = await confirm({ title: 'Hapus pesanan?', message, confirmLabel: 'Ya, hapus', tone: 'danger' });
      if (!ok) return;

      await deleteOrder(o.id);
      showToast(`Pesanan ${o.id} dihapus.`, 'info');
      if (selectedOrder?.id === o.id) closeEdit();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus pesanan.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ['ID', 'Tanggal', 'Paket', 'Add-on', 'Klien', 'Brand', 'WhatsApp', 'Email', 'Total', 'Pembayaran', 'Metode', 'Tahap', 'Referral', 'No. Resi/Registrasi'],
      ...filteredOrders.map((o) => [
        o.id,
        orderTime(o)?.toLocaleDateString('id-ID') || o.date,
        o.product,
        (o.addons || []).join('; '),
        o.name,
        o.brand,
        o.wa,
        o.email || '',
        o.total,
        o.paymentStatus || 'Belum Dibayar',
        o.paymentMethod || '',
        o.status,
        o.referredByCode ? `${o.referredByCode}${o.referralAccepted ? '' : ' (ditolak)'}` : '',
        o.trackingNumber || '',
      ]),
    ];
    downloadCsv(`pesanan-binausaha-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    showToast(`${filteredOrders.length} pesanan diekspor ke CSV.`, 'success');
  };

  const viewCount = (key: OrderViewKey) => (key === 'all' ? counts.total : counts[key]);
  const shown = filteredOrders.slice(0, visible);

  const rowActions = (o: OrderItem) => {
    const busy = busyId === o.id;
    const next = STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1];
    return (
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        ) : (
          <>
            {o.paymentStatus === 'Menunggu Verifikasi' && (
              <button
                onClick={() => markPaid(o)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                title="Pembayaran diterima: tandai Lunas"
              >
                <BadgeCheck className="w-3.5 h-3.5" />
                Lunas
              </button>
            )}
            {o.paymentStatus === 'Lunas' && next && (
              <button
                onClick={() => advance(o)}
                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                title={`Pindah ke ${next}`}
              >
                <span>{next}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => openEdit(o)}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
              title="Detail & ubah"
              aria-label={`Ubah pesanan ${o.id}`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(o)}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
              title="Hapus pesanan"
              aria-label={`Hapus pesanan ${o.id}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    );
  };

  const referralChip = (o: OrderItem) =>
    o.referredByCode ? (
      <span
        title={
          o.referralAccepted
            ? 'Referral diterima: komisi dibuat saat pesanan Lunas'
            : 'Referral ditolak server (kode tidak dikenal / referral ke diri sendiri): tidak ada komisi'
        }
        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
          o.referralAccepted
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-slate-100 text-slate-500 border-slate-200 line-through'
        }`}
      >
        <Link2 className="w-2.5 h-2.5" />
        {o.referredByCode}
      </span>
    ) : null;

  return (
    <div id="admin-orders-page" className="space-y-5 max-w-7xl mx-auto">
      {/* Kepala: tampilan cepat + pencarian */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {VIEWS.map((v) => {
              const on = view === v.key;
              const n = viewCount(v.key);
              const urgent = (v.key === 'verify' || v.key === 'queue') && n > 0;
              return (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  title={v.hint}
                  aria-pressed={on}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    on
                      ? 'bg-blue-600 text-white shadow-sm'
                      : urgent
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v.label} <span className={on ? 'text-white/80' : 'opacity-70'}>({n})</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID, nama, brand, WA, kode referral…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full sm:w-72"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
              aria-label="Filter tahap pengerjaan"
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Semua tahap</option>
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={exportCsv}
              disabled={filteredOrders.length === 0}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Unduh daftar yang sedang tampil sebagai CSV"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Menampilkan <strong>{filteredOrders.length}</strong> dari {orders.length} pesanan. Alur: klien membayar →{' '}
          <strong>verifikasi pembayaran (Lunas)</strong> → pengerjaan → QC → selesai. Komisi referral dibuat otomatis saat pesanan Lunas.
        </p>
      </div>

      {/* Tabel (desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Paket Layanan</th>
                <th className="px-5 py-3.5">Klien</th>
                <th className="px-5 py-3.5">Total & Pembayaran</th>
                <th className="px-5 py-3.5">Tahap</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {!ordersLoaded ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Memuat pesanan…
                  </td>
                </tr>
              ) : shown.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    {orders.length === 0 ? 'Belum ada pesanan masuk.' : 'Tidak ada pesanan yang sesuai dengan filter.'}
                  </td>
                </tr>
              ) : (
                shown.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 whitespace-nowrap align-top">
                      <button
                        onClick={() => openEdit(ord)}
                        className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 cursor-pointer"
                      >
                        {ord.id}
                      </button>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {ord.createdAt ? timeAgo(new Date(ord.createdAt)) : ord.date}
                      </div>
                      {referralChip(ord) && <div className="mt-1">{referralChip(ord)}</div>}
                    </td>
                    <td className="px-5 py-4 min-w-[180px] align-top">
                      <div className="font-bold text-slate-900">{ord.product}</div>
                      {ord.addons && ord.addons.length > 0 && (
                        <div className="text-[10px] text-blue-600 mt-0.5">+ {ord.addons.join(', ')}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap align-top">
                      <div className="font-bold text-slate-900">{ord.brand || ord.name}</div>
                      <div className="text-[11px] text-slate-500">{ord.brand ? ord.name : ''}</div>
                      <a
                        href={waLink(ord.wa)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-0.5 text-[11px] text-slate-600 hover:text-emerald-600 font-mono transition"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-500" />
                        <span>{ord.wa}</span>
                      </a>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap align-top">
                      <div className="font-bold text-slate-900 mb-1">{ord.total}</div>
                      <PaymentBadge status={ord.paymentStatus} />
                      {ord.paymentMethod && (
                        <div className="text-[10px] text-slate-400 mt-1 uppercase">{ord.paymentMethod}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap align-top">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="px-5 py-4 align-top">{rowActions(ord)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kartu (ponsel) */}
      <div className="md:hidden space-y-3">
        {!ordersLoaded ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Memuat pesanan…
          </div>
        ) : shown.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            {orders.length === 0 ? 'Belum ada pesanan masuk.' : 'Tidak ada pesanan yang sesuai dengan filter.'}
          </div>
        ) : (
          shown.map((ord) => (
            <div key={ord.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <button
                    onClick={() => openEdit(ord)}
                    className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
                  >
                    {ord.id}
                  </button>
                  <h4 className="font-bold text-slate-900 text-sm mt-1.5 truncate">{ord.product}</h4>
                  <p className="text-xs text-slate-500 truncate">
                    {ord.brand || ord.name} {ord.brand ? `• ${ord.name}` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-slate-900 text-sm">{ord.total}</div>
                  <div className="text-[10px] text-slate-400">{ord.createdAt ? timeAgo(new Date(ord.createdAt)) : ord.date}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge status={ord.status} />
                <PaymentBadge status={ord.paymentStatus} />
                {referralChip(ord)}
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <a
                  href={waLink(ord.wa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {ord.wa}
                </a>
                {rowActions(ord)}
              </div>
            </div>
          ))
        )}
      </div>

      {filteredOrders.length > shown.length && (
        <div className="text-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition cursor-pointer"
          >
            Tampilkan {Math.min(PAGE_SIZE, filteredOrders.length - shown.length)} lagi ({filteredOrders.length - shown.length} tersisa)
          </button>
        </div>
      )}

      {/* Modal ubah pesanan */}
      {liveSelected && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) closeEdit();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Pesanan ${liveSelected.id}`}
        >
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded border border-blue-200">
                  Update Progres Pesanan
                </span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">Order #{liveSelected.id}</h3>
              </div>
              <button
                onClick={closeEdit}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{liveSelected.product}</div>
                {liveSelected.addons && liveSelected.addons.length > 0 && (
                  <div className="text-blue-600">+ {liveSelected.addons.join(', ')}</div>
                )}
                <div className="text-slate-600">
                  Pemesan: <strong>{liveSelected.name}</strong> ({liveSelected.brand}) •{' '}
                  <a href={waLink(liveSelected.wa)} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-mono hover:underline">
                    {liveSelected.wa}
                  </a>
                </div>
                {liveSelected.email && <div className="text-slate-600">Email: {liveSelected.email}</div>}
                <div className="text-blue-700 font-semibold">Nilai: {liveSelected.total}</div>
                <div className="text-slate-600">
                  Metode bayar: <strong>{liveSelected.paymentMethod ? liveSelected.paymentMethod.toUpperCase() : '-'}</strong>
                </div>
                {liveSelected.referredByCode && (
                  <div className={liveSelected.referralAccepted ? 'text-emerald-700' : 'text-slate-500'}>
                    Referral: <strong>{liveSelected.referredByCode}</strong>{' '}
                    {liveSelected.referralAccepted
                      ? '(diterima, komisi dibuat saat Lunas)'
                      : '(ditolak server, tidak ada komisi)'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Status Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_FLOW.map((ps) => (
                    <button
                      type="button"
                      key={ps}
                      onClick={() => {
                        setEditPaymentStatus(ps);
                        // Lunas pada pesanan yang masih "Verifikasi" = siap dikerjakan
                        if (ps === 'Lunas' && editStatus === 'Verifikasi') setEditStatus('Pengerjaan');
                      }}
                      className={`p-2 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                        editPaymentStatus === ps
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ps}
                    </button>
                  ))}
                </div>
                {liveSelected.paymentStatus === 'Lunas' && editPaymentStatus !== 'Lunas' && liveSelected.referralAccepted && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-semibold">
                    Mengubah dari Lunas akan membatalkan komisi referral yang belum dibayar.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Tahap Pengerjaan</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_FLOW.map((st) => (
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

              <a
                href={waLink(
                  liveSelected.wa,
                  `Halo Kak ${liveSelected.name} (${liveSelected.brand}), berikut update pesanan #${liveSelected.id}:\n\n` +
                    `*Pembayaran:* ${editPaymentStatus}\n` +
                    `*Tahap:* ${editStatus}\n` +
                    `*Catatan:* ${editNotes || 'Sedang diproses tim BinaUsaha.'}\n` +
                    (editTrackingNumber ? `*No. Registrasi / Resi:* ${editTrackingNumber}\n` : '') +
                    (editDocumentLink ? `*Dokumen:* ${editDocumentLink}\n` : '') +
                    `\nCek progres lengkap di ${SITE_URL}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Update via WhatsApp</span>
              </a>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDelete(liveSelected)}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !hasChanges}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            </form>
          </div>
        </div>
      )}

      {dialogs}
    </div>
  );
};
