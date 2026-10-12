import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  let robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml`

  try {
    const { data } = await supabase
      .from('advanced_settings')
      .select('value')
      .eq('key', 'robots_txt')
      .single()
    if (data?.value) {
      robotsTxt = data.value
    }
  } catch (err) {
    console.warn('Robots fetch notice:', err)
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400')
  return res.status(200).send(robotsTxt)
}
