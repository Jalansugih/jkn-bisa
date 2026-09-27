import React, { useState } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Lock,
  Gift,
  HelpCircle,
  AlertTriangle,
  KeyRound,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { AuthUser } from '../../types';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  requestPasswordReset,
  getAuthErrorMessage,
} from '../../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, message: string) => void;
  initialMode?: 'register' | 'login';
}

/**
 * Visual & functional identity per mode:
 *  - register: gradasi biru-indigo, ikon UserPlus, banner keuntungan member,
 *    formulir lengkap (nama, WA, usaha, minat).
 *  - login: gradasi slate-ke-biru gelap (lebih "profesional/kembali"), ikon
 *    LogIn, TANPA banner promosi, formulir ringkas (email + kata sandi saja)
 *    plus link "Lupa kata sandi?" yang tidak ada di mode register.
 * Keduanya berbagi kerangka modal supaya konsisten, tapi warna, copy, ikon,
 * dan field yang ditampilkan sengaja dibedakan agar user langsung sadar
 * mereka sedang di alur yang berbeda.
 */
export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('legalitas');
  const [password, setPassword] = useState('');

  // Forgot-password mini-flow state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Loading + error states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'form' | 'reset' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const switchMode = (next: 'register' | 'login') => {
    setMode(next);
    setErrorMsg(null);
    setShowForgotPassword(false);
    setResetSent(false);
  };

  const handleClose = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setErrorMsg(null);
    onClose();
  };

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
      handleClose();
    } catch (err) {
      setErrorMsg(getAuthErrorMessage(err));
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
      handleClose();
    } catch (err) {
      setErrorMsg(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  // 3. Forgot password (login mode only)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!resetEmail.trim()) {
      setErrorMsg('Masukkan email akun Anda terlebih dahulu.');
      return;
    }
    setIsLoading(true);
    setLoadingProvider('reset');
    try {
      await requestPasswordReset(resetEmail);
      setResetSent(true);
    } catch (err) {
      setErrorMsg(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const isRegister = mode === 'register';

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="auth-modal-dialog"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto relative transform transition-all animate-scaleUp"
      >
        {/* Modal Header - visual identity differs by mode */}
        <div
          className={`p-6 text-white relative bg-gradient-to-r ${
            isRegister
              ? 'from-blue-700 via-blue-600 to-indigo-700'
              : 'from-slate-800 via-slate-800 to-blue-900'
          }`}
        >
          <button
            onClick={handleClose}
            aria-label="Tutup modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {showForgotPassword ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-white/20 text-white backdrop-blur-xs border border-white/20">
                  <KeyRound className="w-3 h-3 text-amber-300" />
                  <span>Pemulihan Akun</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Lupa Kata Sandi?
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-md">
                Masukkan email akun Anda, kami akan mengirim link untuk mengatur kata sandi baru.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-white/20 text-white backdrop-blur-xs border border-white/20">
                  {isRegister ? (
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  ) : (
                    <Zap className="w-3 h-3 text-amber-300" />
                  )}
                  <span>{isRegister ? 'Akses Portal UMKM' : 'Selamat Datang Kembali'}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {isRegister ? 'Daftar Akun BinaUsaha' : 'Masuk ke Akun Anda'}
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-md">
                {isRegister
                  ? 'Daftar mudah via Google atau email untuk menikmati layanan digital & konsultasi UMKM.'
                  : 'Sudah jadi mitra kami? Masuk untuk memantau pengerjaan proyek, faktur, dan status izin usaha.'}
              </p>

              {/* Mode Switcher Tabs */}
              <div className="flex bg-black/20 p-1 rounded-xl mt-4 border border-white/15">
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    isRegister ? 'bg-white text-blue-800 shadow-md' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Belum Punya Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isRegister ? 'bg-white text-slate-800 shadow-md' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sudah Punya Akun</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* ===================== FORGOT PASSWORD VIEW ===================== */}
        {showForgotPassword ? (
          <div className="p-5 sm:p-6 space-y-4">
            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">Email Terkirim</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Kami sudah mengirim link pemulihan kata sandi ke <strong className="text-slate-700">{resetEmail}</strong>.
                  Buka email tersebut dan ikuti instruksinya. Cek juga folder spam bila belum muncul.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Halaman Masuk
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali
                </button>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Terdaftar <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl p-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition duration-300 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loadingProvider === 'reset' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Kirim Link Reset Kata Sandi</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ===================== LOGIN / REGISTER VIEW ===================== */
          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Member Benefits Banner - register mode ONLY */}
            {isRegister && (
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

            {/* Quick-login reassurance banner - login mode ONLY */}
            {!isRegister && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Akun Anda aman & tersimpan.</p>
                  <p className="text-slate-500 mt-0.5">
                    Masuk untuk melanjutkan pemantauan pesanan, faktur, dan status legalitas usaha Anda.
                  </p>
                </div>
              </div>
            )}

            {/* Direct One-Click Methods (Google) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isRegister ? 'Pilih Metode Pendaftaran Instan:' : 'Masuk Cepat:'}
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
                <span>{isRegister ? 'Daftar dengan Akun Google' : 'Masuk dengan Google'}</span>
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
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Register-only fields */}
              {isRegister && (
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

              {isRegister && (
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  {/* Forgot-password link only makes sense (and only appears) in login mode */}
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetEmail(email);
                        setErrorMsg(null);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {isRegister && (
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
                className={`w-full text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  isRegister
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                    : 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/20'
                }`}
              >
                {loadingProvider === 'form' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegister ? <CheckCircle2 className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    <span>{isRegister ? 'Selesaikan Pendaftaran Akun' : 'Masuk ke Akun'}</span>
                  </>
                )}
              </button>

              {/* Contextual switch link (redundant with tabs above, but reinforces the distinction) */}
              <p className="text-center text-xs text-slate-500">
                {isRegister ? (
                  <>
                    Sudah punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Masuk di sini
                    </button>
                  </>
                ) : (
                  <>
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Daftar gratis
                    </button>
                  </>
                )}
              </p>
            </form>

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
        )}
      </div>
    </div>
  );
};
