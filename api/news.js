// api/news.js - Free Google News RSS Feed for Autism & Child Disability in Morocco
// No API Key Required (100% Free RSS)

const TOPIC_IMAGES = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
];

// Fallback curated news in case Google News network is unavailable
const FALLBACK_NEWS = [
  {
    id: "fallback-1",
    title: "اليوم العالمي للتوحد يجدد المطالبة بتعزيز برامج الإدماج والدعم في المغرب",
    link: "https://hespress.com",
    source: "هسبريس",
    pubDate: new Date().toISOString(),
    formattedDate: "اليوم",
    category: "طيف التوحد",
    image: TOPIC_IMAGES[0],
    summary: "فعاليات جمعوية وتربوية بالمغرب تدعو لتوسيع برامج الدمج المدرسي والمرافقة المتخصصة للأطفال ذوي التوحد."
  },
  {
    id: "fallback-2",
    title: "مبادرات رائدة بالقنيطرة لدعم أطفال التوحد وتأهيل النطق والتخاطب",
    link: "https://mapnews.ma",
    source: "وكالة المغرب العربي للأنباء",
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    formattedDate: "أمس",
    category: "التأهيل والتخاطب",
    image: TOPIC_IMAGES[1],
    summary: "مراكز التربية الخاصة بالقنيطرة تعزز برامج ABA والترويض الحركي والنفسي لتحقيق استقلالية الطفل."
  },
  {
    id: "fallback-3",
    title: "برامج الدمج المدرسي للأطفال في وضعية صعبة: خطوات عملية لدعم الأسر",
    link: "https://al3omk.com",
    source: "العمق المغربي",
    pubDate: new Date(Date.now() - 172800000).toISOString(),
    formattedDate: "منذ يومين",
    category: "التربية الدامجة",
    image: TOPIC_IMAGES[2],
    summary: "دليل إرشادي يوضح آليات مرافقة الحياة المدرسية والتعليم الأولي المكيف لأطفال طيف التوحد."
  }
];

function formatArabicDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffHours = Math.floor((now - d) / (1000 * 60 * 60));
    if (diffHours < 1) return "منذ لحظات";
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "أمس";
    if (diffDays === 2) return "منذ يومين";
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    return d.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function parseGoogleNewsXml(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  for (let i = 0; i < itemBlocks.length; i++) {
    const block = itemBlocks[i];

    // Extract title
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/i);
    let rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '';

    // Extract link
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : '#';

    // Extract pubDate
    const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

    // Extract source
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
    let source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : 'Google News';

    // Clean title - remove trailing source separator
    let title = rawTitle;
    if (source && title.includes(' - ')) {
      const parts = title.split(' - ');
      if (parts.length > 1 && parts[parts.length - 1].trim().toLowerCase() === source.toLowerCase()) {
        parts.pop();
        title = parts.join(' - ').trim();
      }
    }

    // Filter out unrelated news that mistakenly matched the word 'توحد'
    const forbiddenKeywords = ['كرة القدم', 'المباراة', 'البطولة', 'الجماهير', 'الملعب', 'الكاف', 'الفيفا', 'الرجاء', 'الوداد'];
    const isUnrelated = forbiddenKeywords.some(kw => rawTitle.includes(kw));
    if (isUnrelated) continue;

    const formattedDate = pubDate ? formatArabicDate(pubDate) : 'حديثاً';
    const image = TOPIC_IMAGES[items.length % TOPIC_IMAGES.length];

    items.push({
      id: `rss-${i + 1}-${pubDate.replace(/[^0-9]/g, '').slice(-6)}`,
      title: title || rawTitle,
      rawTitle,
      link,
      pubDate,
      formattedDate,
      source: source || 'أخبار وطنية',
      image,
      category: 'طيف التوحد والتربية الدامجة'
    });

    if (items.length >= 12) break;
  }

  return items;
}

export default async function handler(req, res) {
  // CORS & Caching Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const query = encodeURIComponent('طيف التوحد أطفال المغرب OR التربية الدامجة أطفال التوحد');
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=ar&gl=MA&ceid=MA:ar`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(rssUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Google News RSS responded with status ${response.status}`);
    }

    const xml = await response.text();
    const parsedNews = parseGoogleNewsXml(xml);

    const finalNews = parsedNews.length > 0 ? parsedNews : FALLBACK_NEWS;

    return res.status(200).json({
      success: true,
      count: finalNews.length,
      feed: 'Google News RSS (Free 100%)',
      query: 'طيف التوحد أطفال المغرب',
      news: finalNews
    });
  } catch (error) {
    console.warn('RSS Fetch failed, serving fallback news:', error.message);
    return res.status(200).json({
      success: true,
      count: FALLBACK_NEWS.length,
      feed: 'Fallback Curated News',
      isFallback: true,
      news: FALLBACK_NEWS,
      error: error.message
    });
  }
}
