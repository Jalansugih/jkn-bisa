import React, { useMemo } from 'react';
import { Product } from '../../types';
import { PRODUCTS_DATA } from '../../data/mockData';
import { HOME_PRODUCT_LIMIT, isBestSeller, pickHomeProducts } from '../../lib/bestSellers';
import { ProductCard } from '../products/ProductCard';
import { ArrowRight } from 'lucide-react';

interface ProductsSectionProps {
  products?: Product[];
  /** Buka halaman daftar semua produk (/produk). */
  onViewAllProducts: () => void;
  onSelectProductOrder: (prodKey: string) => void;
  onAskWhatsapp: (prodName: string) => void;
  referralCode: string | null;
  onRequireLogin: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

/**
 * Bagian produk di beranda: hanya produk yang dicentang admin "tampilkan di halaman utama" (maks. 6).
 * Katalog lengkap, pencarian, dan filter kategori ada di halaman /produk.
 */
export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products: propProducts,
  onViewAllProducts,
  onSelectProductOrder,
  onAskWhatsapp,
  referralCode,
  onRequireLogin,
  showToast,
}) => {
  const allActive = useMemo(() => {
    const base = propProducts && propProducts.length > 0 ? propProducts : Object.values(PRODUCTS_DATA);
    return base.filter((p) => p.active !== false);
  }, [propProducts]);

  const homeProducts = useMemo(() => pickHomeProducts(allActive, HOME_PRODUCT_LIMIT), [allActive]);
  const remaining = Math.max(0, allActive.length - homeProducts.length);

  return (
    <section className="relative border-t border-slate-200 bg-slate-50/60 py-20" id="produk">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
            Produk Terlaris
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold text-slate-900 md:text-4xl">
            Pilih Paket Layanan Untuk Bisnis Anda
          </h2>
          <p className="text-base text-slate-600">
            Paket yang paling banyak dipilih pelaku usaha. Proses order cepat, transparan, dan bergaransi pendampingan sampai tuntas.
          </p>
        </div>

        {homeProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" id="productGrid">
            {homeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                bestSeller={isBestSeller(product)}
                onSelectProductOrder={onSelectProductOrder}
                onAskWhatsapp={onAskWhatsapp}
                referralCode={referralCode}
                onRequireLogin={onRequireLogin}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-xl text-center text-sm text-slate-500" id="productGrid">
            Pilih paket yang sesuai untuk bisnis Anda di halaman produk.
          </p>
        )}

        <div className="mt-12 text-center">
          <button
            id="btn-lihat-semua-produk"
            type="button"
            onClick={onViewAllProducts}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98]"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          {remaining > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Masih ada {remaining} paket dan layanan lainnya di halaman produk.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
