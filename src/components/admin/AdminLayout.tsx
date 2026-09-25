import React, { useState } from 'react';
import { AuthUser } from '../../types';
import { AdminTab } from '../../types/admin';
import {
  LayoutDashboard,
  ShoppingBag,
  FileSpreadsheet,
  Package,
  BookOpen,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onGoHome: () => void;
  ordersCount: number;
  rfqsCount: number;
  usersCount: number;
  productsCount?: number;
  articlesCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onGoHome,
  ordersCount,
  rfqsCount,
  usersCount,
  productsCount,
  articlesCount,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Ikhtisar & Statistik',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: 'Manajemen Pesanan',
      icon: ShoppingBag,
      badge: ordersCount > 0 ? ordersCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'rfq',
      label: 'Pengajuan Kebutuhan (RFQ)',
      icon: FileSpreadsheet,
      badge: rfqsCount > 0 ? rfqsCount : undefined,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'products',
      label: 'Katalog & Layanan',
      icon: Package,
      badge: productsCount !== undefined && productsCount > 0 ? productsCount : undefined,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'articles',
      label: 'Artikel & Edukasi',
      icon: BookOpen,
      badge: articlesCount !== undefined && articlesCount > 0 ? articlesCount : undefined,
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      id: 'users',
      label: 'Daftar Pengguna & Hak',
      icon: Users,
      badge: usersCount > 0 ? usersCount : undefined,
      badgeColor: 'bg-slate-700 text-white',
    },
  ];

  return (
    <div id="admin-layout-wrapper" className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
            BU
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>BinaUsaha</span>
              <span className="text-[10px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-400/30">
                Admin
              </span>
            </h1>
          </div>
        </div>

        <button
          id="admin-mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        id="admin-sidebar"
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-white text-lg shadow-md shadow-blue-500/20 border border-blue-400/30">
                BU
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Control Center</span>
                </span>
                <h2 className="font-heading font-black text-lg text-white tracking-tight">
                  BinaUsaha.id
                </h2>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-500/30 shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate font-mono">
                {currentUser?.email || 'admin@binausaha.id'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Modul Utama
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            id="admin-btn-back-web"
            onClick={onGoHome}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700/50 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website Utama</span>
          </button>

          <button
            id="admin-btn-logout"
            onClick={onLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 border border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi Admin</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Body Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Top Header Bar for Desktop */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
              BinaUsaha Portal
            </span>
            <h1 className="text-lg font-heading font-extrabold text-slate-900 capitalize hidden sm:block">
              {navItems.find((n) => n.id === currentTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Buka Toko</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
