import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import { useLanguage } from '../context/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  Calendar, User, Tag, Search, ArrowLeft, 
  FileText, ArrowRight, Sparkles, ExternalLink, Rss 
} from 'lucide-react';

export const ArticlesPage = () => {
  const { cmsData } = useCms();
  const { getLocalized } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rssArticles, setRssArticles] = useState([]);

  // كيجيب الأخبار فابور من RSS
  useEffect(() => {
    // Google News RSS - فابور 100%
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.news || []);
        if (list.length > 0) {
          setRssArticles(list);
        }
      })
      .catch(err => console.warn('RSS news fetch notice:', err));
  }, []);

  const localArticles = (cmsData.articles || []).filter(a => a.published !== false);

  const formattedRssArticles = rssArticles.map(item => ({
    id: item.id,
    title: item.title,
    content: item.summary || item.rawTitle || item.title,
    createdAt: item.formattedDate || item.pubDate,
    author: item.source || 'Google News RSS',
    category: 'أخبار وطنية (RSS)',
    image: item.image,
    link: item.link,
    source: item.source,
    isRss: true
  }));

  const allCombined = [...localArticles, ...formattedRssArticles];

  const categories = [
    "الكل", 
    "أخبار وطنية (RSS)", 
    "التعليم والإدماج", 
    "التأهيل المهني", 
    "أنشطة وترفيه", 
    "قوافل ومبادرات", 
    "أخبار الجمعية"
  ];

  const filtered = allCombined.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (art.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800" dir="rtl">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>مستجدات وبلاغات الجمعية والصحافة الوطنية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              المقالات، البلاغات والأخبار الميدانية
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              تابع كافة الأنشطة، ورشات التأهيل المهني، قسم التعليم الأولي المكيف، وتدخلات الإدماج المدرسي وأخبار التوحد
            </p>
          </div>

          {/* Search and Category Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في عناوين المقالات..."
                className="w-full bg-transparent text-xs sm:text-sm border-0 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === "الكل" ? "all" : cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                    (selectedCategory === 'all' && cat === "الكل") || selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === "أخبار وطنية (RSS)" && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400">
              لا توجد مقالات مطابقة لبحثك في هذا التصنيف.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(art => (
                <article
                  key={art.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={art.image || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 start-3">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold shadow ${
                          art.isRss 
                            ? 'bg-emerald-800 text-white' 
                            : 'bg-slate-900/80 text-white backdrop-blur-md'
                        }`}>
                          {art.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{art.createdAt}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{art.author || 'الجمعية'}</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                        {art.isRss && art.link ? (
                          <a href={art.link} target="_blank" rel="noopener noreferrer">
                            {getLocalized(art, 'title')}
                          </a>
                        ) : (
                          <Link to={`/article/${art.id}`}>
                            {getLocalized(art, 'title')}
                          </Link>
                        )}
                      </h3>

                      <div 
                        className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: (art.content || '').replace(/<[^>]*>?/gm, '') }}
                      />
                    </div>
                  </div>

                  {/* Read More Footer */}
                  <div className="p-6 pt-0">
                    {art.isRss && art.link ? (
                      <a
                        href={art.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-between bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 font-bold px-4 py-2.5 rounded-xl transition text-xs border border-emerald-200"
                      >
                        <span>قراءة في {art.source || 'المصدر'}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        to={`/article/${art.id}`}
                        className="w-full inline-flex items-center justify-between bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-700 font-bold px-4 py-2.5 rounded-xl transition text-xs"
                      >
                        <span>قراءة المقال كاملاً</span>
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
