import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { CmsProvider } from './context/CmsContext';

// Public Pages
import { Home } from './pages/Home';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

// Researcher Portal Pages
import { ResearcherLogin } from './pages/ResearcherLogin';
import { ResearcherDashboard } from './pages/ResearcherDashboard';

// Admin Security & Layout
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';

// Admin Core Pages
import { Dashboard } from './admin/pages/Dashboard';
import { AdvancedSettings } from './admin/pages/AdvancedSettings';
import { AutoPublisher } from './admin/pages/AutoPublisher';
import RobotSettings from './admin/pages/RobotSettings.jsx';
import SecureLogin from './admin/pages/SecureLogin.jsx';
import { ArticlesAdmin } from './admin/pages/ArticlesAdmin';
import { VideosAdmin } from './admin/pages/VideosAdmin';
import { TopicsAdmin } from './admin/pages/TopicsAdmin';
import { ResearchersAdmin } from './admin/pages/ResearchersAdmin';
import { ReviewAdmin } from './admin/pages/ReviewAdmin';
import { MessagesAdmin } from './admin/pages/MessagesAdmin';

// Additional Modules
import { MenusAdmin } from './admin/pages/MenusAdmin';
import { ButtonsAdmin } from './admin/pages/ButtonsAdmin';
import { PagesAdmin } from './admin/pages/PagesAdmin';
import { HeroAdmin } from './admin/pages/HeroAdmin';
import { StatsAdmin } from './admin/pages/StatsAdmin';
import { GalleryAdmin } from './admin/pages/GalleryAdmin';
import { ArchivesAdmin } from './admin/pages/ArchivesAdmin';
import { ContactAdmin } from './admin/pages/ContactAdmin';
import { LogoAdmin } from './admin/pages/LogoAdmin';
import { FirebaseSettingsAdmin } from './admin/pages/FirebaseSettingsAdmin';
import { ServicesAdmin } from './admin/pages/ServicesAdmin';
import { SettingsPage } from './admin/pages/SettingsPage';
import HeadSeo from './components/HeadSeo';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center moroccan-zellij-bg" dir="rtl">
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-slate-800">حدث خطأ أثناء تحميل الصفحة</h2>
            <p className="text-sm text-slate-600">نعتذر عن هذا العطب الطارئ. يرجى إعادة تحديث الصفحة أو العودة للرئيسية.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer">
                إعادة التحديث
              </button>
              <a href="/" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
                الصفحة الرئيسية
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    console.log("ADMIN URL: /am-ctrl-9k2l8x-2026-secure-panel-77");
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <HeadSeo />
        <LanguageProvider>
          <DataProvider>
            <CmsProvider>
              <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/article/:id" element={<ArticleDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Secure Login Entry */}
              <Route path="/am-ctrl-9k2l8x-2026-secure-panel-77/login" element={<SecureLogin />} />

              {/* Researcher Portal */}
              <Route path="/researcher/login" element={<ResearcherLogin />} />
              <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />

              {/* 100% Protected Main Admin Dashboard Route (The ONLY Admin Entry) */}
              <Route path="/am-ctrl-9k2l8x-2026-secure-panel-77" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="robots" element={<RobotSettings />} />
                <Route path="articles" element={<ArticlesAdmin />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="settings/advanced" element={<AdvancedSettings />} />
                <Route path="auto" element={<AutoPublisher />} />
                <Route path="videos" element={<VideosAdmin />} />
                <Route path="topics" element={<TopicsAdmin />} />
                <Route path="researchers" element={<ResearchersAdmin />} />
                <Route path="review" element={<ReviewAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
                
                {/* Additional CMS customizers */}
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="menus" element={<MenusAdmin />} />
                <Route path="buttons" element={<ButtonsAdmin />} />
                <Route path="pages" element={<PagesAdmin />} />
                <Route path="pages/:pageKey" element={<PagesAdmin />} />
                <Route path="hero" element={<HeroAdmin />} />
                <Route path="stats" element={<StatsAdmin />} />
                <Route path="gallery" element={<GalleryAdmin />} />
                <Route path="archives" element={<ArchivesAdmin />} />
                <Route path="contact" element={<ContactAdmin />} />
                <Route path="logo" element={<LogoAdmin />} />
                <Route path="firebase" element={<FirebaseSettingsAdmin />} />
              </Route>

              {/* Native Secret Portal alias redirected or supported */}
              <Route path="/portal-amsed-secure-x98k21/admin" element={<Navigate to="/am-ctrl-9k2l8x-2026-secure-panel-77" replace />} />
              <Route path="/portal-amsed-secure-x98k21/admin/*" element={<Navigate to="/am-ctrl-9k2l8x-2026-secure-panel-77" replace />} />

              {/* NO /admin shortcut allowed */}
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CmsProvider>
        </DataProvider>
      </LanguageProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
}
