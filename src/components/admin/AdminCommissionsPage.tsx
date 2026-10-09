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
import { adminSetCommissionRate, useCommissionRate } from '../../lib/commissionRate';
import { AdminPayout, adminFetchPayouts, adminMarkPayoutPaid, adminRejectPayout } from '../../lib/payoutService';
import { useAdminDialogs } from './AdminDialogs';

interface Props {
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  /** Dipanggil setelah pencairan berubah supaya Ikhtisar & lonceng ikut diperbarui. */
  onDataChanged?: () => void | Promise<void>;
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

export const AdminCommissionsPage: React.FC<Props> = ({ showToast, onDataChanged }) => {
  const { confirm, prompt, dialogs } = useAdminDialogs();
  const [rows, setRows] = useState<AdminCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | CommissionStatus>('all');
  const [query, setQuery] = useState('');
  const currentRate = useCommissionRate();
  const [rateInput, setRateInput] = useState('');
  const [savingRate, setSavingRate] = useState(false);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [busyPayoutId, setBusyPayoutId] = useState<string | null>(null);

  useEffect(() => { setRateInput(String(Number((currentRate * 100).toFixed(1)))); }, [currentRate]);

  const saveRate = async () => {
    const pct = Number(rateInput.replace(',', '.'));
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      showToast('Isi tarif antara 0 sampai 100.', 'warning');
      return;
    }
    const ok = await confirm({
      title: `Ubah tarif komisi menjadi ${pct}%?`,
      message: 'Hanya berlaku untuk pesanan yang dilunasi setelah ini. Komisi yang sudah tercatat tidak berubah.',
      confirmLabel: 'Ya, simpan tarif',
    });
    if (!ok) return;
    setSavingRate(true);
    try {
      await adminSetCommissionRate(pct);
      showToast(`Tarif komisi sekarang ${pct}%.`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal menyimpan tarif.', 'error');
    } finally {
      setSavingRate(false);
    }
  };

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

  const loadPayouts = useCallback(async () => {
    try {
      setPayouts(await adminFetchPayouts());
    } catch (e: any) {
      // tabel pencairan baru ada setelah migrasi commission_payouts dijalankan
      showToast(e.message || 'Gagal memuat pencairan.', 'error');
    }
  }, [showToast]);

  useEffect(() => { load(); loadPayouts(); }, [load, loadPayouts]);

  const markPayoutPaid = async (p: AdminPayout) => {
    const ref = await prompt({
      title: 'Tandai sudah ditransfer',
      message: `Pastikan Anda sudah mentransfer ${formatRupiah(p.amount)} ke ${p.bank_name} ${p.account_number} a.n. ${p.account_name}. Setelah ditandai, komisi terkait berstatus Dibayar.`,
      label: 'Nomor referensi / catatan transfer (opsional)',
      placeholder: 'Contoh: TRX-20261009-001',
      confirmLabel: 'Ya, sudah ditransfer',
    });
    if (ref === null) return;
    setBusyPayoutId(p.id);
    try {
      await adminMarkPayoutPaid(p.id, ref);
      showToast('Pencairan ditandai sudah ditransfer.', 'success');
      await Promise.all([load(), loadPayouts()]);
      await onDataChanged?.();
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setBusyPayoutId(null);
    }
  };

  const rejectPayout = async (p: AdminPayout) => {
    const reason = await prompt({
      title: 'Tolak pengajuan pencairan?',
      message: `${formatRupiah(p.amount)} untuk ${p.user?.name || p.user?.email || 'mitra'}. Komisinya kembali ke status Disetujui dan alasan ini akan terlihat oleh pengguna.`,
      label: 'Alasan penolakan',
      placeholder: 'Contoh: Nama rekening tidak sesuai dengan nama akun',
      multiline: true,
      required: true,
      confirmLabel: 'Tolak pencairan',
      tone: 'danger',
    });
    if (reason === null) return;
    if (!reason.trim()) { showToast('Isi alasan penolakan.', 'warning'); return; }
    setBusyPayoutId(p.id);
    try {
      await adminRejectPayout(p.id, reason);
      showToast('Pencairan ditolak. Komisi kembali ke Disetujui.', 'success');
      await Promise.all([load(), loadPayouts()]);
      await onDataChanged?.();
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setBusyPayoutId(null);
    }
  };

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
    if (confirmMsg) {
      const ok = await confirm({
        title: status === 'cancelled' ? 'Batalkan komisi?' : 'Setujui komisi?',
        message: confirmMsg,
        confirmLabel: status === 'cancelled' ? 'Ya, batalkan' : 'Ya, setujui',
        tone: status === 'cancelled' ? 'danger' : 'primary',
      });
      if (!ok) return;
    }
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
    const ok = await confirm({
      title: 'Setujui komisi yang melewati masa refund?',
      message: `Semua komisi berstatus Menunggu yang usianya lebih dari ${REFUND_DAYS} hari akan disetujui dan masuk ke daftar yang bisa dicairkan mitra.`,
      confirmLabel: 'Ya, setujui semua',
    });
    if (!ok) return;
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
              Komisi dibuat otomatis saat pesanan berstatus Lunas. Setujui setelah masa refund. Transfer dicatat lewat pengajuan pencairan user.
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

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-heading font-extrabold text-slate-900">Pencairan</h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-3">
          Transfer manual ke rekening yang diisi user, lalu tandai ditransfer dan catat nomor referensinya.
        </p>
        {payouts.length === 0 ? (
          <div className="text-xs text-slate-400">Belum ada pengajuan pencairan.</div>
        ) : (
          <ul className="divide-y divide-slate-100 text-xs">
            {payouts.map((p) => (
              <li key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900">
                    {formatRupiah(p.amount)} · {p.user?.name || p.user?.email || '-'}
                  </div>
                  <div className="text-slate-600">{p.bank_name} {p.account_number} a.n. {p.account_name}</div>
                  <div className="text-[11px] text-slate-500">
                    Diajukan {new Date(p.created_at).toLocaleString('id-ID')}
                    {p.user?.whatsapp ? ` · WA ${p.user.whatsapp}` : ''}
                    {p.status === 'paid' && ` · Ditransfer${p.transfer_ref ? `, ref ${p.transfer_ref}` : ''}`}
                    {p.status === 'rejected' && ` · Ditolak: ${p.note || '-'}`}
                  </div>
                </div>
                <div className="whitespace-nowrap space-x-1.5">
                  {p.status === 'requested' ? (
                    busyPayoutId === p.id ? (
                      <Loader2 className="w-4 h-4 animate-spin inline text-slate-400" />
                    ) : (
                      <>
                        <button onClick={() => markPayoutPaid(p)} className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold cursor-pointer">Tandai ditransfer</button>
                        <button onClick={() => rejectPayout(p)} className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-[11px] font-bold cursor-pointer">Tolak</button>
                      </>
                    )
                  ) : (
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.status === 'paid' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {p.status === 'paid' ? 'Ditransfer' : 'Ditolak'}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-heading font-extrabold text-slate-900">Tarif Komisi Umum (default)</h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-3">
          Dipakai oleh produk yang tidak punya aturan komisi sendiri. Komisi khusus (persentase atau nominal tetap) diatur per produk di menu Produk. Perubahan hanya berlaku untuk pesanan yang dilunasi setelahnya; komisi yang sudah tercatat tidak berubah.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-28">
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
          </div>
          <button
            onClick={saveRate}
            disabled={savingRate || Number(rateInput) === Number((currentRate * 100).toFixed(1))}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer"
          >
            {savingRate ? 'Menyimpan...' : 'Simpan tarif'}
          </button>
          <span className="text-[11px] text-slate-500">Saat ini: <strong>{Number((currentRate * 100).toFixed(1))}%</strong></span>
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
                      {r.commission_type === 'fixed'
                        ? `Nominal tetap (paket ${formatRupiah(r.base_amount)})`
                        : `${formatRupiah(r.base_amount)} x ${Number((r.rate * 100).toFixed(2))}%`}
                      {r.price_verified === false && (
                        <div className="mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 inline-block">
                          Harga belum terverifikasi - cek manual
                        </div>
                      )}
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
                            <button onClick={() =>
                              setStatus(
                                r,
                                'approved',
                                r.price_verified === false
                                  ? 'Harga komisi ini belum terverifikasi dari katalog produk. Setujui tetap?'
                                  : undefined
                              )
                            } className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold cursor-pointer">Setujui</button>
                          )}
                          {(r.status === 'pending' || r.status === 'approved') && !r.payout_id && (
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
      {dialogs}
    </div>
  );
};

export default AdminCommissionsPage;
