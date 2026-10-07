/**
 * Kategori produk. Empat kategori bawaan punya id tetap; admin boleh menulis
 * kategori lain secara manual (disimpan apa adanya sebagai teks, maks. 40 karakter).
 */
export interface CategoryOption {
  id: string;
  label: string;
}

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'website', label: 'Website & E-Commerce' },
  { id: 'pos', label: 'Sistem Kasir POS' },
  { id: 'legalitas', label: 'Legalitas & Izin' },
  { id: 'bundling', label: 'Paket Bundling Hemat' },
];

export const MAX_CATEGORY_LENGTH = 40;

/** Nama tampilan sebuah kategori. Kategori buatan admin ditampilkan apa adanya. */
export function categoryLabel(id: string): string {
  return DEFAULT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Kategori bawaan lebih dulu, lalu kategori buatan admin (urutan pertama kali muncul). */
export function buildCategoryOptions(
  products: { category: string }[],
  onlyUsed = false
): CategoryOption[] {
  const used = new Set(products.map((p) => p.category).filter(Boolean));
  const result: CategoryOption[] = DEFAULT_CATEGORIES.filter((c) => !onlyUsed || used.has(c.id));
  const known = new Set(DEFAULT_CATEGORIES.map((c) => c.id));
  used.forEach((id) => {
    if (!known.has(id)) {
      known.add(id);
      result.push({ id, label: id });
    }
  });
  return result;
}

/**
 * Ubah teks yang diketik admin menjadi nilai kategori yang disimpan.
 * - "Website", "website & e-commerce" -> id bawaan ('website')
 * - kategori yang sudah ada dengan huruf besar/kecil berbeda -> pakai ejaan yang sudah ada,
 *   supaya tidak muncul dua tab kembar ("Konstruksi" dan "konstruksi")
 * - selain itu: teks apa adanya (spasi dirapikan)
 */
export function normalizeCategory(input: string, existing: string[]): string {
  const text = (input || '').trim().replace(/\s+/g, ' ');
  if (!text) return '';
  const lower = text.toLowerCase();
  const def = DEFAULT_CATEGORIES.find((c) => c.id === lower || c.label.toLowerCase() === lower);
  if (def) return def.id;
  const match = existing.find((e) => e.toLowerCase() === lower);
  return match ?? text;
}
