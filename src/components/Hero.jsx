import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { 
  Heart, Phone, ArrowLeft, ArrowRight, ShieldCheck, 
  Users, Award, Sparkles, Play, Stethoscope, Smile, 
  GraduationCap, X, ExternalLink
} from 'lucide-react';

const STAT_ICONS = {
  Smile,
  Sparkles,
  GraduationCap,
  Users,
  Heart,
  Award,
  ShieldCheck,
  Stethoscope
};

export const Hero = ({ onOpenVideoModal }) => {
  const { lang, dir, t } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const association = data.association;
  const hero = cmsData?.hero || {
    videoId: "CSwDq9szfj0",
    title: "جمعية المبادرة المغربية للتكافل والتعاون",
    subtitle: "لرعاية الأطفال في وضعية صعبة بالقنيطرة",
    description: "نعمل بروح التضامن الوطني على توفير التعليم الأولي المكيف، ورشات المهارات الحياتية، التأهيل المهني، والإدماج المدرسي بمرافقة AVS.",
    button1Text: "ساهم معنا وتبرع",
    button1Link: "/#donate",
    button2Text: "استكشف خدماتنا",
    button2Link: "/#services",
    overlayOpacity: 0.65
  };

  const stats = cmsData?.stats || {
    s1_val: "+650", s1_label: "طفل مستفيد سنوياً", s1_icon: "Smile",
    s2_val: "+45", s2_label: "مستفيد في ورشات المهارات المهنية", s2_icon: "Sparkles",
    s3_val: "+80", s3_label: "طفل مدمج بالمدارس مع مرافقة AVS", s3_icon: "GraduationCap",
    s4_val: "+85", s4_label: "متطوع ومتطوعة وأطر تربوية", s4_icon: "Users"
  };

  const buttons = cmsData?.buttons || {};
  const logo = cmsData?.logo || { url: "/logo.jpg", motto: "الله • الوطن • الملك" };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const getButtonBg = (color) => {
    switch(color) {
      case 'amber': return 'bg-amber-500 hover:bg-amber-600 text-slate-950';
      case 'blue': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700 text-white';
      case 'slate': return 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700';
      default: return 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-900/50';
    }
  };

  const renderStatIcon = (iconName) => {
    const IconC = STAT_ICONS[iconName] || Smile;
    return <IconC className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-900 text-white pt-10 pb-20 sm:pt-16 sm:pb-28">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Moroccan Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>★</span>
            <span>{t('hero', 'badge')}</span>
            <span>★</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Main Info (Left / Right depending on RTL) */}
          <div className="lg:col-span-7 text-center lg:text-start space-y-6">
            
            <div className="space-y-3">
              <span className="inline-block text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-950/40 border border-amber-600/30 px-3 py-1 rounded-md">
                {association.acronym} • {logo.motto || t('identity', 'motto')}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-tight text-white drop-shadow-sm">
                <span className="text-emerald-400">
                  {hero.title || (lang === 'ar' ? 'جمعية المبادرة المغربية' : 'Association Initiative Marocaine')}
                </span>
                <br />
                <span className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100">
                  {hero.subtitle || (lang === 'ar' ? 'للتكافل والتعاون لرعاية الأطفال في وضعية صعبة' : 'pour la Solidarité et la Coopération')}
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {hero.description || t('hero', 'description')}
            </p>

            {/* Quick Hotline Highlight */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-3 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm px-2">
                <Phone className="w-4 h-4 animate-bounce text-emerald-400" />
                <span>{t('hero', 'callNow')}:</span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={`tel:${cmsData?.contact?.phone1 || association.phone1}`}
                  className="bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 transition shadow"
                  dir="ltr"
                >
                  {cmsData?.contact?.phone1 || association.phone1}
                </a>
                <a 
                  href={`tel:${cmsData?.contact?.phone2 || association.phone2}`}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border border-amber-600/30 transition"
                  dir="ltr"
                >
                  {cmsData?.contact?.phone2 || association.phone2}
                </a>
              </div>
            </div>

            {/* Action Buttons with CMS support */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href={hero.button1Link || buttons.heroBtn1_link || "#donate"}
                className={`inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 ${getButtonBg(buttons.heroBtn1_color || 'emerald')}`}
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>{hero.button1Text || buttons.heroBtn1_text || t('hero', 'donateNow')}</span>
              </a>

              <a
                href={hero.button2Link || buttons.heroBtn2_link || "#services"}
                className={`inline-flex items-center gap-2 font-semibold px-5 py-3.5 rounded-xl transition ${getButtonBg(buttons.heroBtn2_color || 'slate')}`}
              >
                <span>{hero.button2Text || buttons.heroBtn2_text || t('hero', 'ourServices')}</span>
                <ArrowIcon className="w-4 h-4 text-emerald-400" />
              </a>

              {/* Watch Video Button */}
              <button
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-2 bg-red-950/70 hover:bg-red-900/90 text-red-200 font-semibold px-4 py-3.5 rounded-xl border border-red-800/40 transition group"
              >
                <Play className="w-4 h-4 fill-red-400 text-red-400 group-hover:scale-110 transition" />
                <span>{t('hero', 'watchDaily')}</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تأطير ومواكبة قانونية</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>قوافل وتدخلات طبية</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>شفافية وتضامن وطني</span>
              </div>
            </div>
          </div>

          {/* Logo & Video Emblem (Right Column) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition duration-700 animate-pulse"></div>

              {/* Main Badge Card */}
              <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-500/50 p-4 sm:p-6 rounded-3xl shadow-2xl max-w-sm text-center backdrop-blur-md">
                
                {/* Logo Image */}
                <div 
                  onClick={() => setVideoModalOpen(true)}
                  className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-amber-500 bg-slate-950 flex items-center justify-center ring-4 ring-emerald-500/30 cursor-pointer"
                  title="انقر لمشاهدة الفيديو التعريفي"
                >
                  <img 
                    src={logo.url || "/logo.jpg"} 
                    alt="شعار جمعية المبادرة المغربية للتكافل والتعاون"
                    className="w-full h-full object-cover filter drop-shadow-2xl transition duration-500 group-hover:scale-105"
                  />
                  {/* Floating play button over emblem */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition border-2 border-white/80">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Sub-badge below logo */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-amber-400 font-extrabold text-sm sm:text-base flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{logo.motto || t('identity', 'motto')}</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium">
                    {lang === 'ar' ? 'رعاية الطفل • صحة • تعليم • إدماج' : 'Santé • Éducation • Insertion'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Strip with CMS dynamic binding */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 mx-auto flex items-center justify-center mb-1.5">
              {renderStatIcon(stats.s1_icon)}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">{stats.s1_val}</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium">{stats.s1_label}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 mx-auto flex items-center justify-center mb-1.5">
              {renderStatIcon(stats.s2_icon)}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">{stats.s2_val}</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium">{stats.s2_label}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 mx-auto flex items-center justify-center mb-1.5">
              {renderStatIcon(stats.s3_icon)}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">{stats.s3_val}</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium">{stats.s3_label}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 mx-auto flex items-center justify-center mb-1.5">
              {renderStatIcon(stats.s4_icon)}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 mb-1">{stats.s4_val}</div>
            <div className="text-xs sm:text-sm text-slate-300 font-medium">{stats.s4_label}</div>
          </div>
        </div>

      </div>

      {/* Video Modal Popup */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-red-500 fill-red-500" />
                <h3 className="text-sm font-bold text-white">
                  الفيديو التعريفي الرسمي (VIDEO_ID: {hero.videoId})
                </h3>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${hero.videoId}?autoplay=1&rel=0`}
                title="الفيديو التعريفي لجمعية المبادرة المغربية"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>{hero.subtitle}</span>
              <a
                href={`https://youtube.com/watch?v=${hero.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-bold"
              >
                <span>مشاهدة على YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
