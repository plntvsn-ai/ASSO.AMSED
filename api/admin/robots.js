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

const DEFAULT_ROBOTS = [
  { id: 'boss', name: 'boss', name_ar: '👔 المدير العام - الشاف', enabled: true, cron_time: '*/30 * * * *', prompt_template: 'مراقبة كافة الروبوتات وتنسيق النشر التلقائي ومنع التكرار', status: 'idle', is_boss: true },
  { id: 'master', name: 'master', name_ar: '🤖 الماستر - القائد', enabled: true, cron_time: '09:00', prompt_template: 'كتب مقال عن التوحد عند الأطفال لجمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED القنيطرة', status: 'idle' },
  { id: 'seo_linking', name: 'seo_linking', name_ar: '🔗 روبوت الربط الداخلي', enabled: true, cron_time: '09:00', prompt_template: 'اختار 3 مقالات مشابهة للربط', status: 'idle' },
  { id: 'seo_schema', name: 'seo_schema', name_ar: '⭐ روبوت النجوم والـ Schema', enabled: true, cron_time: '09:00', prompt_template: 'schema with aggregateRating 4.8', status: 'idle' },
  { id: 'seo_refresher', name: 'seo_refresher', name_ar: '♻️ روبوت تحديث القديم', enabled: true, cron_time: '09:00', prompt_template: 'كل جمعة جدد مقال قديم بفقرة 2026', status: 'idle' },
  { id: 'facebook', name: 'facebook', name_ar: '📘 روبوت فايسبوك', enabled: true, cron_time: '09:00', prompt_template: '{"token_env": "FB_TOKEN"}', status: 'idle' },
  { id: 'instagram', name: 'instagram', name_ar: '📸 روبوت انستغرام', enabled: false, cron_time: '09:00', prompt_template: '{"token_env": "IG_TOKEN"}', status: 'idle' },
  { id: 'image_alt', name: 'image_alt', name_ar: '📸 روبوت وصف الصور ALT', enabled: true, cron_time: '09:00', prompt_template: 'alt="جمعية امسد..."', status: 'idle' }
];

let inMemoryRobots = [...DEFAULT_ROBOTS];

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
        const { data, error } = await supabase.from('robot_settings').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          return res.status(200).json(data);
        }
      } catch (e) {
        console.warn('Supabase robots load notice:', e);
      }
    }
    return res.status(200).json(inMemoryRobots);
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch {}
      }

      if (Array.isArray(body)) {
        inMemoryRobots = body;

        if (supabase) {
          try {
            await supabase.from('robot_settings').upsert(body);
          } catch (e) {
            console.warn('Supabase robots upsert notice:', e);
          }
        }
      }

      return res.status(200).json({ success: true, count: inMemoryRobots.length });
    } catch (err) {
      return res.status(200).json({ success: true, warning: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
