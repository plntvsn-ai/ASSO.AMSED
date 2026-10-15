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

const FALLBACK_EDUCATIONAL_NEWS = [
  {
    id: "news-edu-1",
    title: "إطلاق برنامج التربية الدامجة وتأهيل أطفال التوحد بجهة الرباط سلا القنيطرة",
    titleAr: "إطلاق برنامج التربية الدامجة وتأهيل أطفال التوحد بجهة الرباط سلا القنيطرة",
    source: "وزارة التربية الوطنية والتعليم الأولي",
    formattedDate: "2026-10-14",
    link: "https://www.men.gov.ma",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    readTime: "3 دقائق"
  },
  {
    id: "news-edu-2",
    title: "توسيع شبكة أقسام التعليم الأولي المكيف وتعزيز مواكبة أطر AVS بالمغرب",
    titleAr: "توسيع شبكة أقسام التعليم الأولي المكيف وتعزيز مواكبة أطر AVS بالمغرب",
    source: "وكالة المغرب العربي للأنباء",
    formattedDate: "2026-10-13",
    link: "https://www.mapnews.ma",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    readTime: "4 دقائق"
  },
  {
    id: "news-edu-3",
    title: "مبادرات التكافل الاجتماعي لدعم تمدرس الأطفال في وضعية صعبة بالقنيطرة",
    titleAr: "مبادرات التكافل الاجتماعي لدعم تمدرس الأطفال في وضعية صعبة بالقنيطرة",
    source: "أطر جمعية AMSED",
    formattedDate: "2026-10-12",
    link: "/announcements",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    readTime: "3 دقائق"
  },
  {
    id: "news-edu-4",
    title: "ورشات تدريبية متخصصة للأمهات والآباء لتطوير مهارات التواصل الأسري",
    titleAr: "ورشات تدريبية متخصصة للأمهات والآباء لتطوير مهارات التواصل الأسري",
    source: "المركز الوطني للتأهيل التربوي",
    formattedDate: "2026-10-11",
    link: "/services",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    readTime: "5 دقائق"
  }
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && Array.isArray(data) && data.length > 0) {
        const mappedArticles = data.map(item => ({
          id: item.id || `art-${Date.now()}`,
          title: item.title_ar || item.title || "مستجدات الجمعية",
          titleAr: item.title_ar || item.title || "مستجدات الجمعية",
          source: item.author && !item.author.includes('روبوت') ? item.author : "أطر جمعية AMSED",
          formattedDate: (item.created_at || new Date().toISOString()).split("T")[0],
          link: `/article/${item.id}`,
          isInternal: true,
          image: item.image || item.imageUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
          readTime: "3 دقائق"
        }));

        return res.status(200).json({
          success: true,
          news: [...mappedArticles, ...FALLBACK_EDUCATIONAL_NEWS]
        });
      }
    } catch (e) {
      console.warn("Supabase news query notice:", e);
    }
  }

  return res.status(200).json({
    success: true,
    news: FALLBACK_EDUCATIONAL_NEWS
  });
}
