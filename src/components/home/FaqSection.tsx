import React, { useState } from 'react';
import { FAQ_LIST } from '../../data/mockData';
import { Search, ChevronDown, HelpCircle, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface FaqSectionProps {
  onAskWhatsapp: (topic: string) => void;
  onOpenConsultation: () => void;
  onSelectProduct: (prodKey: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onAskWhatsapp,
  onOpenConsultation,
  onSelectProduct,
}) => {
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq1', 'faq2']);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_LIST.filter((faq) => {
    const matchesCat = activeFaqCategory === 'all' || faq.category.includes(activeFaqCategory);
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answerHtml.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-20 bg-white border-t border-slate-200" id="faq">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-700 font-semibold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Tanya Jawab (FAQ)
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Pertanyaan Sering Diajukan
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Temukan jawaban cepat seputar legalitas PT Pro, pengerjaan website, sistem kasir, pembayaran, dan garansi layanan BinaUsaha.
          </p>
        </div>

        {/* FAQ Search & Filter Tabs */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="faqSearchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan (misal: PT Pro, DP, website)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition shadow-xs"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFaqCategory('all')}
              className={`faq-filter-btn px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition flex-shrink-0 cursor-pointer ${
                activeFaqCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveFaqCategory('legalitas')}
              className={`faq-filter-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 cursor-pointer ${
                activeFaqCategory === 'legalitas'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              PT & Legalitas
            </button>
            <button
              onClick={() => setActiveFaqCategory('website')}
              className={`faq-filter-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 cursor-pointer ${
                activeFaqCategory === 'website'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Website & Kasir
            </button>
            <button
              onClick={() => setActiveFaqCategory('pembayaran')}
              className={`faq-filter-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 cursor-pointer ${
                activeFaqCategory === 'pembayaran'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Pembayaran & Garansi
            </button>
            <button
              onClick={() => setActiveFaqCategory('pengerjaan')}
              className={`faq-filter-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 cursor-pointer ${
                activeFaqCategory === 'pengerjaan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Lacak & Durasi
            </button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4" id="faqAccordionList">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`faq-item bg-white rounded-2xl shadow-xs transition-all duration-200 overflow-hidden ${
                  faq.highlight
                    ? 'border-2 border-emerald-500 bg-emerald-50/20'
                    : 'border border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-heading font-bold text-slate-900 text-sm md:text-base hover:text-blue-600 transition focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center flex-shrink-0 ${
                        faq.highlight
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {faq.badge}
                    </span>
                    <span className={faq.highlight ? 'text-emerald-800 font-bold' : 'text-slate-900'}>
                      {faq.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
                      faq.highlight ? 'text-emerald-600' : 'text-slate-400'
                    } ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div
                    className={`px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm border-t leading-relaxed ${
                      faq.highlight
                        ? 'text-slate-700 border-emerald-200 bg-emerald-50/40'
                        : 'text-slate-600 border-slate-100 bg-slate-50/40'
                    }`}
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ CTA Footer Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border border-blue-700 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-200 backdrop-blur-md">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl md:text-2xl text-white">
            Masih Memiliki Pertanyaan Lain?
          </h3>
          <p className="text-xs md:text-sm text-blue-100/90 max-w-xl">
            Tim konsultan spesialis BinaUsaha siap membantu menjawab semua keraguan dan membimbing kebutuhan bisnis Anda.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onAskWhatsapp('Pertanyaan Seputar Layanan BinaUsaha')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Chat Konsultan via WhatsApp
            </button>
            <button
              onClick={onOpenConsultation}
              className="bg-white/15 hover:bg-white/25 text-white px-6 py-3 rounded-xl font-semibold text-xs md:text-sm transition border border-white/20 backdrop-blur cursor-pointer"
            >
              Jadwalkan Konsultasi Gratis
            </button>
          </div>
        </div>

        {/* Final High-Converting Call-To-Action Banner */}
        <div className="mt-16 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-center border border-blue-500">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-blue-100 border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Mulai Langkah Akselerasi Usaha
            </span>

            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight">
              Siap Mentransformasi & Merapikan Keuangan Bisnis Anda?
            </h2>

            <p className="text-xs md:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              Jangan biarkan pencatatan harian yang tercecer dan legalitas yang belum aman menghambat potensi pertumbuhan omset & ekspansi usaha Anda.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#harga"
                className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-900 px-8 py-4 rounded-xl font-extrabold text-sm transition duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
              >
                Pilih Paket Layanan Sekarang <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => onAskWhatsapp('Konsultasi Gratis Sebelum Pemesanan')}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-extrabold text-sm transition duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Konsultasi Gratis via WhatsApp
              </button>
            </div>

            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100/80 font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Proses Cepat & Transparan
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Garansi Pendampingan Sampai Tuntas
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 100% Legalitas Resmi AHU Kemenkumham
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
