import React from 'react';
import { useCms } from '../context/CmsContext';
import { defaultCmsData } from '../services/cmsService';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function ServicesCarousel() {
  const { cmsData } = useCms();

  const services = (cmsData?.services && cmsData.services.length > 0)
    ? cmsData.services
    : (defaultCmsData.services || []);

  const displayList = services.map(s => ({
    id: s.id,
    title: s.name || s.title || 'خدمة متخصصة',
    category: s.category || 'تأهيل ورعاية',
    image: s.image,
    desc: s.description || s.desc || ''
  }));

  return (
    <aside aria-label="شريط الخدمات" className="h-full flex flex-col justify-start">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-2.5 text-white/90">
        <span className="text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>خدماتنا</span>
        </span>
        <span className="text-[10px] text-emerald-200/90 bg-white/10 px-2 py-0.5 rounded-full font-mono">
          AMSED
        </span>
      </div>

      {/* 600px Animated Vertical Scroll */}
      <div className="h-[600px] overflow-hidden relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-2xl">
        {/* Top Gradient Fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0a4a3a] via-[#0a4a3a]/80 to-transparent z-10" />

        <div className="animate-vertical-scroll">
          {[...displayList, ...displayList].map((s, idx) => (
            <a
              key={`${s.id || idx}-${idx}`}
              href="#services"
              className="p-3 m-2 bg-white rounded-xl shadow-lg hover:scale-105 transition block border border-emerald-100 group text-slate-800"
            >
              {s.image && (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-slate-950">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1 end-1 text-[9px] font-bold bg-slate-950/80 text-amber-300 px-1.5 py-0.5 rounded shadow">
                    {s.category}
                  </span>
                </div>
              )}
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                {s.title}
              </h3>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                <span className="text-emerald-700 font-semibold">✓ متاح للتسجيل</span>
                <span className="font-mono text-slate-400">القنيطرة</span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Gradient Fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a4a3a] via-[#0a4a3a]/80 to-transparent z-10" />
      </div>
    </aside>
  );
}

export { ServicesCarousel };
