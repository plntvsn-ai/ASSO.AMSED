import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Phone, MapPin, Mail, Globe, CheckCircle2, Sliders, RefreshCw } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  const [saving, setSaving] = useState(false);
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
    }
    setLoading(false);
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) setS(prev => ({ ...prev, ...JSON.parse(cached) }));
    } catch {}

    // Load from Firestore settings/general or siteSettings/main
    (async () => {
      try {
        if (db) {
          const genSnap = await getDoc(doc(db, "settings", "general"));
          if (genSnap.exists()) {
            setS(prev => ({ ...prev, ...genSnap.data() }));
            return;
          }
          const siteSnap = await getDoc(doc(db, "siteSettings", "main"));
          if (siteSnap.exists()) {
            setS(prev => ({ ...prev, ...siteSnap.data() }));
            return;
          }
          // Seed defaults
          const defaultGeneral = {
            association_full_name: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة',
            association_short: 'AMSED',
            association_full_display: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
            site_title: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED'
          };
          await setDoc(doc(db, "settings", "general"), defaultGeneral, { merge: true }).catch(() => {});
          await setDoc(doc(db, "siteSettings", "main"), defaultGeneral, { merge: true }).catch(() => {});
        }
      } catch (e) {
        console.warn('Firestore settings load warning:', e);
      }
    })();

    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setS(prev => ({ ...prev, ...data }));
          try { localStorage.setItem('site_settings', JSON.stringify(data)); } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...s,
      phone: s.phone1 || s.phone,
      phone1: s.phone1 || s.phone,
      address: s.address || s.address_ar,
      address_ar: s.address || s.address_ar,
      site_title: s.site_title || s.association_full_display || s.association_name,
      association_full_name: s.association_full_name || 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة',
      association_short: s.association_short || 'AMSED',
      association_full_display: s.association_full_display || 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED'
    };

    try {
      localStorage.setItem('site_settings', JSON.stringify(payload));
    } catch {}

    // Save to Firestore collections
    try {
      if (db) {
        await setDoc(doc(db, "settings", "general"), payload, { merge: true });
        await setDoc(doc(db, "siteSettings", "main"), payload, { merge: true });
        await setDoc(doc(db, "settings", "cmsConfig"), {
          association_full_name: payload.association_full_name,
          association_short: payload.association_short,
          association_full_display: payload.association_full_display
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore settings save warning:', e);
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.warn('Sync notice:', e);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

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
          to="/admin/settings/advanced"
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
          onClick={save}
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ في Supabase...' : 'حفظ التعديلات في قاعدة البيانات'}
        </button>

        {saved && (
          <p className="text-emerald-700 bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-center font-bold text-xs animate-fadeIn">
            ✅ تم الحفظ بنجاح في جدول site_settings وتحديث الموقع
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
