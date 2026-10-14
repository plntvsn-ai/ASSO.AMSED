import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, ExternalLink, ChevronRight, ChevronLeft, 
  GraduationCap, Clock, BookOpen, Sparkles, ArrowLeft, ArrowRight,
  Bookmark, Award, Bell
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';

const FALLBACK_NEWS = [
  {
    id: "fb-1",
    title: "اليوم العالمي للتوحد يجدد المطالبة بتقوية السياسات العمومية في المغرب",
    source: "هسبريس",
    formattedDate: "اليوم",
    link: "https://hespress.com",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    pedagogyTag: "سياسات الدمج والتوحد",
    readTime: "3 دقائق"
  },
  {
    id: "fb-2",
    title: "مبادرات رائدة بالقنيطرة لدعم أطفال التوحد وتأهيل النطق والتخاطب",
    source: "وكالة المغرب العربي للأنباء",
    formattedDate: "أمس",
    link: "https://mapnews.ma",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    pedagogyTag: "تأهيل نطق وتخاطب",
    readTime: "دقيقتان"
  },
  {
    id: "fb-3",
    title: "برامج الدمج المدرسي للأطفال في وضعية صعبة: خطوات عملية لدعم الأسر",
    source: "العمق المغربي",
    formattedDate: "منذ يومين",
    link: "https://al3omk.com",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    pedagogyTag: "دليل الأسرة والدمج",
    readTime: "3 دقائق"
  }
];

export default function NewsCarousel() {
  const { lang, dir, getLocalized } = useLanguage();
  const { cmsData } = useCms();
  const [rssNews, setRssNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetch('/api/news')
      .then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return null;
        return res.json();
      })
      .then(data => {
        if (!data) return;
        const list = Array.isArray(data) ? data : (data?.news || []);
        if (list.length > 0) {
          setRssNews(list);
        }
      })
      .catch(err => {
        console.warn('NewsCarousel fetch notice:', err);
      });
  }, []);

  // دمج مقالات الجمعية التربوية والمستجدات الحية من RSS (بدون ذكر كلمة روبوت)
  const educationalArticles = (cmsData?.articles || []).slice(0, 5).map(item => ({
    id: item.id,
    title: (item.title || '').replace(/الدار البيضاء/g, 'القنيطرة'),
    titleAr: (item.title || '').replace(/الدار البيضاء/g, 'القنيطرة'),
    source: item.author && !item.author.includes('روبوت') ? item.author : 'أطر جمعية AMSED',
    formattedDate: item.createdAt || '2026-10-13',
    link: `/article/${item.id}`,
    isInternal: true,
    image: (item.image && !item.image.includes('542601906990-b4d3fb778b09') && !item.image.includes('picsum.photos'))
      ? item.image 
      : "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    pedagogyTag: "دراسات وبحوث التوحد",
    readTime: "3 دقائق قراءة"
  }));

  const formattedRss = (rssNews.length > 0 ? rssNews : FALLBACK_NEWS).map(item => ({
    id: item.id,
    title: (item.title || '').replace(/الدار البيضاء/g, 'القنيطرة'),
    titleAr: (item.title || '').replace(/الدار البيضاء/g, 'القنيطرة'),
    source: item.source || 'رصد إعلامي',
    formattedDate: item.formattedDate || 'حديثاً',
    link: item.link,
    isInternal: false,
    image: item.image || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    pedagogyTag: item.pedagogyTag || "رصد إخباري وطني",
    readTime: item.readTime || "دقيقتان"
  }));

  const baseNews = [...educationalArticles, ...formattedRss];
  const displayNews = baseNews.length > 0 ? baseNews : FALLBACK_NEWS;
  // مضاعفة العناصر لضمان حركة مستمرة لا نهائية وسلسة
  const loopedNews = [...displayNews, ...displayNews];

  const cardWidth = 360;

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft } = carouselRef.current;
    const scrollPos = Math.abs(scrollLeft);
    const index = Math.round(scrollPos / cardWidth) % displayNews.length;
    setCurrentIndex(index);
  }, [displayNews.length]);

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    const delta = dir === 'rtl' ? cardWidth : -cardWidth;
    carouselRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    const delta = dir === 'rtl' ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToIndex = (idx) => {
    if (!carouselRef.current) return;
    const target = dir === 'rtl' ? -(idx * cardWidth) : (idx * cardWidth);
    carouselRef.current.scrollTo({ left: target, behavior: 'smooth' });
    setCurrentIndex(idx);
  };

  // حركة تلقائية حية ومستمرة تبدأ فور تحميل الصفحة وتتوقف عند التحويم
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || displayNews.length <= 1) return;

    let reqId;
    let lastTime = performance.now();
    const speed = 0.65; // بكسل في كل إطار - سرعة مريحة وقابلة للقراءة

    const step = (time) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      if (!isPaused && el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 10) {
          const currentAbs = Math.abs(el.scrollLeft);

          if (currentAbs >= maxScroll - 5) {
            el.scrollLeft = 0;
          } else {
            if (dir === 'rtl') {
              if (el.scrollLeft <= 0) {
                el.scrollLeft -= speed * (dt / 16);
              } else {
                el.scrollLeft += speed * (dt / 16);
              }
            } else {
              el.scrollLeft += speed * (dt / 16);
            }
          }
        }
      }
      reqId = requestAnimationFrame(step);
    };

    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [isPaused, displayNews.length, dir]);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section 
      aria-label="كاروسيل مستجدات الأخبار التربوية"
      className="w-full relative py-6 px-3 sm:px-6 rounded-3xl bg-gradient-to-b from-[#0a4536]/95 via-[#083b2e]/95 to-[#062c22]/95 border-2 border-amber-400/40 shadow-2xl backdrop-blur-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
    >
      {/* خلفية بزخرفة مغربية ناعمة (Zellij Pattern Watermark) */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#c29b38_1.5px,transparent_1.5px)] [background-size:16px_16px] rounded-3xl" />

      {/* شريط العنوان التوجيهي بطابع مغربي وتربوي */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-5 pb-3 border-b border-amber-400/30">
        
        {/* الشارة والعنوان */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-900 border border-amber-400/60 text-amber-300 shadow-md">
            <span className="text-base font-serif">۞</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>مستجدات الأخبار التربوية والتأهيلية بالقنيطرة</span>
                <span className="text-amber-400 font-serif text-sm">✦ ۞ ✦</span>
              </h2>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
              رصد حي لبحوث التوحد، برامج الإدماج المدرسي، وأنشطة الجمعية بالقنيطرة والمغرب
            </p>
          </div>
        </div>

        {/* أزرار التنقل والعداد */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-block text-xs font-mono font-bold bg-white/10 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
            {currentIndex + 1} / {displayNews.length}
          </span>

          <button
            onClick={scrollPrev}
            aria-label="السابق"
            className="w-9 h-9 rounded-full bg-emerald-950/80 hover:bg-amber-500 text-amber-300 hover:text-emerald-950 border border-amber-400/60 flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 group"
          >
            {dir === 'rtl' ? (
              <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>

          <button
            onClick={scrollNext}
            aria-label="التالي"
            className="w-9 h-9 rounded-full bg-emerald-950/80 hover:bg-amber-500 text-amber-300 hover:text-emerald-950 border border-amber-400/60 flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 group"
          >
            {dir === 'rtl' ? (
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* مسار الكاروسيل الأفقي المتحرك تلقائياً */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-10"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {loopedNews.map((item, idx) => {
          const title = getLocalized(item, 'title');
          const isInternal = item.isInternal;

          const CardWrapper = ({ children }) => isInternal ? (
            <Link
              to={item.link}
              className="w-[270px] sm:w-[320px] md:w-[350px] shrink-0 block group bg-gradient-to-b from-[#fdfbf7] via-white to-[#fbf8f0] rounded-2xl overflow-hidden border-2 border-amber-300/60 hover:border-amber-400 shadow-lg hover:shadow-2xl transition-all duration-300 text-slate-800 hover:-translate-y-1"
            >
              {children}
            </Link>
          ) : (
            <a
              href={item.link || '#announcements'}
              target={item.link?.startsWith('http') ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-[270px] sm:w-[320px] md:w-[350px] shrink-0 block group bg-gradient-to-b from-[#fdfbf7] via-white to-[#fbf8f0] rounded-2xl overflow-hidden border-2 border-amber-300/60 hover:border-amber-400 shadow-lg hover:shadow-2xl transition-all duration-300 text-slate-800 hover:-translate-y-1"
            >
              {children}
            </a>
          );

          return (
            <CardWrapper key={`${item.id}-${idx}`}>
              {/* صورة البطاقة بإطار القوس المغربي */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 border-b border-amber-300/40">
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                {/* الشارة التربوية العليا */}
                <div className="absolute top-2.5 start-2.5 end-2.5 flex items-center justify-between">
                  <span className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md flex items-center gap-1 ${
                    isInternal 
                      ? 'bg-emerald-950/90 text-amber-300 border-amber-400/50' 
                      : 'bg-slate-950/80 text-cyan-200 border-cyan-400/40'
                  }`}>
                    {isInternal ? <GraduationCap className="w-3 h-3 text-amber-400" /> : <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />}
                    <span>{item.pedagogyTag}</span>
                  </span>

                  <span className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-amber-300 text-[10px]">
                    ۞
                  </span>
                </div>

                {/* توقيت القراءة */}
                <div className="absolute bottom-2 start-2.5 end-2.5 flex items-center justify-between text-[10px] text-white/90">
                  <span className="bg-emerald-900/80 px-2 py-0.5 rounded font-bold border border-emerald-400/30">
                    {item.source}
                  </span>
                  <span className="bg-black/60 px-2 py-0.5 rounded font-mono text-amber-200 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                    <span>{item.readTime}</span>
                  </span>
                </div>
              </div>

              {/* محتوى وتفاصيل الخبر التربوي */}
              <div className="p-4 flex flex-col justify-between min-h-[140px]">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
                    <span>{item.formattedDate}</span>
                    <span className="text-emerald-800 font-bold">مؤسسة AMSED</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-emerald-900 transition leading-snug line-clamp-2">
                    {title}
                  </h3>
                </div>

                {/* تذييل البطاقة مع زر القراءة */}
                <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-emerald-900 group-hover:text-amber-700">
                  <span className="border-b border-emerald-900/40 group-hover:border-amber-600 pb-0.5">
                    {isInternal ? 'قراءة المقال التربوي' : 'متابعة تفاصيل الخبر'}
                  </span>
                  {isInternal ? (
                    <ArrowIcon className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>
              </div>
            </CardWrapper>
          );
        })}
      </div>

      {/* مؤشرات التنقل النقطية السفلية */}
      {displayNews.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-1">
          {displayNews.map((_, idx) => (
            <button
              key={`news-dot-${idx}`}
              onClick={() => scrollToIndex(idx)}
              aria-label={`انتقال للخبر ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-white/60 shadow-sm'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export { NewsCarousel };
