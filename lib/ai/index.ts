import { GoogleGenerativeAI } from "@google/generative-ai"

console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY)

export function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY)
  if (!apiKey) return null
  return new GoogleGenerativeAI(apiKey)
}

export function getGeminiModel(modelName = "gemini-1.5-flash") {
  const genAI = getGenAI()
  if (!genAI) return null
  return genAI.getGenerativeModel({ model: modelName })
}

export async function generateArticleWithGemini(topic: string) {
  console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY)
  try {
    const model = getGeminiModel("gemini-1.5-flash")
    if (!model) return null

    const prompt = `أنت كاتب مقالات إنساني وتربوي في جمعية المبادرة المغربية للتكافل والتعاون (AMSED) بالقنيطرة (مركز تأهيل أطفال التوحد وذوي الاحتياجات الخاصة).
الموضوع: "${topic}"

اكتب مقالاً مفيداً وتطبيقياً للأمهات والآباء بأسلوب دافئ وعملي.
يجب أن ترجع النتيجة بصيغة JSON فقط بهذه الحقول:
{
  "title_ar": "عنوان جذاب بالعربية",
  "content_ar": "نص المقال كامل بالعربية بتنسيق markdown مع مقدمة وعناوين ونصائح عملية",
  "title_fr": "Titre en Français",
  "content_fr": "Article complet en Français",
  "title_en": "Title in English",
  "content_en": "Full article in English"
}
لا تضف أي نص خارج كائن الـ JSON.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (err: any) {
    console.warn("Gemini generation notice:", err?.message)
    return null
  }
}

export default { getGenAI, getGeminiModel, generateArticleWithGemini }
