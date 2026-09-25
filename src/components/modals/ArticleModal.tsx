import React from 'react';
import { Article } from '../../types';
import { ARTICLES_DATA } from '../../data/mockData';
import { X, Share2, ArrowRight } from 'lucide-react';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleKey: string;
  articles?: Article[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  articleKey,
  articles,
}) => {
  if (!isOpen) return null;

  const article: Article = React.useMemo(() => {
    if (articles && articles.length > 0) {
      const found = articles.find((a) => a.id === articleKey);
      if (found) return found;
    }
    return ARTICLES_DATA[articleKey] || ARTICLES_DATA['art_1'] || (articles && articles[0]) || Object.values(ARTICLES_DATA)[0];
  }, [articles, articleKey]);

  const handleShareWa = () => {
    const text = `Baca artikel menarik: *${article.title}* di BinaUsaha!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      id="articleModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
          <span
            id="artModalCategory"
            className="bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs px-3 py-1 rounded-full shadow-xs"
          >
            {article.categoryLabel}
          </span>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <h2 id="artModalTitle" className="font-heading font-bold text-2xl text-slate-900">
            {article.title}
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-200 pb-4">
            <span id="artModalDate">{article.date}</span>
            <span>•</span>
            <span id="artModalReadTime">{article.readTime}</span>
            <span>•</span>
            <span>Oleh: {article.author}</span>
          </div>
          <div
            id="artModalContent"
            className="text-xs md:text-sm text-slate-700 leading-relaxed space-y-3 pt-2"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={handleShareWa}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" /> Bagikan ke WA
          </button>
          <a
            href="#artikel"
            onClick={onClose}
            className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Tutup & Lihat Artikel Lain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
