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
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  const siteUrl = "https://asso-amsed.vercel.app";
  const now = new Date().toISOString().split("T")[0];

  const staticPages = [
    { loc: `${siteUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${siteUrl}/articles`, changefreq: "daily", priority: "0.9" },
    { loc: `${siteUrl}/services`, changefreq: "weekly", priority: "0.85" },
    { loc: `${siteUrl}/about`, changefreq: "monthly", priority: "0.8" },
    { loc: `${siteUrl}/contact`, changefreq: "monthly", priority: "0.8" },
    { loc: `${siteUrl}/videos`, changefreq: "weekly", priority: "0.75" },
    { loc: `${siteUrl}/gallery`, changefreq: "weekly", priority: "0.7" },
    { loc: `${siteUrl}/donation`, changefreq: "monthly", priority: "0.75" },
  ];

  let articles = [];
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, created_at, title_ar")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && Array.isArray(data)) {
        articles = data;
      }
    } catch (e) {
      console.warn("Sitemap supabase fetch notice:", e);
    }
  }

  const staticXml = staticPages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("");

  const articlesXml = articles.map(art => {
    const artLink = `${siteUrl}/article/${art.id || art.slug}`;
    const artDate = (art.created_at || now).split("T")[0];
    return `
  <url>
    <loc>${artLink}</loc>
    <lastmod>${artDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join("");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${staticXml}
  ${articlesXml}
</urlset>`;

  return res.status(200).send(sitemapXml.trim());
}
