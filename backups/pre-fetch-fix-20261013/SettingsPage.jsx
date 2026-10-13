import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Phone, MapPin, Mail, Globe, CheckCircle2, Sliders, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [form, setForm] = useState({
    association_full_name: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة',
    association_short_name: 'AMSED',
    site_title: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
    address: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
    city: 'Kenitra',
    email: 'asso.amsed@gmail.com',
    phone1: '06 54 24 05 23',
    phone2: '',
    lat: '34.2610',
    lng: '-6.5802',
    show_donations: false,
    show_bank: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    // 1. Load from cache if available for instant display
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) setForm(prev => ({ ...prev, ...JSON.parse(cached) }));
    } catch {}

    // 2. Load directly from Supabase site_settings (id=1)
    const load = async () => {
      try {
        console.log('Fetching settings from Supabase (site_settings id=1)...');
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (error) console.log('Fetching settings error:', error);
        if (data) {
          console.log('Loaded site_settings data:', data);
          setForm(prev => ({
            ...prev,
            ...data,
            association_short_name: data.association_short_name || data.association_short || prev.association_short_name,
            show_donations: data.show_donations !== undefined ? Boolean(data.show_donations) : (data.show_donation !== undefined ? Boolean(data.show_donation) : prev.show_donations),
            show_bank: data.show_bank !== undefined ? Boolean(data.show_bank) : prev.show_bank
          }));
          try { localStorage.setItem('site_settings', JSON.stringify(data)); } catch {}
        }
      } catch (err) {
        console.warn('Error loading site_settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
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
      // مهم بزاف: كنحيدو id و created_at باش ما يتصيفطوش فـ update - هادا هو سبب PGRST125
      const { id, created_at, ...dataToSave } = form;
      dataToSave.updated_at = new Date().toISOString();

      console.log('Updating Supabase site_settings id=1:', dataToSave);

      const { error } = await supabase
        .from('site_settings')
        .update(dataToSave)
        .eq('id', 1);

      if (error) throw error;

      try {
        localStorage.setItem('site_settings', JSON.stringify({ ...form, ...dataToSave }));
      } catch {}

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      alert('تم الحفظ بنجاح ✅');
    } catch (err) {
      console.error('Supabase save error:', err);
      alert(`خطأ في الحفظ: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTestRun = async () => {
    setTestLoading(true);
    try {
      const res = await fetch('/api/autonomous-publish', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ تنشر: ${data.ar || data.published} ${data.ai ? '(تم التوليد بذكاء Gemini 1.5)' : ''}`);
        window.location.reload();
      } else {
        alert(`❌ خطأ: ${data.error}`);
      }
    } catch (e) {
      alert('❌ فشل الاتصال - شوف Vercel Logs');
    } finally {
      setTestLoading(false);
    }
  };

  if (loading && !form.association_full_name) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 font-bold" dir="rtl">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-emerald-600 mb-3" />
        جاري تحميل الإعدادات من Supabase...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">⚙️ إعدادات الموقع الأساسية (site_settings)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة عنوان الجمعية، أرقام الهاتف، وموقع المركز المحفوظ في Supabase.
          </p>
        </div>
        <Link
          to="/am-ctrl-9k2l8x-2026-secure-panel-77/settings/advanced"
          className="px-4 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition inline-flex items-center gap-1.5"
        >
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>الإعدادات المتقدمة (SEO • GSR • GEO)</span>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
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

        {/* Email & Phone 1 */}
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
        </div>

        {/* Phone 2 & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <label className="block text-xs font-bold text-slate-700">🌐 خط العرض (lat)</label>
            <input
              name="lat"
              value={form.lat || ''}
              dir="ltr"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="lat"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🌐 خط الطول (lng)</label>
            <input
              name="lng"
              value={form.lng || ''}
              dir="ltr"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="lng"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
          {saving ? 'جاري الحفظ في Supabase...' : 'حفظ الإعدادات'}
        </button>

        {saved && (
          <p className="text-emerald-700 bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-center font-bold text-xs animate-fadeIn">
            ✅ تم الحفظ بنجاح في جدول site_settings في Supabase وتحديث الموقع
          </p>
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
