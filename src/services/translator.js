// src/services/translator.js - Free MyMemory Translation Service

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
