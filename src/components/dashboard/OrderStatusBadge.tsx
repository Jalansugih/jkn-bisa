import React from 'react';

interface OrderStatusBadgeProps {
  status?: string | null;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
}) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';

  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    pending: {
      label: 'Menunggu Konfirmasi',
      className: 'bg-amber-50 text-amber-700',
    },

    menunggu: {
      label: 'Menunggu Konfirmasi',
      className: 'bg-amber-50 text-amber-700',
    },

    processing: {
      label: 'Diproses',
      className: 'bg-blue-50 text-blue-600',
    },

    diproses: {
      label: 'Diproses',
      className: 'bg-blue-50 text-blue-600',
    },

    shipped: {
      label: 'Dikirim',
      className: 'bg-purple-50 text-purple-600',
    },

    dikirim: {
      label: 'Dikirim',
      className: 'bg-purple-50 text-purple-600',
    },

    completed: {
      label: 'Selesai',
      className: 'bg-green-50 text-green-600',
    },

    selesai: {
      label: 'Selesai',
      className: 'bg-green-50 text-green-600',
    },

    cancelled: {
      label: 'Dibatalkan',
      className: 'bg-red-50 text-red-600',
    },

    dibatalkan: {
      label: 'Dibatalkan',
      className: 'bg-red-50 text-red-600',
    },
  };

  const config =
    statusConfig[normalizedStatus] || {
      label: status || 'Menunggu Konfirmasi',
      className: 'bg-slate-100 text-slate-600',
    };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;