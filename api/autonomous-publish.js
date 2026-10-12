import { GoogleGenerativeAI } from "@google/generative-ai"

console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY)

async function translateFree(text, to) {
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=ar|${to}`)
    const j = await r.json()
    return j.responseData?.translatedText || text
  } catch {
    return text
  }
}

function makeFallbackArticle(topic) {
  return {
    ar: `# ${topic}

في مركز AMSED بالساكنية القنيطرة (SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA) نستقبل يوميا أمهات وأطفال...

## ما هو ${topic}؟
يشكل موضوع ${topic} ركيزة أساسية في فهم عالم الطفولة وتطوير قدرات الأطفال ذوي الاحتياجات الخاصة وفي وضعية صعبة.

## كيف نساعد في جمعية AMSED؟
لدينا 8 خدمات تأهيلية: ترويض طبي، تقويم النطق، دعم مدرسي AVS، ورشات مهنية، مواكبة نفسية وإدماج مدرسي.

## نصائح عملية اليوم
1. الروتين اليومي المنظم يوفر الأمان للطفل
2. التشجيع الإيجابي والصبر في التدريب
3. تواصلي معنا لطلب الاستشارة: 06 54 24 05 23

-- جمعية AMSED القنيطرة - أكثر من 650 طفل مستفيد`,
    fr: `Guide pratique AMSED: ${topic} - Centre Saknia Kénitra. Contact: 06 54 24 05 23`,
    en: `AMSED Practical Guide: ${topic} - Saknia Kenitra Center. Contact: 06 54 24 05 23`
  }
}

export default async function handler(req, res) {
  console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: topics, error: tError } = await supabase.from('topics_bank').select('*').eq('used', false).limit(1)
    if (tError) return res.status(500).json({ error: tError.message })
    if (!topics?.length) return res.status(400).json({ error: 'الخزان خاوي - زيد مواضيع' })

    const topic_ar = topics[0].topic || topics[0].title
    let final_title_ar = topic_ar
    let final_title_fr = ''
    let final_title_en = ''
    let final_content_ar = ''
    let final_content_fr = ''
    let final_content_en = ''

    const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim()
    console.log("API KEY FOUND:", geminiKey ? geminiKey.substring(0, 15) + "..." : "AUCUNE")
    let generatedWithAi = false

    if (geminiKey && geminiKey.startsWith("AIza")) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `أنت كاتب مقالات إنساني وتربوي في جمعية AMSED بالقنيطرة (مركز أطفال التوحد وذوي الاحتياجات الخاصة).
الموضوع: "${topic_ar}"

اكتب مقالاً مفيداً وتطبيقياً للأمهات والآباء.
يجب أن ترجع النتيجة بصيغة JSON فقط بهذه الحقول:
{
  "title_ar": "${topic_ar}",
  "content_ar": "نص المقال كامل بالعربية بتنسيق markdown",
  "title_fr": "Titre en Français",
  "content_fr": "Article complet en Français",
  "title_en": "Title in English",
  "content_en": "Full article in English"
}
لا تضف أي نص خارج كائن الـ JSON.`

        const result = await model.generateContent(prompt)
        const text = result.response.text()
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(cleaned)

        if (parsed?.content_ar) {
          final_title_ar = parsed.title_ar || topic_ar
          final_title_fr = parsed.title_fr || await translateFree(topic_ar, 'fr')
          final_title_en = parsed.title_en || await translateFree(topic_ar, 'en')
          final_content_ar = parsed.content_ar
          final_content_fr = parsed.content_fr || `Guide AMSED: ${final_title_fr}`
          final_content_en = parsed.content_en || `AMSED Guide: ${final_title_en}`
          generatedWithAi = true
        }
      } catch (aiErr) {
        console.warn("Gemini generation fallback notice:", aiErr?.message)
      }
    }

    if (!generatedWithAi) {
      final_title_fr = await translateFree(topic_ar, 'fr')
      final_title_en = await translateFree(topic_ar, 'en')
      const fallback = makeFallbackArticle(topic_ar)
      final_content_ar = fallback.ar
      final_content_fr = `Guide AMSED: ${final_title_fr} - Contact 06 54 24 05 23 - SAKNIA 30 LOT EL HIZAM`
      final_content_en = `AMSED Guide: ${final_title_en} - Contact 06 54 24 05 23`
    }

    const { error: iError } = await supabase.from('articles').insert({
      title_ar: final_title_ar,
      title_fr: final_title_fr,
      title_en: final_title_en,
      content_ar: final_content_ar,
      content_fr: final_content_fr,
      content_en: final_content_en,
      status: 'published'
    })
    if (iError) return res.status(500).json({ error: iError.message })

    await supabase.from('topics_bank').update({ used: true }).eq('id', topics[0].id)

    return res.status(200).json({
      success: true,
      ar: final_title_ar,
      fr: final_title_fr,
      en: final_title_en,
      ai: generatedWithAi
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
