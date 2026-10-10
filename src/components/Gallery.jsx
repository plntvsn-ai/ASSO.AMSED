import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { Image, ZoomIn, X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export const Gallery = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data } = useData();
  const { cmsData } = useCms();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const gallery = (cmsData?.gallery && cmsData.gallery.length > 0) ? cmsData.gallery : (data.gallery || []);

  const categories = [
    { id: 'all', label: t('gallery', 'all') },
    { id: 'medical', label: t('gallery', 'medical') },
    { id: 'education', label: t('gallery', 'education') },
    { id: 'social', label: t('gallery', 'social') },
    { id: 'activities', label: t('gallery', 'activities') },
  ];

  const filteredGallery = gallery.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-200">
            <Image className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('gallery', 'badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('gallery', 'title')}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            {t('gallery', 'subtitle')}
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => {
            const title = getLocalized(item, 'title');

            return (
              <div
                key={item.id || index}
                onClick={() => setSelectedPhoto(item)}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-200"
              >
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded mb-2">
                      {categories.find(c => c.id === item.category)?.label || item.category}
                    </span>
                    <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                      {title}
                    </h3>
                  </div>

                  {/* Zoom indicator */}
                  <div className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 end-0 p-2 text-white hover:text-amber-400 transition"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <div className="w-full max-h-[75vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-slate-800 shadow-2xl">
              <img
                src={selectedPhoto.image}
                alt={getLocalized(selectedPhoto, 'title')}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 text-center text-white px-4">
              <h3 className="text-lg font-bold text-slate-100">
                {getLocalized(selectedPhoto, 'title')}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
