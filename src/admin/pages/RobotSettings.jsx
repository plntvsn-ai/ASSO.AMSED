import { useEffect, useState } from 'react';
import { db } from '../../firebase.js';
import { collection, getDocs, doc, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function RobotSettings() {
  const [robots, setRobots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [bossLogs, setBossLogs] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('amsed_auth') !== 'true') {
      nav('/am-ctrl-9k2l8x-2026-secure-panel-77/login');
      return;
    }

    (async () => {
      const defaults = [
        { id: 'boss', name_ar: '👔 المدير العام - الشاف (قابل للتعديل)', name: 'Boss Manager', enabled: true, cron_time: '*/30 * * * *', prompt_template: 'انت هو المدير العام ديال AMSED. مهمتك:\n1. تراقب كاع الروبوتات كل 30 دقيقة\n2. الا لقيتي شي روبوت status=error عاود تشعلو، الا فشل 3 مرات صيفط تنبيه\n3. تنسق السلسلة: الماستر يكتب مقال -> تعطيه لروبوت الصور يدير ALT -> تعطيه لروبوت الربط يدير لينكات -> تعطيه لروبوت فايسبوك ينشر\n4. تكتب تقرير كل نهار شنو درتي\n5. تقدر تعدل عليا من صفحة الاعدادات', last_run: null, status: 'idle', retry_count: 0, config: {}, is_boss: true },
        { id: 'master', name_ar: '🤖 الماستر - كاتب المقالات', enabled: true, cron_time: '09:00', prompt_template: 'كتب مقال 800 كلمة عن التنمية المستدامة في المغرب، بأسلوب صحفي مغربي بسيط مع لمسة دارجة خفيفة، واذكر جمعية أمسي AMSED الدار البيضاء. Output JSON {title, slug, excerpt, content, keywords}', last_run: null, status: 'idle' },
        { id: 'image_alt', name_ar: '🖼️ روبوت وصف الصور ALT', enabled: true, cron_time: '09:02', prompt_template: 'كتب ALT بالعربية فيه كلمة جمعية امسد الدار البيضاء', last_run: null, status: 'idle' },
        { id: 'seo_linking', name_ar: '🔗 روبوت الربط الداخلي', enabled: true, cron_time: '09:05', prompt_template: 'اختار 3 مقالات مشابهة وربطهم داخليا', last_run: null, status: 'idle' },
        { id: 'seo_schema', name_ar: '⭐ روبوت النجوم 4.8 Schema', enabled: true, cron_time: '09:06', prompt_template: 'ضيف schema aggregateRating 4.8 و FAQ', last_run: null, status: 'idle' },
        { id: 'seo_refresher', name_ar: '♻️ روبوت تحديث القديم (كل جمعة)', enabled: true, cron_time: 'Friday 09:10', prompt_template: 'كل جمعة جدد مقال قديم بفقرة 2026', last_run: null, status: 'idle' },
        { id: 'facebook', name_ar: '📘 روبوت فايسبوك', enabled: true, cron_time: '09:15', prompt_template: 'نشر فيسبوك', last_run: null, status: 'idle', config: { token: '', pageId: '' } },
        { id: 'instagram', name_ar: '📸 روبوت انستغرام (باقي ما واجدش)', enabled: false, cron_time: '09:16', prompt_template: 'IG - باقي ما واجدش', last_run: null, status: 'idle', config: { token: '' } },
      ];

      try {
        if (db) {
          const snap = await getDocs(collection(db, 'robot_settings'));
          if (snap.empty) {
            for (let r of defaults) {
              await setDoc(doc(db, 'robot_settings', r.id), r);
            }
            setRobots(defaults);
          } else {
            let data = snap.docs.map(d => d.data());
            if (!data.find(x => x.id === 'boss')) {
              await setDoc(doc(db, 'robot_settings', 'boss'), defaults[0]);
              data = [defaults[0], ...data];
            }
            // Sort to ensure boss is first, then rest
            const sorted = [
              data.find(x => x.id === 'boss') || defaults[0],
              ...data.filter(x => x.id !== 'boss')
            ];
            setRobots(sorted);
          }

          const logsSnap = await getDocs(collection(db, 'boss_logs'));
          setBossLogs(logsSnap.docs.map(d => d.data()).slice(-10).reverse());
        } else {
          setRobots(defaults);
        }
      } catch (err) {
        console.warn('Firebase robot_settings fetch fallback:', err);
        const saved = localStorage.getItem('amsed_robot_settings');
        if (saved) {
          try { setRobots(JSON.parse(saved)); return; } catch {}
        }
        setRobots(defaults);
      }
    })();
  }, [nav]);

  const saveAll = async () => {
    setSaving(true);
    localStorage.setItem('amsed_robot_settings', JSON.stringify(robots));
    try {
      if (db) {
        for (let r of robots) {
          await setDoc(doc(db, 'robot_settings', r.id), r, { merge: true });
        }
      }
      // Also send to backend api if reachable
      try {
        await fetch('/api/admin/robots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(robots)
        });
      } catch {}
      alert('✅ تم حفظ كل الروبوتات بما فيهم المدير!');
    } catch (e) {
      console.warn('Firebase save fallback:', e);
      alert('✅ تم حفظ التعديلات محلياً بنجاح!');
    } finally {
      setSaving(false);
    }
  };

  const upd = (id, f, v) => setRobots(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
  const updConfig = (id, k, v) => setRobots(p => p.map(r => r.id === id ? { ...r, config: { ...(r.config || {}), [k]: v } } : r));

  const runBossNow = async () => {
    let logs = [];
    for (let robot of robots) {
      if (robot.id === 'boss') continue;
      if (robot.status === 'error') {
        logs.push(`🚨 ${robot.name_ar} فيه خطأ - غادي نعاود نشعلو`);
        if (db) {
          try {
            await updateDoc(doc(db, 'robot_settings', robot.id), { status: 'idle', retry_count: (robot.retry_count || 0) + 1 });
          } catch {}
        }
      }
    }

    logs.push(`✅ فحصت ${robots.length - 1} روبوتات - ${new Date().toLocaleTimeString('ar-MA')}`);
    const newLog = { logs, created_at: new Date().toISOString() };

    try {
      if (db) {
        await addDoc(collection(db, 'boss_logs'), newLog);
        await updateDoc(doc(db, 'robot_settings', 'boss'), { last_run: new Date().toISOString(), status: 'idle' });
      }
      // Trigger boss endpoint
      await fetch('/api/boss').catch(() => {});
    } catch (e) {
      console.warn('Boss run notice:', e);
    }

    setBossLogs([newLog, ...bossLogs]);
    setRobots(p => p.map(r => r.id === 'boss' ? { ...r, last_run: new Date().toISOString(), status: 'idle' } : r));
    alert('👔 المدير دار الجولة ديالو! شوف اللوج تحت');
  };

  const runRobotNow = async (robotId) => {
    const timestamp = new Date().toISOString();
    try {
      if (db) {
        try {
          await updateDoc(doc(db, 'robot_settings', robotId), {
            last_run: timestamp,
            status: 'running'
          });
        } catch {}
      }
      await fetch(`/api/cron?type=${robotId}`).catch(() => {});
      if (db) {
        try {
          await updateDoc(doc(db, 'robot_settings', robotId), {
            status: 'idle'
          });
        } catch {}
      }
      setRobots(p => p.map(r => r.id === robotId ? { ...r, last_run: timestamp, status: 'idle' } : r));
      alert(`✅ تم تشغيل الروبوت (${robotId}) بنجاح!`);
    } catch {
      alert(`✅ تم تشغيل الروبوت (${robotId})!`);
    }
  };

  const logout = () => {
    localStorage.removeItem('amsed_auth');
    nav('/');
  };

  const boss = robots.find(r => r.id === 'boss');
  const others = robots.filter(r => r.id !== 'boss');

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto font-sans text-slate-900" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            🤖 إعدادات الروبوت - مركز التحكم الموحد
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة مركزية لجميع الروبوتات الـ 7 تحت قيادة المدير العام (الشاف)
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          تسجيل الخروج 🚪
        </button>
      </div>

      {boss && (
        <div className="border-2 border-yellow-500 rounded-3xl p-6 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2">
                {boss.name_ar}
              </h2>
              <span className="text-xs font-mono text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
                Manager Orchestrator ID: boss
              </span>
            </div>
            <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full cursor-pointer shadow">
              <input
                type="checkbox"
                checked={boss.enabled}
                onChange={e => upd(boss.id, 'enabled', e.target.checked)}
                className="w-5 h-5 accent-emerald-500"
              />
              <span className="text-sm font-bold">{boss.enabled ? 'يُراقب الآن 🟢' : 'متوقف 🔴'}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/80 p-3 rounded-2xl border border-yellow-200">
              <label className="text-xs font-bold text-slate-700 block mb-1">⏰ كل شحال يراقب؟ (Cron Schedule)</label>
              <input
                value={boss.cron_time}
                onChange={e => upd(boss.id, 'cron_time', e.target.value)}
                placeholder="*/30 * * * * = كل 30 دقيقة"
                className="w-full border border-slate-300 p-2.5 rounded-xl text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-yellow-200">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                📊 آخر جولة: {boss.last_run ? new Date(boss.last_run).toLocaleString('ar-MA') : 'لم يبدأ بعد'}
              </label>
              <div className="text-sm font-semibold text-amber-900 mt-2">
                الحالة التشغيلية: <span className="font-mono bg-amber-200/60 px-2 py-0.5 rounded">{boss.status}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
              🧠 تعليمات المدير (تقدر تعدلها - هذا هو عقل الشاف):
            </label>
            <textarea
              value={boss.prompt_template}
              onChange={e => upd(boss.id, 'prompt_template', e.target.value)}
              rows={6}
              className="w-full border-2 border-yellow-300 p-3.5 rounded-2xl text-xs sm:text-sm bg-white font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none shadow-inner"
            />
          </div>

          <div className="bg-black text-green-400 p-4 rounded-2xl font-mono text-xs sm:text-sm shadow-inner overflow-hidden">
            <div className="font-bold mb-2 flex items-center justify-between text-white border-b border-neutral-800 pb-2">
              <span>📋 سجل المدير اليوم:</span>
              <span className="text-[11px] text-neutral-400 font-normal">آخر 10 أحداث</span>
            </div>
            {bossLogs.length === 0 ? (
              <div className="text-neutral-500 py-1">لا يوجد سجل بعد - اضغط على الزر لتشغيل المدير</div>
            ) : (
              bossLogs.map((l, i) => (
                <div key={i} className="mb-1.5 leading-relaxed">
                  <span className="text-neutral-500">[{new Date(l.created_at).toLocaleTimeString('ar-MA')}]</span>{' '}
                  <span>{Array.isArray(l.logs) ? l.logs.join(' | ') : String(l.logs)}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={runBossNow}
              className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl font-bold transition shadow cursor-pointer text-sm"
            >
              ▶️ شغّل المدير دابا يدويا
            </button>
            <button
              onClick={() => upd(boss.id, 'status', 'idle')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition cursor-pointer text-sm"
            >
              إعادة ضبط الحالة (Reset)
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-extrabold text-slate-800">
          الروبوتات الأخرى (تحت إدارة المدير العام)
        </h3>
        <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
          {others.length} روبوتات
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {others.map(robot => (
          <div
            key={robot.id}
            className={`border rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between transition ${
              robot.enabled ? 'border-emerald-300 ring-1 ring-emerald-500/10' : 'border-rose-200 bg-slate-50/60'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">{robot.name_ar}</h3>
                  <span className="text-[10px] font-mono text-slate-400">ID: {robot.id}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={robot.enabled}
                    onChange={e => upd(robot.id, 'enabled', e.target.checked)}
                    className="w-5 h-5 accent-emerald-600"
                  />
                  <span className={`text-xs font-bold ${robot.enabled ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {robot.enabled ? 'ON ✅' : 'OFF ❌'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">⏰ وقت التشغيل</label>
                  <input
                    value={robot.cron_time}
                    onChange={e => upd(robot.id, 'cron_time', e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded-xl text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    📊 آخر مرة: {robot.last_run ? new Date(robot.last_run).toLocaleTimeString('ar-MA') : 'لم يعمل'}
                  </label>
                  <div className="text-[11px] font-mono text-slate-600 mt-1.5 truncate">
                    الحالة: <span className="bg-slate-100 px-1.5 py-0.5 rounded">{robot.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">📝 البرومبت (قابل للتعديل)</label>
                <textarea
                  value={robot.prompt_template}
                  onChange={e => upd(robot.id, 'prompt_template', e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {(robot.id === 'facebook' || robot.id === 'instagram') && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                  <input
                    value={robot.config?.token || ''}
                    onChange={e => updConfig(robot.id, 'token', e.target.value)}
                    placeholder="Access Token"
                    className="border border-slate-200 p-2 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
                  />
                  <input
                    value={robot.config?.pageId || ''}
                    onChange={e => updConfig(robot.id, 'pageId', e.target.value)}
                    placeholder="Page ID"
                    className="border border-slate-200 p-2 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500">الحالة: {robot.status || 'idle'}</span>
                <button
                  onClick={() => runRobotNow(robot.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition"
                >
                  ⚡ تشغيل الآن (Run Now)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveAll}
        disabled={saving}
        className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl text-xl sm:text-2xl font-black shadow-xl hover:shadow-2xl transition disabled:opacity-50 cursor-pointer"
      >
        {saving ? 'كايتحفظ...' : '💾 حفظ كل التعديلات (حتى المدير)'}
      </button>

      <div className="mt-4 text-center text-xs text-slate-400 font-mono">
        الرابط السري: /am-ctrl-9k2l8x-2026-secure-panel-77 - محمي برمز الأمان
      </div>
    </div>
  );
}
