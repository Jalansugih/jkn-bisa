import React, { useEffect, useMemo, useState } from 'react';
import { Wallet, Clock, CheckCircle2, Copy } from 'lucide-react';
import { CommissionRow, fetchMyCommissions, formatRupiah } from '../../lib/referral';
import { copyText } from '../../lib/share';

interface Props {
  referralCode: string | null;
}

const STATUS_LABEL: Record<CommissionRow['status'], string> = {
  pending: 'Menunggu (masa refund)',
  approved: 'Bisa dicairkan',
  paid: 'Sudah dibayar',
  cancelled: 'Dibatalkan',
};

export const ReferralPanel: React.FC<Props> = ({ referralCode }) => {
  const [rows, setRows] = useState<CommissionRow[]>([]);

  useEffect(() => { fetchMyCommissions().then(setRows); }, []);

  const sum = (s: CommissionRow['status']) =>
    rows.filter((r) => r.status === s).reduce((a, r) => a + Number(r.amount), 0);

  const totals = useMemo(
    () => ({ pending: sum('pending'), approved: sum('approved'), paid: sum('paid') }),
    [rows]
  );

  if (!referralCode) return null;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-heading font-bold text-slate-900">Komisi Referral</h3>
        <button
          type="button"
          onClick={() => copyText(referralCode)}
          className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 cursor-pointer"
        >
          Kode: <span className="font-mono">{referralCode}</span> <Copy className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
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
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-slate-500">
          Belum ada komisi. Bagikan link paket dari halaman harga; komisi masuk setelah pembeli melunasi pesanan.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 text-xs">
          {rows.map((r) => (
            <li key={r.id} className="py-2.5 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-800">{r.order_id}</div>
                <div className="text-slate-500">
                  {formatRupiah(r.base_amount)} x {Math.round(r.rate * 100)}% · {STATUS_LABEL[r.status]}
                </div>
              </div>
              <div className="font-extrabold text-slate-900">{formatRupiah(r.amount)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReferralPanel;
