import React from 'react';

interface DashboardStatsProps {
  totalOrders: number;
  processingOrders: number;
  completedOrders: number;
  /** Total pendapatan afiliasi (menunggu + bisa dicairkan + dibayar), dalam rupiah. */
  affiliateIncome?: number;
  /** Bagian yang sudah bisa dicairkan. */
  affiliateWithdrawable?: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalOrders,
  processingOrders,
  completedOrders,
  affiliateIncome = 0,
  affiliateWithdrawable = 0,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Total Pesanan */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Total Pesanan
        </p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {totalOrders}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Seluruh pesanan Anda
        </p>
      </div>

      {/* Sedang Diproses */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Sedang Diproses
        </p>

        <p className="mt-2 text-3xl font-bold text-blue-600">
          {processingOrders}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Pesanan yang sedang berjalan
        </p>
      </div>

      {/* Pesanan Selesai */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Pesanan Selesai
        </p>

        <p className="mt-2 text-3xl font-bold text-green-600">
          {completedOrders}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Pesanan yang telah selesai
        </p>
      </div>

      {/* Pendapatan Afiliasi */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Pendapatan Afiliasi
        </p>

        <p className="mt-2 text-3xl font-bold text-blue-700">
          {'Rp ' + Math.round(affiliateIncome).toLocaleString('id-ID')}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Bisa dicairkan: {'Rp ' + Math.round(affiliateWithdrawable).toLocaleString('id-ID')}
        </p>
      </div>

    </div>
  );
};

export default DashboardStats;