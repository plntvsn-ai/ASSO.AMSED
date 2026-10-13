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

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cmsData, firebaseStatus } = useCms();
  const [collapsed, setCollapsed] = useState(false);

  const isSecurePanel = location.pathname.startsWith('/am-ctrl-9k2l8x-2026-secure-panel-77');
  const isSecretPortal = location.pathname.startsWith('/portal-amsed-secure-x98k21/admin');
  const adminBase = isSecurePanel 
    ? '/am-ctrl-9k2l8x-2026-secure-panel-77' 
    : (isSecretPortal ? '/portal-amsed-secure-x98k21/admin' : '/am-ctrl-9k2l8x-2026-secure-panel-77');

  const menuItems = [
    { path: `${adminBase}`, label: 'لوحة التحكم (Dashboard)', icon: Home, exact: true },
    { path: `${adminBase}/articles`, label: 'المقالات والأخبار', icon: FileText, count: cmsData.articles?.length },
    { path: `${adminBase}/robots`, label: 'إعدادات الروبوتات 🤖', icon: '🤖', badge: 'AUTO' },
    { path: `${adminBase}/settings`, label: 'الإعدادات العامة', icon: '⚙️' },
    { path: `${adminBase}/settings/advanced`, label: 'إعدادات متقدمة', icon: '⚙️' },
    { path: `${adminBase}/services`, label: 'إعدادات الخدمات', icon: HandHeart, count: 8 },
    { path: `${adminBase}/topics`, label: 'خزان المواضيع', icon: BookOpen },
    { path: `${adminBase}/review`, label: 'مراجعة المقالات', icon: CheckSquare },
    { path: `${adminBase}/researchers`, label: 'المحررون والباحثون', icon: Users },
    { path: `${adminBase}/messages`, label: 'رسائل الزوار 💬', icon: '💬' },
    { path: `${adminBase}/menus`, label: 'تعديل القوائم', icon: Menu },
    { path: `${adminBase}/buttons`, label: 'تعديل الأزرار', icon: MousePointerClick },
    { path: `${adminBase}/pages`, label: 'أقسام الصفحات', icon: LayoutTemplate },
    { path: `${adminBase}/hero`, label: 'فيديو الـ Hero', icon: Film },
    { path: `${adminBase}/stats`, label: 'الأرقام والإحصائيات', icon: BarChart3 },
    { path: `${adminBase}/videos`, label: 'فيديوهات يوتيوب', icon: Video, count: cmsData.videos?.length },
    { path: `${adminBase}/gallery`, label: 'معرض الصور', icon: Image, count: cmsData.gallery?.length },
    { path: `${adminBase}/archives`, label: 'الأرشيف والـ PDF', icon: FolderArchive, count: cmsData.archives?.length },
    { path: `${adminBase}/contact`, label: 'معلومات الاتصال', icon: Phone },
    { path: `${adminBase}/logo`, label: 'الشعار واللوغو', icon: Award },
    { path: `${adminBase}/firebase`, label: 'إعدادات Firebase', icon: Database },
  ];

  const handleLogout = () => {
    localStorage.removeItem('amsed_auth');
    localStorage.removeItem('amsed_admin_authorized');
    navigate('/am-ctrl-9k2l8x-2026-secure-panel-77/login');
  };

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
                <h2 className="font-extrabold text-sm text-white truncate">لوحة تحكم AMSED</h2>
                <span className="text-[11px] text-amber-400 font-medium truncate block">رعاية الأطفال في وضعية صعبة - دعم التوحد</span>
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
            const isActive = item.exact 
              ? (location.pathname === item.path)
              : (location.pathname === item.path || (item.path !== adminBase && location.pathname.startsWith(item.path)));

            return (
              <Link
                key={item.path}
                to={item.path}
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
                {!collapsed && item.badge && (
                  <span className="text-[10px] bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Explicit Logout item in sidebar (Required Item 2) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-rose-400 hover:bg-rose-950/60 hover:text-white transition cursor-pointer mt-3 pt-2 border-t border-slate-900"
            title={collapsed ? 'تسجيل خروج' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>تسجيل خروج 🚪</span>}
          </button>
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
            <span className="text-xs font-bold text-slate-400">لوحة التحكم الآمنة</span>
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
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition border border-red-200 cursor-pointer"
              title="خروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تسجيل خروج 🚪</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

    </div>
  );
};
export default AdminLayout;
