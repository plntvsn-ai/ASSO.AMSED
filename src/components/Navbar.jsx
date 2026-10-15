import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { 
  Phone, Mail, Globe, Lock, Menu, X, Heart, 
  Sparkles, Check, ChevronDown 
} from 'lucide-react';
import { FacebookIcon, YoutubeIcon } from './SocialIcons';
import Logo from './Logo';

import { getStyleById } from '../data/associationNameStyles';

export const Navbar = ({ onOpenAdmin }) => {
  const { lang, dir, setLanguage, t } = useLanguage();
  const { data } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { cmsData } = useCms();
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) return JSON.parse(cached);
    } catch {}
    return {};
  });

  useEffect(() => {
    const reload = () => {
      try {
        const cached = localStorage.getItem('site_settings');
        if (cached) setSiteSettings(JSON.parse(cached));
      } catch {}
    };
    window.addEventListener('storage', reload);
    window.addEventListener('cms-update', reload);

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
      window.removeEventListener('storage', reload);
      window.removeEventListener('cms-update', reload);
    };
  }, []);

  const association = { ...data.association, ...(cmsData?.contact || {}), ...siteSettings };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cmsHeaderMenus = cmsData?.menus?.headerMenus;
  const defaultNavLinks = [
    { href: '/', label: lang === 'fr' ? 'Accueil' : lang === 'en' ? 'Home' : t('nav', 'home') },
    { href: '/about', label: lang === 'fr' ? 'À Propos' : lang === 'en' ? 'About Us' : 'من نحن' },
    { href: '/#services', label: lang === 'fr' ? 'Nos Services' : lang === 'en' ? 'Our Services' : t('nav', 'services') },
    { href: '/articles', label: lang === 'fr' ? 'Articles & Actualités' : lang === 'en' ? 'Articles & News' : 'المقالات والأخبار' },
    { href: '/#videos', label: lang === 'fr' ? 'Vidéos' : lang === 'en' ? 'Videos' : t('nav', 'videos') },
    { href: '/#gallery', label: lang === 'fr' ? 'Galerie' : lang === 'en' ? 'Gallery' : t('nav', 'gallery') },
    { href: '/#contact', label: lang === 'fr' ? 'Contact' : lang === 'en' ? 'Contact' : t('nav', 'contact') },
  ];

  const rawNavLinks = (cmsHeaderMenus && cmsHeaderMenus.length > 0 && lang === 'ar')
    ? cmsHeaderMenus.map(m => ({ href: m.link, label: m.label }))
    : defaultNavLinks;
  const navLinks = rawNavLinks.filter(l => !l.href?.includes('donate') && !l.label?.includes('تبرع'));

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const activeLangObj = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Bar with Moroccan Motto, Contacts, and Socials */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Royal Motto & Badges */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold tracking-wide text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {t('identity', 'motto')}
            </span>
            <span className="hidden md:inline-block text-slate-400">
              {siteSettings.top_bar_title || (lang === 'ar' ? t('identity', 'officialAssociation') : lang === 'fr' ? "Organisation Nationale d'Intérêt Public" : 'National Public Benefit Organization')}
            </span>
          </div>

          {/* Quick Contact & Socials */}
          <div className="flex items-center gap-4">
            {association.phone1 && (
              <a 
                href={`tel:${association.phone1}`} 
                className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition"
                title="الهاتف الرئيسي"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span dir="ltr">{association.phone1}</span>
              </a>
            )}
            
            {association.phone2 && (
              <a 
                href={`tel:${association.phone2}`} 
                className="hidden sm:inline-flex items-center gap-1.5 hover:text-emerald-400 transition"
                title="الهاتف الثاني"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span dir="ltr">{association.phone2}</span>
              </a>
            )}

            {association.phone3 && (
              <a 
                href={`tel:${association.phone3}`} 
                className="hidden md:inline-flex items-center gap-1.5 hover:text-emerald-400 transition"
                title="الهاتف الثالث"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span dir="ltr">{association.phone3}</span>
              </a>
            )}

            <a 
              href={`mailto:${association.email}`} 
              className="hidden lg:inline-flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{association.email}</span>
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-2 border-r border-l border-slate-700 px-2">
              {association.facebookUrl && (
                <a 
                  href={association.facebookUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-300 hover:text-blue-400 transition p-1"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {association.youtubeUrl && (
                <a 
                  href={association.youtubeUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-300 hover:text-red-400 transition p-1"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5' 
          : 'bg-white shadow-sm py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Standalone Logo & Association Name */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="shrink-0 flex items-center justify-center">
              <Logo size={74} />
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-700 font-bold tracking-wide uppercase">
                {siteSettings.top_bar_title || (lang === 'ar' ? 'مصلحة عمومية وطنية ذات أهداف إنسانية وتضامنية' : lang === 'fr' ? "Organisation Nationale d'Intérêt Public" : 'National Public Benefit Organization')}
              </span>
              <span className={`text-xs sm:text-sm lg:text-base leading-snug group-hover:opacity-90 transition ${getStyleById(siteSettings.association_name_style || 'royal_3d_red_gold').headerClass}`}>
                {lang === 'ar' 
                  ? (siteSettings.association_full_name || association.nameAr) 
                  : lang === 'fr' 
                  ? 'Association Initiative Marocaine pour la Protection des Enfants' 
                  : 'Moroccan Initiative Association for Child Care'}
              </span>
              <span className="text-[11px] sm:text-xs text-amber-800/90 font-bold flex items-center gap-1.5 mt-0.5">
                <span>{association.acronym || 'AMSED'}</span>
                <span>•</span>
                <span>{lang === 'ar' ? (siteSettings.association_subtitle || 'رعاية أطفال التوحد وفي وضعية صعبة • القنيطرة') : lang === 'fr' ? 'Prise en charge de l\'autisme & enfance en difficulté • Kénitra' : 'Autism Care & Children in Need • Kenitra'}</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-emerald-700 font-semibold text-sm transition hover:-translate-y-0.5 relative py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Controls: Language Switcher & Donate CTA */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 transition"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>{activeLangObj.flag} {activeLangObj.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div 
                  className={`absolute top-full mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 ${
                    dir === 'rtl' ? 'left-0' : 'right-0'
                  }`}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-emerald-50 transition ${
                        lang === l.code ? 'text-emerald-700 bg-emerald-50/70 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {lang === l.code && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="p-1.5 text-slate-600 hover:text-emerald-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <span>{activeLangObj.flag}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-700 focus:outline-none"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg">
            {/* Language Selector in Mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-semibold">{t('identity', 'officialAssociation')}</span>
              <div className="flex gap-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1 rounded text-xs font-bold border transition ${
                      lang === l.code 
                        ? 'bg-emerald-700 text-white border-emerald-700' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 text-sm font-semibold transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
