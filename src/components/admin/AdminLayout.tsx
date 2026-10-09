import React, { useEffect, useRef, useState } from 'react';
import { AuthUser } from '../../types';
import { AdminTab } from '../../types/admin';
import {
  LayoutDashboard,
  ShoppingBag,
  FileSpreadsheet,
  Package,
  BookOpen,
  Users,
  Wallet,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export interface NavBadge {
  value: number;
  /** action = butuh tindakan admin (menyala), muted = sekadar jumlah data. */
  tone: 'action' | 'muted';
}

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onGoHome: () => void;
  badges: Partial<Record<AdminTab, NavBadge>>;
  /** Pencarian global + lonceng notifikasi, ditaruh di topbar. */
  headerExtras?: React.ReactNode;
  children: React.ReactNode;
}

type NavItem = {
  id: AdminTab;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Operasional',
    items: [
      {
        id: 'overview',
        label: 'Ikhtisar & Statistik',
        subtitle: 'Ringkasan performa dan hal yang perlu ditindaklanjuti hari ini',
        icon: LayoutDashboard,
      },
      {
        id: 'orders',
        label: 'Manajemen Pesanan',
        subtitle: 'Verifikasi pembayaran, perbarui progres, dan kabari klien',
        icon: ShoppingBag,
      },
      {
        id: 'rfq',
        label: 'Pengajuan RFQ',
        subtitle: 'Tindak lanjuti calon klien yang meminta penawaran',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    title: 'Konten & Data',
    items: [
      {
        id: 'products',
        label: 'Katalog & Layanan',
        subtitle: 'Paket, harga, dan komisi. Perubahan langsung tampil di website',
        icon: Package,
      },
      {
        id: 'articles',
        label: 'Artikel & Edukasi',
        subtitle: 'Tulis, jadwalkan, dan terbitkan artikel untuk pusat edukasi',
        icon: BookOpen,
      },
      {
        id: 'users',
        label: 'Pengguna & Akses',
        subtitle: 'Akun terdaftar, riwayat pesanan, dan peran administrator',
        icon: Users,
      },
    ],
  },
  {
    title: 'Keuangan',
    items: [
      {
        id: 'commissions',
        label: 'Komisi Referral',
        subtitle: 'Setujui komisi, proses pencairan, dan atur tarif',
        icon: Wallet,
      },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onGoHome,
  badges,
  headerExtras,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const current = ALL_ITEMS.find((n) => n.id === currentTab) || ALL_ITEMS[0];

  // Pindah menu = kembali ke atas. (Area isi punya scroll sendiri, jadi window.scrollTo tidak berpengaruh.)
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [currentTab]);

  // Esc menutup drawer di ponsel
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const initial = (currentUser?.name || 'A').charAt(0).toUpperCase();

  return (
    <div id="admin-layout-wrapper" className="h-screen overflow-hidden bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        aria-label="Navigasi admin"
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center shadow-sm shrink-0 bg-white border border-slate-700/20">
              <img
      src="/logo-rk-bendahara.png"
      alt="BinaUsaha logo"
      className="w-full h-full object-contain"
    />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-white text-lg tracking-tight leading-tight">
                BinaUsaha<span className="text-blue-500">.id</span>
              </h1>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                Control Center
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-3.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const badge = badges[item.id];
                return (
                  <button
                    key={item.id}
                    id={`admin-nav-${item.id}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {badge && badge.value > 0 && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : badge.tone === 'action'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                        title={badge.tone === 'action' ? 'Perlu tindakan' : 'Jumlah data'}
                      >
                        {badge.value > 99 ? '99+' : badge.value}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            id="admin-btn-back-web"
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website Utama</span>
          </button>
          <button
            id="admin-btn-logout"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Konten */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              id="admin-mobile-toggle-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-slate-900 tracking-tight truncate">
                {current.label}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block truncate">{current.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {headerExtras}
            <div className="hidden sm:flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 bg-slate-100/80 border border-slate-200/80 rounded-2xl">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-xl object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {initial}
                </div>
              )}
              <div className="min-w-0 max-w-[140px]">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 truncate">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
