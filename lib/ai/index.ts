 // GROQ - فابور 100% - بديل Gemini
console.log("GROQ KEY EXISTS:",!!process.env.GROQ_API_KEY)

export function getGenAI() {
  const apiKey = (process.env.GROQ_API_KEY || "").trim()
  console.log("GROQ API KEY FOUND:", apiKey? apiKey.substring(0, 15) + "..." : "AUCUNE")
  if (!apiKey ||!apiKey.startsWith("gsk_")) return null
  return { apiKey } as any
}

export function getGeminiModel(modelName = "llama-3.1-8b-instant") {
  const genAI = getGenAI()
  if (!genAI) return null
  return { modelName, apiKey: genAI.apiKey } as any
}

export async function generateArticleWithGemini(topic: string) {
  console.log("GROQ KEY EXISTS:",!!process.env.GROQ_API_KEY)
  try {
    const apiKey = (process.env.GROQ_API_KEY || "").trim()
    if (!apiKey) return null

    const prompt = `أنت كاتب مقالات إنساني وتربوي في جمعية المبادرة المغربية للتكافل والتعاون (AMSED) بالقنيطرة (مركز تأهيل أطفال التوحد وذوي الاحتياجات الخاصة).
الموضوع: "${topic}"

اكتب مقالاً مفيداً وتطبيقياً للأمهات والآباء بأسلوب دافئ وعملي.
يجب أن ترجع النتيجة بصيغة JSON فقط بهذه الحقول:
{
  "title_ar": "عنوان جذاب بالعربية",
  "content_ar": "نص المقال كامل بالعربية بتنسيق markdown مع مقدمة وعناوين ونصائح عملية",
  "title_fr": "Titre en Français",
  "content_fr": "Article complet
