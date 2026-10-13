import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { DashboardOverview } from './DashboardOverview';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [masterStatus, setMasterStatus] = useState('شغال 🟢');
  const [lastArticleTime, setLastArticleTime] = useState('اليوم');

  useEffect(() => {
    (async () => {
      try {
        if (db) {
          const rSnap = await getDoc(doc(db, "robot_settings", "master"));
          if (rSnap.exists()) {
            const data = rSnap.data();
            setMasterStatus(data.enabled ? (data.status === 'running' ? 'كيخدم... ⏳' : 'شغال 🟢') : 'متوقف 🔴');
            if (data.last_run) {
              setLastArticleTime(new Date(data.last_run).toLocaleTimeString('ar-MA'));
            }
          }
          const aSnap = await getDocs(query(collection(db, "articles"), limit(1)));
          if (!aSnap.empty) {
            const artData = aSnap.docs[0].data();
            if (artData.created_at) {
              setLastArticleTime(new Date(artData.created_at).toLocaleTimeString('ar-MA'));
            }
          }
        }
      } catch (e) {
        console.warn("Dashboard fetch notice:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Robot Summary Widget (Required Item 4) */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-extrabold text-lg flex items-center gap-2">🤖 حالة الروبوتات</h3>
          <p className="text-sm opacity-95 mt-1 font-medium">
            الماستر: <span className="font-bold underline">{masterStatus}</span> | آخر مقال: <span className="font-bold">{lastArticleTime}</span>
          </p>
        </div>
        <a
          href="/am-ctrl-9k2l8x-2026-secure-panel-77/robots"
          className="bg-white text-blue-600 font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-blue-50 transition shadow inline-block"
        >
          دخول إعدادات الروبوتات
        </a>
      </div>

      <DashboardOverview />
    </div>
  );
}
export { Dashboard };
