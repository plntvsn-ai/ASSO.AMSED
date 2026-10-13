import React, { useState, useEffect } from 'react';

const DEFAULT_ROBOTS = [
  { id: 'master', name: 'master', name_ar: '🤖 الماستر - القائد', enabled: true, cron_time: '09:00', prompt_template: 'كتب مقال عن التوحد عند الأطفال لجمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء', status: 'idle' },
  { id: 'seo_linking', name: 'seo_linking', name_ar: '🔗 روبوت الربط الداخلي', enabled: true, cron_time: '09:00', prompt_template: 'اختار 3 مقالات مشابهة للربط', status: 'idle' },
  { id: 'seo_schema', name: 'seo_schema', name_ar: '⭐ روبوت النجوم والـ Schema', enabled: true, cron_time: '09:00', prompt_template: 'schema with aggregateRating 4.8', status: 'idle' },
  { id: 'seo_refresher', name: 'seo_refresher', name_ar: '♻️ روبوت تحديث القديم', enabled: true, cron_time: '09:00', prompt_template: 'كل جمعة جدد مقال قديم بفقرة 2026', status: 'idle' },
  { id: 'facebook', name: 'facebook', name_ar: '📘 روبوت فايسبوك', enabled: true, cron_time: '09:00', prompt_template: '{"token_env": "FB_TOKEN"}', status: 'idle' },
  { id: 'instagram', name: 'instagram', name_ar: '📸 روبوت انستغرام', enabled: false, cron_time: '09:00', prompt_template: '{"token_env": "IG_TOKEN"}', status: 'idle' },
  { id: 'image_alt', name: 'image_alt', name_ar: '📸 روبوت وصف الصور ALT', enabled: true, cron_time: '09:00', prompt_template: 'alt="جمعية امسد..."', status: 'idle' }
];

export const RobotsAdmin = () => {
  const [robots, setRobots] = useState(DEFAULT_ROBOTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/robots');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setRobots(data);
      }
    } catch {
      // Use fallback defaults
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setRobots(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleChange = (id, field, val) => {
    setRobots(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/robots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(robots),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: '✅ تم حفظ جميع إعدادات الروبوتات بنجاح في السيرفر والقاعدة!', type: 'success' });
      } else {
        setMessage({ text: 'حدث خطأ أثناء الحفظ', type: 'error' });
      }
    } catch {
      setMessage({ text: 'فشل الاتصال بالخادم', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestRobot = async (id) => {
    setTestingId(id);
    setMessage(null);
    try {
      const res = await fetch('/api/cron/master', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `🚀 تم تشغيل الروبوت بنجاح! المقال المُنشأ: ${data.article || 'تم'}`, type: 'success' });
        fetchRobots();
      } else {
        setMessage({ text: `فشل التشغيل: ${data.error || data.skipped || 'خطأ غير معروف'}`, type: 'error' });
      }
    } catch (e) {
      setMessage({ text: `فشل التشغيل: ${e.message}`, type: 'error' });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            🤖 مركز قيادة الروبوتات الذكية - AMSED MASTER
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            إدارة مركزية لجميع الروبوتات الـ 10 (الماستر، الربط الداخلي، السكيما، التحديث، السوشيال ميديا، والصور)
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition disabled:opacity-50 text-base cursor-pointer"
        >
          {saving ? 'جارٍ الحفظ...' : '💾 حفظ كل التعديلات'}
        </button>
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-bold underline cursor-pointer">
            إغلاق
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">جاري تحميل إعدادات الروبوتات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {robots.map(robot => (
            <div
              key={robot.id}
              className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition-all ${
                robot.enabled ? 'border-slate-200 ring-1 ring-emerald-500/10' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{robot.name_ar || robot.name}</h3>
                    <span className="text-xs font-mono text-slate-400">ID: {robot.id}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={robot.enabled}
                      onChange={() => handleToggle(robot.id)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">وقت التشغيل</label>
                    <input
                      type="time"
                      value={robot.cron_time || '09:00'}
                      onChange={e => handleChange(robot.id, 'cron_time', e.target.value)}
                      className="w-full text-sm font-mono border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">آخر تشغيل</label>
                    <div className="text-xs font-mono p-2.5 rounded-lg bg-slate-100 text-slate-600 truncate">
                      {robot.last_run ? new Date(robot.last_run).toLocaleString('ar-MA') : 'لم يتم بعد'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">البرومبت / الإعدادات الخاصة</label>
                  <textarea
                    rows={3}
                    value={robot.prompt_template || ''}
                    onChange={e => handleChange(robot.id, 'prompt_template', e.target.value)}
                    placeholder="أدخل نص البرومبت أو التكوين..."
                    className="w-full text-xs font-mono border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    robot.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {robot.enabled ? '● نشط' : '○ متوقف'}
                </span>

                <button
                  onClick={() => handleTestRobot(robot.id)}
                  disabled={testingId === robot.id || !robot.enabled}
                  className="text-xs font-bold px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition disabled:opacity-40 cursor-pointer"
                >
                  {testingId === robot.id ? 'جارٍ الاختبار...' : '⚡ تجربة تشغيل'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="text-center pt-6 pb-12">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="w-full md:w-auto min-w-[320px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transition text-xl disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'جارٍ حفظ الإعدادات...' : '💾 حفظ كل التعديلات'}
        </button>
      </div>
    </div>
  );
};

export default RobotsAdmin;
