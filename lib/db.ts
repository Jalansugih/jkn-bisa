import { OrderItem } from '../src/types';

// In-memory backing store for demo/development with initial seed orders
const ordersStore: Map<string, OrderItem> = new Map([
  [
    'BU-98214',
    {
      id: 'BU-98214',
      product: 'Paket Usaha Komplit (PT + Website + POS)',
      brand: 'Kopi Nusantara Sentosa',
      name: 'Rian Pratama',
      wa: '081234567890',
      email: 'rian@kopinusantara.id',
      total: 'Rp 4.499.000',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'QC & Training',
      addons: ['Domain .id Custom', 'Thermal Printer POS'],
      notes: 'Website sudah live, menunggu jadwal training kasir POS hari Jumat.',
    },
  ],
  [
    'BU-77301',
    {
      id: 'BU-77301',
      product: 'Website Toko Online Pro',
      brand: 'Batik Hijrah Fashion',
      name: 'Siti Rahayu',
      wa: '081398765432',
      email: 'siti@batikhijrah.com',
      total: 'Rp 1.499.000',
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      status: 'Selesai',
      addons: ['Payment Gateway QRIS Auto'],
      notes: 'Serah terima akun admin CMS dan panduan input produk.',
    },
  ],
  [
    'BU-55102',
    {
      id: 'BU-55102',
      product: 'Pendirian PT Perorangan Pro',
      brand: 'PT Global Berkah Mandiri',
      name: 'Budi Santoso',
      wa: '085712345678',
      email: 'budi@globalberkah.co.id',
      total: 'Rp 1.999.000',
      date: new Date(Date.now() - 1 * 86400000).toISOString(),
      status: 'Pengerjaan',
      addons: ['Sertifikat Standar OSS', 'NPWP Badan & SKT'],
      notes: 'Pengajuan nama PT telah disetujui Kemenkumham, proses penerbitan AHU.',
    },
  ],
]);

export const db = {
  orders: {
    async findById(id: string): Promise<OrderItem | null> {
      const cleanId = id.trim().toUpperCase();
      return ordersStore.get(cleanId) || null;
    },

    async findByPhoneOrId(query: string): Promise<OrderItem | null> {
      const q = query.trim().toLowerCase();
      for (const order of ordersStore.values()) {
        if (
          order.id.toLowerCase() === q ||
          order.wa.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
          (order.email && order.email.toLowerCase() === q)
        ) {
          return order;
        }
      }
      return null;
    },

    async getAll(uid?: string): Promise<OrderItem[]> {
      const all = Array.from(ordersStore.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      if (uid === 'guest') {
        return all.filter((o) => !o.uid);
      }
      if (uid) {
        return all.filter((o) => o.uid === uid);
      }
      return all;
    },

    async create(order: OrderItem): Promise<OrderItem> {
      ordersStore.set(order.id, order);
      return order;
    },

    async updateStatus(id: string, status: OrderItem['status']): Promise<OrderItem | null> {
      const existing = ordersStore.get(id);
      if (!existing) return null;
      existing.status = status;
      ordersStore.set(id, existing);
      return existing;
    },
  },
};
