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
import { autoGenerateAndPublish } from '../services/autoPublisher';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Phone, MessageCircle } from 'lucide-react';

export default function Home() {
  const { cmsData, triggerAutoPublish } = useCms();
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) return JSON.parse(cached);
    } catch {}
    return {
      show_donation: false,
      show_bank: false,
      address_ar: '',
      phone: ''
    };
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  useEffect(()=>{
    const run=async()=>{
      try{
        const {doc,getDoc}=await import("firebase/firestore");
        const {db}=await import("../firebase");
        const s=await getDoc(doc(db,"autoSettings","main"));
        if(!s.exists() ||!s.data().enabled) return;
        const last=s.data().lastRun?.toDate();
        const now=new Date();
        if(!last || (now-last)/3600000 >= 24){
          const {autoGenerateAndPublish}=await import("../services/autoPublisher");
          await autoGenerateAndPublish();
        }
      }catch(e){console.error(e)}
    };
    run();
    const id=setInterval(run,60*60*1000);
    return ()=>clearInterval(id);
  },[]);

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

  const phoneForCall = settings?.phone || cmsData?.contact?.phone1 || '06 23 05 24 54 06';
  const rawPhone = phoneForCall.replace(/\D/g, '');
  const intlPhone = rawPhone.startsWith('0') ? '212' + rawPhone.substring(1) : (rawPhone || '212623052454');
  const whatsappUrl = `https://wa.me/${intlPhone}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white" dir="rtl">
      {/* 1. Header with pure Logo only (no iframe/video inside) */}
      <Header />

      {/* 2. 12-Column Hero Area: ServicesCarousel (2) | HeroVideo + Stats (8) | NewsCarousel (2) */}
      <section className="bg-[#0a4a3a] text-white pt-3 pb-10 border-b border-emerald-900">
        <div className="max-w-[1520px] mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-12 gap-3 lg:gap-4 items-start">
            <div className="hidden lg:block lg:col-span-2">
              <ServicesCarousel />
            </div>
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
              <HeroVideo />
              <StatsSection />
            </div>
            <div className="hidden lg:block lg:col-span-2">
              <NewsCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 4. About Section */}
      <AboutSection />

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
        {settings.address_ar} | {settings.phone}
      </footer>

      {/* Floating Action Buttons */}
      <aside aria-label="أزرار التواصل السريع" className="fixed bottom-6 left-6 z-30 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition duration-300 group relative"
          title="تواصل عبر واتساب"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute whitespace-nowrap bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow pointer-events-none opacity-0 group-hover:opacity-100 transition duration-200 left-full ml-2">
            واتساب مباشر
          </span>
        </a>

        {/* Quick Call Button */}
        <a
          href={`tel:${phoneForCall}`}
          className="w-13 h-13 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl hover:scale-110 transition duration-300 group relative border-2 border-emerald-500/30"
          title={`اتصال: ${phoneForCall}`}
        >
          <Phone className="w-6 h-6 text-emerald-400" />
        </a>
      </aside>
    </div>
  );
}

export { Home };
