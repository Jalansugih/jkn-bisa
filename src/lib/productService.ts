import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/mockData';

const STORAGE_KEY = 'bu_products_cache';

interface ProductRow {
  id: string;
  name: string;
  category: Product['category'];
  price: number;
  original_price: number | null;
  discount_pct: number | null;
  price_unit: string | null;
  description: string | null;
  badge: string | null;
  badge_type: Product['badgeType'] | null;
  bonus: string | null;
  features: string[] | null;
  icon_name: string | null;
  popular: boolean | null;
  active: boolean | null;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name || 'Produk Tanpa Nama',
    category: row.category || 'website',
    price: Number(row.price) || 0,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    discountPct: row.discount_pct != null ? Number(row.discount_pct) : undefined,
    priceUnit: row.price_unit || '/ paket',
    description: row.description || '',
    badge: row.badge || undefined,
    badgeType: row.badge_type || undefined,
    bonus: row.bonus || undefined,
    features: Array.isArray(row.features) ? row.features : [],
    iconName: row.icon_name || 'Package',
    popular: Boolean(row.popular),
    active: row.active !== false,
  };
}

function productToRow(product: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (product.name !== undefined) row.name = product.name;
  if (product.category !== undefined) row.category = product.category;
  if (product.price !== undefined) row.price = product.price;
  if (product.originalPrice !== undefined) row.original_price = product.originalPrice;
  if (product.discountPct !== undefined) row.discount_pct = product.discountPct;
  if (product.priceUnit !== undefined) row.price_unit = product.priceUnit;
  if (product.description !== undefined) row.description = product.description;
  if (product.badge !== undefined) row.badge = product.badge;
  if (product.badgeType !== undefined) row.badge_type = product.badgeType;
  if (product.bonus !== undefined) row.bonus = product.bonus;
  if (product.features !== undefined) row.features = product.features;
  if (product.iconName !== undefined) row.icon_name = product.iconName;
  if (product.popular !== undefined) row.popular = product.popular;
  if (product.active !== undefined) row.active = product.active;
  return row;
}

function getLocalProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[getLocalProducts] Read cache failed:', err);
  }
  return Object.values(PRODUCTS_DATA);
}

function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn('[saveLocalProducts] Write cache failed:', err);
  }
}

/**
 * Real-time subscription ke katalog produk dari Supabase, dengan local
 * fallback dan auto-seed jika tabel masih kosong (pengganti onSnapshot
 * Firestore + auto-seed).
 */
export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  // Emit initial local data immediately
  const initialData = getLocalProducts();
  callback(initialData);

  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  const fetchAndEmit = async () => {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.warn('[subscribeToProducts] Supabase error, using local data:', error);
      callback(getLocalProducts());
      return;
    }

    if (!data || data.length === 0) {
      // First-time seed jika tabel Supabase masih kosong
      const defaultList = Object.values(PRODUCTS_DATA);
      try {
        const rows = defaultList.map((p) => ({ id: p.id, ...productToRow(p) }));
        const { error: seedError } = await supabase.from('products').insert(rows);
        if (seedError) {
          console.warn('[subscribeToProducts] Auto-seed failed (maybe RLS read-only):', seedError);
        }
      } catch (err) {
        console.warn('[subscribeToProducts] Auto-seed exception:', err);
      }
      callback(defaultList);
      saveLocalProducts(defaultList);
      return;
    }

    const products = (data as ProductRow[]).map(rowToProduct);
    callback(products);
    saveLocalProducts(products);
  };

  fetchAndEmit();

  const channel = supabase
    .channel('products-catalog')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchAndEmit())
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Tambah produk baru ke Supabase
 */
export async function addProduct(product: Product): Promise<void> {
  const normalizedId = (product.id || 'prod_' + Date.now())
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');

  const productData: Product = { ...product, id: normalizedId };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').insert({
      id: normalizedId,
      ...productToRow({ ...productData, active: productData.active !== false }),
    });
    if (error) throw new Error(`Gagal menambah produk: ${error.message}`);
  }

  const localList = getLocalProducts().filter((p) => p.id !== normalizedId);
  localList.unshift(productData);
  saveLocalProducts(localList);
}

/**
 * Perbarui produk yang sudah ada di Supabase
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').update(productToRow(updates)).eq('id', id);
    if (error) throw new Error(`Gagal memperbarui produk: ${error.message}`);
  }

  const localList = getLocalProducts().map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveLocalProducts(localList);
}

/**
 * Hapus produk dari Supabase
 */
export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(`Gagal menghapus produk: ${error.message}`);
  }

  const localList = getLocalProducts().filter((p) => p.id !== id);
  saveLocalProducts(localList);
}

/** Tampilkan/sembunyikan produk di katalog publik. */
export async function setProductActive(id: string, active: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').update({ active }).eq('id', id);
    if (error) throw new Error(`Gagal mengubah visibilitas produk: ${error.message}`);
  }
  const localList = getLocalProducts().map((p) => (p.id === id ? { ...p, active } : p));
  saveLocalProducts(localList);
}
