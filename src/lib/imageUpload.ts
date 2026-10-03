import { uploadFile } from './storageService';
import { isSupabaseConfigured } from './supabase/client';

/**
 * Upload gambar artikel ke Supabase Storage (bucket `articles`).
 * Yang disimpan di database hanya URL-nya, bukan file/base64, dan file
 * disajikan lewat CDN Supabase sehingga tidak membebani server aplikasi.
 *
 * Sebelum diunggah gambar dikompres di browser (resize + WebP) supaya
 * ukurannya kecil (umumnya 100-300 KB).
 */

const MAX_INPUT_BYTES = 10 * 1024 * 1024; // batas file mentah yang boleh dipilih
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

async function compressImage(file: File, maxWidth: number, quality = 0.82): Promise<Blob> {
  // GIF dibiarkan apa adanya supaya animasinya tidak hilang
  if (file.type === 'image/gif') return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Browser tidak mendukung kompresi gambar.');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  if (!blob) throw new Error('Gagal mengompres gambar.');
  // Kalau hasil kompresi malah lebih besar, pakai file asli
  return blob.size < file.size ? blob : file;
}

export interface ArticleImageOptions {
  /** 'cover' = lebar maks 1200px, 'content' = 1600px */
  kind?: 'cover' | 'content';
}

export async function uploadArticleImage(file: File, opts: ArticleImageOptions = {}): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi, upload gambar tidak tersedia.');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format gambar harus JPG, PNG, WEBP, atau GIF.');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Ukuran gambar maksimal 10 MB.');
  }

  const kind = opts.kind ?? 'content';
  const blob = await compressImage(file, kind === 'cover' ? 1200 : 1600);
  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : blob.type === 'image/gif' ? 'gif' : 'jpg';

  const now = new Date();
  const folder = `${kind}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const name = `${crypto.randomUUID()}.${ext}`;

  const { url } = await uploadFile('articles', `${folder}/${name}`, blob, {
    upsert: false,
    contentType: blob.type,
    cacheControl: '31536000', // nama file unik -> aman di-cache 1 tahun
  });
  return url;
}

/**
 * Upload foto produk ke Supabase Storage (bucket `products`).
 * Foto dikompres di browser (lebar maks 1000px, WebP) sehingga ringan di katalog.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi, upload gambar tidak tersedia.');
  }
  // GIF tidak dipakai untuk foto produk (bucket hanya menerima JPG/PNG/WEBP)
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Format foto harus JPG, PNG, atau WEBP.');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Ukuran foto maksimal 10 MB.');
  }

  const blob = await compressImage(file, 1000);
  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg';

  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const name = `${crypto.randomUUID()}.${ext}`;

  const { url } = await uploadFile('products', `${folder}/${name}`, blob, {
    upsert: false,
    contentType: blob.type,
    cacheControl: '31536000', // nama file unik -> aman di-cache 1 tahun
  });
  return url;
}

/** true jika HTML mengandung gambar base64 (data:) yang akan membengkakkan database */
export function hasInlineBase64Image(html: string): boolean {
  return /<img[^>]+src\s*=\s*["']?data:/i.test(html);
}
