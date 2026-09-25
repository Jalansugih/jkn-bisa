import React, { useState, useMemo, useEffect } from 'react';
import { Article, Product } from '../../types';
import { ARTICLES_DATA, PRODUCTS_DATA } from '../../data/mockData';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  Tag,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Copy,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Send,
  Mail,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface SingleArticlePageProps {
  articleId: string;
  articles?: Article[];
  products?: Product[];
  onBackToArticles: () => void;
  onBackToHome: () => void;
  onSelectArticle: (articleId: string) => void;
  onToggleBookmark: (artId: string) => void;
  bookmarkedArticles: string[];
  onOpenOrder: (prodKey: string) => void;
  onOpenConsultation: () => void;
  onAskWhatsapp: (topic: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const SingleArticlePage: React.FC<SingleArticlePageProps> = ({
  articleId,
  articles: propArticles,
  products: propProducts,
  onBackToArticles,
  onBackToHome,
  onSelectArticle,
  onToggleBookmark,
  bookmarkedArticles,
  onOpenOrder,
  onOpenConsultation,
  onAskWhatsapp,
  showToast,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const allArticles = useMemo(() => {
    if (propArticles && propArticles.length > 0) {
      return propArticles;
    }
    return Object.values(ARTICLES_DATA);
  }, [propArticles]);

  // Get current article or fallback
  const article: Article = useMemo(() => {
    const found = allArticles.find((a) => a.id === articleId);
    return found || ARTICLES_DATA[articleId] || allArticles[0] || ARTICLES_DATA['art_1'];
  }, [allArticles, articleId]);

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFeedbackGiven(null);
  }, [articleId]);

  const isBookmarked = bookmarkedArticles.includes(article.id);

  // Related articles (same category or others excluding current)
  const relatedArticles = useMemo(() => {
    return allArticles
      .filter((a) => a.id !== article.id)
      .sort((a, b) => (a.category === article.category ? -1 : 1))
      .slice(0, 3);
  }, [allArticles, article]);

  // Find previous and next article
  const { prevArticle, nextArticle } = useMemo(() => {
    const currentIndex = allArticles.findIndex((a) => a.id === article.id);
    const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
    const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
    return { prevArticle: prev, nextArticle: next };
  }, [allArticles, article]);

  // Recommend relevant service based on category
  const recommendedProductKey = useMemo(() => {
    if (article.category === 'legalitas') return 'pt_pro';
    if (article.category === 'digital') return 'website_pro';
    if (article.category === 'keuangan') return 'rajakas_pos';
    if (article.category === 'pemasaran') return 'socmed_ads';
    if (article.category === 'skala-usaha') return 'pt_pro';
    return 'pt_pro';
  }, [article.category]);

  const recommendedProduct = useMemo(() => {
    if (propProducts && propProducts.length > 0) {
      const match = propProducts.find((p) => p.id === recommendedProductKey) ||
        propProducts.find((p) => p.category === article.category) ||
        propProducts[0];
      if (match) return match;
    }
    return PRODUCTS_DATA[recommendedProductKey] || PRODUCTS_DATA['pt_pro'];
  }, [propProducts, recommendedProductKey, article.category]);

  // Handlers
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Tautan artikel berhasil disalin ke clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsapp = () => {
    const text = `Halo, saya baru saja membaca artikel bermanfaat dari BinaUsaha: "${article.title}"\n\nPelajari selengkapnya di portal BinaUsaha.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Mohon masukkan alamat email yang valid', 'warning');
      return;
    }
    setIsSubscribed(true);
    showToast('Terima kasih! Anda berhasil berlangganan buletin edukasi bisnis.', 'success');
  };

  const handleFeedback = (type: 'yes' | 'no') => {
    setFeedbackGiven(type);
    if (type === 'yes') {
      showToast('Terima kasih atas ulasan positif Anda! Kami akan terus menyajikan panduan terbaik.', 'success');
    } else {
      showToast('Terima kasih atas masukan Anda. Kami akan terus meningkatkan kualitas materi artikel.', 'info');
    }
  };

  return (
    <div id="single-article-page" className="min-h-screen bg-slate-50/60 pb-20">
      {/* 1. Header Sticky Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap py-1">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 font-medium transition cursor-pointer text-slate-700"
            >
              Beranda
            </button>
            <span>/</span>
            <button
              onClick={onBackToArticles}
              className="hover:text-blue-600 font-medium transition cursor-pointer text-slate-700"
            >
              Pusat Edukasi
            </button>
            <span>/</span>
            <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 truncate max-w-[200px] sm:max-w-[320px]">
              {article.categoryLabel}
            </span>
          </div>

          {/* Quick Back Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToArticles}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Semua Artikel</span>
            </button>
            <button
              onClick={() => onAskWhatsapp(`Diskusi Artikel: ${article.title}`)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tanya Ahli</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Article Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Article Column (8 cols) */}
          <main className="lg:col-span-8 space-y-8">
            <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
              {/* Category & Action Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 font-extrabold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-200 shadow-xs">
                    {article.categoryLabel}
                  </span>
                  {article.featured && (
                    <span className="bg-amber-50 text-amber-800 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Artikel Pilihan</span>
                    </span>
                  )}
                </div>

                {/* Social Share & Bookmark */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleBookmark(article.id)}
                    className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                      isBookmarked
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200'
                    }`}
                    title="Simpan Artikel"
                  >
                    <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="hidden sm:inline">{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsapp}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title="Bagikan ke WhatsApp"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title="Salin Tautan"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-slate-900 leading-tight tracking-tight">
                  {article.title}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 font-medium">
                  {article.excerpt}
                </p>
              </div>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-heading font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/20 flex-shrink-0">
                    BU
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{article.author}</h4>
                    <p className="text-xs text-slate-500">{article.authorRole || 'Konsultan Senior BinaUsaha'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{article.date}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{article.readTime}</span>
                  </div>
                  {article.views && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span>{article.views.toLocaleString()} Pembaca</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-sm border border-slate-200">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-medium px-3 py-1 rounded-lg">
                  Panduan Edukasi Bisnis © BinaUsaha
                </div>
              </div>

              {/* Rich Body Content */}
              <div
                className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 border-b border-slate-100 pb-8"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />

              {/* Tag Cloud */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" /> Tag Terkait:
                  </span>
                  {article.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Article Helpful Feedback */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Apakah artikel dan panduan ini membantu usaha Anda?
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tanggapan Anda membantu kami menyajikan materi edukasi yang lebih berkualitas.
                  </p>
                </div>
                {feedbackGiven ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Terima kasih atas tanggapan Anda!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback('yes')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-semibold text-xs transition cursor-pointer shadow-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sangat Membantu</span>
                    </button>
                    <button
                      onClick={() => handleFeedback('no')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition cursor-pointer shadow-xs"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                      <span>Kurang Jelas</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Author Bio Box */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-heading font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-600/20 flex-shrink-0">
                  BU
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{article.author}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{article.authorRole || 'Divisi Konsultasi & Legalitas BinaUsaha'}</p>
                    </div>
                    <button
                      onClick={() => onAskWhatsapp(`Konsultasi dengan Penulis tentang artikel: ${article.title}`)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Konsultasi Topik Ini</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    BinaUsaha berdedikasi mendampingi pelaku usaha mikro, kecil, dan menengah di seluruh Indonesia dengan layanan legalitas resmi, sistem teknologi kasir, website profesional, serta tata kelola keuangan yang transparan.
                  </p>
                </div>
              </div>
            </article>

            {/* Prev & Next Article Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <div
                  onClick={() => onSelectArticle(prevArticle.id)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    <span>Artikel Sebelumnya</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {prevArticle.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {prevArticle.categoryLabel} • {prevArticle.readTime}
                  </span>
                </div>
              ) : (
                <div className="hidden sm:block"></div>
              )}

              {nextArticle ? (
                <div
                  onClick={() => onSelectArticle(nextArticle.id)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-2 text-right group"
                >
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-end gap-1">
                    <span>Artikel Selanjutnya</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {nextArticle.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {nextArticle.categoryLabel} • {nextArticle.readTime}
                  </span>
                </div>
              ) : (
                <div className="hidden sm:block"></div>
              )}
            </div>
          </main>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Direct Recommended Service Package CTA */}
            {recommendedProduct && (
              <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-md shadow-blue-900/5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    Rekomendasi Layanan
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    {recommendedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {recommendedProduct.description}
                  </p>
                </div>

                <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Biaya Paket All-In</span>
                    <span className="font-heading font-extrabold text-blue-700 text-lg">
                      {recommendedProduct.price}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Resmi & Bergaransi
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  {recommendedProduct.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onOpenOrder(recommendedProduct.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pesan Layanan Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 2. Related Articles Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Artikel Edukasi Lainnya</span>
                </h3>
                <button
                  onClick={onBackToArticles}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                >
                  Semua
                </button>
              </div>

              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel.id)}
                    className="flex gap-3.5 items-center group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {rel.categoryLabel}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{rel.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Quick Consultation Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Konsultasi Gratis Legalitas & Usaha
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Bingung menentukan bentuk badan usaha (PT / CV / NIB) atau sistem kasir toko Anda? Tim konsultan kami siap membantu.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onAskWhatsapp(`Konsultasi Masalah Usaha setelah membaca artikel: ${article.title}`)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Konsultan (WhatsApp)</span>
                </button>
                <button
                  onClick={onOpenConsultation}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                >
                  Isi Formulir Konsultasi
                </button>
              </div>
            </div>

            {/* 4. Mini Newsletter Widget */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Buletin Edukasi Mingguan</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dapatkan artikel panduan terbaru dan informasi promo paket langsung di email Anda.
              </p>
              {isSubscribed ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs font-bold text-emerald-700">
                  Email Anda telah terdaftar!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Email bisnis Anda..."
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                  >
                    Langganan Gratis
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
