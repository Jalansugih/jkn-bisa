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

/** Khusus admin (dibatasi RLS). */
export async function adminFetchCommissions(): Promise<AdminCommission[]> {
  const { data, error } = await client()
    .from('commissions')
    .select(
      'id, order_id, base_amount, rate, amount, status, created_at, approved_at, paid_at,' +
        ' referrer:profiles!referrer_id(name, email, whatsapp, referral_code),' +
        ' order:orders!order_id(product, name)'
    )
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Gagal memuat komisi: ${error.message}`);
  return (data || []) as unknown as AdminCommission[];
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
