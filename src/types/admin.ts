import { OrderItem, AuthUser } from './index';

export type AdminTab = 'overview' | 'orders' | 'rfq' | 'products' | 'articles' | 'users' | 'commissions';

export interface RfqItem {
  id: string;
  nama: string;
  perusahaan?: string;
  whatsapp: string;
  email?: string;
  kategori: string;
  lokasi?: string;
  detail: string;
  jumlah?: string;
  waktu?: string;
  status: 'Baru' | 'Diproses' | 'Penawaran Terkirim' | 'Deal' | 'Batal';
  adminNotes?: string;
  /** Teks tanggal siap tampil. */
  createdAt: string;
  /** Waktu asli (ISO) untuk pengurutan, aktivitas, dan hitungan. */
  createdAtIso?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  totalRfqs: number;
  pendingRfqs: number;
  totalUsers: number;
}

export interface OrderStatusUpdatePayload {
  status: OrderItem['status'];
  notes?: string;
  trackingNumber?: string;
  documentLink?: string;
}

export interface AdminUserListItem extends AuthUser {
  orderCount?: number;
  totalSpent?: number;
  role?: 'admin' | 'customer';
  /** Waktu akun dibuat (ISO) dari kolom created_at. */
  createdAt?: string;
}

/**
 * Perintah navigasi antar menu admin. Dipakai pencarian global, lonceng
 * notifikasi, kartu ringkasan, dan daftar aktivitas supaya satu klik langsung
 * membuka menu tujuan dengan filter/pencarian/item yang sudah terpilih.
 */
export type OrderViewKey = 'all' | 'verify' | 'unpaid' | 'queue' | 'progress' | 'done';

export interface AdminSeed {
  tab: AdminTab;
  /** Isi kolom pencarian di menu tujuan. */
  query?: string;
  /** Pesanan: tampilan cepat yang dipilih. */
  orderView?: OrderViewKey;
  /** Pesanan: filter tahap pengerjaan. */
  orderStatus?: OrderItem['status'];
  /** RFQ: filter status. */
  rfqStatus?: RfqItem['status'] | 'all';
  /** Pesanan/RFQ: buka langsung detail item ber-ID ini. */
  openId?: string;
}
