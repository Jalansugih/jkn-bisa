import { supabase, isSupabaseConfigured } from './supabase';

/** Kunci di tabel app_settings (nilai rupiah per bulan). Tidak butuh migrasi baru. */
const KEY = 'monthly_revenue_target';

/** Target omset bulanan (Rupiah). null = belum diatur. */
export async function fetchRevenueTarget(): Promise<number | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('app_settings').select('value').eq('key', KEY).maybeSingle();
  if (error) {
    console.warn('[revenueTarget] Gagal memuat target:', error.message);
    return null;
  }
  const v = Number(data?.value);
  return Number.isFinite(v) && v > 0 ? v : null;
}

/** Khusus admin (dibatasi RLS). Nilai 0 = target dimatikan (disimpan sebagai 0; tabel tidak punya kebijakan hapus). */
export async function adminSetRevenueTarget(amount: number): Promise<number | null> {
  if (!isSupabaseConfigured || !supabase) throw new Error('Konfigurasi Supabase belum lengkap.');
  if (!Number.isFinite(amount) || amount < 0) throw new Error('Target omset tidak valid.');
  const { error } = await supabase
    .from('app_settings')
    .upsert({ key: KEY, value: Math.round(amount) }, { onConflict: 'key' });
  if (error) throw new Error(`Gagal menyimpan target omset: ${error.message}`);
  return amount > 0 ? Math.round(amount) : null;
}
