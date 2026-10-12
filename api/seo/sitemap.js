import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asso-amsed.vercel.app'
  const today = new Date().toISOString().split('T')[0]

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/services`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/articles`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/donate`, priority: '0.8', changefreq: 'weekly' },
  ]

  let articleUrls = []
  try {
    const { data } = await supabase
      .from('articles')
      .select('slug, id, created_at, published')
      .limit(100)
    if (data && data.length > 0) {
      articleUrls = data.map(a => ({
        loc: `${baseUrl}/articles/${a.slug || a.id}`,
        lastmod: a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : today,
        priority: '0.7',
        changefreq: 'weekly'
      }))
    }
  } catch (err) {
    console.warn('Sitemap article fetch notice:', err)
  }

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
