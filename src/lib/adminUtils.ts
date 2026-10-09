import { formatRupiah } from './referral';
import { LEGAL_INFO } from '../data/legalInfo';

export { formatRupiah };

/**
 * Ubah nomor WhatsApp ke format wa.me (tanpa +, diawali kode negara).
 * "0852-2436-0446" -> "6285224360446", "+62 852..." -> "62852...", "852..." -> "62852...".
 * Tanpa ini tautan wa.me/0852... tidak membuka chat yang benar.
 */
export function toWaNumber(raw: string | undefined | null): string {
  const digits = String(raw || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('8')) return '62' + digits;
  return digits;
}

export function waLink(raw: string | undefined | null, text?: string): string {
  const num = toWaNumber(raw);
  const base = num ? `https://wa.me/${num}` : 'https://wa.me/';
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Alamat website utama untuk pesan WhatsApp (diambil dari data legal, bukan hardcode). */
export const SITE_URL = `https://${LEGAL_INFO.website}`;

/** 1.250.000 -> "Rp 1,25 jt"; dipakai di kartu sempit & sumbu grafik. */
export function formatCompactRupiah(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `Rp ${trim(n / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `Rp ${trim(n / 1_000_000)} jt`;
  if (abs >= 1_000) return `Rp ${trim(n / 1_000)} rb`;
  return `Rp ${Math.round(n)}`;
}

function trim(v: number): string {
  return (Math.round(v * 10) / 10).toString().replace('.', ',');
}

/** "5 menit lalu", "2 jam lalu", "Kemarin", "12 Okt". */
export function timeAgo(at: Date | null, now: Date = new Date()): string {
  if (!at || isNaN(at.getTime())) return '';
  const diff = now.getTime() - at.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Baru saja';
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'Kemarin';
  if (day < 7) return `${day} hari lalu`;
  return at.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: at.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
}

/** Unduh baris-baris data sebagai file CSV (bisa dibuka di Excel). */
export function downloadCsv(filename: string, rows: (string | number)[][]): void {
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Salin teks ke clipboard; mengembalikan true bila berhasil. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
