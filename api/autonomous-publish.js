// api/autonomous-publish.js - Autonomous Article Generator (AR / FR / EN)

async function translateFree(text, to) {
  if (!text) return text;
  const chunks = text.match(/.{1,400}/g) || [text];
  let result = '';
  for (const chunk of chunks) {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=ar|${to}`
      );
      const j = await res.json();
      let t = j.responseData?.translatedText || chunk;
      t = t.replace(/AMSED/g, 'AMSED').replace(/SAKNIA/g, 'SAKNIA');
      result += t + ' ';
      await new Promise(r => setTimeout(r, 300));
    } catch {
      result += chunk + ' ';
    }
  }
  return result.trim();
}

const TEMPLATE_AR = (topic) => `# ${topic} - دليل عملي من مركز AMSED

في قلب الساكنية بالقنيطرة، في مركزنا SAKNIA 30 LOT EL HIZAM N° D 376.58.1، نستقبل كل صباح أمهات جايين مقلقين على ولداتهم. اليوم غادي نهضرو على موضوع مهم بزاف: ${topic}.

## شنو هو ${topic}؟

## كيفاش كنخدمو هاد الموضوع فالجمعية ديالنا؟

عندنا 8 خدمات: الترويض الطبي، تقويم النطق، الدعم المدرسي AVS، ورشات مهنية، مواكبة نفسية.

## 3 نصائح اليوم
1. الروتين هو الأمان
2. التشجيع ماشي العقاب
3. تواصلي معنا: 06 54 24 05 23`;

const TEMPLATE_FR = (topic_fr) => `# ${topic_fr} - Guide pratique du centre AMSED

Au cœur de Saknia à Kénitra (SAKNIA 30 LOT EL HIZAM N° D 376.58.1), nous accueillons chaque matin des mamans inquiètes pour leurs enfants. Parlons aujourd'hui de : ${topic_fr}.

## C'est quoi ${topic_fr}?

## Notre accompagnement à AMSED

8 services: psychomotricité, orthophonie, AVS scolaire, ateliers professionnels, soutien psychologique.

## 3 conseils pour aujourd'hui
1. La routine rassure
2. Encourager, pas punir
3. Contactez-nous: 06 54 24 05 23`;

const TEMPLATE_EN = (topic_en) => `# ${topic_en} - Practical guide from AMSED center

In Saknia, Kenitra (SAKNIA 30 LOT EL HIZAM N° D 376.58.1), we welcome worried mothers every morning. Let's talk about: ${topic_en}.

## What is ${topic_en}?

## How we help at AMSED

8 services: therapy, speech, school support AVS, workshops, psychological support.

Contact: 06 54 24 05 23`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: topics, error: fetchErr } = await supabase.from('topics_bank').select('*').eq('used', false).limit(1);
    if (fetchErr || !topics?.length) {
      return res.status(200).json({ error: 'الخزان خاوي', details: fetchErr?.message });
    }

    const topic_ar = topics[0].title;

    // 1. ترجمة العنوان فابور
    const topic_fr = await translateFree(topic_ar, 'fr');
    const topic_en = await translateFree(topic_ar, 'en');

    // 2. توليد مقالات ب 3 لغات
    const content_ar = TEMPLATE_AR(topic_ar);
    const content_fr = TEMPLATE_FR(topic_fr);
    const content_en = TEMPLATE_EN(topic_en);

    // 3. نشر
    const { error: insertErr } = await supabase.from('articles').insert({
      title_ar: topic_ar,
      title_fr: topic_fr,
      title_en: topic_en,
      content_ar,
      content_fr,
      content_en,
      status: 'published',
      created_at: new Date().toISOString()
    });

    if (insertErr) {
      return res.status(500).json({ error: 'فشل إدخال المقال في قاعدة البيانات', details: insertErr.message });
    }

    await supabase.from('topics_bank').update({ used: true }).eq('id', topics[0].id);

    return res.status(200).json({
      success: true,
      ar: topic_ar,
      fr: topic_fr,
      en: topic_en
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
