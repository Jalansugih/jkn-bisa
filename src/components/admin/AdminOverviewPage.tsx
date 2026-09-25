import React from 'react';
import { OrderItem } from '../../types';
import { RfqItem, AdminTab } from '../../types/admin';
import { parseIdrAmount } from '../../lib/adminService';
import {
  TrendingUp,
  ShoppingBag,
  FileSpreadsheet,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  Sparkles,
  Package,
  BookOpen,
} from 'lucide-react';

interface AdminOverviewPageProps {
  orders: OrderItem[];
  rfqs: RfqItem[];
  usersCount: number;
  productsCount?: number;
  articlesCount?: number;
  onNavigateTab: (tab: AdminTab) => void;
  onSelectOrder: (order: OrderItem) => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  orders,
  rfqs,
  usersCount,
  productsCount = 0,
  articlesCount = 0,
  onNavigateTab,
  onSelectOrder,
}) => {
  // Calculations
  let totalRevenue = 0;
  let statusCounts = {
    Verifikasi: 0,
    Pengerjaan: 0,
    'QC & Training': 0,
    Selesai: 0,
  };

  orders.forEach((ord) => {
    totalRevenue += parseIdrAmount(ord.total);
    if (ord.status && statusCounts[ord.status] !== undefined) {
      statusCounts[ord.status]++;
    }
  });

  const pendingRfqs = rfqs.filter((r) => r.status === 'Baru' || r.status === 'Diproses').length;
  const recentOrders = orders.slice(0, 5);
  const recentRfqs = rfqs.slice(0, 4);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div id="admin-overview-page" className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Dashboard Operasional & Database Terpusat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight mb-2">
            Selamat Datang di Admin Portal BinaUsaha
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Kelola katalog layanan paket legalitas, website pro, kasir POS, artikel edukasi bisnis, pengajuan RFQ, dan pesanan secara terpadu secara real-time.
          </p>
        </div>
      </div>

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Nilai Transaksi
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-slate-900">
            {formatRupiah(totalRevenue)}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{orders.length}</span> pesanan terdata di Firestore
          </p>
        </div>

        {/* Total Pesanan Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pesanan Butuh Tindakan
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-slate-900">
            {statusCounts.Verifikasi + statusCounts.Pengerjaan}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            <span className="text-amber-600 font-semibold">{statusCounts.Verifikasi} Verifikasi</span> •{' '}
            <span className="text-blue-600 font-semibold">{statusCounts.Pengerjaan} Pengerjaan</span>
          </p>
        </div>

        {/* Pending RFQ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pengajuan Kebutuhan (RFQ)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-slate-900">
            {rfqs.length}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-amber-600 font-bold">{pendingRfqs}</span> perlu penawaran / tindak lanjut
          </p>
        </div>

        {/* Total Mitra Pengguna */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mitra Terdaftar
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-heading font-black text-slate-900">
            {usersCount > 0 ? usersCount : '1+'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Akun terdaftar di Supabase Auth
          </p>
        </div>
      </div>

      {/* Quick Access to Catalog & Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">
                Katalog Layanan & Tarif
              </h4>
              <p className="text-xs text-slate-500">
                {productsCount} paket aktif • Perubahan langsung tampil live di website
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Kelola Paket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">
                Pusat Artikel Edukasi UMKM
              </h4>
              <p className="text-xs text-slate-500">
                {articlesCount} artikel terbit • Publikasi artikel baru langsung tayang
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('articles')}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Kelola Artikel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Status Progress Pipeline Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-heading font-bold text-slate-900 text-sm mb-4">
          Pipeline Status Pengerjaan Pesanan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800">1. Verifikasi</span>
              <p className="text-lg font-black text-amber-900">{statusCounts.Verifikasi}</p>
            </div>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-800">2. Pengerjaan</span>
              <p className="text-lg font-black text-blue-900">{statusCounts.Pengerjaan}</p>
            </div>
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-800">3. QC & Training</span>
              <p className="text-lg font-black text-purple-900">{statusCounts['QC & Training']}</p>
            </div>
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800">4. Selesai</span>
              <p className="text-lg font-black text-emerald-900">{statusCounts.Selesai}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Recent RFQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Pesanan Masuk Terbaru
              </h3>
              <p className="text-xs text-slate-500">5 transaksi teratas dari database</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Semua Pesanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada pesanan yang masuk di Firestore.
              </div>
            ) : (
              recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ord.id}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ord.status === 'Pengerjaan'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : ord.status === 'QC & Training'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {ord.product}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {ord.brand} • <span className="font-medium text-slate-700">{ord.name}</span> ({ord.wa})
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 block">
                      {ord.total}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {ord.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent RFQs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Pengajuan Kebutuhan (RFQ)
              </h3>
              <p className="text-xs text-slate-500">Inquiry dari calon klien vendor</p>
            </div>
            <button
              onClick={() => onNavigateTab('rfq')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Kelola RFQ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRfqs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada pengajuan RFQ dari formulir.
              </div>
            ) : (
              recentRfqs.map((rfq) => (
                <div key={rfq.id} className="p-4 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {rfq.nama} {rfq.perusahaan ? `(${rfq.perusahaan})` : ''}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      {rfq.kategori}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                    {rfq.detail}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">{rfq.createdAt}</span>
                    <a
                      href={`https://wa.me/${rfq.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Halo Bapak/Ibu ${rfq.nama}, kami dari BinaUsaha menindaklanjuti pengajuan kebutuhan "${rfq.kategori}".`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Hubungi WA</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

