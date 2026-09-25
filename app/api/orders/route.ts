import { db } from '../../../lib/db';
import { generateOrderId } from '../../../lib/utils';
import { OrderItem } from '../../../src/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const id = searchParams.get('id');

    if (id) {
      const order = await db.orders.findById(id);
      if (!order) {
        return Response.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }
      return Response.json({ success: true, order });
    }

    if (query) {
      const order = await db.orders.findByPhoneOrId(query);
      if (!order) {
        return Response.json({ error: 'Pesanan tidak ditemukan dengan kata kunci tersebut' }, { status: 404 });
      }
      return Response.json({ success: true, order });
    }

    const orders = await db.orders.getAll();
    return Response.json({ success: true, orders });
  } catch (error: any) {
    console.error('[API /api/orders GET] Error:', error);
    return Response.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product, brand, name, wa, email, total, addons, notes } = body;

    if (!product || !brand || !name || !wa) {
      return Response.json(
        { error: 'Informasi pesanan tidak lengkap (produk, nama, brand, dan no. WA wajib diisi)' },
        { status: 400 }
      );
    }

    const newOrder: OrderItem = {
      id: generateOrderId(),
      product,
      brand,
      name,
      wa,
      email: email || '',
      total: total || 'Rp 0',
      date: new Date().toISOString(),
      status: 'Verifikasi',
      addons: addons || [],
      notes: notes || '',
    };

    const saved = await db.orders.create(newOrder);
    return Response.json({ success: true, order: saved }, { status: 201 });
  } catch (error: any) {
    console.error('[API /api/orders POST] Error:', error);
    return Response.json({ error: 'Gagal menyimpan pesanan' }, { status: 500 });
  }
}
