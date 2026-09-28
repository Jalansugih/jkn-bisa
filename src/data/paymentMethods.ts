// Daftar metode pembayaran. Nomor rekening/e-wallet BISA diganti lewat
// environment variable (VITE_PAY_*) tanpa ubah kode. Jika belum diisi,
// invoice akan meminta pelanggan menanyakan detailnya ke admin via WhatsApp.

export type PaymentMethodId = 'bca' | 'mandiri' | 'bri' | 'qris' | 'dana' | 'gopay';
export type PaymentGroup = 'Transfer Bank' | 'QRIS' | 'E-Wallet';

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  group: PaymentGroup;
  accountNumber?: string;
  accountName?: string;
  qrisImageUrl?: string;
  hint: string;
}

const env = (import.meta as any).env || {};
const ACCOUNT_NAME = env.VITE_PAY_ACCOUNT_NAME || 'PT Bina Usaha Digital';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bca',
    label: 'Bank BCA',
    group: 'Transfer Bank',
    accountNumber: env.VITE_PAY_BCA || '4020322841',
    accountName: ACCOUNT_NAME,
    hint: 'Transfer manual via ATM / m-banking / internet banking.',
  },
  {
    id: 'mandiri',
    label: 'Bank Mandiri',
    group: 'Transfer Bank',
    accountNumber: env.VITE_PAY_MANDIRI || undefined,
    accountName: ACCOUNT_NAME,
    hint: 'Transfer manual via ATM / Livin\u2019 by Mandiri.',
  },
  {
    id: 'bri',
    label: 'Bank BRI',
    group: 'Transfer Bank',
    accountNumber: env.VITE_PAY_BRI || undefined,
    accountName: ACCOUNT_NAME,
    hint: 'Transfer manual via ATM / BRImo.',
  },
  {
    id: 'qris',
    label: 'QRIS',
    group: 'QRIS',
    qrisImageUrl: env.VITE_PAY_QRIS_IMAGE || '/qris.png',
    accountName: ACCOUNT_NAME,
    hint: 'Scan dengan aplikasi bank atau e-wallet apa pun.',
  },
  {
    id: 'dana',
    label: 'DANA',
    group: 'E-Wallet',
    accountNumber: env.VITE_PAY_DANA || undefined,
    accountName: ACCOUNT_NAME,
    hint: 'Kirim ke nomor DANA berikut.',
  },
  {
    id: 'gopay',
    label: 'GoPay',
    group: 'E-Wallet',
    accountNumber: env.VITE_PAY_GOPAY || undefined,
    accountName: ACCOUNT_NAME,
    hint: 'Kirim ke nomor GoPay berikut.',
  },
];

// Hanya tampilkan metode yang sudah punya data (nomor rekening / gambar QRIS).
// QRIS selalu tersedia; gambar diambil dari /qris.png (folder public).
export const isMethodAvailable = (m: PaymentMethod): boolean =>
  Boolean(m.accountNumber || m.qrisImageUrl);

export const AVAILABLE_PAYMENT_METHODS = PAYMENT_METHODS.filter(isMethodAvailable);

export const getPaymentMethod = (id?: string | null): PaymentMethod | undefined =>
  PAYMENT_METHODS.find((m) => m.id === id);

export type PaymentStatus = 'Belum Dibayar' | 'Menunggu Verifikasi' | 'Lunas';
export const PAYMENT_STATUSES: PaymentStatus[] = ['Belum Dibayar', 'Menunggu Verifikasi', 'Lunas'];
