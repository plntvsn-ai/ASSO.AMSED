import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { 
  BarChart3, Save, Check, Smile, Sparkles, 
  GraduationCap, Users, Heart, Award, ShieldCheck 
} from 'lucide-react';

const availableIcons = [
  { id: 'Smile', label: 'ابتسامة', icon: Smile },
  { id: 'Sparkles', label: 'نجوم وتأهيل', icon: Sparkles },
  { id: 'GraduationCap', label: 'تعليم ومدرسة', icon: GraduationCap },
  { id: 'Users', label: 'فريق ومتطوعون', icon: Users },
  { id: 'Heart', label: 'قلب وتضامن', icon: Heart },
  { id: 'Award', label: 'تميز وشارة', icon: Award },
  { id: 'ShieldCheck', label: 'حماية وأمان', icon: ShieldCheck },
];

export const StatsAdmin = () => {
  const { cmsData, updateStats } = useCms();
  const [stats, setStats] = useState(cmsData.stats || {
    s1_val: "+650", s1_label: "طفل مستفيد سنوياً", s1_icon: "Smile",
    s2_val: "+45", s2_label: "مستفيد في ورشات المهارات المهنية", s2_icon: "Sparkles",
    s3_val: "+80", s3_label: "طفل مدمج بالمدارس مع مرافقة AVS", s3_icon: "GraduationCap",
    s4_val: "+85", s4_label: "متطوع ومتطوعة وأطر تربوية", s4_icon: "Users",
    show_stats: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    try {
      const siteSet = localStorage.getItem('site_settings');
      if (siteSet) {
        const parsed = JSON.parse(siteSet);
        if (parsed.show_stats !== undefined) {
          setStats(prev => ({ ...prev, show_stats: Boolean(parsed.show_stats) }));
        }
      }
    } catch {}

    if (cmsData?.stats) {
      setStats(prev => ({ ...prev, ...cmsData.stats }));
    }
    setLoading(false);
  }, [cmsData?.stats]);

  const handleFieldChange = (key, val) => {
    setStats(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    updateStats(stats);
    try {
      const siteSet = localStorage.getItem('site_settings');
      const parsed = siteSet ? JSON.parse(siteSet) : {};
      parsed.show_stats = stats.show_stats !== false;
      localStorage.setItem('site_settings', JSON.stringify(parsed));
    } catch {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const renderIcon = (iconName) => {
    const found = availableIcons.find(i => i.id === iconName);
    const IconComp = found ? found.icon : Smile;
    return <IconComp className="w-5 h-5 text-emerald-400" />;
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-700" />
            <span>تعديل الأرقام والإحصائيات الأربعة (/admin/stats)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إحصائيات الأثر الميداني: القيمة، النص التوضيحي، والأيقونة مع زر الإخفاء والإظهار والمعاينة الفورية
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Save className="w-5 h-5" />
          <span>حفظ التعديلات في الموقع</span>
        </button>
      </div>

      {/* Show/Hide Toggle Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={stats.show_stats !== false}
            onChange={(e) => handleFieldChange('show_stats', e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded"
          />
          <div>
            <div className="font-extrabold text-sm text-slate-900">
              {stats.show_stats !== false ? '✅ شريط الإحصائيات ظاهر في الصفحة' : '🚫 شريط الإحصائيات مخفي من الصفحة'}
            </div>
            <div className="text-xs text-slate-500">
              يمكنك النقر هنا لإخفاء أو إظهار شريط الأرقام والإحصائيات الأربعة بالكامل من واجهة الموقع
            </div>
          </div>
        </label>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ الإحصائيات بنجاح وتحديثها في الموقع!</span>
        </div>
      )}

      {/* Live Preview Strip */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl">
        <span className="text-xs text-amber-400 font-bold block mb-4">★ المعاينة المباشرة لشريط الأرقام:</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-slate-900 mx-auto flex items-center justify-center mb-2">
                {renderIcon(stats[`s${idx}_icon`])}
              </div>
              <div className="text-2xl font-black text-emerald-400 mb-1">{stats[`s${idx}_val`]}</div>
              <div className="text-xs text-slate-300 font-medium">{stats[`s${idx}_label`]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Cards for each of the 4 stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-slate-900 text-sm">الإحصائية رقم #{idx}</span>
              <span className="text-xs font-mono text-emerald-700 font-bold">s{idx}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">القيمة أو العدد (Value)</label>
              <input
                type="text"
                value={stats[`s${idx}_val`] || ''}
                onChange={(e) => handleFieldChange(`s${idx}_val`, e.target.value)}
                placeholder="+500"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">النص التوضيحي (Label)</label>
              <input
                type="text"
                value={stats[`s${idx}_label`] || ''}
                onChange={(e) => handleFieldChange(`s${idx}_label`, e.target.value)}
                placeholder="طفل مستفيد..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الأيقونة المرافقة</label>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map(ic => {
                  const IconC = ic.icon;
                  const isSelected = stats[`s${idx}_icon`] === ic.id;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => handleFieldChange(`s${idx}_icon`, ic.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <IconC className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{ic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
