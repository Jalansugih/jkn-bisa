import React from 'react';
import { Wallet, Clock, CheckCircle2, Copy, Link2, Users, RefreshCw } from 'lucide-react';
import { CommissionRow, ReferralStats, formatRupiah } from '../../lib/referral';
import { copyText } from '../../lib/share';

interface Props {
  referralCode: string | null;
  referralLoading?: boolean;
  onRetryReferral?: () => void;
  rows: CommissionRow[];
  totals: { pending: number; approved: number; paid: number; total: number };
  stats: ReferralStats | null;
  commissionsLoading?: boolean;
  onShopNow?: () => void;
  onAskPayout?: () => void;
}

const STATUS_LABEL: Record<CommissionRow['status'], string> = {
  pending: 'Menunggu (masa refund 14 hari)',
  approved: 'Bisa dicairkan',
  paid: 'Sudah dibayar',
  cancelled: 'Dibatalkan',
};

export const ReferralPanel: React.FC<Props> = ({
  referralCode, referralLoading, onRetryReferral, rows, totals, stats, commissionsLoading, onShopNow, onAskPayout,
}) => {
  const [copied, setCopied] = React.useState<'code' | 'link' | null>(null);

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

      {totals.approved > 0 && onAskPayout && (
        <button
          type="button"
          onClick={onAskPayout}
          className="mb-5 w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
        >
          Ajukan pencairan {formatRupiah(totals.approved)} via WhatsApp
        </button>
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
