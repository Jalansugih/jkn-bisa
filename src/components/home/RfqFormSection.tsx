import React, { useState, useEffect } from 'react';
import { RfqFormData } from '../../types';
import { Zap, ShieldCheck, Coins, Send, Sparkles, Loader2, Bot, CheckCircle2 } from 'lucide-react';

interface RfqFormSectionProps {
  initialCategory?: string;
  onSubmitSuccess: (data: RfqFormData) => void;
}

export const RfqFormSection: React.FC<RfqFormSectionProps> = ({
  initialCategory,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<RfqFormData>({
    nama: '',
    perusahaan: '',
    whatsapp: '',
    email: '',
    kategori: initialCategory || '',
    lokasi: '',
    detail: '',
    jumlah: '',
    waktu: '',
  });

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setFormData((prev) => ({ ...prev, kategori: initialCategory }));
    }
  }, [initialCategory]);

  const handleAiAnalyze = async () => {
    if (!formData.detail.trim() && !formData.kategori) {
      alert('Mohon isi minimal kategori atau detail kebutuhan untuk dianalisis oleh AI.');
      return;
    }

    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const res = await fetch('/api/gemini/rfq-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqData: formData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menganalisis');
      setAiAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAiAnalysis(
        `📌 **Rekomendasi Cepat Pengadaan BinaUsaha:**\n\n` +
          `• **Kategori Terpilih:** ${formData.kategori || 'Digital / Legalitas'}\n` +
          `• **Estimasi Waktu Pengerjaan:** 3 - 7 Hari Kerja\n` +
          `• **Kelengkapan Dokumen yang Disarankan:** KTP Direktur/Penanggungjawab, NPWP, dan draft nama usaha.\n` +
          `• **Tindak Lanjut:** Tim procurement kami siap memberikan penawaran harga vendor terbaik segera setelah formulir dikirimkan.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSuccess(formData);

    // Format WhatsApp redirect message
    const text = `Halo BinaUsaha, saya ingin mengajukan kebutuhan usaha:\n\n*Nama:* ${formData.nama}\n*Perusahaan:* ${formData.perusahaan || '-'}\n*WhatsApp:* ${formData.whatsapp}\n*Email:* ${formData.email || '-'}\n*Kategori:* ${formData.kategori}\n*Lokasi:* ${formData.lokasi || '-'}\n*Detail Kebutuhan:* ${formData.detail}\n*Volume/Jumlah:* ${formData.jumlah || '-'}\n*Target Waktu:* ${formData.waktu || '-'}\n\nMohon bantuannya untuk penawaran terbaik. Terima kasih.`;
    window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="py-20 bg-slate-50/60 text-slate-900 relative overflow-hidden border-t border-slate-200" id="kebutuhan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Information Info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block shadow-xs">
              Layanan Pengajuan Bebas Biaya
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 leading-tight">
              Ajukan Kebutuhan Usaha Anda Sekarang
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Sampaikan detail produk, jasa, atau perizinan yang Anda cari. Tim BinaUsaha akan membantu mencarikan opsi penawaran terbaik dari jaringan mitra penyedia terverifikasi.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">Respon Cepat</h4>
                  <p className="text-xs text-slate-600">Tim kami akan merespon pengajuan dalam rentang 1x24 jam kerja.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">Mitra Terverifikasi</h4>
                  <p className="text-xs text-slate-600">Hanya dihubungkan dengan vendor & mitra yang memiliki kredibilitas teruji.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-200">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">Penawaran Transparan</h4>
                  <p className="text-xs text-slate-600">Dapatkan rincian estimasi biaya dan spesifikasi transparan tanpa biaya tersembunyi.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-950/5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">Formulir Pengajuan Kebutuhan</h3>
                <p className="text-xs text-slate-500">Lengkapi informasi kebutuhan usaha Anda di bawah ini.</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Assisted</span>
              </span>
            </div>

            <form id="rfqMainForm" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="rfqNama"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Usaha / Perusahaan / Instansi</label>
                  <input
                    type="text"
                    id="rfqPerusahaan"
                    value={formData.perusahaan}
                    onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                    placeholder="Contoh: PT Bina Maju / Toko Sumber Rejeki"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    No. WhatsApp (Aktif) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="rfqWhatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    id="rfqEmail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Contoh: email@perusahaan.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori Kebutuhan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="rfqKategori"
                    required
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  >
                    <option value="" className="text-slate-400">-- Pilih Kategori --</option>
                    <option value="digital" className="text-slate-900">Digital & Teknologi (Website, POS, Hardware)</option>
                    <option value="legalitas" className="text-slate-900">Legalitas & Administrasi (PT, CV, NIB, Halal, HAKI)</option>
                    <option value="konstruksi" className="text-slate-900">Konstruksi & Material Bangunan</option>
                    <option value="agro" className="text-slate-900">Agro & Green Industry (Bibit, Pupuk, Landscape)</option>
                    <option value="pengadaan" className="text-slate-900">Pengadaan Proyek & Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Lokasi / Domisili Kebutuhan</label>
                  <input
                    type="text"
                    id="rfqLokasi"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Contoh: Surabaya / Jakarta / Seluruh Indonesia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Detail Kebutuhan Produk / Jasa / Spesifikasi <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAiAnalyze}
                    disabled={isAnalyzing}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-blue-500" />
                    )}
                    <span>Analisis Cepat AI</span>
                  </button>
                </div>
                <textarea
                  id="rfqDetail"
                  required
                  rows={3}
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  placeholder="Jelaskan kebutuhan Anda secara spesifik. Contoh: Membutuhkan 10 unit laptop kantor i5, pendirian PT baru, dan pendaftaran sertifikasi halal."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white resize-none transition"
                />
              </div>

              {/* AI Analysis Preview Box */}
              {aiAnalysis && (
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-blue-800">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span>Hasil Analisis Awal AI:</span>
                  </div>
                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[11px]">
                    {aiAnalysis}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimasi Jumlah / Volume</label>
                  <input
                    type="text"
                    id="rfqJumlah"
                    value={formData.jumlah}
                    onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                    placeholder="Contoh: 10 unit / 1 paket / 500 kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Waktu Kebutuhan</label>
                  <input
                    type="text"
                    id="rfqWaktu"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    placeholder="Contoh: Segera / 1 Minggu / Bulan Depan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-rfq-submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm transition duration-300 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 pt-3 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pengajuan Kebutuhan</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
