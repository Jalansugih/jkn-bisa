/**
 * Perhitungan untuk dashboard admin. Semua fungsi murni (tanpa akses database):
 * data pesanan, RFQ, pengguna, dan pencairan sudah dimuat AdminDashboard, jadi
 * angka di Ikhtisar selalu sama dengan isi menu Pesanan/RFQ/Pengguna/Komisi.
 *
 * Aturan omset: hanya pesanan berstatus pembayaran "Lunas". Pesanan yang belum
 * dibayar atau masih menunggu verifikasi bukan pemasukan, jadi tidak dihitung.
 * Pesanan ditempatkan pada tanggal pesanan dibuat (created_at).
 */
import { OrderItem } from '../types';
import { AdminSeed, AdminUserListItem, OrderViewKey, RfqItem } from '../types/admin';
import type { AdminPayout } from './payoutService';

export type Period = '7d' | '30d' | 'ytd';
export type Metric = 'revenue' | 'orders' | 'users';

export const PERIOD_LABEL: Record<Period, string> = {
  '7d': '7 Hari Terakhir',
  '30d': '30 Hari Terakhir',
  ytd: 'Tahun Ini',
};

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/* ------------------------------------------------------------------ */
/* Waktu & nominal                                                     */
/* ------------------------------------------------------------------ */

function toDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function orderTime(o: OrderItem): Date | null {
  return toDate(o.createdAt) || toDate(o.date);
}

export function rfqTime(r: RfqItem): Date | null {
  return toDate(r.createdAtIso) || toDate(r.createdAt);
}

export function userTime(u: AdminUserListItem): Date | null {
  return toDate(u.createdAt);
}

/** "Rp 4.499.000" -> 4499000 */
export function orderAmount(o: OrderItem): number {
  const digits = String(o.total || '').replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) || 0 : 0;
}

export const isPaid = (o: OrderItem) => o.paymentStatus === 'Lunas';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/* ------------------------------------------------------------------ */
/* Tampilan cepat pesanan (dipakai Ikhtisar & menu Pesanan)             */
/* ------------------------------------------------------------------ */

/**
 * verify   : bukti bayar masuk, admin perlu memverifikasi
 * unpaid   : pesanan dibuat tetapi belum dibayar
 * queue    : sudah lunas, belum mulai dikerjakan
 * progress : sedang dikerjakan / QC
 * done     : selesai
 */
export function matchesOrderView(o: OrderItem, view: OrderViewKey): boolean {
  switch (view) {
    case 'verify':
      return o.paymentStatus === 'Menunggu Verifikasi';
    case 'unpaid':
      return (o.paymentStatus || 'Belum Dibayar') === 'Belum Dibayar' && o.status !== 'Selesai';
    case 'queue':
      return o.paymentStatus === 'Lunas' && o.status === 'Verifikasi';
    case 'progress':
      return o.status === 'Pengerjaan' || o.status === 'QC & Training';
    case 'done':
      return o.status === 'Selesai';
    default:
      return true;
  }
}

export interface OrderCounts {
  total: number;
  verify: number;
  unpaid: number;
  queue: number;
  progress: number;
  done: number;
  byStatus: Record<OrderItem['status'], number>;
}

export function countOrders(orders: OrderItem[]): OrderCounts {
  const byStatus: OrderCounts['byStatus'] = { Verifikasi: 0, Pengerjaan: 0, 'QC & Training': 0, Selesai: 0 };
  const c: OrderCounts = { total: orders.length, verify: 0, unpaid: 0, queue: 0, progress: 0, done: 0, byStatus };
  for (const o of orders) {
    if (byStatus[o.status] !== undefined) byStatus[o.status]++;
    if (matchesOrderView(o, 'verify')) c.verify++;
    if (matchesOrderView(o, 'unpaid')) c.unpaid++;
    if (matchesOrderView(o, 'queue')) c.queue++;
    if (matchesOrderView(o, 'progress')) c.progress++;
    if (matchesOrderView(o, 'done')) c.done++;
  }
  return c;
}

/* ------------------------------------------------------------------ */
/* Omset bulan berjalan                                                 */
/* ------------------------------------------------------------------ */

export interface MonthToDate {
  current: number;
  previous: number;
  growthPct: number | null;
  paidOrders: number;
}

/** Omset 1 bulan ini sampai hari ini, dibanding periode yang sama (jumlah hari sama) di bulan lalu. */
export function monthToDate(orders: OrderItem[], now: Date = new Date()): MonthToDate {
  const curStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  const prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth(), Math.min(now.getDate(), prevMonthDays) + 1);
  const curEnd = addDays(startOfDay(now), 1);

  let current = 0;
  let previous = 0;
  let paidOrders = 0;
  for (const o of orders) {
    if (!isPaid(o)) continue;
    const t = orderTime(o);
    if (!t) continue;
    if (t >= curStart && t < curEnd) {
      current += orderAmount(o);
      paidOrders++;
    } else if (t >= prevStart && t < prevEnd) {
      previous += orderAmount(o);
    }
  }
  return { current, previous, growthPct: previous > 0 ? ((current - previous) / previous) * 100 : null, paidOrders };
}

/* ------------------------------------------------------------------ */
/* Deret waktu untuk grafik                                             */
/* ------------------------------------------------------------------ */

export interface Series {
  labels: string[];
  values: number[];
  total: number;
  previousTotal: number;
  growthPct: number | null;
  /** Rentang yang sedang ditampilkan, mis. "2 Okt - 8 Okt 2026". */
  rangeLabel: string;
}

interface Bucket {
  start: Date;
  end: Date;
  label: string;
}

function buildBuckets(period: Period, now: Date): { current: Bucket[]; previous: Bucket[] } {
  const today = startOfDay(now);
  if (period === 'ytd') {
    const months = now.getMonth() + 1;
    const make = (year: number): Bucket[] =>
      Array.from({ length: months }, (_, m) => ({
        start: new Date(year, m, 1),
        end: new Date(year, m + 1, 1),
        label: MONTH_SHORT[m],
      }));
    return { current: make(now.getFullYear()), previous: make(now.getFullYear() - 1) };
  }
  const n = period === '7d' ? 7 : 30;
  const make = (shift: number): Bucket[] =>
    Array.from({ length: n }, (_, i) => {
      const start = addDays(today, -(n - 1 - i) - shift);
      return { start, end: addDays(start, 1), label: `${start.getDate()} ${MONTH_SHORT[start.getMonth()]}` };
    });
  return { current: make(0), previous: make(n) };
}

export function buildSeries(
  orders: OrderItem[],
  users: AdminUserListItem[],
  period: Period,
  metric: Metric,
  now: Date = new Date()
): Series {
  const { current, previous } = buildBuckets(period, now);

  const points: { t: Date; v: number }[] = [];
  if (metric === 'users') {
    for (const u of users) {
      const t = userTime(u);
      if (t) points.push({ t, v: 1 });
    }
  } else {
    for (const o of orders) {
      if (metric === 'revenue' && !isPaid(o)) continue;
      const t = orderTime(o);
      if (t) points.push({ t, v: metric === 'revenue' ? orderAmount(o) : 1 });
    }
  }

  const fill = (buckets: Bucket[]) => {
    const values = buckets.map(() => 0);
    for (const p of points) {
      const i = buckets.findIndex((b) => p.t >= b.start && p.t < b.end);
      if (i >= 0) values[i] += p.v;
    }
    return values;
  };

  const values = fill(current);
  const prevValues = fill(previous);
  const total = values.reduce((a, b) => a + b, 0);
  const previousTotal = prevValues.reduce((a, b) => a + b, 0);

  const first = current[0].start;
  const last = addDays(current[current.length - 1].end, -1);
  const fmt = (d: Date, withYear = false) =>
    `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}${withYear ? ` ${d.getFullYear()}` : ''}`;
  const rangeLabel = period === 'ytd' ? `Jan - ${MONTH_SHORT[last.getMonth()]} ${last.getFullYear()}` : `${fmt(first)} - ${fmt(last, true)}`;

  return {
    labels: current.map((b) => b.label),
    values,
    total,
    previousTotal,
    growthPct: previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : null,
    rangeLabel,
  };
}

/* ------------------------------------------------------------------ */
/* Sorotan di bawah grafik                                              */
/* ------------------------------------------------------------------ */

export interface Insights {
  topClient: { name: string; value: number } | null;
  peakDay: { name: string; value: number } | null;
  aov: number;
  paidCount: number;
}

function periodStart(period: Period, now: Date): Date {
  if (period === 'ytd') return new Date(now.getFullYear(), 0, 1);
  return addDays(startOfDay(now), -((period === '7d' ? 7 : 30) - 1));
}

export function buildInsights(orders: OrderItem[], period: Period, now: Date = new Date()): Insights {
  const from = periodStart(period, now);
  const to = addDays(startOfDay(now), 1);
  const byClient = new Map<string, number>();
  const byWeekday = [0, 0, 0, 0, 0, 0, 0];
  let revenue = 0;
  let paidCount = 0;

  for (const o of orders) {
    if (!isPaid(o)) continue;
    const t = orderTime(o);
    if (!t || t < from || t >= to) continue;
    const amount = orderAmount(o);
    revenue += amount;
    paidCount++;
    const key = (o.brand || o.name || 'Tanpa nama').trim();
    byClient.set(key, (byClient.get(key) || 0) + amount);
    byWeekday[t.getDay()] += amount;
  }

  let topClient: Insights['topClient'] = null;
  for (const [name, value] of byClient) {
    if (!topClient || value > topClient.value) topClient = { name, value };
  }
  let peakIdx = -1;
  byWeekday.forEach((v, i) => {
    if (v > 0 && (peakIdx < 0 || v > byWeekday[peakIdx])) peakIdx = i;
  });

  return {
    topClient,
    peakDay: peakIdx >= 0 ? { name: DAY_NAMES[peakIdx], value: byWeekday[peakIdx] } : null,
    aov: paidCount > 0 ? Math.round(revenue / paidCount) : 0,
    paidCount,
  };
}

/* ------------------------------------------------------------------ */
/* Perlu tindakan (lonceng & kartu)                                     */
/* ------------------------------------------------------------------ */

export type ActionTone = 'amber' | 'blue' | 'purple' | 'emerald';

export interface ActionItem {
  key: string;
  label: string;
  detail: string;
  count: number;
  tone: ActionTone;
  seed: AdminSeed;
}

export interface PayoutSummary {
  requestedCount: number;
  requestedAmount: number;
}

export function summarizePayouts(payouts: AdminPayout[]): PayoutSummary {
  let requestedCount = 0;
  let requestedAmount = 0;
  for (const p of payouts) {
    if (p.status === 'requested') {
      requestedCount++;
      requestedAmount += Number(p.amount) || 0;
    }
  }
  return { requestedCount, requestedAmount };
}

export function buildActionItems(
  orders: OrderItem[],
  rfqs: RfqItem[],
  payouts: AdminPayout[],
  formatMoney: (n: number) => string
): ActionItem[] {
  const oc = countOrders(orders);
  const pay = summarizePayouts(payouts);
  const newRfqs = rfqs.filter((r) => r.status === 'Baru').length;

  const items: ActionItem[] = [
    {
      key: 'verify',
      label: 'Pembayaran perlu diverifikasi',
      detail: 'Cek bukti transfer, lalu tandai Lunas',
      count: oc.verify,
      tone: 'amber',
      seed: { tab: 'orders', orderView: 'verify' },
    },
    {
      key: 'queue',
      label: 'Pesanan lunas belum dikerjakan',
      detail: 'Mulai pengerjaan & kabari klien',
      count: oc.queue,
      tone: 'blue',
      seed: { tab: 'orders', orderView: 'queue' },
    },
    {
      key: 'rfq',
      label: 'Pengajuan RFQ baru',
      detail: 'Hubungi calon klien & kirim penawaran',
      count: newRfqs,
      tone: 'purple',
      seed: { tab: 'rfq', rfqStatus: 'Baru' },
    },
    {
      key: 'payout',
      label: 'Pengajuan pencairan komisi',
      detail: pay.requestedCount > 0 ? `${formatMoney(pay.requestedAmount)} menunggu ditransfer` : 'Transfer ke rekening mitra',
      count: pay.requestedCount,
      tone: 'emerald',
      seed: { tab: 'commissions' },
    },
  ];
  return items.filter((i) => i.count > 0);
}

/* ------------------------------------------------------------------ */
/* Aktivitas terkini                                                    */
/* ------------------------------------------------------------------ */

export interface ActivityItem {
  id: string;
  kind: 'order' | 'rfq' | 'user' | 'payout';
  title: string;
  subtitle: string;
  at: Date;
  seed: AdminSeed;
}

export function buildActivity(
  orders: OrderItem[],
  rfqs: RfqItem[],
  users: AdminUserListItem[],
  payouts: AdminPayout[],
  formatMoney: (n: number) => string,
  limit = 8
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const o of orders.slice(0, 12)) {
    const at = orderTime(o);
    if (!at) continue;
    items.push({
      id: `o-${o.id}`,
      kind: 'order',
      title: `Pesanan ${o.id} dibuat`,
      subtitle: `${o.brand || o.name} • ${o.total}`,
      at,
      seed: { tab: 'orders', openId: o.id },
    });
  }
  for (const r of rfqs.slice(0, 12)) {
    const at = rfqTime(r);
    if (!at) continue;
    items.push({
      id: `r-${r.id}`,
      kind: 'rfq',
      title: 'Pengajuan RFQ baru',
      subtitle: `${r.perusahaan || r.nama} • ${r.kategori}`,
      at,
      seed: { tab: 'rfq', openId: r.id },
    });
  }
  for (const u of users.slice(0, 12)) {
    const at = userTime(u);
    if (!at) continue;
    items.push({
      id: `u-${u.id}`,
      kind: 'user',
      title: 'Pengguna baru bergabung',
      subtitle: u.businessName ? `${u.name} • ${u.businessName}` : u.name,
      at,
      seed: { tab: 'users', query: u.email || u.name },
    });
  }
  for (const p of payouts.slice(0, 12)) {
    const at = toDate(p.created_at);
    if (!at) continue;
    items.push({
      id: `p-${p.id}`,
      kind: 'payout',
      title: 'Pengajuan pencairan komisi',
      subtitle: `${p.user?.name || p.user?.email || 'Mitra'} • ${formatMoney(Number(p.amount) || 0)}`,
      at,
      seed: { tab: 'commissions' },
    });
  }

  return items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit);
}
