import React from 'react';

export default function HeroVideo() {
  return (
    <section className="bg-[#0a4a3a] text-white pt-8 pb-14 sm:pt-10 sm:pb-16 border-b border-emerald-900 text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        
        {/* 1. اسم الجمعية في الأعلى */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
          جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة
        </h1>

        <h2 className="text-sm sm:text-base font-semibold text-emerald-200 mb-3">
          AMSED - Association Marocaine d'Entraide et de Solidarité
        </h2>

        {/* شارة الإيداع القانوني والعنوان */}
        <div className="inline-block bg-white/15 backdrop-blur-sm text-emerald-100 text-xs px-4 py-1.5 rounded-full mb-5 border border-white/20">
          الإيداع القانوني: 376.58.1 | SAKNIA 30 LOT EL HIZAM N° D Kénitra
        </div>

        {/* الشعار الرسمي - صورة واحدة فقط واضحة ودائرية بلا شفافية وبلا overlapping */}
        <div className="mb-6 flex justify-center">
          <img
            src="/logo.jpg"
            alt="شعار جمعية AMSED"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-2xl border-4 border-white/90 bg-white p-1"
          />
        </div>

        {/* 2. الفيديو الخاص بتقديم الجمعية */}
        <div className="w-full max-w-3xl mb-6">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-800/80 bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/CSwDq9szfj0?autoplay=0&controls=1&modestbranding=1&rel=0"
              title="فيديو تقديم جمعية AMSED"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-200/80 px-2">
            <span>الفيديو التعريفي الرسمي بأنشطة وخدمات الجمعية</span>
            <span className="font-mono text-amber-300">AMSED Official Presentation</span>
          </div>
        </div>

        {/* زر صغير فقط - اتصال مباشر بلا تبرع */}
        <div className="mt-2 flex flex-col items-center gap-2">
          <a
            href="tel:0654240523"
            className="inline-flex items-center gap-2 bg-white text-[#0a4a3a] hover:bg-emerald-50 font-bold px-7 py-3 rounded-full shadow-lg transition text-sm hover:scale-105"
          >
            <span>📞 اتصلوا بنا - 06 54 24 05 23</span>
          </a>
          <p className="text-xs text-emerald-200/80">
            يفتح من الإثنين إلى السبت ابتداءً من 9:00 صباحاً - الساكنية 30
          </p>
        </div>

      </div>
    </section>
  );
}
