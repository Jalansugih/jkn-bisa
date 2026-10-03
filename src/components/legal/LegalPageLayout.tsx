import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  ListOrdered,
} from 'lucide-react';
import { LEGAL_INFO, LEGAL_LAST_UPDATED, LEGAL_VERSION } from '../../data/legalInfo';
import { PRIVACY_PATH, TERMS_PATH } from '../../lib/legalPaths';

export type LegalKind = 'terms' | 'privacy';

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

interface LegalPageLayoutProps {
  kind: LegalKind;
  title: string;
  subtitle: string;
  sections: LegalSection[];
  onBackToHome: () => void;
  onNavigate: (kind: LegalKind) => void;
}

const META: Record<LegalKind, { icon: React.ReactNode; badge: string; other: LegalKind; otherLabel: string; otherDesc: string }> = {
  terms: {
    icon: <FileText className="w-6 h-6" />,
    badge: 'Dokumen Resmi',
    other: 'privacy',
    otherLabel: 'Kebijakan Privasi',
    otherDesc: 'Pelajari data apa yang kami kumpulkan dan bagaimana kami melindunginya.',
  },
  privacy: {
    icon: <Lock className="w-6 h-6" />,
    badge: 'Perlindungan Data Pribadi',
    other: 'terms',
    otherLabel: 'Syarat & Ketentuan',
    otherDesc: 'Aturan pemesanan, pembayaran, pembatalan, dan penggunaan layanan.',
  },
};

/**
 * Teks isi mendukung penanda sederhana:
 *   **tebal**, {{email}}, {{wa}}, {{terms}}, {{privacy}}
 */
function renderInline(text: string, onNavigate: (kind: LegalKind) => void): React.ReactNode[] {
  const parts = text.split(/(\{\{[a-z]+\}\}|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkClass = 'text-blue-600 font-semibold hover:underline';
    switch (part) {
      case '{{email}}':
        return (
          <a key={i} href={`mailto:${LEGAL_INFO.email}`} className={linkClass}>
            {LEGAL_INFO.email}
          </a>
        );
      case '{{wa}}':
        return (
          <a key={i} href={LEGAL_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {LEGAL_INFO.whatsappDisplay}
          </a>
        );
      case '{{terms}}':
      case '{{privacy}}': {
        const kind: LegalKind = part === '{{terms}}' ? 'terms' : 'privacy';
        return (
          <a
            key={i}
            href={kind === 'terms' ? TERMS_PATH : PRIVACY_PATH}
            onClick={(e) => {
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onNavigate(kind);
            }}
            className={linkClass}
          >
            {kind === 'terms' ? 'Syarat & Ketentuan' : 'Kebijakan Privasi'}
          </a>
        );
      }
      default:
        return part;
    }
  });
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  kind,
  title,
  subtitle,
  sections,
  onBackToHome,
  onNavigate,
}) => {
  const meta = META[kind];
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');

  // Selalu mulai dari atas saat berpindah antar dokumen
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setActiveId(sections[0]?.id || '');
  }, [kind, sections]);

  // Tandai bagian yang sedang dibaca pada daftar isi
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  const toc = (
    <ol className="space-y-0.5">
      {sections.map((s, i) => (
        <li key={s.id}>
          <button
            type="button"
            onClick={() => goTo(s.id)}
            className={`w-full text-left flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
              activeId === s.id
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="w-5 flex-shrink-0 text-right tabular-nums text-slate-400">{i + 1}.</span>
            <span className="leading-snug">{s.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <div id={`legal-page-${kind}`} className="min-h-screen bg-slate-50/60 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 font-medium transition cursor-pointer flex items-center gap-1 text-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Beranda</span>
            </button>
            <span>/</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">{title}</span>
          </div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <header className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-200 flex-shrink-0">
              {meta.icon}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-block">
                {meta.badge}
              </span>
              <h1 className="mt-2 text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">{title}</h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">{subtitle}</p>
              <p className="mt-3 text-xs text-slate-500">
                Terakhir diperbarui: <strong className="text-slate-700">{LEGAL_LAST_UPDATED}</strong> &middot; Versi {LEGAL_VERSION}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Daftar isi */}
          <aside className="lg:col-span-3 lg:sticky lg:top-40">
            <details className="lg:hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <summary className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer">
                <ListOrdered className="w-4 h-4 text-blue-600" /> Daftar Isi
              </summary>
              <div className="mt-3 max-h-80 overflow-y-auto">{toc}</div>
            </details>
            <nav aria-label="Daftar isi" className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
              <div className="px-2.5 pt-1 pb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <ListOrdered className="w-3.5 h-3.5" /> Daftar Isi
              </div>
              <div className="max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">{toc}</div>
            </nav>
          </aside>

          {/* Isi dokumen */}
          <article className="lg:col-span-9 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs divide-y divide-slate-100">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-40 py-6 first:pt-0 last:pb-0">
                  <h2 className="flex items-start gap-3 font-heading font-bold text-lg text-slate-900 mb-3">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{s.title}</span>
                  </h2>
                  <div className="sm:pl-10 space-y-3 text-sm text-slate-600 leading-relaxed">
                    {s.blocks.map((b, bi) => {
                      switch (b.type) {
                        case 'p':
                          return <p key={bi}>{renderInline(b.text, onNavigate)}</p>;
                        case 'ul':
                          return (
                            <ul key={bi} className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                              {b.items.map((it, ii) => (
                                <li key={ii}>{renderInline(it, onNavigate)}</li>
                              ))}
                            </ul>
                          );
                        case 'ol':
                          return (
                            <ol key={bi} className="list-decimal pl-5 space-y-1.5 marker:text-blue-500 marker:font-semibold">
                              {b.items.map((it, ii) => (
                                <li key={ii}>{renderInline(it, onNavigate)}</li>
                              ))}
                            </ol>
                          );
                        case 'note':
                          return (
                            <div key={bi} className="bg-blue-50/70 border border-blue-200 text-blue-900 rounded-2xl p-4 text-[13px] leading-relaxed">
                              {renderInline(b.text, onNavigate)}
                            </div>
                          );
                        case 'table':
                          return (
                            <div key={bi} className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left text-[13px]">
                                <thead className="bg-slate-50 text-slate-700">
                                  <tr>
                                    {b.headers.map((h, hi) => (
                                      <th key={hi} className="px-3.5 py-2.5 font-bold border-b border-slate-200 whitespace-nowrap">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {b.rows.map((row, ri) => (
                                    <tr key={ri} className="align-top">
                                      {row.map((cell, ci) => (
                                        <td key={ci} className={`px-3.5 py-2.5 ${ci === 0 ? 'font-semibold text-slate-800 min-w-[9rem]' : 'min-w-[12rem]'}`}>
                                          {renderInline(cell, onNavigate)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                </section>
              ))}
            </div>

            {/* Dokumen terkait + kontak */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href={meta.other === 'terms' ? TERMS_PATH : PRIVACY_PATH}
                onClick={(e) => {
                  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onNavigate(meta.other);
                }}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-xs transition flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 flex-shrink-0">
                  {meta.other === 'terms' ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    {meta.otherLabel}
                    <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{meta.otherDesc}</p>
                </div>
              </a>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs text-slate-600 space-y-2.5">
                <div className="font-bold text-slate-900 text-sm">Ada pertanyaan?</div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <a href={`mailto:${LEGAL_INFO.email}`} className="hover:text-blue-600 font-medium">{LEGAL_INFO.email}</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <a href={LEGAL_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 font-medium">
                    WhatsApp {LEGAL_INFO.whatsappDisplay}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{LEGAL_INFO.address}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
