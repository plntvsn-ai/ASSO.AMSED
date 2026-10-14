import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { getLocalSiteSettings } from '../services/siteSettingsService';

export default function HeroVideo() {
  const { lang, t } = useLanguage();
  const [siteSettings, setSiteSettings] = useState(() => getLocalSiteSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSiteSettings(getLocalSiteSettings());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cms-update', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cms-update', handleUpdate);
    };
  }, []);

  const phone = siteSettings?.phone1 || siteSettings?.phone || '06 54 24 05 23';
  const cleanPhone = phone.replace(/\D/g, '');

  return (
    <div className="text-white pt-2 pb-6 text-center">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 flex flex-col items-center">
        
        {/* 1. اسم الجمعية في الأعلى */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
          {lang === 'ar' 
            ? (siteSettings?.association_full_display || siteSettings?.association_full_name || 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED')
            : lang === 'fr'
            ? "Association Initiative Marocaine pour la Solidarité et la Coopération (AMSED)"
            : "Moroccan Initiative Association for Solidarity and Cooperation (AMSED)"}
        </h1>

        <h2 className="text-sm sm:text-base font-semibold text-emerald-200 mb-3">
          {lang === 'ar'
            ? (siteSettings?.association_subtitle || 'رعاية وتأهيل أطفال التوحد وفي وضعيات هشة بالقنيطرة')
            : lang === 'fr'
            ? "Prise en charge de l'autisme et enfance en situation difficile à Kénitra"
            : "Care and rehabilitation for autistic and vulnerable children in Kenitra"}
        </h2>

        {/* شارة العنوان */}
        <div className="inline-block bg-white/15 backdrop-blur-sm text-emerald-100 text-xs px-4 py-1.5 rounded-full mb-5 border border-white/20">
          📍 {siteSettings?.address || siteSettings?.address_ar || 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA'}
        </div>

        {/* الشعار الرسمي الشفاف - بدون دائرة بيضاء ولا إطار خارجي كطلب المستخدم */}
        <div className="mb-6 flex justify-center py-2">
          <Logo size={120} />
        </div>

        {/* 2. الفيديو الخاص بتقديم الجمعية */}
        <div className="w-full max-w-3xl mb-6">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-800/80 bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/CSwDq9szfj0?autoplay=0&controls=1&modestbranding=1&rel=0"
              title={lang === 'ar' ? 'فيديو تقديم جمعية AMSED' : 'Vidéo de présentation AMSED'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-200/80 px-2">
            <span>
              {lang === 'ar' 
                ? 'الفيديو التعريفي الرسمي بأنشطة وخدمات الجمعية' 
                : lang === 'fr' 
                ? 'Vidéo officielle de présentation des services' 
                : 'Official presentation video of services'}
            </span>
            <span className="font-mono text-amber-300">AMSED Official Presentation</span>
          </div>
        </div>

        {/* زر اتصال مباشر بلا تبرع */}
        <div className="mt-2 flex flex-col items-center gap-2">
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-2 bg-white text-[#0a4a3a] hover:bg-emerald-50 font-bold px-7 py-3 rounded-full shadow-lg transition text-sm hover:scale-105"
          >
            <span>📞 {lang === 'ar' ? 'اتصلوا بنا - ' : lang === 'fr' ? 'Contactez-nous - ' : 'Call Us - '}</span>
            <span dir="ltr" className="inline-block font-mono tracking-wider" style={{ unicodeBidi: 'isolate' }}>
              {phone}
            </span>
          </a>
          <p className="text-xs text-emerald-200/80">
            {lang === 'ar' 
              ? 'يفتح من الإثنين إلى السبت ابتداءً من 9:00 صباحاً - القنيطرة' 
              : lang === 'fr' 
              ? 'Ouvert du lundi au samedi dès 09h00 - Kénitra' 
              : 'Open Monday to Saturday from 9:00 AM - Kenitra'}
          </p>
        </div>

      </div>
    </div>
  );
}
