import React, { useState, useMemo } from 'react';
import { Article } from '../../types';
import { ARTICLES_DATA } from '../../data/mockData';
import { Search, Heart, Calendar, Clock, ArrowRight } from 'lucide-react';

interface ArticlesSectionProps {
  articles?: Article[];
  onOpenArticle: (artKey: string) => void;
  onToggleBookmark: (artKey: string) => void;
  bookmarkedArticles: string[];
  onViewAllArticles?: () => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  articles: propArticles,
  onOpenArticle,
  onToggleBookmark,
  bookmarkedArticles,
  onViewAllArticles,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const articlesList = useMemo(() => {
    const source = propArticles && propArticles.length > 0 ? propArticles : Object.values(ARTICLES_DATA);
    return source.filter((a) => (a.status || 'PUBLISHED') === 'PUBLISHED').sort((a, b) => {
      const av = a.createdAt && typeof (a.createdAt as any).toMillis === 'function' ? (a.createdAt as any).toMillis() : 0;
      const bv = b.createdAt && typeof (b.createdAt as any).toMillis === 'function' ? (b.createdAt as any).toMillis() : 0;
      return bv - av;
    });
  }, [propArticles]);

  const categoryTabs = useMemo(() => {
    const defaultCats = [
      { id: 'all', label: 'Semua Artikel' },
      { id: 'legalitas', label: 'Legalitas' },
      { id: 'digital', label: 'Digital & Website' },
      { id: 'keuangan', label: 'Keuangan' },
      { id: 'pemasaran', label: 'Pemasaran' },
      { id: 'operasional', label: 'Tips Usaha & SOP' },
      { id: 'skala-usaha', label: 'Scale Up' },
    ];

    const knownIds = new Set(defaultCats.map(c => c.id));
    const extraCats: { id: string; label: string }[] = [];

    articlesList.forEach(a => {
      if (a.category && !knownIds.has(a.category)) {
        knownIds.add(a.category);
        extraCats.push({
          id: a.category,
          label: a.categoryLabel || (a.category.charAt(0).toUpperCase() + a.category.slice(1)),
        });
      }
    });

    return [...defaultCats, ...extraCats];
  }, [articlesList]);

  const filteredArticles = useMemo(() => {
    return articlesList.filter((art) => {
      const matchesCat = activeCategory === 'all' || art.category === activeCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCat && matchesSearch;
    });
  }, [articlesList, activeCategory, searchQuery]);

  return (
    <section className="py-20 bg-slate-50/60 border-t border-slate-200" id="artikel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-blue-700 font-semibold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
              Pusat Edukasi & Informasi
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
              Artikel & Tips Bisnis UMKM
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl">
              Pelajari panduan praktis legalitas, digitalisasi, strategi pemasaran, dan manajemen arus kas.
            </p>
          </div>

          {/* Live Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              id="articleSearchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
              placeholder="Cari artikel (contoh: NIB, website, keuangan)..."
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categoryTabs.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`art-filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`art-filter-btn px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="articleCardsGrid">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedArticles.includes(article.id);

            return (
              <article
                key={article.id}
                onClick={() => onOpenArticle(article.id)}
                className="article-item bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-900 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs border border-blue-100">
                    {article.categoryLabel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(article.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 transition shadow-xs cursor-pointer border border-slate-200"
                    title="Simpan Artikel"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isBookmarked ? 'text-rose-500 fill-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">{article.excerpt}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        BU
                      </div>
                      <span className="text-xs font-medium text-slate-600">{article.author}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenArticle(article.id);
                      }}
                      className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                    >
                      Baca <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => {
              if (onViewAllArticles) {
                onViewAllArticles();
              } else {
                setActiveCategory('all');
              }
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition cursor-pointer"
          >
            <span>Lihat Semua Artikel Edukasi ({articlesList.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
