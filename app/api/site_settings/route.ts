import { supabase } from '@/lib/supabase'

export const defaultSettings = {
  id: 1,
  address_ar: "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA",
  phone: "06 54 24 05 23",
  show_donation: false,
  show_bank: false,
  association_name: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
  acronym: "AMSED",
  address: "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA",
  email: "asso.amsed@gmail.com",
  video_url: "https://www.youtube-nocookie.com/embed/CSwDq9szfj0",
  youtube_url: "https://youtube.com/@association-amesd",
  auto_publish_enabled: true
}

let inMemorySettings = { ...defaultSettings }

export async function GET() {
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    if (!error && data) {
      inMemorySettings = { ...inMemorySettings, ...data }
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

    try {
      const { data, error } = await supabase.from('site_settings').update(body).eq('id', 1).select().single()
      if (error) {
        await supabase.from('site_settings').upsert({ id: 1, ...body })
      } else if (data) {
        inMemorySettings = { ...inMemorySettings, ...data }
      }
    } catch (sbErr: any) {
      console.warn('Supabase update notice:', sbErr?.message)
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
