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
import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import { getLocalSiteSettings } from '../services/siteSettingsService';
import { AutismScreeningModal } from '../components/AutismScreeningModal';

export default function Home() {
  const { lang, dir } = useLanguage();
  const { cmsData, triggerAutoPublish } = useCms();
  const [settings, setSettings] = useState(() => getLocalSiteSettings());
  const [screeningOpen, setScreeningOpen] = useState(false);

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
          const { runBossOrchestrator } = await import("../services/bossOrchestrator");
          await runBossOrchestrator({ forcePublish: false });
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

      {/* 5.5 Interactive Autism Screening Banner (المستشار التوجيهي السريع للأولياء) */}
      <section className="py-8 px-4 max-w-6xl mx-auto w-full" dir={dir}>
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-3 text-center md:text-right relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'خدمة تفاعلية استرشادية مجانية للأسر' : lang === 'fr' ? 'Évaluation d\'orientation gratuite' : 'Free Guidance Screening Tool'}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {lang === 'ar' ? 'هل تلاحظ علامات تثير انتباهك في سلوك أو تواصل طفلك؟' : lang === 'fr' ? 'Remarquez-vous des signes inhabituels chez votre enfant ?' : 'Noticing developmental differences in your child?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'ar' 
                ? 'اجتز استبيان المؤشرات النمائية المبكرة المكون من 5 أسئلة استرشادية، واكتشف توجيهات أخصائيي جمعية AMSED القنيطرة في أقل من دقيقتين.'
                : lang === 'fr'
                ? 'Passez notre test d\'orientation précoce en 5 questions simples et obtenez les recommandations de nos spécialistes.'
                : 'Take our 5-question early signs questionnaire and receive immediate guidance from AMSED Kenitra professionals.'}
            </p>
          </div>

          <button
            onClick={() => setScreeningOpen(true)}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition cursor-pointer text-sm sm:text-base shrink-0 flex items-center gap-2 group relative z-10"
          >
            <span>{lang === 'ar' ? 'بدء الاستبيان التوجيهي (5 أسئلة)' : lang === 'fr' ? 'Commencer le questionnaire' : 'Start Screening (5 Questions)'}</span>
            <span className="group-hover:translate-x-1 transition">←</span>
          </button>
        </div>
      </section>

      {/* Autism Screening Modal */}
      <AutismScreeningModal isOpen={screeningOpen} onClose={() => setScreeningOpen(false)} />

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
