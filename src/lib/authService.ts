import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { AuthUser } from '../types';

const LOCAL_USER_KEY = 'bu_current_user';

/**
 * Satu-satunya sumber kebenaran untuk status admin adalah kolom
 * `profiles.role` di database. Tidak ada daftar email admin di client.
 * Admin pertama ditetapkan sekali melalui SQL bootstrap, lalu admin
 * berikutnya dikelola dari Admin > Pengguna melalui updateUserRole().
 */
export function checkIsAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin';
}

export class AuthNotConfiguredError extends Error {
  constructor() {
    super(
      'Backend belum dikonfigurasi. Admin situs perlu mengisi kredensial Supabase di file .env.local (lihat .env.local.example).'
    );
    this.name = 'AuthNotConfiguredError';
  }
}

/**
 * Menerjemahkan error dari Supabase Auth menjadi pesan Bahasa Indonesia
 * yang ramah pengguna. Dipetakan dari `AuthError.code` resmi Supabase
 * (https://supabase.com/docs/guides/auth/debugging/error-codes) — BUKAN
 * kode error Firebase (`auth/...`) seperti versi sebelumnya, yang tidak
 * pernah cocok sehingga selalu jatuh ke pesan generik.
 */
export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof AuthNotConfiguredError) return err.message;

  const code = (err as { code?: string })?.code || '';
  const message = ((err as { message?: string })?.message || '').toLowerCase();

  switch (code) {
    case 'invalid_credentials':
    case 'user_not_found':
      return 'Email atau kata sandi salah. Silakan periksa kembali.';
    case 'email_exists':
    case 'user_already_exists':
    case 'identity_already_exists':
      return 'Email ini sudah terdaftar. Coba menu "Sudah Punya Akun" untuk masuk.';
    case 'email_not_confirmed':
      return 'Email Anda belum diverifikasi. Cek kotak masuk (atau folder spam) untuk link konfirmasi.';
    case 'weak_password':
      return 'Kata sandi terlalu lemah, gunakan minimal 6 karakter dengan kombinasi huruf & angka.';
    case 'same_password':
      return 'Kata sandi baru tidak boleh sama dengan kata sandi lama.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Terlalu banyak percobaan. Silakan tunggu beberapa saat lalu coba lagi.';
    case 'signup_disabled':
      return 'Pendaftaran akun baru sedang dinonaktifkan sementara.';
    case 'user_banned':
      return 'Akun ini telah dinonaktifkan. Hubungi CS BinaUsaha untuk bantuan.';
    case 'validation_failed':
    case 'bad_json':
      return 'Data yang dikirim tidak valid. Periksa kembali isian formulir.';
  }

  // Fallback: beberapa versi supabase-js/lingkungan lama belum mengirim
  // `code`, jadi cocokkan pola pesan mentah sebagai jaring pengaman.
  if (message.includes('invalid login credentials')) {
    return 'Email atau kata sandi salah. Silakan periksa kembali.';
  }
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Email ini sudah terdaftar. Coba menu "Sudah Punya Akun" untuk masuk.';
  }
  if (message.includes('password') && message.includes('least')) {
    return 'Kata sandi terlalu lemah, gunakan minimal 6 karakter.';
  }
  if (message.includes('rate limit')) {
    return 'Terlalu banyak percobaan. Silakan tunggu beberapa saat lalu coba lagi.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Koneksi bermasalah. Periksa internet Anda dan coba lagi.';
  }

  return (err as { message?: string })?.message || 'Terjadi kesalahan. Silakan coba lagi.';
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
  return {
    id: row.id,
    name: row.name || 'Mitra UMKM',
    email: row.email || undefined,
    whatsapp: row.whatsapp || undefined,
    businessName: row.business_name || undefined,
    avatar: row.avatar || undefined,
    provider: row.provider || 'form',
    role: row.role === 'admin' ? 'admin' : 'customer',
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
  // Fallback ini hanya dipakai saat baris `profiles` benar-benar tidak
  // terbaca (race condition / DB error). Role sengaja default 'customer'
  // di sini — status admin yang sebenarnya selalu diverifikasi ulang dari
  // tabel `profiles` begitu koneksi pulih, bukan ditebak dari email di client.
  return {
    id: sbUser.id,
    name: extra?.name || sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || 'Mitra UMKM',
    email: sbUser.email || extra?.email,
    whatsapp: extra?.whatsapp,
    businessName: extra?.businessName,
    avatar: sbUser.user_metadata?.avatar_url || undefined,
    provider,
    role: extra?.role === 'admin' ? 'admin' : 'customer',
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
 * Kirim email "lupa kata sandi" (Supabase mengirim magic link reset).
 * Setelah user klik link di email, mereka diarahkan kembali ke situs ini
 * dengan sesi pemulihan aktif; event `PASSWORD_RECOVERY` akan diteruskan
 * lewat window event `binausaha:password-recovery` (lihat subscribeToAuthChanges)
 * supaya UI bisa menampilkan form "Atur Kata Sandi Baru".
 */
export async function requestPasswordReset(email: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new AuthNotConfiguredError();
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
}

/**
 * Set kata sandi baru. Hanya berfungsi ketika ada sesi pemulihan aktif
 * (setelah user membuka link reset password dari email).
 */
export async function updatePassword(newPassword: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new AuthNotConfiguredError();
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
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
      async (event, session: Session | null) => {
        if (event === 'PASSWORD_RECOVERY') {
          window.dispatchEvent(new CustomEvent('binausaha:password-recovery'));
          return;
        }

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
