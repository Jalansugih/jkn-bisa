import React, { useEffect, useRef, useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Facebook, Send, Linkedin, Twitter } from 'lucide-react';
import { articleShareUrl, buildShareTargets, copyText } from '../../lib/share';

interface ShareMenuProps {
  title: string;
  slug: string;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  /** 'button' = tombol dengan teks (halaman artikel), 'icon' = tombol bulat kecil (kartu) */
  variant?: 'button' | 'icon';
}

const ICONS = {
  whatsapp: MessageCircle,
  facebook: Facebook,
  x: Twitter,
  telegram: Send,
  linkedin: Linkedin,
} as const;

export const ShareMenu: React.FC<ShareMenuProps> = ({ title, slug, showToast, variant = 'button' }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleMainClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = articleShareUrl(slug);
    // Di HP, pakai menu share bawaan (WA, IG, FB, dll langsung tersedia).
    const isTouch = window.matchMedia?.('(pointer: coarse)').matches;
    if (isTouch && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return; // pengguna menutup dialog
      }
    }
    setOpen((v) => !v);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyText(articleShareUrl(slug));
    if (ok) {
      setCopied(true);
      showToast('Tautan artikel berhasil disalin!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Gagal menyalin tautan. Salin manual dari address bar.', 'error');
    }
    setOpen(false);
  };

  const targets = open ? buildShareTargets(title, articleShareUrl(slug)) : [];

  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      {variant === 'icon' ? (
        <button
          onClick={handleMainClick}
          className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-blue-600 transition shadow-xs cursor-pointer border border-slate-200"
          title="Bagikan Artikel"
          aria-label="Bagikan artikel"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          onClick={handleMainClick}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          title="Bagikan artikel"
          aria-label="Bagikan artikel"
        >
          <Share2 className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Bagikan</span>
        </button>
      )}

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {targets.map((t) => {
            const Icon = ICONS[t.id];
            return (
              <a
                key={t.id}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Icon className="w-4 h-4 text-slate-500" />
                {t.label}
              </a>
            );
          })}
          <button
            onClick={handleCopy}
            className="mt-1 flex w-full items-center gap-2.5 rounded-xl border-t border-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            {copied ? 'Tersalin' : 'Salin tautan'}
          </button>
        </div>
      )}
    </div>
  );
};
