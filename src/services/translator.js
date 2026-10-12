// src/services/translator.js - Free MyMemory Translation Service

const translationCache = new Map();

// إلا كان المقال ما عندوش ترجمة، ترجم تلقائيا فالفرونت فابور
export async function autoTranslateIfMissing(text, to) {
  if (!text) return text;
  if (to !== 'fr' && to !== 'en') return text;

  const cacheKey = `${to}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=ar|${to}`);
    const j = await res.json();
    const translated = j.responseData?.translatedText || text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return text;
  }
}

/**
 * smartTranslate - Free smart translation via MyMemory Translated API
 * @param {string} text - Arabic text to translate
 * @param {string} target - Target language code ('fr' | 'en' | ...)
 * @returns {Promise<string>} Translated text
 */
export async function smartTranslate(text, target) {
  if (!text || typeof text !== 'string') return text || '';
  try {
    const encoded = encodeURIComponent(text.trim());
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encoded}&langpair=ar|${target}`);
    if (!res.ok) throw new Error(`MyMemory API HTTP ${res.status}`);
    const data = await res.json();
    return data?.responseData?.translatedText || text;
  } catch (error) {
    console.warn(`smartTranslate to ${target} notice:`, error.message);
    return text;
  }
}

export default smartTranslate;
