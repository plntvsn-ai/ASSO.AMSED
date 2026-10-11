import React from 'react';

export default function HeroVideo() {
  return (
    <section className="bg-slate-950 text-white pt-8 pb-16 sm:pt-12 sm:pb-20 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* 1. شعار الجمعية في الأعلى - صورة واحدة فقط واضحة ودائرية بلا شفافية وبلا overlapping */}
        <div className="mb-5 flex justify-center">
          <img
            src="/logo.jpg"
            alt="شعار جمعية المبادرة المغربية للتكافل والتعاون"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-2xl border-2 border-amber-500/80 transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* 2. تحته مباشرة اسم الجمعية والشعار الوطني */}
        <div className="space-y-3 max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950 border border-amber-600/50 text-amber-400 text-xs font-bold tracking-wide">
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
