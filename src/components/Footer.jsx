import React from 'react';
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

export const Footer = () => {
  const { lang, t } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();

  const association = data.association;
  const contact = cmsData?.contact || association;
  const logo = cmsData?.logo || { url: "/logo.jpg", motto: "الله • الوطن • الملك" };
  const footerMenus = (cmsData?.menus?.footerMenus || [
    { id: "fm-1", label: "الرئيسية", link: "/", order: 1 },
    { id: "fm-2", label: "من نحن والأهداف", link: "/about", order: 2 },
    { id: "fm-3", label: "خدماتنا التأهيلية", link: "/#services", order: 3 },
    { id: "fm-4", label: "المقالات والأخبار", link: "/articles", order: 4 },
  ]).filter(m => !m.link?.includes('donate') && !m.label?.includes('تبرع'));

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About & Logo (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-0.5 rounded-full border border-slate-700 shadow-md shrink-0 bg-transparent">
                <Logo size={46} />
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
              {lang === 'ar' 
                ? 'جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة بالقنيطرة، رعاية وتأهيل متكامل لأطفال التوحد والإدماج المدرسي والمهني.'
                : 'Association marocaine dédiée à la prise en charge, rééducation et inclusion scolaire des enfants autistes et en situation difficile à Kénitra.'}
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
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerMenus.map((item) => (
                <li key={item.id}>
                  {item.link.startsWith('/') && !item.link.startsWith('/#') ? (
                    <Link to={item.link} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                      <span>•</span>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <a href={item.link} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                      <span>•</span>
                      <span>{item.label}</span>
                    </a>
                  )}
                </li>
              ))}
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
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${contact.phone1}`} className="hover:text-white transition font-mono inline-block" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                  {contact.phone1}
                </a>
                {contact.phone2 && (
                  <>
                    <span>/</span>
                    <a href={`tel:${contact.phone2}`} className="hover:text-white transition font-mono inline-block" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                      {contact.phone2}
                    </a>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition font-mono">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright (Zero public admin links or lock icons) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            {t('footer', 'rights')}
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>{t('footer', 'builtWithHeart')}</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
