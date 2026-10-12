// api/autonomous-publish.js - Autonomous Article Publisher (maxDuration=60)

async function translateFree(text, to) {
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=ar|${to}`);
    const j = await r.json();
    return j.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

function makeArticle(topic) {
  return {
    ar: `# ${topic}

في مركز AMSED بالساكنية القنيطرة (SAKNIA 30 LOT EL HIZAM N° D 376.58.1) نستقبل يوميا أمهات...

## ما هو ${topic}؟

## كيف نساعد في الجمعية؟

لدينا 8 خدمات: ترويض، نطق، دعم مدرسي AVS، ورشات مهنية، مواكبة نفسية.

## نصائح اليوم

1. الروتين ثابت
2. التشجيع الإيجابي
3. اتصلي بنا: 06 54 24 05 23

-- جمعية AMSED - 650+ طفل مستفيد`,
    fr: '',
    en: ''
  };
}

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

    const { data: topics, error: tError } = await supabase.from('topics_bank').select('*').eq('used', false).limit(1);
    if (tError) return res.status(500).json({ error: tError.message });
    if (!topics?.length) return res.status(400).json({ error: 'الخزان خاوي - زيد مواضيع' });

    const topic_ar = topics[0].topic || topics[0].title;
    const topic_fr = await translateFree(topic_ar, 'fr');
    const topic_en = await translateFree(topic_ar, 'en');

    const art = makeArticle(topic_ar);

    const { error: iError } = await supabase.from('articles').insert({
      title_ar: topic_ar,
      title_fr: topic_fr,
      title_en: topic_en,
      content_ar: art.ar,
      content_fr: `Guide AMSED: ${topic_fr} - Contact 06 54 24 05 23 - SAKNIA 30 LOT EL HIZAM`,
      content_en: `AMSED Guide: ${topic_en} - Contact 06 54 24 05 23`,
      status: 'published'
    });
    if (iError) return res.status(500).json({ error: iError.message });

    await supabase.from('topics_bank').update({ used: true }).eq('id', topics[0].id);

    return res.status(200).json({ success: true, ar: topic_ar, fr: topic_fr, en: topic_en });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
