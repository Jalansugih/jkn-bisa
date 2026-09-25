/**
 * Utility helper functions for BinaUsaha platform
 */

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderId(): string {
  // Ruang angka diperbesar (~900 juta kombinasi) agar ID order tidak
  // mudah ditebak/brute-force — lihat catatan yang sama di
  // src/lib/orderService.ts.
  const randomNum = Math.floor(100000000 + Math.random() * 900000000);
  return `BU-${randomNum}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
