import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileCheck,
  Building2,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  FilePlus,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  Building,
  Scale,
  Stamp,
  BookOpen,
  Check,
  Gift,
} from 'lucide-react';
import { ServiceNavTabs, ServicePageKey } from './ServiceNavTabs';

interface LegalitasServicePageProps {
  onBackToHome: () => void;
  onSelectService: (service: ServicePageKey) => void;
  onOpenOrder: (productKey: string) => void;
  onOpenRfq: (kategori: string) => void;
  onOpenConsultation: () => void;
  onAskWhatsapp: (topic: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  initialTab?: string;
  scrollTarget?: string;
}

export const LegalitasServicePage: React.FC<LegalitasServicePageProps> = ({
  onBackToHome,
  onSelectService,
  onOpenOrder,
  onOpenRfq,
  onOpenConsultation,
  onAskWhatsapp,
  showToast,
  initialTab,
  scrollTarget,
}) => {
  const [activeTab, setActiveTab] = useState<'pt' | 'cv' | 'nib' | 'halal-merek'>('pt');
  const [selectedEntityCheck, setSelectedEntityCheck] = useState<'pt' | 'cv' | 'perorangan' | 'yayasan' | 'koperasi' | 'merek'>('pt');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (initialTab && ['pt', 'cv', 'nib', 'halal-merek'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
    if (scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialTab, scrollTarget]);

  const faqs = [
    {
      q: 'Berapa lama proses pendirian PT hingga terbit SK Kemenkumham?',
      a: 'Proses pendirian PT bersama BinaUsaha memakan waktu rata-rata 2 hingga 4 hari kerja setelah nama PT disetujui di AHU Online dan berkas ditandatangani oleh para pendiri.',
    },
    {
      q: 'Apa perbedaan PT Standar dan PT Perorangan?',
      a: 'PT Standar didirikan oleh minimal 2 orang pemegang saham, memiliki Direktur dan Komisaris, serta cocok untuk usaha skala menengah ke atas dan investasi. Sedangkan PT Perorangan didirikan oleh 1 orang WNI untuk skala Usaha Mikro & Kecil (UMK) dengan proses yang lebih ringkas.',
    },
    {
      q: 'Apakah biaya pendirian PT sudah termasuk NIB dan NPWP Badan?',
      a: 'Ya! Paket PT Pro di BinaUsaha adalah paket All-in-One: sudah termasuk Akta Notaris, SK Kemenkumham, NPWP Badan + SKT Pajak, NIB OSS RBA, serta Bonus Spesial Software Keuangan Usaha senilai Rp 2.100.000.',
    },
    {
      q: 'Apakah bisa mengurus legalitas jika kami belum memiliki kantor fisik?',
      a: 'Bisa! Kami menyediakan opsi Virtual Office berzonasi perkantoran komersial resmi lengkap dengan domisili hukum, layanan resepsionis, dan fasilitas meeting room.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Nav Switcher */}
      <ServiceNavTabs
        activeService="legalitas"
        onSelectService={onSelectService}
        onBackToHome={onBackToHome}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Layanan Notariat & Perizinan OSS RBA Resmi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
                Legalkan Usaha Anda, <span className="text-emerald-400">Aman & Terpercaya</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Urus pendirian PT, CV, Yayasan, NIB RBA, Sertifikasi Halal, BPOM, dan Hak Merek DJKI bersama tim notaris berpengalaman. Dapatkan bonus software keuangan untuk akselerasi bisnis Anda.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onAskWhatsapp('Konsultasi Legalitas & Perizinan Usaha BinaUsaha')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konsultasi Notaris via WA</span>
                </button>
                <button
                  onClick={() => onOpenOrder('pt_pro')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Pesan Paket PT Pro (Diskon 50%)</span>
                </button>
                <a
                  href="#legal-checker"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20 transition flex items-center gap-2"
                >
                  <span>Cek Syarat Dokumen</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Key Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                <div>
                  <p className="text-2xl font-black text-emerald-400 font-heading">1.200+</p>
                  <p className="text-xs text-slate-400">Badan Usaha Didirikan</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-blue-400 font-heading">100%</p>
                  <p className="text-xs text-slate-400">Resmi Kemenkumham & AHU</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-400 font-heading">2-3 Hari</p>
                  <p className="text-xs text-slate-400">Estimasi Proses Kilat</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-purple-400 font-heading">Gratis</p>
                  <p className="text-xs text-slate-400">App Keuangan Rp 2.1 Jt</p>
                </div>
              </div>
            </div>

            {/* Visual Promo Box */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                  Promo Terbatas
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Stamp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Paket Pendirian PT Pro</h3>
                    <p className="text-xs text-emerald-400 font-semibold">Termasuk Semua Dokumen Siap Operasional</p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-heading">Rp 6.998.600</span>
                    <span className="text-xs text-slate-400 line-through">Rp 13.997.200</span>
                    <span className="text-[11px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                      Hemat 50%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Biaya all-in tidak ada tambahan tersembunyi</p>
                </div>

                {/* Free Bonus Box */}
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-start gap-3">
                  <Gift className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-bounce" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-300">GRATIS System Keuangan UMKM Pro!</p>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      Dapatkan lisensi aplikasi pencatatan keuangan & invoice otomatis senilai Rp 2.100.000 gratis.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Akta Notaris & SK Menkumham Resmi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>NPWP Badan Usaha & SKT Pajak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>NIB OSS RBA (KBLI 2020 Terupdate)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Pendampingan Buka Rekening Giro Perusahaan</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenOrder('pt_pro')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Ambil Promo PT Pro Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Offerings Tabs */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Layanan Legalitas Lengkap
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              Solusi Badan Hukum & Perizinan Terpadu
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Lindungi aset bisnis Anda, ikuti tender proyek, dan buka rekening giro dengan badan hukum yang sah.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: 'pt', label: 'Pendirian PT (Perseroan Terbatas)', icon: Building2 },
              { id: 'cv', label: 'Pendirian CV & Yayasan', icon: Building },
              { id: 'nib', label: 'NIB OSS RBA & Izin Edar', icon: Scale },
              { id: 'halal-merek', label: 'Halal BPJPH & Merek DJKI', icon: Award },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
            {activeTab === 'pt' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <Building2 className="w-4 h-4" />
                      <span>PT Standar & PT Perorangan</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Bentuk Badan Hukum Terbaik untuk Akselerasi dan Pendanaan
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Dengan status PT, tanggung jawab pemegang saham terbatas hanya pada modal yang disetor. Sangat disyaratkan untuk kerjasama korporat, B2B procurement, dan pengajuan tender pemerintah.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Akta Pendirian Notaris Resmi',
                        'SK Pengesahan Kemenkumham RI',
                        'NPWP Badan Usaha & SKT Pajak',
                        'NIB (Nomor Induk Berusaha)',
                        'Pernyataan Mandiri K3L & Tata Ruang',
                        'Draft Surat Kuasa & Rekening Bank',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => onOpenOrder('pt_pro')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                      >
                        Pesan Paket PT Pro (Rp 6.998.600)
                      </button>
                      <button
                        onClick={() => onAskWhatsapp('Konsultasi Pendirian PT Standar vs PT Perorangan')}
                        className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                      >
                        Tanya Notaris via WA
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                    <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                      Dokumen Syarat Pendirian PT:
                    </h4>
                    <ul className="space-y-3 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span><strong>KTP & NPWP Pribadi</strong> para pendiri (minimal 2 orang untuk PT Standar, 1 orang untuk PT Perorangan).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span><strong>3 Pilihan Nama PT</strong> (terdiri dari 3 kata berbahasa Indonesia).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Alamat Domisili Usaha</strong> (alamat ruko, kantor, atau virtual office).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Bidang Usaha (KBLI)</strong> sesuai fokus kegiatan operasional bisnis Anda.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sub-cards for PT Perorangan variants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500/80 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          Hemat 67% • 1 Pendiri
                        </span>
                        <span className="text-xs text-slate-400">Proses 1-2 Hari</span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-900">Paket PT Perorangan (Tanpa Notaris)</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Pernyataan pendirian resmi Kemenkumham tanpa akta penegasan notaris, sangat pas untuk UMKM mikro mandiri.
                      </p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-600 font-heading">Rp 700.000</span>
                        <span className="text-xs text-slate-400 line-through">Rp 2.100.000</span>
                        <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 font-bold px-1.5 py-0.5 rounded">
                          -67%
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">✓ Pernyataan Pendirian Resmi AHU Kemenkumham</li>
                        <li className="flex items-center gap-2">✓ Sertifikat Pendaftaran Menkumham RI</li>
                        <li className="flex items-center gap-2">✓ NPWP Badan PT Perorangan & SKT</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA & KBLI 2020</li>
                        <li className="flex items-center gap-2 text-slate-400">✕ Tanpa Akta Penegasan Notaris</li>
                      </ul>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => onOpenOrder('pt_perorangan')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Pilih PT Perorangan (Rp 700rb)
                      </button>
                      <button
                        onClick={() => onAskWhatsapp('Tanya Paket PT Perorangan Rp 700.000')}
                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        WA
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-teal-500 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
                          Plus Akta Penegasan Notaris
                        </span>
                        <span className="text-xs text-slate-400">Proses 2-3 Hari</span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-900">PT Perorangan + Akta Notaris</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Pendirian PT Perorangan lengkap dengan Akta Penegasan Notaris resmi untuk kemudahan perbankan & tender.
                      </p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-teal-700 font-heading">Rp 1.700.000</span>
                        <span className="text-xs text-slate-400 line-through">Rp 3.400.000</span>
                        <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 font-bold px-1.5 py-0.5 rounded">
                          -50%
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2 font-semibold text-teal-900">✓ Akta Penegasan Notaris Resmi & Berita Acara</li>
                        <li className="flex items-center gap-2">✓ SK Pengesahan Kemenkumham RI & AHU</li>
                        <li className="flex items-center gap-2">✓ NPWP Badan Usaha & SKT Pajak</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA & KBLI Terupdate</li>
                        <li className="flex items-center gap-2">✓ Dampingi Rekening Giro Bank PT</li>
                      </ul>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => onOpenOrder('pt_perorangan_notaris')}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Pilih PT + Akta Notaris (Rp 1.7Jt)
                      </button>
                      <button
                        onClick={() => onAskWhatsapp('Tanya Paket PT Perorangan Notaris Rp 1.700.000')}
                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        WA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cv' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                      <Building className="w-4 h-4" />
                      <span>Pendirian CV, Yayasan & Koperasi</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Solusi Usaha & Lembaga Legal Tanpa Batasan Modal Minimum
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Layanan pendirian badan usaha CV untuk kemitraan bisnis, Yayasan untuk lembaga sosial/keagamaan/pendidikan, dan Koperasi untuk usaha bersama anggota.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Akta Pendirian Notaris Resmi',
                        'SK Terdaftar di AHU Kemenkumham',
                        'NPWP Badan Usaha & SKT Pajak',
                        'NIB OSS RBA Terpadu',
                        'Struktur Pengurus & Anggota/Sekutu',
                        'Proses Cepat & Bergaransi',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => onOpenOrder('cv_pro')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                      >
                        Ajukan Pendirian CV (Rp 5.498.600)
                      </button>
                      <button
                        onClick={() => onAskWhatsapp('Konsultasi Pendirian CV, Yayasan & Koperasi')}
                        className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                      >
                        Tanya Notaris via WA
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                    <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                      Pilihan Bentuk Badan Lainnya:
                    </h4>
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-900">🏢 CV (Persekutuan Komanditer) - Rp 5.498.600</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Fleksibel penarikan prive, ideal untuk kemitraan rekanan.</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-900">🏛️ Yayasan (Sosial & Pendidikan) - Rp 5.200.000</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Badan hukum nirlaba untuk sekolah, panti, dakwah, dan kegiatan sosial.</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-900">👥 Koperasi (Usaha Bersama) - Rp 5.500.000</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Badan usaha berasaskan kekeluargaan untuk simpan pinjam / konsumen / jasa.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-cards for Yayasan and Koperasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                  <div className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          Badan Hukum Sosial & Edukasi
                        </span>
                        <span className="text-xs text-slate-400">Proses 5-7 Hari</span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-900">Paket Pendirian Yayasan</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Pendirian badan hukum Yayasan resmi Kemenkumham RI untuk sosial, pendidikan, kemanusiaan, dan keagamaan.
                      </p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-700 font-heading">Rp 5.200.000</span>
                        <span className="text-xs text-slate-400 line-through">Rp 7.800.000</span>
                        <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 font-bold px-1.5 py-0.5 rounded">
                          -33%
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">✓ Akta Pendirian Notaris Resmi</li>
                        <li className="flex items-center gap-2">✓ SK Pengesahan Kemenkumham RI</li>
                        <li className="flex items-center gap-2">✓ NPWP Badan Yayasan & SKT Pajak</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA & Izin Operasional Lembaga</li>
                        <li className="flex items-center gap-2">✓ Struktur Pembina, Pengurus & Pengawas</li>
                      </ul>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => onOpenOrder('yayasan_pro')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Pilih Paket Yayasan (Rp 5.2Jt)
                      </button>
                      <button
                        onClick={() => onAskWhatsapp('Tanya Paket Pendirian Yayasan Rp 5.200.000')}
                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        WA
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-blue-300 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                          Badan Hukum Koperasi
                        </span>
                        <span className="text-xs text-slate-400">Proses 7-10 Hari</span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-900">Paket Pendirian Koperasi</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Pendirian badan hukum Koperasi resmi terdaftar di Kemenkumham RI dan Kemenkop UKM.
                      </p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-blue-700 font-heading">Rp 5.500.000</span>
                        <span className="text-xs text-slate-400 line-through">Rp 7.900.000</span>
                        <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 font-bold px-1.5 py-0.5 rounded">
                          -30%
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">✓ Berita Acara Rapat & Akta Notaris NPAK</li>
                        <li className="flex items-center gap-2">✓ SK Pengesahan Badan Hukum Menkumham</li>
                        <li className="flex items-center gap-2">✓ NPWP Badan Koperasi & SKT Pajak</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA Simpan Pinjam / Konsumen / Jasa</li>
                        <li className="flex items-center gap-2">✓ Penyusunan AD/ART Bersama Notaris</li>
                      </ul>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => onOpenOrder('koperasi_pro')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Pilih Paket Koperasi (Rp 5.5Jt)
                      </button>
                      <button
                        onClick={() => onAskWhatsapp('Tanya Paket Pendirian Koperasi Rp 5.500.000')}
                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        WA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nib' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                    <Scale className="w-4 h-4" />
                    <span>NIB OSS RBA & Izin Sektoral PB-UMKU</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Satu Nomor Induk Berusaha untuk Seluruh Aktivitas Operasional
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    NIB berfungsi sebagai identitas berusaha, Angka Pengenal Impor (API), dan hak akses kepabeanan. Kami membantu pemetaan kode KBLI 2020 yang tepat dan pengurusan izin sektoral risiko menengah-tinggi.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Penerbitan NIB OSS RBA Kilat',
                      'Pemetaan KBLI 2020 Terupdate',
                      'Sertifikat Standar Usaha',
                      'Persetujuan Kesesuaian Tata Ruang (KKPR)',
                      'Pernyataan Lingkungan SPPL / UKL-UPL',
                      'Pelaporan LKPM Berkala',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Pengurusan NIB & Perizinan OSS')}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Urus NIB OSS RBA Sekarang
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Konsultasi KBLI & NIB OSS RBA')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Cek KBLI Usaha Saya
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Klasifikasi Tingkat Risiko OSS RBA:
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-900">🟢 Risiko Rendah:</span>
                      <p className="text-emerald-700 text-[11px]">Cukup NIB langsung terbit otomatis sebagai izin operasional penuh.</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="font-bold text-amber-900">🟡 Risiko Menengah Rendah / Tinggi:</span>
                      <p className="text-amber-700 text-[11px]">Membutuhkan Sertifikat Standar yang diverifikasi oleh instansi teknis.</p>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                      <span className="font-bold text-rose-900">🔴 Risiko Tinggi:</span>
                      <p className="text-rose-700 text-[11px]">Membutuhkan Izin Usaha khusus dan audit dokumen AMDAL / Andal Lalin.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'halal-merek' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">
                    <Award className="w-4 h-4" />
                    <span>Sertifikasi Halal & Pendaftaran Merek DJKI</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Lindungi Brand Anda & Tingkatkan Kepercayaan Konsumen
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Daftarkan merek dagang bisnis Anda ke DJKI Kemenkumham agar tidak diserobot kompetitor, serta penuhi kewajiban Sertifikasi Halal BPJPH untuk seluruh produk makanan, minuman, dan kosmetik.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Penelusuran Merek di Database DJKI',
                      'Pendaftaran Hak Cipta & Desain Industri',
                      'Sertifikasi Halal Self-Declare & Reguler',
                      'Pendampingan Penyusunan SJPH Halal',
                      'Izin Edar BPOM & PIRT Dinkes',
                      'Perlindungan Hukum Merek 10 Tahun',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenRfq('Pendaftaran Merek & Halal')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Daftarkan Merek / Halal
                    </button>
                    <button
                      onClick={() => onAskWhatsapp('Cek Ketersediaan Merek Dagang')}
                      className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                    >
                      Cek Nama Merek Gratis via WA
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                    Manfaat Perlindungan Merek & Halal:
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-900">Hak Monopoli Nama Dagang</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Mencegah pihak lain meniru logo dan nama brand Anda di seluruh Indonesia.</p>
                    </li>
                    <li className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-900">Akses Masuk Modern Retail (Indomaret, Alfamart, Supermarket)</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">Sertifikat Halal & izin resmi adalah syarat wajib listing produk di retail nasional.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Legal Requirements Checker */}
      <section id="legal-checker" className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pemeriksa Kebutuhan
              </span>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mt-2">
                Pilih Bentuk Usaha & Cek Dokumen yang Anda Dapatkan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ketahui rincian berkas resmi yang akan terbit sesuai kebutuhan badan hukum pilihan Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {[
                { id: 'pt', label: 'PT Standar', desc: 'Min. 2 Pendiri (Rp 6.9Jt)' },
                { id: 'perorangan', label: 'PT Perorangan', desc: '1 Pendiri (Rp 700rb/1.7Jt)' },
                { id: 'cv', label: 'CV', desc: 'Sekutu Aktif/Pasif (Rp 3.49Jt)' },
                { id: 'yayasan', label: 'Yayasan', desc: 'Sosial/Edukasi (Rp 5.2Jt)' },
                { id: 'koperasi', label: 'Koperasi', desc: 'Usaha Bersama (Rp 5.5Jt)' },
                { id: 'merek', label: 'Merek & Halal', desc: 'Proteksi Brand & Produk' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedEntityCheck(item.id as any)}
                  className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                    selectedEntityCheck === item.id
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-900">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                    Dokumen yang Diterbitkan:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {selectedEntityCheck === 'pt' && (
                      <>
                        <li className="flex items-center gap-2">✓ Akta Pendirian Notaris</li>
                        <li className="flex items-center gap-2">✓ SK Kemenkumham RI</li>
                        <li className="flex items-center gap-2">✓ NPWP & SKT Badan Usaha</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA & KBLI 2020</li>
                        <li className="flex items-center gap-2 text-amber-300 font-bold">
                          ✓ Bonus Software Keuangan UMKM
                        </li>
                      </>
                    )}
                    {selectedEntityCheck === 'perorangan' && (
                      <>
                        <li className="flex items-center gap-2">✓ Pernyataan Pendirian Resmi Menkumham</li>
                        <li className="flex items-center gap-2">✓ Sertifikat Pendaftaran PT Perorangan</li>
                        <li className="flex items-center gap-2">✓ NPWP Badan Usaha & SKT Pajak</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA Skala UMK</li>
                        <li className="flex items-center gap-2 text-teal-300 font-medium">
                          ✓ Opsi Tambahan Akta Penegasan Notaris
                        </li>
                      </>
                    )}
                    {selectedEntityCheck === 'cv' && (
                      <>
                        <li className="flex items-center gap-2">✓ Akta Notaris Pendirian CV</li>
                        <li className="flex items-center gap-2">✓ SK Terdaftar di AHU Online</li>
                        <li className="flex items-center gap-2">✓ NPWP Badan Usaha CV</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA Berusaha</li>
                      </>
                    )}
                    {selectedEntityCheck === 'yayasan' && (
                      <>
                        <li className="flex items-center gap-2">✓ Akta Pendirian Notaris Yayasan</li>
                        <li className="flex items-center gap-2">✓ SK Pengesahan Kemenkumham RI</li>
                        <li className="flex items-center gap-2">✓ NPWP Yayasan & SKT Pajak</li>
                        <li className="flex items-center gap-2">✓ NIB & Izin Operasional Lembaga</li>
                      </>
                    )}
                    {selectedEntityCheck === 'koperasi' && (
                      <>
                        <li className="flex items-center gap-2">✓ Berita Acara & Akta Notaris NPAK</li>
                        <li className="flex items-center gap-2">✓ SK Badan Hukum Kemenkumham</li>
                        <li className="flex items-center gap-2">✓ NPWP Badan Koperasi & SKT</li>
                        <li className="flex items-center gap-2">✓ NIB OSS RBA Terpadu Kemenkop</li>
                      </>
                    )}
                    {selectedEntityCheck === 'merek' && (
                      <>
                        <li className="flex items-center gap-2">✓ Bukti Penerimaan Permohonan DJKI</li>
                        <li className="flex items-center gap-2">✓ Sertifikat Merek Dagang 10 Tahun</li>
                        <li className="flex items-center gap-2">✓ Sertifikat Halal BPJPH Resmi</li>
                        <li className="flex items-center gap-2">✓ Dokumen SJPH & SOP Produksi</li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                    Estimasi Pengerjaan:
                  </h4>
                  <p className="text-2xl font-black text-white font-heading">
                    {selectedEntityCheck === 'pt'
                      ? '2 – 3 Hari Kerja'
                      : selectedEntityCheck === 'perorangan'
                      ? '1 – 2 Hari Kerja'
                      : selectedEntityCheck === 'cv'
                      ? '2 – 3 Hari Kerja'
                      : selectedEntityCheck === 'yayasan'
                      ? '5 – 7 Hari Kerja'
                      : selectedEntityCheck === 'koperasi'
                      ? '7 – 10 Hari Kerja'
                      : 'Proses DJKI / BPJPH'}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Proses serba online dan dipandu notaris berpengalaman.
                  </p>
                </div>

                <div className="flex flex-col justify-center gap-3">
                  <button
                    onClick={() => {
                      if (selectedEntityCheck === 'pt') onOpenOrder('pt_pro');
                      else if (selectedEntityCheck === 'perorangan') onOpenOrder('pt_perorangan');
                      else if (selectedEntityCheck === 'cv') onOpenOrder('cv_pro');
                      else if (selectedEntityCheck === 'yayasan') onOpenOrder('yayasan_pro');
                      else if (selectedEntityCheck === 'koperasi') onOpenOrder('koperasi_pro');
                      else onAskWhatsapp(`Halo BinaUsaha, saya ingin konsultasi pendirian ${selectedEntityCheck}`);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Mulai Proses Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
              FAQ Seputar Legalitas & Perizinan Usaha
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="mt-12 bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-bold font-heading">
              Konsultasikan Nama Usaha & Legalitas Anda Hari Ini
            </h3>
            <p className="text-emerald-100 text-sm max-w-xl mx-auto">
              Tim notaris dan legal corporate kami siap memeriksa ketersediaan nama PT Anda di AHU secara gratis.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => onAskWhatsapp('Halo Notaris BinaUsaha, saya ingin cek ketersediaan nama PT')}
                className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Cek Ketersediaan Nama via WhatsApp
              </button>
              <button
                onClick={() => onOpenOrder('pt_pro')}
                className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm px-6 py-3 rounded-xl border border-emerald-400/40 transition cursor-pointer"
              >
                Order Paket PT Pro
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
