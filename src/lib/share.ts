import { articlePath } from './slug';

/** URL lengkap artikel yang aman dibagikan ke mana saja (WA, FB, X, Telegram, dll). */
export function articleShareUrl(slug: string): string {
  return `${window.location.origin}${articlePath(slug)}`;
}

export interface ShareTarget {
  id: 'whatsapp' | 'facebook' | 'x' | 'telegram' | 'linkedin';
  label: string;
  href: string;
}

/**
 * Teks yang dibagikan: judul, cuplikan, lalu link di baris paling bawah.
 * (Foto artikel ditampilkan di atas teks, lewat berbagi file di HP atau kartu pratinjau link.)
 */
export function buildShareText(title: string, excerpt: string | undefined, url: string): string {
  const parts = [title.trim()];
  const clean = (excerpt || '').replace(/\s+/g, ' ').trim();
  if (clean) parts.push(clean.length > 160 ? `${clean.slice(0, 159).trimEnd()}…` : clean);
  parts.push(url);
  return parts.join('\n\n');
}

/** Unduh foto artikel sebagai File agar bisa dilampirkan lewat menu share bawaan HP. Null jika gagal. */
export async function fetchImageFile(imageUrl: string | undefined, name: string): Promise<File | null> {
  if (!imageUrl) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(imageUrl, { signal: ctrl.signal, mode: 'cors' });
    clearTimeout(timer);
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.type.startsWith('image/') || blob.size > 8 * 1024 * 1024) return null;
    const ext = blob.type.split('/')[1]?.split('+')[0].replace('jpeg', 'jpg') || 'jpg';
    return new File([blob], `${name || 'artikel'}.${ext}`, { type: blob.type });
  } catch {
    return null;
  }
}

export function buildShareTargets(title: string, url: string, text?: string): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(text || `${title}\n${url}`)}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: 'x', label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { id: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}` },
    { id: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
}

/** Salin teks ke clipboard, dengan cadangan untuk browser lama / koneksi non-HTTPS. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* lanjut ke cadangan */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
