import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '../../types';
import { PRODUCTS_DATA } from '../../data/mockData';
import { isBestSeller } from '../../lib/bestSellers';
import { ProductCard } from './ProductCard';
import { buildCategoryOptions } from '../../lib/productCategories';
import { slugify } from '../../lib/slug';
import { ArrowLeft, MessageCircle, Search, X } from 'lucide-react';

interface ProductsPageProps {
  products?: Product[];
  /** Kategori yang aktif saat halaman dibuka ('all' = semua). */
  initialCategory?: string;
  /** Kata kunci pencarian saat halaman dibuka (mis. dari kolom cari di hero). */
  initialSearch?: string;
  onBackToHome: () => void;
  onSelectProductOrder: (prodKey: string) => void;
  onAskWhatsapp: (prodName: string) => void;
  referralCode: string | null;
  onRequireLogin: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products: propProducts,
  initialCategory = 'all',
  initialSearch = '',
  onBackToHome,
  onSelectProductOrder,
  onAskWhatsapp,
  referralCode,
  onRequireLogin,
  showToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState<string>(initialSearch);

  useEffect(() => setActiveCategory(initialCategory || 'all'), [initialCategory]);
  useEffect(() => setQuery(initialSearch || ''), [initialSearch]);

  const productsList = useMemo(() => {
    const base = propProducts && propProducts.length > 0 ? propProducts : Object.values(PRODUCTS_DATA);
    return base.filter((p) => p.active !== false);
  }, [propProducts]);

  // Tab kategori: "Semua" + kategori yang punya produk aktif (bawaan lebih dulu, lalu buatan admin)
  const categoryTabs = useMemo(
    () => [{ id: 'all', label: 'Semua Paket' }, ...buildCategoryOptions(productsList, true)],
    [productsList]
  );

  const filtered = useMemo(() => {
    let list = productsList;

    const q = query.toLowerCase().trim();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const text = [p.name, p.description, p.category, p.badge || '', p.bonus || '', ...p.features]
          .join(' ')
          .toLowerCase();
        return text.includes(q) || tokens.some((t) => text.includes(t));
      });
    }

    // Kategori yang bukan kategori produk (mis. "memulai-usaha" dari menu kebutuhan) dianggap "semua"
    if (activeCategory !== 'all' && categoryTabs.some((t) => t.id === activeCategory)) {
      list = list.filter((p) => p.category === activeCategory);
    }
    return list;
  }, [productsList, query, activeCategory, categoryTabs]);

  const hasFilter = query.trim() !== '' || (activeCategory !== 'all' && categoryTabs.some((t) => t.id === activeCategory));

  const resetFilters = () => {
    setQuery('');
    setActiveCategory('all');
  };

  return (
    <section className="min-h-screen bg-slate-50/60 py-12 sm:py-16" id="halaman-produk">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToHome}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
            Katalog Lengkap
          </span>
          <h1 className="mb-3 font-heading text-3xl font-bold text-slate-900 md:text-4xl">
            Semua Produk & Layanan
          </h1>
          <p className="text-base text-slate-600">
            Pilih paket yang paling pas untuk tahap bisnis Anda. Proses order cepat, transparan, dan didampingi sampai tuntas.
          </p>
        </div>

        {/* Pencarian */}
        <div className="mx-auto mb-6 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="products-page-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari paket, mis. PT, website, kasir..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-800 shadow-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab kategori */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {categoryTabs.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`product-filter-${slugify(cat.id) || 'kategori'}`}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`product-filter-btn cursor-pointer rounded-xl px-5 py-2 text-sm font-medium shadow-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <p className="mb-8 text-center text-xs font-medium text-slate-500">
          Menampilkan {filtered.length} dari {productsList.length} paket
          {hasFilter && (
            <>
              {' · '}
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer font-bold text-blue-600 hover:text-blue-700"
              >
                Reset filter
              </button>
            </>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="mx-auto my-6 max-w-xl space-y-4 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600">
              <Search className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {query.trim() ? `Tidak ada paket yang cocok dengan "${query.trim()}"` : 'Belum ada paket di kategori ini'}
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
              Kebutuhan Anda mungkin bisa kami penuhi lewat jaringan mitra BinaUsaha. Ceritakan saja kebutuhannya.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                Tampilkan Semua Paket
              </button>
              <button
                type="button"
                onClick={() => onAskWhatsapp(query.trim() ? `Kebutuhan Khusus: ${query.trim()}` : 'Kebutuhan Khusus')}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>Konsultasi via WA</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" id="productGrid">
            {filtered.map((product) => (
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
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
