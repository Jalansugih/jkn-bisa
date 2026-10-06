import React from 'react';
import { Wallet, Clock, CheckCircle2, Copy, Link2, Users, RefreshCw } from 'lucide-react';
import { CommissionRow, ReferralStats, formatRupiah } from '../../lib/referral';
import { copyText } from '../../lib/share';
import {
  Payout, PayoutAccount, DEFAULT_MIN_PAYOUT,
  fetchMyPayoutAccount, fetchMinPayout, fetchMyPayouts, requestPayout,
} from '../../lib/payoutService';

interface Props {
  referralCode: string | null;
  referralLoading?: boolean;
  onRetryReferral?: () => void;
  rows: CommissionRow[];
  totals: { pending: number; approved: number; paid: number; total: number };
  stats: ReferralStats | null;
  commissionsLoading?: boolean;
  onShopNow?: () => void;
  /** Tidak dipakai lagi (pencairan kini diajukan lewat formulir di panel ini). Dibiarkan agar pemanggil lama tetap valid. */
  onAskPayout?: () => void;
  /** Dipanggil setelah pengajuan berhasil, supaya induk memuat ulang daftar komisi. */
  onPayoutChanged?: () => void;
}

const STATUS_LABEL: Record<CommissionRow['status'], string> = {
  pending: 'Menunggu (masa refund 14 hari)',
  approved: 'Bisa dicairkan',
  paid: 'Sudah dibayar',
  cancelled: 'Dibatalkan',
};

export const ReferralPanel: React.FC<Props> = ({
  referralCode, referralLoading, onRetryReferral, rows, totals, stats, commissionsLoading, onShopNow, onPayoutChanged,
}) => {
  const [copied, setCopied] = React.useState<'code' | 'link' | null>(null);

  // --- pencairan ---
  const [payouts, setPayouts] = React.useState<Payout[]>([]);
  const [minPayout, setMinPayout] = React.useState(DEFAULT_MIN_PAYOUT);
  const [formOpen, setFormOpen] = React.useState(false);
  const [account, setAccount] = React.useState<PayoutAccount>({ bank_name: '', account_number: '', account_name: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [payoutError, setPayoutError] = React.useState<string | null>(null);

  const loadPayouts = React.useCallback(async () => { setPayouts(await fetchMyPayouts()); }, []);

  React.useEffect(() => {
    loadPayouts();
    fetchMinPayout().then(setMinPayout);
    fetchMyPayoutAccount().then((a) => { if (a) setAccount(a); });
  }, [loadPayouts]);

  // Komisi 'Bisa dicairkan' yang sudah terkunci di pengajuan aktif tidak bisa diajukan lagi.
  const openPayout = payouts.find((p) => p.status === 'requested');
  const available = Math.max(0, totals.approved - (openPayout ? Number(openPayout.amount) : 0));
  const canRequest = !openPayout && available >= minPayout;

  const submitPayout = async () => {
    setPayoutError(null);
    setSubmitting(true);
    try {
      await requestPayout({
        bank_name: account.bank_name.trim(),
        account_number: account.account_number.trim(),
        account_name: account.account_name.trim(),
      });
      setFormOpen(false);
      await loadPayouts();
      onPayoutChanged?.();
    } catch (e: any) {
      setPayoutError(e.message || 'Gagal mengajukan pencairan.');
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (what: 'code' | 'link') => {
    if (!referralCode) return;
    const text = what === 'code' ? referralCode : `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`;
    if (await copyText(text)) {
      setCopied(what);
      setTimeout(() => setCopied(null), 1800);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h3 className="font-heading font-bold text-slate-900">Pendapatan Afiliasi</h3>
        {referralCode ? (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => copy('code')} className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 cursor-pointer">
              Kode: <span className="font-mono">{referralCode}</span> <Copy className="w-3.5 h-3.5" />
              {copied === 'code' && <span className="text-emerald-600">Tersalin</span>}
            </button>
            <button type="button" onClick={() => copy('link')} className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 cursor-pointer">
              <Link2 className="w-3.5 h-3.5" /> Salin link referral
              {copied === 'link' && <span className="text-emerald-600">Tersalin</span>}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={referralLoading}
            onClick={onRetryReferral}
            className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${referralLoading ? 'animate-spin' : ''}`} />
            {referralLoading ? 'Menyiapkan kode referral…' : 'Muat ulang kode referral'}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500 mb-4">
        Dapatkan komisi dari setiap pembeli yang memesan lewat link Anda dan pesanannya sudah Lunas. Besar komisi
        berbeda tiap paket (persentase atau nominal tetap) dan tertera di tombol <strong>Bagikan</strong> pada paket. Komisi masuk status <strong>Menunggu</strong> selama masa refund 14 hari, lalu menjadi{' '}
        <strong>Bisa dicairkan</strong>.
      </p>

      <div className="rounded-xl bg-blue-600 text-white p-4 mb-4">
        <div className="text-[11px] text-blue-100">Total pendapatan afiliasi</div>
        <div className="text-2xl font-extrabold">{formatRupiah(totals.total)}</div>
        <div className="text-[11px] text-blue-100 mt-0.5">
          {commissionsLoading ? 'Memuat…' : 'Gabungan komisi menunggu + bisa dicairkan + sudah dibayar'}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-center">
        <div className="rounded-xl bg-emerald-50 p-3">
          <Wallet className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <div className="text-[10px] text-slate-500">Bisa dicairkan</div>
          <div className="text-sm font-extrabold text-slate-900">{formatRupiah(totals.approved)}</div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
          <div className="text-[10px] text-slate-500">Menunggu</div>
          <div className="text-sm font-extrabold text-slate-900">{formatRupiah(totals.pending)}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <CheckCircle2 className="w-4 h-4 text-slate-500 mx-auto mb-1" />
          <div className="text-[10px] text-slate-500">Sudah dibayar</div>
          <div className="text-sm font-extrabold text-slate-900">{formatRupiah(totals.paid)}</div>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3">
          <Users className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
          <div className="text-[10px] text-slate-500">Pesanan dari link Anda</div>
          <div className="text-sm font-extrabold text-slate-900">
            {stats ? `${stats.paidOrders}/${stats.referredOrders}` : '-'}
          </div>
          <div className="text-[9px] text-slate-400">lunas / total</div>
        </div>
      </div>

      {openPayout && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          Pengajuan pencairan <strong>{formatRupiah(openPayout.amount)}</strong> ke {openPayout.bank_name} {openPayout.account_number}{' '}
          sedang diproses admin. Anda akan melihat statusnya berubah di riwayat di bawah.
        </div>
      )}

      {!openPayout && available > 0 && !canRequest && (
        <p className="mb-5 text-[11px] text-slate-500">
          Pencairan bisa diajukan mulai {formatRupiah(minPayout)}. Saat ini {formatRupiah(available)} bisa dicairkan.
        </p>
      )}

      {canRequest && !formOpen && (
        <button
          type="button"
          onClick={() => { setPayoutError(null); setFormOpen(true); }}
          className="mb-5 w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
        >
          Cairkan {formatRupiah(available)}
        </button>
      )}

      {canRequest && formOpen && (
        <div className="mb-5 rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="text-xs font-bold text-slate-900">Rekening tujuan transfer</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              value={account.bank_name}
              onChange={(e) => setAccount({ ...account, bank_name: e.target.value })}
              placeholder="Bank / e-wallet (mis. BCA, DANA)"
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={account.account_number}
              onChange={(e) => setAccount({ ...account, account_number: e.target.value })}
              inputMode="numeric"
              placeholder="Nomor rekening"
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={account.account_name}
              onChange={(e) => setAccount({ ...account, account_name: e.target.value })}
              placeholder="Nama pemilik rekening"
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Seluruh komisi <strong>Bisa dicairkan</strong> ({formatRupiah(available)}) akan diajukan sekaligus. Pastikan nama pemilik rekening sesuai.
          </p>
          {payoutError && <p className="text-[11px] font-semibold text-rose-600">{payoutError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={submitPayout}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold cursor-pointer"
            >
              {submitting ? 'Mengirim...' : 'Ajukan pencairan'}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {payouts.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-bold text-slate-900 mb-1.5">Riwayat pencairan</div>
          <ul className="divide-y divide-slate-100 text-xs">
            {payouts.map((p) => (
              <li key={p.id} className="py-2 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-800">
                    {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{p.bank_name} {p.account_number}
                  </div>
                  <div className="text-slate-500">
                    {p.status === 'requested' && 'Menunggu transfer admin'}
                    {p.status === 'paid' && `Sudah ditransfer${p.transfer_ref ? ` · ref ${p.transfer_ref}` : ''}`}
                    {p.status === 'rejected' && `Ditolak${p.note ? `: ${p.note}` : ''}. Komisi kembali bisa diajukan.`}
                  </div>
                </div>
                <div className={`font-extrabold ${p.status === 'rejected' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {formatRupiah(p.amount)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="text-xs text-slate-500">
          Belum ada komisi. Buka halaman harga, tekan tombol <strong>Bagikan &amp; dapat komisi</strong> pada paket yang
          ingin dijual, lalu kirim link-nya.
          {onShopNow && (
            <button type="button" onClick={onShopNow} className="ml-1 font-semibold text-blue-700 underline cursor-pointer">
              Lihat paket
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 text-xs">
          {rows.map((r) => (
            <li key={r.id} className="py-2.5 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-800">{r.order_id}</div>
                <div className="text-slate-500">
                  {r.commission_type === 'fixed'
                    ? `Nominal tetap dari paket ${formatRupiah(r.base_amount)}`
                    : `${formatRupiah(r.base_amount)} x ${Number((r.rate * 100).toFixed(2))}%`}{' · '}{STATUS_LABEL[r.status]}
                </div>
              </div>
              <div className={`font-extrabold ${r.status === 'cancelled' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {formatRupiah(r.amount)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReferralPanel;
