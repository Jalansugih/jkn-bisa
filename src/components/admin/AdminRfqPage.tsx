import React, { useEffect, useMemo, useState } from 'react';
import { AdminSeed, RfqItem } from '../../types/admin';
import { updateRfqStatus, deleteRfq } from '../../lib/rfqService';
import { SITE_URL, waLink } from '../../lib/adminUtils';
import { rfqTime } from '../../lib/adminAnalytics';
import { timeAgo } from '../../lib/adminUtils';
import { useAdminDialogs } from './AdminDialogs';
import {
  Search,
  PhoneCall,
  Mail,
  Building,
  MapPin,
  Clock,
  Trash2,
  Save,
  Loader2,
  X,
  MessageCircle,
  Boxes,
  CalendarClock,
} from 'lucide-react';

interface AdminRfqPageProps {
  rfqs: RfqItem[];
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  seed?: AdminSeed | null;
  onSeedConsumed?: () => void;
}

type RfqStatus = RfqItem['status'];

const STATUS_ORDER: RfqStatus[] = ['Baru', 'Diproses', 'Penawaran Terkirim', 'Deal', 'Batal'];

const STATUS_META: Record<RfqStatus, { label: string; badge: string; chip: string }> = {
  Baru: {
    label: 'Baru Masuk',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    chip: 'border-amber-500 bg-amber-50 text-amber-800',
  },
  Diproses: {
    label: 'Sedang Diproses',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    chip: 'border-blue-600 bg-blue-50 text-blue-800',
  },
  'Penawaran Terkirim': {
    label: 'Penawaran Terkirim',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    chip: 'border-purple-600 bg-purple-50 text-purple-800',
  },
  Deal: {
    label: 'Deal',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    chip: 'border-emerald-600 bg-emerald-50 text-emerald-800',
  },
  Batal: {
    label: 'Batal / Tidak Sesuai',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    chip: 'border-rose-500 bg-rose-50 text-rose-800',
  },
};

export const AdminRfqPage: React.FC<AdminRfqPageProps> = ({ rfqs, showToast, seed, onSeedConsumed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RfqStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<RfqStatus>('Baru');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { confirm, dialogs } = useAdminDialogs();

  // Item terpilih selalu diambil dari data terbaru (realtime)
  const selectedRfq = selectedId ? rfqs.find((r) => r.id === selectedId) || null : null;

  const counts = useMemo(() => {
    const c: Record<'all' | RfqStatus, number> = { all: rfqs.length, Baru: 0, Diproses: 0, 'Penawaran Terkirim': 0, Deal: 0, Batal: 0 };
    rfqs.forEach((r) => {
      if (c[r.status] !== undefined) c[r.status]++;
    });
    return c;
  }, [rfqs]);

  const filteredRfqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rfqs.filter((rfq) => {
      if (statusFilter !== 'all' && rfq.status !== statusFilter) return false;
      if (!q) return true;
      return (
        rfq.id.toLowerCase().includes(q) ||
        rfq.nama.toLowerCase().includes(q) ||
        (rfq.perusahaan || '').toLowerCase().includes(q) ||
        rfq.whatsapp.toLowerCase().includes(q) ||
        rfq.kategori.toLowerCase().includes(q) ||
        rfq.detail.toLowerCase().includes(q)
      );
    });
  }, [rfqs, statusFilter, searchQuery]);

  const openDetail = (rfq: RfqItem) => {
    setSelectedId(rfq.id);
    setEditStatus(rfq.status);
    setAdminNotes(rfq.adminNotes || '');
  };

  // Perintah dari pencarian global / lonceng / kartu Ikhtisar
  useEffect(() => {
    if (!seed) return;
    if (seed.openId) {
      const found = rfqs.find((r) => r.id === seed.openId);
      if (!found && rfqs.length === 0) return; // data belum masuk
      if (found) openDetail(found);
      else showToast(`RFQ ${seed.openId} tidak ditemukan. Mungkin sudah dihapus.`, 'warning');
    } else {
      setSearchQuery(seed.query ?? '');
      setStatusFilter(seed.rfqStatus ?? 'all');
    }
    onSeedConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, rfqs.length]);

  useEffect(() => {
    if (!selectedRfq) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedRfq]);

  const hasChanges = !!selectedRfq && (editStatus !== selectedRfq.status || adminNotes !== (selectedRfq.adminNotes || ''));

  const handleSaveRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    setIsUpdating(true);
    try {
      await updateRfqStatus(selectedRfq.id, editStatus, adminNotes);
      showToast(`Pengajuan ${selectedRfq.id} diperbarui: ${STATUS_META[editStatus].label}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data RFQ.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (rfq: RfqItem) => {
    const ok = await confirm({
      title: 'Hapus pengajuan RFQ?',
      message: `RFQ ${rfq.id} dari ${rfq.perusahaan || rfq.nama} akan dihapus permanen beserta catatan timnya.`,
      confirmLabel: 'Ya, hapus',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await deleteRfq(rfq.id);
      showToast(`RFQ ${rfq.id} dihapus.`, 'info');
      if (selectedId === rfq.id) setSelectedId(null);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus pengajuan.', 'error');
    }
  };

  const firstContact = (rfq: RfqItem) =>
    waLink(
      rfq.whatsapp,
      `Halo Bapak/Ibu ${rfq.nama}, kami dari BinaUsaha (${SITE_URL}) menindaklanjuti pengajuan kebutuhan "${rfq.kategori}". Boleh kami bantu diskusikan detail kebutuhannya?`
    );

  const detailPanel = selectedRfq && (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Detail Pengajuan</span>
          <h3 className="font-heading font-extrabold text-base text-slate-900 truncate">
            {selectedRfq.id} - {selectedRfq.nama}
          </h3>
        </div>
        <button
          onClick={() => setSelectedId(null)}
          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          aria-label="Tutup detail"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Perusahaan: <strong>{selectedRfq.perusahaan || '-'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            WhatsApp:{' '}
            <a href={waLink(selectedRfq.whatsapp)} target="_blank" rel="noopener noreferrer" className="font-mono font-bold hover:text-emerald-600">
              {selectedRfq.whatsapp}
            </a>
          </span>
        </div>
        {selectedRfq.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500 shrink-0" />
            <a href={`mailto:${selectedRfq.email}`} className="hover:text-blue-600 truncate">
              {selectedRfq.email}
            </a>
          </div>
        )}
        {selectedRfq.lokasi && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Lokasi: {selectedRfq.lokasi}</span>
          </div>
        )}
        {selectedRfq.jumlah && (
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Volume / Jumlah: {selectedRfq.jumlah}</span>
          </div>
        )}
        {selectedRfq.waktu && (
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Target waktu: {selectedRfq.waktu}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Masuk: {selectedRfq.createdAt}</span>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Uraian Kebutuhan</label>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
          {selectedRfq.detail}
        </div>
      </div>

      <form onSubmit={handleSaveRfq} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">Status Tindak Lanjut</label>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_ORDER.map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setEditStatus(st)}
                className={`p-2 rounded-xl border text-[11px] font-bold text-left transition cursor-pointer ${
                  editStatus === st ? STATUS_META[st].chip : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                } ${st === 'Batal' ? 'col-span-2' : ''}`}
              >
                {STATUS_META[st].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">Catatan Internal Tim</label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Catatan penawaran harga, vendor rekanan yang ditugaskan..."
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-1 flex items-center gap-2">
          <a
            href={
              selectedRfq.status === 'Baru' && editStatus === 'Baru'
                ? firstContact(selectedRfq)
                : waLink(
                    selectedRfq.whatsapp,
                    `Halo Bapak/Ibu ${selectedRfq.nama}, berikut tindak lanjut dari BinaUsaha terkait kebutuhan ${selectedRfq.kategori}:\n\n` +
                      `Status: ${STATUS_META[editStatus].label}\n` +
                      (adminNotes ? `Catatan: ${adminNotes}\n` : '')
                  )
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <button
            type="submit"
            disabled={isUpdating || !hasChanges}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Simpan</span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(selectedRfq)}
            className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
            title="Hapus RFQ"
            aria-label="Hapus RFQ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div id="admin-rfq-page" className="space-y-5 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
            {(['all', ...STATUS_ORDER] as const).map((st) => {
              const on = statusFilter === st;
              const n = counts[st];
              const urgent = st === 'Baru' && n > 0;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  aria-pressed={on}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    on
                      ? 'bg-blue-600 text-white shadow-sm'
                      : urgent
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st} <span className={on ? 'text-white/80' : 'opacity-70'}>({n})</span>
                </button>
              );
            })}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, perusahaan, kategori, WA…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full lg:w-72"
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Alur: <strong>Baru</strong> → hubungi klien via WhatsApp → <strong>Diproses</strong> → kirim <strong>Penawaran</strong> → <strong>Deal</strong> atau Batal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-3">
          {filteredRfqs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs shadow-sm">
              {rfqs.length === 0 ? 'Belum ada pengajuan RFQ dari formulir.' : 'Tidak ada pengajuan RFQ yang cocok.'}
            </div>
          ) : (
            filteredRfqs.map((rfq) => {
              const isSelected = selectedId === rfq.id;
              const at = rfqTime(rfq);
              return (
                <div
                  key={rfq.id}
                  onClick={() => openDetail(rfq)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {rfq.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{rfq.nama}</span>
                        {rfq.perusahaan && <span className="text-xs text-slate-500 font-medium">• {rfq.perusahaan}</span>}
                      </div>
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {rfq.kategori}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${STATUS_META[rfq.status].badge}`}>
                      {rfq.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 my-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {rfq.detail}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span title={rfq.createdAt}>{at ? timeAgo(at) : rfq.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={firstContact(rfq)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1 font-bold"
                        title="Chat WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Hubungi</span>
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(rfq);
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                        title="Hapus RFQ"
                        aria-label={`Hapus RFQ ${rfq.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel detail: kolom kanan di layar lebar */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-2">
          {selectedRfq ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">{detailPanel}</div>
          ) : (
            <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
              Pilih salah satu pengajuan di sebelah kiri untuk melihat detail lengkap dan menindaklanjuti.
            </div>
          )}
        </div>
      </div>

      {/* Detail sebagai lembar bawah di ponsel/tablet */}
      {selectedRfq && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto shadow-2xl">{detailPanel}</div>
        </div>
      )}

      {dialogs}
    </div>
  );
};
