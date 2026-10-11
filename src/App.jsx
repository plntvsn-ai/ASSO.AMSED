import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { CmsProvider } from './context/CmsContext';

// Public Pages
import { Home } from './pages/Home';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AboutPage } from './pages/AboutPage';

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

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <DataProvider>
          <CmsProvider>
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/article/:id" element={<ArticleDetailPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Researcher Portal */}
              <Route path="/researcher/login" element={<ResearcherLogin />} />
              <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />

              {/* 100% Protected Admin Area (Zero White Screen) */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="settings/advanced" element={<AdvancedSettings />} />
                <Route path="auto" element={<AutoPublisher />} />
                <Route path="articles" element={<ArticlesAdmin />} />
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

              {/* Secret Obfuscated Admin Portal Route for Native Desktop/Mobile App */}
              <Route path="/portal-amsed-secure-x98k21/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="settings/advanced" element={<AdvancedSettings />} />
                <Route path="auto" element={<AutoPublisher />} />
                <Route path="articles" element={<ArticlesAdmin />} />
                <Route path="videos" element={<VideosAdmin />} />
                <Route path="topics" element={<TopicsAdmin />} />
                <Route path="researchers" element={<ResearchersAdmin />} />
                <Route path="review" element={<ReviewAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
                
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

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CmsProvider>
        </DataProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
