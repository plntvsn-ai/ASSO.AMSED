import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroVideo from '../components/HeroVideo';
import StatsSection from '../components/StatsSection';
import ServicesCarousel from '../components/ServicesCarousel';
import NewsCarousel from '../components/NewsCarousel';
import AboutSection from '../components/AboutSection';
import { Services } from '../components/Services';
import { Announcements } from '../components/Announcements';
import { Gallery } from '../components/Gallery';
import { VideosSection } from '../components/VideosSection';
import { DonationSection } from '../components/DonationSection';
import { BankAccountSection } from '../components/BankAccountSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { useCms } from '../context/CmsContext';
import { useLanguage } from '../context/LanguageContext';
import { autoGenerateAndPublish } from '../services/autoPublisher';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Phone, MessageCircle } from 'lucide-react';
import { getLocalSiteSettings } from '../services/siteSettingsService';

export default function Home() {
  const { lang, dir } = useLanguage();
  const { cmsData, triggerAutoPublish } = useCms();
  const [settings, setSettings] = useState(() => getLocalSiteSettings());

  useEffect(() => {
    const reload = () => setSettings(getLocalSiteSettings());
    window.addEventListener('storage', reload);
    window.addEventListener('cms-update', reload);

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        const cached = localStorage.getItem('site_settings');
        if (d?.source === 'supabase' || (!cached && d?.data)) {
          if (d?.data) setSettings(d.data);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener('cms-update', reload);
    };
  }, []);

  useEffect(() => {
    const runAutonomousDaily = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastRun = localStorage.getItem('amsed_last_auto_publish');
        
        let needsPublish = (lastRun !== today);
        if (!needsPublish) {
          try {
            const raw = localStorage.getItem('amsed_cms_database_v3');
            if (raw) {
              const cms = JSON.parse(raw);
              const hasTodayArticle = (cms.articles || []).some(a => (a.createdAt || a.created_at || '').startsWith(today));
              if (!hasTodayArticle) needsPublish = true;
            }
          } catch (e) {}
        }

        if (needsPublish) {
          localStorage.setItem('amsed_last_auto_publish', today);
          const { autoGenerateAndPublish } = await import("../services/autoPublisher");
          await autoGenerateAndPublish();
        }
      } catch (e) {
        console.error('Autonomous publish check notice:', e);
      }
    };
    runAutonomousDaily();
    const id = setInterval(runAutonomousDaily, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Sync siteSettings/main in Firestore with official YouTube channel information
  useEffect(() => {
    (async () => {
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        if (db) {
          await setDoc(doc(db, "siteSettings", "main"), {
            youtubeChannelId: "UCBPlqmKVq9KvzXMEmp5dDPQ",
            youtubeHandle: "@association-amesd",
            youtubeUrl: "https://youtube.com/@association-amesd"
          }, { merge: true });
        }
      } catch (e) {}
    })();
  }, []);

  const phoneForCall = settings?.phone1 || settings?.phone || cmsData?.contact?.phone1 || '06 54 24 05 23';
  const rawPhone = phoneForCall.replace(/\D/g, '');
  const intlPhone = rawPhone.startsWith('0') ? '212' + rawPhone.substring(1) : (rawPhone || '212654240523');
  const whatsappUrl = `https://wa.me/${intlPhone}`;

  return (
    <div className="min-h-screen flex flex-col moroccan-zellij-bg text-slate-800 font-sans selection:bg-emerald-600 selection:text-white" dir={dir}>
      {/* 1. Header with pure Logo only (no iframe/video inside) */}
      <Header />

      {/* 2. Hero Area: HeroVideo */}
      <section className="bg-[#0a4a3a] text-white pt-4 pb-8 border-b border-emerald-900">
        <div className="max-w-[1520px] mx-auto px-2 sm:px-4">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <HeroVideo />
          </div>

          {/* 3. شريط مستجدات الأخبار التربوية - كاروسيل أفقي بمظهر أنيق وطابع مغربي أصيل */}
          <div className="mt-8 pt-6 border-t border-emerald-800/80">
            <NewsCarousel />
          </div>
        </div>
      </section>

      {/* 4. About Section */}
      <AboutSection />

      {/* 4.5 Stats Section (الأثر الميداني والأرقام - تظهر أسفل نبذة الجمعية) */}
      {settings.show_stats !== false && <StatsSection />}

      {/* 5. Services Section */}
      <Services />

      {/* 6. Articles & Announcements */}
      <Announcements />

      {/* 7. Videos Section */}
      <VideosSection />

      {/* 8. Gallery */}
      <Gallery />

      {/* 9. Donation Programs Section */}
      {settings.show_donation && <DonationSection />}

      {/* 10. Official Bank Account Section (RIB) */}
      {settings.show_bank && <BankAccountSection />}

      {/* 11. Contact & Maps */}
      <ContactSection />

      {/* 12. Main Footer */}
      <Footer siteSettings={settings} />

      {/* 13. Exact LTR Footer Strip */}
      <footer dir="ltr" style={{ unicodeBidi: 'isolate' }} className="bg-slate-950 text-slate-400 text-xs py-3 text-center border-t border-slate-900 font-mono">
        {settings?.address || settings?.address_ar || 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA'} | {settings?.phone1 || settings?.phone || '06 54 24 05 23'}
      </footer>

      {/* Floating Action Buttons */}
      <aside aria-label={lang === 'ar' ? 'أزرار التواصل السريع' : lang === 'fr' ? 'Boutons de contact rapide' : 'Quick contact buttons'} className="fixed bottom-6 left-6 z-30 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition duration-300 group relative"
          title={lang === 'ar' ? 'تواصل عبر واتساب' : lang === 'fr' ? 'Contacter via WhatsApp' : 'Chat via WhatsApp'}
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute whitespace-nowrap bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow pointer-events-none opacity-0 group-hover:opacity-100 transition duration-200 left-full ml-2">
            {lang === 'ar' ? 'واتساب مباشر' : lang === 'fr' ? 'WhatsApp Direct' : 'Direct WhatsApp'}
          </span>
        </a>

        {/* Quick Call Button */}
        <a
          href={`tel:${phoneForCall}`}
          className="w-13 h-13 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl hover:scale-110 transition duration-300 group relative border-2 border-emerald-500/30"
          title={lang === 'ar' ? `اتصال: ${phoneForCall}` : lang === 'fr' ? `Appeler: ${phoneForCall}` : `Call: ${phoneForCall}`}
        >
          <Phone className="w-6 h-6 text-emerald-400" />
        </a>
      </aside>
    </div>
  );
}

export { Home };
