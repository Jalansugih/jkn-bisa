import { OrderItem, AuthUser } from './index';

export type AdminTab = 'overview' | 'orders' | 'rfq' | 'products' | 'articles' | 'users' | 'settings';

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
  createdAt: string;
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
}
