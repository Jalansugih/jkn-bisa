import { supabase, isSupabaseConfigured } from './supabase';

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export interface AdminCommission {
  id: string;
  order_id: string;
  base_amount: number;
  rate: number;
  amount: number;
  status: CommissionStatus;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
  /** false = harga tidak ditemukan di tabel products (diambil dari data browser) -> cek manual. */
  price_verified: boolean | null;
  /** 'fixed' = nominal tetap per produk; selain itu = persentase. */
  commission_type?: 'percent' | 'fixed' | null;
  referrer: {
    name: string | null;
    email: string | null;
    whatsapp: string | null;
    referral_code: string | null;
  } | null;
  order: { product: string | null; name: string | null } | null;
}

function client() {
  if (!isSupabaseConfigured || !supabase) throw new Error('Konfigurasi Supabase belum lengkap.');
  return supabase;
}

const BASE_COLUMNS = 'id, order_id, base_amount, rate, amount, status, created_at, approved_at, paid_at';
const JOINS =
  ' referrer:profiles!referrer_id(name, email, whatsapp, referral_code),' +
  ' order:orders!order_id(product, name)';

/** Khusus admin (dibatasi RLS). */
export async function adminFetchCommissions(): Promise<AdminCommission[]> {
  const db = client();
  // Kolom price_verified / commission_type baru ada setelah migrasi hardening & komisi-per-produk dijalankan.
  // Kalau belum, ulangi tanpa kolom itu supaya halaman komisi tetap terbuka.
  let res: { data: unknown; error: { message: string } | null } = await db
    .from('commissions')
    .select(`${BASE_COLUMNS}, price_verified, commission_type,${JOINS}`)
    .order('created_at', { ascending: false });
  if (res.error && /price_verified|commission_type/i.test(res.error.message)) {
    res = await db.from('commissions').select(`${BASE_COLUMNS},${JOINS}`).order('created_at', { ascending: false });
  }
  if (res.error) throw new Error(`Gagal memuat komisi: ${res.error.message}`);
  return ((res.data as unknown[]) || []) as AdminCommission[];
}

export async function adminSetCommissionStatus(id: string, status: CommissionStatus): Promise<void> {
  const { error } = await client().from('commissions').update({ status }).eq('id', id);
  if (error) throw new Error(`Gagal mengubah status komisi: ${error.message}`);
}

/** Setujui semua komisi pending yang sudah lewat masa refund. Mengembalikan jumlah baris. */
export async function adminApproveOlderThan(days: number): Promise<number> {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client()
    .from('commissions')
    .update({ status: 'approved' })
    .eq('status', 'pending')
    .lt('created_at', cutoff)
    .select('id');
  if (error) throw new Error(`Gagal menyetujui komisi: ${error.message}`);
  return data?.length || 0;
}
