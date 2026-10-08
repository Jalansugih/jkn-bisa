import React, { useState } from 'react';
import { Product } from '../../types';
import { ProductShareMenu } from '../common/ProductShareMenu';
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
  Landmark,
  Users,
  Scale,
  CheckCircle2,
  ChevronDown,
  Gift,
  Heart,
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Star,
  Package,
  FileText,
  Award,
  Shield,
} from 'lucide-react';

import { categoryLabel } from '../../lib/productCategories';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

const WISHLIST_KEY = 'bu_wishlist_products';
const COLLAPSED_FEATURE_COUNT = 4;
const FREE_APP_MARKER = 'GRATIS Paket Aplikasi System Keuangan';

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  } catch {
    /* penyimpanan penuh / diblokir: abaikan, favorit tetap jalan untuk sesi ini */
  }
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
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
  Landmark,
  Users,
  Scale,
  // pilihan ikon di form admin
  Package,
  FileText,
  Award,
  Shield,
  Sparkles,
};

interface ProductCardProps {
  product: Product;
  /** true = tampilkan badge "Terlaris" di foto. */
  bestSeller?: boolean;
  onSelectProductOrder: (prodKey: string) => void;
  onAskWhatsapp: (prodName: string) => void;
  referralCode: string | null;
  onRequireLogin: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  bestSeller = false,
  onSelectProductOrder,
  onAskWhatsapp,
  referralCode,
  onRequireLogin,
  showToast,
}) => {
  // simpan URL yang rusak (bukan hanya true) supaya foto baru dari admin langsung dicoba lagi
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [wished, setWished] = useState<boolean>(() => readWishlist().includes(product.id));

  const isPtPro = product.id === 'pt_pro';
  const isBundling = product.id === 'bundling_allinone';
  const isLegalitas = product.category === 'legalitas';
  const useEmerald = isPtPro || isLegalitas;

  const showImage = Boolean(product.imageUrl) && brokenUrl !== product.imageUrl;
  const Icon = ICONS[product.iconName] || Package;
  // Diskon selalu dihitung dari harga final vs harga coret, bukan dari angka persen tersimpan,
  // supaya badge, "Hemat Rp", dan harga coret tidak pernah saling bertentangan.
  const hasDiscount = Boolean(product.originalPrice) && (product.originalPrice as number) > product.price;
  const savings = hasDiscount ? (product.originalPrice as number) - product.price : 0;
  const discountPct = hasDiscount ? Math.round((savings / (product.originalPrice as number)) * 100) : 0;

  const features = product.features || [];
  const hiddenCount = Math.max(
    0,
    features.filter((f, i) => i >= COLLAPSED_FEATURE_COUNT && !f.includes(FREE_APP_MARKER)).length
  );
  const visibleFeatures = features.filter(
    (f, i) => expanded || i < COLLAPSED_FEATURE_COUNT || f.includes(FREE_APP_MARKER)
  );

  const toggleWishlist = () => {
    const current = readWishlist();
    if (current.includes(product.id)) {
      writeWishlist(current.filter((id) => id !== product.id));
      setWished(false);
      showToast('Dihapus dari favorit', 'info');
    } else {
      writeWishlist([...current, product.id]);
      setWished(true);
      showToast('Ditambahkan ke favorit', 'success');
    }
  };

  const fallbackGradient = isLegalitas || isPtPro
    ? 'from-emerald-100 via-emerald-50 to-teal-100'
    : isBundling
    ? 'from-blue-100 via-indigo-50 to-blue-200'
    : product.category === 'pos'
    ? 'from-sky-100 via-blue-50 to-sky-200'
    : 'from-blue-100 via-sky-50 to-blue-100';

  const fallbackIconColor = useEmerald ? 'text-emerald-600/70' : 'text-blue-600/70';

  // Warna badge mengikuti "Tipe Badge" di admin. "primary" ikut warna aksen kategori.
  const BADGE_BY_TYPE: Record<string, string> = {
    popular: 'bg-purple-600 text-white',
    super: 'bg-rose-600 text-white',
    bonus: 'bg-emerald-600 text-white',
    hardware: 'bg-slate-700 text-white',
    best: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
  };
  const badgeClass =
    (product.badgeType && BADGE_BY_TYPE[product.badgeType]) ||
    (useEmerald ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white');

  const ringClass = isPtPro
    ? 'border-2 border-emerald-500'
    : isBundling
    ? 'border-2 border-blue-500'
    : isLegalitas
    ? 'border border-emerald-200/80 hover:border-emerald-400'
    : 'border border-slate-200/80';

  return (
    <div
      id={`card-product-${product.id}`}
      className={`product-card group relative flex flex-col overflow-hidden rounded-3xl bg-white ${ringClass} shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12),0_8px_20px_-6px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.2),0_12px_24px_-8px_rgba(0,0,0,0.08)]`}
    >
      {/* Area foto */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {showImage ? (
          <img
            src={product.imageUrl as string}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setBrokenUrl(product.imageUrl as string)}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${fallbackGradient}`}
          >
            <Icon className={`h-20 w-20 ${fallbackIconColor} transition-transform duration-700 ease-out group-hover:scale-110`} />
          </div>
        )}

        {/* Badge kiri atas */}
        <div className="absolute left-3.5 top-3.5 z-10 flex flex-col items-start gap-1.5">
          {hasDiscount && discountPct > 0 ? (
            <span className="flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-md">
              <Zap className="h-3 w-3" />
              DISKON {discountPct}%
            </span>
          ) : null}
          {bestSeller && (
            <span className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/85 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 backdrop-blur-md">
              <Star className="h-3 w-3 fill-amber-400" />
              Terlaris
            </span>
          )}
        </div>

        {/* Tombol favorit kanan atas */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={wished}
          aria-label={wished ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          title={wished ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-rose-500 active:scale-90"
        >
          <Heart className={`h-[18px] w-[18px] ${wished ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bar bawah foto: badge bawaan produk dari admin */}
        {product.badge && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent p-3 pt-8">
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-sm ${badgeClass}`}
            >
              {isPtPro && <Gift className="h-3.5 w-3.5" />}
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Isi kartu */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
        <div>
          <span
            className={`mb-1.5 block text-[11px] font-bold uppercase tracking-wider ${
              useEmerald ? 'text-emerald-600' : 'text-blue-600'
            }`}
          >
            {categoryLabel(product.category)}
          </span>

          <h3 className="font-heading text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
            {product.name}
          </h3>

          {isPtPro ? (
            <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5 shrink-0" /> Bonus Spesial: Free Aplikasi System Keuangan Usaha!
            </p>
          ) : (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {product.description}
            </p>
          )}
        </div>

        {/* Fitur */}
        {features.length > 0 && (
          <div>
            <ul className="space-y-2 text-xs text-slate-700">
              {visibleFeatures.map((feature, idx) => {
                const isFreeAppBonus = feature.includes(FREE_APP_MARKER);
                return (
                  <li
                    key={`${idx}-${feature}`}
                    className={`flex items-start gap-2 ${
                      isFreeAppBonus
                        ? 'rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 font-bold text-emerald-800'
                        : ''
                    }`}
                  >
                    {isFreeAppBonus ? (
                      <Gift className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isBundling ? 'text-blue-600' : 'text-emerald-600'
                        }`}
                      />
                    )}
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-2.5 flex cursor-pointer items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
              >
                <span>{expanded ? 'Tampilkan lebih sedikit' : `+${hiddenCount} fitur lainnya`}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Harga */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-400">
              {savings > 0 ? 'Harga Promo Terbatas' : 'Harga Paket'}
            </span>
            {savings > 0 && (
              <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600">
                Hemat Rp {savings.toLocaleString('id-ID')}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <span className="font-heading text-2xl font-black tracking-tight text-blue-600 sm:text-3xl">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {savings > 0 && (
              <span className="text-xs font-medium text-slate-400 line-through sm:text-sm">
                Rp {(product.originalPrice as number).toLocaleString('id-ID')}
              </span>
            )}
            {product.priceUnit && (
              <span className="text-xs font-medium text-slate-500">{product.priceUnit}</span>
            )}
          </div>
        </div>

        {/* Tombol aksi */}
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            <button
              id={`btn-wa-query-${product.id}`}
              type="button"
              onClick={() => onAskWhatsapp(product.name)}
              title="Tanya via WhatsApp"
              aria-label={`Tanya ${product.name} via WhatsApp`}
              className="col-span-1 flex cursor-pointer items-center justify-center rounded-xl bg-[#25D366] p-3 text-white shadow-md shadow-[#25D366]/30 transition-all duration-200 hover:bg-[#1ebe5b] hover:shadow-[#25D366]/40 active:scale-95"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </button>
            <button
              id={`btn-order-${product.id}`}
              type="button"
              onClick={() => onSelectProductOrder(product.id)}
              className={`col-span-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 active:scale-[0.98] ${
                useEmerald
                  ? 'bg-emerald-600 shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-emerald-600/40'
                  : 'bg-blue-600 shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isPtPro ? 'Order Paket PT Pro' : isBundling ? 'Order Paket Hemat' : 'Pesan Sekarang'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <ProductShareMenu
              productKey={product.id}
              productName={product.name}
              price={product.price}
              commissionType={product.commissionType}
              commissionValue={product.commissionValue}
              referralCode={referralCode}
              onRequireLogin={onRequireLogin}
              showToast={showToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
