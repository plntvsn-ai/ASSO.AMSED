import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { defaultCmsData } from '../services/cmsService';
import { 
  HeartPulse, GraduationCap, Sparkles, ArrowLeft, ArrowRight, 
  CheckCircle2, HandHeart, X, Star, Eye, MessageCircle, Phone,
  ChevronRight, ChevronLeft, Bookmark, Award, Clock
} from 'lucide-react';

export const Services = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const carouselRef = useRef(null);

  // استخدام الخدمات من الـ CMS أو الافتراضية
  const servicesList = (cmsData?.services && cmsData.services.length > 0)
    ? cmsData.services
    : (defaultCmsData.services || []);

  const categories = [
    { id: 'all', label: lang === 'ar' ? (t('services', 'tabAll') || 'كافة الخدمات (8)') : lang === 'fr' ? 'Tous les Services (8)' : 'All Services (8)' },
    { id: 'التوحد', label: lang === 'ar' ? 'مركز التوحد' : lang === 'fr' ? 'Pôle Autisme' : 'Autism Center' },
    { id: 'التخاطب', label: lang === 'ar' ? 'التخاطب والنطق' : lang === 'fr' ? 'Orthophonie' : 'Speech Therapy' },
    { id: 'حركية', label: lang === 'ar' ? 'المهارات الحركية' : lang === 'fr' ? 'Psychomotricité' : 'Motor Skills' },
    { id: 'نفسي', label: lang === 'ar' ? 'الإرشاد النفسي' : lang === 'fr' ? 'Guidance Psycho' : 'Psychology' },
    { id: 'تعليم أولي', label: lang === 'ar' ? 'روض الأطفال المكيف' : lang === 'fr' ? 'Maternelle Adaptée' : 'Adapted Preschool' },
    { id: 'دمج', label: lang === 'ar' ? 'التأهيل للدمج المدرسي' : lang === 'fr' ? 'Inclusion Scolaire' : 'School Inclusion' },
    { id: 'دعم مدرسي', label: lang === 'ar' ? 'دروس الدعم AVS' : lang === 'fr' ? 'Soutien & AVS' : 'AVS Support' }
  ];

  const filteredServices = servicesList.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory || item.category?.includes(activeCategory);
  });

  // مضاعفة الخدمات لضمان حركة مستمرة لا نهائية وسلسة بدون فراغ
  const loopedServices = filteredServices.length > 2 ? [...filteredServices, ...filteredServices] : filteredServices;

  const cardWidth = 370; // متوسط عرض البطاقة

  // إعادة ضبط السكرول عند تبديل التصنيف
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
    const index = Math.round(scrollPos / cardWidth) % (filteredServices.length || 1);
    setCurrentIndex(index);
  }, [filteredServices.length]);

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
    if (!el || filteredServices.length <= 1) return;

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
  }, [isPaused, filteredServices.length, dir]);

  const rawPhone = (cmsData?.contact?.phone1 || data?.association?.phone1 || '0654240523').replace(/\D/g, '');
  const intlPhone = rawPhone.startsWith('0') ? '212' + rawPhone.substring(1) : (rawPhone || '212654240523');
  const whatsappUrl = `https://wa.me/${intlPhone}`;

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section 
      id="services" 
      className="relative py-20 overflow-hidden bg-gradient-to-b from-[#faf6ee] via-[#f7f2e6] to-[#f4ede0] border-b border-amber-200/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* خلفية بنقوش الزليج المغربي الأصيل (Moroccan Zellij Watermark) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#0d5938_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800 opacity-80" />

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* الترويسة بطابع مغربي أصيل ومؤسسة تربوية */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          
          {/* الشارة الرسمية المغربية */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-900 text-amber-300 text-xs font-bold mb-4 border border-amber-400/50 shadow-md">
            <span className="text-amber-400 text-sm">۞</span>
            <span>
              {lang === 'ar' 
                ? 'المملكة المغربية • برامج التأهيل والخدمات التربوية المتخصصة' 
                : lang === 'fr' 
                ? 'Royaume du Maroc • Programmes de Rééducation & Services Spécialisés' 
                : 'Kingdom of Morocco • Specialized Rehabilitation & Educational Programs'}
            </span>
            <span className="text-amber-400 text-sm">۞</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            {t('services', 'title') || 'خدمات وبرامج الجمعية المتخصصة'}
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
            {t('services', 'subtitle') || 'نقدم برامج متكاملة ومكيفة تحت إشراف أطر ومختصين مؤهلين بالقنيطرة لرعاية أطفال التوحد والطفولة في وضعية صعبة.'}
          </p>

          {/* لافتة المشروع الفردي (PPI) بإطار مغربي فاخر */}
          <div className="mt-8 max-w-3xl mx-auto bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#0a4a3a] text-white border-2 border-amber-400/60 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0 border border-amber-300">
                <Star className="w-6 h-6 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {lang === 'ar' 
                    ? 'مبدأنا الأساسي: كل طفل يستفيد من برنامج فردي خاص به (PPI)' 
                    : lang === 'fr'
                    ? 'Notre Principe: Chaque enfant bénéficie d\'un projet personnalisé (PPI)'
                    : 'Our Principle: Every child benefits from a personalized educational plan (PPI)'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                  {lang === 'ar'
                    ? 'تتبع علمي وتربوي دقيق يتلاءم مع وتيرة واحتياجات كل طفل لبناء استقلاليته واندماجه في المجتمع.'
                    : lang === 'fr'
                    ? 'Suivi scientifique et pédagogique rigoureux adapté au rythme de chaque enfant pour favoriser son autonomie.'
                    : 'Rigorous educational and clinical monitoring tailored to each child to foster independence and social inclusion.'}
                </p>
              </div>
            </div>
            <span className="shrink-0 bg-amber-400 text-emerald-950 text-xs font-black px-4 py-2 rounded-xl shadow-md border border-amber-300">
              {lang === 'ar' ? 'أطر متخصصة ومتكاملة' : lang === 'fr' ? 'Équipe pluridisciplinaire' : 'Multidisciplinary Team'}
            </span>
          </div>

          {/* تبويبات الفئات بأوسمة مذهبة */}
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
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>
              {lang === 'ar' 
                ? `عرض ${filteredServices.length} خدمات تأهيلية` 
                : lang === 'fr' 
                ? `${filteredServices.length} Services Spécialisés` 
                : `${filteredServices.length} Specialized Services`}
            </span>
            <span className="text-[11px] text-amber-700 font-mono">
              ({currentIndex + 1} / {filteredServices.length})
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

        {/* الكاروسيل الأفقي للخدمات (Horizontal Carousel Track) */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 px-1 sm:px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {loopedServices.map((item, index) => {
            const title = item.name || item.title || getLocalized(item, 'title');
            const desc = item.description || item.desc || getLocalized(item, 'desc');

            return (
              <article
                key={`${item.id || index}-${index}`}
                className="w-[280px] sm:w-[330px] md:w-[360px] lg:w-[380px] shrink-0 group bg-gradient-to-b from-white via-[#fcfbf9] to-[#fbf8f2] rounded-[2rem] overflow-hidden border-2 border-amber-200/70 hover:border-amber-400/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* إطار الصورة المعماري المغربي (Moroccan Arched Poster) */}
                  <div 
                    onClick={() => setSelectedService(item)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border-b-2 border-amber-300/60 cursor-pointer"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-amber-300 font-black text-sm">
                        {title}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                    {/* شارة الفئة والنجمة المغربية */}
                    <div className="absolute top-3 start-3 end-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-950/90 text-amber-300 border border-amber-400/50 shadow-md backdrop-blur-md">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.category || 'تأهيل ورعاية'}</span>
                      </span>

                      <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-amber-300 text-xs">
                        ۞
                      </span>
                    </div>

                    {/* شارة التوفر أسفل الصورة */}
                    <div className="absolute bottom-2.5 start-3 end-3 flex items-center justify-between text-[11px] text-white">
                      <span className="bg-emerald-950/85 px-2.5 py-0.5 rounded-md font-bold border border-emerald-500/40 backdrop-blur-sm text-emerald-200">
                        {lang === 'ar' ? '✓ متاح للتسجيل' : lang === 'fr' ? '✓ Inscriptions ouvertes' : '✓ Open for registration'}
                      </span>
                      <span className="bg-black/60 px-2 py-0.5 rounded-md font-mono text-amber-300 flex items-center gap-1 text-[10px]">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>{lang === 'ar' ? 'برنامج PPI معتمد' : lang === 'fr' ? 'Projet PPI Agréé' : 'Accredited PPI Plan'}</span>
                      </span>
                    </div>
                  </div>

                  {/* جسم بطاقة الخدمة */}
                  <div className="p-5 sm:p-6 pb-2 text-start">
                    <h3 
                      onClick={() => setSelectedService(item)}
                      className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-900 transition leading-snug line-clamp-2 cursor-pointer min-h-[3rem]"
                    >
                      {title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* تذييل البطاقة مع أزرار الإجراء */}
                <div className="p-5 sm:p-6 pt-3 mt-1 border-t border-amber-200/50 flex items-center justify-between bg-amber-50/30 rounded-b-[2rem]">
                  <button
                    onClick={() => setSelectedService(item)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-950 hover:text-amber-700 transition group/btn"
                  >
                    <span className="border-b border-emerald-900 group-hover/btn:border-amber-600 pb-0.5">
                      {lang === 'ar' ? 'تفاصيل البرنامج التأهيلي' : lang === 'fr' ? 'Détails du programme' : 'Program Details'}
                    </span>
                    <ArrowIcon className="w-4 h-4 text-amber-600 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-amber-300 font-extrabold px-3 py-1.5 rounded-xl border border-amber-400/50 shadow-sm transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ar' ? 'استفسار' : lang === 'fr' ? 'Contact' : 'Inquire'}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* مؤشرات التنقل النقطية السفلية */}
        {filteredServices.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {filteredServices.map((_, idx) => (
              <button
                key={`srv-dot-${idx}`}
                onClick={() => scrollToIndex(idx)}
                aria-label={`انتقال للخدمة ${idx + 1}`}
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

      {/* نافذة تفاصيل الخدمة المنبثقة (Moroccan Pedagogical Modal) */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-gradient-to-b from-white via-[#faf8f4] to-[#f6f1e8] rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-amber-300/80 relative text-start">
            
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 end-4 z-20 p-2.5 bg-slate-900/80 hover:bg-slate-900 text-amber-300 rounded-full transition shadow-lg border border-amber-400/40"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedService.image && (
              <div className="relative h-64 w-full overflow-hidden rounded-t-[2.5rem] border-b-2 border-amber-400/60 bg-slate-950">
                <img
                  src={selectedService.image}
                  alt={selectedService.name || selectedService.title || getLocalized(selectedService, 'title')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between text-white text-xs">
                  <span className="bg-emerald-950/90 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-400/40">
                    {selectedService.category || (lang === 'ar' ? 'خدمة تأهيلية' : 'Service Spécialisé')}
                  </span>
                  <span className="font-bold text-emerald-200">
                    {lang === 'ar' ? 'متاح للتسجيل بالقنيطرة' : lang === 'fr' ? 'Disponible à Kénitra' : 'Available in Kenitra'}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedService.name || selectedService.title || getLocalized(selectedService, 'title')}
              </h3>

              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base border-t border-b border-amber-200/60 py-4 bg-white/60 p-4 rounded-2xl">
                {selectedService.description || selectedService.desc || getLocalized(selectedService, 'desc')}
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                  {lang === 'ar'
                    ? 'يشمل هذا البرنامج تقييماً دورياً من طرف أطباء وأخصائيي النطق والترويض الحركي، مع مواكبة مستمرة للأسرة.'
                    : lang === 'fr'
                    ? 'Ce programme comprend des évaluations régulières par des spécialistes et un accompagnement continu des familles.'
                    : 'This program includes regular clinical assessments by specialists and continuous family support.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-amber-300 px-6 py-2.5 rounded-xl text-sm font-black transition shadow-lg border border-amber-400/60"
                >
                  <MessageCircle className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'ar' ? 'حجز موعد أو استفسار عبر واتساب' : lang === 'fr' ? 'Prendre rendez-vous via WhatsApp' : 'Book Appointment via WhatsApp'}</span>
                </a>

                <button
                  onClick={() => setSelectedService(null)}
                  className="bg-amber-100/80 hover:bg-amber-200 text-amber-950 px-5 py-2.5 rounded-xl text-sm font-bold transition border border-amber-300/80"
                >
                  {lang === 'ar' ? 'إغلاق النافذة' : lang === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
