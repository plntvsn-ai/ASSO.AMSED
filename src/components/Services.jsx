import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { 
  HeartPulse, GraduationCap, Home, Smile, 
  Sparkles, Scale, ArrowLeft, ArrowRight, CheckCircle2, 
  HelpCircle, HandHeart, X, BookOpen, Compass, 
  Users, FileCheck, Star, Sparkle 
} from 'lucide-react';

const iconMap = {
  HeartPulse: HeartPulse,
  GraduationCap: GraduationCap,
  Home: Home,
  Smile: Smile,
  Sparkles: Sparkles,
  Scale: Scale,
  BookOpen: BookOpen,
  Compass: Compass,
  Users: Users,
  FileCheck: FileCheck,
};

export const Services = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data } = useData();
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const services = data.services || [];
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', label: t('services', 'tabAll') },
    { id: 'education', label: t('services', 'tabEducation') },
    { id: 'skills', label: t('services', 'tabSkills') },
    { id: 'inclusion', label: t('services', 'tabInclusion') },
    { id: 'family', label: t('services', 'tabFamily') },
  ];

  const filteredServices = services.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <HandHeart className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('services', 'badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('services', 'title')}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            {t('services', 'subtitle')}
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

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((item, index) => {
            const IconComponent = iconMap[item.icon] || HeartPulse;
            const title = getLocalized(item, 'title');
            const desc = getLocalized(item, 'desc');

            return (
              <div
                key={item.id || index}
                className="group relative bg-slate-50 hover:bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Icon Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-900/10 group-hover:scale-110 transition duration-300">
                      <IconComponent className="w-7 h-7" />
                    </div>

                    {item.category && (
                      <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        {item.category === 'education' ? (lang === 'ar' ? 'تربية وتعليم' : 'Éducation') :
                         item.category === 'skills' ? (lang === 'ar' ? 'تأهيل ومهارات' : 'Autonomie & Métiers') :
                         item.category === 'inclusion' ? (lang === 'ar' ? 'إدماج مدرسي AVS' : 'Inclusion AVS') :
                         (lang === 'ar' ? 'أسرة ومجتمع' : 'Famille & Loisirs')}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition mb-3 leading-snug">
                    {title}
                  </h3>

                  {/* Highlights pills if available */}
                  {item.highlights && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.highlights.map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{h}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
                  >
                    <span>{t('services', 'viewDetails')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="#contact"
                    className="text-xs bg-slate-200/70 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    {t('services', 'requestService')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout with Kenitra Center Info */}
        <div className="mt-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-start">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full">
              <span>📍 {data.association.addressAr}</span>
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
              href={data.association.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{t('services', 'openInGoogleMaps')}</span>
            </a>
            <a
              href={`tel:${data.association.phone1}`}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl border border-white/20 transition"
              dir="ltr"
            >
              {data.association.phone1}
            </a>
          </div>
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {getLocalized(selectedService, 'title')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {getLocalized(selectedService, 'desc')}
              </p>

              {/* Highlights in modal */}
              {selectedService.highlights && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/70">
                  <span className="text-xs font-bold text-amber-900 block mb-2">
                    {lang === 'ar' ? 'محاور ومهارات هذا البرنامج:' : 'Objectifs et compétences clés :'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.highlights.map((h, i) => (
                      <span key={i} className="text-xs bg-white text-slate-800 border border-amber-200 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs sm:text-sm text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'منهجية العمل بالجمعية:' : 'Notre approche pédagogique :'}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs sm:text-sm">
                  <li>{lang === 'ar' ? 'وضع مشروع بيداغوجي فردي (PPI) بعد تقييم قدرات الطفل' : 'Élaboration du Projet Pédagogique Individualisé (PPI)'}</li>
                  <li>{lang === 'ar' ? 'تأطير من طرف مربيات ومساعدي حياة مدرسية (AVS) مؤهلين' : 'Encadrement par des éducatrices et AVS qualifiés'}</li>
                  <li>{lang === 'ar' ? 'تنسيق دوري ومستمر مع الأسرة والمؤسسات التعليمية الشريكة' : 'Coordination continue avec les parents et les écoles partenaires'}</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <a
                href="#contact"
                onClick={() => setSelectedService(null)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow"
              >
                {t('services', 'requestService')}
              </a>
              <button
                onClick={() => setSelectedService(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition"
              >
                {t('announcements', 'closeModal')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
