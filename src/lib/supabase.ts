import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// SUPABASE CONFIG
// ============================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ============================================================
// STATUS KONFIGURASI
// ============================================================

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// ============================================================
// SUPABASE CLIENT
// ============================================================
//
// Tidak ada lagi masalah "checkout ngebleng" seperti di Firestore
// (yang disebabkan oleh WebChannel streaming yang diblokir sebagian
// ISP/jaringan). Supabase memakai HTTP biasa (PostgREST) untuk semua
// query/insert/update, dan hanya memakai WebSocket untuk fitur
// Realtime (subscribeToXxx) — jadi read/write utama tidak bergantung
// pada koneksi streaming yang rawan diblokir.

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  console.log('[Supabase] Client terhubung ke', supabaseUrl);
} else {
  console.error(
    '[Supabase] Konfigurasi belum lengkap. Pastikan VITE_SUPABASE_URL dan ' +
    'VITE_SUPABASE_ANON_KEY tersedia saat build (lihat .env.local.example).'
  );
}

export const supabase = client;

export default client;
