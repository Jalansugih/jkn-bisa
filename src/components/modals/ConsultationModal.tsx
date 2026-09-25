import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Sparkles,
  Bot,
  Send,
  Loader2,
  Calendar,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const QUICK_PROMPT_SUGGESTIONS = [
  'Cara mendirikan PT Perorangan untuk UMKM 2026',
  'Syarat mendapatkan NIB OSS & Sertifikasi Halal BPJPH',
  'Rekomendasi fitur wajib untuk website toko online',
  'Cara kerja mesin kasir RajaKas & sinkronisasi stok',
  'Perbedaan izin usaha PT vs CV untuk tender pengadaan',
];

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'schedule'>('ai');

  // AI Chat state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTopic, setAiTopic] = useState('Legalitas & Perizinan');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [businessName, setBusinessName] = useState('');

  // Human Schedule form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [topic, setTopic] = useState('Website & Digital');

  if (!isOpen) return null;

  const handleAskAI = async (promptToUse?: string) => {
    const query = promptToUse || aiPrompt;
    if (!query.trim()) {
      showToast('Tulis pertanyaan Anda untuk AI Konsultan', 'warning');
      return;
    }

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          topic: aiTopic,
          businessName: businessName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghubungi AI Konsultan');
      }

      setAiResponse(data.text);
      showToast('Analisis konsultasi AI selesai!', 'success');
    } catch (err: any) {
      console.error('AI Consult error:', err);
      // Fallback helpful guidance if offline or without internet
      setAiResponse(
        `💡 **Rekomendasi Cepat BinaUsaha untuk "${query}":**\n\n` +
          `1. **Legalitas:** Untuk usaha perorangan, kami rekomendasikan **PT Perorangan** karena proses 100% online, biaya terjangkau (mulai Rp 1.999.000), dan aset pribadi terpisah dari risiko usaha.\n` +
          `2. **Perizinan Dasar:** Pastikan sudah memiliki **NIB (Nomor Induk Berusaha)** melalui OSS RBA serta pengajuan Sertifikat Halal BPJPH.\n` +
          `3. **Digitalisasi:** Bangun website toko online terintegrasi payment QRIS agar omzet bisa dicatat otomatis di aplikasi kasir **RajaKas**.\n\n` +
          `👉 *Ingin konsultasi langsung dengan konsultan legal kami? Klik tab "Jadwal Konsultasi" di atas.*`
      );
      showToast('Menampilkan ringkasan panduan konsultasi', 'info');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleHumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || !whatsapp.trim()) {
      showToast('Mohon lengkapi seluruh formulir', 'warning');
      return;
    }

    onClose();
    showToast('Jadwal Konsultasi Terkirim! Menghubungkan ke WhatsApp...', 'success');

    const text = `Halo BinaUsaha, saya *${name.trim()}* (${brand.trim()}) ingin menjadwalkan Konsultasi Gratis mengenai *${topic}*. No WA: ${whatsapp.trim()}.`;
    window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      id="consultationModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-blue-600/20 flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Konsultasi Bisnis & Legalitas
                </h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  AI Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Dapatkan solusi instan dari AI atau jadwalkan sesi bersama tim ahli
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`pb-2.5 px-3.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'ai'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tanya AI Konsultan (Instan)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`pb-2.5 px-3.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal Konsultasi WhatsApp</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'ai' ? (
            <div className="space-y-4">
              {/* Quick AI Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Nama Brand / Usaha (Opsional)
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Contoh: Kopi Janji Berkah"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Topik Konsultasi
                    </label>
                    <select
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    >
                      <option value="Legalitas & Perizinan">Legalitas PT/CV & NIB RBA</option>
                      <option value="Website & Toko Online">Website Toko & Payment Gateway</option>
                      <option value="Kasir POS RajaKas">Aplikasi Kasir POS & Hardware</option>
                      <option value="Sertifikasi Halal">Sertifikasi Halal BPJPH</option>
                      <option value="Strategi Usaha">Strategi Scale-Up & Paket Usaha</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Pertanyaan Anda
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Tuliskan kendala usaha, rencana bisnis, atau pertanyaan seputar legalitas / website / sistem kasir..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Rekomendasi:
                    </span>
                    {QUICK_PROMPT_SUGGESTIONS.slice(0, 3).map((promptText) => (
                      <button
                        key={promptText}
                        type="button"
                        onClick={() => {
                          setAiPrompt(promptText);
                          handleAskAI(promptText);
                        }}
                        className="text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg transition cursor-pointer"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAskAI()}
                    disabled={isAiLoading || !aiPrompt.trim()}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer ml-auto"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menganalisis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Analisis dengan AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Response Display */}
              {aiResponse && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span>Rekomendasi AI Konsultan BinaUsaha:</span>
                    </div>
                    <button
                      onClick={() => setAiResponse(null)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {aiResponse}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Butuh eksekusi langsung paket ini?
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        const el = document.getElementById('produk');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Daftar Paket Usaha</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleHumanSubmit} className="space-y-3">
              <input
                type="text"
                id="consultName"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Nama Lengkap Anda *"
              />
              <input
                type="text"
                id="consultBrand"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="Nama Usaha / Produk *"
              />
              <input
                type="tel"
                id="consultWA"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                placeholder="No WhatsApp Active *"
              />
              <select
                id="consultTopic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
              >
                <option value="Website & Digital">Konsultasi Pembuatan Website Toko</option>
                <option value="Sistem Kasir POS">Konsultasi Kasir Digital RajaKas</option>
                <option value="Legalitas NIB Halal">Pengurusan NIB & Halal BPJPH</option>
                <option value="Pendirian PT / CV">Pendirian PT / CV Badan Usaha</option>
                <option value="Pengembangan Usaha">Strategi Scale-Up & Branding</option>
              </select>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim & Hubungi Konsultan di WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
