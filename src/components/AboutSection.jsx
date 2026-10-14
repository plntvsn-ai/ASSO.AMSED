import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';

export default function AboutSection() {
  const { lang, dir } = useLanguage();
  const { cmsData } = useCms();

  const aboutSnippet = cmsData?.pages?.home?.sections?.[0] || {
    title: "من نحن ورسالتنا النبيلة بالقنيطرة",
    text: "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED هي إطار مدني رائد بمدينة القنيطرة (حي الساكنية، تجزئة الحزام رقم د 25). نكرس جهودنا لاحتضان ورعاية وتأهيل الأطفال ذوي التوحد وفي وضعيات هشة عبر قسم التعليم الأولي المكيف، ورشات المهارات الحياتية، والمشاريع البيداغوجية الفردية (PPI)، ومرافقة الحياة المدرسية (AVS).",
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
              <span>
                {lang === 'ar' ? 'مبادرة التضامن الوطني والتربوي' : lang === 'fr' ? 'Solidarité Nationale & Éducative' : 'National & Educational Solidarity'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              {lang === 'ar' 
                ? (aboutSnippet.title || "من نحن ورسالتنا النبيلة بالقنيطرة")
                : lang === 'fr' 
                ? "Qui Sommes-Nous & Notre Mission à Kénitra" 
                : "About Us & Our Mission in Kenitra"}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {lang === 'ar' 
                ? (aboutSnippet.text || "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED هي إطار مدني رائد بمدينة القنيطرة (حي الساكنية، تجزئة الحزام رقم د 25). نكرس جهودنا لاحتضان ورعاية وتأهيل الأطفال ذوي التوحد وفي وضعيات هشة عبر قسم التعليم الأولي المكيف، ورشات المهارات الحياتية، والمشاريع البيداغوجية الفردية (PPI)، ومرافقة الحياة المدرسية (AVS).")
                : lang === 'fr'
                ? "L'Association Initiative Marocaine pour la Solidarité et la Coopération (AMSED) est une ONG pionnière à Kénitra (Quartier Saknia, Lotissement El Hizam N° D 25). Nous œuvrons pour l'accueil, la prise en charge et la réadaptation des enfants avec autisme et en situation de précarité à travers notre classe préscolaire adaptée, nos ateliers d'autonomie, nos projets personnalisés individualisés (PPI) et l'accompagnement scolaire (AVS)."
                : "The Moroccan Initiative Association for Solidarity and Cooperation (AMSED) is a leading civil organization in Kenitra (Saknia district, Lotissement El Hizam N° D 25). We dedicate our mission to supporting and rehabilitating children with autism and vulnerable backgrounds through adapted preschool education, life skills workshops, personalized educational plans (PPI), and school inclusion assistance (AVS)."}
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {lang === 'ar' ? 'مشروع فردي لكل طفل (PPI)' : lang === 'fr' ? 'Projet Personnalisé (PPI)' : 'Personalized Plan (PPI)'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ar' ? 'خطة تربوية وتأهيلية مخصصة لكل مستفيد' : lang === 'fr' ? 'Plan éducatif adapté au rythme de l\'enfant' : 'Custom educational and therapeutic plan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {lang === 'ar' ? 'إدماج مدرسي بمرافقة AVS' : lang === 'fr' ? 'Inclusion Scolaire (AVS)' : 'School Inclusion (AVS)'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ar' ? 'ولوج سلس للأقسام العادية تحت إشراف أطر مؤهلة' : lang === 'fr' ? 'Accompagnement en classe ordinaire par des auxiliaires qualifiés' : 'Integration into mainstream classrooms with qualified support'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                <span>
                  {lang === 'ar' ? 'اقرأ المزيد عن الجمعية وأهدافها' : lang === 'fr' ? 'En savoir plus sur nos missions' : 'Learn more about our mission'}
                </span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
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
