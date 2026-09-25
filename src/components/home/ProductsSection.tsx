import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { PRODUCTS_DATA } from '../../data/mockData';
import {
  Globe,
  Zap,
  Store,
  Printer,
  Building2,
  Building,
  Stamp,
  ShieldCheck,
  Palette,
  Megaphone,
  Layers,
  CheckCircle2,
  ShoppingCart,
  MessageCircle,
  Sparkles,
  Gift,
  Search,
  X,
  RefreshCw,
  Landmark,
  Users,
  Scale,
} from 'lucide-react';

interface ProductsSectionProps {
  products?: Product[];
  initialCategory?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  onSelectProductOrder: (prodKey: string) => void;
  onAskWhatsapp: (prodName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products: propProducts,
  initialCategory = 'all',
  searchQuery = '',
  onClearSearch,
  onSelectProductOrder,
  onAskWhatsapp,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const productsList = useMemo(() => {
    if (propProducts && propProducts.length > 0) {
      return propProducts;
    }
    return Object.values(PRODUCTS_DATA);
  }, [propProducts]);

  // Extract unique categories available from productsList
  const categoryTabs = useMemo(() => {
    const defaultCats = [
      { id: 'all', label: 'Semua Paket' },
      { id: 'website', label: 'Website & E-Commerce' },
      { id: 'pos', label: 'Sistem Kasir POS' },
      { id: 'legalitas', label: 'Legalitas & Izin' },
      { id: 'bundling', label: 'Paket Bundling Hemat' },
    ];
    
    // Check if there are other categories added by admin
    const knownIds = new Set(defaultCats.map(c => c.id));
    const extraCats: { id: string; label: string }[] = [];
    
    productsList.forEach(p => {
      if (p.category && !knownIds.has(p.category)) {
        knownIds.add(p.category);
        const capitalized = p.category.charAt(0).toUpperCase() + p.category.slice(1);
        extraCats.push({ id: p.category, label: capitalized });
      }
    });

    return [...defaultCats, ...extraCats];
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    let list = productsList.filter((p) => p.active !== false);

    // Filter by search query if present
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter((t) => t.length > 0);

      list = list.filter((p) => {
        const fullSearchableText = [
          p.name,
          p.description,
          p.category,
          p.badge || '',
          p.bonus || '',
          ...p.features,
        ]
          .join(' ')
          .toLowerCase();

        // Exact substring match or every token matches
        const exactMatch = fullSearchableText.includes(q);
        const tokensMatch = tokens.every((token) => fullSearchableText.includes(token));
        const partialTokenMatch = tokens.some((token) => fullSearchableText.includes(token));

        return exactMatch || tokensMatch || partialTokenMatch;
      });
    }

    // Filter by active category if not 'all'
    if (activeCategory !== 'all') {
      const categoryFiltered = list.filter((p) => p.category === activeCategory);
      // If category has results, show them; otherwise return list so user still sees relevant results
      if (categoryFiltered.length > 0) {
        list = categoryFiltered;
      }
    }

    return list;
  }, [productsList, searchQuery, activeCategory]);

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Store':
        return <Store className="w-6 h-6" />;
      case 'Printer':
        return <Printer className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      case 'Building':
        return <Building className="w-6 h-6" />;
      case 'Stamp':
        return <Stamp className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6" />;
      case 'Layers':
        return <Layers className="w-6 h-6" />;
      case 'Landmark':
        return <Landmark className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'Scale':
        return <Scale className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  const getHeaderGradient = (product: Product) => {
    if (product.id === 'pt_pro') {
      return 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/40';
    }
    if (product.id === 'bundling_allinone') {
      return 'bg-gradient-to-br from-blue-50 via-white to-indigo-50/40';
    }
    if (product.category === 'pos') {
      return 'bg-gradient-to-br from-sky-50 via-white to-blue-50/40';
    }
    if (product.category === 'legalitas') {
      return 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/40';
    }
    return 'bg-gradient-to-br from-blue-50 via-white to-sky-50/40';
  };

  const getIconColor = (product: Product) => {
    if (product.id === 'pt_pro') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (product.category === 'pos') return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (product.category === 'legalitas') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (product.id === 'branding_kit') return 'bg-pink-100 text-pink-700 border border-pink-200';
    if (product.id === 'socmed_ads') return 'bg-pink-100 text-pink-700 border border-pink-200';
    if (product.id === 'bundling_allinone') return 'bg-blue-600 text-white border border-blue-500 shadow-md shadow-blue-500/20';
    return 'bg-blue-100 text-blue-700 border border-blue-200';
  };

  return (
    <section className="py-20 bg-slate-50/60 relative border-t border-slate-200" id="produk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-700 font-semibold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Order Produk & Layanan
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Pilih Paket Layanan Untuk Bisnis Anda
          </h2>
          <p className="text-slate-600 text-base">
            Proses order cepat, transparan, dan bergaransi pendampingan sampai tuntas.
          </p>
        </div>

        {/* Active Search Banner */}
        {searchQuery.trim() && (
          <div className="mb-8 p-4 bg-blue-50/80 rounded-2xl border border-blue-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Hasil Pencarian Solusi:</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>"{searchQuery}"</span>
                  <span className="bg-blue-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                    {filteredProducts.length} Paket Ditemukan
                  </span>
                </div>
              </div>
            </div>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Pencarian</span>
              </button>
            )}
          </div>
        )}

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categoryTabs.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`product-filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`product-filter-btn px-5 py-2 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-xl mx-auto shadow-xs space-y-4 my-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-xs">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Tidak Ada Paket yang Sesuai dengan "{searchQuery}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Kami menyediakan ratusan solusi dan pengadaan khusus melalui jaringan mitra terpercaya BinaUsaha.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                >
                  Tampilkan Semua Paket
                </button>
              )}
              <button
                onClick={() => onAskWhatsapp(`Kebutuhan Khusus: ${searchQuery}`)}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Konsultasi Kebutuhan via WA</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="productGrid">
          {filteredProducts.map((product) => {
            const isPtPro = product.id === 'pt_pro';
            const isBundling = product.id === 'bundling_allinone';
            const isLegalitas = product.category === 'legalitas';

            return (
              <div
                key={product.id}
                id={`card-product-${product.id}`}
                className={`product-card bg-white rounded-2xl transition-all duration-300 flex flex-col overflow-hidden relative group hover:shadow-xl hover:shadow-blue-900/5 ${
                  isPtPro
                    ? 'border-2 border-emerald-500 shadow-md'
                    : isBundling
                    ? 'border-2 border-blue-500 shadow-md'
                    : isLegalitas
                    ? 'border border-emerald-200/80 shadow-xs hover:border-emerald-400'
                    : 'border border-slate-200 shadow-xs'
                }`}
              >
                {/* Badge Top Right */}
                {product.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1 ${
                        isPtPro
                          ? 'bg-emerald-600 text-white text-[11px] font-extrabold shadow-sm'
                          : isBundling
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-sm'
                          : product.id === 'pt_perorangan'
                          ? 'bg-emerald-600 text-white text-[11px] font-extrabold shadow-sm'
                          : product.id === 'pt_perorangan_notaris'
                          ? 'bg-teal-600 text-white text-[11px] font-extrabold shadow-sm'
                          : isLegalitas
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : product.badgeType === 'super'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : product.badgeType === 'hardware'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-sm'
                          : 'bg-blue-600 text-white shadow-sm'
                      }`}
                    >
                      {isPtPro && <Gift className="w-3.5 h-3.5" />}
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className={`p-6 border-b border-slate-100 ${getHeaderGradient(product)}`}>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-xs ${getIconColor(
                      product
                    )}`}
                  >
                    {getProductIcon(product.iconName)}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">{product.name}</h3>

                  {isPtPro ? (
                    <p className="text-xs text-emerald-700 font-bold mb-4 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Bonus Spesial: Free Aplikasi System Keuangan Usaha!
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600 mb-4">{product.description}</p>
                  )}

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-extrabold font-heading text-slate-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through font-medium">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    {product.discountPct && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                        -{product.discountPct}%
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-medium">{product.priceUnit}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <ul className="space-y-3 text-xs text-slate-700">
                    {product.features.map((feature, idx) => {
                      const isFreeAppBonus = feature.includes('GRATIS Paket Aplikasi System Keuangan');
                      return (
                        <li
                          key={idx}
                          className={`flex items-center gap-2.5 ${
                            isFreeAppBonus
                              ? 'bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 shadow-xs font-bold text-emerald-800'
                              : isBundling
                              ? 'font-medium text-slate-900'
                              : ''
                          }`}
                        >
                          {isFreeAppBonus ? (
                            <Gift className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <CheckCircle2
                              className={`w-4 h-4 flex-shrink-0 ${
                                isBundling ? 'text-blue-600' : 'text-emerald-600'
                              }`}
                            />
                          )}
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Actions */}
                  <div className="pt-4 space-y-2">
                    <button
                      id={`btn-order-${product.id}`}
                      onClick={() => onSelectProductOrder(product.id)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                        isPtPro || isLegalitas
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isPtPro ? 'Order Paket PT Pro' : isBundling ? 'Order Paket Hemat' : `Pesan ${product.name}`}</span>
                    </button>
                    <button
                      id={`btn-wa-query-${product.id}`}
                      onClick={() => onAskWhatsapp(product.name)}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl font-medium text-xs transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Tanya via WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
