/**
 * Util slug untuk URL artikel: /artikel/<slug>
 * - huruf kecil, hanya a-z 0-9 dan tanda hubung
 * - aksen dibuang (é -> e), "&" -> "dan"
 */
export function slugify(value: string): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' dan ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
    .replace(/-$/g, '');
}

/** Pastikan slug unik terhadap daftar slug yang sudah ada: judul, judul-2, judul-3, ... */
export function makeUniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base) || 'artikel';
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}

export const ARTICLE_BASE_PATH = '/artikel';

export function articlePath(slug: string): string {
  return `${ARTICLE_BASE_PATH}/${encodeURIComponent(slug)}`;
}

/** '/artikel/abc' -> 'abc' | null jika bukan path detail artikel */
export function parseArticleSlug(pathname: string): string | null {
  const m = pathname.match(/^\/artikel\/([^/]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}
