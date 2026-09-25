import React, { useState } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Lock,
  Gift,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { AuthUser } from '../../types';
import { registerWithEmail, loginWithEmail, loginWithGoogle, AuthNotConfiguredError } from '../../lib/authService';

function friendlyAuthError(err: unknown): string {
  if (err instanceof AuthNotConfiguredError) return err.message;
  const code = (err as { code?: string })?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Coba menu "Sudah Punya Akun" untuk masuk.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau kata sandi salah. Silakan periksa kembali.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah, gunakan minimal 6 karakter.';
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/popup-closed-by-user':
      return 'Jendela login Google ditutup sebelum selesai.';
    case 'auth/network-request-failed':
      return 'Koneksi bermasalah. Periksa internet Anda dan coba lagi.';
    default:
      return 'Terjadi kesalahan. Silakan coba lagi.';
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, message: string) => void;
  initialMode?: 'register' | 'login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('legalitas');
  const [password, setPassword] = useState('');

  // Loading + error states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'form' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Real Google Sign-In (Supabase OAuth redirect)
  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    setLoadingProvider('google');
    try {
      const user = await loginWithGoogle();
      onAuthSuccess(
        user,
        mode === 'register'
          ? 'Pendaftaran dengan Google berhasil! Selamat bergabung di BinaUsaha.'
          : 'Berhasil masuk dengan akun Google!'
      );
      onClose();
    } catch (err) {
      setErrorMsg(friendlyAuthError(err));
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  // 2. Real Email + Password Register / Login (Supabase Auth + profiles table)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'register' && (!fullName.trim() || !whatsapp.trim())) {
      setErrorMsg('Mohon lengkapi Nama Lengkap dan Nomor WhatsApp.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    setLoadingProvider('form');
    try {
      const user =
        mode === 'register'
          ? await registerWithEmail({
              fullName,
              email,
              password,
              whatsapp,
              businessName,
            })
          : await loginWithEmail(email, password);

      onAuthSuccess(
        user,
        mode === 'register'
          ? `Selamat datang ${user.name}! Akun UMKM Anda berhasil terdaftar.`
          : `Selamat datang kembali, ${user.name}!`
      );
      onClose();
    } catch (err) {
      setErrorMsg(friendlyAuthError(err));
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="auth-modal-dialog"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto relative transform transition-all animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Tutup modal pendaftaran"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-white/20 text-white backdrop-blur-xs border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Akses Portal UMKM</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            {mode === 'register' ? 'Daftar Akun BinaUsaha' : 'Masuk ke Akun Anda'}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-md">
            {mode === 'register'
              ? 'Daftar mudah via Google atau email untuk menikmati layanan digital & konsultasi UMKM.'
              : 'Masuk untuk memantau pengerjaan proyek, faktur pembayaran, dan status izin usaha.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-blue-900/40 p-1 rounded-xl mt-4 border border-white/15">
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-blue-800 shadow-md'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun Baru</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-blue-800 shadow-md'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sudah Punya Akun</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Member Benefits Banner (Register mode only) */}
          {mode === 'register' && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Keuntungan Member Baru:</p>
                <p className="text-emerald-700 mt-0.5">
                  Voucher Diskon <strong className="font-bold text-emerald-900">Rp 100.000</strong> &amp; Gratis 1x Sesi Konsultasi Legalitas &amp; Website dengan Business Advisor.
                </p>
              </div>
            </div>
          )}

          {/* Direct One-Click Methods (Google & WhatsApp) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {mode === 'register' ? 'Pilih Metode Pendaftaran Instan:' : 'Masuk Cepat:'}
            </label>

            {/* Google Action Button */}
            <button
              type="button"
              id="btn-auth-google"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {loadingProvider === 'google' ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>{mode === 'register' ? 'Daftar dengan Akun Google' : 'Masuk dengan Google'}</span>
            </button>

            {/* Errors from Supabase Auth */}
            {errorMsg && (
              <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">
              atau dengan email &amp; kata sandi
            </span>
          </div>

          {/* Email + Password Form (real Supabase Auth) */}
          {(
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pemilik Usaha <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Budi Prasetyo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      No. WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Usaha / Brand
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Contoh: Kopi Nusantara"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Layanan Utama yang Paling Diminati
                  </label>
                  <select
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  >
                    <option value="legalitas">Pendirian PT / CV &amp; Perizinan Legalitas</option>
                    <option value="website">Pembuatan Website &amp; Toko Online</option>
                    <option value="pos">Sistem Kasir (POS) &amp; Inventaris Digital</option>
                    <option value="bundling">Paket Bundling Usaha Lengkap Siap Buka</option>
                    <option value="pengadaan">Pengadaan Komputer &amp; Perangkat Kantor</option>
                    <option value="custom">Custom Aplikasi &amp; Software Usaha</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                id="btn-auth-submit-form"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition duration-300 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingProvider === 'form' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{mode === 'register' ? 'Selesaikan Pendaftaran Akun' : 'Masuk ke Akun'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Guarantee Notice */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Data usaha Anda terenkripsi aman
            </span>
            <button
              type="button"
              onClick={() => {
                const msg = encodeURIComponent('Halo CS BinaUsaha, saya butuh bantuan proses pendaftaran akun.');
                window.open(`https://wa.me/6285195979888?text=${msg}`, '_blank');
              }}
              className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <HelpCircle className="w-3 h-3" /> Butuh Bantuan?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
