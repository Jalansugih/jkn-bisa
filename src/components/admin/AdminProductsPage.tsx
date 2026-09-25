import React, { useState } from 'react';
import { Product } from '../../types';
import { addProduct, updateProduct, deleteProduct, setProductActive } from '../../lib/productService';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Check,
  ArrowUpRight,
  Save,
  Loader2,
  X,
  Sparkles,
  Tag,
  Globe,
  Store,
  FileText,
  Package,
  Zap,
  Award,
  Shield,
  Layers,
} from 'lucide-react';

interface AdminProductsPageProps {
  products: Product[];
  onOpenOrder: (productKey: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const ICON_OPTIONS = [
  { label: 'Website / Globe', value: 'Globe' },
  { label: 'Kasir / Store', value: 'Store' },
  { label: 'Kilat / Zap', value: 'Zap' },
  { label: 'Legalitas / FileText', value: 'FileText' },
  { label: 'Paket / Package', value: 'Package' },
  { label: 'Koleksi / Layers', value: 'Layers' },
  { label: 'Badge / Award', value: 'Award' },
  { label: 'Keamanan / Shield', value: 'Shield' },
  { label: 'Bintang / Sparkles', value: 'Sparkles' },
];

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({
  products,
  onOpenOrder,
  showToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Form states
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('website');
  const [formPrice, setFormPrice] = useState<number>(1500000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(3000000);
  const [formDiscountPct, setFormDiscountPct] = useState<number | undefined>(50);
  const [formPriceUnit, setFormPriceUnit] = useState('/ paket');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formBadgeType, setFormBadgeType] = useState<Product['badgeType']>('primary');
  const [formBonus, setFormBonus] = useState('');
  const [formIconName, setFormIconName] = useState('Package');
  const [formPopular, setFormPopular] = useState(false);

  // Features list manager
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    const newId = 'prod_' + Date.now().toString(36);
    setFormId(newId);
    setFormName('');
    setFormCategory('website');
    setFormPrice(1500000);
    setFormOriginalPrice(3000000);
    setFormDiscountPct(50);
    setFormPriceUnit('/ sekali bayar');
    setFormDescription('');
    setFormBadge('Promo Spesial');
    setFormBadgeType('primary');
    setFormBonus('Konsultasi Gratis');
    setFormIconName('Globe');
    setFormPopular(false);
    setFeaturesList([
      'Desain modern & responsif',
      'Integrasi WhatsApp otomatis',
      'Gratis setup & domain 1 tahun',
    ]);
    setNewFeatureInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setIsEditMode(true);
    setFormId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormDiscountPct(product.discountPct);
    setFormPriceUnit(product.priceUnit);
    setFormDescription(product.description);
    setFormBadge(product.badge || '');
    setFormBadgeType(product.badgeType || 'primary');
    setFormBonus(product.bonus || '');
    setFormIconName(product.iconName || 'Package');
    setFormPopular(Boolean(product.popular));
    setFeaturesList(product.features || []);
    setNewFeatureInput('');
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    const trimmed = newFeatureInput.trim();
    if (!trimmed) return;
    setFeaturesList((prev) => [...prev, trimmed]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePriceChange = (price: number, origPrice?: number) => {
    setFormPrice(price);
    if (origPrice && origPrice > price) {
      const disc = Math.round(((origPrice - price) / origPrice) * 100);
      setFormDiscountPct(disc);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Nama produk wajib diisi!', 'warning');
      return;
    }
    if (formPrice <= 0) {
      showToast('Harga produk harus lebih dari 0!', 'warning');
      return;
    }
    if (featuresList.length === 0) {
      showToast('Tambahkan minimal 1 fitur produk!', 'warning');
      return;
    }

    setIsSubmitting(true);
    const productPayload: Product = {
      id: formId,
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      discountPct: formDiscountPct ? Number(formDiscountPct) : undefined,
      priceUnit: formPriceUnit.trim() || '/ paket',
      description: formDescription.trim(),
      badge: formBadge.trim() || undefined,
      badgeType: formBadgeType,
      bonus: formBonus.trim() || undefined,
      features: featuresList,
      iconName: formIconName,
      popular: formPopular,
      active: isEditMode ? (products.find((p) => p.id === formId)?.active !== false) : true,
    };

    try {
      if (isEditMode) {
        await updateProduct(formId, productPayload);
        showToast(`Produk "${formName}" berhasil diperbarui!`, 'success');
      } else {
        await addProduct(productPayload);
        showToast(`Produk baru "${formName}" berhasil ditambahkan!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan produk ke Firestore.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await setProductActive(product.id, product.active === false);
      showToast(`Produk \"${product.name}\" ${product.active === false ? 'diaktifkan' : 'dinonaktifkan'}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status produk.', 'error');
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Yakin ingin menghapus produk "${product.name}"? Layanan ini akan hilang dari katalog website utama.`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      showToast(`Produk "${product.name}" berhasil dihapus.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus produk.', 'error');
    }
  };

  return (
    <div id="admin-products-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Katalog Layanan & Tarif Paket Usaha
            </h2>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
              {products.length} Paket
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap penambahan atau perubahan tarif di sini langsung terhubung secara live ke Halaman Depan & Formulir Order
          </p>
        </div>

        {/* Filter, Search & Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama paket, fitur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="legalitas">Legalitas & Izin</option>
              <option value="website">Website & Toko Online</option>
              <option value="pos">Sistem Kasir POS</option>
              <option value="bundling">Paket Bundling</option>
            </select>
          </div>

          <button
            id="btn-admin-add-product"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Layanan Baru</span>
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs shadow-xs">
            Tidak ada produk layanan yang ditemukan.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${p.active === false ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {p.active === false ? 'INACTIVE' : 'ACTIVE'} · 
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {p.popular && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Populer</span>
                      </span>
                    )}
                    {p.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-heading font-extrabold text-base text-slate-900 mb-1">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {p.description}
                </p>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-heading font-black text-slate-900">
                      {formatRupiah(p.price)}
                    </span>
                    <span className="text-[11px] text-slate-400">{p.priceUnit}</span>
                  </div>
                  {p.originalPrice && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400 line-through">
                        {formatRupiah(p.originalPrice)}
                      </span>
                      {p.discountPct && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                          Hemat {p.discountPct}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Features preview */}
                <ul className="space-y-1.5 mb-4 text-xs text-slate-600">
                  {p.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                  {p.features.length > 3 && (
                    <li className="text-[11px] text-slate-400 italic pl-5">
                      + {p.features.length - 3} fitur lainnya
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">ID: {p.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailProduct(p)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="Detail Produk"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${p.active === false ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'}`}
                    title={p.active === false ? 'Aktifkan Produk' : 'Nonaktifkan Produk'}
                  >
                    {p.active === false ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition cursor-pointer"
                    title="Edit Layanan"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                    title="Hapus Layanan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {detailProduct && (
        <div className="fixed inset-0 bg-slate-900/60 z-[55] flex items-center justify-center p-4 backdrop-blur-xs" onClick={() => setDetailProduct(null)}>
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div><div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Detail Produk</div><h3 className="text-lg font-extrabold text-slate-900">{detailProduct.name}</h3></div>
              <button onClick={() => setDetailProduct(null)} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3"><div className="p-3 rounded-xl bg-slate-50"><span className="text-xs text-slate-400">Harga pusat</span><div className="font-black text-slate-900">{formatRupiah(detailProduct.price)}</div></div><div className="p-3 rounded-xl bg-slate-50"><span className="text-xs text-slate-400">Status</span><div className="font-bold">{detailProduct.active === false ? 'Inactive' : 'Active'}</div></div></div>
              <div><span className="text-xs text-slate-400">Deskripsi</span><p className="text-slate-700 mt-1">{detailProduct.description || '-'}</p></div>
              <div><span className="text-xs text-slate-400">Fitur</span><ul className="mt-2 space-y-1">{detailProduct.features.map((f,i)=><li key={i} className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" />{f}</li>)}</ul></div>
              <div className="text-xs text-slate-400">Product ID: {detailProduct.id}</div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2"><button onClick={() => { setDetailProduct(null); handleOpenEdit(detailProduct); }} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">Edit Produk</button></div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded border border-blue-200">
                  {isEditMode ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                </span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                  {isEditMode ? `Edit: ${formName || formId}` : 'Buat Paket / Layanan UMKM'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Paket / Layanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Paket Website Toko Online Pro"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Product['category'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="website">Website</option>
                    <option value="pos">Kasir POS</option>
                    <option value="legalitas">Legalitas</option>
                    <option value="bundling">Bundling</option>
                  </select>
                </div>
              </div>

              {/* Price, Original Price, Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Harga Final (IDR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value), formOriginalPrice)}
                    placeholder="1500000"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Harga Coret (Opsional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formOriginalPrice || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setFormOriginalPrice(val);
                      if (val && val > formPrice) {
                        setFormDiscountPct(Math.round(((val - formPrice) / val) * 100));
                      }
                    }}
                    placeholder="3000000"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Satuan Harga
                  </label>
                  <input
                    type="text"
                    value={formPriceUnit}
                    onChange={(e) => setFormPriceUnit(e.target.value)}
                    placeholder="/ sekali bayar atau / tahun"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Deskripsi Singkat Layanan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Penjelasan ringkas tentang keunggulan paket ini..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Badge & Bonus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Label Badge (cth: Terpopuler)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Hemat 50%"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tipe Badge
                  </label>
                  <select
                    value={formBadgeType}
                    onChange={(e) => setFormBadgeType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <option value="primary">Biru (Primary)</option>
                    <option value="popular">Ungu (Popular)</option>
                    <option value="super">Merah (Super)</option>
                    <option value="bonus">Hijau (Bonus)</option>
                    <option value="hardware">Abu-abu (Hardware)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Ikon Layanan
                  </label>
                  <select
                    value={formIconName}
                    onChange={(e) => setFormIconName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Features List Interactive Manager */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Fitur-Fitur Paket (Minimal 1) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Ketik fitur baru lalu tekan Tambah..."
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                  >
                    Tambah Fitur
                  </button>
                </div>

                {/* Features chips */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {featuresList.length === 0 ? (
                    <p className="text-slate-400 italic text-[11px] p-2 text-center">
                      Belum ada fitur ditambahkan.
                    </p>
                  ) : (
                    featuresList.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Popular Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formPopular}
                    onChange={(e) => setFormPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-800">
                    Tandai sebagai Paket Terpopuler / Paling Banyak Dipilih
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isEditMode ? 'Simpan Perubahan' : 'Terbitkan Layanan'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
