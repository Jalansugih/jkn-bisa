export interface Product {
  id: string;
  name: string;
  category: 'website' | 'pos' | 'legalitas' | 'bundling';
  price: number;
  originalPrice?: number;
  discountPct?: number;
  priceUnit: string;
  description: string;
  badge?: string;
  badgeType?: 'primary' | 'popular' | 'super' | 'bonus' | 'hardware' | 'best';
  bonus?: string;
  features: string[];
  iconName: string;
  /** URL foto produk (Supabase Storage bucket `products`). Kosong = tampilkan ikon. */
  imageUrl?: string;
  popular?: boolean;
  active?: boolean;
  /** 'default' = ikut tarif umum; 'percent' = commissionValue dalam persen; 'fixed' = commissionValue dalam rupiah. */
  commissionType?: 'default' | 'percent' | 'fixed';
  commissionValue?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Article {
  id: string;
  title: string;
  category: 'legalitas' | 'digital' | 'keuangan' | 'pemasaran' | 'operasional' | 'skala-usaha';
  categoryLabel: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  contentHtml: string;
  author: string;
  authorRole?: string;
  featured?: boolean;
  views?: number;
  tags?: string[];
  slug?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FaqItem {
  id: string;
  question: string;
  answerHtml: string;
  category: string;
  badge: string;
  highlight?: boolean;
}

export interface OrderItem {
  id: string;
  uid?: string | null;
  product: string;
  productId?: string;
  productPrice?: number;
  brand: string;
  name: string;
  wa: string;
  email?: string;
  total: string;
  date: string;
  status: 'Verifikasi' | 'Pengerjaan' | 'QC & Training' | 'Selesai';
  addons?: string[];
  notes?: string;
  trackingNumber?: string;
  documentLink?: string;
  paymentMethod?: string;
  paymentStatus?: 'Belum Dibayar' | 'Menunggu Verifikasi' | 'Lunas';
  /** Kode referral yang tercatat saat checkout (hanya dipakai tampilan admin). */
  referredByCode?: string;
  /** true = server menerima referral (bukan referral ke diri sendiri / kode tak dikenal). */
  referralAccepted?: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface RfqFormData {
  nama: string;
  perusahaan: string;
  whatsapp: string;
  email: string;
  kategori: string;
  lokasi: string;
  detail: string;
  jumlah: string;
  waktu: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  whatsapp?: string;
  businessName?: string;
  avatar?: string;
  provider: 'google' | 'whatsapp' | 'form';
  joinedAt: string;
  role?: 'admin' | 'customer';
}
