import { supabase, isSupabaseConfigured } from './supabase';
import { RfqFormData } from '../types';
import { RfqItem } from '../types/admin';

export function generateRfqId(): string {
  return 'RFQ-' + Math.floor(10000 + Math.random() * 90000);
}

const LOCAL_RFQS_KEY = 'bu_local_rfqs';

interface RfqRow {
  id: string;
  nama: string;
  perusahaan: string | null;
  whatsapp: string;
  email: string | null;
  kategori: string;
  lokasi: string | null;
  detail: string;
  jumlah: string | null;
  waktu: string | null;
  status: RfqItem['status'];
  admin_notes: string | null;
  created_at: string;
}

function rowToRfqItem(row: RfqRow): RfqItem {
  return {
    id: row.id,
    nama: row.nama || '',
    perusahaan: row.perusahaan || '',
    whatsapp: row.whatsapp || '',
    email: row.email || '',
    kategori: row.kategori || 'Umum',
    lokasi: row.lokasi || '',
    detail: row.detail || '',
    jumlah: row.jumlah || '',
    waktu: row.waktu || '',
    status: row.status || 'Baru',
    adminNotes: row.admin_notes || '',
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : new Date().toLocaleDateString('id-ID'),
  };
}

function getLocalRfqs(): RfqItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_RFQS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRfq(item: RfqItem): void {
  try {
    const list = getLocalRfqs();
    localStorage.setItem(LOCAL_RFQS_KEY, JSON.stringify([item, ...list]));
  } catch (err) {
    console.warn('[saveLocalRfq] LocalStorage error:', err);
  }
}

/**
 * Simpan pengajuan RFQ ke Supabase
 */
export async function submitRfq(formData: RfqFormData): Promise<RfqItem> {
  const rfqId = generateRfqId();
  const newRfq: RfqItem = {
    id: rfqId,
    nama: formData.nama.trim(),
    perusahaan: formData.perusahaan?.trim() || '',
    whatsapp: formData.whatsapp.trim(),
    email: formData.email?.trim() || '',
    kategori: formData.kategori.trim(),
    lokasi: formData.lokasi?.trim() || '',
    detail: formData.detail.trim(),
    jumlah: formData.jumlah?.trim() || '',
    waktu: formData.waktu?.trim() || '',
    status: 'Baru',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('rfqs').insert({
      id: rfqId,
      nama: newRfq.nama,
      perusahaan: newRfq.perusahaan || null,
      whatsapp: newRfq.whatsapp,
      email: newRfq.email || null,
      kategori: newRfq.kategori,
      lokasi: newRfq.lokasi || null,
      detail: newRfq.detail,
      jumlah: newRfq.jumlah || null,
      waktu: newRfq.waktu || null,
      status: 'Baru',
    });

    if (error) {
      console.warn('[submitRfq] Supabase save fallback:', error);
      saveLocalRfq(newRfq);
    } else {
      console.log(`[submitRfq] RFQ ${rfqId} saved to Supabase.`);
    }
  } else {
    saveLocalRfq(newRfq);
  }

  return newRfq;
}

/**
 * Berlangganan real-time ke semua data RFQ untuk Admin
 */
export function subscribeToRfqs(
  callback: (rfqs: RfqItem[]) => void
): () => void {
  if (isSupabaseConfigured && supabase) {
    const fetchAndEmit = async () => {
      const { data, error } = await supabase
        .from('rfqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[subscribeToRfqs] Supabase error:', error);
        callback(getLocalRfqs());
        return;
      }
      callback((data as RfqRow[]).map(rowToRfqItem));
    };

    fetchAndEmit();

    const channel = supabase
      .channel('admin-rfqs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rfqs' }, () => fetchAndEmit())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  callback(getLocalRfqs());
  return () => {};
}

/**
 * Update status tindak lanjut RFQ
 */
export async function updateRfqStatus(
  rfqId: string,
  status: RfqItem['status'],
  adminNotes?: string
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const updates: Record<string, unknown> = { status };
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;
    const { error } = await supabase.from('rfqs').update(updates).eq('id', rfqId);
    if (error) console.error('[updateRfqStatus] Supabase error:', error);
  }

  try {
    const list = getLocalRfqs();
    const updated = list.map((item) =>
      item.id === rfqId ? { ...item, status, ...(adminNotes ? { adminNotes } : {}) } : item
    );
    localStorage.setItem(LOCAL_RFQS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
}

/**
 * Hapus RFQ
 */
export async function deleteRfq(rfqId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('rfqs').delete().eq('id', rfqId);
    if (error) console.error('[deleteRfq] Supabase error:', error);
  }

  try {
    const list = getLocalRfqs();
    const filtered = list.filter((item) => item.id !== rfqId);
    localStorage.setItem(LOCAL_RFQS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error(err);
  }
}
