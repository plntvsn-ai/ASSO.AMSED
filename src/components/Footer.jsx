import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { 
  Heart, Phone, Mail, MapPin, Sparkles, 
  Shield, ExternalLink 
} from 'lucide-react';
import { FacebookIcon, YoutubeIcon } from './SocialIcons';

export const Footer = ({ siteSettings: propSettings }) => {
  const { lang, t } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();
  const [siteSettings, setSiteSettings] = useState(() => {
    if (propSettings) return propSettings;
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });

  useEffect(() => {
    if (propSettings) {
      setSiteSettings(propSettings);
      return;
    }
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === 'object') {
          setSiteSettings(d);
          try { localStorage.setItem('site_settings', JSON.stringify(d)); } catch {}
        }
      })
      .catch(() => {});
  }, [propSettings]);

  const association = data.association;
  const contact = cmsData?.contact || association;
  const logo = cmsData?.logo || { url: "/logo.jpg", motto: "الله • الوطن • الملك" };
  const footerMenus = (cmsData?.menus?.footerMenus || [
    { id: "fm-1", label: t('footer', 'home') || "الرئيسية", link: "/", order: 1 },
    { id: "fm-2", label: t('footer', 'about') || "من نحن والأهداف", link: "/about", order: 2 },
    { id: "fm-3", label: t('footer', 'services') || "خدماتنا التأهيلية", link: "/#services", order: 3 },
    { id: "fm-4", label: t('footer', 'articles') || "المقالات والأخبار", link: "/articles", order: 4 },
  ]).filter(m => !m.link?.includes('donate') && !m.label?.includes('تبرع'));

  const getFooterLabel = (label) => {
    if (!label) return '';
    if (lang === 'ar') return label;
    if (label.includes('رئيسية') || label.toLowerCase().includes('home')) return t('footer', 'home');
    if (label.includes('نحن') || label.toLowerCase().includes('about')) return t('footer', 'about');
    if (label.includes('خدمات') || label.toLowerCase().includes('service')) return t('footer', 'services');
    if (label.includes('مقال') || label.includes('أخبار') || label.toLowerCase().includes('article')) return t('footer', 'articles');
    return label;
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About & Logo (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 bg-transparent">
                <Logo size={52} />
              </div>
              <div>
                <span className="text-base font-bold text-white block leading-snug">
                  {lang === 'ar' ? (siteSettings?.association_full_display || "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED") : lang === 'fr' ? association.nameFr : association.nameEn}
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  {logo.motto || t('identity', 'motto')}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {lang === 'ar' 
                ? (siteSettings?.association_full_name ? `${siteSettings.association_full_name}، رعاية وتأهيل متكامل لأطفال التوحد والإدماج المدرسي والمهني بالقنيطرة.` : 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED القنيطرة، رعاية وتأهيل متكامل لأطفال التوحد والإدماج المدرسي والمهني.')
                : lang === 'fr'
                ? 'Association marocaine dédiée à la prise en charge, rééducation et inclusion scolaire des enfants autistes et en situation difficile à Kénitra.'
                : 'Moroccan association dedicated to care, rehabilitation, and school inclusion for children with autism and in difficult situations in Kenitra.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {contact.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {contact.youtubeUrl && (
                <a
                  href={contact.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Fast Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              {t('footer', 'quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footerMenus.map((item) => (
                <li key={item.id}>
                  {item.link.startsWith('/') && !item.link.startsWith('/#') ? (
                    <Link to={item.link} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                      <span>•</span>
                      <span>{getFooterLabel(item.label)}</span>
                    </Link>
                  ) : (
                    <a href={item.link} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                      <span>•</span>
                      <span>{getFooterLabel(item.label)}</span>
                    </a>
                  )}
                </li>
              ))}
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-400 hover:text-emerald-300">
                  <span>•</span>
                  <span>{t('footer', 'privacy')}</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-400 hover:text-emerald-300">
                  <span>•</span>
                  <span>{t('footer', 'terms')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-b border-slate-800 pb-2">
              {t('footer', 'contactUs')}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteSettings?.address_ar || "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${siteSettings?.phone || contact.phone1 || "06 54 24 05 23"}`} className="hover:text-white transition font-mono inline-block" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                  {siteSettings?.phone || contact.phone1 || "06 54 24 05 23"}
                </a>
              </div>
              {siteSettings?.phone2 && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`tel:${siteSettings.phone2}`} className="hover:text-white transition font-mono inline-block" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                    {siteSettings.phone2}
                  </a>
                </div>
              )}
              {siteSettings?.phone3 && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`tel:${siteSettings.phone3}`} className="hover:text-white transition font-mono inline-block" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                    {siteSettings.phone3}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${contact.email || "asso.amsed@gmail.com"}`} className="hover:text-white transition font-mono">
                  {contact.email || "asso.amsed@gmail.com"}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar - 3 columns */}
        <div className="pt-8 grid md:grid-cols-3 gap-6 text-sm text-slate-400 items-center">
          <div>
            {siteSettings?.address_ar || "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA"}
          </div>
          <div className="text-center font-bold text-white text-xs sm:text-sm">
            © {lang === 'ar'
                ? (siteSettings?.association_full_display || "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED")
                : lang === 'fr'
                ? "Association Initiative Marocaine pour la Solidarité et la Coopération (AMSED Kénitra)"
                : "Moroccan Initiative Association for Solidarity and Cooperation (AMSED Kenitra)"}
          </div>
          <div dir="ltr" className="text-left font-mono font-bold text-emerald-400" style={{ unicodeBidi: 'isolate' }}>
            {siteSettings?.phone || "06 54 24 05 23"}
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
