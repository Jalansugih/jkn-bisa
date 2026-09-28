import { supabase, isSupabaseConfigured } from './supabase';
import { Article } from '../types';
import { ARTICLES_DATA } from '../data/mockData';
import { slugify, makeUniqueSlug } from './slug';

const STORAGE_KEY = 'bu_articles_cache';

interface ArticleRow {
  id: string;
  title: string;
  slug: string | null;
  status: Article['status'];
  category: Article['category'];
  category_label: string | null;
  date: string | null;
  read_time: string | null;
  image: string | null;
  excerpt: string | null;
  content_html: string | null;
  author: string | null;
  author_role: string | null;
  featured: boolean | null;
  views: number | null;
  tags: string[] | null;
  created_at: string | null;
}

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title || 'Artikel Tanpa Judul',
    slug: row.slug || slugify(row.title || row.id),
    status: row.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
    category: row.category || 'legalitas',
    categoryLabel: row.category_label || 'Informasi',
    date: row.date || '',
    readTime: row.read_time || '3 Min baca',
    image: row.image || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
    excerpt: row.excerpt || '',
    contentHtml: row.content_html || '',
    author: row.author || 'Tim BinaUsaha',
    authorRole: row.author_role || 'Redaksi & Edukasi Bisnis',
    featured: Boolean(row.featured),
    views: Number(row.views) || 0,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
  };
}

function articleToRow(article: Partial<Article>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (article.title !== undefined) row.title = article.title;
  if (article.slug !== undefined) row.slug = article.slug;
  if (article.status !== undefined) row.status = article.status;
  if (article.category !== undefined) row.category = article.category;
  if (article.categoryLabel !== undefined) row.category_label = article.categoryLabel;
  if (article.date !== undefined) row.date = article.date;
  if (article.readTime !== undefined) row.read_time = article.readTime;
  if (article.image !== undefined) row.image = article.image;
  if (article.excerpt !== undefined) row.excerpt = article.excerpt;
  if (article.contentHtml !== undefined) row.content_html = article.contentHtml;
  if (article.author !== undefined) row.author = article.author;
  if (article.authorRole !== undefined) row.author_role = article.authorRole;
  if (article.featured !== undefined) row.featured = article.featured;
  if (article.views !== undefined) row.views = article.views;
  if (article.tags !== undefined) row.tags = article.tags;
  return row;
}

function getLocalArticles(): Article[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) { console.warn('[getLocalArticles] Read cache failed:', err); }
  return Object.values(ARTICLES_DATA).map((a) => ({ ...a, slug: a.slug || slugify(a.title), status: a.status || 'PUBLISHED' }));
}

function saveLocalArticles(articles: Article[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(articles)); }
  catch (err) { console.warn('[saveLocalArticles] Write cache failed:', err); }
}

/** createdAt → milidetik. Mendukung string ISO (Supabase) maupun objek Timestamp lama. */
export function createdMillis(a: Pick<Article, 'createdAt'>): number {
  const c = a.createdAt as unknown;
  if (!c) return 0;
  if (typeof c === 'string' || typeof c === 'number') {
    const t = new Date(c).getTime();
    return Number.isNaN(t) ? 0 : t;
  }
  if (typeof (c as { toMillis?: () => number }).toMillis === 'function') return (c as { toMillis: () => number }).toMillis();
  return 0;
}

function sortByCreatedAt(items: Article[]): Article[] {
  return [...items].sort((a, b) => createdMillis(b) - createdMillis(a));
}

// ---------------------------------------------------------------------
// Penghitung pembaca (views)
// ---------------------------------------------------------------------
const VISITOR_KEY = 'bu_visitor_id';
const viewsInFlight = new Set<string>();

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id || id.length < 8) {
      id = (crypto.randomUUID ? crypto.randomUUID() : `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    // localStorage diblokir (mode privat ketat): id sementara untuk sesi ini
    return `tmp_${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;
  }
}

function todayKey(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date()); // YYYY-MM-DD
}

/**
 * Catat 1 pembaca untuk artikel. Server yang menjaga agar satu pengunjung
 * hanya dihitung 1x per artikel per hari (lihat migrasi 2026-09-29_article_views.sql).
 * Mengembalikan jumlah pembaca terbaru, atau null bila tidak dihitung / gagal.
 */
export async function trackArticleView(articleId: string): Promise<number | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const dedupeKey = `bu_viewed_${articleId}`;
  try {
    if (localStorage.getItem(dedupeKey) === todayKey()) return null; // sudah dihitung hari ini di browser ini
  } catch { /* abaikan */ }

  if (viewsInFlight.has(articleId)) return null; // cegah panggilan ganda (React StrictMode)
  viewsInFlight.add(articleId);

  try {
    const { data, error } = await supabase.rpc('increment_article_view', {
      p_article_id: articleId,
      p_visitor_id: getVisitorId(),
    });
    if (error) {
      console.warn('[trackArticleView] gagal mencatat pembaca:', error.message);
      return null;
    }
    if (typeof data !== 'number') return null; // artikel bukan dari database / belum PUBLISHED
    try { localStorage.setItem(dedupeKey, todayKey()); } catch { /* abaikan */ }
    return data;
  } catch (err) {
    console.warn('[trackArticleView] error:', err);
    return null;
  } finally {
    viewsInFlight.delete(articleId);
  }
}


/** Ambil semua slug yang terpakai (kecuali milik artikel `excludeId`). */
async function getTakenSlugs(excludeId?: string): Promise<Set<string>> {
  const taken = new Set<string>();
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('articles').select('id, slug');
    (data || []).forEach((r: { id: string; slug: string | null }) => {
      if (r.slug && r.id !== excludeId) taken.add(r.slug);
    });
  } else {
    getLocalArticles().forEach((a) => { if (a.slug && a.id !== excludeId) taken.add(a.slug); });
  }
  return taken;
}

/** Slug final yang dijamin unik: pakai slug input admin, atau turunan dari judul. */
export async function resolveUniqueSlug(input: string | undefined, title: string, excludeId?: string): Promise<string> {
  const taken = await getTakenSlugs(excludeId);
  return makeUniqueSlug(input?.trim() || title, taken);
}

/**
 * Real-time subscription ke tabel `articles` (pengganti onSnapshot Firestore).
 */
export function subscribeToArticles(callback: (articles: Article[]) => void): () => void {
  callback(sortByCreatedAt(getLocalArticles()));
  if (!isSupabaseConfigured || !supabase) return () => {};

  const fetchAndEmit = async () => {
    const { data, error } = await supabase.from('articles').select('*');

    if (error) {
      console.warn('[subscribeToArticles] Supabase error, using local data:', error);
      callback(sortByCreatedAt(getLocalArticles()));
      return;
    }

    if (!data || data.length === 0) {
      callback(sortByCreatedAt(getLocalArticles()));
      return;
    }

    const articles = sortByCreatedAt((data as ArticleRow[]).map(rowToArticle));
    callback(articles);
    saveLocalArticles(articles);
  };

  fetchAndEmit();

  // Debounce: setiap pembaca baru memicu event UPDATE (kolom views) untuk semua
  // klien; tanpa jeda, semua klien akan langsung mengunduh ulang seluruh artikel.
  let timer: ReturnType<typeof setTimeout> | null = null;
  const scheduleFetch = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fetchAndEmit, 2000);
  };

  const channel = supabase
    .channel('articles-list')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, scheduleFetch)
    .subscribe();

  return () => {
    if (timer) clearTimeout(timer);
    supabase.removeChannel(channel);
  };
}

export async function addArticle(article: Article): Promise<void> {
  const id = (article.id || 'art_' + Date.now()).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const slug = await resolveUniqueSlug(article.slug, article.title);
  const articleData = { ...article, id, slug, status: article.status || 'DRAFT' };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('articles').insert({ id, ...articleToRow(articleData) });
    if (error) throw new Error(`Gagal menambah artikel: ${error.message}`);
  }

  saveLocalArticles(sortByCreatedAt([articleData, ...getLocalArticles().filter((a) => a.id !== id)]));
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<void> {
  const payload: Partial<Article> = { ...updates };

  // Slug hanya diubah jika admin mengisinya dan nilainya berbeda dari yang tersimpan.
  // Mengedit judul TIDAK mengubah slug, supaya link lama tidak rusak.
  const current = getLocalArticles().find((a) => a.id === id);
  const wantedSlug = updates.slug?.trim();
  if (wantedSlug && wantedSlug !== current?.slug) {
    payload.slug = await resolveUniqueSlug(wantedSlug, updates.title || current?.title || id, id);
  } else if (!current?.slug && (updates.title || current?.title)) {
    payload.slug = await resolveUniqueSlug(undefined, (updates.title || current?.title) as string, id);
  } else {
    delete payload.slug;
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('articles').update(articleToRow(payload)).eq('id', id);
    if (error) throw new Error(`Gagal memperbarui artikel: ${error.message}`);
  }

  saveLocalArticles(getLocalArticles().map((a) => (a.id === id ? { ...a, ...payload } : a)));
}

export async function deleteArticle(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw new Error(`Gagal menghapus artikel: ${error.message}`);
  }
  saveLocalArticles(getLocalArticles().filter((a) => a.id !== id));
}
