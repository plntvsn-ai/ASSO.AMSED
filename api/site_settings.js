import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const defaultSettings = {
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const { data: kvData, error: kvError } = await supabase.from('site_settings').select('*')
      if (!kvError && kvData && kvData.length > 0) {
        if (kvData[0].key !== undefined) {
          const merged = { ...inMemorySettings }
          kvData.forEach((row) => {
            if (row.key) {
              let val = row.value
              if (val === 'true') val = true
              if (val === 'false') val = false
              merged[row.key] = val
            }
          })
          if (merged.phone1 && !merged.phone) merged.phone = merged.phone1
          if (merged.phone && !merged.phone1) merged.phone1 = merged.phone
          if (merged.address && !merged.address_ar) merged.address_ar = merged.address
          if (merged.address_ar && !merged.address) merged.address = merged.address_ar
          if (merged.site_title && !merged.association_name) merged.association_name = merged.site_title
          inMemorySettings = merged
          return res.status(200).json(inMemorySettings)
        } else if (kvData[0].id !== undefined) {
          inMemorySettings = { ...inMemorySettings, ...kvData[0] }
          return res.status(200).json(inMemorySettings)
        }
      }
    } catch (err) {
      console.warn('site_settings GET notice:', err)
    }
    return res.status(200).json(inMemorySettings)
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
      inMemorySettings = { ...inMemorySettings, ...body }

      const phoneVal = body.phone1 || body.phone || inMemorySettings.phone
      const addressVal = body.address || body.address_ar || inMemorySettings.address
      const titleVal = body.site_title || body.association_name || inMemorySettings.site_title

      inMemorySettings.phone = phoneVal
      inMemorySettings.phone1 = phoneVal
      inMemorySettings.address = addressVal
      inMemorySettings.address_ar = addressVal
      inMemorySettings.site_title = titleVal
      inMemorySettings.association_name = titleVal

      const kvRows = Object.entries(body).map(([key, val]) => ({
        key,
        value: String(val ?? ''),
        updated_at: new Date().toISOString()
      }))

      kvRows.push({ key: 'phone1', value: String(phoneVal), updated_at: new Date().toISOString() })
      kvRows.push({ key: 'address', value: String(addressVal), updated_at: new Date().toISOString() })
      kvRows.push({ key: 'site_title', value: String(titleVal), updated_at: new Date().toISOString() })

      let kvSuccess = false
      try {
        const { error: upsertErr } = await supabase.from('site_settings').upsert(kvRows)
        if (!upsertErr) kvSuccess = true
      } catch {}

      if (!kvSuccess) {
        try {
          await supabase.from('site_settings').upsert({ id: 1, ...body })
        } catch (colErr) {
          console.warn('Column-based update notice:', colErr?.message)
        }
      }

      return res.status(200).json(inMemorySettings)
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
