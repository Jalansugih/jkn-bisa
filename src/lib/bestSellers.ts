import { Product } from '../types';

/** Jumlah maksimal produk yang boleh tampil di halaman utama. */
export const HOME_PRODUCT_LIMIT = 6;

/**
 * Produk "tampil di halaman utama" = produk yang dicentang admin ("popular").
 * Produk ini juga mendapat badge "Terlaris" di kartu.
 */
export function isBestSeller(p: Product): boolean {
  return Boolean(p.popular);
}

/** Produk aktif yang dicentang admin, maksimal HOME_PRODUCT_LIMIT. Tanpa pengisian otomatis. */
export function pickHomeProducts(products: Product[], limit: number = HOME_PRODUCT_LIMIT): Product[] {
  return products.filter((p) => p.active !== false && isBestSeller(p)).slice(0, limit);
}
