/**
 * Vercel Function: melayani /artikel/<slug> dengan meta tag Open Graph yang benar.
 *
 * Kenapa perlu? Aplikasi ini SPA. Crawler WhatsApp / Facebook / Telegram / X tidak
 * menjalankan JavaScript, jadi tanpa fungsi ini setiap link artikel yang dibagikan
 * tampil dengan judul & gambar generik. Fungsi ini mengambil artikel dari Supabase
 * lalu menyisipkan judul, deskripsi, dan gambar ke index.html sebelum dikirim.
 * Untuk pengunjung biasa, aplikasi React tetap dimuat seperti biasa.
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
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function clip(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  const slug = decodeURIComponent(first(req.query.slug)).toLowerCase().slice(0, 120);
  const proto = first(req.headers['x-forwarded-proto']) || 'https';
  const host = first(req.headers['x-forwarded-host']) || first(req.headers.host);
  const origin = `${proto}://${host}`;

  // 1) Shell aplikasi (index.html hasil build)
  let html: string;
  try {
    const shell = await fetch(`${origin}/index.html`);
    if (!shell.ok) throw new Error(`index.html ${shell.status}`);
    html = await shell.text();
  } catch (err) {
    res.status(500).send('Gagal memuat halaman.');
    return;
  }

  // 2) Data artikel (hanya yang PUBLISHED)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  let article: { title: string; excerpt: string | null; image: string | null; category_label: string | null } | null = null;

  if (supabaseUrl && anonKey && slug) {
    try {
      const url =
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/articles` +
        `?select=title,excerpt,image,category_label` +
        `&slug=eq.${encodeURIComponent(slug)}&status=eq.PUBLISHED&limit=1`;
      const r = await fetch(url, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
      if (r.ok) {
        const rows = (await r.json()) as typeof article[];
        article = rows[0] || null;
      }
    } catch { /* jatuh ke meta default */ }
  }

  if (article) {
    const title = `${article.title} | ${SITE_NAME}`;
    const description = clip(article.excerpt || 'Baca panduan lengkap di BinaUsaha.', 200);
    const pageUrl = `${origin}/artikel/${encodeURIComponent(slug)}`;

    let image = article.image || '';
    if (image.startsWith('//')) image = `${proto}:${image}`;
    else if (image.startsWith('/')) image = `${origin}${image}`;
    if (!/^https?:\/\//i.test(image)) image = `${origin}/logo-login.png`; // data: URI / kosong tidak bisa dipakai crawler

    const tags = [
      `<meta name="description" content="${esc(description)}" />`,
      `<link rel="canonical" href="${esc(pageUrl)}" />`,
      `<meta property="og:type" content="article" />`,
      `<meta property="og:site_name" content="${SITE_NAME}" />`,
      `<meta property="og:locale" content="id_ID" />`,
      `<meta property="og:title" content="${esc(article.title)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:url" content="${esc(pageUrl)}" />`,
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(article.title)}" />`,
      `<meta name="twitter:description" content="${esc(description)}" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`,
    ].join('\n    ');

    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
      .replace(/<meta\s+name="description"[^>]*>/gi, '')
      .replace(/<meta\s+(?:property="og:|name="twitter:)[^>]*>/gi, '')
      .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
      .replace('</head>', `    ${tags}\n  </head>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache singkat di CDN; views & isi artikel tetap dimuat langsung oleh aplikasi.
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
