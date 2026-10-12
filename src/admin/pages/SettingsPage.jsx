import React, { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [s, setS] = useState({
    address_ar: '',
    phone: '',
    show_donation: false,
    show_bank: false
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTestRun = async () => {
    setLoading(true);
    try {
      // كنعيطو على نفس الـ API اللي كيخدم بيه الكرون
      const res = await fetch('/api/autonomous-publish', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ تنشر: ${data.ar || data.published}`);
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
      if (cached) setS(JSON.parse(cached));
    } catch {}

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
    try {
      localStorage.setItem('site_settings', JSON.stringify(s));
    } catch {}

    try {
      await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(s),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.warn('Sync notice:', e);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6" dir="rtl">
      <h1 className="text-2xl font-black text-slate-900">⚙️ إعدادات الموقع</h1>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <label className="block font-bold text-slate-800">📍 العنوان (يظهر فالأسفل فقط)</label>
        <input 
          value={s.address_ar || ''} 
          onChange={e => setS({ ...s, address_ar: e.target.value })} 
          className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
          placeholder="SAKNIA 30 LOT EL HIZAM..." 
        />
        
        <label className="block font-bold text-slate-800 mt-4">📞 رقم الهاتف</label>
        <input 
          value={s.phone || ''} 
          dir="ltr" 
          onChange={e => setS({ ...s, phone: e.target.value })} 
          className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-left" 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input 
              type="checkbox" 
              checked={!s.show_donation} 
              onChange={e => setS({ ...s, show_donation: !e.target.checked })} 
              className="w-5 h-5 text-emerald-600 rounded" 
            />
            <span className="font-bold text-sm text-slate-800">
              {s.show_donation ? '✅ التبرعات ظاهرة' : '🚫 إخفاء التبرعات'}
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input 
              type="checkbox" 
              checked={!s.show_bank} 
              onChange={e => setS({ ...s, show_bank: !e.target.checked })} 
              className="w-5 h-5 text-emerald-600 rounded" 
            />
            <span className="font-bold text-sm text-slate-800">
              {s.show_bank ? '✅ الحساب البنكي ظاهر' : '🚫 إخفاء الحساب البنكي'}
            </span>
          </label>
        </div>

        <button 
          onClick={save} 
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-black mt-6 transition shadow"
        >
          حفظ التعديلات
        </button>

        {saved && (
          <p className="text-emerald-700 text-center font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 animate-fadeIn">
            ✅ تم الحفظ - الموقع تجدد تلقائيا
          </p>
        )}
      </div>

      {/* قسم اختبار وتوليد المقالات الآلي */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-amber-400">⚡ اختبار وتوليد فوري (Test Run)</h3>
        <p className="text-xs text-slate-300">
          استدعاء مسار النشر الذاتي <code>/api/autonomous-publish</code> لتجربة توليد مقال جديد بـ 3 لغات من خزان المواضيع فوراً:
        </p>
        <button 
          onClick={handleTestRun} 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-xl font-black transition shadow cursor-pointer"
        >
          {loading ? 'جاري التوليد...' : '⚡ اختبار وتوليد فوري (Test Run)'}
        </button>
      </div>

      <p className="text-sm text-slate-500">
        ملي تخفيهم من هنا - غادي يختفيو مباشرة من asso-amsed.vercel.app بلا ما تمسح الكود
      </p>
    </div>
  );
}

export { SettingsPage };
