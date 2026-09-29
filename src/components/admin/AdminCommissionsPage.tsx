import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw, Search, CheckCheck } from 'lucide-react';
import {
  AdminCommission,
  CommissionStatus,
  adminApproveOlderThan,
  adminFetchCommissions,
  adminSetCommissionStatus,
} from '../../lib/commissionService';
import { formatRupiah } from '../../lib/referral';

interface Props {
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const REFUND_DAYS = 14; // masa tunggu sebelum komisi boleh disetujui

const STATUS_STYLE: Record<CommissionStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paid: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};
const STATUS_LABEL: Record<CommissionStatus, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  paid: 'Dibayar',
  cancelled: 'Dibatalkan',
};

export const AdminCommissionsPage: React.FC<Props> = ({ showToast }) => {
  const [rows, setRows] = useState<AdminCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | CommissionStatus>('all');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await adminFetchCommissions());
    } catch (e: any) {
      showToast(e.message || 'Gagal memuat komisi.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const totals = useMemo(() => {
    const sum = (s: CommissionStatus) =>
      rows.filter((r) => r.status === s).reduce((a, r) => a + Number(r.amount), 0);
    return { pending: sum('pending'), approved: sum('approved'), paid: sum('paid') };
  }, [rows]);

  const visible = rows.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      r.order_id.toLowerCase().includes(q) ||
      (r.referrer?.name || '').toLowerCase().includes(q) ||
      (r.referrer?.email || '').toLowerCase().includes(q) ||
      (r.referrer?.referral_code || '').toLowerCase().includes(q)
    );
  });

  const setStatus = async (r: AdminCommission, status: CommissionStatus, confirmMsg?: string) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    setBusyId(r.id);
    try {
      await adminSetCommissionStatus(r.id, status);
      showToast(`Komisi ${r.order_id} -> ${STATUS_LABEL[status]}.`, 'success');
      await load();
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const approveOld = async () => {
    if (!confirm(`Setujui semua komisi "Menunggu" yang sudah lebih dari ${REFUND_DAYS} hari?`)) return;
    try {
      const n = await adminApproveOlderThan(REFUND_DAYS);
      showToast(n ? `${n} komisi disetujui.` : 'Tidak ada komisi yang memenuhi syarat.', n ? 'success' : 'info');
      await load();
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  return (
    <div id="admin-commissions-page" className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-slate-900">Komisi Referral</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Komisi dibuat otomatis saat pesanan berstatus Lunas. Setujui setelah masa refund, tandai Dibayar setelah transfer.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={approveOld} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <CheckCheck className="w-4 h-4" /> Setujui &gt; {REFUND_DAYS} hari
            </button>
            <button onClick={load} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <RefreshCw className="w-4 h-4" /> Muat ulang
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-amber-50 p-3"><div className="text-[10px] text-slate-500">Menunggu</div><div className="font-extrabold text-slate-900 text-sm">{formatRupiah(totals.pending)}</div></div>
          <div className="rounded-xl bg-emerald-50 p-3"><div className="text-[10px] text-slate-500">Harus dibayar</div><div className="font-extrabold text-slate-900 text-sm">{formatRupiah(totals.approved)}</div></div>
          <div className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] text-slate-500">Sudah dibayar</div><div className="font-extrabold text-slate-900 text-sm">{formatRupiah(totals.paid)}</div></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari order, nama, email, kode referral..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | CommissionStatus)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
          >
            <option value="all">Semua status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="paid">Dibayar</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Pemilik link</th>
                <th className="px-5 py-3.5">Pesanan</th>
                <th className="px-5 py-3.5">Hitungan</th>
                <th className="px-5 py-3.5">Komisi</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Memuat...</td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Belum ada komisi.</td></tr>
              ) : (
                visible.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{r.referrer?.name || '-'}</div>
                      <div className="text-[11px] text-slate-500">{r.referrer?.email || '-'}</div>
                      {r.referrer?.whatsapp && <div className="text-[11px] text-slate-500">WA {r.referrer.whatsapp}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold">{r.order_id}</div>
                      <div className="text-[11px] text-slate-500">{r.order?.product || '-'} · {r.order?.name || '-'}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                      {formatRupiah(r.base_amount)} x {Math.round(r.rate * 100)}%
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-extrabold text-slate-900">{formatRupiah(r.amount)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                      {busyId === r.id ? (
                        <Loader2 className="w-4 h-4 animate-spin inline text-slate-400" />
                      ) : (
                        <>
                          {r.status === 'pending' && (
                            <button onClick={() => setStatus(r, 'approved')} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold cursor-pointer">Setujui</button>
                          )}
                          {r.status === 'approved' && (
                            <button
                              onClick={() => setStatus(r, 'paid', `Tandai ${formatRupiah(r.amount)} untuk ${r.referrer?.name || 'user'} sudah DIBAYAR?`)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Tandai dibayar
                            </button>
                          )}
                          {(r.status === 'pending' || r.status === 'approved') && (
                            <button
                              onClick={() => setStatus(r, 'cancelled', 'Batalkan komisi ini?')}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-[11px] font-bold cursor-pointer"
                            >
                              Batalkan
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCommissionsPage;
