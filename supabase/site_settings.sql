-- ========================================================
-- جدول إعدادات الموقع site_settings في Supabase
-- ========================================================

create table if not exists site_settings (
  id int primary key default 1,
  address_ar text default 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
  address_fr text default 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
  address_en text default 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
  phone text default '06 54 24 05 23',
  show_donation boolean default false,
  show_bank boolean default false,
  updated_at timestamp with time zone default now()
);

-- إدراج السجل الأساسي رقم 1 (id=1)
insert into site_settings (id) 
values (1)
on conflict (id) do nothing;

-- تفعيل Row Level Security (RLS)
alter table site_settings enable row level security;

-- سياسة القراءة للعموم (الموقع يقرأ الإعدادات مباشرة وبدون قيود)
drop policy if exists "public read" on site_settings;
create policy "public read" on site_settings 
  for select 
  using (true);

-- سياسة التعديل والكتابة (للحفظ من لوحة التحكم / API)
drop policy if exists "admin write" on site_settings;
create policy "admin write" on site_settings 
  for all 
  using (true)
  with check (true);

-- ========================================================
-- جدول خزان المواضيع topics_bank
-- ========================================================

create table if not exists topics_bank (
  id serial primary key,
  title text not null,
  used boolean default false,
  created_at timestamp with time zone default now()
);

alter table topics_bank enable row level security;
drop policy if exists "topics_bank read" on topics_bank;
create policy "topics_bank read" on topics_bank for select using (true);
drop policy if exists "topics_bank admin" on topics_bank;
create policy "topics_bank admin" on topics_bank for all using (true) with check (true);

-- إدراج مواضيع أولية في الخزان
insert into topics_bank (title) values
('كيفاش نعلم طفل التوحد يطلب الماء والحاجيات الأساسية'),
('تمارين التخاطب وتقويم النطق للأطفال في المنزل'),
('كيفاش نتعامل مع نوبات الغضب والانهيار عند أطفال التوحد'),
('الدمج المدرسي للأطفال ذوي الاحتياجات الخاصة AVS بالقنيطرة'),
('تنمية المهارات الدقيقة والحركية لأطفال التوحد'),
('أهمية الروتين اليومي في تقليل قلق طفل التوحد'),
('التدخل المبكر وأثره على تطور لغة وتواصل الطفل'),
('التغذية الصحية وعلاقتها براحة طفل التوحد'),
('كيفية التعامل مع الحساسية الحسية والسمعية المفرطة'),
('دور الأسرة والدعم النفسي للأمهات والآباء');

-- ========================================================
-- جدول المقالات articles
-- ========================================================

create table if not exists articles (
  id serial primary key,
  title_ar text,
  title_fr text,
  title_en text,
  content_ar text,
  content_fr text,
  content_en text,
  status text default 'published',
  created_at timestamp with time zone default now()
);

alter table articles enable row level security;
drop policy if exists "articles read" on articles;
create policy "articles read" on articles for select using (true);
drop policy if exists "articles admin" on articles;
create policy "articles admin" on articles for all using (true) with check (true);
