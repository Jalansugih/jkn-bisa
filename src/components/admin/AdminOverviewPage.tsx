import React, { useMemo, useState } from 'react';
import { Article, OrderItem, Product } from '../../types';
import { AdminSeed, AdminUserListItem, RfqItem } from '../../types/admin';
import type { AdminPayout } from '../../lib/payoutService';
import {
  Metric,
  PERIOD_LABEL,
  Period,
  buildActivity,
  buildInsights,
  buildSeries,
  countOrders,
  monthToDate,
  summarizePayouts,
} from '../../lib/adminAnalytics';
import { adminSetRevenueTarget } from '../../lib/revenueTarget';
import { formatCompactRupiah, formatRupiah, timeAgo, waLink, SITE_URL } from '../../lib/adminUtils';
import { useAdminDialogs } from './AdminDialogs';
import { RevenueChart } from './overview/RevenueChart';
import { KpiCard } from './overview/KpiCard';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FolderOpen,
  HandCoins,
  PackageCheck,
  Package,
  Pencil,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Wallet,
  Zap,
  AlertCircle,
  Receipt,
} from 'lucide-react';

interface AdminOverviewPageProps {
  orders: OrderItem[];
  rfqs: RfqItem[];
  users: AdminUserListItem[];
  payouts: AdminPayout[];
  products: Product[];
  articles: Article[];
  /** false selama data pesanan pertama belum selesai dimuat. */
  ordersLoaded: boolean;
  revenueTarget: number | null;
  onTargetChanged: (target: number | null) => void;
  onNavigate: (seed: AdminSeed) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const METRIC_META: Record<Metric, { label: string; unit: string }> = {
  revenue: { label: 'Omset (Lunas)', unit: '' },
  orders: { label: 'Total Pesanan', unit: 'pesanan' },
  users: { label: 'Pengguna Baru', unit: 'akun' },
};

const ORDER_STATUS_STYLE: Record<OrderItem['status'], string> = {
  Verifikasi: 'bg-amber-50 text-amber-700 border-amber-200',
  Pengerjaan: 'bg-blue-50 text-blue-700 border-blue-200',
  'QC & Training': 'bg-purple-50 text-purple-700 border-purple-200',
  Selesai: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const PAY_STYLE: Record<NonNullable<OrderItem['paymentStatus']>, string> = {
  'Belum Dibayar': 'bg-slate-100 text-slate-600 border-slate-200',
  'Menunggu Verifikasi': 'bg-amber-50 text-amber-700 border-amber-200',
  Lunas: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const ACTIVITY_META = {
  order: { icon: ShoppingBag, tone: 'bg-blue-100 text-blue-600' },
  rfq: { icon: Receipt, tone: 'bg-emerald-100 text-emerald-600' },
  user: { icon: UserPlus, tone: 'bg-purple-100 text-purple-600' },
  payout: { icon: HandCoins, tone: 'bg-amber-100 text-amber-600' },
} as const;

const Growth: React.FC<{ pct: number | null; suffix?: string }> = ({ pct, suffix = 'vs periode sebelumnya' }) => {
  if (pct === null) return <span className="text-slate-400">Belum ada pembanding</span>;
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
      <Icon className="w-3 h-3" />
      {up ? '+' : ''}
      {pct.toFixed(1).replace('.', ',')}% <span className="text-slate-400 font-medium">{suffix}</span>
    </span>
  );
};

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  orders,
  rfqs,
  users,
  payouts,
  products,
  articles,
  ordersLoaded,
  revenueTarget,
  onTargetChanged,
  onNavigate,
  showToast,
}) => {
  const [period, setPeriod] = useState<Period>('30d');
  const [metric, setMetric] = useState<Metric>('revenue');
  const { prompt, dialogs } = useAdminDialogs();

  const counts = useMemo(() => countOrders(orders), [orders]);
  const month = useMemo(() => monthToDate(orders), [orders]);
  const payoutSummary = useMemo(() => summarizePayouts(payouts), [payouts]);
  const series = useMemo(() => buildSeries(orders, users, period, metric), [orders, users, period, metric]);
  const insights = useMemo(() => buildInsights(orders, period), [orders, period]);
  const activity = useMemo(
    () => buildActivity(orders, rfqs, users, payouts, formatRupiah, 7),
    [orders, rfqs, users, payouts]
  );

  // Ringkasan tiga metrik untuk tab di atas grafik (selalu mengikuti periode terpilih)
  const metricTotals = useMemo(
    () => ({
      revenue: buildSeries(orders, users, period, 'revenue'),
      orders: buildSeries(orders, users, period, 'orders'),
      users: buildSeries(orders, users, period, 'users'),
    }),
    [orders, users, period]
  );

  const activeRfqs = rfqs.filter((r) => r.status === 'Baru' || r.status === 'Diproses').length;
  const newRfqs = rfqs.filter((r) => r.status === 'Baru').length;
  const needsAction = counts.verify + counts.queue;
  const activeProducts = products.filter((p) => p.active !== false).length;
  const published = articles.filter((a) => (a.status || 'PUBLISHED') === 'PUBLISHED').length;
  const drafts = articles.filter((a) => a.status === 'DRAFT').length;

  const targetPct = revenueTarget ? Math.min(100, (month.current / revenueTarget) * 100) : null;
  const formatMetric = (n: number) => (metric === 'revenue' ? formatRupiah(n) : `${n} ${METRIC_META[metric].unit}`);
  const formatAxis = (n: number) => (metric === 'revenue' ? formatCompactRupiah(n).replace('Rp ', '') : String(Math.round(n)));

  const editTarget = async () => {
    const raw = await prompt({
      title: 'Target omset bulanan',
      message: 'Isi target pemasukan per bulan (Rupiah). Progres dihitung dari pesanan berstatus Lunas. Kosongkan atau isi 0 untuk mematikan target.',
      label: 'Target (Rp)',
      placeholder: 'Contoh: 60000000',
      initialValue: revenueTarget ? String(revenueTarget) : '',
      confirmLabel: 'Simpan target',
    });
    if (raw === null) return;
    const amount = raw.trim() === '' ? 0 : Number(raw.replace(/[^0-9]/g, ''));
    if (!Number.isFinite(amount)) {
      showToast('Isi target dengan angka.', 'warning');
      return;
    }
    try {
      const saved = await adminSetRevenueTarget(amount);
      onTargetChanged(saved);
      showToast(saved ? `Target omset bulanan: ${formatRupiah(saved)}.` : 'Target omset dimatikan.', 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal menyimpan target.', 'error');
    }
  };

  const recentOrders = orders.slice(0, 5);
  const recentRfqs = rfqs.slice(0, 4);

  const pipeline: { status: OrderItem['status']; label: string; icon: React.ComponentType<{ className?: string }>; box: string; text: string }[] = [
    { status: 'Verifikasi', label: '1. Verifikasi', icon: Clock, box: 'border-amber-200 bg-amber-50/40', text: 'text-amber-800' },
    { status: 'Pengerjaan', label: '2. Pengerjaan', icon: AlertCircle, box: 'border-blue-200 bg-blue-50/40', text: 'text-blue-800' },
    { status: 'QC & Training', label: '3. QC & Training', icon: Sparkles, box: 'border-purple-200 bg-purple-50/40', text: 'text-purple-800' },
    { status: 'Selesai', label: '4. Selesai', icon: CheckCircle2, box: 'border-emerald-200 bg-emerald-50/40', text: 'text-emerald-800' },
  ];

  const skeleton = (txt: string) => (ordersLoaded ? txt : '…');

  return (
    <div id="admin-overview-page" className="space-y-6 max-w-7xl mx-auto">
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          label="Omset Bulan Ini (Lunas)"
          value={skeleton(formatRupiah(month.current))}
          icon={Wallet}
          tone="blue"
          footer={<Growth pct={month.growthPct} suffix="vs bulan lalu" />}
          onClick={() => onNavigate({ tab: 'orders', orderView: 'all' })}
        />
        <KpiCard
          label="Pesanan Perlu Tindakan"
          value={skeleton(`${needsAction} Pesanan`)}
          icon={PackageCheck}
          tone="amber"
          attention={needsAction > 0}
          footer={
            needsAction > 0 ? (
              <span className="text-amber-700">
                {counts.verify} verifikasi bayar • {counts.queue} siap dikerjakan
              </span>
            ) : (
              <span className="text-slate-400">Tidak ada yang menunggu</span>
            )
          }
          onClick={() => onNavigate({ tab: 'orders', orderView: counts.verify > 0 ? 'verify' : counts.queue > 0 ? 'queue' : 'all' })}
        />
        <KpiCard
          label="Pengajuan RFQ Aktif"
          value={`${activeRfqs} Permintaan`}
          icon={FileSpreadsheet}
          tone="indigo"
          footer={
            newRfqs > 0 ? (
              <span className="text-indigo-600">{newRfqs} baru belum ditindaklanjuti</span>
            ) : (
              <span className="text-slate-400">Belum ada RFQ baru</span>
            )
          }
          onClick={() => onNavigate({ tab: 'rfq', rfqStatus: newRfqs > 0 ? 'Baru' : 'all' })}
        />
        <KpiCard
          label="Pencairan Komisi"
          value={`${payoutSummary.requestedCount} Pengajuan`}
          icon={HandCoins}
          tone="emerald"
          attention={payoutSummary.requestedCount > 0}
          footer={
            payoutSummary.requestedCount > 0 ? (
              <span className="text-amber-700">{formatRupiah(payoutSummary.requestedAmount)} menunggu ditransfer</span>
            ) : (
              <span className="text-slate-400">Tidak ada pengajuan</span>
            )
          }
          onClick={() => onNavigate({ tab: 'commissions' })}
        />
      </div>

      {/* Grafik + aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <h3 className="font-heading font-extrabold text-slate-900 text-base">Grafik Penjualan & Pertumbuhan</h3>
              <p className="text-xs text-slate-500">{series.rangeLabel}</p>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              aria-label="Periode grafik"
              className="self-start sm:self-auto text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
                <option key={p} value={p}>
                  {PERIOD_LABEL[p]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(METRIC_META) as Metric[]).map((m) => {
              const s = metricTotals[m];
              const on = metric === m;
              return (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  aria-pressed={on}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    on ? 'border-blue-500/50 bg-blue-50/60' : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-[11px] font-bold uppercase tracking-wider block ${on ? 'text-blue-600' : 'text-slate-500'}`}>
                    {METRIC_META[m].label}
                  </span>
                  <span className="text-lg font-heading font-black text-slate-900 block mt-0.5 truncate">
                    {skeleton(m === 'revenue' ? formatRupiah(s.total) : `${s.total} ${METRIC_META[m].unit}`)}
                  </span>
                  <span className="text-[10px] font-semibold block mt-1">
                    <Growth pct={s.growthPct} suffix="" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Target omset bulanan */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2">
            <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 text-xs">
              <span className="font-bold text-slate-700">
                {revenueTarget ? `Target omset bulan ini (${formatRupiah(revenueTarget)})` : 'Target omset bulanan belum diatur'}
              </span>
              <span className="flex items-center gap-2">
                {targetPct !== null && (
                  <span className="font-extrabold text-blue-600">{targetPct.toFixed(1).replace('.', ',')}% tercapai</span>
                )}
                <button
                  onClick={editTarget}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  {revenueTarget ? 'Ubah' : 'Atur target'}
                </button>
              </span>
            </div>
            {targetPct !== null ? (
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={Math.round(targetPct)} aria-valuemin={0} aria-valuemax={100}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${targetPct}%` }} />
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Omset bulan ini {formatRupiah(month.current)}. Atur target agar progres tampil di sini.
              </p>
            )}
          </div>

          <RevenueChart
            labels={series.labels}
            values={series.values}
            variant={metric === 'revenue' ? 'line' : 'bar'}
            formatValue={formatMetric}
            formatAxis={formatAxis}
            ariaLabel={`Grafik ${METRIC_META[metric].label} ${PERIOD_LABEL[period]}: total ${formatMetric(series.total)}`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg min-w-0">
              <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-semibold">Klien Teratas</span>
                <strong className="text-slate-800 text-[11px] block truncate">
                  {insights.topClient ? `${insights.topClient.name} (${formatCompactRupiah(insights.topClient.value)})` : '-'}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg min-w-0">
              <Zap className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-semibold">Hari Puncak Penjualan</span>
                <strong className="text-slate-800 text-[11px] block truncate">
                  {insights.peakDay ? `${insights.peakDay.name} (${formatCompactRupiah(insights.peakDay.value)})` : '-'}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg min-w-0">
              <Receipt className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-semibold">Rata-rata Order</span>
                <strong className="text-slate-800 text-[11px] block truncate">
                  {insights.paidCount > 0 ? `${formatRupiah(insights.aov)} / order` : '-'}
                </strong>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Omset hanya menghitung pesanan berstatus pembayaran Lunas, pada tanggal pesanan dibuat.
          </p>
        </div>

        {/* Aktivitas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-extrabold text-slate-900 text-sm">Aktivitas Terkini</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Pesanan • RFQ • Akun • Pencairan</span>
          </div>
          {activity.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 font-medium">Belum ada aktivitas.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {activity.map((a) => {
                const meta = ACTIVITY_META[a.kind];
                const Icon = meta.icon;
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => onNavigate(a.seed)}
                      className="w-full flex gap-3 text-left p-2 -mx-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.tone}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0 space-y-0.5">
                        <span className="block text-xs font-semibold text-slate-800 truncate">{a.title}</span>
                        <span className="block text-[11px] text-slate-500 truncate">{a.subtitle}</span>
                        <span className="block text-[10px] text-slate-400">{timeAgo(a.at)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Pintasan katalog & artikel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-slate-900 text-sm">Katalog Layanan & Tarif</h4>
              <p className="text-xs text-slate-500 truncate">
                {activeProducts} paket aktif{products.length > activeProducts ? ` • ${products.length - activeProducts} nonaktif` : ''} • tampil live di website
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate({ tab: 'products' })}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-200/80 flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <span>Kelola Paket</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-slate-900 text-sm">Pusat Artikel Edukasi UMKM</h4>
              <p className="text-xs text-slate-500 truncate">
                {published} artikel terbit{drafts > 0 ? ` • ${drafts} draft belum terbit` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate({ tab: 'articles' })}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-purple-200/80 flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <span>Kelola Artikel</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">Pipeline Status Pengerjaan Pesanan</h3>
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:block">Klik tahap untuk melihat daftarnya</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pipeline.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.status}
                onClick={() => onNavigate({ tab: 'orders', orderStatus: step.status })}
                className={`p-4 rounded-xl border flex justify-between items-start text-left hover:shadow-sm transition cursor-pointer ${step.box}`}
              >
                <div>
                  <span className={`text-xs font-bold ${step.text}`}>{step.label}</span>
                  <h4 className={`text-2xl font-heading font-black mt-1 ${step.text}`}>{counts.byStatus[step.status]}</h4>
                </div>
                <Icon className={`w-5 h-5 ${step.text} opacity-70`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Pesanan & RFQ terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 min-w-0">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">Pesanan Masuk Terbaru</h3>
              <p className="text-xs text-slate-500">5 pesanan paling baru</p>
            </div>
            <button
              onClick={() => onNavigate({ tab: 'orders' })}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Semua Pesanan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {ordersLoaded ? 'Belum ada pesanan yang masuk.' : 'Memuat pesanan…'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => onNavigate({ tab: 'orders', openId: o.id })}
                  className="w-full text-left p-4 border border-slate-200/80 rounded-2xl space-y-2 hover:border-blue-300 transition cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[11px] rounded-lg font-mono">{o.id}</span>
                      <span className={`px-2.5 py-0.5 font-bold text-[11px] rounded-lg border ${ORDER_STATUS_STYLE[o.status]}`}>{o.status}</span>
                      <span className={`px-2.5 py-0.5 font-bold text-[11px] rounded-lg border ${PAY_STYLE[o.paymentStatus || 'Belum Dibayar']}`}>
                        {o.paymentStatus || 'Belum Dibayar'}
                      </span>
                    </div>
                    <span className="font-black text-slate-900 text-sm">{o.total}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{o.product}</h4>
                    <p className="text-xs text-slate-500 truncate">
                      {o.brand} • {o.name} <span className="text-slate-400">({o.wa})</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                    {o.createdAt ? timeAgo(new Date(o.createdAt)) : o.date}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 min-w-0">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">Pengajuan Kebutuhan (RFQ)</h3>
              <p className="text-xs text-slate-500">Inquiry dari calon klien vendor</p>
            </div>
            <button
              onClick={() => onNavigate({ tab: 'rfq' })}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola RFQ</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {recentRfqs.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 font-medium">Belum ada pengajuan RFQ dari formulir.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentRfqs.map((r) => (
                <div key={r.id} className="py-3 first:pt-0 last:pb-0">
                  <button onClick={() => onNavigate({ tab: 'rfq', openId: r.id })} className="w-full text-left cursor-pointer">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {r.nama}
                        {r.perusahaan ? ` (${r.perusahaan})` : ''}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        {r.kategori}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{r.detail}</p>
                  </button>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      {r.status} • {r.createdAt}
                    </span>
                    <a
                      href={waLink(
                        r.whatsapp,
                        `Halo Bapak/Ibu ${r.nama}, kami dari BinaUsaha (${SITE_URL}) menindaklanjuti pengajuan kebutuhan "${r.kategori}".`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Hubungi WA</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ringkasan pengguna */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
        <Users className="w-3.5 h-3.5" />
        <span>{users.length} akun terdaftar • {orders.length} pesanan tercatat • {rfqs.length} RFQ</span>
      </div>

      {dialogs}
    </div>
  );
};
