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

export function buildShareTargets(title: string, url: string): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}` },
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
