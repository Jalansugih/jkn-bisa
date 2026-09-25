import { getGeminiAI } from '../../../lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, topic, userContext, mode } = body;

    if (!prompt || typeof prompt !== 'string') {
      return Response.json(
        { error: 'Parameter prompt diperlukan.' },
        { status: 400 }
      );
    }

    const ai = getGeminiAI();

    const systemInstruction = `Anda adalah "BinaUsaha AI Advisor", Konsultan Bisnis & Legalitas UMKM Indonesia nomor 1 yang ramah, profesional, solutif, dan menguasai regulasi terbaru.
Layanan utama BinaUsaha meliputi:
1. Pembuatan Website Toko Online & Landing Page Modern (Domain, Hosting, Payment Gateway QRIS/VA, Mobile Responsive).
2. Sistem Kasir POS Digital "RajaKas" (Multi-cabang, barcode scanner, struk printer thermal, manajemen stok, laporan laba rugi).
3. Legalitas & Perizinan Usaha: NIB OSS RBA, Sertifikasi Halal BPJPH, Pendirian PT Perorangan, PT Biasa, CV, NPWP Badan, HAKI Merek.
4. Paket Usaha Bundling (Komplit legalitas + website + kasir) dengan harga terjangkau bagi UMKM.

Panduan Jawaban:
- Jawab secara terstruktur dalam Bahasa Indonesia yang lugas, antusias, dan ramah.
- Gunakan poin-poin (bullet points) atau penomoran untuk langkah-langkah praktis.
- Berikan estimasi waktu atau dokumen yang diperlukan jika terkait legalitas/perizinan.
- Rekomendasikan solusi paket BinaUsaha yang paling cocok dengan kebutuhan penanya secara relevan.
- Jika mode adalah "rfq_analysis", berikan rangkuman analisis kebutuhan, rekomendasi spesifikasi teknis, estimasi waktu penyelesaian, dan langkah tindak lanjut.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'Maaf, tidak ada respons yang dihasilkan.';

    return Response.json({
      success: true,
      text: replyText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/gemini] Error:', error);
    return Response.json(
      {
        error: error?.message || 'Gagal memproses permintaan dengan AI Consultant.',
      },
      { status: 500 }
    );
  }
}
