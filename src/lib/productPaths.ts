/**
 * Alamat halaman daftar semua produk (bisa dibuka langsung, di-refresh, dan dibagikan).
 * Jika diubah, ubah juga rewrite-nya di vercel.json.
 */
export const PRODUCTS_PATH = '/produk';

/** true bila pathname adalah halaman daftar produk. */
export function isProductsPath(pathname: string): boolean {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';
  return p === PRODUCTS_PATH;
}
