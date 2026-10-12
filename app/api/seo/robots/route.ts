import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asso-amsed.vercel.app'
  let robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/api/seo/sitemap`

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

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400'
    }
  })
}
