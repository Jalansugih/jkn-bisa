import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
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
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
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
