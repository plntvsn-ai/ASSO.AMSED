import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

async function translateFree(text, to) {
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=ar|${to}`);
    const j = await r.json();
    return j.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

function makeFallbackArticle(topic) {
  return {
    ar: `# ${topic}

في جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED نستقبل يومياً أمهات وأطفال...

## ما هو ${topic}؟
يشكل موضوع ${topic} ركيزة أساسية في فهم عالم الطفولة وتطوير قدرات أطفال التوحد وفي وضعية صعبة.

## كيف نساعد في جمعية AMSED؟
لدينا خدمات تأهيلية متكاملة: ترويض طبي، تقويم النطق، دعم مدرسي AVS، ورشات مهنية، مواكبة نفسية وإدماج مدرسي.

## نصائح عملية اليوم
1. الروتين اليومي المنظم يوفر الأمان للطفل
2. التشجيع الإيجابي والصبر في التدريب
3. تواصلوا مع جمعية AMSED: 06 54 24 05 23

-- جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED`,
    fr: `Guide pratique AMSED: ${topic} - Prise en charge des enfants autistes. Contact: 06 54 24 05 23`,
    en: `AMSED Practical Guide: ${topic} - Caring for children with autism. Contact: 06 54 24 05 23`
function getTopicMatchedImage(topic = '') {
  const t = topic.toLowerCase();
  if (t.includes('أينشتاين') || t.includes('اينشتاين') || t.includes('einstein') || t.includes('عبقر') || t.includes('فيزياء')) {
    return {
      url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
      alt: "أبحاث علمية وعبقرية أينشتاين والتوحد - AMSED"
    };
  }
  if (t.includes('نطق') || t.includes('تخاطب') || t.includes('تواصل') || t.includes('كلام') || t.includes('صوت') || t.includes('speech')) {
    return {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
      alt: "تأهيل النطق والتخاطب لأطفال التوحد - AMSED"
    };
  }
  if (t.includes('تغذي') || t.includes('أكل') || t.includes('حمية') || t.includes('طعام') || t.includes('nutrition')) {
    return {
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80",
      alt: "تغذية صحية ومتوازنة للطفل التوحدي - AMSED"
    };
  }
  if (t.includes('مدرس') || t.includes('دمج') || t.includes('قسم') || t.includes('avs') || t.includes('school')) {
    return {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
      alt: "الإدماج المدرسي والتعليم الأولي المكيف - AMSED"
    };
  }
  if (t.includes('ورش') || t.includes('حلويات') || t.includes('طبخ') || t.includes('رسم') || t.includes('خياط')) {
    return {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80",
      alt: "ورشات مهنية وحرفية لأطفال التوحد - AMSED"
    };
  }
  if (t.includes('علامات') || t.includes('رضع') || t.includes('مبكر') || t.includes('تشخيص')) {
    return {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80",
      alt: "العلامات المبكرة للتوحد عند الأطفال - AMSED"
    };
  }
  return {
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80",
    alt: "رعاية وتأهيل أطفال التوحد - AMSED"
  };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
    let supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

    const supabase = (supabaseUrl && supabaseKey) 
      ? createClient(supabaseUrl, supabaseKey) 
      : null;

    let topic_ar = 'طرق تأهيل أطفال التوحد وتنمية مهارات النطق والتواصل';
    let topicId = null;

    if (supabase) {
      try {
        const { data: topics, error: tError } = await supabase.from('topics_bank').select('*').eq('used', false).limit(1);
        if (!tError && topics?.length) {
          topic_ar = topics[0].topic || topics[0].title || topic_ar;
          topicId = topics[0].id;
        }
      } catch (err) {
        console.warn('Topics bank query notice:', err);
      }
    }

    let final_title_ar = topic_ar;
    let final_title_fr = '';
    let final_title_en = '';
    let final_content_ar = '';
    let final_content_fr = '';
    let final_content_en = '';
    let generatedWithAi = false;

    const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GEMINI_KEY || "").trim();

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `أنت كاتب مقالات طبي وتربوي متخصص في جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED (رعاية أطفال التوحد وفي وضعية صعبة).
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
لا تضف أي نص خارج كائن الـ JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed?.content_ar) {
          final_title_ar = parsed.title_ar || topic_ar;
          final_title_fr = parsed.title_fr || await translateFree(topic_ar, 'fr');
          final_title_en = parsed.title_en || await translateFree(topic_ar, 'en');
          final_content_ar = parsed.content_ar;
          final_content_fr = parsed.content_fr || `Guide AMSED: ${final_title_fr}`;
          final_content_en = parsed.content_en || `AMSED Guide: ${final_title_en}`;
          generatedWithAi = true;
        }
      } catch (aiErr) {
        console.warn("Gemini generation fallback notice:", aiErr?.message);
      }
    }

    if (!generatedWithAi) {
      final_title_fr = await translateFree(topic_ar, 'fr');
      final_title_en = await translateFree(topic_ar, 'en');
      const fallback = makeFallbackArticle(topic_ar);
      final_content_ar = fallback.ar;
      final_content_fr = `Guide AMSED: ${final_title_fr} - Contact 06 54 24 05 23`;
      final_content_en = `AMSED Guide: ${final_title_en} - Contact 06 54 24 05 23`;
    }

    if (supabase) {
      try {
        await supabase.from('articles').insert({
          title_ar: final_title_ar,
          title_fr: final_title_fr,
          title_en: final_title_en,
          content_ar: final_content_ar,
          content_fr: final_content_fr,
          content_en: final_content_en,
          status: 'published'
        });
      } catch (insertErr) {
        console.warn('Supabase article insert notice:', insertErr);
      }

      if (topicId) {
        try {
          await supabase.from('topics_bank').update({ used: true }).eq('id', topicId);
        } catch (updateErr) {
          console.warn('Topic status update notice:', updateErr);
        }
      }
    }

    const articlePayload = {
      id: `robot-${Date.now()}`,
      title: final_title_ar,
      title_ar: final_title_ar,
      title_fr: final_title_fr,
      title_en: final_title_en,
      slug: `amsed-autism-article-${Date.now()}`,
      excerpt: `مقال طبي متخصص في التوحد عند الأطفال من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED القنيطرة.`,
      content: final_content_ar,
      content_ar: final_content_ar,
      content_fr: final_content_fr,
      content_en: final_content_en,
      category: "التوحد والطفولة",
      author: "أطر جمعية AMSED",
      published: true,
      autoGenerated: true,
      is_ai: true,
      createdAt: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      image: getTopicMatchedImage(final_title_ar).url,
      imageUrl: getTopicMatchedImage(final_title_ar).url,
      image_alt: getTopicMatchedImage(final_title_ar).alt,
      views: 0
    };

    return res.status(200).json({
      success: true,
      published: final_title_ar,
      ar: final_title_ar,
      fr: final_title_fr,
      en: final_title_en,
      content_ar: final_content_ar,
      ai: generatedWithAi,
      article: articlePayload,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message || String(e) });
  }
}
