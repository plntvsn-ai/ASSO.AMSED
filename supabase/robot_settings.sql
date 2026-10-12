create table if not exists robot_settings (
  id text primary key,
  name text,
  name_ar text,
  enabled boolean default true,
  cron_time text default '09:00',
  prompt_template text,
  config jsonb default '{}',
  last_run timestamptz,
  status text default 'idle'
);

insert into robot_settings (id, name, name_ar, enabled, prompt_template) values
('master', 'master', '🤖 الماستر - القائد', true, 'كتب مقال 800 كلمة عن التنمية المستدامة في المغرب، بأسلوب صحفي مغربي بسيط، مع لمسة دارجة خفيفة، واذكر جمعية أمسي AMSED الدار البيضاء'),
('seo_linking', 'seo_linking', '🔗 روبوت الربط الداخلي', true, 'اختار 3 مقالات مشابهة للربط'),
('seo_schema', 'seo_schema', '⭐ روبوت النجوم والـ Schema', true, 'schema with aggregateRating 4.8'),
('seo_refresher', 'seo_refresher', '♻️ روبوت تحديث القديم', true, 'كل جمعة جدد مقال قديم بفقرة 2026'),
('facebook', 'facebook', '📘 روبوت فايسبوك', true, '{"token_env": "FB_TOKEN"}'),
('instagram', 'instagram', '📸 روبوت انستغرام', false, '{"token_env": "IG_TOKEN"}'),
('image_alt', 'image_alt', '📸 روبوت وصف الصور ALT', true, 'alt="جمعية امسد..."')
on conflict (id) do nothing;
