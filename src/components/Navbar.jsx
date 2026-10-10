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

export const Navbar = ({ onOpenAdmin }) => {
  const { lang, dir, setLanguage, t } = useLanguage();
  const { data } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { cmsData } = useCms();
  const association = cmsData.contact || data.association;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cmsHeaderMenus = cmsData?.menus?.headerMenus;
  const rawNavLinks = (cmsHeaderMenus && cmsHeaderMenus.length > 0)
    ? cmsHeaderMenus.map(m => ({ href: m.link, label: m.label }))
    : [
        { href: '/', label: t('nav', 'home') },
        { href: '/about', label: 'من نحن' },
        { href: '/#services', label: t('nav', 'services') },
        { href: '/articles', label: 'المقالات والأخبار' },
        { href: '/#videos', label: t('nav', 'videos') },
        { href: '/#gallery', label: t('nav', 'gallery') },
        { href: '/#contact', label: t('nav', 'contact') },
      ];
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
              {t('identity', 'officialAssociation')}
            </span>
          </div>

          {/* Quick Contact & Socials */}
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${association.phone1}`} 
              className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition"
              title="الهاتف الرئيسي"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span dir="ltr">{association.phone1}</span>
            </a>
            
            <a 
              href={`tel:${association.phone2}`} 
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-emerald-400 transition"
              title="الهاتف الثاني"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span dir="ltr">{association.phone2}</span>
            </a>

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
          
          {/* Logo & Association Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="shrink-0 flex items-center justify-center">
              <Logo size={56} />
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-emerald-900 group-hover:text-emerald-700 transition leading-snug line-clamp-1 sm:line-clamp-none">
                {lang === 'ar' ? association.nameAr : lang === 'fr' ? association.nameFr : association.nameEn}
              </span>
              <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                <span>{association.acronym}</span>
                <span>•</span>
                <span>{lang === 'ar' ? 'رعاية الأطفال في وضعية صعبة' : lang === 'fr' ? 'Protection des Enfants en Situation Difficile' : 'Caring for Children in Hardship'}</span>
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
