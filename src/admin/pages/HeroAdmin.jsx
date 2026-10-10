import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { extractYouTubeId } from '../../services/cmsService';
import { Film, Save, Check, Play, Sparkles, Sliders } from 'lucide-react';

export const HeroAdmin = () => {
  const { cmsData, updateHero } = useCms();
  const [heroForm, setHeroForm] = useState(cmsData.hero || {
    videoId: "CSwDq9szfj0",
    title: "جمعية المبادرة المغربية للتكافل والتعاون",
    subtitle: "لرعاية الأطفال في وضعية صعبة بالقنيطرة",
    description: "نعمل بروح التضامن الوطني على توفير التعليم الأولي المكيف، ورشات المهارات الحياتية، والتأهيل المهني، والإدماج المدرسي بمرافقة AVS.",
    button1Text: "ساهم معنا وتبرع",
    button1Link: "/#donate",
    button2Text: "استكشف خدماتنا",
    button2Link: "/#services",
    overlayOpacity: 0.65,
    showVideoBackground: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (cmsData?.hero) {
      setHeroForm(prev => ({ ...prev, ...cmsData.hero }));
    }
    setLoading(false);
  }, [cmsData?.hero]);

  const handleVideoUrlChange = (val) => {
    const extracted = extractYouTubeId(val);
    setHeroForm(prev => ({ ...prev, videoId: extracted || val }));
  };

  const handleSave = () => {
    updateHero(heroForm);
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
            <Film className="w-6 h-6 text-emerald-700" />
            <span>تعديل فيديو وواجهة الـ Hero التعريفية (/admin/hero)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            الفيديو التعريفي الرئيسي (VIDEO_ID: {heroForm.videoId})، العناوين، الأزرار ودرجة الشفافية مع معاينة حية
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Save className="w-5 h-5" />
          <span>حفظ التعديلات في Firestore</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ إعدادات الـ Hero بنجاح وتحديثها في الموقع!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              معرف يوتيوب أو الرابط الكامل (YouTube Video ID or Link) *
            </label>
            <input
              type="text"
              required
              value={heroForm.videoId}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="مثال: CSwDq9szfj0 أو https://youtu.be/CSwDq9szfj0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
              dir="ltr"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              المعرف الحالي: <strong className="text-emerald-700 font-mono">{heroForm.videoId}</strong> (يتم استخراجه تلقائياً بدون API Key)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">العنوان الرئيسي</label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">العنوان الفرعي</label>
              <input
                type="text"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">النص التعريفي والوصف</label>
            <textarea
              rows={3}
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm leading-relaxed resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">نص الزر الأول (زر رئيسي)</label>
              <input
                type="text"
                value={heroForm.button1Text}
                onChange={(e) => setHeroForm({ ...heroForm, button1Text: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">رابط الزر الأول</label>
              <input
                type="text"
                value={heroForm.button1Link}
                onChange={(e) => setHeroForm({ ...heroForm, button1Link: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">نص الزر الثاني</label>
              <input
                type="text"
                value={heroForm.button2Text}
                onChange={(e) => setHeroForm({ ...heroForm, button2Text: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">رابط الزر الثاني</label>
              <input
                type="text"
                value={heroForm.button2Link}
                onChange={(e) => setHeroForm({ ...heroForm, button2Link: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>درجة تعتيم الخلفية (Overlay Opacity): {Math.round(heroForm.overlayOpacity * 100)}%</span>
              </label>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.9"
              step="0.05"
              value={heroForm.overlayOpacity}
              onChange={(e) => setHeroForm({ ...heroForm, overlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <div className="p-4 bg-slate-950 text-xs font-bold text-slate-400 flex items-center justify-between border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المعاينة الحية للـ Hero</span>
            </span>
            <span className="text-[11px] font-mono">ID: {heroForm.videoId}</span>
          </div>

          {/* Simulated Hero Player & Overlay */}
          <div className="relative aspect-video w-full bg-black overflow-hidden">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${heroForm.videoId}?autoplay=0&controls=1&rel=0`}
              title="Hero Live Preview"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>

          {/* Content summary */}
          <div className="p-6 space-y-3 text-white">
            <h4 className="text-lg font-black text-emerald-400 leading-snug">
              {heroForm.title}
            </h4>
            <h5 className="text-sm font-bold text-slate-200">
              {heroForm.subtitle}
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
              {heroForm.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-700 text-white">
                {heroForm.button1Text}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {heroForm.button2Text}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
