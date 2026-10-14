import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Link } from 'react-router-dom';
import { 
  Bot, Power, Clock, Calendar, CheckCircle2, 
  AlertCircle, Play, Plus, Trash2, RotateCcw, 
  Sparkles, ExternalLink, RefreshCw, Check, BookOpen 
} from 'lucide-react';

export const AutoPublisherAdmin = () => {
  const { 
    cmsData, 
    updateAutoSettings, 
    bulkAddAutoTopics, 
    toggleTopicUsed, 
    deleteAutoTopic, 
    triggerAutoPublish 
  } = useCms();

  const settings = cmsData?.autoSettings || {
    enabled: true,
    publishTime: "08:00",
    frequency: "daily",
    language: "ar",
    autoPublish: true,
    lastRun: null,
    nextRun: null,
    lastPublishedTitle: null
  };

  const topics = cmsData?.autoTopics || [];
  const usedCount = topics.filter(t => t.used).length;
  const remainingCount = topics.length - usedCount;

  const [bulkInput, setBulkInput] = useState('');
  const [isPublishingNow, setIsPublishingNow] = useState(false);
  const [publishResult, setPublishResult] = useState(null);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Settings handlers
  const handleToggleEnabled = () => {
    updateAutoSettings({ enabled: !settings.enabled });
    showSaveFeedback();
  };

  const handleFrequencyChange = (freq) => {
    updateAutoSettings({ frequency: freq });
    showSaveFeedback();
  };

  const handleTimeChange = (time) => {
    updateAutoSettings({ publishTime: time });
    showSaveFeedback();
  };

  const showSaveFeedback = () => {
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  // Bulk add topics
  const handleBulkAdd = (e) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

    const addedCount = bulkAddAutoTopics(bulkInput);
    setBulkInput('');
    alert(`تمت إضافة ${addedCount} موضوع بنجاح إلى جدول النشر الآلي!`);
  };

  // Immediate manual trigger (Test run)
  const handleTestRun = async () => {
    setIsPublishingNow(true);
    setPublishResult(null);
    try {
      const res = await fetch('/api/autonomous-publish', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.article) {
            try {
              const stored = localStorage.getItem('amsed_cms_database_v3');
              const cmsObj = stored ? JSON.parse(stored) : { articles: [] };
              if (!Array.isArray(cmsObj.articles)) cmsObj.articles = [];
              cmsObj.articles.unshift(data.article);
              localStorage.setItem('amsed_cms_database_v3', JSON.stringify(cmsObj));
            } catch (e) {}
          }
          alert(`✅ تم النشر بنجاح: ${data.ar || data.published}`);
          window.location.reload();
          return;
        }
      }
      throw new Error('Fallback to client publisher');
    } catch (e) {
      try {
        const { autoGenerateAndPublish } = await import("../../services/autoPublisher");
        const resClient = await autoGenerateAndPublish();
        if (resClient?.success) {
          alert(`✅ تم النشر بنجاح من خزان المواضيع: ${resClient.topic || 'مقال جديد'}`);
          window.location.reload();
          return;
        }
      } catch (clientErr) {
        console.error("Client auto publish fallback notice:", clientErr);
      }
      alert('❌ تعذر الاتصال بالخادم، يرجى المحاولة بعد قليل.');
      setPublishResult({
        success: false,
        message: 'تعذر الاتصال بالخادم، يرجى المحاولة بعد قليل.'
      });
    } finally {
      setIsPublishingNow(false);
    }
  };

  // Format date helper
  const formatDate = (isoStr) => {
    if (!isoStr) return 'لم ينشر بعد';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-MA', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              نظام النشر الأوتوماتيكي 100% بدون تدخل (Autonomous Publisher)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            موقع يشتغل بنفسه: ضع 20-50 موضوعاً مرة واحدة، وسيقوم النظام بتوليد ونشر مقال كامل يومياً عبر ويكيبيديا وقالب AMSED الإنساني دون الحاجة لأي اشتراك مدفوع!
          </p>
        </div>

        {/* Master ON / OFF Switch */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="text-start">
            <span className="text-xs font-bold text-slate-800 block">حالة النظام:</span>
            <span className={`text-xs font-extrabold ${settings.enabled ? 'text-emerald-700' : 'text-slate-500'}`}>
              {settings.enabled ? 'مفعل ويعمل ذاتياً ⚡' : 'متوقف مؤقتاً'}
            </span>
          </div>

          <button
            onClick={handleToggleEnabled}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
              settings.enabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                settings.enabled ? '-translate-x-9' : '-translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {savedSettingsNotice && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ إعدادات النشر الأوتوماتيكي بنجاح!</span>
        </div>
      )}

      {/* Grid: Settings & Instant Trigger (5 cols) + Status & Logs (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Automation Controls & Manual Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Schedule Configuration */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <span>جدول ومواعيد النشر الذاتي</span>
            </h3>

            {/* Frequency Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                تكرار النشر (Frequency)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'daily', label: 'كل يوم' },
                  { id: 'every2days', label: 'كل يومين' },
                  { id: 'weekly', label: 'كل أسبوع' },
                ].map(freq => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => handleFrequencyChange(freq.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      settings.frequency === freq.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ساعة النشر اليومية (Publish Time)
              </label>
              <input
                type="time"
                value={settings.publishTime || "08:00"}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                المقال ينشر تلقائياً مع الساعة <strong>{settings.publishTime || "08:00"}</strong> صباحاً
              </span>
            </div>
          </div>

          {/* Card 2: Manual Trigger / Test Now */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm">اختبار وتوليد فوري (Test Run)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              يمكنك تجربة التوليد الآلي الآن بضغطة زر لرؤية المقال ينشأ وينشر فوراً على الموقع بدون انتظار موعد الغد:
            </p>

            <button
              onClick={handleTestRun}
              disabled={isPublishingNow}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {isPublishingNow ? 'جاري التوليد...' : '⚡ اختبار وتوليد فوري (Test Run)'}
            </button>

            {publishResult && (
              <div className={`p-4 rounded-2xl text-xs space-y-2 animate-fadeIn ${
                publishResult.success ? 'bg-emerald-900/90 border border-emerald-500/50 text-emerald-100' : 'bg-red-950/80 border border-red-500/50 text-red-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {publishResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                  <span>{publishResult.message}</span>
                </div>
                {publishResult.article && (
                  <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between">
                    <span className="font-bold text-amber-300 truncate max-w-[200px]">
                      {publishResult.article.title}
                    </span>
                    <Link
                      to={`/article/${publishResult.article.id}`}
                      target="_blank"
                      className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg inline-flex items-center gap-1 font-bold"
                    >
                      <span>قراءة المقال</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 3: Status & Next Run Stats */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              سجل التشغيل الأوتوماتيكي
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">آخر نشر أوتوماتيكي:</span>
                <span className="font-bold text-slate-800" dir="ltr">
                  {formatDate(settings.lastRun)}
                </span>
              </div>

              {settings.lastPublishedTitle && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 font-bold block mb-1">آخر عنوان تم نشره:</span>
                  <span className="font-extrabold text-slate-900 text-xs block leading-snug">
                    {settings.lastPublishedTitle}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">الموعد القادم للنشر:</span>
                <span className="font-bold text-emerald-700" dir="ltr">
                  {formatDate(settings.nextRun)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Topics Pool & Bulk Insertion (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Bulk Topics Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-700" />
                  <span>إضافة 20 إلى 50 موضوع دفعة واحدة</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  اكتب أو الصق قائمة مواضيعك هنا (موضوع واحد في كل سطر)، وسيتكفل الموقع بنشرها بالتسلسل!
                </p>
              </div>
            </div>

            <form onSubmit={handleBulkAdd} className="space-y-3">
              <textarea
                rows={5}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={`اكتب كل موضوع في سطر منفصل، مثلاً:
صحة الطفل في المناطق النائية
أهمية التلقيح للأطفال
كيف نساعد طفل في وضعية صعبة
التكافل الاجتماعي في الإسلام
القوافل الطبية ودورها في القرى
ورشات المهارات الحياتية للأطفال`}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-sans leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>

              <button
                type="submit"
                disabled={!bulkInput.trim()}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ وإضافة المواضيع إلى القائمة</span>
              </button>
            </form>
          </div>

          {/* Topics Pool Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <span>خزان المواضيع المبرمجة ({topics.length} موضوع)</span>
                </h3>
                <span className="text-xs text-slate-400">
                  المتاح للنشر: <strong className="text-emerald-700">{remainingCount}</strong> • المستعمل: <strong className="text-slate-600">{usedCount}</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${topics.length ? (usedCount / topics.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {topics.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  لا توجد مواضيع مضافة حالياً. يرجى لصق مواضيع في الحقل أعلاه.
                </div>
              ) : (
                topics.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      t.used
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-bold text-slate-400 shrink-0 w-6">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className={`text-xs sm:text-sm font-bold block truncate ${
                          t.used ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}>
                          {t.title}
                        </span>
                        {t.category && (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            {t.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleTopicUsed(t.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                          t.used
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="تبديل حالة الاستعمال"
                      >
                        {t.used ? 'مستعمل' : 'متاح للنشر'}
                      </button>

                      <button
                        onClick={() => deleteAutoTopic(t.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="حذف الموضوع"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
