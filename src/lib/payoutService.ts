import { supabase, isSupabaseConfigured } from './supabase';

export type PayoutStatus = 'requested' | 'paid' | 'rejected';

export interface Payout {
  id: string;
  user_id: string;
  amount: number;
  status: PayoutStatus;
  bank_name: string;
  account_number: string;
  account_name: string;
  transfer_ref: string | null;
  transferred_at: string | null;
  note: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface AdminPayout extends Payout {
  user: { name: string | null; email: string | null; whatsapp: string | null } | null;
}

export interface PayoutAccount {
  bank_name: string;
  account_number: string;
  account_name: string;
}

/** Cadangan bila pengaturan 'min_payout' belum ada di database. */
export const DEFAULT_MIN_PAYOUT = 50000;

function client() {
  if (!isSupabaseConfigured || !supabase) throw new Error('Konfigurasi Supabase belum lengkap.');
  return supabase;
}

const COLUMNS =
  'id, user_id, amount, status, bank_name, account_number, account_name, transfer_ref, transferred_at, note, created_at, processed_at';

/** Rekening terakhir yang dipakai user (untuk mengisi formulir otomatis). */
export async function fetchMyPayoutAccount(): Promise<PayoutAccount | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('payout_bank_name, payout_account_number, payout_account_name')
    .eq('id', uid)
    .maybeSingle();
  if (error || !data?.payout_account_number) return null;
  return {
    bank_name: data.payout_bank_name || '',
    account_number: data.payout_account_number || '',
    account_name: data.payout_account_name || '',
  };
}

export async function fetchMinPayout(): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_MIN_PAYOUT;
  const { data, error } = await supabase.rpc('get_min_payout');
  const n = Number(data);
  return !error && Number.isFinite(n) && n > 0 ? n : DEFAULT_MIN_PAYOUT;
}

/** Riwayat pencairan milik user yang sedang login (terbaru dulu). */
export async function fetchMyPayouts(): Promise<Payout[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return [];
  const { data, error } = await supabase
    .from('commission_payouts')
    .select(COLUMNS)
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[fetchMyPayouts]', error.message);
    return [];
  }
  return (data || []) as Payout[];
}

/** Ajukan pencairan seluruh komisi yang berstatus Disetujui. Jumlah dihitung server. */
export async function requestPayout(account: PayoutAccount): Promise<string> {
  const { data, error } = await client().rpc('request_payout', {
    p_bank_name: account.bank_name,
    p_account_number: account.account_number,
    p_account_name: account.account_name,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

/** Khusus admin (dibatasi RLS). */
export async function adminFetchPayouts(): Promise<AdminPayout[]> {
  const { data, error } = await client()
    .from('commission_payouts')
    .select(`${COLUMNS}, user:profiles!user_id(name, email, whatsapp)`)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Gagal memuat pencairan: ${error.message}`);
  return ((data as unknown[]) || []) as AdminPayout[];
}

export async function adminMarkPayoutPaid(id: string, transferRef: string, note?: string): Promise<void> {
  const { error } = await client().rpc('admin_mark_payout_paid', {
    p_payout_id: id,
    p_transfer_ref: transferRef,
    p_transferred_at: null,
    p_note: note || null,
  });
  if (error) throw new Error(error.message);
}

export async function adminRejectPayout(id: string, reason: string): Promise<void> {
  const { error } = await client().rpc('admin_reject_payout', { p_payout_id: id, p_note: reason });
  if (error) throw new Error(error.message);
}
