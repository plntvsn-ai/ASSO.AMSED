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

export default function SettingsPage() {
  const [form, setForm] = useState({
    association_full_name: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة',
    association_short_name: 'AMSED',
    site_title: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
    association_subtitle: 'لرعاية أطفال التوحد وفي وضعية صعبة • القنيطرة',
    association_name_style: 'andalusian',
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
  const [dbConfigured, setDbConfigured] = useState(false);
  const [showDbBox, setShowDbBox] = useState(false);
  const [customSbUrl, setCustomSbUrl] = useState('');
  const [customSbKey, setCustomSbKey] = useState('');
  const [sbCredMsg, setSbCredMsg] = useState('');

  useEffect(() => {
    // 1. Initial config check
    const isConfig = isSupabaseConfigured();
    setDbConfigured(isConfig);
    const cfg = getSupabaseConfig();
    setCustomSbUrl(cfg.url || '');
    setCustomSbKey(cfg.key || '');

    // 2. Load from cache if available for instant display
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) {
        setForm(prev => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch {}

    // 3. Load from API and Supabase
    const loadSettings = async () => {
      try {
        // Try serverless API first
        try {
          const apiRes = await fetch('/api/settings');
          if (apiRes.ok) {
            const apiJson = await apiRes.json();
            if (apiJson?.data) {
              setForm(prev => ({
                ...prev,
                ...apiJson.data,
                association_short_name: apiJson.data.association_short_name || apiJson.data.association_short || prev.association_short_name,
                show_donations: apiJson.data.show_donations !== undefined ? Boolean(apiJson.data.show_donations) : (apiJson.data.show_donation !== undefined ? Boolean(apiJson.data.show_donation) : prev.show_donations),
                show_bank: apiJson.data.show_bank !== undefined ? Boolean(apiJson.data.show_bank) : prev.show_bank
              }));
              try { localStorage.setItem('site_settings', JSON.stringify(apiJson.data)); } catch {}
            }
          }
        } catch (apiErr) {
          console.warn('API /api/settings load warning:', apiErr);
        }

        // Try direct Supabase if configured
        if (isConfig) {
          try {
            const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
            if (!error && data) {
              setForm(prev => ({
                ...prev,
                ...data,
                association_short_name: data.association_short_name || data.association_short || prev.association_short_name,
                show_donations: data.show_donations !== undefined ? Boolean(data.show_donations) : (data.show_donation !== undefined ? Boolean(data.show_donation) : prev.show_donations),
                show_bank: data.show_bank !== undefined ? Boolean(data.show_bank) : prev.show_bank
              }));
              try { localStorage.setItem('site_settings', JSON.stringify(data)); } catch {}
            }
          } catch (sbErr) {
            console.warn('Supabase direct load warning:', sbErr);
          }
        }
      } catch (err) {
        console.warn('Error loading site_settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
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

      // Important: strip id and created_at to prevent PGRST125
      const { id, created_at, ...dataToSave } = form;
      dataToSave.updated_at = new Date().toISOString();

      // 1. SAVE IMMEDIATELY to localStorage so changes are NEVER lost
      const localPayload = { ...form, ...dataToSave };
      try {
        localStorage.setItem('site_settings', JSON.stringify(localPayload));

        // Sync to CMS database (amsed_cms_database_v3)
        const rawCms = localStorage.getItem('amsed_cms_database_v3');
        const cmsObj = rawCms ? JSON.parse(rawCms) : {};
        if (!cmsObj.contact) cmsObj.contact = {};
        if (!cmsObj.logo) cmsObj.logo = {};

        cmsObj.association_full_name = localPayload.association_full_name;
        cmsObj.association_subtitle = localPayload.association_subtitle;
        cmsObj.top_bar_title = localPayload.top_bar_title;
        cmsObj.logo.name = localPayload.association_full_name;
        cmsObj.logo.motto = localPayload.top_bar_title || "الله • الوطن • الملك";
        if (localPayload.logo_url) cmsObj.logo.url = localPayload.logo_url;
        cmsObj.contact.phone1 = localPayload.phone1 || localPayload.phone;
        cmsObj.contact.phone2 = localPayload.phone2;
        cmsObj.contact.phone3 = localPayload.phone3;
        cmsObj.contact.lat = localPayload.lat;
        cmsObj.contact.lng = localPayload.lng;
        cmsObj.contact.mapUrl = `https://www.google.com/maps?q=${localPayload.lat || '34.250676'},${localPayload.lng || '-6.540316'}`;

        localStorage.setItem('amsed_cms_database_v3', JSON.stringify(cmsObj));

        // Broadcast events to all active components
        window.dispatchEvent(new Event('cms-update'));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.warn('Local CMS sync warning:', e);
      }

      // Sync to Firestore siteSettings/main
      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("../../firebase");
        if (db) {
          await setDoc(doc(db, "siteSettings", "main"), {
            ...localPayload,
            logoUrl: localPayload.logo_url || localPayload.logoUrl || "/logo_amesd_original_transparent.png",
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (fsErr) {
        console.warn('Firestore sync notice:', fsErr);
      }

      let syncedToDb = false;

      // 2. Call serverless API /api/settings
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.synced) {
            syncedToDb = true;
          }
        }
      } catch (apiErr) {
        console.warn('API save notice:', apiErr);
      }

      // 3. If direct Supabase is configured and not yet confirmed synced, attempt direct update
      if (!syncedToDb && isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from('site_settings')
            .update(dataToSave)
            .eq('id', 1);

          if (!error) {
            syncedToDb = true;
          } else {
            console.warn('Supabase direct update error:', error);
          }
        } catch (dbErr) {
          console.warn('Direct Supabase fetch caught:', dbErr);
        }
      }

      // 4. Update UI Status without blocking modal alerts
      if (syncedToDb) {
        setSavedStatus('success');
        setSavedMessage('تم الحفظ بنجاح في قاعدة بيانات Supabase (site_settings) وتحديث الموقع فوراً ✅');
      } else {
        setSavedStatus('info');
        setSavedMessage('تم حفظ التعديلات محلياً وتحديث الموقع بنجاح ✅ (وفي انتظار مزامنة Supabase السحابية)');
      }

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

        {/* Association Name Font Styles (أنماط كتابة اسم الجمعية) */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold text-slate-700">✨ نمط وخط كتابة اسم الجمعية في أعلى الموقع (الترويسة)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { id: 'andalusian', name: '👑 أندلسي مغربي مذهب', preview: 'تدرج ذهبي ملكي فاخر', cls: 'bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-900 bg-clip-text text-transparent font-black font-serif' },
              { id: 'kufi', name: '🏛️ كوفي مغربي عريض', preview: 'خط هندسي أصيل ورصين', cls: 'text-emerald-950 font-black tracking-wider' },
              { id: 'thuluth', name: '📜 ثلث أميري راقي', preview: 'خط تراثي كلاسيكي فخم', cls: 'text-emerald-900 font-black font-serif' },
              { id: 'diwani', name: '✨ ديواني مزخرف', preview: 'انسيابي بألوان متدرجة', cls: 'bg-gradient-to-r from-emerald-900 via-teal-800 to-amber-700 bg-clip-text text-transparent font-bold' },
              { id: 'royal_green', name: '🌿 أخضر ملكي مغربي', preview: 'أخضر موحد مع هيبة ملكية', cls: 'text-[#044e3b] font-black' },
              { id: 'modern_gold', name: '💎 عصري تقني بظلال نحاسية', preview: 'خط عصري وواضح جداً', cls: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 bg-clip-text text-transparent font-extrabold' }
            ].map(st => (
              <div
                key={st.id}
                onClick={() => setForm(prev => ({ ...prev, association_name_style: st.id }))}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition text-center ${
                  (form.association_name_style || 'andalusian') === st.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 mb-1">{st.name}</div>
                <div className={`text-xs ${st.cls} truncate`}>
                  {form.association_short_name || 'AMSED'} • {st.preview}
                </div>
              </div>
            ))}
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
