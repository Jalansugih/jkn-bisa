import React, { useState } from 'react';
import { RfqItem } from '../../types/admin';
import { updateRfqStatus, deleteRfq } from '../../lib/rfqService';
import {
  Search,
  Filter,
  PhoneCall,
  Mail,
  Building,
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Save,
  Loader2,
  X,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

interface AdminRfqPageProps {
  rfqs: RfqItem[];
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AdminRfqPage: React.FC<AdminRfqPageProps> = ({ rfqs, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRfq, setSelectedRfq] = useState<RfqItem | null>(null);
  const [editStatus, setEditStatus] = useState<RfqItem['status']>('Baru');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      rfq.id.toLowerCase().includes(q) ||
      rfq.nama.toLowerCase().includes(q) ||
      (rfq.perusahaan && rfq.perusahaan.toLowerCase().includes(q)) ||
      rfq.whatsapp.toLowerCase().includes(q) ||
      rfq.kategori.toLowerCase().includes(q) ||
      rfq.detail.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  const handleOpenDetail = (rfq: RfqItem) => {
    setSelectedRfq(rfq);
    setEditStatus(rfq.status);
    setAdminNotes(rfq.adminNotes || '');
  };

  const handleSaveRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    setIsUpdating(true);

    try {
      await updateRfqStatus(selectedRfq.id, editStatus, adminNotes);
      showToast(`Status pengajuan ${selectedRfq.id} berhasil diperbarui!`, 'success');
      setSelectedRfq((prev) => (prev ? { ...prev, status: editStatus, adminNotes } : null));
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data RFQ.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Hapus pengajuan RFQ #${id}?`)) return;
    try {
      await deleteRfq(id);
      showToast(`RFQ #${id} dihapus.`, 'info');
      if (selectedRfq?.id === id) {
        setSelectedRfq(null);
      }
    } catch (err: any) {
      showToast('Gagal menghapus pengajuan.', 'error');
    }
  };

  return (
    <div id="admin-rfq-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-slate-900">
            Pengajuan Kebutuhan & Tender (RFQ)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar permohonan spesifikasi custom dan pencarian vendor dari formulir
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, perusahaan, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Diproses">Diproses</option>
              <option value="Penawaran Terkirim">Penawaran Terkirim</option>
              <option value="Deal">Deal</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of RFQ cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List of RFQs */}
        <div className="lg:col-span-7 space-y-3">
          {filteredRfqs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs shadow-xs">
              Tidak ada pengajuan RFQ yang cocok.
            </div>
          ) : (
            filteredRfqs.map((rfq) => {
              const isSelected = selectedRfq?.id === rfq.id;
              return (
                <div
                  key={rfq.id}
                  onClick={() => handleOpenDetail(rfq)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {rfq.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {rfq.nama}
                        </span>
                        {rfq.perusahaan && (
                          <span className="text-xs text-slate-500 font-medium">
                            • {rfq.perusahaan}
                          </span>
                        )}
                      </div>
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {rfq.kategori}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        rfq.status === 'Deal'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rfq.status === 'Penawaran Terkirim'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : rfq.status === 'Diproses'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : rfq.status === 'Batal'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {rfq.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 my-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {rfq.detail}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>{rfq.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${rfq.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Halo Bapak/Ibu ${rfq.nama}, kami dari Manajemen BinaUsaha menindaklanjuti pengajuan kebutuhan "${rfq.kategori}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                        title="Chat WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(rfq.id);
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition"
                        title="Hapus RFQ"
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

        {/* RFQ Detail & Follow-up Drawer Panel */}
        <div className="lg:col-span-5">
          {selectedRfq ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Detail Pengajuan
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    {selectedRfq.id} - {selectedRfq.nama}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRfq(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inquiry Info */}
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Perusahaan: <strong>{selectedRfq.perusahaan || '-'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>WhatsApp: <strong className="font-mono">{selectedRfq.whatsapp}</strong></span>
                </div>
                {selectedRfq.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Email: {selectedRfq.email}</span>
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
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Volume / Jumlah: {selectedRfq.jumlah}</span>
                  </div>
                )}
              </div>

              {/* Detail Requirement */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Uraian Kebutuhan Pengadaan
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedRfq.detail}
                </div>
              </div>

              {/* Form Update Status */}
              <form onSubmit={handleSaveRfq} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Status Tindak Lanjut
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as RfqItem['status'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Baru">Baru Masuk</option>
                    <option value="Diproses">Sedang Diproses Tim</option>
                    <option value="Penawaran Terkirim">Proposal / Penawaran Terkirim</option>
                    <option value="Deal">Deal / Konversi Berhasil</option>
                    <option value="Batal">Batal / Tidak Sesuai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Catatan Internal Tim
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Catatan penawaran harga, vendor rekanan yang ditugaskan..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedRfq.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo Bapak/Ibu ${selectedRfq.nama}, berikut tindak lanjut penawaran dari BinaUsaha terkait kebutuhan ${selectedRfq.kategori}:\n\n` +
                        `Status: ${editStatus}\n` +
                        (adminNotes ? `Catatan: ${adminNotes}\n` : '')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Simpan</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
              Pilih salah satu item RFQ di sebelah kiri untuk melihat detail lengkap dan menindaklanjuti.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
