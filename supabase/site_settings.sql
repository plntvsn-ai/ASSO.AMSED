-- ========================================================
-- جدول إعدادات الموقع site_settings في Supabase
-- ========================================================

create table if not exists site_settings (
  id int primary key default 1,
  address_ar text default 'SAKNIA 30 LOT EL HIZAM N° D 376.58.1 Kénitra',
  address_fr text default 'SAKNIA 30 LOT EL HIZAM N° D 376.58.1 Kénitra',
  address_en text default 'SAKNIA 30 LOT EL HIZAM N° D 376.58.1 Kenitra',
  phone text default '06 23 05 24 54 06',
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
