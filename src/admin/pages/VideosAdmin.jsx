import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { extractYouTubeId, fetchYouTubeInfo } from '../../services/cmsService';
import { YoutubeIcon } from '../../components/SocialIcons';
import { 
  Plus, Trash2, Edit2, Star, 
  ExternalLink, Check, Eye, Play, Sparkles, RefreshCw 
} from 'lucide-react';

import { fetchAllChannelVideos } from '../../services/youtubeService';

export const VideosAdmin = () => {
  const { cmsData, addVideo, updateVideo, deleteVideo, setFeaturedVideo } = useCms();
  const [loading, setLoading] = useState(true);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isDailyFeatured, setIsDailyFeatured] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const videos = cmsData?.videos || [];

  const handleSyncAllChannelVideos = async () => {
    setLoadingFetch(true);
    try {
      const allVids = await fetchAllChannelVideos("UCBPlqmKVq9KvzXMEmp5dDPQ");
      for (const v of allVids) {
        if (!videos.some(existing => existing.youtubeId === v.youtubeId)) {
          await addVideo({
            url: v.youtubeId,
            title: v.title,
            desc: v.desc,
            isDailyFeatured: v.isDailyFeatured || false
          });
        }
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert("خطأ أثناء المزامنة: " + e.message);
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleUrlBlur = async () => {
    if (!videoUrlInput || titleInput) return;
    setLoadingFetch(true);
    const info = await fetchYouTubeInfo(videoUrlInput);
    if (info && info.title) {
      setTitleInput(info.title);
    }
    setLoadingFetch(false);
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoUrlInput) return;

    if (editingId) {
      updateVideo(editingId, {
        youtubeId: videoUrlInput,
        title: titleInput,
        desc: descInput,
        isDailyFeatured
      });
      setEditingId(null);
    } else {
      await addVideo({
        url: videoUrlInput,
        title: titleInput,
        desc: descInput,
        isDailyFeatured
      });
    }

    setVideoUrlInput('');
    setTitleInput('');
    setDescInput('');
    setIsDailyFeatured(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const startEdit = (vid) => {
    setEditingId(vid.id);
    setVideoUrlInput(`https://youtu.be/${vid.youtubeId}`);
    setTitleInput(vid.title || '');
    setDescInput(vid.desc || '');
    setIsDailyFeatured(vid.isDailyFeatured || false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setVideoUrlInput('');
    setTitleInput('');
    setDescInput('');
    setIsDailyFeatured(false);
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
            <YoutubeIcon className="w-6 h-6 text-red-600" />
            <span>إدارة فيديوهات يوتيوب والفيديو اليومي (/admin/videos)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إضافة أي فيديو بمجرد لصق رابطه (https://youtu.be/XXX) مع استخراج المعرف والصورة والعنوان تلقائياً بدون أي API Key
          </p>
        </div>

        <button
          onClick={handleSyncAllChannelVideos}
          disabled={loadingFetch}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0 text-xs sm:text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loadingFetch ? 'animate-spin' : ''}`} />
          <span>مزامنة قناة AMSED الرسمية (@association-amesd)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ قائمة الفيديوهات بنجاح وتحديثها في الموقع!</span>
        </div>
      )}

      {/* Add / Edit Video Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>{editingId ? 'تعديل بيانات الفيديو' : 'إضافة فيديو جديد لقائمة العرض'}</span>
        </h3>

        <form onSubmit={handleSaveVideo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رابط يوتيوب أو المعرف (YouTube URL or ID) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://youtu.be/CSwDq9szfj0 أو معرف 11 حرفاً"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                  dir="ltr"
                />
                {loadingFetch && (
                  <span className="absolute end-3 top-3 text-[11px] text-emerald-700 flex items-center gap-1 font-sans">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جلب العنوان...</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                المعرف المستخرج: <strong className="font-mono text-emerald-700">{extractYouTubeId(videoUrlInput) || '-'}</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان الفيديو (يجلب تلقائياً من noembed إن ترك فارغاً)
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="عنوان تعريفي للمقطع..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الوصف أو التفاصيل</label>
            <textarea
              rows={2}
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              placeholder="وصف مختصر للأنشطة الموثقة في الفيديو..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm resize-none"
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isDailyFeatured}
                onChange={(e) => setIsDailyFeatured(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span>تعيين كـ "فيديو اليوم المميز" في مشغل الموقع الرئيسي</span>
            </label>

            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  إلغاء التعديل
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition"
              >
                {editingId ? 'حفظ التعديل' : 'إضافة الفيديو'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => {
          const ytId = vid.youtubeId;
          return (
            <div key={vid.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-full bg-black overflow-hidden group">
                  <img
                    src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <a
                    href={`https://youtube.com/watch?v=${ytId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ms-0.5" />
                    </div>
                  </a>

                  {vid.isDailyFeatured && (
                    <span className="absolute top-2 start-2 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>فيديو اليوم</span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <span className="text-[11px] text-slate-400 font-mono block">ID: {ytId} • {vid.publishedDate}</span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{vid.title}</h4>
                  {vid.desc && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{vid.desc}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {!vid.isDailyFeatured ? (
                  <button
                    onClick={() => setFeaturedVideo(vid.id)}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>جعله فيديو اليوم</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>المميز حالياً</span>
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(vid)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 rounded-lg"
                    title="تعديل"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("هل تريد حذف هذا الفيديو؟")) {
                        deleteVideo(vid.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
