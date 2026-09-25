import React from 'react';

interface EmptyOrdersProps {
  onStartShopping?: () => void;
}

const EmptyOrders: React.FC<EmptyOrdersProps> = ({
  onStartShopping,
}) => {
  return (
    <div className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
      
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
        📦
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900">
        Belum ada pesanan
      </h3>

      {/* Description */}
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        Pesanan Anda akan muncul di sini setelah melakukan pemesanan.
      </p>

      {/* Button */}
      {onStartShopping && (
        <button
          type="button"
          onClick={onStartShopping}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Mulai Pesan
        </button>
      )}

    </div>
  );
};

export default EmptyOrders;