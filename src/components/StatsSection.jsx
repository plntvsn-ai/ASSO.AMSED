import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCms } from '../context/CmsContext';
import { Smile, Sparkles, GraduationCap, Users } from 'lucide-react';

export default function StatsSection() {
  const { cmsData } = useCms();
  const [stats, setStats] = useState({
    s1_val: "+650",
    s1_label: "طفل مستفيد سنوياً",
    s2_val: "+45",
    s2_label: "مستفيد في ورشات المهارات المهنية",
    s3_val: "+80",
    s3_label: "طفل مدمج بالمدارس مع مرافقة AVS",
    s4_val: "+85",
    s4_label: "متطوع ومتطوعة وأطر تربوية"
  });

  useEffect(() => {
    if (db) {
      getDoc(doc(db, "siteStats", "main"))
        .then(snap => {
          if (snap.exists()) {
            setStats(prev => ({ ...prev, ...snap.data() }));
          }
        })
        .catch(() => {});
    } else if (cmsData?.stats) {
      setStats(prev => ({ ...prev, ...cmsData.stats }));
    }
  }, [cmsData?.stats]);

  const items = [
    { val: stats.s1_val, label: stats.s1_label, icon: Smile, color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
    { val: stats.s2_val, label: stats.s2_label, icon: Sparkles, color: "text-amber-400 bg-amber-950/60 border-amber-800/60" },
    { val: stats.s3_val, label: stats.s3_label, icon: GraduationCap, color: "text-blue-400 bg-blue-950/60 border-blue-800/60" },
    { val: stats.s4_val, label: stats.s4_label, icon: Users, color: "text-rose-400 bg-rose-950/60 border-rose-800/60" }
  ];

  return (
    <section className="py-8 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border ${it.color} shadow-lg transition hover:scale-105`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 mx-auto flex items-center justify-center mb-2 shadow">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black mb-1">{it.val}</div>
                <div className="text-xs sm:text-sm text-slate-300 font-semibold">{it.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export { StatsSection };
