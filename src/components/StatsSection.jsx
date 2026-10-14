import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCms } from '../context/CmsContext';
import { useLanguage } from '../context/LanguageContext';
import { Smile, Sparkles, GraduationCap, Users } from 'lucide-react';

export default function StatsSection() {
  const { cmsData } = useCms();
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState({
    s1_val: "+650",
    s1_label: "طفل مستفيد سنوياً",
    s2_val: "+45",
    s2_label: "مستفيد في ورشات المهارات المهنية",
    s3_val: "+80",
    s3_label: "طفل مدمج بالمدارس مع مرافقة AVS",
    s4_val: "+85",
    s4_label: "متطوع ومتطوعة وأطر تربوية",
    show_stats: true
  });

  useEffect(() => {
    try {
      const siteSet = localStorage.getItem('site_settings');
      if (siteSet) {
        const parsed = JSON.parse(siteSet);
        if (parsed.show_stats !== undefined) {
          setStats(prev => ({ ...prev, show_stats: Boolean(parsed.show_stats) }));
        }
      }
    } catch {}

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

  if (stats.show_stats === false) {
    return null;
  }

  const items = [
    { 
      val: stats.s1_val, 
      label: lang === 'ar' ? stats.s1_label : lang === 'fr' ? 'Enfants bénéficiaires par an' : 'Children assisted yearly', 
      icon: Smile, 
      color: "text-amber-300 bg-emerald-950/80 border-amber-400/40" 
    },
    { 
      val: stats.s2_val, 
      label: lang === 'ar' ? stats.s2_label : lang === 'fr' ? 'Bénéficiaires en ateliers métiers' : 'Beneficiaries in skills workshops', 
      icon: Sparkles, 
      color: "text-amber-300 bg-emerald-950/80 border-amber-400/40" 
    },
    { 
      val: stats.s3_val, 
      label: lang === 'ar' ? stats.s3_label : lang === 'fr' ? 'Enfants scolarisés avec AVS' : 'Children included in schools with AVS', 
      icon: GraduationCap, 
      color: "text-amber-300 bg-emerald-950/80 border-amber-400/40" 
    },
    { 
      val: stats.s4_val, 
      label: lang === 'ar' ? stats.s4_label : lang === 'fr' ? 'Bénévoles & Éducateurs' : 'Volunteers & Educators', 
      icon: Users, 
      color: "text-amber-300 bg-emerald-950/80 border-amber-400/40" 
    }
  ];

  return (
    <section className="relative py-10 px-4 bg-gradient-to-r from-emerald-950 via-[#0a4a3a] to-emerald-950 text-white border-y-2 border-amber-400/50 shadow-xl overflow-hidden">
      {/* Moroccan Zellij Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Moroccan Heading */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-black/40 px-3.5 py-1 rounded-full border border-amber-400/40">
            <span>۞</span>
            <span>
              {lang === 'ar' 
                ? 'أرقام وإحصائيات الأثر الميداني • جمعية AMSED بالقنيطرة' 
                : lang === 'fr' 
                ? 'Impact de Terrain & Chiffres Clés • AMSED Kénitra' 
                : 'Field Impact & Key Figures • AMSED Kenitra'}
            </span>
            <span>۞</span>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <div 
                key={idx} 
                className={`p-5 sm:p-6 rounded-3xl border-2 ${it.color} shadow-lg transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-2xl relative overflow-hidden group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 mx-auto flex items-center justify-center mb-3 shadow-md group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300 mb-1 font-mono tracking-tight">{it.val}</div>
                <div className="text-xs sm:text-sm text-slate-200 font-bold leading-snug">{it.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export { StatsSection };
