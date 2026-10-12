import { supabase } from '@/lib/supabase'

export const defaultSettings = {
  id: 1,
  association_name: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
  acronym: "AMSED",
  legal_deposit: "376.58.1",
  address: "SAKNIA 30 LOT EL HIZAM N° D Kénitra",
  phone: "06 54 24 05 23",
  email: "asso.amsed@gmail.com",
  video_url: "https://www.youtube-nocookie.com/embed/CSwDq9szfj0",
  youtube_url: "https://youtube.com/@association-amesd",
  auto_publish_enabled: true
}

export async function GET() {
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    if (error || !data) {
      return Response.json(defaultSettings)
    }
    return Response.json(data)
  } catch {
    return Response.json(defaultSettings)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, error } = await supabase.from('site_settings').update(body).eq('id', 1).select().single()
    if (error) {
      const { data: upsertData, error: upsertError } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...body })
        .select()
        .single()
      if (upsertError) return Response.json({ error: upsertError }, { status: 500 })
      return Response.json(upsertData)
    }
    return Response.json(data)
  } catch (err: any) {
    return Response.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
