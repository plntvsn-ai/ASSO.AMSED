'use client'

import { useEffect, useState } from 'react'

export default function AdvancedSettingsPage() {
  const [s, setS] = useState<any>({
    seo_title: 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة | AMSED القنيطرة',
    seo_description: 'جمعية المبادرة المغربية للتكافل والتعاون AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدمج المدرسي والمواكبة النفسية.',
    seo_keywords: 'أطفال التوحد, القنيطرة, الساكنية, ترويض طبي, تقويم النطق, دمج مدرسي AVS, جمعية AMSED, مواكبة نفسية',
    og_image: 'https://asso-amsed.vercel.app/logo.jpg',
    robots_txt: 'User-agent: *\nAllow: /\nSitemap: https://asso-amsed.vercel.app/api/seo/sitemap',
    google_verification: 'kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14',
    google_analytics: 'G-XXXXXXXXXX',
    gtm: '',
    gtm_id: '',
    custom_head: '',
    footer_scripts: '',
    geo_lat: '34.2610',
    geo_lng: '-6.5802',
    geo_city: 'Kenitra',
    geo_region: 'MA-KEN',
    geo_country: 'Morocco',
    hreflang: 'ar-MA, fr-MA'
  })

  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    try {
      const cached = localStorage.getItem('advanced_settings')
      if (cached) setS((prev: any) => ({ ...prev, ...JSON.parse(cached) }))
    } catch {}

    fetch('/api/advanced-settings')
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === 'object') {
          setS((prev: any) => ({
            ...prev,
            ...d,
            google_verification: d.google_verification || 'kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14'
          }))
          try { localStorage.setItem('advanced_settings', JSON.stringify(d)) } catch {}
        }
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    const payload = {
      ...s,
      gtm_id: s.gtm || s.gtm_id,
      gtm: s.gtm || s.gtm_id,
      google_verification: s.google_verification || 'kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14'
    }

    try { localStorage.setItem('advanced_settings', JSON.stringify(payload)) } catch {}

    try {
      await fetch('/api/advanced-settings', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.warn('Advanced settings save error:', e)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">⚙️ الإعدادات المتقدمة (advanced_settings)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة تهيئة محركات البحث SEO، توثيق Google، وأكواد الرأس والتتبع المحفوظة في Supabase.
          </p>
        </div>
        <a
          href="/admin/settings"
          className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition"
        >
          ← إعدادات الموقع الأساسية
        </a>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        
        {/* SECTION 1: Google Verification & GSR */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🔍</span>
            <span>توثيق Google وأدوات التتبع (GSR)</span>
          </h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              كود التحقق من Google Search Console (google_verification)
            </label>
            <input
              value={s.google_verification || 'kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14'}
              dir="ltr"
              onChange={e => setS({ ...s, google_verification: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
              placeholder="kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14"
            />
            <p className="text-[11px] text-slate-400">
              يتم حقن هذا الكود تلقائياً في الوسم <code>&lt;meta name="google-site-verification" content="..."&gt;</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Google Analytics 4 ID (google_analytics)
              </label>
              <input
                value={s.google_analytics || ''}
                dir="ltr"
                onChange={e => setS({ ...s, google_analytics: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Google Tag Manager ID (gtm)
              </label>
              <input
                value={s.gtm || s.gtm_id || ''}
                dir="ltr"
                onChange={e => setS({ ...s, gtm: e.target.value, gtm_id: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SEO Meta Tags */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🌐</span>
            <span>تحسين محركات البحث SEO و OpenGraph</span>
          </h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">عنوان محركات البحث (seo_title)</label>
            <input
              value={s.seo_title || ''}
              onChange={e => setS({ ...s, seo_title: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="عنوان الموقع لمحركات البحث..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">الوصف الميتا (seo_description)</label>
            <textarea
              rows={2}
              value={s.seo_description || ''}
              onChange={e => setS({ ...s, seo_description: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              placeholder="وصف مختصر للموقع..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">الكلمات المفتاحية (seo_keywords)</label>
              <input
                value={s.seo_keywords || ''}
                onChange={e => setS({ ...s, seo_keywords: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                placeholder="أطفال التوحد, القنيطرة..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">صورة المشاركة (og_image)</label>
              <input
                value={s.og_image || ''}
                dir="ltr"
                onChange={e => setS({ ...s, og_image: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
                placeholder="https://asso-amsed.vercel.app/logo.jpg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">محتوى ملف robots.txt</label>
            <textarea
              rows={2}
              dir="ltr"
              value={s.robots_txt || ''}
              onChange={e => setS({ ...s, robots_txt: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
              placeholder="User-agent: *..."
            />
          </div>
        </div>

        {/* SECTION 3: Custom Head & Footer Scripts */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>💻</span>
            <span>السكريبتات المخصصة (Custom Head & Footer Scripts)</span>
          </h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">أكواد الرأس المخصصة (custom_head)</label>
            <textarea
              rows={3}
              dir="ltr"
              value={s.custom_head || ''}
              onChange={e => setS({ ...s, custom_head: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
              placeholder="<!-- Any custom meta tags or scripts for <head> -->"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">أكواد الفوتر المخصصة (footer_scripts)</label>
            <textarea
              rows={3}
              dir="ltr"
              value={s.footer_scripts || ''}
              onChange={e => setS({ ...s, footer_scripts: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
              placeholder="<!-- Any custom tracking scripts before </body> -->"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ في Supabase...' : 'حفظ في جدول advanced_settings'}
        </button>

        {saved && (
          <p className="text-emerald-700 bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-center font-bold text-xs animate-fadeIn">
            ✅ تم الحفظ بنجاح في جدول advanced_settings في Supabase وتحديث الموقع
          </p>
        )}

      </div>
    </div>
  )
}
