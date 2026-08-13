import React, { useState } from 'react';
import { NewsPost } from '../../types/database';
import { ArrowLeft, Calendar, User, Share2, Copy, Check, Waves, MessageCircle } from 'lucide-react';

interface NewsDetailPageProps {
  slug: string;
  newsList: NewsPost[];
  onBackToLanding: () => void;
  onNavigateToNews: (slug: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({
  slug,
  newsList,
  onBackToLanding,
  onNavigateToNews,
}) => {
  const [copied, setCopied] = useState(false);

  // Find news article by slug or ID
  const article = newsList.find((n) => n.slug === slug || n.id === slug) || newsList[0];

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-black">Berita Tidak Ditemukan</h2>
        <button
          onClick={onBackToLanding}
          className="mt-4 px-6 py-3 bg-[#236F9E] rounded-xl text-xs font-bold text-white shadow-md hover:bg-[#1C597E]"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${article.title}*\n\n${article.summary}\n\nBaca selengkapnya di: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Other recent news excluding current article
  const otherNews = newsList.filter((n) => n.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#236F9E] selection:text-white">
      
      {/* STICKY HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-extrabold hover:bg-slate-700 transition-all border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-[#236F9E]" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#236F9E] flex items-center justify-center text-white">
              <Waves className="w-5 h-5" />
            </div>
            <span className="text-sm font-black font-display text-white tracking-wide">
              KKN RT 35 MANGGAR 2
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#236F9E] text-white text-xs font-bold shadow-md hover:bg-[#1C597E] transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Disalin!' : 'Bagikan Berita'}</span>
          </button>
        </div>
      </header>

      {/* ARTICLE CONTENT */}
      <main className="flex-grow max-w-4xl mx-auto px-4 py-10 w-full">
        
        {/* CATEGORY & METADATA */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-[#236F9E]/20 border border-[#236F9E]/40 text-[#60A5FA] text-xs font-black uppercase tracking-wider">
            {article.category}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
            <User className="w-4 h-4 text-slate-500" />
            <span>{article.author_name}</span>
          </div>
        </div>

        {/* ARTICLE TITLE */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white leading-tight tracking-tight mb-6">
          {article.title}
        </h1>

        {/* HERO FEATURED IMAGE */}
        {article.image_url && (
          <div className="relative rounded-3xl overflow-hidden mb-8 border border-slate-800 shadow-2xl group">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-80 sm:h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
          </div>
        )}

        {/* SUMMARY HIGHLIGHT BOX */}
        <div className="p-6 rounded-2xl bg-slate-900 border-l-4 border-[#236F9E] text-slate-200 text-sm font-semibold italic mb-8 shadow-md leading-relaxed">
          "{article.summary}"
        </div>

        {/* ARTICLE BODY */}
        <div className="prose prose-invert max-w-none text-slate-300 text-base leading-relaxed space-y-4 font-medium mb-12">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* SHARE BAR */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16 shadow-xl">
          <div>
            <h4 className="text-sm font-extrabold text-white">Bagikan Live Report Ini</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Sebarkan informasi kegiatan KKN RT 35 ke warga & media sosial</p>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs shadow-md border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
            </button>
          </div>
        </div>

        {/* OTHER RECENT NEWS SECTION */}
        {otherNews.length > 0 && (
          <div className="border-t border-slate-800 pt-10">
            <h3 className="text-xl font-display font-black text-white mb-6">
              Kabar Harian KKN Lainnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherNews.map((news) => (
                <div
                  key={news.id}
                  onClick={() => onNavigateToNews(news.slug)}
                  className="cursor-pointer bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-[#236F9E] transition-all group"
                >
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-36 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase text-[#60A5FA] tracking-wider">
                    {news.category}
                  </span>
                  <h4 className="text-xs font-extrabold text-white line-clamp-2 mt-1 group-hover:text-[#60A5FA] transition-colors">
                    {news.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-505 font-medium">
        Hak Cipta © 2026 Tim KKN RT 35 Kelurahan Manggar 2.
      </footer>

    </div>
  );
};
export default NewsDetailPage;
