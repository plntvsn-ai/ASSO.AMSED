import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';
import { autoTranslateIfMissing } from '../services/translator';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [dynTranslations, setDynTranslations] = useState({});
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

  // Helper to extract localized property from an item (with automatic frontend fallback translation if missing)
  const getLocalized = (obj, propName) => {
    if (!obj) return '';
    const suffix = lang === 'ar' ? 'Ar' : lang === 'fr' ? 'Fr' : 'En';
    const underscoreSuffix = lang === 'ar' ? '_ar' : lang === 'fr' ? '_fr' : '_en';

    // 1. Explicit pre-existing localized string
    const localized = obj[`${propName}${suffix}`] || obj[`${propName}${underscoreSuffix}`];
    if (localized && localized !== obj[`${propName}Ar`] && localized !== obj[`${propName}_ar`]) {
      return localized;
    }
    if (localized && lang === 'ar') {
      return localized;
    }

    const baseText = obj[`${propName}Ar`] || obj[`${propName}_ar`] || obj[propName] || '';

    // 2. If Arabic, return base Arabic text immediately
    if (lang === 'ar' || !baseText) {
      return baseText;
    }

    // 3. Dynamic frontend translation cache if translation is missing
    const cacheKey = `${lang}:${baseText}`;
    if (dynTranslations[cacheKey]) {
      return dynTranslations[cacheKey];
    }

    // Trigger free lazy translation in background and update state
    autoTranslateIfMissing(baseText, lang)
      .then(translated => {
        if (translated && translated !== baseText) {
          setDynTranslations(prev => ({ ...prev, [cacheKey]: translated }));
        }
      })
      .catch(() => {});

    return baseText;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, setLanguage, t, getLocalized, autoTranslateIfMissing }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
