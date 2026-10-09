import { slugify } from './slug';

/**
 * Kategori artikel. Enam kategori bawaan punya id tetap; admin boleh menulis
 * kategori lain secara manual. Yang disimpan di database:
 *   category        -> id (slug dari nama, mis. "hukum-pajak")
 *   category_label  -> nama tampilan apa adanya (mis. "Hukum & Pajak")
 * Tidak perlu migrasi: kedua kolom sudah berupa teks bebas.
 */
export interface ArticleCategoryOption {
  id: string;
  label: string;
}

export const DEFAULT_ARTICLE_CATEGORIES: ArticleCategoryOption[] = [
  { id: 'legalitas', label: 'Legalitas & Perizinan' },
  { id: 'digital', label: 'Digital & Website' },
  { id: 'keuangan', label: 'Keuangan & Pajak' },
  { id: 'pemasaran', label: 'Pemasaran & Branding' },
  { id: 'operasional', label: 'Operasional & Kasir' },
  { id: 'skala-usaha', label: 'Skala Usaha & Ekspor' },
];

export const MAX_ARTICLE_CATEGORY_LENGTH = 40;

const DEFAULT_IDS = new Set(DEFAULT_ARTICLE_CATEGORIES.map((c) => c.id));

export const isDefaultArticleCategory = (id: string) => DEFAULT_IDS.has(id);

const norm = (s: string) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

/** Kategori bawaan dulu, lalu kategori buatan admin (urutan pertama kali muncul). */
export function buildArticleCategoryOptions(
  articles: { category: string; categoryLabel?: string }[]
): ArticleCategoryOption[] {
  const result = [...DEFAULT_ARTICLE_CATEGORIES];
  const seen = new Set(DEFAULT_IDS);
  for (const a of articles) {
    const id = (a.category || '').trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push({ id, label: (a.categoryLabel || '').trim() || id });
  }
  return result;
}

/**
 * Ubah teks yang diketik admin menjadi kategori yang disimpan.
 * - sama dengan nama/id kategori yang sudah ada (huruf besar/kecil diabaikan) -> pakai yang sudah ada,
 *   supaya tidak muncul dua tab kembar ("Hukum Pajak" dan "hukum pajak")
 * - selain itu: id = slug dari nama; bila slug itu sudah dipakai kategori lain, ditambah -2, -3, ...
 */
export function resolveArticleCategory(input: string, options: ArticleCategoryOption[]): ArticleCategoryOption {
  const label = (input || '').trim().replace(/\s+/g, ' ');
  const key = norm(label);
  const existing = options.find((o) => norm(o.label) === key || o.id.toLowerCase() === key);
  if (existing) return existing;

  const root = slugify(label) || 'kategori';
  const taken = new Set(options.map((o) => o.id));
  let id = root;
  for (let i = 2; taken.has(id); i++) id = `${root}-${i}`;
  return { id, label };
}
