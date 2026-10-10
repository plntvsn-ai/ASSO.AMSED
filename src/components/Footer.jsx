import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { 
  Heart, Phone, Mail, MapPin, Sparkles, 
  Lock, Shield, ExternalLink 
} from 'lucide-react';
import { FacebookIcon, YoutubeIcon } from './SocialIcons';

export const Footer = ({ onOpenAdmin }) => {
  const { lang, t } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();

  const association = data.association;
  const contact = cmsData?.contact || association;
  const logo = cmsData?.logo || { url: "/logo.jpg", motto: "الله • الوطن • الملك" };
  const footerMenus = cmsData?.menus?.footerMenus || [
    { id: "fm-1", label: "الرئيسية", link: "/", order: 1 },
    { id: "fm-2", label: "المقالات والأخبار", link: "/articles", order: 2 },
    { id: "fm-3", label: "برامج الكفالة", link: "/#donate", order: 3 },
    { id: "fm-4", label: "من نحن والأهداف", link: "/about", order: 4 },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About & Logo (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shadow-md shrink-0 bg-slate-950">
                <img 
                  src={logo.url || "/logo.jpg"} 
                  alt="شعار الجمعية" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <span className="text-base font-bold text-white block">
                  {lang === 'ar' ? association.nameAr : lang === 'fr' ? association.nameFr : association.nameEn}
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  {logo.motto || t('identity', 'motto')}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {t('footer', 'aboutText')}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {contact.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition"
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
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links from CMS (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer', 'quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footerMenus.map((item) => (
                <li key={item.id}>
                  {item.link.startsWith('/') && !item.link.startsWith('/#') ? (
                    <Link to={item.link} className="hover:text-emerald-400 transition block">
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.link} className="hover:text-emerald-400 transition block">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Emergency Numbers (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer', 'emergencyContact')}
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <a
                href={`tel:${contact.phone1}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{contact.phone1} (مباشر / واتساب)</span>
              </a>

              <a
                href={`tel:${contact.phone2}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{contact.phone2}</span>
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{contact.email}</span>
              </a>

              <div className="flex items-start gap-2.5 text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{contact.address || (lang === 'ar' ? association.addressAr : association.addressFr)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            {t('footer', 'rights')}
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>{t('footer', 'builtWithHeart')}</span>
            </span>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 px-3 py-1.5 rounded-lg border border-slate-800 transition font-bold"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة التحكم CMS (/admin)</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
