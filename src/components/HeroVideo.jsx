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

  const phone1 = siteSettings?.phone1 || siteSettings?.phone || '06 54 24 05 23';
  const phone2 = siteSettings?.phone2 || '06 63 78 01 07';
  const phone3 = siteSettings?.phone3 || '';
  const cleanPhone1 = phone1.replace(/\D/g, '');
  const cleanPhone2 = phone2.replace(/\D/g, '');
  const cleanPhone3 = phone3.replace(/\D/g, '');

  const workingHours = siteSettings?.working_hours || (
    lang === 'ar' 
      ? 'الإثنين - الجمعة: 08:30 إلى 17:00 | السبت: 09:00 إلى 13:00' 
      : lang === 'fr' 
      ? 'Lun - Ven: 08h30 à 17h00 | Sam: 09h00 à 13h00' 
      : 'Mon - Fri: 8:30 AM to 5:00 PM | Sat: 9:00 AM to 1:00 PM'
  );
  const city = lang === 'ar' ? (siteSettings?.city_ar || 'القنيطرة') : (siteSettings?.city || 'Kénitra');

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

        {/* أزرار الاتصال المباشر وأوقات العمل المحدثة */}
        <div className="mt-4 flex flex-col items-center gap-3 w-full">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* الرقم الأول الرئيسي */}
            <a
              href={`tel:${cleanPhone1}`}
              className="inline-flex items-center gap-2 bg-white text-[#0a4a3a] hover:bg-emerald-50 font-bold px-6 py-2.5 rounded-full shadow-lg transition text-xs sm:text-sm hover:scale-105 border border-emerald-100"
              title={lang === 'ar' ? 'اتصال بالرقم الرئيسي' : 'Appeler numéro principal'}
            >
              <span>📞 {lang === 'ar' ? 'اتصلوا بنا: ' : lang === 'fr' ? 'Contact: ' : 'Call: '}</span>
              <span dir="ltr" className="inline-block font-mono tracking-wider font-extrabold" style={{ unicodeBidi: 'isolate' }}>
                {phone1}
              </span>
            </a>

            {/* الرقم الثاني إذا وُجد */}
            {phone2 && (
              <a
                href={`tel:${cleanPhone2}`}
                className="inline-flex items-center gap-2 bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 font-bold px-6 py-2.5 rounded-full shadow-lg transition text-xs sm:text-sm hover:scale-105 border border-amber-400/40"
                title={lang === 'ar' ? 'اتصال بالرقم الثاني' : 'Appeler 2ème numéro'}
              >
                <span>📱 {lang === 'ar' ? 'هاتف 2: ' : lang === 'fr' ? 'Tél 2: ' : 'Phone 2: '}</span>
                <span dir="ltr" className="inline-block font-mono tracking-wider font-extrabold" style={{ unicodeBidi: 'isolate' }}>
                  {phone2}
                </span>
              </a>
            )}

            {/* الرقم الثالث إذا وُجد */}
            {phone3 && (
              <a
                href={`tel:${cleanPhone3}`}
                className="inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-full shadow-lg transition text-xs sm:text-sm hover:scale-105 border border-slate-700"
                title={lang === 'ar' ? 'اتصال بالرقم الثالث' : 'Appeler 3ème numéro'}
              >
                <span>☎️ {lang === 'ar' ? 'هاتف 3: ' : lang === 'fr' ? 'Tél 3: ' : 'Phone 3: '}</span>
                <span dir="ltr" className="inline-block font-mono tracking-wider font-extrabold" style={{ unicodeBidi: 'isolate' }}>
                  {phone3}
                </span>
              </a>
            )}
          </div>

          {/* أوقات وساعات العمل المحدثة من الإعدادات */}
          <div className="flex items-center gap-2 text-xs text-emerald-100 bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-700/60 shadow-sm max-w-full text-center">
            <span>⏰</span>
            <span>{workingHours}</span>
            <span>•</span>
            <span className="text-amber-300 font-semibold">{city}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
