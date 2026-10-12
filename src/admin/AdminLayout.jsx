import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import { 
  FileText, Menu, MousePointerClick, LayoutTemplate, 
  Film, BarChart3, Video, Image, FolderArchive, 
  Phone, Award, Database, Home, ExternalLink, 
  LogOut, Shield, ChevronLeft, ChevronRight, Sparkles, Bot, 
  BookOpen, Users, CheckSquare, Settings, HandHeart 
} from 'lucide-react';
import Logo from '../components/Logo';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cmsData, firebaseStatus } = useCms();
  const [collapsed, setCollapsed] = useState(false);

  const isSecretPortal = location.pathname.startsWith('/portal-amsed-secure-x98k21/admin');
  const currentSearch = location.search;

  const menuItems = [
    { path: '/admin', label: 'نظرة عامة (Overview)', icon: Home, exact: true },
    { path: '/admin/articles', label: 'المقالات والأخبار', icon: FileText, count: cmsData.articles?.length },
    { path: '/admin/services', label: 'إعدادات الخدمات', icon: HandHeart, count: 8 },
    { path: '/admin/auto', label: 'النشر الأوتوماتيكي ⚡', icon: Bot, count: cmsData.autoTopics?.filter(t => !t.used)?.length },
    { path: '/admin/robots', label: 'الماستر روبوت 🤖 Master', icon: Bot },
    { path: '/admin/topics', label: 'خزان المواضيع', icon: BookOpen },
    { path: '/admin/review', label: 'مراجعة المقالات', icon: CheckSquare },
    { path: '/admin/researchers', label: 'المحررون والباحثون', icon: Users },
    { path: '/admin/messages', label: 'رسائل الزوار 💬', icon: '💬' },
    { path: '/admin/settings', href: '/admin/settings', label: 'إعدادات الموقع الأساسية', icon: '⚙️', badge: null },
    { path: '/admin/settings/advanced', href: '/admin/settings/advanced', label: 'إعدادات متقدمة', icon: '⚙️', badge: null },
    { path: '/admin/menus', label: 'تعديل القوائم', icon: Menu },
    { path: '/admin/buttons', label: 'تعديل الأزرار', icon: MousePointerClick },
    { path: '/admin/pages', label: 'أقسام الصفحات', icon: LayoutTemplate },
    { path: '/admin/hero', label: 'فيديو الـ Hero', icon: Film },
    { path: '/admin/stats', label: 'الأرقام والإحصائيات', icon: BarChart3 },
    { path: '/admin/videos', label: 'فيديوهات يوتيوب', icon: Video, count: cmsData.videos?.length },
    { path: '/admin/gallery', label: 'معرض الصور', icon: Image, count: cmsData.gallery?.length },
    { path: '/admin/archives', label: 'الأرشيف والـ PDF', icon: FolderArchive, count: cmsData.archives?.length },
    { path: '/admin/contact', label: 'معلومات الاتصال', icon: Phone },
    { path: '/admin/logo', label: 'الشعار واللوغو', icon: Award },
    { path: '/admin/firebase', label: 'إعدادات Firebase', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800" dir="rtl">
      
      {/* Sidebar */}
      <aside className={`bg-slate-950 text-white shrink-0 flex flex-col transition-all duration-300 z-30 shadow-2xl ${
        collapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="shrink-0 flex items-center justify-center">
                <Logo size={36} />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-sm text-white truncate">لوحة تحكم CMS</h2>
                <span className="text-[11px] text-amber-400 font-medium truncate block">جمعية المبادرة المغربية</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition mx-auto"
            title={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const currentSubPath = item.path.replace(/^\/admin/, '');
            const targetPath = isSecretPortal 
              ? `/portal-amsed-secure-x98k21/admin${currentSubPath}${currentSearch}` 
              : item.path;

            const isActive = item.exact 
              ? (location.pathname === item.path || location.pathname === `/portal-amsed-secure-x98k21/admin`)
              : (location.pathname === item.path || location.pathname.startsWith(`/portal-amsed-secure-x98k21/admin${currentSubPath}`));

            return (
              <Link
                key={item.path}
                to={targetPath}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-950/50'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {typeof Icon === 'string' ? (
                  <span className="w-5 h-5 shrink-0 text-base flex items-center justify-center">{Icon}</span>
                ) : (
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                )}
                {!collapsed && (
                  <span className="truncate flex-1 text-start">{item.label}</span>
                )}
                {!collapsed && item.count !== undefined && (
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {!collapsed && (
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${firebaseStatus ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span>{firebaseStatus ? 'سحابي (Firestore)' : 'محلي (Local CMS)'}</span>
              </span>
            </div>
          )}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold py-2.5 rounded-xl border border-slate-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {!collapsed && <span>معاينة الموقع المباشر</span>}
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">نظام إدارة المحتوى (CMS)</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-slate-700 font-mono">{location.pathname}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">الصفحة الرئيسية</span>
            </Link>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition border border-red-200"
              title="خروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">الخروج من لوحة التحكم</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
