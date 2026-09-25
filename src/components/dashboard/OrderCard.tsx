import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
  order: any;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
}) => {
  const orderNumber =
    order.orderNumber ||
    order.poNumber ||
    order.id ||
    'Pesanan';

  const productName =
    order.productName ||
    order.serviceName ||
    order.title ||
    'Pesanan BinaUsaha';

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Informasi Pesanan */}
        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-900">
            #{orderNumber}
          </p>

          <p className="mt-1 truncate text-sm text-slate-500">
            {productName}
          </p>

          {/* Optional PO */}
          {order.poNumber && order.poNumber !== orderNumber && (
            <p className="mt-1 text-xs text-slate-400">
              PO: {order.poNumber}
            </p>
          )}

        </div>

        {/* Status */}
        <div className="shrink-0">
          <OrderStatusBadge
            status={order.status}
          />
        </div>

      </div>

      {/* Detail Tambahan */}
      {(order.total || order.createdAt) && (
        <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">

          {order.total && (
            <div>
              <p className="text-xs text-slate-400">
                Total Pesanan
              </p>

              <p className="text-sm font-semibold text-slate-900">
                {typeof order.total === 'number'
                  ? `Rp ${order.total.toLocaleString('id-ID')}`
                  : order.total}
              </p>
            </div>
          )}

          {order.createdAt && (
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-400">
                Tanggal Pesanan
              </p>

              <p className="text-sm text-slate-600">
                {formatOrderDate(order.createdAt)}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

/**
 * Format tanggal pesanan.
 * Mendukung:
 * - Firestore Timestamp
 * - JavaScript Date
 * - string tanggal
 */
function formatOrderDate(value: any): string {
  try {
    if (value?.toDate) {
      return value
        .toDate()
        .toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

export default OrderCard;