import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

initializeApp();
const db = getFirestore();

// SMTP configuration from functions/.env
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function buildTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}


async function callGemini(prompt, systemInstruction) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi pada Firebase Functions.');
  }

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=' +
      encodeURIComponent(GEMINI_API_KEY),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Gemini API gagal memproses permintaan.');
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('')
      .trim() || '';

  if (!text) {
    throw new Error('Gemini tidak mengembalikan jawaban.');
  }

  return text;
}

const GEMINI_SYSTEM_INSTRUCTION =
  'Anda adalah BinaUsaha AI Advisor, konsultan bisnis, legalitas, dan digitalisasi UMKM Indonesia. ' +
  'Jawab dalam Bahasa Indonesia dengan ramah, praktis, profesional, ringkas namun jelas. ' +
  'Gunakan heading dan bullet points bila membantu. Jangan mengarang fakta hukum atau biaya; ' +
  'jelaskan bila suatu informasi perlu diverifikasi.';

export const geminiConsult = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method tidak diizinkan.' });
      return;
    }

    try {
      const { prompt, topic, businessName, businessType } = req.body || {};

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Parameter prompt wajib disertakan.' });
        return;
      }

      const formattedPrompt = `Topik: ${topic || 'Umum UMKM'}
Nama Usaha: ${businessName || 'Belum ada'}
Jenis Usaha: ${businessType || 'UMKM'}

Pertanyaan Klien:
${prompt}`;

      const text = await callGemini(formattedPrompt, GEMINI_SYSTEM_INSTRUCTION);

      res.status(200).json({
        success: true,
        text,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[geminiConsult] Error:', error);
      res.status(500).json({
        error: error?.message || 'Terjadi kesalahan saat memproses konsultasi AI.',
      });
    }
  }
);

export const geminiRfqAnalysis = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method tidak diizinkan.' });
      return;
    }

    try {
      const { rfqData } = req.body || {};

      if (!rfqData) {
        res.status(400).json({ error: 'Data RFQ diperlukan.' });
        return;
      }

      const prompt = `Analisis permintaan kebutuhan usaha (RFQ) berikut dan berikan:
1. Ringkasan kebutuhan dan skala proyek
2. Rekomendasi solusi dan spesifikasi ideal
3. Estimasi timeline yang realistis
4. Dokumen/persiapan yang dibutuhkan

Data RFQ:
- Nama Pemohon: ${rfqData.nama || '-'}
- Nama Perusahaan/Brand: ${rfqData.perusahaan || '-'}
- Kategori: ${rfqData.kategori || '-'}
- Jumlah/Volume: ${rfqData.jumlah || '-'}
- Target Waktu: ${rfqData.waktu || '-'}
- Lokasi: ${rfqData.lokasi || '-'}
- Detail: ${rfqData.detail || '-'}`;

      const text = await callGemini(prompt, GEMINI_SYSTEM_INSTRUCTION);

      res.status(200).json({
        success: true,
        analysis: text,
      });
    } catch (error) {
      console.error('[geminiRfqAnalysis] Error:', error);
      res.status(500).json({
        error: error?.message || 'Gagal menganalisis RFQ dengan AI.',
      });
    }
  }
);

/**
 * Kirim email ke admin ketika order baru dibuat
 * di collection Firestore: orders/{orderId}
 */
export const onOrderCreated = onDocumentCreated(
  { document: 'orders/{orderId}' },
  async (event) => {
    const order = event.data?.data();

    if (!order) {
      console.warn('Data order tidak ditemukan.');
      return;
    }

    const adminEmail = ADMIN_EMAIL;

    if (!adminEmail || !SMTP_USER || !SMTP_PASS || !SMTP_HOST) {
      console.warn(
        'Konfigurasi SMTP belum lengkap. Email notifikasi dilewati.'
      );
      return;
    }

    const addonsText = (order.addons || []).join(', ') || '-';

    const html = `
      <h2>Pesanan Baru Masuk — ${order.id || event.params.orderId}</h2>

      <table cellpadding="6" style="border-collapse:collapse">
        <tr>
          <td><b>Paket</b></td>
          <td>${order.product || '-'}</td>
        </tr>

        <tr>
          <td><b>Nama</b></td>
          <td>${order.name || '-'}</td>
        </tr>

        <tr>
          <td><b>Brand Usaha</b></td>
          <td>${order.brand || '-'}</td>
        </tr>

        <tr>
          <td><b>WhatsApp</b></td>
          <td>${order.wa || '-'}</td>
        </tr>

        <tr>
          <td><b>Email</b></td>
          <td>${order.email || '-'}</td>
        </tr>

        <tr>
          <td><b>Add-on</b></td>
          <td>${addonsText}</td>
        </tr>

        <tr>
          <td><b>Total</b></td>
          <td>${order.total || '-'}</td>
        </tr>

        <tr>
          <td><b>Catatan</b></td>
          <td>${order.notes || '-'}</td>
        </tr>
      </table>
    `;

    try {
      const transport = buildTransport();

      await transport.sendMail({
        from: `BinaUsaha Notifikasi <${SMTP_USER}>`,
        to: adminEmail,
        subject: `🛒 Pesanan Baru: ${
          order.id || event.params.orderId
        } - ${order.brand || 'BinaUsaha'}`,
        html,
      });

      console.log(
        `Email notifikasi terkirim untuk order ${
          order.id || event.params.orderId
        }`
      );
    } catch (err) {
      console.error('Gagal mengirim email notifikasi order:', err);
    }
  }
);

/**
 * Fungsi untuk fitur "Lacak Pesanan".
 *
 * Tamu dapat mencari pesanan menggunakan:
 * - kode order
 * - nomor WhatsApp
 */
function sanitizeTrackingOrder(data) {
  if (!data) return null;
  return {
    id: data.id || '',
    product: data.product || '',
    brand: data.brand || '',
    status: data.status || 'Verifikasi',
    notes: data.notes || '',
    date: data.date || '',
  };
}

export const trackOrder = onCall(async (request) => {
  const searchTerm = (request.data?.query || '').trim();

  if (!searchTerm) {
    throw new HttpsError(
      'invalid-argument',
      'Kata kunci pencarian tidak boleh kosong.'
    );
  }

  // 1. Cari berdasarkan kode order / document ID
  const normalizedId = searchTerm
    .toUpperCase()
    .startsWith('BU-')
    ? searchTerm.toUpperCase()
    : `BU-${searchTerm.toUpperCase()}`;

  const directDoc = await db
    .collection('orders')
    .doc(normalizedId)
    .get();

  if (directDoc.exists) {
    return {
      order: sanitizeTrackingOrder(directDoc.data()),
    };
  }

  // 2. Coba document ID tanpa prefix BU-
  const rawDoc = await db
    .collection('orders')
    .doc(searchTerm.toUpperCase())
    .get();

  if (rawDoc.exists) {
    return {
      order: sanitizeTrackingOrder(rawDoc.data()),
    };
  }

  // 3. Cari berdasarkan nomor WhatsApp
  const byWa = await db
    .collection('orders')
    .where('wa', '==', searchTerm)
    .limit(1)
    .get();

  if (!byWa.empty) {
    return {
      order: sanitizeTrackingOrder(byWa.docs[0].data()),
    };
  }

  // Tidak ditemukan
  return {
    order: null,
  };
});