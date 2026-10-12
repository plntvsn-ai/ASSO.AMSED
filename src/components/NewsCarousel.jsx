import React, { useState, useEffect } from 'react';
import { Radio, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FALLBACK_NEWS = [
  {
    id: "fb-1",
    title: "اليوم العالمي للتوحد يجدد المطالبة بتقوية السياسات العمومية في المغرب",
    source: "هسبريس",
    formattedDate: "اليوم",
    link: "https://hespress.com",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fb-2",
    title: "مبادرات رائدة بالقنيطرة لدعم أطفال التوحد وتأهيل النطق والتخاطب",
    source: "وكالة المغرب العربي للأنباء",
    formattedDate: "أمس",
    link: "https://mapnews.ma",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fb-3",
    title: "برامج الدمج المدرسي للأطفال في وضعية صعبة: خطوات عملية لدعم الأسر",
    source: "العمق المغربي",
    formattedDate: "منذ يومين",
    link: "https://al3omk.com",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
  }
];

export default function NewsCarousel() {
  const { getLocalized } = useLanguage();
  const [news, setNews] = useState(FALLBACK_NEWS);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.news || []);
        if (list.length > 0) {
          setNews(list);
        }
      })
      .catch(err => {
        console.warn('NewsCarousel fetch notice:', err);
      });
  }, []);

  const displayNews = news.length > 0 ? news : FALLBACK_NEWS;

  return (
    <aside aria-label="أخبار ومستجدات حية" className="h-full flex flex-col justify-start">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-2.5 text-white/90">
        <span className="text-xs font-bold flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>مستجدات حية</span>
        </span>
        <span className="text-[10px] text-emerald-200/90 bg-white/10 px-2 py-0.5 rounded-full font-mono">
          Google RSS
        </span>
      </div>

      {/* 600px Animated Vertical Scroll */}
      <div className="h-[600px] overflow-hidden relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-2xl">
        {/* Top Gradient Fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0a4a3a] via-[#0a4a3a]/80 to-transparent z-10" />

        <div className="animate-vertical-scroll">
          {[...displayNews, ...displayNews].map((item, idx) => (
            <a
              key={`${item.id || idx}-${idx}`}
              href={item.link || '#announcements'}
              target={item.link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="p-3 m-2 bg-white rounded-xl shadow-lg hover:scale-105 transition block border border-slate-100 group text-slate-800"
            >
              {item.image && (
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2 bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1 start-1 text-[9px] font-bold bg-emerald-800 text-white px-1.5 py-0.5 rounded shadow">
                    {item.source || 'أخبار'}
                  </span>
                </div>
              )}
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                {getLocalized(item, 'title')}
              </h3>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                <span>{item.formattedDate || 'حديثاً'}</span>
                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold group-hover:underline">
                  <span>اقرأ</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Gradient Fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a4a3a] via-[#0a4a3a]/80 to-transparent z-10" />
      </div>
    </aside>
  );
}

export { NewsCarousel };
