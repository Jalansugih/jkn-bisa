import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    businessName?: string | null;
    whatsapp?: string | null;
  } | null;
  onGoHome?: () => void;
  onNewOrder?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onGoHome, onNewOrder }) => {
  const displayName = user?.displayName || 'Mitra UMKM';

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="border-b bg-white shadow-xs">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Foto Profil */}
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-500/20">
                {initial}
              </div>
            )}

            {/* Informasi User */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● Akun Terverifikasi
                </span>
                {user?.businessName && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {user.businessName}
                  </span>
                )}
              </div>

              <h1 className="text-xl font-bold text-slate-900 mt-1">
                Halo, {displayName}
              </h1>

              <p className="text-xs text-slate-500">
                {user?.email || user?.whatsapp || 'Dashboard Pengelolaan Layanan UMKM'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Beranda</span>
              </button>
            )}
            {onNewOrder && (
              <button
                onClick={onNewOrder}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-blue-600/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pesan Layanan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
