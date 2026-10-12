// api/autonomous-publish.js - Autonomous Article Publisher with Smart Translation

async function smartTranslate(text, target) {
  // استعمل MyMemory فابور - ترجمة ذكية ماشي حرفية
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|${target}`);
    const data = await res.json();
    return data?.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TOPICS = [
    "كيفاش نعلم طفل التوحد يطلب الماء",
    "تمارين التخاطب للأطفال في المنزل",
    "كيفاش نتعامل مع نوبات الغضب عند أطفال التوحد",
    "الدمج المدرسي للأطفال في وضعية صعبة",
    "تنمية المهارات الدقيقة للأطفال"
  ];

  try {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const images = [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
    ];

    // ملي كتنشر مقال بالعربية:
    const fr = await smartTranslate(topic, 'fr');
    const en = await smartTranslate(topic, 'en');

    const articleContent = `
      <h2>مقدمة</h2>
      <p>بزاف ديال الأمهات فالقنيطرة كيسولونا على ${topic}... هاد التجربة ديال أم سارة من الساكنية 30 غادي تفيدكم بزاف.</p>
      <img src="${images[0]}" style="width:100%;border-radius:15px;margin:15px 0" />
      <h2>1. علاش هاد المهارة مهمة؟</h2>
      <p>الطفل ملي كيتعلم يطلب بوحدو كتزيد الثقة ديالو فراسو وكينقص التوتر فالدار.</p>
      <h2>2. 3 خطوات عملية تقدري تديريها اليوم فالدار</h2>
      <ul><li>الخطوة 1: استعملي الصور</li><li>الخطوة 2: قسمي المهمة</li><li>الخطوة 3: شجعيه مباشرة</li></ul>
      <img src="${images[1]}" style="width:100%;border-radius:15px;margin:15px 0" />
      <h2>3. الأخطاء اللي خاصك تتجنبيها</h2>
      <p>ما تطلبيش منو بزاف دقة وحدة، وخلي كل حاجة بلعب.</p>
      <p><strong>مركز AMSED - SAKNIA 30 - القنيطرة - 06 54 24 05 23</strong></p>
    `;

    const newArticle = {
      id: Date.now().toString(),
      title: topic,
      title_ar: topic,
      title_fr: fr,
      title_en: en,
      content: articleContent,
      images: images,
      image: images[0],
      published: true,
      status: 'published',
      isApproved: true,
      category: 'نصائح وإرشاد',
      created_at: new Date().toISOString()
    };

    return res.status(200).json({ success: true, article: newArticle });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
