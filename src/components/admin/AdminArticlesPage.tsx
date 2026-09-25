import React, { useState } from 'react';
import { Article } from '../../types';
import { addArticle, updateArticle, deleteArticle } from '../../lib/articleService';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  Star,
  ExternalLink,
  Save,
  Loader2,
  X,
  Sparkles,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface AdminArticlesPageProps {
  articles: Article[];
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onPreviewArticle?: (articleId: string) => void;
}

const CATEGORY_MAP: Record<Article['category'], string> = {
  legalitas: 'Legalitas & Perizinan',
  digital: 'Digital & Website',
  keuangan: 'Keuangan & Pajak',
  pemasaran: 'Pemasaran & Branding',
  operasional: 'Operasional & Kasir',
  'skala-usaha': 'Skala Usaha & Ekspor',
};

const PRESET_IMAGES = [
  { label: 'Kantor & Legalitas', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop' },
  { label: 'Laptop & Coding', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
  { label: 'Kasir & Ritel', url: 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=600&h=400&fit=crop' },
  { label: 'Pajak & Finansial', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop' },
  { label: 'Branding & Desain', url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop' },
  { label: 'Staf & Tim Usaha', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop' },
];

export const AdminArticlesPage: React.FC<AdminArticlesPageProps> = ({
  articles,
  showToast,
  onPreviewArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Article['category']>('legalitas');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Legalitas & Perizinan');
  const [formDate, setFormDate] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 Min baca');
  const [formImage, setFormImage] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContentHtml, setFormContentHtml] = useState('');
  const [formAuthor, setFormAuthor] = useState('Tim BinaUsaha');
  const [formAuthorRole, setFormAuthorRole] = useState('Konsultan Perizinan Bisnis');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTagsString, setFormTagsString] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formStatus, setFormStatus] = useState<Article['status']>('DRAFT');

  // Filtered list
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q) ||
      art.author.toLowerCase().includes(q) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesCategory && matchesQuery;
  });

  const handleOpenAdd = () => {
    setIsEditMode(false);
    const newId = 'art_' + Date.now().toString(36);
    setFormId(newId);
    setFormTitle('');
    setFormSlug('');
    setFormStatus('DRAFT');
    setFormCategory('legalitas');
    setFormCategoryLabel(CATEGORY_MAP.legalitas);
    setFormDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setFormReadTime('4 Min baca');
    setFormImage(PRESET_IMAGES[0].url);
    setFormExcerpt('');
    setFormContentHtml(`<p>Tulis paragraf pembuka artikel di sini...</p>\n\n<h4 class="font-bold text-slate-900 text-sm mt-4 mb-2">Poin Penting</h4>\n<ul class="list-disc pl-5 space-y-1 text-xs text-slate-700">\n  <li>Poin pertama yang informatif</li>\n  <li>Poin kedua dengan penjelasan rinci</li>\n</ul>\n\n<p class="mt-4">Kesimpulan dan ajakan konsultasi bersama tim BinaUsaha.</p>`);
    setFormAuthor('Tim Redaksi BinaUsaha');
    setFormAuthorRole('Konsultan & Edukasi UMKM');
    setFormFeatured(false);
    setFormTagsString('Legalitas, UMKM, Bisnis');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setIsEditMode(true);
    setFormId(article.id);
    setFormTitle(article.title);
    setFormSlug(article.slug || '');
    setFormStatus(article.status || 'PUBLISHED');
    setFormCategory(article.category);
    setFormCategoryLabel(article.categoryLabel || CATEGORY_MAP[article.category] || 'Informasi');
    setFormDate(article.date);
    setFormReadTime(article.readTime);
    setFormImage(article.image);
    setFormExcerpt(article.excerpt);
    setFormContentHtml(article.contentHtml);
    setFormAuthor(article.author);
    setFormAuthorRole(article.authorRole || '');
    setFormFeatured(Boolean(article.featured));
    setFormTagsString(article.tags ? article.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleCategoryChange = (cat: Article['category']) => {
    setFormCategory(cat);
    setFormCategoryLabel(CATEGORY_MAP[cat] || 'Informasi');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Judul artikel wajib diisi!', 'warning');
      return;
    }
    if (!formExcerpt.trim()) {
      showToast('Ringkasan / excerpt artikel wajib diisi!', 'warning');
      return;
    }
    if (!formContentHtml.trim()) {
      showToast('Konten artikel wajib diisi!', 'warning');
      return;
    }

    setIsSubmitting(true);
    const tagsArray = formTagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const articlePayload: Article = {
      id: formId,
      title: formTitle.trim(),
      slug: formSlug.trim(),
      status: formStatus || 'DRAFT',
      category: formCategory,
      categoryLabel: formCategoryLabel,
      date: formDate.trim() || new Date().toLocaleDateString('id-ID'),
      readTime: formReadTime.trim() || '4 Min baca',
      image: formImage.trim() || PRESET_IMAGES[0].url,
      excerpt: formExcerpt.trim(),
      contentHtml: formContentHtml.trim(),
      author: formAuthor.trim() || 'Tim BinaUsaha',
      authorRole: formAuthorRole.trim() || 'Konsultan Bisnis',
      featured: formFeatured,
      tags: tagsArray,
      views: isEditMode ? undefined : 0,
      createdAt: isEditMode ? undefined : new Date(),
      updatedAt: new Date(),
    };

    try {
      if (isEditMode) {
        await updateArticle(formId, articlePayload);
        showToast(`Artikel "${formTitle}" berhasil diperbarui!`, 'success');
      } else {
        await addArticle(articlePayload);
        showToast(`Artikel baru "${formTitle}" berhasil diterbitkan!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan artikel ke database.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (article: Article) => {
    if (!confirm(`Yakin ingin menghapus artikel "${article.title}"? Data akan terhapus dari portal dan website.`)) {
      return;
    }
    try {
      await deleteArticle(article.id);
      showToast(`Artikel "${article.title}" berhasil dihapus.`, 'info');
      if (previewArticle?.id === article.id) {
        setPreviewArticle(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus artikel.', 'error');
    }
  };

  return (
    <div id="admin-articles-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Manajemen Artikel & Edukasi UMKM
            </h2>
            <span className="text-xs bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">
              {articles.filter((a) => (a.status || 'PUBLISHED') === 'PUBLISHED').length} Terbit · {articles.filter((a) => a.status === 'DRAFT').length} Draft
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Semua artikel yang dibuat atau diedit di sini langsung tampil otomatis di Website Utama (Pusat Edukasi)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, tag, penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-full sm:w-56"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="legalitas">Legalitas & Perizinan</option>
              <option value="digital">Digital & Website</option>
              <option value="keuangan">Keuangan & Pajak</option>
              <option value="pemasaran">Pemasaran & Branding</option>
              <option value="operasional">Operasional & Kasir</option>
              <option value="skala-usaha">Skala Usaha & Ekspor</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            id="btn-admin-add-article"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </button>
        </div>
      </div>

      {/* Articles Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs shadow-xs">
            Tidak ada artikel yang sesuai dengan filter atau pencarian Anda.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Article Cover Image */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                      {art.categoryLabel || art.category}
                    </span>
                    {art.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Unggulan</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Article Content Info */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{art.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-slate-900 line-clamp-2 mb-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {art.excerpt}
                  </p>

                  {/* Author badge */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-semibold">{art.author}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">ID: {art.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewArticle(art)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                    title="Lihat Pratinjau Artikel"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition cursor-pointer"
                    title="Edit Artikel"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(art)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Article */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100/60 px-2 py-0.5 rounded border border-purple-200">
                  {isEditMode ? 'Edit Artikel' : 'Publikasi Artikel Baru'}
                </span>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 mt-1">
                  {isEditMode ? `Edit: ${formTitle || formId}` : 'Tulis Panduan Edukasi Bisnis'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Title & Slug */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Judul Artikel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Panduan Lengkap Mengurus NIB OSS RBA untuk UMKM di 2026"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Slug</label>
                  <input type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="panduan-nib-umkm" className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800" />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Status Publikasi</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as Article['status'])} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              {/* Category & Read Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kategori Artikel
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as Article['category'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="legalitas">Legalitas & Perizinan</option>
                    <option value="digital">Digital & Website</option>
                    <option value="keuangan">Keuangan & Pajak</option>
                    <option value="pemasaran">Pemasaran & Branding</option>
                    <option value="operasional">Operasional & Kasir</option>
                    <option value="skala-usaha">Skala Usaha & Ekspor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Estimasi Waktu Baca & Tanggal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(e.target.value)}
                      placeholder="5 Min baca"
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      placeholder="26 Agustus 2026"
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image URL & Presets */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Gambar Cover (URL Unsplash / Gambar Bisnis)
                </label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400">Pilihan Cepat:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormImage(preset.url)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                        formImage === preset.url
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ringkasan / Excerpt (Tampil di Kartu & Meta) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat mengenai poin utama artikel..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content HTML */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold uppercase tracking-wider text-slate-700">
                    Konten Lengkap (HTML / Teks) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Mendukung tag HTML &lt;p&gt;, &lt;h4&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;b&gt;
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={formContentHtml}
                  onChange={(e) => setFormContentHtml(e.target.value)}
                  placeholder="<p>Isi artikel lengkap...</p>"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px] focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Author, Role & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Tim BinaUsaha Legal"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Jabatan Penulis
                  </label>
                  <input
                    type="text"
                    value={formAuthorRole}
                    onChange={(e) => setFormAuthorRole(e.target.value)}
                    placeholder="Konsultan Perizinan Bisnis"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tag Topik (Pisahkan Koma)
                  </label>
                  <input
                    type="text"
                    value={formTagsString}
                    onChange={(e) => setFormTagsString(e.target.value)}
                    placeholder="NIB, OSS, Legalitas"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-800">
                    Jadikan Artikel Unggulan (Tampil di slider/headline utama)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isEditMode ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Article Modal */}
      {previewArticle && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-500">Pratinjau Artikel</span>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <img
                src={previewArticle.image}
                alt={previewArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover rounded-2xl border border-slate-100"
              />
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {previewArticle.categoryLabel || previewArticle.category}
                </span>
                <h2 className="text-xl font-heading font-extrabold text-slate-900 mt-2">
                  {previewArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{previewArticle.date}</span>
                  <span>•</span>
                  <span>{previewArticle.readTime}</span>
                  <span>•</span>
                  <span>Oleh {previewArticle.author}</span>
                </div>
              </div>
              <div
                className="prose prose-sm text-slate-700 max-w-none border-t border-slate-100 pt-4"
                dangerouslySetInnerHTML={{ __html: previewArticle.contentHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
