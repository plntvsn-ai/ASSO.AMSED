import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""
  ).trim().replace(/\/+$/, "");

  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  ).trim();

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("xyzcompany") && !supabaseUrl.includes("placeholder")) {
    return createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      db: { schema: "public" }
    });
  }
  return null;
}

const DEFAULT_ADVANCED_SETTINGS = {
  site_title_ar: 'جمعية المبادرة المغربية للتكافل والتعاون - AMSED القنيطرة',
  site_title_fr: 'AMSED - Association Initiative Marocaine',
  site_title_en: 'AMSED - Moroccan Initiative Association',
  meta_description_ar: 'الجمعية الرائدة في رعاية وتأهيل أطفال التوحد وفي وضعية صعبة بالقنيطرة - ترويض، تخاطب، وإدماج مدرسي.',
  meta_description_fr: 'Association marocaine pour la prise en charge des enfants autistes à Kénitra.',
  meta_description_en: 'Moroccan non-profit association for autism care and special education in Kenitra.',
  keywords_ar: 'توحد، أطفال، القنيطرة، رعاية، تأهيل، تربية خاصة، المغرب، AMSED',
  keywords_fr: 'autisme, enfants, kénitra, maroc, éducation spécialisée, AMSED',
  keywords_en: 'autism, children, kenitra, morocco, special education, AMSED',
  facebook_url: 'https://facebook.com/association.amsed',
  instagram_url: 'https://instagram.com/association_amsed',
  youtube_url: 'https://youtube.com/@association-amesd',
  google_site_verification: 'google474987270931ac4d',
  geo_lat: '34.250676',
  geo_lng: '-6.540316',
  geo_placename: 'Kénitra, Morocco',
  geo_region: 'MA-KEN',
  geo_country: 'Morocco',
  hreflang: 'ar-MA, fr-MA'
};

let inMemoryAdvancedSettings = { ...DEFAULT_ADVANCED_SETTINGS };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = getSupabaseClient();

  if (req.method === 'GET') {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('advanced_settings').select('*').eq('id', 1).single();
        if (!error && data) {
          inMemoryAdvancedSettings = { ...inMemoryAdvancedSettings, ...data };
          return res.status(200).json(inMemoryAdvancedSettings);
        }
      } catch (e) {
        console.warn('Supabase load advanced_settings notice:', e);
      }
    }
    return res.status(200).json(inMemoryAdvancedSettings);
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch {}
      }

      inMemoryAdvancedSettings = {
        ...inMemoryAdvancedSettings,
        ...(body || {}),
        updated_at: new Date().toISOString()
      };

      if (supabase) {
        try {
          const { id, ...dataToSave } = inMemoryAdvancedSettings;
          await supabase.from('advanced_settings').upsert({ id: 1, ...dataToSave });
        } catch (e) {
          console.warn('Supabase upsert advanced_settings notice:', e);
        }
      }

      return res.status(200).json({ success: true, data: inMemoryAdvancedSettings });
    } catch (err) {
      return res.status(200).json({ success: true, warning: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
