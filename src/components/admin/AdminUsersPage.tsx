import React, { useEffect, useMemo, useState } from 'react';
import { OrderItem } from '../../types';
import { AdminSeed, AdminUserListItem } from '../../types/admin';
import { updateUserRole } from '../../lib/adminService';
import { isPaid, orderAmount } from '../../lib/adminAnalytics';
import { downloadCsv, formatRupiah, waLink } from '../../lib/adminUtils';
import { useAdminDialogs } from './AdminDialogs';
import { Search, ShieldCheck, User, MessageCircle, Mail, Loader2, Download } from 'lucide-react';

interface AdminUsersPageProps {
  users: AdminUserListItem[];
  /** Semua pesanan, dipakai untuk menghitung jumlah pesanan & total belanja tiap pengguna. */
  orders?: OrderItem[];
  currentUserId?: string | null;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  /** Perintah dari pencarian global/lonceng/aktivitas: isi kolom pencarian. */
  seed?: AdminSeed | null;
  onSeedConsumed?: () => void;
}

type RoleFilter = 'all' | 'admin' | 'customer';

const PROVIDER_LABEL: Record<AdminUserListItem['provider'], string> = {
  google: 'Google',
  whatsapp: 'WhatsApp',
  form: 'Email',
};

interface UserStats {
  orderCount: number;
  paidCount: number;
  paidTotal: number;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({
  users,
  orders = [],
  currentUserId,
  showToast,
  seed,
  onSeedConsumed,
}) => {
  const { confirm, dialogs } = useAdminDialogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!seed) return;
    setSearchQuery(seed.query ?? '');
    setRoleFilter('all');
    onSeedConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  /** Pesanan dihubungkan ke akun lewat kolom uid. Pesanan tamu (tanpa login) tidak ikut terhitung. */
  const statsByUser = useMemo(() => {
    const map = new Map<string, UserStats>();
    for (const o of orders) {
      if (!o.uid) continue;
      const s = map.get(o.uid) || { orderCount: 0, paidCount: 0, paidTotal: 0 };
      s.orderCount++;
      if (isPaid(o)) {
        s.paidCount++;
        s.paidTotal += orderAmount(o);
      }
      map.set(o.uid, s);
    }
    return map;
  }, [orders]);

  const counts = useMemo(
    () => ({
      all: users.length,
      admin: users.filter((u) => u.role === 'admin').length,
      customer: users.filter((u) => u.role !== 'admin').length,
    }),
    [users]
  );

  const filteredUsers = users.filter((u) => {
    if (roleFilter === 'admin' && u.role !== 'admin') return false;
    if (roleFilter === 'customer' && u.role === 'admin') return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.whatsapp && u.whatsapp.toLowerCase().includes(q)) ||
      (u.businessName && u.businessName.toLowerCase().includes(q)) ||
      u.id.toLowerCase().includes(q)
    );
  });

  const handleToggleRole = async (user: AdminUserListItem) => {
    if (user.id === currentUserId) {
      showToast('Anda tidak bisa mengubah hak akses akun sendiri. Minta admin lain melakukannya.', 'warning');
      return;
    }

    const makeAdmin = user.role !== 'admin';
    const ok = await confirm(
      makeAdmin
        ? {
            title: 'Jadikan Administrator?',
            message: `${user.name}${user.email ? ` (${user.email})` : ''} akan bisa melihat dan mengubah semua pesanan, RFQ, katalog, artikel, pengguna, dan komisi.\n\nPastikan akun ini benar milik orang yang Anda percaya.`,
            confirmLabel: 'Ya, jadikan admin',
            tone: 'danger',
          }
        : {
            title: 'Cabut hak Administrator?',
            message: `${user.name} akan kembali menjadi pengguna biasa dan tidak bisa lagi membuka panel admin.`,
            confirmLabel: 'Ya, cabut hak admin',
            tone: 'danger',
          }
    );
    if (!ok) return;

    setUpdatingUserId(user.id);
    try {
      await updateUserRole(user.id, makeAdmin ? 'admin' : 'customer');
      showToast(
        makeAdmin ? `${user.name} sekarang Administrator.` : `Hak admin ${user.name} sudah dicabut.`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah role pengguna.', 'error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const exportCsv = () => {
    if (filteredUsers.length === 0) {
      showToast('Tidak ada pengguna untuk diekspor.', 'warning');
      return;
    }
    const rows: (string | number)[][] = [
      ['Nama', 'Email', 'WhatsApp', 'Usaha', 'Peran', 'Login via', 'Terdaftar', 'Jumlah pesanan', 'Pesanan lunas', 'Total belanja lunas'],
      ...filteredUsers.map((u) => {
        const s = statsByUser.get(u.id);
        return [
          u.name,
          u.email || '',
          u.whatsapp || '',
          u.businessName || '',
          u.role === 'admin' ? 'Admin' : 'Customer',
          PROVIDER_LABEL[u.provider] || u.provider,
          u.joinedAt,
          s?.orderCount || 0,
          s?.paidCount || 0,
          s?.paidTotal || 0,
        ];
      }),
    ];
    downloadCsv(`pengguna-binausaha-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    showToast(`${filteredUsers.length} pengguna diekspor.`, 'success');
  };

  const pill = (key: RoleFilter, label: string) => (
    <button
      key={key}
      onClick={() => setRoleFilter(key)}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
        roleFilter === key ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label} ({counts[key]})
    </button>
  );

  return (
    <div id="admin-users-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Daftar Akun Pengguna & Hak Otorisasi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Total {users.length} akun terdaftar. Jumlah pesanan dan total belanja dihitung dari pesanan yang dibuat saat login.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, email, WA, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full sm:w-64"
              />
            </div>
            <button
              onClick={exportCsv}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              title="Unduh daftar yang sedang tampil sebagai CSV"
            >
              <Download className="w-4 h-4" /> Ekspor CSV
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {pill('all', 'Semua')}
          {pill('customer', 'Customer')}
          {pill('admin', 'Admin')}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-5 py-3.5">Usaha / Brand</th>
                <th className="px-5 py-3.5">Kontak</th>
                <th className="px-5 py-3.5">Pesanan</th>
                <th className="px-5 py-3.5">Terdaftar</th>
                <th className="px-5 py-3.5">Peran</th>
                <th className="px-5 py-3.5 text-right">Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    {users.length === 0
                      ? 'Belum ada akun terdaftar, atau daftar pengguna belum bisa dimuat.'
                      : 'Tidak ada akun yang sesuai pencarian atau filter.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';
                  const isSelf = user.id === currentUserId;
                  const stats = statsByUser.get(user.id);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {(user.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {user.name}
                              {isSelf && (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Masuk via {PROVIDER_LABEL[user.provider] || user.provider}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-slate-800 font-semibold">{user.businessName || '-'}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap space-y-0.5">
                        {user.email && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        )}
                        {user.whatsapp && (
                          <a
                            href={waLink(user.whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 hover:underline"
                            title="Buka chat WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{user.whatsapp}</span>
                          </a>
                        )}
                        {!user.email && !user.whatsapp && <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {stats ? (
                          <div>
                            <div className="font-bold text-slate-900">{stats.orderCount} pesanan</div>
                            <div className="text-[11px] text-slate-500">
                              {stats.paidCount > 0
                                ? `${stats.paidCount} lunas • ${formatRupiah(stats.paidTotal)}`
                                : 'Belum ada yang lunas'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">Belum ada pesanan</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500">{user.joinedAt}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Customer</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={updatingUserId === user.id || isSelf}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            isAdmin
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                          title={isSelf ? 'Tidak bisa mengubah hak akses akun sendiri' : undefined}
                        >
                          {updatingUserId === user.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                          ) : isAdmin ? (
                            'Cabut Admin'
                          ) : (
                            'Jadikan Admin'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {dialogs}
    </div>
  );
};

export default AdminUsersPage;
