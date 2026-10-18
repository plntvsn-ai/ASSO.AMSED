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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const supabase = getSupabaseClient();

  // GET: Fetch all published articles
  if (req.method === "GET") {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && Array.isArray(data)) {
          return res.status(200).json({
            success: true,
            source: "supabase",
            articles: data
          });
        }
      }
      return res.status(200).json({
        success: true,
        source: "fallback",
        articles: []
      });
    } catch (err) {
      return res.status(200).json({
        success: false,
        error: err.message,
        articles: []
      });
    }
  }

  // POST: Insert a new article
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }
      body = body || {};

      const fullArticlePayload = {
        title_ar: body.title_ar || body.title || "مقال جديد",
        title_fr: body.title_fr || "",
        title_en: body.title_en || "",
        content_ar: body.content_ar || body.content || "",
        content_fr: body.content_fr || "",
        content_en: body.content_en || "",
        excerpt: body.excerpt || body.excerpt_ar || "",
        image: body.image || body.imageUrl || "",
        imageUrl: body.imageUrl || body.image || "",
        image_alt: body.image_alt || "",
        category: body.category || "التوحد والطفولة",
        author: body.author || "أطر جمعية AMSED",
        slug: body.slug || `article-${Date.now()}`,
        status: body.status || "published"
      };

      if (supabase) {
        let { data, error } = await supabase
          .from("articles")
          .insert(fullArticlePayload)
          .select();

        if (error) {
          // If schema has fewer columns, fallback to core columns
          const basicPayload = {
            title_ar: fullArticlePayload.title_ar,
            title_fr: fullArticlePayload.title_fr,
            title_en: fullArticlePayload.title_en,
            content_ar: fullArticlePayload.content_ar,
            content_fr: fullArticlePayload.content_fr,
            content_en: fullArticlePayload.content_en,
            status: fullArticlePayload.status
          };
          const fallbackRes = await supabase.from("articles").insert(basicPayload).select().catch(() => ({}));
          data = fallbackRes?.data;
          error = fallbackRes?.error;
        }

        return res.status(200).json({
          success: true,
          synced: !error,
          article: data?.[0] || fullArticlePayload
        });
      }

      return res.status(200).json({
        success: true,
        synced: false,
        article: fullArticlePayload
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
