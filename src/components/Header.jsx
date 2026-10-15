import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { Globe, Menu, X } from 'lucide-react';
import { getLocalSiteSettings } from '../services/siteSettingsService';
import { getStyleById } from '../data/associationNameStyles';

export default function Header() {
  const { lang, setLanguage, dir, t } = useLanguage();
  const { cmsData } = useCms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(() => getLocalSiteSettings());

  useEffect(() => {
    const reloadSettings = () => {
      setSiteSettings(getLocalSiteSettings());
    };

    window.addEventListener('storage', reloadSettings);
    window.addEventListener('cms-update', reloadSettings);

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        const cached = localStorage.getItem('site_settings');
        if (data?.source === 'supabase' || (!cached && data?.data)) {
          if (data?.data) {
            setSiteSettings(data.data);
            try { localStorage.setItem('site_settings', JSON.stringify(data.data)); } catch {}
          }
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('storage', reloadSettings);
      window.removeEventListener('cms-update', reloadSettings);
    };
  }, []);

  const cmsHeaderMenus = cmsData?.menus?.headerMenus;
  const defaultNavLinks = [
    { href: '/', label: lang === 'fr' ? 'Accueil' : lang === 'en' ? 'Home' : 'الرئيسية' },
    { href: '/about', label: lang === 'fr' ? 'À Propos' : lang === 'en' ? 'About Us' : 'من نحن' },
    { href: '/#services', label: lang === 'fr' ? 'Nos Services' : lang === 'en' ? 'Our Services' : 'خدماتنا' },
    { href: '/articles', label: lang === 'fr' ? 'Articles & Actualités' : lang === 'en' ? 'Articles & News' : 'المقالات والأخبار' },
    { href: '/#videos', label: lang === 'fr' ? 'Vidéos de Terrain' : lang === 'en' ? 'Field Videos' : 'فيديوهات الميدان' },
    { href: '/#gallery', label: lang === 'fr' ? 'Galerie Photos' : lang === 'en' ? 'Photo Gallery' : 'معرض الصور' },
    { href: '/#contact', label: lang === 'fr' ? 'Contactez-nous' : lang === 'en' ? 'Contact Us' : 'اتصل بنا' },
  ];

  const rawNavLinks = (cmsHeaderMenus && cmsHeaderMenus.length > 0 && lang === 'ar')
    ? cmsHeaderMenus.map(m => ({ href: m.link, label: m.label }))
    : defaultNavLinks;

  // Completely filter out any donate links as requested
  const navLinks = rawNavLinks.filter(l => !l.href?.includes('donate') && !l.label?.includes('تبرع'));

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2.5">
        
        {/* Brand: Standalone Clean Logo & Association Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="shrink-0 flex items-center justify-center">
            <Logo size={74} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-700 font-bold tracking-wide uppercase">
              {siteSettings.top_bar_title || (lang === 'ar' ? 'مصلحة عمومية وطنية ذات أهداف إنسانية وتضامنية' : lang === 'fr' ? "Organisation Nationale d'Intérêt Public" : 'National Public Benefit Organization')}
            </span>
            <span className={`text-xs sm:text-sm lg:text-base leading-tight group-hover:opacity-90 transition ${getStyleById(siteSettings.association_name_style || 'royal_3d_red_gold').headerClass}`}>
              {lang === 'ar' 
                ? (siteSettings.association_full_name || 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة')
                : lang === 'fr'
                ? 'Association Initiative Marocaine pour la Protection des Enfants'
                : 'Moroccan Initiative Association for Child Care'}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-800/90 font-bold flex items-center gap-1.5 mt-0.5">
              <span>{lang === 'ar' ? (siteSettings.association_subtitle || 'لرعاية أطفال التوحد وفي وضعية صعبة • القنيطرة') : lang === 'fr' ? 'Prise en charge de l\'autisme & enfance en difficulté • Kénitra' : 'Autism Care & Children in Need • Kenitra'}</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-700 hover:text-emerald-700 font-semibold text-xs sm:text-sm transition hover:-translate-y-0.5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls: Languages Only (No Donate button, No Admin/Lock icon) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  lang === l.code ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-emerald-700 focus:outline-none"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown (Completely free of any donate button or admin/lock icon) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-semibold">اللغة</span>
            <div className="flex gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-bold border ${
                    lang === l.code ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 text-xs sm:text-sm font-semibold transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
export { Header };
