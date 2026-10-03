/**
 * Vercel Function: melayani /paket/<id-produk>?ref=KODE dengan meta Open Graph produk,
 * supaya link yang dibagikan ke WhatsApp/Facebook/Telegram/X tampil dengan nama & harga paket.
 * Pengunjung biasa tetap mendapat aplikasi React (?ref= dibaca oleh src/lib/referral.ts).
 */

interface Req { query: Record<string, string | string[] | undefined>; headers: Record<string, string | string[] | undefined>; }
interface Res {
  setHeader(name: string, value: string): void;
  status(code: number): Res;
  send(body: string): void;
}

const SITE_NAME = 'BinaUsaha';

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] || '' : v || '';
}
function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function clip(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  const key = decodeURIComponent(first(req.query.key)).slice(0, 80);
  const proto = first(req.headers['x-forwarded-proto']) || 'https';
  const host = first(req.headers['x-forwarded-host']) || first(req.headers.host);
  const origin = `${proto}://${host}`;

  let html: string;
  try {
    const shell = await fetch(`${origin}/index.html`);
    if (!shell.ok) throw new Error(`index.html ${shell.status}`);
    html = await shell.text();
  } catch {
    res.status(500).send('Gagal memuat halaman.');
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  let product: { name: string; description: string | null; price: number; image_url: string | null } | null = null;

  if (supabaseUrl && anonKey && /^[A-Za-z0-9_-]+$/.test(key)) {
    try {
      const url =
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/products` +
        `?select=name,description,price,image_url&id=eq.${encodeURIComponent(key)}&active=eq.true&limit=1`;
      const r = await fetch(url, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
      if (r.ok) product = ((await r.json()) as NonNullable<typeof product>[])[0] || null;
    } catch { /* jatuh ke meta default */ }
  }

  if (product) {
    const price = 'Rp ' + Math.round(Number(product.price)).toLocaleString('id-ID');
    const title = `${product.name} - ${price}`;
    const description = clip(product.description || 'Solusi legalitas, website, dan kasir untuk UMKM.', 200);
    const pageUrl = `${origin}/paket/${encodeURIComponent(key)}`; // tanpa ?ref supaya kanonik
    // Pakai foto produk bila ada (harus URL https penuh), kalau tidak -> logo
    const image = product.image_url && /^https:\/\//i.test(product.image_url) ? product.image_url : `${origin}/logo-login.png`;

    const tags = [
      `<meta name="description" content="${esc(description)}" />`,
      `<link rel="canonical" href="${esc(pageUrl)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${SITE_NAME}" />`,
      `<meta property="og:locale" content="id_ID" />`,
      `<meta property="og:title" content="${esc(title)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:url" content="${esc(pageUrl)}" />`,
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(title)}" />`,
      `<meta name="twitter:description" content="${esc(description)}" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`,
    ].join('\n    ');

    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(`${title} | ${SITE_NAME}`)}</title>`)
      .replace(/<meta\s+name="description"[^>]*>/gi, '')
      .replace(/<meta\s+(?:property="og:|name="twitter:)[^>]*>/gi, '')
      .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
      .replace('</head>', `    ${tags}\n  </head>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
