import React, { useState } from 'react';
import {
  X,
  LogIn,
  CheckCircle2,
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
  ArrowRight,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AuthUser } from '../../types';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  requestPasswordReset,
  getAuthErrorMessage,
  EmailVerificationPendingError,
} from '../../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, message: string) => void;
  initialMode?: 'register' | 'login';
  /** Dibuka dari kalimat persetujuan di bawah tombol. Jika tidak diberikan, tautan membuka halaman biasa. */
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

/**
 * Modal Masuk / Daftar dengan gaya "Blue Glass": kartu kaca di atas latar biru
 * berbintik dengan bola cahaya bergerak pelan. Mode masuk dan daftar berbagi satu
 * kartu dan dipilih lewat tab; mode daftar menambah nama, WhatsApp, nama usaha,
 * dan minat layanan. Alur lupa kata sandi tampil di kartu yang sama.
 * Seluruh logika (Supabase Auth, Google, reset sandi, pesan error) tidak diubah.
 */
export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'register',
  onOpenTerms,
  onOpenPrivacy,
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
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Tampilan saja: tombol lihat/sembunyikan kata sandi
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const switchMode = (next: 'register' | 'login') => {
    setMode(next);
    setErrorMsg(null);
    setInfoMsg(null);
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
    setInfoMsg(null);

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
      if (err instanceof EmailVerificationPendingError) {
        setInfoMsg(err.message);
      } else {
        setErrorMsg(getAuthErrorMessage(err));
      }
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

  const labelClass = 'block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1';
  const iconWrapClass = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400';
  const inputClass =
    'auth-glass-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none';
  const passwordInputClass =
    'auth-glass-input w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none';

  const errorBox = errorMsg && (
    <div className="flex items-start gap-2 bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl p-3">
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{errorMsg}</span>
    </div>
  );

  return (
    <div
      id="auth-modal-overlay"
      className="auth-overlay fixed inset-0 z-[120] bg-slate-100/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto selection:bg-blue-600 selection:text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Latar: bintik biru dan bola cahaya (dekorasi, tidak menangkap klik) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.12]" />
        <div className="auth-ambient-1 absolute -top-24 -left-20 w-96 h-96 bg-blue-400/35 rounded-full blur-3xl" />
        <div className="auth-ambient-2 absolute top-1/2 -right-24 w-[30rem] h-[30rem] bg-cyan-300/35 rounded-full blur-3xl" />
        <div className="auth-ambient-3 absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl" />
      </div>

      <div
        id="auth-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="auth-glass-card relative z-10 w-full max-w-md my-auto rounded-2xl p-5 sm:p-6"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup modal"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/70 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & judul */}
        <div className="flex flex-col items-center text-center mb-5">
  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-md shadow-blue-500/20 bg-white border border-slate-200 mb-2.5">
    <img
      src="/logo-rk-bendahara.png"
      alt="BinaUsaha logo"
      className="w-full h-full object-contain"
    />
  </div>
  <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 tracking-tight">
    {showForgotPassword ? 'Lupa Kata Sandi?' : isRegister ? 'Daftar Akun BinaUsaha' : 'Masuk ke Akun Anda'}
  </h2>
  <p className="text-xs text-slate-600 mt-1 font-medium max-w-[300px]">
    {showForgotPassword
      ? 'Masukkan email akun Anda, kami akan mengirim link untuk mengatur kata sandi baru.'
      : isRegister
        ? 'Daftar mudah via Google atau email untuk menikmati layanan digital & konsultasi UMKM.'
        : 'Masuk untuk memantau pengerjaan proyek, faktur, dan status izin usaha Anda.'}
  </p>
</div>

        {/* ===================== LUPA KATA SANDI ===================== */}
        {showForgotPassword ? (
          <div className="space-y-4">
            {resetSent ? (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">Email Terkirim</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  Kami sudah mengirim link pemulihan kata sandi ke <strong className="text-slate-800">{resetEmail}</strong>.
                  Buka email tersebut dan ikuti instruksinya. Cek juga folder spam bila belum muncul.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                  }}
                  className="auth-glass-input w-full py-2.5 px-4 rounded-xl text-slate-700 font-bold text-xs hover:bg-white cursor-pointer flex items-center justify-center gap-2"
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
                  <label htmlFor="auth-reset-email" className={labelClass}>
                    Email Terdaftar <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={iconWrapClass}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="auth-reset-email"
                      type="email"
                      required
                      autoFocus
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {errorBox}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-btn-gradient w-full py-2.5 px-3 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
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
          /* ===================== MASUK / DAFTAR ===================== */
          <>
            {/* Tab Masuk / Daftar Baru */}
            <div role="tablist" className="bg-slate-200/60 p-1 rounded-xl flex items-center mb-4 border border-white/60">
              <button
                type="button"
                role="tab"
                aria-selected={!isRegister}
                onClick={() => switchMode('login')}
                className={`w-1/2 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
                  !isRegister ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isRegister}
                onClick={() => switchMode('register')}
                className={`w-1/2 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
                  isRegister ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {/* Keuntungan member baru - hanya mode daftar */}
            {isRegister && (
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
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

            {/* Formulir email & kata sandi (Supabase Auth) */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {isRegister && (
                <div>
                  <label htmlFor="auth-fullname" className={labelClass}>
                    Nama Lengkap Pemilik Usaha <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className={iconWrapClass}>
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="auth-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Budi Prasetyo"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {isRegister && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="auth-whatsapp" className={labelClass}>
                      No. WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className={iconWrapClass}>
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-whatsapp"
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="auth-business" className={labelClass}>
                      Nama Usaha / Brand
                    </label>
                    <div className="relative">
                      <div className={iconWrapClass}>
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-business"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Contoh: Kopi Nusantara"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className={labelClass}>
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className={iconWrapClass}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="auth-password" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  {/* Link lupa kata sandi hanya muncul di mode masuk */}
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetEmail(email);
                        setErrorMsg(null);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className={iconWrapClass}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    className={passwordInputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label htmlFor="auth-interest" className={labelClass}>
                    Layanan Utama yang Paling Diminati
                  </label>
                  <select
                    id="auth-interest"
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="auth-glass-input w-full px-3 py-2.5 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
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

              {infoMsg && (
                <div className="bg-emerald-50/90 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl p-3">
                  {infoMsg}
                </div>
              )}

              {errorBox}

              <button
                type="submit"
                id="btn-auth-submit-form"
                disabled={isLoading}
                className="auth-btn-gradient group w-full py-2.5 px-3 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
              >
                {loadingProvider === 'form' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegister ? <CheckCircle2 className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    <span>{isRegister ? 'Selesaikan Pendaftaran Akun' : 'Masuk ke Akun'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-100 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Persetujuan Syarat & Kebijakan Privasi (juga berlaku untuk masuk/daftar dengan Google) */}
              <p className="text-center text-[11px] text-slate-600 leading-relaxed">
                {isRegister ? 'Dengan mendaftar' : 'Dengan masuk'}, Anda menyetujui{' '}
                <a
                  href="/syarat-ketentuan"
                  onClick={(e) => {
                    if (!onOpenTerms) return;
                    e.preventDefault();
                    onOpenTerms();
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Syarat &amp; Ketentuan
                </a>{' '}
                dan{' '}
                <a
                  href="/kebijakan-privasi"
                  onClick={(e) => {
                    if (!onOpenPrivacy) return;
                    e.preventDefault();
                    onOpenPrivacy();
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Kebijakan Privasi
                </a>{' '}
                BinaUsaha.
              </p>
            </form>

            {/* Pemisah */}
            <div className="my-4 relative flex items-center justify-center">
              <div className="border-t border-slate-300/80 w-full" />
              <span className="bg-white/80 backdrop-blur-md px-2.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold absolute rounded-full border border-slate-200/60 shadow-xs">
                {isRegister ? 'atau daftar dengan' : 'atau masuk dengan'}
              </span>
            </div>

            {/* Google (Supabase OAuth) */}
            <button
              type="button"
              id="btn-auth-google"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="auth-glass-input w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProvider === 'google' ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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

            {/* Kaki kartu */}
            <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Data usaha Anda terenkripsi aman
              </span>
              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent('Halo CS BinaUsaha, saya butuh bantuan proses pendaftaran akun.');
                  window.open(`https://wa.me/6285195979888?text=${msg}`, '_blank');
                }}
                className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <HelpCircle className="w-3 h-3" /> Butuh Bantuan?
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
