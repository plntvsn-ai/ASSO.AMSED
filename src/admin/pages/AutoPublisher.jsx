import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { AutoPublisherAdmin } from './AutoPublisherAdmin';

export default function AutoPublisher() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (db) {
          const snap = await getDoc(doc(db, "siteSettings", "main"));
        }
      } catch (e) {
        console.error("AutoPublisher fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  return <AutoPublisherAdmin />;
}
export { AutoPublisher };
