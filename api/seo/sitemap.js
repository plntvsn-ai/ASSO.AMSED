import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asso-amsed.vercel.app'
  const today = new Date().toISOString().split('T')[0]

  let articles = []
  try {
    const { data } = await supabase
      .from('articles')
      .select('id, created_at, status')
      .order('id', { ascending: false })
      .limit(100)
    if (data) articles = data
  } catch (err) {
    console.warn('Sitemap article fetch notice:', err)
  }

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/articles`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
  ]

  const articleUrls = articles.map(a => ({
    loc: `${baseUrl}/article/${a.id}`,
    lastmod: a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : today,
    priority: '0.7',
    changefreq: 'weekly'
  }))

  const allUrls = [...staticUrls, ...articleUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')
  return res.status(200).send(xml)
}
