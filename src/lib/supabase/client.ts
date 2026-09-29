// Client Supabase TUNGGAL.
//
// Sebelumnya file ini membuat client kedua (createClient) dengan storage key
// sesi yang sama dengan src/lib/supabase.ts. Dua client di browser yang sama
// berebut memproses token OAuth di URL (detectSessionInUrl) dan sesi di
// localStorage, sehingga login Google bisa gagal secara acak
// ("Multiple GoTrueClient instances detected").
//
// Sekarang file ini hanya meneruskan client utama dari src/lib/supabase.ts,
// supaya kode lama yang mengimpor './supabase/client' tetap jalan.
import { supabase as mainClient, isSupabaseConfigured } from '../supabase';

export { isSupabaseConfigured };

// Pemanggil (storageService) selalu mengecek isSupabaseConfigured lebih dulu.
export const supabase = mainClient!;

export default supabase;
