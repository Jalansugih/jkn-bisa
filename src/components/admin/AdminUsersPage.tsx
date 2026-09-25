import React, { useState } from 'react';
import { AdminUserListItem } from '../../types/admin';
import { updateUserRole } from '../../lib/adminService';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  MessageCircle,
  Mail,
  Building,
  Calendar,
  Loader2,
} from 'lucide-react';

interface AdminUsersPageProps {
  users: AdminUserListItem[];
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ users, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.whatsapp && u.whatsapp.toLowerCase().includes(q)) ||
      (u.businessName && u.businessName.toLowerCase().includes(q))
    );
  });

  const handleToggleRole = async (user: AdminUserListItem) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    const confirmMsg =
      newRole === 'admin'
        ? `Jadikan ${user.name} (${user.email}) sebagai Administrator sistem?`
        : `Cabut hak Administrator dari ${user.name}?`;

    if (!confirm(confirmMsg)) return;

    setUpdatingUserId(user.id);
    try {
      await updateUserRole(user.id, newRole);
      showToast(`Hak akses ${user.name} diubah menjadi ${newRole}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah role pengguna.', 'error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div id="admin-users-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-slate-900">
            Daftar Akun Pengguna & Hak Otorisasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {users.length} akun pengguna terdaftar
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full sm:w-64"
          />
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
                <th className="px-5 py-3.5">Terdaftar</th>
                <th className="px-5 py-3.5">Peran / Role</th>
                <th className="px-5 py-3.5 text-right">Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada akun pengguna yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const normalizedEmail = (user.email || '').trim().toLowerCase();
                  const isAdmin = user.role === 'admin' || normalizedEmail === 'databasemanb@gmail.com' || normalizedEmail === 'admin@binausaha.id';
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-slate-800 font-semibold">
                          {user.businessName || '-'}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap space-y-0.5">
                        {user.email && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        )}
                        {user.whatsapp && (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{user.whatsapp}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                        {user.joinedAt}
                      </td>
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
                          disabled={updatingUserId === user.id || (user.email || '').trim().toLowerCase() === 'databasemanb@gmail.com' || (user.email || '').trim().toLowerCase() === 'admin@binausaha.id'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-40 ${
                            isAdmin
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                          title={(user.email || '').trim().toLowerCase() === 'databasemanb@gmail.com' || (user.email || '').trim().toLowerCase() === 'admin@binausaha.id' ? 'Super Admin Utama' : undefined}
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
    </div>
  );
};
