import { supabase } from '@/lib/supabase'

export const defaultSettings: Record<string, any> = {
  id: 1,
  site_title: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
  site_description: "جمعية AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدعم المدرسي AVS، ورشات مهنية، ومواكبة نفسية.",
  association_name: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
  acronym: "AMSED",
  address: "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA",
  address_ar: "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA",
  phone: "06 54 24 05 23",
  phone1: "06 54 24 05 23",
  phone2: "",
  email: "asso.amsed@gmail.com",
  city: "Kenitra",
  lat: "34.2610",
  lng: "-6.5802",
  show_donation: false,
  show_bank: false,
  video_url: "https://www.youtube-nocookie.com/embed/CSwDq9szfj0",
  youtube_url: "https://youtube.com/@association-amesd",
  auto_publish_enabled: true
}

let inMemorySettings = { ...defaultSettings }

export async function GET() {
  try {
    // 1. Try key-value query
    const { data: kvData, error: kvError } = await supabase.from('site_settings').select('*')
    if (!kvError && kvData && kvData.length > 0) {
      // Check if data is in key-value structure
      if (kvData[0].key !== undefined) {
        const merged: Record<string, any> = { ...inMemorySettings }
        kvData.forEach((row: { key: string; value: string }) => {
          if (row.key) {
            let val: any = row.value
            if (val === 'true') val = true
            if (val === 'false') val = false
            merged[row.key] = val
          }
        })
        // normalize aliases
        if (merged.phone1 && !merged.phone) merged.phone = merged.phone1
        if (merged.phone && !merged.phone1) merged.phone1 = merged.phone
        if (merged.address && !merged.address_ar) merged.address_ar = merged.address
        if (merged.address_ar && !merged.address) merged.address = merged.address_ar
        if (merged.site_title && !merged.association_name) merged.association_name = merged.site_title
        inMemorySettings = merged
        return Response.json(inMemorySettings, {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })
      } else if (kvData[0].id !== undefined) {
        // legacy single row structure
        inMemorySettings = { ...inMemorySettings, ...kvData[0] }
        return Response.json(inMemorySettings, {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })
      }
    }
  } catch (err) {
    console.warn('site_settings GET notice:', err)
  }

  return Response.json(inMemorySettings, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    inMemorySettings = { ...inMemorySettings, ...body }

    // Normalize keys
    const phoneVal = body.phone1 || body.phone || inMemorySettings.phone
    const addressVal = body.address || body.address_ar || inMemorySettings.address
    const titleVal = body.site_title || body.association_name || inMemorySettings.site_title

    inMemorySettings.phone = phoneVal
    inMemorySettings.phone1 = phoneVal
    inMemorySettings.address = addressVal
    inMemorySettings.address_ar = addressVal
    inMemorySettings.site_title = titleVal
    inMemorySettings.association_name = titleVal

    // 1. Try Upserting as key-value rows
    const kvRows = Object.entries(body).map(([key, val]) => ({
      key,
      value: String(val ?? ''),
      updated_at: new Date().toISOString()
    }))

    // Add normalized keys
    kvRows.push({ key: 'phone1', value: String(phoneVal), updated_at: new Date().toISOString() })
    kvRows.push({ key: 'address', value: String(addressVal), updated_at: new Date().toISOString() })
    kvRows.push({ key: 'site_title', value: String(titleVal), updated_at: new Date().toISOString() })

    let kvSuccess = false
    try {
      const { error: upsertErr } = await supabase.from('site_settings').upsert(kvRows)
      if (!upsertErr) kvSuccess = true
    } catch {}

    // 2. If table is column-based, update row id:1
    if (!kvSuccess) {
      try {
        await supabase.from('site_settings').upsert({ id: 1, ...body })
      } catch (colErr: any) {
        console.warn('Column-based update notice:', colErr?.message)
      }
    }

    return Response.json(inMemorySettings, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (err: any) {
    return Response.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
