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
    <div className="py-5 px-4 bg-slate-900/90 backdrop-blur text-white rounded-2xl border border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div 
                key={idx} 
                className={`p-3.5 sm:p-4 rounded-xl border ${it.color} shadow transition hover:scale-105`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900/80 mx-auto flex items-center justify-center mb-1.5 shadow">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black mb-0.5">{it.val}</div>
                <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight">{it.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export { StatsSection };
