import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { DashboardOverview } from './DashboardOverview';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (db) {
          const snap = await getDoc(doc(db, "siteSettings", "main"));
        }
      } catch (e) {
        console.error("Dashboard siteSettings fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  return <DashboardOverview />;
}
export { Dashboard };
