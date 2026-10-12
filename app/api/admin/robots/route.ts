import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const DEFAULT_ROBOTS = [
  { id: 'master', name: 'master', name_ar: '🤖 الماستر - القائد', enabled: true, cron_time: '09:00', prompt_template: 'كتب مقال 800 كلمة عن التنمية المستدامة ورعاية الأطفال في المغرب، بأسلوب صحفي مغربي بسيط، مع لمسة دارجة خفيفة، واذكر جمعية أمسي AMSED الدار البيضاء', status: 'idle' },
  { id: 'seo_linking', name: 'seo_linking', name_ar: '🔗 روبوت الربط الداخلي', enabled: true, cron_time: '09:00', prompt_template: 'اختار 3 مقالات مشابهة للربط', status: 'idle' },
  { id: 'seo_schema', name: 'seo_schema', name_ar: '⭐ روبوت النجوم والـ Schema', enabled: true, cron_time: '09:00', prompt_template: 'schema with aggregateRating 4.8', status: 'idle' },
  { id: 'seo_refresher', name: 'seo_refresher', name_ar: '♻️ روبوت تحديث القديم', enabled: true, cron_time: '09:00', prompt_template: 'كل جمعة جدد مقال قديم بفقرة 2026', status: 'idle' },
  { id: 'facebook', name: 'facebook', name_ar: '📘 روبوت فايسبوك', enabled: true, cron_time: '09:00', prompt_template: '{"token_env": "FB_TOKEN"}', status: 'idle' },
  { id: 'instagram', name: 'instagram', name_ar: '📸 روبوت انستغرام', enabled: false, cron_time: '09:00', prompt_template: '{"token_env": "IG_TOKEN"}', status: 'idle' },
  { id: 'image_alt', name: 'image_alt', name_ar: '📸 روبوت وصف الصور ALT', enabled: true, cron_time: '09:00', prompt_template: 'alt="جمعية امسد..."', status: 'idle' }
];

let inMemoryRobots = [...DEFAULT_ROBOTS];

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getClient();
    const { data, error } = await supabase.from('robot_settings').select('*');
    if (!error && data && data.length > 0) {
      // Merge with defaults so all robots exist
      const existingIds = new Set(data.map((r: any) => r.id));
      const merged = [
        ...data,
        ...DEFAULT_ROBOTS.filter(r => !existingIds.has(r.id))
      ];
      inMemoryRobots = merged;
      return Response.json(merged);
    }
  } catch {}
  return Response.json(inMemoryRobots);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updates = Array.isArray(body) ? body : [body];
    const supabase = getClient();

    for (const item of updates) {
      const idx = inMemoryRobots.findIndex(r => r.id === item.id);
      if (idx !== -1) {
        inMemoryRobots[idx] = { ...inMemoryRobots[idx], ...item };
      } else {
        inMemoryRobots.push(item);
      }
    }

    try {
      await supabase.from('robot_settings').upsert(updates);
    } catch (e: any) {
      console.warn('Supabase robot_settings upsert notice:', e?.message);
    }

    return Response.json({ success: true, robots: inMemoryRobots });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
