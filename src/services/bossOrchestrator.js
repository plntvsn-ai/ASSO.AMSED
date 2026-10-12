import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

export async function runBoss() {
  const logs = [];
  const timestamp = new Date().toISOString();

  try {
    let robots = [];
    if (db) {
      const snap = await getDocs(collection(db, 'robot_settings'));
      robots = snap.docs.map(d => d.data());
    }

    if (!robots.length) {
      const saved = localStorage.getItem('amsed_robot_settings');
      if (saved) robots = JSON.parse(saved);
    }

    // 1. Check for any robot with error status
    for (const robot of robots) {
      if (robot.id === 'boss') continue;
      if (robot.status === 'error') {
        logs.push(`🚨 ${robot.name_ar || robot.id} كان فيه عطب - تمت إعادة التهيئة الذاتية`);
        if (db) {
          try {
            await updateDoc(doc(db, 'robot_settings', robot.id), {
              status: 'idle',
              retry_count: (robot.retry_count || 0) + 1
            });
          } catch {}
        }
      }
    }

    // 2. Trigger master pipeline if enabled
    const master = robots.find(r => r.id === 'master');
    if (master && master.enabled !== false) {
      try {
        const res = await fetch('/api/cron/master', { method: 'POST' });
        const resJson = await res.json();
        if (resJson.success) {
          logs.push(`✅ الماستر أنتج مقال جديد: ${resJson.article || 'بنجاح'}`);
        } else {
          logs.push(`⚠️ الماستر: ${resJson.error || resJson.skipped || 'لم يُنتج مقالاً'}`);
        }
      } catch (e) {
        logs.push(`⚠️ تعذر استدعاء الماستر كرون: ${e.message}`);
      }
    }

    logs.push(`✅ جولة الشاف اكتملت - فحص ${robots.length} عناصر - ${new Date().toLocaleTimeString('ar-MA')}`);

    // 3. Save logs in firestore
    const logEntry = { logs, created_at: timestamp };
    if (db) {
      try {
        await addDoc(collection(db, 'boss_logs'), logEntry);
        await updateDoc(doc(db, 'robot_settings', 'boss'), {
          last_run: timestamp,
          status: 'idle'
        });
      } catch {}
    }

    return { success: true, logs, timestamp };
  } catch (err) {
    console.error('runBoss error:', err);
    return { success: false, error: err.message, logs };
  }
}

export default runBoss;
