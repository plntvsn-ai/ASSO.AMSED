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
  "content_fr": "Article complet en Français",
  "title_en": "Title in English",
  "content_en": "Full article in English"
}
لا تضف أي نص خارج كائن الـ JSON.`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "أنت كاتب محترف لجمعية AMSED. ترجع JSON فقط." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      console.warn("Groq error:", await response.text())
      return null
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ""
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (err: any) {
    console.warn("Groq generation notice:", err?.message)
    return null
  }
}

export default { getGenAI, getGeminiModel, generateArticleWithGemini }
