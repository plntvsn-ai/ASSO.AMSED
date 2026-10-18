import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""
  ).trim().replace(/\/+$/, "");

  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  ).trim();

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("xyzcompany") && !supabaseUrl.includes("placeholder")) {
    return createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      db: { schema: "public" }
    });
  }
  return null;
}

const FALLBACK_ARTICLES = [
  {
    id: "art-1",
    title_ar: "أعراض وعلامات التوحد عند الرضع بالمغرب: دليل الأم المبكر من 6 أشهر إلى سنتين",
    content_ar: "دليل عملي وتوجيهي من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED القنيطرة حول الكشف المبكر عن طيف التوحد.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
    created_at: new Date().toISOString()
  },
  {
    id: "art-2",
    title_ar: "أفضل مراكز التكفل بالتوحد بالقنيطرة وجهة الرباط سلا: خدمات جمعية AMSED",
    content_ar: "خدمات شاملة لأطفال التوحد وصعوبات التعلم: ترويض طبي، تقويم النطق، التعليم الأولي المكيف والإدماج المدرسي.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
    created_at: new Date().toISOString()
  },
  {
    id: "art-3",
    title_ar: "كيفية الاستفادة من دعم ومواكبة مرافقة الحياة المدرسية AVS بالمغرب",
    content_ar: "شروط ومساطر مواكبة أطفال التوحد داخل الفصول الدراسية النظامية لضمان الاستقلالية والاندماج التربوي.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    created_at: new Date().toISOString()
  }
];

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  let articles = FALLBACK_ARTICLES;
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

      if (!error && Array.isArray(data) && data.length > 0) {
        articles = data;
      }
    } catch (e) {
      console.warn("RSS supabase fetch notice:", e);
    }
  }

  const siteUrl = "https://asso-amsed.vercel.app";
  const nowRss = new Date().toUTCString();

  const itemsXml = articles.map(art => {
    const artTitle = (art.title_ar || art.title || "مقال تربوي").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const artLink = `${siteUrl}/article/${art.id || art.slug || 'autism'}`;
    const artDesc = (art.excerpt || art.content_ar || art.content || "").slice(0, 300).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const artDate = new Date(art.created_at || Date.now()).toUTCString();
    const artImg = art.image || art.imageUrl || "https://asso-amsed.vercel.app/logo-512.png";

    return `
    <item>
      <title>${artTitle}</title>
      <link>${artLink}</link>
      <guid isPermaLink="true">${artLink}</guid>
      <description>${artDesc}</description>
      <pubDate>${artDate}</pubDate>
      <category>التوحد والطفولة</category>
      <dc:creator>أطر جمعية AMSED القنيطرة</dc:creator>
      <media:content url="${artImg}" medium="image" />
    </item>`;
  }).join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/" 
  xmlns:atom="http://www.w3.org/2005/Atom" 
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>جمعية المبادرة المغربية للتعاون والتكافل - AMSED | أخبار ومقالات التوحد</title>
    <link>${siteUrl}</link>
    <description>مقالات ودلائل توجيهية متخصصة في رعاية أطفال التوحد والطفولة في وضعية صعبة بالقنيطرة والمغرب.</description>
    <language>ar-ma</language>
    <lastBuildDate>${nowRss}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/logo-512.png</url>
      <title>جمعية AMSED القنيطرة</title>
      <link>${siteUrl}</link>
    </image>
    ${itemsXml}
  </channel>
</rss>`;

  return res.status(200).send(rssFeed.trim());
}
