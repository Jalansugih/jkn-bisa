import React, { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { ARTICLES_DATA } from '../../data/mockData';
import {
  Search,
  Heart,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Eye,
  Tag,
  Share2,
  CheckCircle2,
  Mail,
  Send,
  MessageSquare,
  FileText,
  SlidersHorizontal,
  Bookmark,
  TrendingUp,
} from 'lucide-react';

interface ArticlesHubPageProps {
  articles?: Article[];
  onBackToHome: () => void;
  onOpenArticle: (artKey: string) => void;
  onToggleBookmark: (artKey: string) => void;
  bookmarkedArticles: string[];
  onOpenConsultation: () => void;
  onAskWhatsapp: (topic: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  initialCategory?: string;
}

export const ArticlesHubPage: React.FC<ArticlesHubPageProps> = ({
  articles: propArticles,
  onBackToHome,
  onOpenArticle,
  onToggleBookmark,
  bookmarkedArticles,
  onOpenConsultation,
  onAskWhatsapp,
  showToast,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'quickest'>('newest');
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const allArticles = useMemo(() => {
    if (propArticles && propArticles.length > 0) {
      return propArticles;
    }
    return Object.values(ARTICLES_DATA);
  }, [propArticles]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allArticles.length,
      legalitas: 0,
      digital: 0,
      keuangan: 0,
      pemasaran: 0,
      operasional: 0,
      'skala-usaha': 0,
      bookmarks: bookmarkedArticles.length,
    };
    allArticles.forEach((art) => {
      if (counts[art.category] !== undefined) {
        counts[art.category]++;
      } else {
        counts[art.category] = 1;
      }
    });
    return counts;
  }, [allArticles, bookmarkedArticles]);

  // Featured article (first featured one or default art_1)
  const featuredArticle = useMemo(() => {
    return allArticles.find((a) => a.featured) || allArticles[0];
  }, [allArticles]);

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    return allArticles
      .filter((art) => {
        // Category filter
        if (selectedCategory === 'bookmarks') {
          if (!bookmarkedArticles.includes(art.id)) return false;
        } else if (selectedCategory !== 'all') {
          if (art.category !== selectedCategory) return false;
        }

        // Search query filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchExcerpt = art.excerpt.toLowerCase().includes(q);
          const matchAuthor = art.author.toLowerCase().includes(q);
          const matchTags = art.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
          if (!matchTitle && !matchExcerpt && !matchAuthor && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.views || 0) - (a.views || 0);
        }
        if (sortBy === 'quickest') {
          const timeA = parseInt(a.readTime) || 5;
          const timeB = parseInt(b.readTime) || 5;
          return timeA - timeB;
        }
        const av = a.createdAt && typeof (a.createdAt as any).toMillis === 'function' ? (a.createdAt as any).toMillis() : 0;
        const bv = b.createdAt && typeof (b.createdAt as any).toMillis === 'function' ? (b.createdAt as any).toMillis() : 0;
        return bv - av;
      });
  }, [allArticles, selectedCategory, searchQuery, sortBy, bookmarkedArticles]);

  // Handle newsletter subscription
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Mohon masukkan alamat email yang valid', 'warning');
      return;
    }
    setIsSubscribed(true);
    showToast('Terima kasih! Anda berhasil berlangganan Buletin Edukasi Bisnis.', 'success');
  };

  const handleShareArticle = (e: React.MouseEvent, art: Article) => {
    e.stopPropagation();
    const text = `Baca artikel bermanfaat dari BinaUsaha: "${art.title}"`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const popularTags = [
    'NIB RBA',
    'Sertifikasi Halal',
    'PT Perorangan',
    'Website Bisnis',
    'Aplikasi Kasir POS',
    'Instagram Ads',
    'Arus Kas',
    'Scale Up',
  ];

  return (
    <div id="articles-hub-page" className="min-h-screen bg-slate-50/60 pb-20">
      {/* 1. Header & Navigation Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 font-medium transition cursor-pointer flex items-center gap-1 text-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Beranda</span>
            </button>
            <span>/</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Pusat Edukasi & Artikel Bisnis
            </span>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAskWhatsapp('Konsultasi Materi Edukasi Bisnis')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya Ahli Bisnis (WA)</span>
            </button>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <span>Kembali ke Toko</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Section: Hub Title & Highlight Featured Article */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kumpulan Artikel & Panduan Resmi UMKM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
            Pusat Edukasi <span className="text-blue-600">Legalitas & Pertumbuhan Bisnis</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Kumpulan wawasan praktis, panduan hukum resmi Kemenkumham/OSS, digitalisasi toko, manajemen arus kas, dan strategi scale-up yang terbukti membantu ribuan wirausaha.
          </p>
        </div>

        {/* Featured / Editor's Pick Banner */}
        {featuredArticle && (
          <div className="mb-12 bg-white rounded-3xl border border-blue-200/80 p-5 sm:p-7 shadow-xl shadow-blue-900/5 hover:border-blue-300 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Image */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-video lg:aspect-4/3 bg-slate-100 group">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-blue-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Pilihan Editor</span>
                  </span>
                  <span className="bg-white/90 backdrop-blur text-slate-800 font-bold text-[11px] px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                    {featuredArticle.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> {featuredArticle.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> {featuredArticle.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> {featuredArticle.views?.toLocaleString()} Pembaca
                    </span>
                  </div>

                  <h2
                    onClick={() => onOpenArticle(featuredArticle.id)}
                    className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer leading-snug"
                  >
                    {featuredArticle.title}
                  </h2>

                  <p className="text-slate-600 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  {/* Tags */}
                  {featuredArticle.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {featuredArticle.tags.map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSearchQuery(t)}
                          className="text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-blue-500" />
                          <span>{t}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      BU
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{featuredArticle.author}</p>
                      <p className="text-[10px] text-slate-500">{featuredArticle.authorRole || 'Konsultan BinaUsaha'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBookmark(featuredArticle.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer shadow-xs ${
                        bookmarkedArticles.includes(featuredArticle.id)
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                      }`}
                      title="Simpan Artikel"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          bookmarkedArticles.includes(featuredArticle.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => onOpenArticle(featuredArticle.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      <span>Baca Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Search & Interactive Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                id="articleHubSearchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci (NIB, PT, Website, Kasir, Iklan)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold px-1 rounded-full"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Stats */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="text-xs text-slate-500">
                Menampilkan <strong className="text-slate-900">{filteredArticles.length}</strong> artikel
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="newest">Terbaru</option>
                  <option value="popular">Paling Populer</option>
                  <option value="quickest">Waktu Baca Tercepat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills with counts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <span>Semua</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.all}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('legalitas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'legalitas'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <span>Legalitas & Izin</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'legalitas' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.legalitas}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('digital')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'digital'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <span>Digital & Website</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'digital' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.digital}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('keuangan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'keuangan'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <span>Keuangan & Arus Kas</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'keuangan' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.keuangan}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('pemasaran')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'pemasaran'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <span>Pemasaran & Ads</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'pemasaran' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.pemasaran}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('operasional')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'operasional'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <span>Tips Usaha & SOP</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'operasional' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.operasional}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('skala-usaha')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'skala-usaha'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <span>Scale Up & Cabang</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'skala-usaha' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts['skala-usaha']}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('bookmarks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'bookmarks'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
              }`}
            >
              <Bookmark className="w-3 h-3 text-rose-500" />
              <span>Favorit Saya</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedCategory === 'bookmarks' ? 'bg-rose-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.bookmarks}
              </span>
            </button>
          </div>

          {/* Quick Tag Cloud */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" /> Topik Tren:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200 transition cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">
              Tidak Ada Artikel yang Cocok
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Tidak ditemukan artikel untuk kata kunci "{searchQuery}" atau filter kategori terpilih. Coba reset pencarian untuk melihat semua panduan.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => {
              const isBookmarked = bookmarkedArticles.includes(article.id);

              return (
                <article
                  key={article.id}
                  onClick={() => onOpenArticle(article.id)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-blue-900 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs border border-blue-100">
                      {article.categoryLabel}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleShareArticle(e, article)}
                        className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-blue-600 transition shadow-xs cursor-pointer border border-slate-200"
                        title="Bagikan Artikel"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(article.id);
                        }}
                        className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 transition shadow-xs cursor-pointer border border-slate-200"
                        title="Simpan ke Favorit"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isBookmarked ? 'text-rose-500 fill-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-600" /> {article.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-600" /> {article.readTime}
                          </span>
                        </div>
                        {article.views && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {article.views.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                        {article.excerpt}
                      </p>

                      {/* Tag list */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {article.tags.slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                          BU
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-800 block leading-tight">
                            {article.author}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {article.authorRole || 'Tim Edukasi'}
                          </span>
                        </div>
                      </div>
                      <span className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        Baca <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 5. Business Newsletter Subscription Card */}
        <div className="mt-16 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <span className="bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/30 inline-block shadow-xs">
                Buletin Mingguan Gratis
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Dapatkan Update Regulasi, Perizinan & Tips Usaha Tiap Pekan
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-xl">
                Bergabunglah dengan 15.000+ pemilik bisnis yang mendapatkan checklist legalitas, diskon paket kemitraan, dan panduan praktis langsung di kotak masuk email Anda.
              </p>
            </div>

            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center space-y-2 backdrop-blur-md">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto" />
                  <h4 className="font-bold text-sm text-white">Email Anda Berhasil Didaftarkan!</h4>
                  <p className="text-xs text-blue-100">
                    Nantikan kiriman materi edukasi bisnis edisi perdana di email <strong>{newsletterEmail}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-blue-300 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Masukkan alamat email aktif..."
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 py-3 rounded-xl font-bold text-xs transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Langganan Sekarang (100% Gratis)</span>
                  </button>
                  <p className="text-[10px] text-blue-200 text-center">
                    Kami menghargai privasi Anda. Bebas berhenti berlangganan kapan saja.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 6. Help / Consultation CTA Banner */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-base">
                Punya Pertanyaan Spesifik Mengenai Legalitas atau Sistem Toko Anda?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Konsultasikan langsung kendala usaha Anda dengan tim ahli legal dan IT BinaUsaha.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenConsultation}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition cursor-pointer"
            >
              Formulir Konsultasi
            </button>
            <button
              onClick={() => onAskWhatsapp('Konsultasi Kebutuhan Usaha dari Halaman Artikel')}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
