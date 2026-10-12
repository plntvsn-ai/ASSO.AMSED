-- ========================================================
-- جدول الإعدادات المتقدمة advanced_settings في Supabase
-- ========================================================

create table if not exists advanced_settings (
  key text primary key,
  value text,
  category text,
  updated_at timestamp with time zone default now()
);

-- تفعيل Row Level Security (RLS)
alter table advanced_settings enable row level security;

-- سياسة القراءة للجميع
drop policy if exists "advanced_settings read" on advanced_settings;
create policy "advanced_settings read" on advanced_settings 
  for select 
  using (true);

-- سياسة الكتابة والتعديل للـ API والمدير
drop policy if exists "advanced_settings write" on advanced_settings;
create policy "advanced_settings write" on advanced_settings 
  for all 
  using (true) 
  with check (true);

-- إدراج القيم الافتراضية الأولية (Upsert)
insert into advanced_settings (key, value, category) values
  -- SEO
  ('seo_title', 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة | AMSED القنيطرة', 'seo'),
  ('seo_description', 'جمعية المبادرة المغربية للتكافل والتعاون AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدمج المدرسي والمواكبة النفسية.', 'seo'),
  ('seo_keywords', 'أطفال التوحد, القنيطرة, الساكنية, ترويض طبي, تقويم النطق, دمج مدرسي AVS, جمعية AMSED, مواكبة نفسية', 'seo'),
  ('og_image', 'https://asso-amsed.vercel.app/logo.jpg', 'seo'),
  ('robots_txt', E'User-agent: *\nAllow: /\nSitemap: https://asso-amsed.vercel.app/api/seo/sitemap', 'seo'),
  ('sitemap_enabled', 'true', 'seo'),

  -- Google GSR (Google Search & Reporting)
  ('google_analytics', 'G-XXXXXXXXXX', 'google'),
  ('google_verification', 'kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14', 'google'),
  ('gtm_id', '', 'google'),
  ('search_console', '', 'google'),

  -- GEO (Local SEO)
  ('geo_lat', '34.2610', 'geo'),
  ('geo_lng', '-6.5802', 'geo'),
  ('geo_city', 'Kenitra', 'geo'),
  ('geo_region', 'MA-KEN', 'geo'),
  ('geo_country', 'Morocco', 'geo'),
  ('hreflang', 'ar-MA, fr-MA', 'geo')

on conflict (key) do nothing;
