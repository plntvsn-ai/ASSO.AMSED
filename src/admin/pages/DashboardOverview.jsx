import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { 
  FileText, Menu, MousePointerClick, LayoutTemplate, 
  Film, BarChart3, Video, Image, FolderArchive, 
  Phone, Award, Database, Sparkles, ExternalLink, 
  ArrowLeft, CheckCircle2 
} from 'lucide-react';

export const DashboardOverview = () => {
  const { cmsData, firebaseStatus } = useCms();

  const statsCards = [
    { label: "المقالات والأخبار", count: cmsData.articles?.length || 0, link: "/admin/articles", icon: FileText, color: "text-emerald-700 bg-emerald-50" },
    { label: "فيديوهات يوتيوب", count: cmsData.videos?.length || 0, link: "/admin/videos", icon: Video, color: "text-red-700 bg-red-50" },
    { label: "صور المعرض", count: cmsData.gallery?.length || 0, link: "/admin/gallery", icon: Image, color: "text-amber-700 bg-amber-50" },
    { label: "ملفات الأرشيف والـ PDF", count: cmsData.archives?.length || 0, link: "/admin/archives", icon: FolderArchive, color: "text-blue-700 bg-blue-50" },
  ];

  const quickLinks = [
    { title: "نظام المقالات", desc: "إضافة وتعديل المقالات بمحرر نصوص غني ونشرها", link: "/admin/articles", icon: FileText },
    { title: "تعديل القوائم", desc: "ترتيب وتعديل روابط الهيدر والفوتر", link: "/admin/menus", icon: Menu },
    { title: "تعديل الأزرار", desc: "تغيير نصوص وألوان وروابط جميع أزرار الموقع", link: "/admin/buttons", icon: MousePointerClick },
    { title: "أقسام الصفحات", desc: "تعديل محتوى الصفحة الرئيسية وصفحة من نحن", link: "/admin/pages", icon: LayoutTemplate },
    { title: "فيديو الـ Hero", desc: `الفيديو التعريفي الحالي (ID: ${cmsData.hero?.videoId || 'CSwDq9szfj0'})`, link: "/admin/hero", icon: Film },
    { title: "فيديوهات يوتيوب", desc: "إضافة مقاطع جديدة بروابط يوتيوب تلقائياً", link: "/admin/videos", icon: Video },
    { title: "رسائل الزوار 💬", desc: "استعراض والرد الفوري عبر واتساب على رسائل الزوار", link: "/admin/messages", icon: Phone },
    { title: "إعدادات متقدمة ⚙️", desc: "النشر الأوتوماتيكي وبنك المواضيع الذكي", link: "/admin/settings/advanced", icon: Sparkles },
    { title: "معرض الصور", desc: "رفع وحذف صور الأنشطة بالسحب والإفلات", link: "/admin/gallery", icon: Image },
    { title: "ملفات الأرشيف (PDF)", desc: "إدارة الوثائق والتقارير القانونية السنوية", link: "/admin/archives", icon: FolderArchive },
    { title: "معلومات الاتصال", desc: "تعديل الهواتف، الإيميل، العنوان ورابط الخريطة", link: "/admin/contact", icon: Phone },
    { title: "الشعار واللوغو", desc: "رفع وتحديث شعار الجمعية الرسمي الشفاف", link: "/admin/logo", icon: Award },
    { title: "إعدادات Firebase", desc: "ربط مشروع Firestore السحابي وتحديث المفاتيح", link: "/admin/firebase", icon: Database },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نظام إدارة المحتوى الشامل 100% قابل للتعديل</span>
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              مرحباً بك في لوحة تحكم جمعية المبادرة المغربية
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              يمكنك من هنا تعديل أي عنصر في الموقع (المقالات، القوائم، الأزرار، فيديو الـ Hero، الأرقام، الفيديوهات، المعرض، الأرشيف، بيانات الاتصال، والشعار) دون الحاجة للرجوع إلى الكود البرمجي نهائياً!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/admin/articles"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl shadow transition text-xs sm:text-sm text-center"
            >
              + إضافة مقال جديد
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl border border-white/20 transition text-xs sm:text-sm text-center flex items-center justify-center gap-2"
            >
              <span>الموقع العام</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              to={c.link}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">{c.label}</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition">
                  {c.count}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${c.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">
          جميع أقسام لوحة التحكم (12 قسماً قابلاً للتعديل)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.link}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:-translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
