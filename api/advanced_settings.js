import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const defaultAdvancedSettings = {
  seo_title: 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة | AMSED القنيطرة',
  seo_description: 'جمعية المبادرة المغربية للتكافل والتعاون AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدمج المدرسي والمواكبة النفسية.',
  seo_keywords: 'أطفال التوحد, القنيطرة, الساكنية, ترويض طبي, تقويم النطق, دمج مدرسي AVS, جمعية AMSED, مواكبة نفسية',
  og_image: 'https://asso-amsed.vercel.app/logo.jpg',
  robots_txt: 'User-agent: *\nAllow: /\nSitemap: https://asso-amsed.vercel.app/api/seo/sitemap',
  sitemap_enabled: 'true',
  google_analytics: 'G-XXXXXXXXXX',
  google_verification: '',
  gtm_id: '',
  search_console: '',
  geo_lat: '34.2610',
  geo_lng: '-6.5802',
  geo_city: 'Kenitra',
  geo_region: 'MA-KEN',
  geo_country: 'Morocco',
  hreflang: 'ar-MA, fr-MA'
};

let inMemorySettings = { ...defaultAdvancedSettings };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('advanced_settings').select('*');
      if (!error && data && data.length > 0) {
        const merged = { ...inMemorySettings };
        data.forEach((row) => {
          if (row.key) merged[row.key] = row.value ?? '';
        });
        inMemorySettings = merged;
      }
      return res.status(200).json(inMemorySettings);
    } catch {
      return res.status(200).json(inMemorySettings);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      inMemorySettings = { ...inMemorySettings, ...body };

      const rows = Object.entries(body).map(([key, value]) => {
        let category = 'seo';
        if (key.startsWith('google') || key === 'gtm_id' || key === 'search_console') category = 'google';
        else if (key.startsWith('geo_') || key === 'hreflang') category = 'geo';
        return {
          key,
          value: String(value ?? ''),
          category,
          updated_at: new Date().toISOString()
        };
      });

      if (rows.length > 0) {
        try {
          await supabase.from('advanced_settings').upsert(rows);
        } catch (sbErr) {
          console.warn('Supabase advanced_settings upsert notice:', sbErr.message);
        }
      }

      return res.status(200).json(inMemorySettings);
    } catch (err) {
      return res.status(500).json({ error: err?.message || 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
