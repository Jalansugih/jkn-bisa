import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { AuthUser } from '../types';

const LOCAL_USER_KEY = 'bu_current_user';

export const ADMIN_EMAILS = [
  'databasemanb@gmail.com',
  'admin@binausaha.id',
];

export function checkIsAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) {
    return true;
  }
  return false;
}

export class AuthNotConfiguredError extends Error {
  constructor() {
    super(
      'Backend belum dikonfigurasi. Admin situs perlu mengisi kredensial Supabase di file .env.local (lihat .env.local.example).'
    );
    this.name = 'AuthNotConfiguredError';
  }
}

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  whatsapp?: string;
  businessName?: string;
}

function getLocalUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setLocalUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
    window.dispatchEvent(new CustomEvent('binausaha:auth-changed', { detail: user }));
  } catch (err) {
    console.warn('[setLocalUser] Failed to persist user:', err);
  }
}

function joinedAtNow(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Baris `profiles` di Supabase (pengganti dokumen Firestore `users/{uid}`).
 */
interface ProfileRow {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  business_name: string | null;
  avatar: string | null;
  provider: AuthUser['provider'];
  role: 'admin' | 'customer';
  joined_at: string | null;
}

function profileRowToAuthUser(row: ProfileRow): AuthUser {
  const isAdm = row.role === 'admin' || (row.email ? ADMIN_EMAILS.includes(row.email.toLowerCase().trim()) : false);
  return {
    id: row.id,
    name: row.name || 'Mitra UMKM',
    email: row.email || undefined,
    whatsapp: row.whatsapp || undefined,
    businessName: row.business_name || undefined,
    avatar: row.avatar || undefined,
    provider: row.provider || 'form',
    role: isAdm ? 'admin' : (row.role || 'customer'),
    joinedAt: row.joined_at || joinedAtNow(),
  };
}

/**
 * Membuat profil fallback dari Supabase User ketika baris `profiles`
 * belum sempat dibuat oleh trigger DB (kondisi race yang sangat jarang).
 */
function buildFallbackProfile(
  sbUser: SupabaseUser,
  provider: AuthUser['provider'],
  extra?: Partial<AuthUser>
): AuthUser {
  const email = sbUser.email || extra?.email;
  const isAdm = extra?.role === 'admin' || (email ? ADMIN_EMAILS.includes(email.toLowerCase().trim()) : false);

  return {
    id: sbUser.id,
    name: extra?.name || sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || 'Mitra UMKM',
    email,
    whatsapp: extra?.whatsapp,
    businessName: extra?.businessName,
    avatar: sbUser.user_metadata?.avatar_url || undefined,
    provider,
    role: isAdm ? 'admin' : (extra?.role || 'customer'),
    joinedAt: joinedAtNow(),
  };
}

/**
 * Ambil profil dari tabel `profiles`. Jika belum ada (trigger belum
 * jalan / race condition), buat manual via upsert.
 */
async function fetchOrCreateProfile(
  sbUser: SupabaseUser,
  provider: AuthUser['provider']
): Promise<AuthUser> {
  if (!isSupabaseConfigured || !supabase) {
    return buildFallbackProfile(sbUser, provider);
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      return profileRowToAuthUser(data as ProfileRow);
    }

    // Trigger belum sempat membuat profil -> buat sekarang.
    const fallback = buildFallbackProfile(sbUser, provider);
    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: sbUser.id,
        name: fallback.name,
        email: fallback.email,
        whatsapp: fallback.whatsapp,
        business_name: fallback.businessName,
        avatar: fallback.avatar,
        provider: fallback.provider,
        role: fallback.role,
        joined_at: fallback.joinedAt,
      })
      .select('*')
      .single();

    if (insertError) throw insertError;
    return profileRowToAuthUser(inserted as ProfileRow);
  } catch (error) {
    console.warn('[Auth] Error fetching Supabase profile:', error);
    return buildFallbackProfile(sbUser, provider);
  }
}

/**
 * Register dengan email + password.
 */
export async function registerWithEmail(
  input: RegisterInput
): Promise<AuthUser> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: {
            full_name: input.fullName.trim(),
            whatsapp: input.whatsapp?.trim(),
            business_name: input.businessName?.trim(),
          },
        },
      });

      if (error) throw error;
      if (!data.user) {
        throw new Error('Registrasi berhasil tetapi sesi pengguna tidak ditemukan. Cek email verifikasi Anda.');
      }

      // Lengkapi field yang trigger auto-create tidak tahu (whatsapp, businessName)
      await supabase
        .from('profiles')
        .update({
          whatsapp: input.whatsapp?.trim() || null,
          business_name: input.businessName?.trim() || null,
        })
        .eq('id', data.user.id);

      const profile = await fetchOrCreateProfile(data.user, 'form');
      setLocalUser(profile);
      return profile;
    } catch (err) {
      console.error('[registerWithEmail] Supabase register failed:', err);
      throw err;
    }
  }

  // Local user fallback when Supabase is not configured
  const localProfile: AuthUser = {
    id: 'user-' + Math.random().toString(36).substring(2, 10),
    name: input.fullName.trim(),
    email: input.email.trim(),
    whatsapp: input.whatsapp?.trim(),
    businessName: input.businessName?.trim(),
    provider: 'form',
    joinedAt: joinedAtNow(),
  };

  setLocalUser(localProfile);
  return localProfile;
}

/**
 * Login dengan email + password.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    if (!data.user) throw new Error('Login gagal: pengguna tidak ditemukan.');

    const profile = await fetchOrCreateProfile(data.user, 'form');
    setLocalUser(profile);
    return profile;
  }

  // Local login fallback
  const existing = getLocalUser();
  if (existing && existing.email?.toLowerCase() === email.trim().toLowerCase()) {
    setLocalUser(existing);
    return existing;
  }

  const localProfile: AuthUser = {
    id: 'user-' + Math.random().toString(36).substring(2, 10),
    name: email.split('@')[0] || 'Mitra UMKM',
    email: email.trim(),
    provider: 'form',
    joinedAt: joinedAtNow(),
  };

  setLocalUser(localProfile);
  return localProfile;
}

/**
 * Login / daftar menggunakan Google.
 *
 * PENTING: berbeda dari Firebase (signInWithPopup yang langsung resolve
 * dengan user), Supabase OAuth me-redirect browser ke Google lalu balik
 * lagi ke halaman ini. Promise ini resolve begitu redirect dimulai, BUKAN
 * begitu login selesai — hasil login sebenarnya akan diterima lewat
 * `subscribeToAuthChanges` setelah user kembali ke halaman.
 */
export async function loginWithGoogle(): Promise<AuthUser> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    // Browser akan redirect ke Google sekarang. Kembalikan user lokal
    // (jika ada) sebagai placeholder sementara; UI sebaiknya menunggu
    // event `binausaha:auth-changed` / subscribeToAuthChanges untuk
    // data final setelah redirect kembali.
    const placeholder: AuthUser = getLocalUser() || {
      id: 'pending-google-auth',
      name: 'Menghubungkan ke Google…',
      provider: 'google',
      joinedAt: joinedAtNow(),
    };
    return placeholder;
  }

  // Local fallback
  const localGoogleUser: AuthUser = {
    id: 'google-user-' + Math.random().toString(36).substring(2, 8),
    name: 'Mitra Google BinaUsaha',
    email: 'mitra@binausaha.id',
    provider: 'google',
    joinedAt: joinedAtNow(),
  };
  setLocalUser(localGoogleUser);
  return localGoogleUser;
}

/**
 * Logout.
 */
export async function logout(): Promise<void> {
  setLocalUser(null);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[logout] Supabase signOut notice:', err);
    }
  }
}

/**
 * Memantau perubahan status login.
 */
export function subscribeToAuthChanges(
  callback: (user: AuthUser | null) => void
): () => void {
  // Emit current local user first
  const currentLocal = getLocalUser();
  callback(currentLocal);

  const handleCustomAuth = (e: Event) => {
    const user = (e as CustomEvent).detail as AuthUser | null;
    callback(user);
  };

  const handleStorage = () => {
    callback(getLocalUser());
  };

  window.addEventListener('binausaha:auth-changed', handleCustomAuth);
  window.addEventListener('storage', handleStorage);

  let unsubscribeSupabase: (() => void) | null = null;

  if (isSupabaseConfigured && supabase) {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session: Session | null) => {
        const sbUser = session?.user;
        if (!sbUser) {
          setLocalUser(null);
          callback(null);
          return;
        }

        try {
          const provider = sbUser.app_metadata?.provider === 'google' ? 'google' : 'form';
          const profile = await fetchOrCreateProfile(sbUser, provider);
          setLocalUser(profile);
          callback(profile);
        } catch (err) {
          console.warn('Gagal memuat profil pengguna:', err);
          const provider = sbUser.app_metadata?.provider === 'google' ? 'google' : 'form';
          const fallback = buildFallbackProfile(sbUser, provider);
          setLocalUser(fallback);
          callback(fallback);
        }
      }
    );
    unsubscribeSupabase = () => listener.subscription.unsubscribe();
  }

  return () => {
    window.removeEventListener('binausaha:auth-changed', handleCustomAuth);
    window.removeEventListener('storage', handleStorage);
    if (unsubscribeSupabase) {
      unsubscribeSupabase();
    }
  };
}
