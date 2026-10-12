import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  const logs: string[] = [];
  const now = new Date().toISOString();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: robots } = await supabase.from('robot_settings').select('*');

    const boss = robots?.find((r: any) => r.id === 'boss');
    if (boss && boss.enabled === false) {
      return Response.json({ skipped: 'Boss is disabled' });
    }

    if (robots && robots.length > 0) {
      for (const robot of robots) {
        if (robot.id === 'boss') continue;
        if (robot.status === 'error') {
          logs.push(`🚨 تم رصد عطب في الروبوت ${robot.name_ar || robot.id} - تمت إعادة التشغيل الذاتي`);
          await supabase.from('robot_settings').update({
            status: 'idle',
            retry_count: (robot.retry_count || 0) + 1
          }).eq('id', robot.id);
        }
      }
    }

    logs.push(`✅ جولة الشاف المجدولة انتهت بنجاح في ${now}`);

    try {
      await supabase.from('robot_settings').update({
        last_run: now,
        status: 'idle'
      }).eq('id', 'boss');
    } catch {}

    return Response.json({
      success: true,
      role: 'Boss Orchestrator',
      checked_at: now,
      logs
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
