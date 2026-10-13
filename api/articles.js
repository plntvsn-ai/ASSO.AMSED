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

      const articlePayload = {
        title_ar: body.title_ar || body.title || "مقال جديد",
        title_fr: body.title_fr || "",
        title_en: body.title_en || "",
        content_ar: body.content_ar || body.content || "",
        content_fr: body.content_fr || "",
        content_en: body.content_en || "",
        status: body.status || "published"
      };

      if (supabase) {
        const { data, error } = await supabase
          .from("articles")
          .insert(articlePayload)
          .select();

        if (error) {
          console.warn("Supabase insert article notice:", error);
        }

        return res.status(200).json({
          success: true,
          synced: !error,
          article: data?.[0] || articlePayload
        });
      }

      return res.status(200).json({
        success: true,
        synced: false,
        article: articlePayload
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
