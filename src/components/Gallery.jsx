import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { 
  Image, ZoomIn, X, ChevronLeft, ChevronRight, Tag,
  Camera, Eye, Bookmark, Sparkles, Award, Heart
} from 'lucide-react';

export const Gallery = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const carouselRef = useRef(null);

  const gallery = (cmsData?.gallery && cmsData.gallery.length > 0) ? cmsData.gallery : (data.gallery || []);

  const categories = [
    { id: 'all', label: t('gallery', 'all') || 'الكل' },
    { id: 'medical', label: t('gallery', 'medical') || 'القوافل الطبية' },
    { id: 'education', label: t('gallery', 'education') || 'التعليم والدراسة' },
    { id: 'social', label: t('gallery', 'social') || 'المساعدات الاجتماعية' },
    { id: 'activities', label: t('gallery', 'activities') || 'أنشطة وترفيه' },
  ];

  const filteredGallery = gallery.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // مضاعفة معرض الصور لضمان حركة مستمرة لا نهائية وسلسة بدون فراغ
  const loopedGallery = filteredGallery.length > 2 ? [...filteredGallery, ...filteredGallery] : filteredGallery;

  const cardWidth = 360;

  // إعادة ضبط التمرير للبداية عند تغيير الفلتر
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      setCurrentIndex(0);
    }
  }, [activeCategory]);

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft } = carouselRef.current;
    const scrollPos = Math.abs(scrollLeft);
    const index = Math.round(scrollPos / cardWidth) % (filteredGallery.length || 1);
    setCurrentIndex(index);
  }, [filteredGallery.length]);

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
    if (!el || filteredGallery.length <= 1) return;

    let reqId;
    let lastTime = performance.now();
    const speed = 0.65; // بكسل في كل إطار - سرعة مريحة وانسيابية

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
  }, [isPaused, filteredGallery.length, dir]);

  return (
    <section 
      id="gallery" 
      className="relative py-20 overflow-hidden bg-gradient-to-b from-[#faf6ee] via-[#f7f2e6] to-[#f4ede0] border-t border-b border-amber-200/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* خلفية بنقوش الزليج المغربي التقليدي (Moroccan Zellij Watermark) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#0d5938_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800 opacity-80" />

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* الترويسة بطابع مغربي أصيل ومؤسساتي */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          
          {/* الشارة الرسمية المغربية */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-900 text-amber-300 text-xs font-bold mb-4 border border-amber-400/50 shadow-md">
            <span className="text-amber-400 text-sm">۞</span>
            <span>
              {lang === 'ar' 
                ? 'المملكة المغربية • معرض التوثيق والمبادرات الميدانية' 
                : lang === 'fr' 
                ? 'Royaume du Maroc • Galerie des Initiatives de Terrain' 
                : 'Kingdom of Morocco • Field Initiatives & Photo Gallery'}
            </span>
            <span className="text-amber-400 text-sm">۞</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            {t('gallery', 'title') || 'معرض الصور والمبادرات الإنسانية'}
          </h2>

          {/* فاصل الزخرفة المغربية التقليدية (Moroccan Architectural Flourish) */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-amber-400 to-amber-600"></div>
            <span className="text-amber-600 font-serif text-sm tracking-widest flex items-center gap-1.5">
              <span>✦</span>
              <span className="text-base text-emerald-900 font-bold">۞</span>
              <span>✦</span>
            </span>
            <div className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent via-amber-400 to-amber-600"></div>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
            {t('gallery', 'subtitle') || 'لحظات إنسانية موثقة من قلب الميدان تعكس أثر العطاء وابتسامة أطفال الجمعية في مختلف الأنشطة والقوافل.'}
          </p>

          {/* أزرار الفلترة بأوسمة مذهبة */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-emerald-950 text-amber-300 shadow-md border border-amber-400/60 scale-105'
                    : 'bg-white/80 text-emerald-950 hover:bg-white border border-amber-200/80 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* شريط التحكم وأزرار التنقل الأفقي بالكاروسيل */}
        <div className="flex items-center justify-between mb-5 px-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-950 bg-white/70 px-3.5 py-1.5 rounded-xl border border-amber-200/70 shadow-sm">
            <Camera className="w-4 h-4 text-amber-600" />
            <span>
              {lang === 'ar' 
                ? `عرض ${filteredGallery.length} صور توثيقية` 
                : lang === 'fr' 
                ? `${filteredGallery.length} Photos` 
                : `${filteredGallery.length} Photos`}
            </span>
            <span className="text-[11px] text-amber-700 font-mono">
              ({currentIndex + 1} / {filteredGallery.length})
            </span>
          </div>

          {/* أزرار الأسهم النحاسية المغربية */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="السابق"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-emerald-900 text-emerald-950 hover:text-amber-300 border-2 border-amber-300/80 hover:border-amber-400 flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 group"
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
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-emerald-900 text-emerald-950 hover:text-amber-300 border-2 border-amber-300/80 hover:border-amber-400 flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 group"
            >
              {dir === 'rtl' ? (
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ) : (
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* الكاروسيل الأفقي لمعرض الصور (Horizontal Carousel Track) */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 px-1 sm:px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {loopedGallery.map((item, index) => {
            const title = getLocalized(item, 'title');

            return (
              <div
                key={`${item.id || index}-${index}`}
                onClick={() => setSelectedPhoto(item)}
                className="w-[280px] sm:w-[320px] md:w-[350px] lg:w-[370px] shrink-0 group relative h-80 sm:h-96 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-slate-950 border-2 border-amber-200/70 hover:border-amber-400/90 hover:-translate-y-1.5"
              >
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* طبقة التدرج اللوني المغربي الفاخر */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/20 opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-between p-6 text-white">
                  
                  {/* الرأس: شارة الفئة والنجمة المغربية */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-300 bg-emerald-950/90 border border-amber-400/50 px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>{categories.find(c => c.id === item.category)?.label || item.category}</span>
                    </span>

                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-amber-300 text-xs">
                      ۞
                    </span>
                  </div>

                  {/* أسفل البطاقة: العنوان وأيقونة التكبير */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-base sm:text-lg font-black text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                      {title}
                    </h3>
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-emerald-200/90 border-t border-white/20 pt-2.5">
                      <span className="font-semibold">{lang === 'ar' ? 'توثيق ميداني معتمد' : lang === 'fr' ? 'Documentation certifiée' : 'Certified documentation'}</span>
                      <span className="inline-flex items-center gap-1 text-amber-300 font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'معاينة' : lang === 'fr' ? 'Aperçu' : 'View'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* مؤشرات التنقل النقطية السفلية */}
        {filteredGallery.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {filteredGallery.map((_, idx) => (
              <button
                key={`gal-dot-${idx}`}
                onClick={() => scrollToIndex(idx)}
                aria-label={`انتقال للصورة ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2.5 bg-gradient-to-r from-emerald-800 to-amber-500 shadow-md border border-amber-300'
                    : 'w-2.5 h-2.5 bg-amber-300/80 hover:bg-amber-400'
                }`}
              />
            ))}
          </div>
        )}

      </div>

      {/* نافذة معاينة الصورة بالكامل (Moroccan Lightbox Modal) */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center">
            
            {/* زر الإغلاق المذهب */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 end-0 p-2 text-amber-300 hover:text-white transition flex items-center gap-1 text-sm font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20"
              aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
              <span>{lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}</span>
            </button>

            {/* الصورة الرئيسية بإطار مغربي */}
            <div className="w-full max-h-[75vh] overflow-hidden rounded-3xl bg-black flex items-center justify-center border-2 border-amber-400/60 shadow-2xl">
              <img
                src={selectedPhoto.image}
                alt={getLocalized(selectedPhoto, 'title')}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* العنوان والوصف */}
            <div className="mt-4 text-center text-white px-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-950 text-amber-300 text-xs font-bold border border-amber-400/40 mb-2">
                <span>۞</span>
                <span>{categories.find(c => c.id === selectedPhoto.category)?.label || selectedPhoto.category}</span>
                <span>۞</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-100">
                {getLocalized(selectedPhoto, 'title')}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
