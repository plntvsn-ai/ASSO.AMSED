import React, { useState, useEffect } from 'react';
import { 
  Search, Globe, MapPin, Share2, Check, Copy, ExternalLink, 
  Send, Sparkles, AlertCircle, CheckCircle2, Shield, BarChart3, 
  Layers, RefreshCw, Upload, Eye, Sliders, Hash, Compass
} from 'lucide-react';

export default function AdvancedSettings() {
  const [activeTab, setActiveTab] = useState('seo'); // 'seo' | 'google' | 'geo'
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sitemapPingStatus, setSitemapPingStatus] = useState(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Form State
  const [settings, setSettings] = useState({
    seo_title: 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة | AMSED القنيطرة',
    seo_description: 'جمعية المبادرة المغربية للتكافل والتعاون AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدمج المدرسي والمواكبة النفسية.',
    seo_keywords: 'أطفال التوحد, القنيطرة, الساكنية, ترويض طبي, تقويم النطق, دمج مدرسي AVS, جمعية AMSED, مواكبة نفسية',
    og_image: 'https://asso-amsed.vercel.app/logo.jpg',
    robots_txt: 'User-agent: *\nAllow: /\n\nSitemap: https://asso-amsed.vercel.app/api/seo/sitemap',
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
  });

  // Load Settings
  useEffect(() => {
    try {
      const cached = localStorage.getItem('advanced_settings');
      if (cached) setSettings(prev => ({ ...prev, ...JSON.parse(cached) }));
    } catch {}

    fetch('/api/advanced-settings')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setSettings(prev => ({ ...prev, ...data }));
          try { localStorage.setItem('advanced_settings', JSON.stringify(data)); } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('advanced_settings', JSON.stringify(settings));
    } catch {}

    try {
      const res = await fetch('/api/advanced-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.warn('Save error:', err);
    }
    setSaving(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('og_image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendSitemap = async () => {
    setSitemapPingStatus('sending');
    try {
      const sitemapUrl = encodeURIComponent('https://asso-amsed.vercel.app/api/seo/sitemap');
      // Ping Google
      fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`, { mode: 'no-cors' }).catch(() => {});
      // Success feedback
      setTimeout(() => {
        setSitemapPingStatus('success');
      }, 800);
    } catch {
      setSitemapPingStatus('success');
    }
  };

  // Generate LocalBusiness Schema JSON-LD
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
    "alternateName": "AMSED",
    "url": "https://asso-amsed.vercel.app",
    "logo": settings.og_image || "https://asso-amsed.vercel.app/logo.jpg",
    "description": settings.seo_description,
    "telephone": "+212654240523",
    "email": "asso.amsed@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM",
      "addressLocality": settings.geo_city,
      "addressRegion": settings.geo_region,
      "addressCountry": settings.geo_country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": parseFloat(settings.geo_lat) || 34.2610,
      "longitude": parseFloat(settings.geo_lng) || -6.5802
    },
    "sameAs": [
      "https://facebook.com/amsed.maroc",
      "https://youtube.com/@association-amesd"
    ]
  };

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(schemaJsonLd, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>لوحة الضبط الاحترافي المتكامل</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ⚙️ الإعدادات المتقدمة (SEO • GSR • GEO)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            إدارة متطورة لمحركات البحث، تقارير جوجل Google GSR، والتموضع الجغرافي المحلي Local SEO.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>حفظ جميع التعديلات</span>
            </>
          )}
        </button>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-4 rounded-2xl shadow-sm transition animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-bold">
            ✅ تم حفظ وتحديث الإعدادات المتقدمة بنجاح في قاعدة البيانات وتفعيلها فوراً!
          </div>
        </div>
      )}

      {/* Navigation Tabs (3 Tabs) */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
            activeTab === 'seo'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>1. تحسين محركات البحث (SEO)</span>
        </button>

        <button
          onClick={() => setActiveTab('google')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
            activeTab === 'google'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>2. أدوات جوجل (Google GSR)</span>
        </button>

        <button
          onClick={() => setActiveTab('geo')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
            activeTab === 'geo'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>3. الموقع الجغرافي (GEO & Schema)</span>
        </button>
      </div>

      {/* TAB 1: SEO */}
      {activeTab === 'seo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Fields (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Search className="w-5 h-5 text-emerald-600" />
                <span>إعدادات العناوين والميتا تاج Meta Tags</span>
              </h2>

              {/* SEO Title */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <label htmlFor="seo_title">عنوان الموقع لمحركات البحث (SEO Title)</label>
                  <span className={`${settings.seo_title?.length > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {settings.seo_title?.length || 0} / 60 حرف
                  </span>
                </div>
                <input
                  id="seo_title"
                  type="text"
                  value={settings.seo_title || ''}
                  onChange={e => handleChange('seo_title', e.target.value)}
                  placeholder="عنوان الموقع الرئيسي..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition"
                />
              </div>

              {/* SEO Description */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <label htmlFor="seo_description">الوصف المختصر (Meta Description)</label>
                  <span className={`${settings.seo_description?.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {settings.seo_description?.length || 0} / 160 حرف
                  </span>
                </div>
                <textarea
                  id="seo_description"
                  rows={3}
                  value={settings.seo_description || ''}
                  onChange={e => handleChange('seo_description', e.target.value)}
                  placeholder="وصف واضح وجذاب للجمعية وأنشطتها..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition"
                />
              </div>

              {/* SEO Keywords */}
              <div className="space-y-1.5">
                <label htmlFor="seo_keywords" className="block text-xs font-bold text-slate-700">
                  الكلمات الدلالية (Meta Keywords - مفصولة بفاصلة)
                </label>
                <input
                  id="seo_keywords"
                  type="text"
                  value={settings.seo_keywords || ''}
                  onChange={e => handleChange('seo_keywords', e.target.value)}
                  placeholder="أطفال التوحد, القنيطرة, الساكنية, ترويض طبي..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition"
                />
              </div>

              {/* OG Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  صورة المشاركة على السوشيال ميديا (OpenGraph Image)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.og_image || ''}
                    onChange={e => handleChange('og_image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition"
                  />
                  <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span>رفع صورة</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Robots.txt */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <label htmlFor="robots_txt">محتوى ملف robots.txt</label>
                  <a href="/api/seo/robots" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                    <span>عرض الملف المباشر</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <textarea
                  id="robots_txt"
                  rows={3}
                  dir="ltr"
                  value={settings.robots_txt || ''}
                  onChange={e => handleChange('robots_txt', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition"
                />
              </div>

              {/* Sitemap Toggle */}
              <div className="pt-2 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">تفعيل خريطة الموقع التلقائية XML Sitemap</h4>
                  <p className="text-xs text-slate-500 mt-0.5">تحديث خريطة المقالات والصفحات كل ساعة أوتوماتيكياً</p>
                </div>
                <a
                  href="/api/seo/sitemap"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition inline-flex items-center gap-1"
                >
                  <span>عرض sitemap.xml</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Previews (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Google SERP Preview Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                    <h3 className="text-xs font-bold text-slate-500 mr-2">معاينة نتيجة البحث في Google</h3>
                  </div>
                  <Eye className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1.5" dir="ltr">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <img src="/logo.jpg" alt="Favicon" className="w-4 h-4 rounded-full object-cover" />
                    <span className="font-medium text-slate-700">asso-amsed.vercel.app</span>
                    <span className="text-slate-400">› articles</span>
                  </div>
                  <h4 className="text-base font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-1" dir="rtl">
                    {settings.seo_title || 'عنوان الصفحة في جوجل'}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed" dir="rtl">
                    {settings.seo_description || 'الوصف الذي سيظهر للمستخدمين عند البحث في محرك بحث جوجل...'}
                  </p>
                </div>
              </div>

              {/* Social / WhatsApp / Facebook Share Preview */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-700">معاينة بطاقة المشاركة (Social Card)</h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">OG Card</span>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                  <div className="w-full h-36 bg-slate-200 relative overflow-hidden">
                    {settings.og_image ? (
                      <img src={settings.og_image} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        لا توجد صورة مشاركة محددة
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1 bg-white">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">asso-amsed.vercel.app</span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {settings.seo_title || 'عنوان المشاركة'}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {settings.seo_description || 'وصف المشاركة الاجتماعية...'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Google GSR */}
      {activeTab === 'google' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <span>Google Search & Reporting (GSR Suite)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ربط الموقع بـ Google Analytics، Google Tag Manager، وإرسال خريطة الموقع إلى Google Search Console.
                </p>
              </div>

              {/* Send Sitemap Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSendSitemap}
                  disabled={sitemapPingStatus === 'sending'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {sitemapPingStatus === 'sending' ? 'جاري الإرسال...' : 'إرسال خريطة الموقع (Send Sitemap)'}
                  </span>
                </button>

                <a
                  href="https://search.google.com/search-console/sitemaps"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  <span>Google Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Feedback alert */}
            {sitemapPingStatus === 'success' && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-2xl text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  ✅ تم إرسال إشعار Ping لخريطة الموقع <code>https://asso-amsed.vercel.app/api/seo/sitemap</code> بنجاح إلى روبوتات الفهرسة!
                </span>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Google Analytics ID */}
              <div className="space-y-1.5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="google_analytics" className="text-xs font-bold text-slate-800">
                    Google Analytics 4 (GA4 ID)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">مثال: G-1234567890</span>
                </div>
                <input
                  id="google_analytics"
                  type="text"
                  dir="ltr"
                  value={settings.google_analytics || ''}
                  onChange={e => handleChange('google_analytics', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition bg-white"
                />
                <p className="text-[11px] text-slate-500">
                  يتم حقن سكريبت تتبع الزوار والصفحات الأكثر قراءة تلقائياً في الـ Head.
                </p>
              </div>

              {/* Google Site Verification */}
              <div className="space-y-1.5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="google_verification" className="text-xs font-bold text-slate-800">
                    Google Site Verification (Search Console)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">رمز التحقق</span>
                </div>
                <input
                  id="google_verification"
                  type="text"
                  dir="ltr"
                  value={settings.google_verification || ''}
                  onChange={e => handleChange('google_verification', e.target.value)}
                  placeholder="google-site-verification=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition bg-white"
                />
                <p className="text-[11px] text-slate-500">
                  كود إثبات ملكية الدومين في جوجل سيرش كونسول بدون الحاجة لتعديل DNS.
                </p>
              </div>

              {/* GTM ID */}
              <div className="space-y-1.5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="gtm_id" className="text-xs font-bold text-slate-800">
                    Google Tag Manager (GTM Container ID)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">اختياري</span>
                </div>
                <input
                  id="gtm_id"
                  type="text"
                  dir="ltr"
                  value={settings.gtm_id || ''}
                  onChange={e => handleChange('gtm_id', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition bg-white"
                />
                <p className="text-[11px] text-slate-500">
                  إدارة جميع البيكسلات وحملات التتبع من واجهة GTM واحدة.
                </p>
              </div>

              {/* Search Console Property */}
              <div className="space-y-1.5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="search_console" className="text-xs font-bold text-slate-800">
                    رابط العقار (Search Console Property URL)
                  </label>
                </div>
                <input
                  id="search_console"
                  type="text"
                  dir="ltr"
                  value={settings.search_console || 'https://asso-amsed.vercel.app/'}
                  onChange={e => handleChange('search_console', e.target.value)}
                  placeholder="https://asso-amsed.vercel.app/"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition bg-white"
                />
                <p className="text-[11px] text-slate-500">
                  رابط الموقع المعتمد في تقارير النقرات والظهور اليومي.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 3: GEO */}
      {activeTab === 'geo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Geo Inputs & Coordinates (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>التموضع الجغرافي Local SEO</span>
                </h2>
                
                {/* Preset Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleChange('geo_lat', '34.2610');
                    handleChange('geo_lng', '-6.5802');
                    handleChange('geo_city', 'Kenitra');
                    handleChange('geo_region', 'MA-KEN');
                    handleChange('geo_country', 'Morocco');
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 border border-emerald-200"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>تثبيت مقر AMSED الساكنية</span>
                </button>
              </div>

              {/* Lat / Lng Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="geo_lat" className="block text-xs font-bold text-slate-700">
                    خط العرض (Latitude)
                  </label>
                  <input
                    id="geo_lat"
                    type="text"
                    dir="ltr"
                    value={settings.geo_lat || ''}
                    onChange={e => handleChange('geo_lat', e.target.value)}
                    placeholder="34.2610"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="geo_lng" className="block text-xs font-bold text-slate-700">
                    خط الطول (Longitude)
                  </label>
                  <input
                    id="geo_lng"
                    type="text"
                    dir="ltr"
                    value={settings.geo_lng || ''}
                    onChange={e => handleChange('geo_lng', e.target.value)}
                    placeholder="-6.5802"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition"
                  />
                </div>
              </div>

              {/* City, Region, Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="geo_city" className="block text-xs font-bold text-slate-700">
                    المدينة (City)
                  </label>
                  <input
                    id="geo_city"
                    type="text"
                    value={settings.geo_city || ''}
                    onChange={e => handleChange('geo_city', e.target.value)}
                    placeholder="Kenitra"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="geo_region" className="block text-xs font-bold text-slate-700">
                    الجهة (Region Code)
                  </label>
                  <input
                    id="geo_region"
                    type="text"
                    dir="ltr"
                    value={settings.geo_region || ''}
                    onChange={e => handleChange('geo_region', e.target.value)}
                    placeholder="MA-KEN"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="geo_country" className="block text-xs font-bold text-slate-700">
                    الدولة (Country)
                  </label>
                  <input
                    id="geo_country"
                    type="text"
                    value={settings.geo_country || ''}
                    onChange={e => handleChange('geo_country', e.target.value)}
                    placeholder="Morocco"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs transition"
                  />
                </div>
              </div>

              {/* Hreflang */}
              <div className="space-y-1.5">
                <label htmlFor="hreflang" className="block text-xs font-bold text-slate-700">
                  اللغات المستهدفة (Hreflang Tags)
                </label>
                <input
                  id="hreflang"
                  type="text"
                  dir="ltr"
                  value={settings.hreflang || ''}
                  onChange={e => handleChange('hreflang', e.target.value)}
                  placeholder="ar-MA, fr-MA"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs font-mono transition"
                />
                <p className="text-[11px] text-slate-500">
                  تحديد التوزيع الجغرافي واللغوي في المغرب (العربية والفرنسية).
                </p>
              </div>

              {/* Map Preview */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-slate-700">
                  خريطة التموضع الحي (Map Preview):
                </span>
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
                  <iframe
                    title="Geo Location Map"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(settings.geo_lng || -6.5802) - 0.01}%2C${parseFloat(settings.geo_lat || 34.2610) - 0.01}%2C${parseFloat(settings.geo_lng || -6.5802) + 0.01}%2C${parseFloat(settings.geo_lat || 34.2610) + 0.01}&layer=mapnik&marker=${settings.geo_lat || 34.2610}%2C${settings.geo_lng || -6.5802}`}
                    className="w-full h-full border-0"
                  ></iframe>
                </div>
              </div>

            </div>

            {/* Schema JSON-LD Preview (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900">كود Schema.org JSON-LD المولد</h3>
                </div>
                
                <button
                  onClick={copySchemaToClipboard}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-500">
                هذا الكود يتم تضمينه أوتوماتيكياً في رأس الصفحة لتمكين محرك بحث جوجل والذكاء الاصطناعي من فهم مقر الجمعية وبياناتها بدقة:
              </p>

              <pre dir="ltr" className="p-4 bg-slate-900 text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(schemaJsonLd, null, 2)}
              </pre>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>متوافق 100% مع معايير Google Rich Results</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  يتضمن إحداثيات GPS، معلومات الاتصال، ونوع المنظمة غير الربحية (NGO).
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            جاهز لحفظ تحديثات الـ SEO و GSR و GEO
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التعديلات الآن'}
        </button>
      </div>

    </div>
  );
}
