import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';
import { Globe, Heart, Menu, X, Lock } from 'lucide-react';

export default function Header() {
  const { lang, setLanguage, dir, t } = useLanguage();
  const { cmsData } = useCms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cmsHeaderMenus = cmsData?.menus?.headerMenus;
  const navLinks = (cmsHeaderMenus && cmsHeaderMenus.length > 0)
    ? cmsHeaderMenus.map(m => ({ href: m.link, label: m.label }))
    : [
        { href: '/', label: 'الرئيسية' },
        { href: '/articles', label: 'المقالات والأخبار' },
        { href: '/#services', label: 'خدماتنا' },
        { href: '/#gallery', label: 'معرض الصور' },
        { href: '/#videos', label: 'فيديوهات الميدان' },
        { href: '/about', label: 'من نحن' },
        { href: '/#donate', label: 'تبرع الآن' },
        { href: '/#contact', label: 'اتصل بنا' },
      ];

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
        
        {/* Logo & Association Title - Only pure Logo component with no iframe/video */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="shrink-0 flex items-center justify-center">
            <Logo size={56} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-extrabold text-emerald-950 group-hover:text-emerald-700 transition leading-tight">
              {lang === 'ar' ? 'جمعية المبادرة المغربية للتكافل والتعاون' : lang === 'fr' ? 'Association Initiative Marocaine' : 'Moroccan Initiative Association'}
            </span>
            <span className="text-xs text-amber-700 font-semibold">
              {lang === 'ar' ? 'لرعاية الأطفال في وضعية صعبة بالقنيطرة' : 'Protection des Enfants en Situation Difficile'}
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

        {/* Right Controls: Languages & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  lang === l.code ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          {/* Donate CTA */}
          <a
            href="#donate"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>تبرع الآن</span>
          </a>

          {/* Admin link */}
          <Link
            to="/admin"
            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition"
            title="لوحة التحكم"
          >
            <Lock className="w-4 h-4" />
          </Link>
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

      {/* Mobile Menu Dropdown */}
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

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="#donate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>تبرع الآن</span>
            </a>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>لوحة التحكم (/admin)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
export { Header };
