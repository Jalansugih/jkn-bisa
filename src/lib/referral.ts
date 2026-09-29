import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export const COMMISSION_RATE = 0.3; // harus sama dengan v_rate di SQL (SQL yang menentukan nilai sebenarnya)

const KEY = 'bu_ref_v1';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari

/** Komisi = harga jual (setelah diskon) x 30%. Contoh: 800.000 -> 240.000 */
export function commissionFor(sellingPrice: number): number {
  return Math.floor(sellingPrice * COMMISSION_RATE);
}

export function formatRupiah(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

/**
 * Panggil sekali saat aplikasi dibuka. Menyimpan ?ref= ke localStorage (30 hari),
 * lalu mengembalikan ?produk= (kalau ada) supaya modal order bisa langsung dibuka.
 * Parameter dibersihkan dari URL.
 */
export function captureReferralFromUrl(): { productKey: string | null } {
  let productKey: string | null = null;
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const pathMatch = window.location.pathname.match(/^\/paket\/([^/]+)\/?$/);
    productKey = pathMatch ? decodeURIComponent(pathMatch[1]) : params.get('produk');

    if (ref && /^[A-Za-z0-9]{4,16}$/.test(ref)) {
      localStorage.setItem(KEY, JSON.stringify({ code: ref.toUpperCase(), exp: Date.now() + TTL_MS }));
    }
    if (ref || productKey) {
      const onPaketPath = Boolean(pathMatch);
      params.delete('ref');
      params.delete('produk');
      const qs = params.toString();
      const cleanPath = onPaketPath ? '/' : window.location.pathname;
      window.history.replaceState({}, '', cleanPath + (qs ? `?${qs}` : '') + window.location.hash);
    }
  } catch { /* localStorage bisa diblokir: abaikan */ }
  return { productKey };
}

export function getStoredReferralCode(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { code, exp } = JSON.parse(raw) as { code: string; exp: number };
    if (!code || Date.now() > exp) {
      localStorage.removeItem(KEY);
      return null;
    }
    return code;
  } catch {
    return null;
  }
}

export function buildProductShareUrl(productKey: string, code: string): string {
  return `${window.location.origin}/paket/${encodeURIComponent(productKey)}?ref=${encodeURIComponent(code)}`;
}

/** Ambil kode referral milik user yang sedang login. */
export function useReferralCode(uid: string | null): string | null {
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (!uid || !isSupabaseConfigured || !supabase) {
      setCode(null);
      return;
    }
    supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', uid)
      .maybeSingle()
      .then(({ data }) => { if (alive) setCode((data?.referral_code as string) || null); });
    return () => { alive = false; };
  }, [uid]);
  return code;
}

export interface CommissionRow {
  id: string;
  order_id: string;
  base_amount: number;
  rate: number;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string;
}

export async function fetchMyCommissions(): Promise<CommissionRow[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('commissions')
    .select('id, order_id, base_amount, rate, amount, status, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[fetchMyCommissions]', error);
    return [];
  }
  return (data || []) as CommissionRow[];
}
