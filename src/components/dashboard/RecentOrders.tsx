import React from 'react';
import OrderCard from './OrderCard';
import EmptyOrders from './EmptyOrders';

interface RecentOrdersProps {
  orders?: any[];
  onStartShopping?: () => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders = [],
  onStartShopping,
}) => {
  return (
    <section className="mt-8">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Pesanan Saya
          </h2>

          <p className="text-sm text-slate-500">
            Pantau status pesanan Anda
          </p>
        </div>

        {/* Jumlah Pesanan */}
        {orders.length > 0 && (
          <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
            {orders.length} Pesanan
          </span>
        )}

      </div>


      {/* Pesanan */}
      {orders.length === 0 ? (

        <EmptyOrders
          onStartShopping={onStartShopping}
        />

      ) : (

        <div className="space-y-4">

          {orders.map((order, index) => (
            <OrderCard
              key={order.id || index}
              order={order}
            />
          ))}

        </div>

      )}

    </section>
  );
};

export default RecentOrders;