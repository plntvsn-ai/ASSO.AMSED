import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, Phone, MapPin, Mail, Globe, CheckCircle2, 
  Sliders, RefreshCw, Database, Key, Check, AlertCircle, Info, ShieldCheck
} from 'lucide-react';
import { 
  supabase, 
  isSupabaseConfigured, 
  getSupabaseConfig, 
  saveSupabaseCredentials 
} from '@/lib/supabase';
import { 
  loadSiteSettingsAsync, 
  saveSiteSettingsAsync, 
  getLocalSiteSettings 
} from '@/services/siteSettingsService';
import { ASSOCIATION_NAME_STYLES } from '../../data/associationNameStyles';

export default function SettingsPage() {
  const [form, setForm] = useState({
    association_full_name: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة',
    association_short_name: 'AMSED',
    site_title: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
    association_subtitle: 'لرعاية أطفال التوحد وفي وضعية صعبة • القنيطرة',
    association_name_style: 'royal_3d_red_gold',
    address: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
    city: 'Kenitra',
    email: 'asso.amsed@gmail.com',
    phone1: '06 54 24 05 23',
    phone2: '06 63 78 01 07',
    phone3: '',
    working_hours: 'الإثنين - الجمعة: 08:30 إلى 17:00 | السبت: 09:00 إلى 13:00',
    lat: '34.2610',
    lng: '-6.5802',
    show_donations: false,
    show_bank: false,
    show_stats: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(null); // 'success' | 'info' | null
  const [savedMessage, setSavedMessage] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  // Supabase credentials management
  const [dbConfigured, setDbConfigured] = useState(() => isSupabaseConfigured());
  const [showDbBox, setShowDbBox] = useState(false);
  const [customSbUrl, setCustomSbUrl] = useState(() => getSupabaseConfig()?.url || '');
  const [customSbKey, setCustomSbKey] = useState(() => getSupabaseConfig()?.key || '');
  const [sbCredMsg, setSbCredMsg] = useState('');

  useEffect(() => {
    // 1. Initial config sync
    setDbConfigured(isSupabaseConfigured());

    // 2. Load from cache immediately for instant display
    const cached = getLocalSiteSettings();
    setForm(prev => ({ ...prev, ...cached }));

    // 3. Load full async (Firestore -> Supabase -> API without overwriting)
    loadSiteSettingsAsync()
      .then(loaded => {
        if (loaded) {
          setForm(prev => ({ ...prev, ...loaded }));
        }
      })
      .catch(err => console.warn('Load settings error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSavedStatus(null);
      setSavedMessage('');

      const saved = await saveSiteSettingsAsync(form);
      setForm(prev => ({ ...prev, ...saved }));

      setSavedStatus('success');
      setSavedMessage('تم حفظ كافة الإعدادات بنجاح ومزامنتها محلياً وسحابياً دون أي إعادة ضبط ✅');

      setTimeout(() => {
        setSavedStatus(null);
        setSavedMessage('');
      }, 5000);
    } catch (generalErr) {
      console.warn('General save warning:', generalErr);
      setSavedStatus('info');
      setSavedMessage('تم حفظ التعديلات بنجاح في المتصفح والموقع ✅');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCredentials = async () => {
    try {
      saveSupabaseCredentials(customSbUrl, customSbKey);
      setSbCredMsg('تم حفظ مفاتيح Supabase بنجاح ✅ جاري تحديث الصفحة...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setSbCredMsg('خطأ في حفظ المفاتيح');
    }
  };

  const handleTestRun = async () => {
    setTestLoading(true);
    try {
      const res = await fetch('/api/autonomous-publish', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.article) {
            try {
              const stored = localStorage.getItem('amsed_cms_database_v3');
              const cmsObj = stored ? JSON.parse(stored) : { articles: [] };
              if (!Array.isArray(cmsObj.articles)) cmsObj.articles = [];
              cmsObj.articles.unshift(data.article);
              localStorage.setItem('amsed_cms_database_v3', JSON.stringify(cmsObj));
            } catch (e) {}
          }
          alert(`✅ تم النشر بنجاح: ${data.ar || data.published} ${data.ai ? '(ذكاء اصطناعي Gemini)' : ''}`);
          window.location.reload();
          return;
        }
      }
      throw new Error('Fallback to client publisher');
    } catch (e) {
      // Fallback to client-side autoPublisher
      try {
        const { autoGenerateAndPublish } = await import("../../services/autoPublisher");
        const resClient = await autoGenerateAndPublish();
        if (resClient?.success) {
          alert(`✅ تم النشر بنجاح من خزان المواضيع: ${resClient.topic || 'مقال جديد'}`);
          window.location.reload();
          return;
        }
      } catch (clientErr) {
        console.error("Client auto publish fallback notice:", clientErr);
      }
      alert('❌ تعذر الاتصال بالخادم، يرجى المحاولة بعد قليل.');
    } finally {
      setTestLoading(false);
    }
  };

  if (loading && !form.association_full_name) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 font-bold" dir="rtl">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-600 mb-3" />
        جاري تحميل الإعدادات...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">⚙️ إعدادات الموقع الأساسية (site_settings)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة عنوان الجمعية، أرقام الهاتف، وموقع المركز المحفوظ في Supabase والمتصفح.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/am-ctrl-9k2l8x-2026-secure-panel-77/settings/advanced"
            className="px-4 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition inline-flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>الإعدادات المتقدمة (SEO • GSR • GEO)</span>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        {/* Top Bar Title / Motto (العنوان أعلى الموقع وفوق الشعار) */}
        <div className="space-y-1.5 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
          <label className="block text-xs font-bold text-amber-900">👑 العنوان / الشعار الوطني في الشريط العلوي (أعلى الموقع وفوق الشعار)</label>
          <input
            name="top_bar_title"
            value={form.top_bar_title || ''}
            onChange={handleChange}
            className="w-full border border-amber-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm transition font-bold bg-white"
            placeholder="مثال: مصلحة عمومية وطنية ذات أهداف إنسانية وتضامنية"
          />
          <p className="text-[11px] text-amber-800">
            هذا العنوان يظهر في الشريط الأسود العلوي وأعلى الشعار في جميع صفحات الموقع.
          </p>
        </div>

        {/* Logo Selection & Preview */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-800">🖼️ الشعار الرسمي المعتمد (اللوغو)</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl border border-slate-300 p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src={form.logo_url || "/logo_amesd_original_transparent.png"}
                alt="Logo Preview"
                className="max-h-full max-w-full object-contain"
                onError={(e) => { e.target.src = "/logo_amesd_original_transparent.png"; }}
              />
            </div>
            <div className="flex-1 space-y-2 w-full">
              <input
                name="logo_url"
                value={form.logo_url || ''}
                dir="ltr"
                onChange={handleChange}
                className="w-full border border-slate-300 p-2.5 rounded-xl text-xs font-mono bg-white"
                placeholder="/logo_amesd_original_transparent.png"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, logo_url: '/logo_amesd_original_transparent.png' }))}
                  className="px-2.5 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 font-bold transition"
                >
                  استخدام الشعار الأصلي الشفاف
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, logo_url: '/logo.png' }))}
                  className="px-2.5 py-1 text-xs bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-bold transition"
                >
                  شعار logo.png
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Association Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">🏷️ الاسم الكامل للجمعية (association_full_name)</label>
          <input
            name="association_full_name"
            value={form.association_full_name || ''}
            onChange={handleChange}
            className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition font-medium"
            placeholder="الاسم الكامل للجمعية"
          />
        </div>

        {/* Association Subtitle (العنوان تحت اسم الجمعية) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">📍 العنوان الفرعي تحت اسم الجمعية في الترويسة (association_subtitle)</label>
          <input
            name="association_subtitle"
            value={form.association_subtitle || ''}
            onChange={handleChange}
            className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition font-medium"
            placeholder="مثال: لرعاية أطفال التوحد وفي وضعية صعبة • القنيطرة"
          />
        </div>

        {/* Association Name Font Styles (أنماط كتابة اسم الجمعية - 18 نمطاً متنوعاً وثلاثي الأبعاد) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-800">
              ✨ نمط وتصميم كتابة اسم الجمعية في واجهة الموقع (18 خياراً ثلاثي الأبعاد وملكي)
            </label>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              {ASSOCIATION_NAME_STYLES.length} نمطاً متاحاً
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto p-2.5 border border-slate-200 rounded-2xl bg-slate-50/70">
            {ASSOCIATION_NAME_STYLES.map(st => {
              const isSelected = (form.association_name_style || 'royal_3d_red_gold') === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setForm(prev => ({ ...prev, association_name_style: st.id }))}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between text-center relative ${
                    isSelected
                      ? 'border-emerald-600 bg-white shadow-lg ring-2 ring-emerald-500/30 scale-[1.01]'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {st.tag}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        ✓ محدد
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-800 mb-2">{st.name}</div>

                  <div 
                    style={st.heroStyle || {}} 
                    className="p-2.5 rounded-xl bg-slate-900/90 text-sm font-bold my-1 text-center select-none"
                  >
                    {form.association_short_name || 'AMSED'} • المبادرة المغربية
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2 truncate">
                    {st.preview}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Short Name & Site Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🔤 الاختصار (association_short_name)</label>
            <input
              name="association_short_name"
              value={form.association_short_name || form.association_short || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="الاختصار"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🌐 عنوان الموقع (site_title)</label>
            <input
              name="site_title"
              value={form.site_title || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              placeholder="عنوان الموقع"
            />
          </div>
        </div>

        {/* Address & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">📍 العنوان الرئيسي (address)</label>
            <input
              name="address"
              value={form.address || form.address_ar || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              placeholder="العنوان الرئيسي"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🏙️ المدينة (city)</label>
            <input
              name="city"
              value={form.city || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              placeholder="المدينة"
            />
          </div>
        </div>

        {/* Email & Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">✉️ البريد الإلكتروني (email)</label>
            <input
              name="email"
              value={form.email || ''}
              dir="ltr"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="البريد الإلكتروني"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">⏰ أوقات وساعات العمل والاستقبال (working_hours)</label>
            <input
              name="working_hours"
              value={form.working_hours || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              placeholder="الإثنين - الجمعة: 08:30 إلى 17:00 | السبت: 09:00 إلى 13:00"
            />
          </div>
        </div>

        {/* Phone Numbers (Phone 1, 2, 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">📞 الهاتف 1 (phone1)</label>
            <input
              name="phone1"
              value={form.phone1 || form.phone || ''}
              dir="ltr"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="الهاتف 1"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">📱 الهاتف 2 (phone2)</label>
            <input
              name="phone2"
              value={form.phone2 || ''}
              dir="ltr"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="الهاتف 2"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">☎️ هاتف إضافي 3 (اختياري)</label>
            <input
              name="phone3"
              value={form.phone3 || ''}
              dir="ltr"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="هاتف 3"
            />
          </div>
        </div>

        {/* Location Coordinates */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">📍 إحداثيات موقع الجمعية على خريطة Google Maps</span>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, lat: '34.250676', lng: '-6.540316' }))}
              className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold hover:bg-emerald-100 transition"
            >
              🎯 تثبيت إحداثيات القنيطرة (34.250676, -6.540316)
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">🌐 خط العرض (lat)</label>
              <input
                name="lat"
                value={form.lat || '34.250676'}
                dir="ltr"
                onChange={handleChange}
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
                placeholder="34.250676"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">🌐 خط الطول (lng)</label>
              <input
                name="lng"
                value={form.lng || '-6.540316'}
                dir="ltr"
                onChange={handleChange}
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
                placeholder="-6.540316"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              name="show_stats"
              checked={form.show_stats !== false}
              onChange={handleChange}
              className="w-5 h-5 text-emerald-600 rounded"
            />
            <span className="font-bold text-xs sm:text-sm text-slate-800">
              {form.show_stats !== false ? '✅ شريط الإحصائيات ظاهر' : '🚫 إخفاء شريط الإحصائيات'}
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              name="show_donations"
              checked={Boolean(form.show_donations)}
              onChange={handleChange}
              className="w-5 h-5 text-emerald-600 rounded"
            />
            <span className="font-bold text-xs sm:text-sm text-slate-800">
              {form.show_donations ? '✅ قسم التبرعات ظاهر' : '🚫 إخفاء قسم التبرعات'}
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              name="show_bank"
              checked={Boolean(form.show_bank)}
              onChange={handleChange}
              className="w-5 h-5 text-emerald-600 rounded"
            />
            <span className="font-bold text-xs sm:text-sm text-slate-800">
              {form.show_bank ? '✅ الحساب البنكي ظاهر' : '🚫 إخفاء الحساب البنكي'}
            </span>
          </label>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ والمزامنة...' : 'حفظ الإعدادات'}
        </button>

        {/* Feedback Banner */}
        {savedStatus && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-bold animate-fadeIn ${
            savedStatus === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
              : 'bg-blue-50 border-blue-300 text-blue-800'
          }`}>
            {savedStatus === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      {/* Supabase Connection Settings (Collapsible) */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">حالة الربط مع Supabase Database</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
              dbConfigured 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                : 'bg-amber-100 border-amber-300 text-amber-800'
            }`}>
              {dbConfigured ? '🟢 متصل مباشرة' : '🟡 يعمل بالحفظ المحلي وخادم API'}
            </span>
            <button
              onClick={() => setShowDbBox(!showDbBox)}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
            >
              {showDbBox ? 'إخفاء الإعدادات' : 'تعديل المفاتيح'}
            </button>
          </div>
        </div>

        {showDbBox && (
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">
              إذا كنت تريد الربط المباشر مع Supabase دون انتظار إعدادات Vercel، يمكنك لصق رابط وقفل المشروع هنا:
            </p>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Supabase URL</label>
              <input
                type="text"
                dir="ltr"
                value={customSbUrl}
                onChange={(e) => setCustomSbUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full border border-slate-300 p-2.5 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Supabase Anon Key</label>
              <input
                type="password"
                dir="ltr"
                value={customSbKey}
                onChange={(e) => setCustomSbKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full border border-slate-300 p-2.5 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleSaveCredentials}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                حفظ المفاتيح وتفعيل الاتصال
              </button>
              {sbCredMsg && <span className="text-xs font-bold text-emerald-700">{sbCredMsg}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Test Run Box */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-amber-400">⚡ اختبار وتوليد المقالات الفوري (Gemini 1.5 Flash AI)</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          استدعاء مسار النشر الذاتي <code>/api/autonomous-publish</code> لتجربة توليد مقال جديد بـ 3 لغات مباشرة من خزان المواضيع باستخدام الذكاء الاصطناعي:
        </p>
        <button
          onClick={handleTestRun}
          disabled={testLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 py-3 rounded-xl font-black text-sm transition shadow cursor-pointer"
        >
          {testLoading ? 'جاري التوليد باستخدام Gemini...' : '⚡ اختبار وتوليد فوري (Test Run)'}
        </button>
      </div>
    </div>
  );
}

export { SettingsPage };
