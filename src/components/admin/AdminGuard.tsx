import React from 'react';
import { AuthUser } from '../../types';
import { checkIsAdmin } from '../../lib/authService';
import { ShieldAlert, Lock, ArrowLeft, LogIn, Sparkles, UserCheck } from 'lucide-react';

interface AdminGuardProps {
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onGoHome: () => void;
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  currentUser,
  onOpenLogin,
  onGoHome,
  children,
}) => {
  const isAdmin = checkIsAdmin(currentUser);

  // 1. If user is admin, allow rendering protected admin panel
  if (currentUser && isAdmin) {
    return <>{children}</>;
  }

  // 2. If user is NOT signed in at all
  if (!currentUser) {
    return (
      <div id="admin-guard-unauth" className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-3">
            Akses Panel Terbatas
          </span>

          <h2 className="text-2xl font-heading font-extrabold text-slate-900 mb-3">
            Otorisasi Admin Diperlukan
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Halaman ini khusus untuk manajemen operasional BinaUsaha. Silakan masuk menggunakan akun Google atau email Administrator Anda.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Email Terdaftar Admin:</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              databasemanb@gmail.com / admin@binausaha.id
            </p>
          </div>

          <div className="space-y-3">
            <button
              id="admin-guard-login-btn"
              onClick={onOpenLogin}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sebagai Admin</span>
            </button>

            <button
              id="admin-guard-back-btn"
              onClick={onGoHome}
              className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is signed in, but NOT an admin
  return (
    <div id="admin-guard-forbidden" className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-600 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block mb-3">
          403 Forbidden
        </span>

        <h2 className="text-2xl font-heading font-extrabold text-slate-900 mb-3">
          Hak Akses Ditolak
        </h2>

        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Akun Anda (<strong className="text-slate-800">{currentUser.email || currentUser.name}</strong>) terdaftar sebagai Pelanggan / Mitra, bukan Administrator.
        </p>

        <p className="text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
          Jika Anda adalah pemilik sistem, silakan hubungi tim IT atau login menggunakan akun email admin yang telah ditentukan (<span className="font-mono text-slate-700">databasemanb@gmail.com / admin@binausaha.id</span>).
        </p>

        <div className="space-y-3">
          <button
            id="admin-guard-switch-account-btn"
            onClick={onOpenLogin}
            className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Ganti Akun Admin</span>
          </button>

          <button
            id="admin-guard-return-home-btn"
            onClick={onGoHome}
            className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
