import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    // 1. Check saved user preference in localStorage
    const saved = localStorage.getItem('amsed_language');
    if (saved && ['ar', 'fr', 'en'].includes(saved)) {
      return saved;
    }

    // 2. Automatic browser language detection as requested
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
    if (browserLang.startsWith('fr')) {
      return 'fr';
    }
    // Default fallback: Arabic as primary for Moroccan association, or English if english browser
    if (browserLang.startsWith('en')) {
      return 'en';
    }
    return 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('amsed_language', lang);

    // Update document title dynamically
    if (lang === 'ar') {
      document.title = "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة";
    } else if (lang === 'fr') {
      document.title = "Association Initiative Marocaine pour la Solidarité et la Coopération (AMSED)";
    } else {
      document.title = "Moroccan Initiative Association for Solidarity and Cooperation (AMSED)";
    }
  }, [lang, dir]);

  const setLanguage = (newLang) => {
    if (['ar', 'fr', 'en'].includes(newLang)) {
      setLangState(newLang);
    }
  };

  const t = (section, key) => {
    try {
      if (translations[lang] && translations[lang][section] && translations[lang][section][key]) {
        return translations[lang][section][key];
      }
      // Fallback to Arabic or English
      if (translations['ar'][section] && translations['ar'][section][key]) {
        return translations['ar'][section][key];
      }
      return key;
    } catch {
      return key;
    }
  };

  // Helper to extract localized property from an item (e.g. titleAr, titleFr, titleEn)
  const getLocalized = (obj, propName) => {
    if (!obj) return '';
    const suffix = lang === 'ar' ? 'Ar' : lang === 'fr' ? 'Fr' : 'En';
    const localized = obj[`${propName}${suffix}`];
    if (localized) return localized;
    return obj[`${propName}Ar`] || obj[`${propName}Fr`] || obj[`${propName}En`] || obj[propName] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, setLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
