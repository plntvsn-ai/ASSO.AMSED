import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (error || !data) {
        return res.status(200).json(defaultSettings);
      }
      return res.status(200).json(data);
    } catch {
      return res.status(200).json(defaultSettings);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { data, error } = await supabase.from('site_settings').update(body).eq('id', 1).select().single();
      if (error) {
        const { data: upsertData, error: upsertError } = await supabase
          .from('site_settings')
          .upsert({ id: 1, ...body })
          .select()
          .single();
        if (upsertError) return res.status(500).json({ error: upsertError });
        return res.status(200).json(upsertData);
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
