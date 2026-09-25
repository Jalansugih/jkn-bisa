import { supabase, isSupabaseConfigured } from './supabase';
import { OrderItem } from '../types';

export class OrderTimeoutError extends Error {
  constructor() {
    super(
      'Koneksi ke Supabase terputus atau lambat. Silakan periksa jaringan internet Anda dan coba lagi.'
    );
    this.name = 'OrderTimeoutError';
  }
}

/**
 * Generate standard unique BinaUsaha Order ID format: BU-XXXXXXXXX
 */
export function generateOrderId(): string {
  return 'BU-' + Math.floor(100000000 + Math.random() * 900000000);
}

/**
 * Baris tabel `orders` di Supabase (snake_case, sesuai supabase/schema.sql).
 */
interface OrderRow {
  id: string;
  uid: string | null;
  product: string;
  product_id: string | null;
  product_price: number | null;
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
    productId: row.product_id || undefined,
    productPrice: typeof row.product_price === 'number' ? row.product_price : undefined,
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
 * Alur createOrder():
 * 1. Validasi data order
 * 2. Buat orderId/orderNumber unik
 * 3. Simpan ke Supabase (table `orders`)
 * 4. Jika berhasil -> return createdOrder
 * 5. Jika gagal -> THROW ERROR (jangan pernah swallow error)
 */
export async function createOrder(
  order: Omit<OrderItem, 'id' | 'date' | 'status'>,
  uid: string | null
): Promise<OrderItem> {
  // 1. Validasi data pesanan
  if (!order) {
    throw new Error('Data pesanan tidak boleh kosong.');
  }
  if (!order.name || !order.name.trim()) {
    throw new Error('Nama pemesan wajib diisi.');
  }
  if (!order.wa || !order.wa.trim()) {
    throw new Error('Nomor WhatsApp wajib diisi.');
  }
  if (!order.product || !order.product.trim()) {
    throw new Error('Paket/layanan yang dipesan wajib dipilih.');
  }
  if (!order.total || !order.total.trim()) {
    throw new Error('Total harga pesanan tidak valid.');
  }

  // 2. Buat ID & payload pesanan
  const orderId = generateOrderId();
  const createdOrder: OrderItem = {
    ...order,
    id: orderId,
    uid: uid || null,
    date: new Date().toLocaleDateString('id-ID'),
    status: 'Verifikasi',
  };

  // 3. Pastikan Supabase benar-benar tersedia sebelum menulis.
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Konfigurasi Supabase belum lengkap. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY tersedia saat build.'
    );
  }

  // 4. Simpan ke Supabase (tabel `orders`)
  const { error } = await supabase.from('orders').insert({
    id: orderId,
    uid: uid || null,
    product: order.product,
    product_id: order.productId || null,
    product_price: order.productPrice ?? null,
    brand: order.brand,
    name: order.name,
    wa: order.wa,
    email: order.email || null,
    total: order.total,
    date: createdOrder.date,
    status: 'Verifikasi',
    addons: order.addons || [],
    notes: order.notes || null,
  });

  if (error) {
    console.error('[createOrder] Gagal menyimpan pesanan ke Supabase:', error);

    if (error.code === '42501' || /row-level security/i.test(error.message)) {
      throw new Error(
        'Pesanan ditolak oleh Supabase (row-level security). Periksa RLS policy tabel `orders` dan status login pengguna.'
      );
    }

    throw new Error(
      `Gagal menyimpan pesanan ke Supabase${error.code ? ` [${error.code}]` : ''}: ${error.message || 'Terjadi kesalahan pada database.'}`
    );
  }

  // Kirim notifikasi email ke admin (best-effort, tidak menggagalkan checkout jika error)
  try {
    await fetch('/api/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdOrder),
    });
  } catch (notifyErr) {
    console.warn('[createOrder] Notifikasi email admin gagal dikirim:', notifyErr);
  }

  // 5. Kembalikan order jika Supabase berhasil
  return createdOrder;
}

/**
 * Mengambil daftar pesanan milik pengguna dari Supabase berdasarkan UID.
 */
export async function getMyOrders(uid: string): Promise<OrderItem[]> {
  if (!uid || !isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('uid', uid)
    .order('id', { ascending: false });

  if (error) {
    console.error('[getMyOrders] Gagal mengambil pesanan dari Supabase:', error);
    throw new Error('Gagal mengambil data pesanan dari database Supabase.');
  }

  return (data as OrderRow[]).map(rowToOrderItem);
}

/**
 * Mengambil satu pesanan spesifik dari Supabase berdasarkan orderId.
 */
export async function getOrder(orderId: string): Promise<OrderItem | null> {
  if (!orderId || !isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    console.error(`[getOrder] Gagal mengambil order ${orderId} dari Supabase:`, error);
    throw new Error(`Gagal membaca pesanan ${orderId} dari database.`);
  }

  return data ? rowToOrderItem(data as OrderRow) : null;
}

/**
 * Mengambil daftar pesanan dari Supabase (dengan opsi filter UID).
 */
export async function getOrders(uid?: string): Promise<OrderItem[]> {
  if (uid) {
    return getMyOrders(uid);
  }
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('[getOrders] Gagal mengambil pesanan:', error);
    throw new Error('Gagal mengambil daftar pesanan dari Supabase.');
  }

  return (data as OrderRow[]).map(rowToOrderItem);
}

/**
 * Berlangganan secara real-time ke tabel `orders` Supabase untuk pesanan
 * milik user aktif (pengganti onSnapshot Firestore).
 */
export function subscribeToMyOrders(
  uid: string | null,
  callback: (orders: OrderItem[]) => void
): () => void {
  if (!uid || !isSupabaseConfigured || !supabase) {
    callback([]);
    return () => {};
  }

  const fetchAndEmit = () => {
    getMyOrders(uid)
      .then(callback)
      .catch((err) => {
        console.error('[subscribeToMyOrders] Gagal memuat ulang pesanan:', err);
      });
  };

  fetchAndEmit();

  const channel = supabase
    .channel(`orders-uid-${uid}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `uid=eq.${uid}` },
      () => fetchAndEmit()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Melacak pesanan tunggal secara publik (tamu) berdasarkan Order ID atau
 * nomor WA, lewat RPC `track_order` (pengganti Cloud Function `trackOrder`).
 * RPC ini SECURITY DEFINER di sisi database sehingga tidak membuka semua
 * data order lewat SELECT langsung ke tamu.
 */
export async function trackOrder(searchTerm: string): Promise<OrderItem | null> {
  const cleanTerm = searchTerm.trim();
  if (!cleanTerm) return null;

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Layanan pelacakan belum dikonfigurasi.');
  }

  const { data, error } = await supabase.rpc('track_order', { search_term: cleanTerm });

  if (error) {
    console.error('[trackOrder] Supabase RPC track_order error:', error);
    throw new Error('Gagal menghubungi layanan pelacakan pesanan.');
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return {
    id: row.id,
    product: row.product || '',
    brand: row.brand || '',
    status: row.status || 'Verifikasi',
    notes: row.notes || '',
    date: row.date || '',
    uid: null,
    name: '',
    wa: '',
    total: '',
  } as OrderItem;
}
