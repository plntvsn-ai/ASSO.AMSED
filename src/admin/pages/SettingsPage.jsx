import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Phone, MapPin, Mail, Globe, CheckCircle2, Sliders, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [s, setS] = useState({
    association_full_name: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة',
    association_short: 'AMSED',
    association_full_display: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
    site_title: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
    site_description: 'جمعية AMSED - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدعم المدرسي AVS، ورشات مهنية، ومواكبة نفسية.',
    address: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
    address_ar: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
    phone: '06 54 24 05 23',
    phone1: '06 54 24 05 23',
    phone2: '',
    email: 'asso.amsed@gmail.com',
    city: 'Kenitra',
    lat: '34.2610',
    lng: '-6.5802',
    show_donation: false,
    show_bank: false
  });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTestRun = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) setS(prev => ({ ...prev, ...JSON.parse(cached) }));
    } catch {}

    // Load directly from Supabase site_settings table (id=1)
    (async () => {
      try {
        console.log('Fetching site_settings from Supabase (id=1)...');
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (data && !error) {
          console.log('✅ Loaded site_settings from Supabase:', data);
          setS(prev => ({
            ...prev,
            ...data,
            association_full_name: data.association_full_name || prev.association_full_name,
            site_title: data.site_title || prev.site_title,
            phone: data.phone1 || data.phone || prev.phone,
            phone1: data.phone1 || data.phone || prev.phone1,
            phone2: data.phone2 || prev.phone2,
            address: data.address || data.address_ar || prev.address,
            address_ar: data.address || data.address_ar || prev.address_ar,
            show_donation: data.show_donations !== undefined ? data.show_donations : (data.show_donation !== undefined ? data.show_donation : prev.show_donation),
            show_bank: data.show_bank !== undefined ? data.show_bank : prev.show_bank
          }));
          try { localStorage.setItem('site_settings', JSON.stringify(data)); } catch {}
          return;
        }
      } catch (err) {
        console.warn('Supabase site_settings load notice:', err);
      }
    })();

    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setS(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const updated_at = new Date().toISOString();

    const association_full_name = s.association_full_name || 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة';
    const site_title = s.site_title || s.association_full_display || s.association_full_name || 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED';
    const address = s.address || s.address_ar || 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA';
    const phone1 = s.phone1 || s.phone || '06 54 24 05 23';
    const phone2 = s.phone2 || '';
    const email = s.email || 'asso.amsed@gmail.com';
    const city = s.city || 'Kenitra';
    const lat = s.lat || '34.2610';
    const lng = s.lng || '-6.5802';
    const show_donations = s.show_donation !== undefined ? s.show_donation : false;
    const show_bank = s.show_bank !== undefined ? s.show_bank : false;

    const payload = {
      association_full_name,
      site_title,
      address,
      phone1,
      phone2,
      email,
      city,
      lat,
      lng,
      show_donations,
      show_bank,
      updated_at
    };

    console.log('Updating Supabase site_settings id=1:', payload);

    try {
      localStorage.setItem('site_settings', JSON.stringify({ ...s, ...payload }));
    } catch {}

    try {
      // Direct Supabase update as specified
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          association_full_name,
          site_title,
          address,
          phone1,
          phone2,
          email,
          city,
          lat,
          lng,
          show_donations,
          show_bank,
          updated_at
        })
        .eq('id', 1);

      if (error) {
        console.warn('Supabase update notice, attempting upsert id=1:', error);
        const { error: upsertErr } = await supabase
          .from('site_settings')
          .upsert({ id: 1, ...payload });

        if (upsertErr) {
          console.error('Supabase save error:', upsertErr);
          alert('❌ خطأ في الحفظ في Supabase: ' + (upsertErr.message || error.message));
        } else {
          console.log('✅ Supabase site_settings upserted successfully id=1');
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      } else {
        console.log('✅ Supabase site_settings updated successfully id=1');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('❌ تعذر الحفظ في Supabase: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const save = handleSave;

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
        {/* Association Branding Names */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">🏷️ الاسم الرسمي الكامل للجمعية (association_full_name)</label>
          <input
            value={s.association_full_name || ''}
            onChange={e => setS({ ...s, association_full_name: e.target.value })}
            className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition font-medium"
            placeholder="جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🔤 الاختصار اللاتيني (association_short)</label>
            <input
              value={s.association_short || ''}
              onChange={e => setS({ ...s, association_short: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="AMSED"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🏷️ الاسم الكامل مع الاختصار للعرض (association_full_display)</label>
            <input
              value={s.association_full_display || ''}
              onChange={e => setS({ ...s, association_full_display: e.target.value, site_title: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              placeholder="جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">🌐 عنوان الموقع الرئيسي (site_title)</label>
          <input
            value={s.site_title || ''}
            onChange={e => setS({ ...s, site_title: e.target.value })}
            className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
            placeholder="جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED"
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">📍 العنوان الرسمي (address)</label>
          <input
            value={s.address || s.address_ar || ''}
            onChange={e => setS({ ...s, address: e.target.value, address_ar: e.target.value })}
            className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
            placeholder="SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA"
          />
        </div>

        {/* Phones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">📞 رقم الهاتف الأساسي (phone1)</label>
            <input
              value={s.phone1 || s.phone || ''}
              dir="ltr"
              onChange={e => setS({ ...s, phone1: e.target.value, phone: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="06 54 24 05 23"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">📱 رقم الهاتف الثانوي (phone2)</label>
            <input
              value={s.phone2 || ''}
              dir="ltr"
              onChange={e => setS({ ...s, phone2: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="اختياري"
            />
          </div>
        </div>

        {/* Email & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">✉️ البريد الإلكتروني (email)</label>
            <input
              value={s.email || ''}
              dir="ltr"
              onChange={e => setS({ ...s, email: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="asso.amsed@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🏙️ المدينة (city)</label>
            <input
              value={s.city || ''}
              onChange={e => setS({ ...s, city: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
              placeholder="Kenitra"
            />
          </div>
        </div>

        {/* Lat / Lng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🌐 خط العرض (lat)</label>
            <input
              value={s.lat || ''}
              dir="ltr"
              onChange={e => setS({ ...s, lat: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="34.2610"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">🌐 خط الطول (lng)</label>
            <input
              value={s.lng || ''}
              dir="ltr"
              onChange={e => setS({ ...s, lng: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono transition"
              placeholder="-6.5802"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={!s.show_donation}
              onChange={e => setS({ ...s, show_donation: !e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded"
            />
            <span className="font-bold text-xs sm:text-sm text-slate-800">
              {s.show_donation ? '✅ قسم التبرعات ظاهر' : '🚫 إخفاء قسم التبرعات'}
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={!s.show_bank}
              onChange={e => setS({ ...s, show_bank: !e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded"
            />
            <span className="font-bold text-xs sm:text-sm text-slate-800">
              {s.show_bank ? '✅ الحساب البنكي ظاهر' : '🚫 إخفاء الحساب البنكي'}
            </span>
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'جاري الحفظ في Supabase...' : 'حفظ التعديلات في قاعدة البيانات'}
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
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 py-3 rounded-xl font-black text-sm transition shadow cursor-pointer"
        >
          {loading ? 'جاري التوليد باستخدام Gemini...' : '⚡ اختبار وتوليد فوري (Test Run)'}
        </button>
      </div>
    </div>
  );
}

export { SettingsPage };
