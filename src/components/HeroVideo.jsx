import React from 'react';
import Logo from './Logo';

export default function HeroVideo() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-8 pb-16 sm:pt-12 sm:pb-20 border-b border-slate-800">
      {/* Background Subtle Accents */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 start-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* 1. شعار الجمعية في الأعلى (بدون أي خلفية مربعة - دمج دائري شفاف وسلس) */}
        <div className="mb-4 relative">
          <div className="p-2 rounded-full bg-slate-900/40 border border-slate-700/50 shadow-xl backdrop-blur-sm">
            <Logo size={105} className="transition-transform duration-300 hover:scale-105" />
          </div>
        </div>

        {/* 2. تحته مباشرة اسم الجمعية والشعار الوطني */}
        <div className="space-y-3 max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-400 text-xs font-bold tracking-wide">
            <span>★</span>
            <span>الله • الوطن • الملك</span>
            <span>★</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            جمعية المبادرة المغربية للتكافل والتعاون
          </h1>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-emerald-400">
            لرعاية الأطفال في وضعية صعبة بالقنيطرة
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            مؤسسة اجتماعية وتربوية متخصصة في رعاية وتأهيل أطفال التوحد • التعليم الأولي المكيف • ورشات المهارات الحياتية • التأهيل المهني والإدماج المدرسي
          </p>
        </div>

        {/* 3. الفيديو الخاص بتقديم الجمعية بشكل واضح ومباشر بعد الشعار والاسم */}
        <div className="w-full max-w-5xl">
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/CSwDq9szfj0?autoplay=0&controls=1&modestbranding=1&rel=0"
              title="فيديو تقديم جمعية AMSED"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="font-semibold text-slate-300">الفيديو التعريفي الرسمي بأنشطة وخدمات الجمعية</span>
            <span className="text-emerald-400 font-mono">AMSED Official Presentation</span>
          </div>
        </div>

      </div>
    </section>
  );
}
