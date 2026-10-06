import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

/** Cadangan bila database belum berisi pengaturan / tidak terjangkau. */
export const DEFAULT_COMMISSION_RATE = 0.3;

let currentRate = DEFAULT_COMMISSION_RATE;
let loaded = false;
let inflight: Promise<number> | null = null;
const listeners = new Set<(rate: number) => void>();

function publish(rate: number) {
  currentRate = rate;
  listeners.forEach((fn) => fn(rate));
}

/** Ambil tarif dari Supabase (hasilnya dibagikan ke semua komponen). */
export function loadCommissionRate(force = false): Promise<number> {
  if (loaded && !force) return Promise.resolve(currentRate);
  if (inflight) return inflight;
  if (!isSupabaseConfigured || !supabase) return Promise.resolve(currentRate);

  inflight = (async () => {
    const { data, error } = await supabase!
      .from('app_settings')
      .select('value')
      .eq('key', 'commission_rate')
      .maybeSingle();
    if (error) {
      console.warn('[commissionRate] Memakai tarif cadangan:', error.message);
    } else if (data && Number.isFinite(Number(data.value))) {
      publish(Number(data.value));
    }
    loaded = true;
    return currentRate;
  })().finally(() => { inflight = null; });

  return inflight;
}

/** Tarif komisi terkini (0-1). Otomatis memperbarui tampilan saat admin mengubahnya. */
export function useCommissionRate(): number {
  const [rate, setRate] = useState(currentRate);
  useEffect(() => {
    listeners.add(setRate);
    loadCommissionRate().then(setRate);
    return () => { listeners.delete(setRate); };
  }, []);
  return rate;
}

/** Khusus admin (dibatasi RLS). percent = 0-100, boleh desimal satu angka (mis. 12.5). */
export async function adminSetCommissionRate(percent: number): Promise<number> {
  if (!isSupabaseConfigured || !supabase) throw new Error('Konfigurasi Supabase belum lengkap.');
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error('Tarif komisi harus antara 0% dan 100%.');
  }
  const rate = Math.round(percent * 10) / 1000; // 1 desimal persen -> pecahan
  const { error } = await supabase
    .from('app_settings')
    .upsert({ key: 'commission_rate', value: rate }, { onConflict: 'key' });
  if (error) throw new Error(`Gagal menyimpan tarif komisi: ${error.message}`);
  loaded = true;
  publish(rate);
  return rate;
}
