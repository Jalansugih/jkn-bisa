import React from 'react';
import {
  MapPin,
  Mail,
  ChevronRight,
  ShieldCheck,
  FileText,
  Lock,
} from 'lucide-react';

interface FooterProps {
  onOpenOrderTracker: () => void;
  onOpenConsultation: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onSelectProduct: (prodKey: string) => void;
  onOpenArticlesHub?: (category?: string) => void;
  onOpenServicePage?: (serviceKey: 'digital' | 'legalitas' | 'konstruksi' | 'agro') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOrderTracker,
  onOpenConsultation,
  onOpenTerms,
  onOpenPrivacy,
  onSelectProduct,
  onOpenArticlesHub,
  onOpenServicePage,
  onOpenAdmin,
}) => {
  return (
    <footer id="kontak" className="bg-slate-900 border-t border-slate-800 pt-16 pb-10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-heading font-bold shadow-md shadow-blue-500/20">
                B
              </div>
              <span className="font-heading font-bold text-lg text-white">
                BinaUsaha<span className="text-blue-400">.id</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Solusi Umkm Platform digital dan penghubung kebutuhan legalitas & operasional usaha, dengan jaringan mitra profesional terverifikasi.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Layanan Resmi UMKM Terverifikasi
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-4">Jasa & Solusi</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onOpenServicePage?.('digital')}
                  className="hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Digital & Teknologi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenServicePage?.('legalitas')}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-400" /> Legalitas & Perizinan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenServicePage?.('konstruksi')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" /> Konstruksi & Material
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenServicePage?.('agro')}
                  className="hover:text-green-400 transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-green-400" /> Agro & Green Industri
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-4">Edukasi & Tautan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    if (onOpenArticlesHub) {
                      onOpenArticlesHub();
                    } else {
                      const el = document.getElementById('artikel');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Artikel & Tips Bisnis
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOrderTracker}
                  className="hover:text-blue-400 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Cek Status Pesanan
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-blue-400 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Konsultasi Gratis
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Pertanyaan Sering Diajukan (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-xs text-slate-400 mb-5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Perumahan Mahkota Blok F No.2 Karangtengah Cianjur 43281
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:hallo@binausaha.id" className="hover:text-blue-400 transition font-medium">
                  hallo@binausaha.id
                </a>
              </li>
            </ul>

            <div className="space-y-2 pt-1 border-t border-slate-800">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Ikuti Media Sosial:
              </span>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram BinaUsaha"
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 hover:border-pink-500 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube BinaUsaha"
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok BinaUsaha"
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.33 1.52-1.33 2.52.01.98.53 1.91 1.37 2.43.91.56 2.1.58 3.02.04.81-.46 1.34-1.33 1.41-2.27.08-2.81.04-5.63.05-8.44 0-2.45 0-4.91.01-7.36z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6285195979888?text=Halo%20BinaUsaha,%20saya%20butuh%20bantuan%20dan%20konsultasi%20layanan."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp BinaUsaha"
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Transparency Disclaimer & Syarat Ketentuan Container */}
        <div className="bg-slate-800/60 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl mb-8 space-y-6">
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 text-xs text-slate-400 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-white text-xs sm:text-sm block">
                Pernyataan Transparansi & Ketentuan Layanan BinaUsaha
              </span>
              <p className="leading-relaxed">
                BinaUsaha bertindak sebagai platform digital dan penghubung kebutuhan legalitas & operasional usaha. Kami menghubungkan permintaan Anda secara aman dengan jaringan mitra profesional terverifikasi di bidangnya. BinaUsaha menjamin transparansi biaya, perlindungan data, dan kepatuhan hukum sesuai Syarat & Ketentuan yang berlaku.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p className="font-medium text-center md:text-left">
              &copy; {new Date().getFullYear()} BinaUsaha Indonesia. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="flex items-center gap-6 font-semibold">
              <button
                onClick={onOpenTerms}
                className="text-blue-400 hover:text-blue-300 hover:underline transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Syarat & Ketentuan
              </button>
              <button
                onClick={onOpenPrivacy}
                className="text-slate-400 hover:text-slate-200 hover:underline transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" /> Kebijakan Privasi
              </button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-500 hover:text-amber-400 hover:underline transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Panel Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
