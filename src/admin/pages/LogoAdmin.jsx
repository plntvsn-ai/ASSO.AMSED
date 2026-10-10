import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ImageUploader } from '../components/ImageUploader';
import { Award, Save, Check, Sparkles } from 'lucide-react';

export const LogoAdmin = () => {
  const { cmsData, updateLogo } = useCms();
  const [logo, setLogo] = useState(cmsData.logo || {
    url: "/logo.jpg",
    officialUrl: "/logo-official.jpg",
    name: "جمعية المبادرة المغربية للتكافل والتعاون",
    motto: "الله • الوطن • الملك"
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (cmsData?.logo) {
      setLogo(prev => ({ ...prev, ...cmsData.logo }));
    }
    setLoading(false);
  }, [cmsData?.logo]);

  const handleSave = () => {
    updateLogo(logo);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
            <Award className="w-6 h-6 text-amber-600" />
            <span>تعديل ورفع الشعار الرسمي (/admin/logo)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            رفع الشعار الرسمي أو اللوغو الشفاف مع معاينة حية في خلفيات فاتحة وداكنة
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Save className="w-5 h-5" />
          <span>حفظ الشعار في Firestore</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ إعدادات الشعار بنجاح وتحديثه في الموقع!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Upload Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <ImageUploader
            label="رفع الشعار الرسمي (PNG / JPG / WebP)"
            value={logo.url}
            onChange={(img) => setLogo(prev => ({ ...prev, url: img }))}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الجمعية المرافق للشعار</label>
            <input
              type="text"
              value={logo.name || ''}
              onChange={(e) => setLogo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الشعار الوطني</label>
            <input
              type="text"
              value={logo.motto || ''}
              onChange={(e) => setLogo(prev => ({ ...prev, motto: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-amber-700 font-bold"
            />
          </div>
        </div>

        {/* Live Previews */}
        <div className="space-y-4">
          {/* Light Background Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
            <span className="text-xs text-slate-400 font-bold block">معاينة على خلفية فاتحة (Header & Content)</span>
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-amber-500 shadow-lg bg-black p-1 flex items-center justify-center">
              <img
                src={logo.url || "/logo.jpg"}
                alt="Logo Preview Light"
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{logo.name}</h4>
            <span className="text-xs text-amber-600 font-bold block">{logo.motto}</span>
          </div>

          {/* Dark Background Preview */}
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl text-center space-y-3 text-white">
            <span className="text-xs text-slate-400 font-bold block">معاينة على خلفية داكنة (Hero & Footer)</span>
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-amber-500 shadow-2xl bg-black p-1 flex items-center justify-center ring-4 ring-emerald-500/20">
              <img
                src={logo.url || "/logo.jpg"}
                alt="Logo Preview Dark"
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="font-bold text-white text-sm">{logo.name}</h4>
            <span className="text-xs text-amber-400 font-bold block">{logo.motto}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
