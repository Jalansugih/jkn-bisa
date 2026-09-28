import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';
import { getGeminiAI } from './lib/gemini';

dotenv.config();

// SMTP config untuk notifikasi email order baru (pengganti Cloud Function
// `onOrderCreated`). Kredensial hanya hidup di server, tidak pernah
// dikirim ke client.
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function buildMailTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}


// ---------------------------------------------------------------------
// Open Graph per artikel (untuk pratinjau link WhatsApp / Facebook / X).
// Aplikasi tetap SPA; server hanya menyuntikkan meta tag ke index.html
// untuk URL /artikel/<slug>. Crawler tidak menjalankan JavaScript, jadi
// tag ini harus sudah ada di HTML yang dikirim server.
// ---------------------------------------------------------------------
const SITE_NAME = 'BinaUsaha';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max - 1).trimEnd() + '…';
}

interface OgArticle {
  title: string;
  description: string;
  image: string | null;
}

const ogCache = new Map<string, { at: number; data: OgArticle | null }>();
const OG_CACHE_MS = 60_000;

async function fetchArticleForOg(slug: string): Promise<OgArticle | null> {
  const hit = ogCache.get(slug);
  if (hit && Date.now() - hit.at < OG_CACHE_MS) return hit.data;

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  let data: OgArticle | null = null;
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    // Hanya artikel PUBLISHED: kebijakan RLS `articles_select` saat ini
    // mengizinkan baca semua baris, jadi filter status wajib di sini.
    const { data: row } = await supabase
      .from('articles')
      .select('title, excerpt, content_html, image')
      .ilike('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle();
    if (row) {
      const desc = (row.excerpt && String(row.excerpt).trim()) || stripHtml(String(row.content_html || ''));
      data = {
        title: String(row.title || SITE_NAME),
        description: truncate(desc, 200),
        image: row.image ? String(row.image) : null,
      };
    }
  } catch (err) {
    console.warn('[og] Gagal mengambil artikel untuk OG:', err);
  }
  ogCache.set(slug, { at: Date.now(), data });
  return data;
}

function originOf(req: Request): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0] || req.protocol;
  return `${proto}://${req.get('host')}`;
}

function injectArticleMeta(html: string, article: OgArticle, pageUrl: string, origin: string): string {
  const title = `${article.title} | ${SITE_NAME}`;
  const image = article.image
    ? article.image.startsWith('/') ? origin + article.image : article.image
    : null;

  const tags = [
    `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(article.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(article.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : '',
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(article.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(article.description)}" />`,
    image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : '',
  ].filter(Boolean).join('\n    ');

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${escapeHtml(article.description)}" />`
    )
    .replace('</head>', `    ${tags}\n  </head>`);
}

/** Handler /artikel/:slug — kirim index.html dengan meta OG artikel (jika ada). */
function articleOgHandler(getTemplate: (req: Request) => Promise<string>) {
  return async (req: Request, res: Response) => {
    try {
      const template = await getTemplate(req);
      const slug = decodeURIComponent(req.params.slug || '');
      const article = slug ? await fetchArticleForOg(slug) : null;
      const html = article
        ? injectArticleMeta(template, article, `${originOf(req)}${req.path}`, originOf(req))
        : template;
      res.status(200).set('Content-Type', 'text/html; charset=utf-8').send(html);
    } catch (err) {
      console.error('[og] Error, fallback ke index.html biasa:', err);
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    }
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON parsing
  app.use(express.json({ limit: '10mb' }));

  // 1. Health Check Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'BinaUsaha Full-Stack Backend',
      timestamp: new Date().toISOString(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // 2. Google Gemini 3.7 Flash AI Business Consultant Endpoint
  app.post('/api/gemini/consult', async (req: Request, res: Response) => {
    try {
      const { prompt, topic, businessName, businessType } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Parameter prompt wajib disertakan.' });
        return;
      }

      const ai = getGeminiAI();

      const systemInstruction = `Anda adalah "BinaUsaha AI Advisor", Konsultan Bisnis, Legalitas, & Digitalisasi UMKM Indonesia terpercaya.
Spesialisasi Anda:
1. Legalitas & Perizinan: NIB OSS RBA, Sertifikasi Halal BPJPH (Self Declare & Reguler), Pendirian PT Perorangan, PT Biasa, CV, NPWP Badan, Hak Cipta & Merek HAKI.
2. Digitalisasi & Toko Online: Pembuatan website profesional toko online, landing page, custom domain, integrasi payment gateway QRIS/Virtual Account.
3. Kasir Digital POS "RajaKas": Aplikasi kasir cloud, barcode scanner, struk printer thermal Bluetooth, manajemen stok multi-cabang, laporan omzet & laba rugi.
4. Scale-up & Pemasaran: Strategi budgeting pengadaan alat kantor, bahan konstruksi, dan agrobisnis.

Karakter Komunikasi:
- Ramah, empatik, solutif, dan profesional dalam Bahasa Indonesia.
- Gunakan format markdown bersih dengan heading, bullet points, dan penekanan kata penting.
- Berikan estimasi hari kerja atau rincian syarat berkas yang diperlukan jika bertanya tentang legalitas.
- Berikan saran praktis langkah demi langkah yang bisa langsung dieksekusi pelaku UMKM.`;

      const formattedPrompt = `Topik: ${topic || 'Umum UMKM'}
Nama Usaha: ${businessName || 'Belum ada'}
Jenis Usaha: ${businessType || 'UMKM'}

Pertanyaan Klien:
${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: formattedPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Maaf, tidak dapat menghasilkan jawaban saat ini.';

      res.json({
        success: true,
        text: replyText,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('[server /api/gemini/consult] Error:', error);
      res.status(500).json({
        error: error?.message || 'Terjadi kesalahan saat memproses konsultasi AI.',
      });
    }
  });

  // 3. AI Smart RFQ Analysis Endpoint
  app.post('/api/gemini/rfq-analysis', async (req: Request, res: Response) => {
    try {
      const { rfqData } = req.body;

      if (!rfqData) {
        res.status(400).json({ error: 'Data RFQ diperlukan.' });
        return;
      }

      const ai = getGeminiAI();

      const prompt = `Analisis permintaan kebutuhan usaha (RFQ) berikut dan berikan:
1. Ringkasan Kebutuhan & Skala Proyek
2. Rekomendasi Solusi & Spesifikasi Ideal
3. Estimasi Timeline Pengerjaan yang Realistis
4. Dokumen / Persiapan yang Dibutuhkan dari Pemohon

Data RFQ:
- Nama Pemohon: ${rfqData.nama}
- Nama Perusahaan/Brand: ${rfqData.perusahaan}
- Kategori Kebutuhan: ${rfqData.kategori}
- Estimasi Jumlah / Volume: ${rfqData.jumlah}
- Target Waktu Pengadaan: ${rfqData.waktu}
- Lokasi Pengiriman / Proyek: ${rfqData.lokasi}
- Detail Kebutuhan Khusus: ${rfqData.detail}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Anda adalah Senior Procurement & Solutions Architect BinaUsaha yang menganalisis kebutuhan pengadaan klien B2B dan UMKM dengan ringkas, tajam, dan tepat sasaran.',
        },
      });

      res.json({
        success: true,
        analysis: response.text || 'Analisis kebutuhan berhasil dibuat.',
      });
    } catch (error: any) {
      console.error('[server /api/gemini/rfq-analysis] Error:', error);
      res.status(500).json({
        error: error?.message || 'Gagal menganalisis RFQ dengan AI.',
      });
    }
  });

  // 4. Notifikasi email order baru (pengganti Cloud Function onOrderCreated).
  // Dipanggil dari orderService.ts (client) setelah insert ke Supabase berhasil.
  app.post('/api/notify-order', async (req: Request, res: Response) => {
    try {
      if (!ADMIN_EMAIL || !SMTP_USER || !SMTP_PASS || !SMTP_HOST) {
        console.warn('[notify-order] Konfigurasi SMTP belum lengkap, notifikasi dilewati.');
        res.json({ success: true, skipped: true });
        return;
      }

      const order = req.body || {};
      const addonsText = Array.isArray(order.addons) ? order.addons.join(', ') || '-' : '-';

      const html = `
        <h2>Pesanan Baru Masuk — ${order.id || '-'}</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Paket</b></td><td>${order.product || '-'}</td></tr>
          <tr><td><b>Nama</b></td><td>${order.name || '-'}</td></tr>
          <tr><td><b>Brand Usaha</b></td><td>${order.brand || '-'}</td></tr>
          <tr><td><b>WhatsApp</b></td><td>${order.wa || '-'}</td></tr>
          <tr><td><b>Email</b></td><td>${order.email || '-'}</td></tr>
          <tr><td><b>Add-on</b></td><td>${addonsText}</td></tr>
          <tr><td><b>Total</b></td><td>${order.total || '-'}</td></tr>
          <tr><td><b>Catatan</b></td><td>${order.notes || '-'}</td></tr>
        </table>
      `;

      const transport = buildMailTransport();
      await transport.sendMail({
        from: `BinaUsaha Notifikasi <${SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `🛒 Pesanan Baru: ${order.id || '-'} - ${order.brand || 'BinaUsaha'}`,
        html,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('[notify-order] Gagal mengirim notifikasi:', error);
      // Jangan gagalkan checkout hanya karena email gagal terkirim.
      res.status(200).json({ success: false, error: error?.message || 'Gagal mengirim email' });
    }
  });

  // 5. Vite Middleware & SPA Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Artikel: suntik meta OG (dev) sebelum middleware Vite.
    app.get(
      '/artikel/:slug',
      articleOgHandler(async (req) =>
        vite.transformIndexHtml(
          req.originalUrl,
          fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8')
        )
      )
    );
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

    // Artikel: suntik meta OG (produksi) sebelum fallback SPA.
    app.get('/artikel/:slug', articleOgHandler(async () => indexHtml));

    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BinaUsaha Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();