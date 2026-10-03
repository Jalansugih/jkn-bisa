/**
 * Alamat halaman hukum (bisa dibuka langsung, di-refresh, dan dibagikan).
 * Jika diubah, ubah juga rewrite-nya di vercel.json.
 */
export const TERMS_PATH = '/syarat-ketentuan';
export const PRIVACY_PATH = '/kebijakan-privasi';

export type LegalView = 'terms' | 'privacy';

export function legalPath(view: LegalView): string {
  return view === 'terms' ? TERMS_PATH : PRIVACY_PATH;
}

/** Kembalikan jenis halaman hukum untuk sebuah pathname, atau null jika bukan. */
export function legalViewFromPath(pathname: string): LegalView | null {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';
  if (p === TERMS_PATH) return 'terms';
  if (p === PRIVACY_PATH) return 'privacy';
  return null;
}
