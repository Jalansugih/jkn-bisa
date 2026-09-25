import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  FilePlus,
  Menu,
  X,
  Layers,
  Package,
  Briefcase,
  BookOpen,
  Info,
  Laptop,
  FileCheck,
  HardHat,
  Sprout,
  Code,
  Shield,
  Wrench,
  TreePine,
  Lightbulb,
  Cpu,
  DollarSign,
  Rocket,
  Building,
  Building2,
  Users,
  Phone,
  HelpCircle,
  ShoppingBag,
  ArrowRight,
  MessageSquare,
  UserPlus,
  User,
  LogOut,
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { AuthUser } from '../../types';
import { checkIsAdmin } from '../../lib/authService';
import { li } from 'motion/react-client';

interface NavbarProps {
  onOpenRfqModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenOrderTracker: () => void;
  onOpenMyOrders: () => void;
  onOpenCareerModal: () => void;
  onSelectNeedCategory: (cat: string) => void;
  onFilterProductsCategory: (cat: string) => void;
  orderCount: number;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenDashboard?: () => void;
  onOpenAdmin?: () => void;
  onOpenArticlesHub?: (category?: string) => void;
  onOpenArticle?: (artKey: string) => void;
  onGoHome?: () => void;
  onOpenServicePage?: (
    serviceKey: 'digital' | 'legalitas' | 'konstruksi' | 'agro',
    targetTab?: string,
    scrollTarget?: string
  ) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRfqModal,
  onOpenRegisterModal,
  onOpenOrderTracker,
  onOpenMyOrders,
  onOpenCareerModal,
  onSelectNeedCategory,
  onFilterProductsCategory,
  orderCount,
  currentUser,
  onLogout,
  onOpenDashboard,
  onOpenAdmin,
  onOpenArticlesHub,
  onOpenArticle,
  onGoHome,
  onOpenServicePage,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile submenu accordion states
  const [mobKebutuhanOpen, setMobKebutuhanOpen] = useState(false);
  const [mobProdukOpen, setMobProdukOpen] = useState(false);
  const [mobJasaOpen, setMobJasaOpen] = useState(false);
  const [mobArtikelOpen, setMobArtikelOpen] = useState(false);
  const [mobTentangOpen, setMobTentangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNeedClick = (category: string) => {
    onSelectNeedCategory(category);
    closeMobileMenu();
  };

  const handleProductFilterClick = (cat: string) => {
    onFilterProductsCategory(cat);
    closeMobileMenu();
  };

  return (
    <>
      <nav
        id="navbar"
        className={`sticky top-0 z-[80] transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200 ${
          isScrolled ? 'shadow-md shadow-blue-900/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                if (onGoHome) {
                  e.preventDefault();
                  onGoHome();
                }
              }}
              className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer"
            >
             <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-md shadow-blue-500/20 bg-white border border-slate-200">
    <img
      src="/logo-rk-bendahara.png"
      alt="BinaUsaha.id logo"
      className="w-full h-full object-contain"
    />
  </div>

  <div>
    <span className="text-xl font-bold tracking-tight text-slate-900">
      BinaUsaha<span className="text-blue-600">.id</span>
    </span>
    <span className="text-[10px] block text-slate-500 -mt-1 font-semibold tracking-wider uppercase">
      Solusi Usaha Anda
    </span>
  </div>
    </div>
            </a>

            {/* Desktop Menu (Mega Menu & Dropdowns) */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {/* Kebutuhan Usaha (Mega Menu) */}
              <div className="relative group">
                <button
                  id="nav-btn-kebutuhan"
                  className="flex items-center gap-1.5 text-slate-700 group-hover:text-blue-600 transition font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-blue-50/70 focus:outline-none cursor-pointer"
                >
                  <span>Kebutuhan Usaha</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                {/* Mega Menu Panel */}
                <div className="mega-menu-panel absolute left-0 lg:left-[-60px] top-full pt-2 w-[880px] max-w-[90vw]">
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-5">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          Berdasarkan Tujuan & Fase Bisnis
                        </span>
                        <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">
                          Solusi Sesuai Kebutuhan Anda
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500">Pilih kategori sesuai masalah usaha Anda</span>
                    </div>

                    {/* 6 Categories Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* 01. Memulai Usaha */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition duration-200 group/card">
                        <a
                          href="#kebutuhan"
                          onClick={() => handleNeedClick('memulai-usaha')}
                          className="font-bold text-xs text-slate-800 group-hover/card:text-blue-600 flex items-center gap-1.5 mb-2"
                        >
                          <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[11px] font-extrabold flex items-center justify-center border border-blue-200">
                            01
                          </span>
                          <span>Memulai Usaha</span>
                        </a>
                        <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Legalitas</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Perlengkapan</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Teknologi</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Branding</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Operasional</span>
                        </div>
                      </div>

                      {/* 02. Digitalisasi Usaha */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition duration-200 group/card">
                        <a
                          href="#kebutuhan"
                          onClick={() => handleNeedClick('digitalisasi')}
                          className="font-bold text-xs text-slate-800 group-hover/card:text-blue-600 flex items-center gap-1.5 mb-2"
                        >
                          <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[11px] font-extrabold flex items-center justify-center border border-blue-200">
                            02
                          </span>
                          <span>Digitalisasi Usaha</span>
                        </a>
                        <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Website</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Custom App</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">POS Kasir</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Internet</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">CCTV</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Komputer & IT</span>
                        </div>
                      </div>

                      {/* 03. Membangun / Renovasi */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition duration-200 group/card">
                        <a
                          href="#kebutuhan"
                          onClick={() => handleNeedClick('renovasi')}
                          className="font-bold text-xs text-slate-800 group-hover/card:text-amber-600 flex items-center gap-1.5 mb-2"
                        >
                          <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 text-[11px] font-extrabold flex items-center justify-center border border-amber-200">
                            03
                          </span>
                          <span>Membangun / Renovasi</span>
                        </a>
                        <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Bahan Bangunan</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Konstruksi</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Furniture</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Instalasi</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Proyek</span>
                        </div>
                      </div>

                      {/* 04. Kebutuhan Kantor & Institusi */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition duration-200 group/card">
                        <a
                          href="#kebutuhan"
                          onClick={() => handleNeedClick('kantor')}
                          className="font-bold text-xs text-slate-800 group-hover/card:text-emerald-600 flex items-center gap-1.5 mb-2"
                        >
                          <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-extrabold flex items-center justify-center border border-emerald-200">
                            04
                          </span>
                          <span>Kebutuhan Kantor & Institusi</span>
                        </a>
                        <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Komputer</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Furniture</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">ATK</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Internet</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">CCTV</span>
                        </div>
                      </div>

                      {/* 05. Pertanian & Perkebunan */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50/40 transition duration-200 group/card">
                        <a
                          href="#kebutuhan"
                          onClick={() => handleNeedClick('pertanian')}
                          className="font-bold text-xs text-slate-800 group-hover/card:text-green-600 flex items-center gap-1.5 mb-2"
                        >
                          <span className="w-5 h-5 rounded-md bg-green-100 text-green-700 text-[11px] font-extrabold flex items-center justify-center border border-green-200">
                            05
                          </span>
                          <span>Pertanian & Perkebunan</span>
                        </a>
                        <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Bibit</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Pupuk</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Alat Tani</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Irigasi</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Landscape</span>
                        </div>
                      </div>

                      {/* 06. Kebutuhan Proyek */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition duration-200 group/card">
                        <a
                          href="#kebutuhan"
                          onClick={() => handleNeedClick('proyek')}
                          className="font-bold text-xs text-slate-800 group-hover/card:text-purple-600 flex items-center gap-1.5 mb-2"
                        >
                          <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-extrabold flex items-center justify-center border border-purple-200">
                            06
                          </span>
                          <span>Kebutuhan Proyek</span>
                        </a>
                        <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Material</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Peralatan</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Teknologi</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Jasa</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Pengadaan</span>
                        </div>
                      </div>
                    </div>

                    {/* Mega Menu Bottom Bar */}
                    <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between">
                      <p className="text-xs font-semibold text-blue-900">Belum menemukan kebutuhan Anda?</p>
                      <button
                        onClick={onOpenRfqModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition duration-200 shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>Ajukan Kebutuhan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Produk (Mega Menu) */}
              <div className="relative group">
                <button
                  id="nav-btn-produk"
                  className="flex items-center gap-1.5 text-slate-700 group-hover:text-blue-600 transition font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-blue-50/70 focus:outline-none cursor-pointer"
                >
                  <span>Produk</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="mega-menu-panel absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[840px] max-w-[92vw]">
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          Katalog Barang Terverifikasi
                        </span>
                        <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">
                          Kategori Produk Usaha Mitra
                        </h4>
                      </div>
                      <a
                        href="#produk"
                        onClick={() => handleProductFilterClick('all')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>Lihat Semua Produk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                      {/* Digital & Teknologi */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                          <Laptop className="w-4 h-4 text-blue-600" />
                          <span>Digital & Teknologi</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600">
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('website')}
                              className="hover:text-blue-600 transition block py-1"
                            >
                              Website & Toko Online
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('pos')}
                              className="hover:text-blue-600 transition block py-1"
                            >
                              Software Kasir POS
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('pos')}
                              className="hover:text-blue-600 transition block py-1"
                            >
                              Hardware Printer & Cash Drawer
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('website')}
                              className="hover:text-blue-600 transition block py-1"
                            >
                              Domain, Hosting & Socmed Ads
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Legalitas & Administrasi */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <span>Legalitas & Administrasi</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600">
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('legalitas')}
                              className="hover:text-emerald-600 transition block py-1 font-medium"
                            >
                              Pendirian PT Pro (Free App Keuangan)
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('legalitas')}
                              className="hover:text-emerald-600 transition block py-1"
                            >
                              Pendirian CV Pro
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('legalitas')}
                              className="hover:text-emerald-600 transition block py-1"
                            >
                              Pengurusan NIB & Izin Usaha
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('legalitas')}
                              className="hover:text-emerald-600 transition block py-1"
                            >
                              Pendaftaran Merek DJKI (HAKI)
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Bundling & Paket Hemat */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                          <Layers className="w-4 h-4 text-amber-600" />
                          <span>Paket Bundling</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600">
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('bundling')}
                              className="hover:text-blue-600 transition block py-1 font-bold text-blue-600"
                            >
                              Paket Akselerasi All-In-One
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('website')}
                              className="hover:text-amber-600 transition block py-1"
                            >
                              Branding & Social Media Kit
                            </a>
                          </li>
                          <li>
                            <a
                              href="#produk"
                              onClick={() => handleProductFilterClick('website')}
                              className="hover:text-amber-600 transition block py-1"
                            >
                              Landing Page Kilat Express
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jasa & Solusi (Mega Menu) */}
              <div className="relative group">
                <button
                  id="nav-btn-jasa"
                  className="flex items-center gap-1.5 text-slate-700 group-hover:text-blue-600 transition font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-blue-50/70 focus:outline-none cursor-pointer"
                >
                  <span>Jasa & Solusi</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="mega-menu-panel absolute right-0 lg:right-[-140px] top-full pt-2 w-[840px] max-w-[90vw]">
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          Layanan Mitra Profesional
                        </span>
                        <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">
                          Jasa & Solusi Terpadu
                        </h4>
                      </div>
                      <button
                        onClick={onOpenRfqModal}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Konsultasikan Kebutuhan</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Digital & Teknologi */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100/60 hover:bg-blue-50/70 transition space-y-2">
                        <button
                          onClick={() => onOpenServicePage?.('digital')}
                          className="flex items-center justify-between text-xs font-black text-blue-900 uppercase tracking-wider hover:text-blue-600 cursor-pointer w-full text-left pb-2 border-b border-blue-200/60 group/col"
                        >
                          <div className="flex items-center gap-1.5">
                            <Code className="w-4 h-4 text-blue-600" />
                            <span>Digital & IT</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover/col:translate-x-1 transition-transform" />
                        </button>
                        <div className="space-y-1">
                          <button
                            onClick={() => onOpenServicePage?.('digital', 'website')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-blue-600">Website & Landing Page</p>
                            <p className="text-[10px] text-slate-400">Company profile & toko online</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('digital', 'pos')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-blue-600">Kasir POS & Hardware</p>
                            <p className="text-[10px] text-slate-400">Scanner, printer & software kasir</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('digital', 'custom-app')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-blue-600">Custom Web App & Sistem</p>
                            <p className="text-[10px] text-slate-400">Database kustom & otomasi</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('digital', 'infrastructure')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-blue-600">Jaringan LAN & CCTV</p>
                            <p className="text-[10px] text-slate-400">Wi-Fi kantor & kamera HD</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('digital', 'website', 'estimator')}
                            className="w-full text-left p-1.5 rounded-lg bg-blue-100/60 hover:bg-blue-100 text-blue-900 transition flex items-center justify-between mt-1 cursor-pointer font-bold"
                          >
                            <span className="text-[11px]">Kalkulator Biaya Digital</span>
                            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Hitung</span>
                          </button>
                        </div>
                      </div>

                      {/* Legalitas */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 hover:bg-emerald-50/70 transition space-y-2">
                        <button
                          onClick={() => onOpenServicePage?.('legalitas')}
                          className="flex items-center justify-between text-xs font-black text-emerald-900 uppercase tracking-wider hover:text-emerald-600 cursor-pointer w-full text-left pb-2 border-b border-emerald-200/60 group/col"
                        >
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span>Legalitas</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover/col:translate-x-1 transition-transform" />
                        </button>
                        <div className="space-y-1">
                          <button
                            onClick={() => onOpenServicePage?.('legalitas', 'pt')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-emerald-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-emerald-600">Pendirian PT & PT Perorangan</p>
                            <p className="text-[10px] text-slate-400">Akta Notaris & SK Menkumham</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('legalitas', 'cv')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-emerald-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-emerald-600">Pendirian CV & Yayasan</p>
                            <p className="text-[10px] text-slate-400">Legalitas rekanan & non-profit</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('legalitas', 'nib')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-emerald-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-emerald-600">NIB OSS RBA & Izin Edar</p>
                            <p className="text-[10px] text-slate-400">KBLI 2020 & izin berusaha</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('legalitas', 'halal-merek')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-emerald-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-emerald-600">Halal BPJPH & Hak Merek</p>
                            <p className="text-[10px] text-slate-400">DJKI Kemenkumham & sertifikasi</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('legalitas', 'pt', 'legal-checker')}
                            className="w-full text-left p-1.5 rounded-lg bg-emerald-100/60 hover:bg-emerald-100 text-emerald-900 transition flex items-center justify-between mt-1 cursor-pointer font-bold"
                          >
                            <span className="text-[11px]">Cek Dokumen & Promo PT</span>
                            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Cek</span>
                          </button>
                        </div>
                      </div>

                      {/* Konstruksi */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/60 hover:bg-amber-50/70 transition space-y-2">
                        <button
                          onClick={() => onOpenServicePage?.('konstruksi')}
                          className="flex items-center justify-between text-xs font-black text-amber-900 uppercase tracking-wider hover:text-amber-600 cursor-pointer w-full text-left pb-2 border-b border-amber-200/60 group/col"
                        >
                          <div className="flex items-center gap-1.5">
                            <Wrench className="w-4 h-4 text-amber-600" />
                            <span>Konstruksi</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover/col:translate-x-1 transition-transform" />
                        </button>
                        <div className="space-y-1">
                          <button
                            onClick={() => onOpenServicePage?.('konstruksi', 'renovasi')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-amber-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-amber-600">Renovasi Ruko & Kafe</p>
                            <p className="text-[10px] text-slate-400">Fit-out komersial & resto</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('konstruksi', 'interior')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-amber-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-amber-600">Interior & Custom Furniture</p>
                            <p className="text-[10px] text-slate-400">Kitchen set, meja kasir & partisi</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('konstruksi', 'sipil')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-amber-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-amber-600">Pekerjaan Sipil & MEP</p>
                            <p className="text-[10px] text-slate-400">Pondasi, atap & kelistrikan</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('konstruksi', 'material')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-amber-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-amber-600">Pengadaan Material SNI</p>
                            <p className="text-[10px] text-slate-400">Baja ringan, semen & keramik</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('konstruksi', 'renovasi', 'rab-estimator')}
                            className="w-full text-left p-1.5 rounded-lg bg-amber-100/60 hover:bg-amber-100 text-amber-900 transition flex items-center justify-between mt-1 cursor-pointer font-bold"
                          >
                            <span className="text-[11px]">Simulasi Kalkulator RAB</span>
                            <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded">RAB</span>
                          </button>
                        </div>
                      </div>

                      {/* Agro */}
                      <div className="p-3.5 rounded-2xl bg-green-50/40 border border-green-100/60 hover:bg-green-50/70 transition space-y-2">
                        <button
                          onClick={() => onOpenServicePage?.('agro')}
                          className="flex items-center justify-between text-xs font-black text-green-900 uppercase tracking-wider hover:text-green-600 cursor-pointer w-full text-left pb-2 border-b border-green-200/60 group/col"
                        >
                          <div className="flex items-center gap-1.5">
                            <TreePine className="w-4 h-4 text-green-600" />
                            <span>Agro & Green</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-green-500 group-hover/col:translate-x-1 transition-transform" />
                        </button>
                        <div className="space-y-1">
                          <button
                            onClick={() => onOpenServicePage?.('agro', 'greenhouse')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-green-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-green-600">Smart Greenhouse IoT</p>
                            <p className="text-[10px] text-slate-400">Kontrol iklim & irigasi otomatis</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('agro', 'landscape')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-green-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-green-600">Landscape & Green Wall</p>
                            <p className="text-[10px] text-slate-400">Taman kantor & tanaman hias</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('agro', 'saprotan')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-green-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-green-600">Nutrisi AB Mix & Benih F1</p>
                            <p className="text-[10px] text-slate-400">Pupuk organik & bibit unggul</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('agro', 'green-energy')}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-green-600 transition group/item cursor-pointer"
                          >
                            <p className="text-xs font-bold leading-tight group-hover/item:text-green-600">Panel Surya PLTS & Biogas</p>
                            <p className="text-[10px] text-slate-400">Energi bersih & kelola limbah</p>
                          </button>
                          <button
                            onClick={() => onOpenServicePage?.('agro', 'greenhouse', 'agro-estimator')}
                            className="w-full text-left p-1.5 rounded-lg bg-green-100/60 hover:bg-green-100 text-green-900 transition flex items-center justify-between mt-1 cursor-pointer font-bold"
                          >
                            <span className="text-[11px]">Kalkulator Biaya Agro</span>
                            <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded">Simulasi</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artikel (Dropdown) */}
              <div className="relative group">
                <button
                  id="nav-btn-artikel"
                  onClick={() => {
                    if (onOpenArticlesHub) onOpenArticlesHub('all');
                  }}
                  className="flex items-center gap-1.5 text-slate-700 group-hover:text-blue-600 transition font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-blue-50/70 focus:outline-none cursor-pointer"
                >
                  <span>Artikel</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="mega-menu-panel absolute left-0 top-full pt-2 w-[480px]">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Pusat Edukasi & Panduan UMKM
                      </span>
                      <button
                        onClick={() => {
                          if (onOpenArticlesHub) onOpenArticlesHub('all');
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
                      >
                        Semua Artikel &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Left: Kategori Utama */}
                      <div className="space-y-1">
                        <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase">
                          Kategori Topik
                        </div>
                        <button
                          onClick={() => {
                            if (onOpenArticlesHub) onOpenArticlesHub('operasional');
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">Tips Usaha & SOP</div>
                            <div className="text-[10px] text-slate-500 font-normal">Manajemen & tim</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenArticlesHub) onOpenArticlesHub('digital');
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Cpu className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">Digital & Website</div>
                            <div className="text-[10px] text-slate-500 font-normal">Toko online & POS</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenArticlesHub) onOpenArticlesHub('legalitas');
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <FileCheck className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">Legalitas & Izin</div>
                            <div className="text-[10px] text-slate-500 font-normal">NIB, PT & Halal</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenArticlesHub) onOpenArticlesHub('keuangan');
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">Keuangan & Arus Kas</div>
                            <div className="text-[10px] text-slate-500 font-normal">Pisah uang usaha</div>
                          </div>
                        </button>
                      </div>

                      {/* Right: Panduan Populer Pilihan */}
                      <div className="space-y-1 border-l border-slate-100 pl-2">
                        <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase">
                          Panduan Pilihan
                        </div>
                        <button
                          onClick={() => {
                            if (onOpenArticle) onOpenArticle('art_6');
                            else if (onOpenArticlesHub) onOpenArticlesHub('operasional');
                          }}
                          className="w-full text-left block p-2 rounded-lg hover:bg-blue-50 transition cursor-pointer group/art"
                        >
                          <div className="text-[11px] font-bold text-slate-800 group-hover/art:text-blue-600 line-clamp-1">
                            SOP Toko Ritel & Delegasi Tim
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            Tips usaha delegasi & stok opname
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenArticle) onOpenArticle('art_1');
                            else if (onOpenArticlesHub) onOpenArticlesHub('legalitas');
                          }}
                          className="w-full text-left block p-2 rounded-lg hover:bg-blue-50 transition cursor-pointer group/art"
                        >
                          <div className="text-[11px] font-bold text-slate-800 group-hover/art:text-blue-600 line-clamp-1">
                            Panduan Lengkap NIB OSS 2026
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            Syarat dan alur daftar OSS RBA
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenArticle) onOpenArticle('art_3');
                            else if (onOpenArticlesHub) onOpenArticlesHub('keuangan');
                          }}
                          className="w-full text-left block p-2 rounded-lg hover:bg-blue-50 transition cursor-pointer group/art"
                        >
                          <div className="text-[11px] font-bold text-slate-800 group-hover/art:text-blue-600 line-clamp-1">
                            Cara Memisahkan Uang Usaha
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            Disiplin arus kas & gaji pemilik
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenArticlesHub) onOpenArticlesHub('skala-usaha');
                          }}
                          className="w-full text-left flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                          <span>Scale Up & Buka Cabang &rarr;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tentang (Dropdown) */}
              <div className="relative group">
                <button
                  id="nav-btn-tentang"
                  className="flex items-center gap-1.5 text-slate-700 group-hover:text-blue-600 transition font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-blue-50/70 focus:outline-none cursor-pointer"
                >
                  <span>Tentang</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="mega-menu-panel absolute right-0 top-full pt-2 w-56">
                  <div className="bg-white rounded-2xl p-3 shadow-xl border border-slate-200 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Tentang BinaUsaha
                    </div>
                    <a
                      href="#beranda"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Building className="w-3.5 h-3.5 text-blue-600" /> Tentang Kami
                    </a>
                    <a
                      href="#testimoni"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600" /> Klien & Testimoni
                    </a>
                    <button
                      onClick={onOpenCareerModal}
                      className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Karier
                    </button>
                    <a
                      href="#kontak"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" /> Hubungi Kami
                    </a>
                    <a
                      href="#faq"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> FAQ
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* My Orders Cart Badge Button */}
              <button
                id="btn-nav-my-orders"
                onClick={onOpenMyOrders}
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer shadow-xs"
                title="Pesanan Saya"
              >
                <ShoppingBag className="w-5 h-5" />
                {orderCount > 0 && (
                  <span
                    id="navCartBadge"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-xs"
                  >
                    {orderCount}
                  </span>
                )}
              </button>

              {/* Order Tracker Button */}
              <button
                id="btn-nav-track-order"
                onClick={onOpenOrderTracker}
                className="px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
              >
                Cek Pesanan
              </button>

              {/* Primary Register Action Button / User Profile */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    id="btn-nav-dashboard"
                    onClick={onOpenDashboard}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition duration-200 shadow-sm shadow-blue-600/20 cursor-pointer"
                    title="Buka Dashboard"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>

                  <div className="relative group">
                    <button
                      id="btn-nav-user-profile"
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-extrabold uppercase shadow-xs">
                        {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                      </div>
                      <span className="max-w-[110px] truncate">{currentUser.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    <div className="mega-menu-panel absolute right-0 top-full pt-2 w-52">
                      <div className="bg-white rounded-2xl p-2.5 shadow-xl border border-slate-200 space-y-1">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{currentUser.email || currentUser.whatsapp}</p>
                          {currentUser.businessName && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700">
                              {currentUser.businessName}
                            </span>
                          )}
                        </div>
                        {checkIsAdmin(currentUser) && onOpenAdmin && (
                          <button
                            id="btn-nav-admin-panel"
                            onClick={onOpenAdmin}
                            className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition cursor-pointer border border-amber-200"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>Panel Admin</span>
                          </button>
                        )}
                        <button
                          onClick={onOpenDashboard}
                          className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" /> Dashboard Saya
                        </button>
                        <button
                          onClick={onOpenMyOrders}
                          className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-blue-600" /> Pesanan Saya
                        </button>
                        {onLogout && (
                          <button
                            onClick={onLogout}
                            className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Keluar Akun
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  id="btn-nav-register"
                  onClick={onOpenRegisterModal}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition duration-300 shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button & Cart */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                id="btn-mobile-my-orders"
                onClick={onOpenMyOrders}
                className="relative p-2 text-slate-700 hover:text-blue-600 transition"
                title="Pesanan Saya"
              >
                <ShoppingBag className="w-6 h-6" />
                {orderCount > 0 && (
                  <span
                    id="navCartBadgeMobile"
                    className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center"
                  >
                    {orderCount}
                  </span>
                )}
              </button>
              <button
                id="openMobileMenuBtn"
                onClick={() => setMobileMenuOpen(true)}
                className="text-slate-700 hover:text-blue-600 transition-colors focus:outline-none p-2 rounded-lg cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay & Accordion Sheet */}
      <div
        id="mobileMenu"
        className={`fixed inset-0 z-[100] lg:hidden flex flex-col justify-end transition-all ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          id="mobileMenuBackdrop"
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Bottom Sheet */}
        <div
          id="mobileMenuSheet"
          className={`relative w-full bg-white border-t border-slate-200 rounded-t-3xl transition-transform duration-300 ease-out shadow-2xl flex flex-col max-h-[88vh] text-slate-800 ${
            mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex justify-between items-center p-5 border-b border-slate-100 relative">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full absolute top-3 left-1/2 -translate-x-1/2"></div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-heading font-bold text-sm">
                B
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Menu Navigasi BinaUsaha</h3>
            </div>
            <button
              id="closeMobileMenu"
              onClick={closeMobileMenu}
              className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 px-5">
            <div className="space-y-2 py-2">
              {/* Accordion 1: Kebutuhan Usaha */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => setMobKebutuhanOpen(!mobKebutuhanOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-blue-600" /> Kebutuhan Usaha
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobKebutuhanOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobKebutuhanOpen && (
                  <div className="pl-8 pr-2 py-1.5 space-y-1.5 text-xs">
                    <a
                      href="#kebutuhan"
                      onClick={() => handleNeedClick('memulai-usaha')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      01. Memulai Usaha
                    </a>
                    <a
                      href="#kebutuhan"
                      onClick={() => handleNeedClick('digitalisasi')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      02. Digitalisasi Usaha
                    </a>
                    <a
                      href="#kebutuhan"
                      onClick={() => handleNeedClick('renovasi')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      03. Membangun / Renovasi
                    </a>
                    <a
                      href="#kebutuhan"
                      onClick={() => handleNeedClick('kantor')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      04. Kebutuhan Kantor & Institusi
                    </a>
                    <a
                      href="#kebutuhan"
                      onClick={() => handleNeedClick('pertanian')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      05. Pertanian & Perkebunan
                    </a>
                    <a
                      href="#kebutuhan"
                      onClick={() => handleNeedClick('proyek')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      06. Kebutuhan Proyek
                    </a>
                  </div>
                )}
              </div>

              {/* Accordion 2: Produk */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => setMobProdukOpen(!mobProdukOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-blue-600" /> Produk & Paket
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobProdukOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobProdukOpen && (
                  <div className="pl-8 pr-2 py-1.5 space-y-1.5 text-xs">
                    <a
                      href="#produk"
                      onClick={() => handleProductFilterClick('website')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Website & E-Commerce
                    </a>
                    <a
                      href="#produk"
                      onClick={() => handleProductFilterClick('pos')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Sistem Kasir POS & Hardware
                    </a>
                    <a
                      href="#produk"
                      onClick={() => handleProductFilterClick('legalitas')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Legalitas PT, CV, NIB, Halal & Merek
                    </a>
                    <a
                      href="#produk"
                      onClick={() => handleProductFilterClick('bundling')}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Paket Bundling Akselerasi
                    </a>
                  </div>
                )}
              </div>

              {/* Accordion 3: Jasa & Solusi */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => setMobJasaOpen(!mobJasaOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Jasa & Solusi
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobJasaOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobJasaOpen && (
                  <div className="pl-6 pr-2 py-2 space-y-3 text-xs">
                    {/* Digital */}
                    <div className="bg-blue-50/60 rounded-xl p-2.5 space-y-1.5 border border-blue-100/80">
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          onOpenServicePage?.('digital');
                        }}
                        className="w-full text-left font-black text-blue-900 flex items-center justify-between py-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-blue-600" /> Digital & IT
                        </span>
                        <ArrowRight className="w-3 h-3 text-blue-500" />
                      </button>
                      <div className="pl-4 space-y-1 border-l-2 border-blue-200">
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('digital', 'website');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-blue-600"
                        >
                          Website & Toko Online
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('digital', 'pos');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-blue-600"
                        >
                          Kasir POS & Hardware
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('digital', 'custom-app');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-blue-600"
                        >
                          Custom Web App & Sistem
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('digital', 'website', 'estimator');
                          }}
                          className="block w-full text-left py-0.5 text-blue-700 font-bold"
                        >
                          ⚡ Kalkulator Biaya Digital
                        </button>
                      </div>
                    </div>

                    {/* Legalitas */}
                    <div className="bg-emerald-50/60 rounded-xl p-2.5 space-y-1.5 border border-emerald-100/80">
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          onOpenServicePage?.('legalitas');
                        }}
                        className="w-full text-left font-black text-emerald-900 flex items-center justify-between py-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-600" /> Legalitas & Izin
                        </span>
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                      </button>
                      <div className="pl-4 space-y-1 border-l-2 border-emerald-200">
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('legalitas', 'pt');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-emerald-600"
                        >
                          Pendirian PT & PT Perorangan
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('legalitas', 'cv');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-emerald-600"
                        >
                          Pendirian CV & Yayasan
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('legalitas', 'nib');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-emerald-600"
                        >
                          NIB OSS RBA & Izin Edar
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('legalitas', 'pt', 'legal-checker');
                          }}
                          className="block w-full text-left py-0.5 text-emerald-700 font-bold"
                        >
                          ⚡ Cek Dokumen & Promo PT
                        </button>
                      </div>
                    </div>

                    {/* Konstruksi */}
                    <div className="bg-amber-50/60 rounded-xl p-2.5 space-y-1.5 border border-amber-100/80">
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          onOpenServicePage?.('konstruksi');
                        }}
                        className="w-full text-left font-black text-amber-900 flex items-center justify-between py-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" /> Konstruksi & Material
                        </span>
                        <ArrowRight className="w-3 h-3 text-amber-500" />
                      </button>
                      <div className="pl-4 space-y-1 border-l-2 border-amber-200">
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('konstruksi', 'renovasi');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-amber-600"
                        >
                          Renovasi Ruko & Kafe
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('konstruksi', 'interior');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-amber-600"
                        >
                          Interior & Custom Furniture
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('konstruksi', 'material');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-amber-600"
                        >
                          Pengadaan Material SNI
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('konstruksi', 'renovasi', 'rab-estimator');
                          }}
                          className="block w-full text-left py-0.5 text-amber-700 font-bold"
                        >
                          ⚡ Simulasi Kalkulator RAB
                        </button>
                      </div>
                    </div>

                    {/* Agro */}
                    <div className="bg-green-50/60 rounded-xl p-2.5 space-y-1.5 border border-green-100/80">
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          onOpenServicePage?.('agro');
                        }}
                        className="w-full text-left font-black text-green-900 flex items-center justify-between py-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <TreePine className="w-3.5 h-3.5 text-green-600" /> Agro & Green Industri
                        </span>
                        <ArrowRight className="w-3 h-3 text-green-500" />
                      </button>
                      <div className="pl-4 space-y-1 border-l-2 border-green-200">
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('agro', 'greenhouse');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-green-600"
                        >
                          Smart Greenhouse & IoT
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('agro', 'landscape');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-green-600"
                        >
                          Landscape & Taman Hijau
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('agro', 'saprotan');
                          }}
                          className="block w-full text-left py-0.5 text-slate-600 hover:text-green-600"
                        >
                          Nutrisi AB Mix & Saprotan
                        </button>
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            onOpenServicePage?.('agro', 'greenhouse', 'agro-estimator');
                          }}
                          className="block w-full text-left py-0.5 text-green-700 font-bold"
                        >
                          ⚡ Kalkulator Biaya Lahan Agro
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Artikel */}
              <div className="border-b border-slate-100 pb-1">
                <button
                  onClick={() => setMobArtikelOpen(!mobArtikelOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Artikel & Panduan
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobArtikelOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobArtikelOpen && (
                  <div className="pl-8 pr-2 py-1.5 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        if (onOpenArticlesHub) onOpenArticlesHub('operasional');
                      }}
                      className="w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Tips Usaha & Manajemen
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        if (onOpenArticlesHub) onOpenArticlesHub('digital');
                      }}
                      className="w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-blue-600" /> Digitalisasi & Website
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        if (onOpenArticlesHub) onOpenArticlesHub('legalitas');
                      }}
                      className="w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Legalitas & Perizinan NIB
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        if (onOpenArticlesHub) onOpenArticlesHub('keuangan');
                      }}
                      className="w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Keuangan & Arus Kas
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        if (onOpenArticlesHub) onOpenArticlesHub('pemasaran');
                      }}
                      className="w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                    >
                      <Rocket className="w-3.5 h-3.5 text-purple-600" /> Pemasaran & Strategi Ads
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        if (onOpenArticlesHub) onOpenArticlesHub('skala-usaha');
                      }}
                      className="w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Scale Up & Buka Cabang
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        if (onOpenArticlesHub) onOpenArticlesHub('all');
                      }}
                      className="w-full text-left block py-2 px-2.5 rounded-lg text-blue-600 font-bold hover:bg-blue-50 cursor-pointer border-t border-slate-100 mt-1"
                    >
                      Lihat Semua Artikel Edukasi &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 5: Tentang */}
              <div className="pb-1">
                <button
                  onClick={() => setMobTentangOpen(!mobTentangOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-blue-600" /> Tentang
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobTentangOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobTentangOpen && (
                  <div className="pl-8 pr-2 py-1.5 space-y-1.5 text-xs">
                    <a
                      href="#beranda"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Tentang Kami
                    </a>
                    <a
                      href="#testimoni"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Jaringan Mitra & Klien
                    </a>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        onOpenCareerModal();
                      }}
                      className="block w-full text-left py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                    >
                      Karier
                    </button>
                    <a
                      href="#kontak"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Hubungi Kami
                    </a>
                    <a
                      href="#faq"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      FAQ
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Order Tracking Action on Mobile */}
            <div className="pt-2 pb-2">
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenOrderTracker();
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Cek Status Pesanan</span>
              </button>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border-t border-slate-200 rounded-t-2xl pb-safe">
            {currentUser ? (
              <div className="space-y-2.5">
                {checkIsAdmin(currentUser) && onOpenAdmin && (
                  <button
                    id="btn-mobile-nav-admin"
                    onClick={() => {
                      closeMobileMenu();
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-amber-600/20 transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Buka Panel Admin</span>
                  </button>
                )}

                <button
                  id="btn-mobile-nav-dashboard"
                  onClick={() => {
                    closeMobileMenu();
                    onOpenDashboard?.();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-600/20 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Buka Dashboard Saya</span>
                </button>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[160px]">{currentUser.name}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">● Akun Terhubung</p>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        onLogout();
                      }}
                      className="text-xs text-rose-600 font-bold hover:underline px-2 py-1 cursor-pointer"
                    >
                      Keluar
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenRegisterModal();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-center transition duration-300 shadow-md shadow-blue-600/20 flex justify-center items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>Daftar / Masuk Akun</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
