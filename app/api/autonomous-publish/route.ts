import { GoogleGenerativeAI } from "@google/generative-ai"

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function translateFree(text: string, to: 'fr'|'en'){
  try{
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0,400))}&langpair=ar|${to}`)
    const j = await r.json()
    return j.responseData?.translatedText || text
  }catch{ return text }
}

function makeFallbackArticle(topic: string){
  return {
    ar: `# ${topic}

في جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED نستقبل يوميا أمهات وأطفال...

## ما هو ${topic}؟
يشكل موضوع ${topic} ركيزة أساسية في فهم عالم الطفولة وتطوير قدرات أطفال التوحد وفي وضعية صعبة.

## كيف نساعد في جمعية AMSED؟
لدينا خدمات تأهيلية متكاملة: ترويض طبي، تقويم النطق، دعم مدرسي AVS، ورشات مهنية، مواكبة نفسية وإدماج مدرسي.

## نصائح عملية اليوم
1. الروتين اليومي المنظم يوفر الأمان للطفل
2. التشجيع الإيجابي والصبر في التدريب
3. تواصلوا مع جمعية AMSED: 06 54 24 05 23

-- جمعية AMSED - رعاية أطفال التوحد وفي وضعية صعبة`,
    fr: `Guide pratique AMSED: ${topic} - Prise en charge des enfants autistes. Contact: 06 54 24 05 23`,
    en: `AMSED Practical Guide: ${topic} - Caring for children with autism. Contact: 06 54 24 05 23`
  }
}

export async function POST(req?: Request){
  try{
    const {createClient} = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
    const supabase = createClient(supabaseUrl, supabaseKey)

    let topic_ar = 'طرق تأهيل أطفال التوحد وتنمية مهارات النطق والتواصل'
    let topicId: any = null

    try {
      const {data: topics, error: tError} = await supabase.from('topics_bank').select('*').eq('used', false).limit(1)
      if(!tError && topics?.length) {
        topic_ar = topics[0].topic || topics[0].title || topic_ar
        topicId = topics[0].id
      }
    } catch {}

    let final_title_ar = topic_ar
    let final_title_fr = ''
    let final_title_en = ''
    let final_content_ar = ''
    let final_content_fr = ''
    let final_content_en = ''
    let generatedWithAi = false

    const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim()

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `أنت كاتب مقالات طبي وتربوي متخصص في جمعية AMSED (رعاية أطفال التوحد وفي وضعية صعبة).
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
      } catch (aiErr: any) {
        console.warn("Gemini generation fallback notice:", aiErr?.message)
      }
    }

    if (!generatedWithAi) {
      final_title_fr = await translateFree(topic_ar, 'fr')
      final_title_en = await translateFree(topic_ar, 'en')
      const fallback = makeFallbackArticle(topic_ar)
      final_content_ar = fallback.ar
      final_content_fr = `Guide AMSED: ${final_title_fr} - Contact 06 54 24 05 23`
      final_content_en = `AMSED Guide: ${final_title_en} - Contact 06 54 24 05 23`
    }

    try {
      await supabase.from('articles').insert({
        title_ar: final_title_ar,
        title_fr: final_title_fr,
        title_en: final_title_en,
        content_ar: final_content_ar,
        content_fr: final_content_fr,
        content_en: final_content_en,
        status: 'published'
      })
    } catch {}

    if (topicId) {
      try {
        await supabase.from('topics_bank').update({used: true}).eq('id', topicId)
      } catch {}
    }

    return Response.json({
      success: true,
      published: final_title_ar,
      ar: final_title_ar,
      fr: final_title_fr,
      en: final_title_en,
      ai: generatedWithAi
    })
  }catch(e:any){
    return Response.json({error: e.message}, {status:500})
  }
}

export async function GET(req?: Request){
  return POST(req)
}
