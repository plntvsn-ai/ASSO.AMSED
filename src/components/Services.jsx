import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { defaultCmsData } from '../services/cmsService';
import { 
  HeartPulse, GraduationCap, Home, Smile, 
  Sparkles, Scale, ArrowLeft, ArrowRight, CheckCircle2, 
  HandHeart, X, Compass, Star, Eye, MessageCircle, Phone,
  LayoutGrid, ScrollText
} from 'lucide-react';

const iconMap = {
  HeartPulse,
  GraduationCap,
  Home,
  Smile,
  Sparkles,
  Scale
};

export const Services = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'scroll'

  // Use services from CMS (or fallback to default 8 published services)
  const servicesList = (cmsData?.services && cmsData.services.length > 0)
    ? cmsData.services
    : (defaultCmsData.services || []);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', label: t('services', 'tabAll') || 'كافة الخدمات' },
    { id: 'التوحد', label: 'مركز التوحد' },
    { id: 'التخاطب', label: 'التخاطب والنطق' },
    { id: 'حركية', label: 'المهارات الحركية' },
    { id: 'نفسي', label: 'الإرشاد النفسي' },
    { id: 'تعليم أولي', label: 'روض الأطفال' },
    { id: 'دمج', label: 'التأهيل للدمج' },
    { id: 'دعم مدرسي', label: 'دروس الدعم' }
  ];

  const filteredServices = servicesList.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory || item.category?.includes(activeCategory);
  });

  const rawPhone = (cmsData?.contact?.phone1 || data?.association?.phone1 || '0663780107').replace(/\D/g, '');
  const intlPhone = rawPhone.startsWith('0') ? '212' + rawPhone.substring(1) : rawPhone;
  const whatsappUrl = `https://wa.me/${intlPhone}`;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <HandHeart className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('services', 'badge') || 'خدمات التأهيل والرعاية'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('services', 'title') || 'خدمات وبرامج الجمعية المتخصصة'}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            {t('services', 'subtitle') || 'نقدم برامج متكاملة ومكيفة تحت إشراف أطر ومختصين مؤهلين بالقنيطرة'}
          </p>
        </div>

        {/* Highlight Banner: Individual Program for Each Child (PPI) */}
        <div className="mb-12 max-w-4xl mx-auto bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Star className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'ar' ? 'مبدأنا الأساسي: كل طفل عندو برنامج فردي خاص بيه (PPI)' : lang === 'fr' ? 'Notre Principe : Chaque enfant a son projet personnalisé (PPI)' : 'Our Core Principle: An Individualized Plan (IEP) for Each Child'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {lang === 'ar' 
                  ? 'تتبع علمي ودقيق يتلاءم مع وتيرة واحتياجات كل طفل لبناء استقلاليته واندماجه في المجتمع.' 
                  : 'Un accompagnement sur-mesure pour développer l\'autonomie et la réussite de chaque enfant.'}
              </p>
            </div>
          </div>
          <span className="shrink-0 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
            {lang === 'ar' ? 'تتبع متعدد التخصصات' : 'Équipe Pluridisciplinaire'}
          </span>
        </div>

        {/* Category Filter Tabs & View Mode */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white ring-2 ring-slate-900 shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'شبكة الملصقات' : 'Grille'}</span>
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'scroll'
                  ? 'bg-emerald-700 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تمرير رأسي مستمر' : 'Défilement'}</span>
            </button>
          </div>
        </div>

        {viewMode === 'scroll' ? (
          /* Animated Vertical Scroll Carousel (User Request) */
          <div className="h-[600px] max-w-2xl mx-auto overflow-hidden relative rounded-2xl bg-white/5 backdrop-blur border border-slate-200/80 shadow-lg p-2">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10" />

            <div className="animate-vertical-scroll">
              {[...filteredServices, ...filteredServices].map((s, idx) => {
                const title = s.name || s.title || getLocalized(s, 'title');
                const desc = s.description || s.desc || getLocalized(s, 'desc');

                return (
                  <div
                    key={`${s.id || idx}-${idx}`}
                    onClick={() => setSelectedService(s)}
                    className="p-4 m-2 bg-white rounded-xl shadow-lg hover:scale-105 transition cursor-pointer border border-slate-100 flex items-center gap-4"
                  >
                    {s.image && (
                      <img
                        src={s.image}
                        alt={title}
                        className="w-16 h-20 rounded-xl object-cover shadow-sm shrink-0 border border-slate-100"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                          {s.category}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ متاح للتسجيل
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 truncate text-base hover:text-emerald-700 transition">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
          </div>
        ) : (
          /* 8 Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((item, index) => {
            const title = item.name || getLocalized(item, 'title');
            const desc = item.description || getLocalized(item, 'desc');

            return (
              <div
                key={item.id || index}
                className="group relative bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Poster Image */}
                  <div 
                    onClick={() => setSelectedService(item)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-200/80 cursor-pointer shadow-sm group-hover:shadow-md transition"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-emerald-400 font-bold text-sm">
                        {title}
                      </div>
                    )}
                    {/* Category Overlay Tag */}
                    <div className="absolute top-3 end-3">
                      <span className="text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-full shadow">
                        {item.category}
                      </span>
                    </div>
                    {/* Hover Eye Pill */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 bg-white text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg">
                        <Eye className="w-4 h-4 text-emerald-700" />
                        <span>تكبير الملصق</span>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition mb-2 leading-snug line-clamp-2">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                    {desc}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedService(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
                  >
                    <span>تفاصيل</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-emerald-600" />
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>تواصل معنا</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

        {/* Bottom Callout with Kenitra Center Info */}
        <div className="mt-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-start">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full">
              <span>📍 {data?.association?.addressAr || 'حي الساكنية، تجزئة الحزام رقم د 25، القنيطرة'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {lang === 'ar' ? 'أبواب الجمعية مفتوحة لاستقبالكم وتسجيل أبنائكم' : lang === 'fr' ? 'Nos portes sont ouvertes pour accueillir et inscrire vos enfants' : 'Our center is open to welcome and register your children'}
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl">
              {lang === 'ar' ? 'فريقنا التربوي والطبي بالقنيطرة يرافقكم خطوة بخطوة لوضع البرنامج الفردي المناسب لطفلكم.' : lang === 'fr' ? 'Notre équipe à Kénitra vous accompagne pour définir le projet adapté à votre enfant.' : 'Our team in Kenitra guides you step-by-step to design the individualized plan for your child.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={data?.association?.mapUrl || 'https://maps.google.com/?q=Kenitra,Morocco'}
              target="_blank"
              rel="noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{t('services', 'openInGoogleMaps') || 'موقعنا على الخريطة'}</span>
            </a>
            <a
              href={`tel:${cmsData?.contact?.phone1 || data?.association?.phone1 || '0663780107'}`}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl border border-white/20 transition"
              dir="ltr"
            >
              {cmsData?.contact?.phone1 || data?.association?.phone1 || '0663780107'}
            </a>
          </div>
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
                  {selectedService.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {selectedService.name || getLocalized(selectedService, 'title')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-5">
              {/* Poster Preview in Modal */}
              {selectedService.image && (
                <div className="w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950">
                  <img
                    src={selectedService.image}
                    alt={selectedService.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {selectedService.description || getLocalized(selectedService, 'desc')}
              </p>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs sm:text-sm text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>منهجية العمل بالجمعية (AMSED):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs sm:text-sm">
                  <li>وضع مشروع بيداغوجي فردي (PPI) بعد تقييم قدرات الطفل واحتياجاته الخاصة</li>
                  <li>تأطير من طرف مربيات ومساعدي حياة مدرسية (AVS) وأخصائيين مؤهلين</li>
                  <li>تنسيق دوري ومستمر مع الأسرة والمؤسسات التعليمية الشريكة بالقنيطرة</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب تسجيل أو استشارة عبر واتساب</span>
              </a>
              <button
                onClick={() => setSelectedService(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Services;
