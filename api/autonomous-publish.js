// api/autonomous-publish.js - Autonomous Article Generator (100% Free Templates)

const TEMPLATES = [
  (topic) => `# ${topic} - دليل عملي من مركز AMSED

في قلب الساكنية بالقنيطرة، في مركزنا SAKNIA 30 LOT EL HIZAM N° D 376.58.1، نستقبل كل صباح أمهات جايين مقلقين على ولداتهم. اليوم غادي نهضرو على موضوع مهم بزاف: ${topic}.

## شنو هو ${topic} وكيفاش كيأثر على ولدك؟

بزاف ديال الأمهات كيسولونا على هاد الموضوع. الحقيقة أن كل طفل توحد فريد، والفهم الصحيح هو أول خطوة للمساعدة. في AMSED، شفنا أن التدخل المبكر كيحسن التواصل بنسبة كبيرة.

## كيفاش كنخدمو هاد الموضوع فالجمعية ديالنا؟

عندنا 8 خدمات مجانية ومدعمة:
🧠 الترويض الطبي - 🗣️ تقويم النطق - 👩🏫 الدعم المدرسي AVS
🔧 ورشات مهنية - ❤️ مواكبة نفسية للأم - ⚽ أنشطة رياضية

كل خدمة كتدار من طرف مختصين متطوعين.

## 3 نصائح تقدري تديريها اليوم فالدار

1. **الروتين هو الأمان:** نفس الوقت للنوم والماكلة
2. **التشجيع ماشي العقاب:** كل كلمة جديدة احتفلي بيها
3. **تواصلي معنا:** ما تبقايش بوحدك

> جمعية AMSED - 85+ متطوع، 650+ طفل مستفيد
> 📞 06 54 24 05 23 | العنوان: SAKNIA 30 LOT EL HIZAM

#توحد #قنيطرة #AMSED #إعاقة`,

  (topic) => `# أم كتسول: كيفاش نتعامل مع ${topic}؟

سؤال كيجينا بزاف فالواتساب ديال الجمعية. الجواب ماشي ساهل ولكن التجربة علمتنا...

## التجربة ديالنا مع ${topic}

منذ 2018 وحنا خدامين، لاحظنا أن الأطفال اللي الأمهات ديالهم كيتبعو التوجيهات كيتقدمو 3 مرات كثر.

## الخدمة اللي كنقترحو عليك

إلا كان ولدك كيعاني من ${topic}، عندنا برنامج خاص: حصة تقييم مجانية + خطة فردية + متابعة أسبوعية.

اتصلي دابا: 06 54 24 05 23`
];

function generate100Free(topic) {
  const tpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return tpl(topic);
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

    // 1. جيب موضوع
    const { data: topics, error: fetchErr } = await supabase.from('topics_bank').select('*').eq('used', false).limit(1);
    if (fetchErr || !topics?.length) {
      return res.status(200).json({ error: 'الخزان خاوي - زيد 50 موضوع آخر', details: fetchErr?.message });
    }

    // 2. ولد مقال بلا IA خارجي
    const content = generate100Free(topics[0].title);

    // 3. نشر
    const { error: insertErr } = await supabase.from('articles').insert({
      title_ar: topics[0].title,
      title_fr: topics[0].title, // الترجمة غادي يديرها الكاروسل الجانبي تلقائيا فالفرونت
      title_en: topics[0].title,
      content_ar: content,
      status: 'published',
      created_at: new Date().toISOString()
    });

    if (insertErr) {
      return res.status(500).json({ error: 'تعذر نشر المقال في جدول articles', details: insertErr.message });
    }

    await supabase.from('topics_bank').update({ used: true }).eq('id', topics[0].id);

    return res.status(200).json({
      success: true,
      published: topics[0].title,
      content_preview: content.slice(0, 100)
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
