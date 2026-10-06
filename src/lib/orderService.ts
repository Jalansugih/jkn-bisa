import { supabase, isSupabaseConfigured } from './supabase';
import { OrderItem } from '../types';
import { getStoredReferralCode } from './referral';

export class OrderTimeoutError extends Error {
  constructor() {
    super('Koneksi ke Supabase terputus atau lambat. Silakan periksa jaringan internet Anda dan coba lagi.');
    this.name = 'OrderTimeoutError';
  }
}

export function generateOrderId(): string {
  return 'BU-' + Math.floor(100000000 + Math.random() * 900000000);
}

export interface OrderRow {
  id: string;
  uid: string | null;
  product: string;
  product_id: string | null;
  product_price: number | null;
  brand: string;
  name: string;
  whatsapp: string;
  email: string | null;
  total: string;
  order_date: string | null;
  status: OrderItem['status'];
  addons: string[] | null;
  notes: string | null;
  tracking_number: string | null;
  document_link: string | null;
  payment_method?: string | null;
  payment_status?: OrderItem['paymentStatus'] | null;
  referred_by_code?: string | null;
  referred_by?: string | null;
}

export function rowToOrderItem(row: OrderRow): OrderItem {
  return {
    id: row.id,
    uid: row.uid,
    product: row.product || '',
    productId: row.product_id || undefined,
    productPrice: typeof row.product_price === 'number' ? row.product_price : undefined,
    brand: row.brand || '',
    name: row.name || '',
    wa: row.whatsapp || '',
    email: row.email || '',
    total: row.total || 'Rp 0',
    date: row.order_date || '',
    status: row.status || 'Verifikasi',
    addons: Array.isArray(row.addons) ? row.addons : [],
    notes: row.notes || '',
    trackingNumber: row.tracking_number || '',
    documentLink: row.document_link || '',
    paymentMethod: row.payment_method || undefined,
    paymentStatus: row.payment_status || 'Belum Dibayar',
    referredByCode: row.referred_by_code || undefined,
    referralAccepted: Boolean(row.referred_by),
  };
}

export async function createOrder(
  order: Omit<OrderItem, 'id' | 'date' | 'status'>,
  uid: string | null
): Promise<OrderItem> {
  if (!order) throw new Error('Data pesanan tidak boleh kosong.');
  if (!order.name?.trim()) throw new Error('Nama pemesan wajib diisi.');
  if (!order.wa?.trim()) throw new Error('Nomor WhatsApp wajib diisi.');
  if (!order.product?.trim()) throw new Error('Paket/layanan yang dipesan wajib dipilih.');
  if (!order.total?.trim()) throw new Error('Total harga pesanan tidak valid.');

  const orderId = generateOrderId();
  const today = new Date();
  const isoDate = today.toISOString().split('T')[0];
  const displayDate = today.toLocaleDateString('id-ID');
  // Bersihkan harga dari format "Rp ..." menjadi angka
  let cleanPrice: number | null = null;
  if (order.productPrice) {
    if (typeof order.productPrice === 'string') {
      cleanPrice = Number((order.productPrice as string).replace(/[^0-9]/g, ''));
    } else {
      cleanPrice = order.productPrice;
    }
  }

  const createdOrder: OrderItem = {
    ...order,
    id: orderId,
    uid: uid || null,
    date: displayDate,
    status: 'Verifikasi',
    paymentStatus: 'Belum Dibayar',
  };

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Konfigurasi Supabase belum lengkap.');
  }

  const { error } = await supabase.from('orders').insert({
    id: orderId,
    uid: uid || null,
    product: order.product,
    product_id: order.productId || null,
    product_price: cleanPrice,
    brand: order.brand,
    name: order.name,
    whatsapp: order.wa,
    email: order.email || null,
    total: order.total,
    order_date: isoDate,
    status: 'Verifikasi',
    addons: order.addons || [],
    notes: order.notes || null,
    payment_method: order.paymentMethod || null,
    payment_status: 'Belum Dibayar',
    referred_by_code: getStoredReferralCode(),
  });

  if (error) {
    console.error('[createOrder] Error:', error);
    throw new Error(`Gagal menyimpan pesanan: ${error.message}`);
  }

  try {
    await fetch('/api/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdOrder),
    });
  } catch (e) {
    console.warn('Notifikasi gagal:', e);
  }

  return createdOrder;
}

export async function trackOrder(searchTerm: string): Promise<OrderItem | null> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Konfigurasi Supabase belum lengkap.');
  }

  // Pakai RPC track_order (SECURITY DEFINER) supaya tamu tanpa login
  // bisa melacak pesanan tanpa membuka seluruh tabel orders.
  const { data, error } = await supabase.rpc('track_order', { search_term: searchTerm.trim() });

  if (error) {
    console.error('[trackOrder] Error:', error);
    throw new Error(error.message);
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return rowToOrderItem({
    uid: null, product_id: null, product_price: null, whatsapp: '', email: null,
    addons: [], tracking_number: null, document_link: null, total: '',
    ...row,
  } as OrderRow);
}

export function subscribeToMyOrders(uid: string | null, callback: (orders: OrderItem[]) => void) {
  if (!uid || !isSupabaseConfigured || !supabase) {
    callback([]);
    return () => {};
  }
  const db = supabase;

  const fetchAndEmit = async () => {
    const { data, error } = await db
      .from('orders')
      .select('*')
      .eq('uid', uid)
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[subscribeToMyOrders] Gagal memuat pesanan:', error.message);
      return;
    }
    callback((data || []).map((row) => rowToOrderItem(row as OrderRow)));
  };

  // Muat sekali di awal, lalu perbarui setiap ada perubahan realtime
  fetchAndEmit();

  const channel = db
    .channel(`my-orders-${uid}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `uid=eq.${uid}` }, () => fetchAndEmit())
    .subscribe();

  return () => {
    db.removeChannel(channel);
  };
}
