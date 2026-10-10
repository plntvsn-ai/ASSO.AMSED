import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ShieldCheck, Heart, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';

export default function AboutSection() {
  const { lang, dir } = useLanguage();
  const { cmsData } = useCms();

  const aboutSnippet = cmsData?.pages?.home?.sections?.[0] || {
    title: "من نحن ورسالتنا النبيلة بالقنيطرة",
    text: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة (AMSED) هي إطار مدني رائد بمدينة القنيطرة (حي الساكنية، تجزئة الحزام رقم د 25). نكرس جهودنا لاحتضان ورعاية وتأهيل الأطفال ذوي التوحد وفي وضعيات هشة عبر قسم التعليم الأولي المكيف، ورشات المهارات الحياتية، والمشاريع البيداغوجية الفردية (PPI)، ومرافقة الحياة المدرسية (AVS).",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
  };

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Text Content */}
          <div className="flex-1 space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>مبادرة التضامن الوطني والتربوي</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              {aboutSnippet.title}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {aboutSnippet.text}
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">مشروع فردي لكل طفل (PPI)</h4>
                  <p className="text-[11px] text-slate-500">خطة تربوية وتأهيلية مخصصة لكل مستفيد</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">إدماج مدرسي بمرافقة AVS</h4>
                  <p className="text-[11px] text-slate-500">ولوج سلس للأقسام العادية تحت إشراف أطر مؤهلة</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                <span>اقرأ المزيد عن الجمعية وأهدافها</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-5/12 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 shrink-0">
            <img
              src={aboutSnippet.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"}
              alt="أطفال جمعية المبادرة المغربية"
              className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition duration-500"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
export { AboutSection };
