import React, { useState } from 'react';
import { RfqFormData } from '../../types';
import { FilePlus, X, Send } from 'lucide-react';

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: RfqFormData) => void;
}

export const RfqModal: React.FC<RfqModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<RfqFormData>({
    nama: '',
    perusahaan: '',
    whatsapp: '',
    email: '',
    kategori: 'digital',
    lokasi: '',
    detail: '',
    jumlah: '',
    waktu: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSuccess(formData);
    onClose();

    const text = `Halo BinaUsaha, saya ingin mengajukan kebutuhan usaha:\n\n*Nama:* ${formData.nama}\n*Perusahaan:* ${formData.perusahaan || '-'}\n*WhatsApp:* ${formData.whatsapp}\n*Email:* ${formData.email || '-'}\n*Kategori:* ${formData.kategori}\n*Lokasi:* ${formData.lokasi || '-'}\n*Detail Kebutuhan:* ${formData.detail}\n*Volume:* ${formData.jumlah || '-'}\n*Waktu:* ${formData.waktu || '-'}`;
    window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      id="rfqModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-xs">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Ajukan Kebutuhan Usaha</h3>
            <p className="text-xs text-slate-500">Dapatkan penawaran terbaik dari mitra terverifikasi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Usaha / PT</label>
              <input
                type="text"
                value={formData.perusahaan}
                onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Nama Usaha / Toko"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp (Aktif) *</label>
              <input
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="08123456789"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="email@bisnis.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Kebutuhan *</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
              >
                <option value="digital">Digital & Teknologi</option>
                <option value="legalitas">Legalitas & Administrasi</option>
                <option value="konstruksi">Konstruksi & Perlengkapan</option>
                <option value="agro">Agro & Green Industry</option>
                <option value="pengadaan">Pengadaan Proyek & Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Kebutuhan</label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Kota / Provinsi"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detail Kebutuhan Spesifik *</label>
            <textarea
              required
              rows={3}
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none resize-none transition"
              placeholder="Jelaskan kebutuhan produk, jasa, atau spesifikasi yang Anda cari..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Jumlah</label>
              <input
                type="text"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Contoh: 1 paket / 10 unit"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Waktu</label>
              <input
                type="text"
                value={formData.waktu}
                onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Contoh: Segera / Bulan ini"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Pengajuan Kebutuhan</span>
          </button>
        </form>
      </div>
    </div>
  );
};
