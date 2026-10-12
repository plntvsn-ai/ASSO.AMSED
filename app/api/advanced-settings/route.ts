import { supabase } from '@/lib/supabase'

export const defaultAdvancedSettings: Record<string, string> = {
  seo_title: 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة | AMSED القنيطرة',
  seo_description: 'جمعية المبادرة المغربية للتكافل والتعاون AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدمج المدرسي والمواكبة النفسية.',
  seo_keywords: 'أطفال التوحد, القنيطرة, الساكنية, ترويض طبي, تقويم النطق, دمج مدرسي AVS, جمعية AMSED, مواكبة نفسية',
  og_image: 'https://asso-amsed.vercel.app/logo.jpg',
  robots_txt: 'User-agent: *\nAllow: /\nSitemap: https://asso-amsed.vercel.app/api/seo/sitemap',
  sitemap_enabled: 'true',
  google_analytics: 'G-XXXXXXXXXX',
  google_verification: 'kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14',
  gtm_id: '',
  search_console: '',
  geo_lat: '34.2610',
  geo_lng: '-6.5802',
  geo_city: 'Kenitra',
  geo_region: 'MA-KEN',
  geo_country: 'Morocco',
  hreflang: 'ar-MA, fr-MA'
}

let inMemorySettings = { ...defaultAdvancedSettings }

export async function GET() {
  try {
    const { data, error } = await supabase.from('advanced_settings').select('*')
    if (!error && data && data.length > 0) {
      const merged = { ...inMemorySettings }
      data.forEach((row: { key: string; value: string }) => {
        if (row.key) merged[row.key] = row.value ?? ''
      })
      inMemorySettings = merged
    }
    return Response.json(inMemorySettings, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch {
    return Response.json(inMemorySettings, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    inMemorySettings = { ...inMemorySettings, ...body }

    // Upsert into supabase
    const rows = Object.entries(body).map(([key, value]) => {
      let category = 'seo'
      if (key.startsWith('google') || key === 'gtm_id' || key === 'search_console') category = 'google'
      else if (key.startsWith('geo_') || key === 'hreflang') category = 'geo'
      return {
        key,
        value: String(value ?? ''),
        category,
        updated_at: new Date().toISOString()
      }
    })

    if (rows.length > 0) {
      try {
        await supabase.from('advanced_settings').upsert(rows)
      } catch (sbErr: any) {
        console.warn('Supabase advanced_settings upsert error:', sbErr?.message)
      }
    }

    return Response.json(inMemorySettings, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (err: any) {
    return Response.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
