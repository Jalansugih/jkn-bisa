import React, { useEffect, useRef, useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Facebook, Send, Linkedin, Twitter } from 'lucide-react';
import { buildShareTargets, copyText } from '../../lib/share';
import { buildProductShareUrl, commissionFor, formatRupiah } from '../../lib/referral';

interface ProductShareMenuProps {
  productKey: string;
  productName: string;
  /** Harga jual setelah diskon (angka). Dipakai untuk menampilkan estimasi komisi. */
  price?: number;
  /** Kode referral user login. null = belum login. */
  referralCode: string | null;
  onRequireLogin: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  /** true untuk kartu berlatar gelap */
  dark?: boolean;
}

const ICONS = { whatsapp: MessageCircle, facebook: Facebook, x: Twitter, telegram: Send, linkedin: Linkedin } as const;

export const ProductShareMenu: React.FC<ProductShareMenuProps> = ({
  productKey, productName, price, referralCode, onRequireLogin, showToast, dark,
}) => {
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

  const btnBase = dark
    ? 'text-blue-100 hover:text-white'
    : 'text-slate-600 hover:text-blue-700';

  // Belum login -> ajak daftar
  if (!referralCode) {
    return (
      <button
        type="button"
        onClick={onRequireLogin}
        className={`w-full text-[11px] font-semibold underline-offset-2 hover:underline cursor-pointer ${btnBase}`}
      >
        Daftar untuk dapat komisi 30% dari setiap penjualan
      </button>
    );
  }

  const url = buildProductShareUrl(productKey, referralCode);
  const text = `${productName} - cek paketnya di sini`;
  const commission = price ? commissionFor(price) : null;

  const handleMain = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const isTouch = window.matchMedia?.('(pointer: coarse)').matches;
    if (isTouch && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: productName, text, url });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return;
      }
    }
    setOpen((v) => !v);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      showToast('Link referral disalin', 'success');
      setTimeout(() => setCopied(false), 1800);
    } else {
      showToast('Gagal menyalin link', 'error');
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={handleMain}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`w-full flex items-center justify-center gap-2 text-[11px] font-bold cursor-pointer ${btnBase}`}
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Bagikan{commission ? ` & dapat ${formatRupiah(commission)}` : ' & dapat komisi'}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-30 bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 text-slate-700"
        >
          {buildShareTargets(text, url).map((t) => {
            const Icon = ICONS[t.id];
            return (
              <a
                key={t.id}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </a>
            );
          })}
          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tersalin' : 'Salin link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductShareMenu;
