import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Article, OrderItem, Product } from '../../types';
import { AdminSeed, AdminUserListItem, RfqItem } from '../../types/admin';
import { ActionItem } from '../../lib/adminAnalytics';
import {
  Bell,
  BellOff,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Package,
  Search,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Pencarian global                                                     */
/* ------------------------------------------------------------------ */

interface SearchHit {
  key: string;
  group: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  seed: AdminSeed;
}

interface GlobalSearchProps {
  orders: OrderItem[];
  rfqs: RfqItem[];
  users: AdminUserListItem[];
  products: Product[];
  articles: Article[];
  onNavigate: (seed: AdminSeed) => void;
}

const PER_GROUP = 4;

export const AdminGlobalSearch: React.FC<GlobalSearchProps> = ({
  orders,
  rfqs,
  users,
  products,
  articles,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    const has = (...vals: (string | undefined)[]) => vals.some((v) => (v || '').toLowerCase().includes(q));
    const out: SearchHit[] = [];

    orders
      .filter((o) => has(o.id, o.name, o.brand, o.wa, o.product, o.email))
      .slice(0, PER_GROUP)
      .forEach((o) =>
        out.push({
          key: `o-${o.id}`,
          group: 'Pesanan',
          title: `${o.id} · ${o.product}`,
          subtitle: `${o.brand || o.name} · ${o.total}`,
          icon: ShoppingBag,
          seed: { tab: 'orders', openId: o.id },
        })
      );
    rfqs
      .filter((r) => has(r.id, r.nama, r.perusahaan, r.kategori, r.whatsapp))
      .slice(0, PER_GROUP)
      .forEach((r) =>
        out.push({
          key: `r-${r.id}`,
          group: 'RFQ',
          title: `${r.id} · ${r.perusahaan || r.nama}`,
          subtitle: `${r.kategori} · ${r.status}`,
          icon: FileSpreadsheet,
          seed: { tab: 'rfq', openId: r.id },
        })
      );
    users
      .filter((u) => has(u.name, u.email, u.whatsapp, u.businessName))
      .slice(0, PER_GROUP)
      .forEach((u) =>
        out.push({
          key: `u-${u.id}`,
          group: 'Pengguna',
          title: u.name,
          subtitle: [u.businessName, u.email].filter(Boolean).join(' · ') || u.whatsapp || '',
          icon: Users,
          seed: { tab: 'users', query: u.email || u.name },
        })
      );
    products
      .filter((p) => has(p.name))
      .slice(0, PER_GROUP)
      .forEach((p) =>
        out.push({
          key: `p-${p.id}`,
          group: 'Katalog',
          title: p.name,
          subtitle: p.active === false ? 'Nonaktif' : 'Aktif',
          icon: Package,
          seed: { tab: 'products', query: p.name },
        })
      );
    articles
      .filter((a) => has(a.title))
      .slice(0, PER_GROUP)
      .forEach((a) =>
        out.push({
          key: `a-${a.id}`,
          group: 'Artikel',
          title: a.title,
          subtitle: a.status === 'DRAFT' ? 'Draft' : 'Terbit',
          icon: BookOpen,
          seed: { tab: 'articles', query: a.title },
        })
      );
    return out;
  }, [query, orders, rfqs, users, products, articles]);

  useEffect(() => setActive(0), [query]);

  // Klik di luar menutup hasil
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Ctrl/Cmd + K memfokuskan pencarian
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (window.matchMedia('(min-width: 640px)').matches) {
          desktopInputRef.current?.focus();
        } else {
          setMobileOpen(true);
        }
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (mobileOpen) mobileInputRef.current?.focus();
  }, [mobileOpen]);

  const choose = (hit: SearchHit) => {
    onNavigate(hit.seed);
    setQuery('');
    setOpen(false);
    setMobileOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && hits[active]) {
      e.preventDefault();
      choose(hits[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setMobileOpen(false);
      (e.target as HTMLElement).blur();
    }
  };

  const results = (
    <div className="absolute left-0 right-0 sm:right-auto sm:w-[26rem] mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
      {query.trim().length < 2 ? (
        <p className="p-4 text-xs text-slate-500">
          Ketik minimal 2 huruf: ID pesanan, nama klien, nomor WhatsApp, perusahaan, atau judul artikel.
        </p>
      ) : hits.length === 0 ? (
        <p className="p-4 text-xs text-slate-500">Tidak ada hasil untuk "{query}".</p>
      ) : (
        hits.map((hit, i) => {
          const Icon = hit.icon;
          const showGroup = i === 0 || hits[i - 1].group !== hit.group;
          return (
            <React.Fragment key={hit.key}>
              {showGroup && (
                <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {hit.group}
                </div>
              )}
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(hit)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition cursor-pointer ${
                  i === active ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-900 truncate">{hit.title}</span>
                  <span className="block text-[11px] text-slate-500 truncate">{hit.subtitle}</span>
                </span>
              </button>
            </React.Fragment>
          );
        })
      )}
    </div>
  );

  return (
    <div ref={wrapRef} className="relative">
      {/* Desktop */}
      <div className="relative hidden sm:block w-44 lg:w-64 xl:w-72">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={desktopInputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Cari pesanan, klien, RFQ…  (Ctrl+K)"
          aria-label="Pencarian global"
          className="w-full text-xs pl-8 pr-3 py-2 bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
        />
        {open && <div className="hidden sm:block">{results}</div>}
      </div>

      {/* Ponsel */}
      <button
        onClick={() => {
          setMobileOpen(true);
          setOpen(true);
        }}
        className="sm:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
        aria-label="Cari"
      >
        <Search className="w-5 h-5" />
      </button>
      {mobileOpen && (
        <div className="sm:hidden fixed inset-x-0 top-0 z-[60] bg-white border-b border-slate-200 p-3 shadow-lg">
          <div className="relative flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Cari pesanan, klien, RFQ…"
              className="flex-1 text-sm pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              onClick={() => {
                setMobileOpen(false);
                setQuery('');
              }}
              className="p-2 text-slate-500 cursor-pointer"
              aria-label="Tutup pencarian"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">{results}</div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Lonceng "perlu tindakan"                                             */
/* ------------------------------------------------------------------ */

const TONE: Record<ActionItem['tone'], string> = {
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const AdminNotificationBell: React.FC<{
  items: ActionItem[];
  onNavigate: (seed: AdminSeed) => void;
}> = ({ items, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const total = items.reduce((a, i) => a + i.count, 0);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
        aria-label={total > 0 ? `${total} hal perlu tindakan` : 'Tidak ada notifikasi'}
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
            {total > 99 ? '99+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[19rem] sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="font-bold text-xs text-slate-800">Perlu Tindakan</h4>
            {total > 0 && (
              <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">{total}</span>
            )}
          </div>
          {items.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                {total === 0 ? <CheckCircle2 className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </div>
              <p className="text-xs font-semibold text-slate-700">Semua beres</p>
              <p className="text-[11px] text-slate-500">Tidak ada pembayaran, RFQ, atau pencairan yang menunggu.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setOpen(false);
                    onNavigate(item.seed);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 hover:brightness-95 transition cursor-pointer ${TONE[item.tone]}`}
                >
                  <span className="text-lg font-black w-8 text-center shrink-0">{item.count}</span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold truncate">{item.label}</span>
                    <span className="block text-[11px] opacity-80 truncate">{item.detail}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
