import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Bell, Calendar, AlertCircle, ArrowLeft, ArrowRight, X, Sparkles, Tag } from 'lucide-react';

export const Announcements = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data } = useData();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const announcements = data.announcements || [];

  const filteredAnnouncements = announcements.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'urgent':
        return {
          label: lang === 'ar' ? 'عاجل وهام' : lang === 'fr' ? 'Urgent' : 'Urgent',
          color: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'event':
        return {
          label: lang === 'ar' ? 'نشاط وقافلة' : lang === 'fr' ? 'Événement' : 'Event',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      default:
        return {
          label: lang === 'ar' ? 'بلاغ إخباري' : lang === 'fr' ? 'Actualité' : 'News',
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
    }
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section id="announcements" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-3 border border-red-200">
            <Bell className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>{t('announcements', 'badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('announcements', 'title')}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            {t('announcements', 'subtitle')}
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t('announcements', 'all')}
            </button>
            <button
              onClick={() => setActiveFilter('urgent')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeFilter === 'urgent'
                  ? 'bg-red-700 text-white shadow'
                  : 'bg-white text-red-700 hover:bg-red-50 border border-red-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {t('announcements', 'urgent')}
            </button>
            <button
              onClick={() => setActiveFilter('event')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeFilter === 'event'
                  ? 'bg-emerald-700 text-white shadow'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              {t('announcements', 'events')}
            </button>
            <button
              onClick={() => setActiveFilter('news')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeFilter === 'news'
                  ? 'bg-blue-700 text-white shadow'
                  : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              {t('announcements', 'news')}
            </button>
          </div>
        </div>

        {/* Announcements Grid */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto">
            <p className="text-slate-500 font-medium">{t('announcements', 'noAnnouncements')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnnouncements.map((item) => {
              const badge = getCategoryBadge(item.category);
              const title = getLocalized(item, 'title');
              const desc = getLocalized(item, 'desc');

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 start-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <time dateTime={item.date}>{item.date}</time>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                        {title}
                      </h3>

                      {/* Description snippet */}
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Footer / Read More */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedAnnouncement(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
                      >
                        <span>{t('announcements', 'readMore')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </button>

                      {item.category === 'urgent' && (
                        <a
                          href="#donate"
                          className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-md shadow-sm transition"
                        >
                          {t('hero', 'donateNow')}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal for Full Announcement View */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Image Header */}
            {selectedAnnouncement.image && (
              <div className="relative h-60 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={selectedAnnouncement.image}
                  alt={getLocalized(selectedAnnouncement, 'title')}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="absolute top-4 end-4 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadge(selectedAnnouncement.category).color}`}>
                  {getCategoryBadge(selectedAnnouncement.category).label}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedAnnouncement.date}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                {getLocalized(selectedAnnouncement, 'title')}
              </h3>

              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base border-t border-b border-slate-100 py-4">
                {getLocalized(selectedAnnouncement, 'desc')}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <a
                  href="#contact"
                  onClick={() => setSelectedAnnouncement(null)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow"
                >
                  {t('nav', 'contact')}
                </a>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition"
                >
                  {t('announcements', 'closeModal')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
