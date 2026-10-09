/**
 * Kategori artikel (daftar tetap / dropdown).
 *   category        -> id (slug) yang disimpan di database
 *   category_label  -> nama tampilan
 *
 * PENTING: kolom `category` di database bertipe enum Postgres `article_category`.
 * Setiap id di bawah HARUS ada di enum tersebut. Jalankan
 * `supabase-article-categories.sql` sekali di SQL Editor Supabase.
 *
 * id 'legalitas' dipertahankan dari kategori lama agar artikel lama tetap cocok.
 */
export interface ArticleCategoryOption {
  id: string;
  label: string;
}

export const ARTICLE_CATEGORIES: ArticleCategoryOption[] = [
  { id: 'bisnis-umkm', label: 'Bisnis & UMKM' },
  { id: 'teknologi-digital', label: 'Teknologi & Digital' },
  { id: 'marketing-penjualan', label: 'Marketing & Penjualan' },
  { id: 'keuangan-investasi', label: 'Keuangan & Investasi' },
  { id: 'legalitas', label: 'Legalitas & Perizinan' },
  { id: 'konstruksi-properti', label: 'Konstruksi & Properti' },
  { id: 'pertanian-peternakan', label: 'Pertanian & Peternakan' },
  { id: 'industri-manufaktur', label: 'Industri & Manufaktur' },
  { id: 'perdagangan-retail', label: 'Perdagangan & Retail' },
  { id: 'logistik-distribusi', label: 'Logistik & Distribusi' },
  { id: 'pendidikan-karier', label: 'Pendidikan & Karier' },
  { id: 'kuliner-fnb', label: 'Kuliner & F&B' },
  { id: 'kesehatan-kecantikan', label: 'Kesehatan & Kecantikan' },
  { id: 'kreatif-desain', label: 'Kreatif & Desain' },
  { id: 'administrasi-produktivitas', label: 'Administrasi & Produktivitas' },
  { id: 'berita-tren-bisnis', label: 'Berita & Tren Bisnis' },
  { id: 'otomotif-transportasi', label: 'Otomotif & Transportasi' },
  { id: 'energi-lingkungan', label: 'Energi & Lingkungan' },
  { id: 'pariwisata-perhotelan', label: 'Pariwisata & Perhotelan' },
  { id: 'pemerintahan-kebijakan-publik', label: 'Pemerintahan & Kebijakan Publik' },
  { id: 'ekonomi-keuangan-digital', label: 'Ekonomi & Keuangan Digital' },
  { id: 'franchise-kemitraan', label: 'Franchise & Kemitraan' },
  { id: 'properti-investasi', label: 'Properti & Investasi' },
  { id: 'gaya-hidup-produktivitas', label: 'Gaya Hidup & Produktivitas' },
  { id: 'tips-tutorial', label: 'Tips & Tutorial' },
];

const KNOWN_IDS = new Set(ARTICLE_CATEGORIES.map((c) => c.id));

export const isKnownArticleCategory = (id: string) => KNOWN_IDS.has(id);

/** Label dari id; kategori lama yang tidak ada di daftar memakai label tersimpan / id-nya. */
export const getArticleCategoryLabel = (id: string, fallbackLabel?: string) =>
  ARTICLE_CATEGORIES.find((c) => c.id === id)?.label || (fallbackLabel || '').trim() || id;

/**
 * Daftar untuk dropdown/filter admin: 25 kategori tetap + kategori lama
 * (mis. "digital", "keuangan") yang masih dipakai artikel yang sudah ada,
 * supaya artikel lama tetap bisa dibuka & diedit tanpa error.
 */
export function buildArticleCategoryOptions(
  articles: { category: string; categoryLabel?: string }[]
): ArticleCategoryOption[] {
  const result = [...ARTICLE_CATEGORIES];
  const seen = new Set(KNOWN_IDS);
  for (const a of articles) {
    const id = (a.category || '').trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push({ id, label: `${(a.categoryLabel || '').trim() || id} (lama)` });
  }
  return result;
}
