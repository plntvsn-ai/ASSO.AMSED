import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { 
  Play, RefreshCw, ExternalLink, Calendar, 
  Eye, CheckCircle2, Sparkles, Film, Radio, Video
} from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';
import { 
  fetchAllChannelVideos, 
  YOUTUBE_CHANNEL_CONFIG, 
  OFFICIAL_CHANNEL_VIDEOS 
} from '../services/youtubeService';

export const VideosSection = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [channelVideos, setChannelVideos] = useState(OFFICIAL_CHANNEL_VIDEOS);
  const [currentVideo, setCurrentVideo] = useState(OFFICIAL_CHANNEL_VIDEOS[0]);

  // Load all channel videos automatically on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const vids = await fetchAllChannelVideos(YOUTUBE_CHANNEL_CONFIG.youtubeChannelId);
        if (isMounted && vids && vids.length > 0) {
          setChannelVideos(vids);
          if (!currentVideo) {
            const feat = vids.find(v => v.isDailyFeatured) || vids[0];
            setCurrentVideo(feat);
          }
        }
      } catch (e) {
        console.error("Auto channel fetch error:", e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const videos = channelVideos.length > 0 ? channelVideos : OFFICIAL_CHANNEL_VIDEOS;
  const activeVideo = currentVideo || videos[0];

  // Helper to extract clean YouTube embed URL
  const getEmbedUrl = (videoItem) => {
    if (!videoItem) return '';
    let id = videoItem.youtubeId;
    if (id && id.includes('youtu.be/')) {
      id = id.split('youtu.be/')[1].split('?')[0];
    } else if (id && id.includes('watch?v=')) {
      id = id.split('watch?v=')[1].split('&')[0];
    } else if (id && id.includes('embed/')) {
      id = id.split('embed/')[1].split('?')[0];
    }
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0`;
  };

  // Direct channel sync from YouTube feed
  const handleSyncChannel = async () => {
    setSyncing(true);
    setSyncSuccess(false);

    try {
      const refreshed = await fetchAllChannelVideos(YOUTUBE_CHANNEL_CONFIG.youtubeChannelId);
      if (refreshed && refreshed.length > 0) {
        setChannelVideos(refreshed);
      }
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <section id="videos" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 start-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 text-red-400 text-xs font-bold mb-3 border border-red-800/60">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>{t('videos', 'officialVideos')} ({YOUTUBE_CHANNEL_CONFIG.youtubeHandle})</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('videos', 'title')}
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
              {t('videos', 'subtitle')}
            </p>
          </div>

          {/* YouTube Channel Sync Banner */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center gap-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow">
                <YoutubeIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {t('videos', 'officialChannel')}
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {syncSuccess ? t('videos', 'syncedAll') : `${videos.length} ${t('videos', 'videosSynced')}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncChannel}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-600 transition disabled:opacity-50"
                title={t('videos', 'syncTooltip')}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{syncing ? t('videos', 'syncing') : t('videos', 'syncBtn')}</span>
              </button>

              <a
                href={YOUTUBE_CHANNEL_CONFIG.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow"
              >
                <span>{t('videos', 'subscribe')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Featured Video Player + Video Playlist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Active Video Player (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            {activeVideo ? (
              <div>
                {/* 16:9 Aspect Ratio Embed */}
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={getEmbedUrl(activeVideo)}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                </div>

                {/* Video Details */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      {activeVideo.isDailyFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                          <Sparkles className="w-3 h-3" />
                          {t('videos', 'introVideo')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {activeVideo.publishedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {activeVideo.views || '50+'} {t('videos', 'views')}
                      </span>
                      <a
                        href={`https://youtube.com/watch?v=${activeVideo.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1 ms-2"
                      >
                        <YoutubeIcon className="w-3.5 h-3.5" />
                        <span>{t('videos', 'watchOnYoutube')}</span>
                      </a>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {activeVideo.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {activeVideo.desc || t('videos', 'defaultDesc')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>{t('videos', 'noVideos')}</p>
              </div>
            )}
          </div>

          {/* Daily Videos Playlist Sidebar (4 cols) - Displays ALL channel videos */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Film className="w-4 h-4 text-emerald-400" />
                <span>{t('videos', 'channelEpisodes')} ({videos.length})</span>
              </h4>
              <span className="text-xs text-emerald-400 font-bold font-mono">
                {YOUTUBE_CHANNEL_CONFIG.youtubeHandle}
              </span>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {videos.map((vid, idx) => {
                const isActive = activeVideo && (activeVideo.youtubeId === vid.youtubeId || activeVideo.id === vid.id);

                return (
                  <div
                    key={vid.id || vid.youtubeId || idx}
                    onClick={() => setCurrentVideo(vid)}
                    className={`group p-3 rounded-2xl cursor-pointer transition-all border flex gap-3.5 items-center ${
                      isActive 
                        ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/50' 
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
                      <img
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {vid.isDailyFeatured ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded">
                            {t('videos', 'featuredBadge')}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                            {t('videos', 'videoNum')} {idx + 1}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {vid.publishedDate}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                        {vid.title}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
