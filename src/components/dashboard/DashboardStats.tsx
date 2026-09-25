import React from 'react';

interface DashboardStatsProps {
  totalOrders: number;
  processingOrders: number;
  completedOrders: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalOrders,
  processingOrders,
  completedOrders,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

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

    </div>
  );
};

export default DashboardStats;