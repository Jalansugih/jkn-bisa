import { supabase, isSupabaseConfigured } from './supabase';
import { OrderItem } from '../types';
import { AdminStats, AdminUserListItem } from '../types/admin';

interface OrderRow {
  id: string;
  uid: string | null;
  product: string;
  brand: string;
  name: string;
  wa: string;
  email: string | null;
  total: string;
  date: string | null;
  status: OrderItem['status'];
  addons: string[] | null;
  notes: string | null;
  tracking_number: string | null;
  document_link: string | null;
}

function rowToOrderItem(row: OrderRow): OrderItem {
  return {
    id: row.id,
    uid: row.uid,
    product: row.product || '',
    brand: row.brand || '',
    name: row.name || '',
    wa: row.wa || '',
    email: row.email || '',
    total: row.total || 'Rp 0',
    date: row.date || '',
    status: row.status || 'Verifikasi',
    addons: Array.isArray(row.addons) ? row.addons : [],
    notes: row.notes || '',
    trackingNumber: row.tracking_number || '',
    documentLink: row.document_link || '',
  };
}

/**
 * Subscribe real-time ke SEMUA order di Supabase untuk Admin portal
 * (pengganti onSnapshot Firestore).
 */
export function subscribeToAllOrders(
  callback: (orders: OrderItem[]) => void
): () => void {
  if (!isSupabaseConfigured || !supabase) {
    callback([]);
    return () => {};
  }

  const fetchAndEmit = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('[subscribeToAllOrders] Supabase error:', error);
      callback([]);
      return;
    }
    callback((data as OrderRow[]).map(rowToOrderItem));
  };

  fetchAndEmit();

  const channel = supabase
    .channel('admin-all-orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchAndEmit())
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Update status pesanan, catatan, nomor resi, atau link dokumen legal
 */
export async function updateOrderStatus(
  orderId: string,
  payload: {
    status: OrderItem['status'];
    notes?: string;
    trackingNumber?: string;
    documentLink?: string;
  }
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Database Supabase tidak terhubung.');
  }

  const updates: Record<string, unknown> = { status: payload.status };
  if (payload.notes !== undefined) updates.notes = payload.notes;
  if (payload.trackingNumber !== undefined) updates.tracking_number = payload.trackingNumber;
  if (payload.documentLink !== undefined) updates.document_link = payload.documentLink;

  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);

  if (error) {
    console.error('[updateOrderStatus] Error:', error);
    throw new Error(`Gagal memperbarui pesanan: ${error.message || 'Kesalahan database'}`);
  }
}

/**
 * Hapus pesanan dari Supabase
 */
export async function deleteOrder(orderId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Database Supabase tidak terhubung.');
  }

  const { error } = await supabase.from('orders').delete().eq('id', orderId);

  if (error) {
    console.error('[deleteOrder] Error:', error);
    throw new Error(`Gagal menghapus pesanan: ${error.message || 'Kesalahan database'}`);
  }
}

interface ProfileRow {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  business_name: string | null;
  avatar: string | null;
  provider: AdminUserListItem['provider'];
  role: 'admin' | 'customer';
  joined_at: string | null;
}

function rowToAdminUser(row: ProfileRow): AdminUserListItem {
  return {
    id: row.id,
    name: row.name || 'Pengguna',
    email: row.email || '',
    whatsapp: row.whatsapp || '',
    businessName: row.business_name || '',
    avatar: row.avatar || '',
    provider: row.provider || 'form',
    role: row.role || 'customer',
    joinedAt: row.joined_at || '2025',
  };
}

/**
 * Subscribe real-time ke SEMUA pengguna terdaftar (tabel `profiles`)
 */
export function subscribeToAllUsers(
  callback: (users: AdminUserListItem[]) => void
): () => void {
  if (!isSupabaseConfigured || !supabase) {
    callback([]);
    return () => {};
  }

  const fetchAndEmit = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('[subscribeToAllUsers] Supabase error:', error);
      callback([]);
      return;
    }
    callback((data as ProfileRow[]).map(rowToAdminUser));
  };

  fetchAndEmit();

  const channel = supabase
    .channel('admin-all-users')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchAndEmit())
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Update role pengguna (promote ke admin atau demote ke customer)
 */
export async function updateUserRole(
  userId: string,
  role: 'admin' | 'customer'
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Database Supabase tidak terhubung.');
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);

  if (error) {
    console.error('[updateUserRole] Error:', error);
    throw new Error(`Gagal mengubah hak akses pengguna: ${error.message || 'Kesalahan database'}`);
  }
}

/**
 * Helper untuk menghitung revenue dari string total (mis. "Rp 4.499.000")
 */
export function parseIdrAmount(totalStr: string): number {
  if (!totalStr) return 0;
  const digitsOnly = totalStr.replace(/[^0-9]/g, '');
  return parseInt(digitsOnly, 10) || 0;
}

/**
 * Hitung statistik admin
 */
export function calculateAdminStats(
  orders: OrderItem[],
  rfqsCount: number = 0,
  usersCount: number = 0
): AdminStats {
  let totalRevenue = 0;
  let completedOrders = 0;
  let activeOrders = 0;

  orders.forEach((order) => {
    const amount = parseIdrAmount(order.total);
    totalRevenue += amount;
    if (order.status === 'Selesai') {
      completedOrders++;
    } else {
      activeOrders++;
    }
  });

  return {
    totalRevenue,
    totalOrders: orders.length,
    completedOrders,
    activeOrders,
    totalRfqs: rfqsCount,
    pendingRfqs: 0,
    totalUsers: usersCount,
  };
}
