import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import { useLanguage } from '../context/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Sparkles, Heart, ShieldCheck, Award, ArrowLeft, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  const { cmsData } = useCms();
  const { lang, dir, t, getLocalized } = useLanguage();
  const aboutData = cmsData?.pages?.about || { title: "من نحن", sections: [] };
  const visibleSections = (aboutData.sections || []).filter(s => s.visible !== false);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col moroccan-zellij-bg font-sans text-slate-800" dir={dir}>
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{cmsData.logo?.motto || t('identity', 'motto')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {lang === 'ar' 
                ? (aboutData.title || "من نحن - جمعية المبادرة المغربية")
                : lang === 'fr' 
                ? "À Propos de l'Association AMSED" 
                : "About AMSED Association"}
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              {lang === 'ar' 
                ? (aboutData.subtitle || "رسالتنا ورؤيتنا في رعاية وتأهيل الأطفال في وضعية صعبة بالقنيطرة")
                : lang === 'fr' 
                ? "Notre mission et notre vision pour la protection et l'épanouissement des enfants à Kénitra" 
                : "Our mission and vision for the care and rehabilitation of vulnerable children in Kenitra"}
            </p>
          </div>

          {/* Sections List */}
          <div className="space-y-12">
            {visibleSections.map((sec, index) => {
              const isEven = index % 2 === 0;
              const title = getLocalized(sec, 'title') || sec.title;
              const text = getLocalized(sec, 'text') || sec.text;
              const btnText = getLocalized(sec, 'buttonText') || (
                lang === 'ar' 
                  ? (sec.buttonText || "استكشف خدماتنا") 
                  : lang === 'fr' 
                  ? "Découvrir nos services" 
                  : "Explore our services"
              );

              return (
                <div
                  key={sec.id || index}
                  className={`bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 lg:gap-12 ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 space-y-4 text-start">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                      {title}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {text}
                    </p>

                    {sec.buttonText && (
                      <div className="pt-2">
                        <a
                          href={sec.buttonLink || "/#services"}
                          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow transition text-xs sm:text-sm"
                        >
                          <span>{btnText}</span>
                          <ArrowIcon className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {sec.image && (
                    <div className="w-full md:w-5/12 rounded-2xl overflow-hidden shadow-lg border border-slate-100 shrink-0">
                      <img
                        src={sec.image}
                        alt={title}
                        className="w-full h-72 sm:h-80 object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
