import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2, ShieldAlert, Award, Phone, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col moroccan-zellij-bg text-slate-800 font-sans" dir="rtl">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-emerald-700 transition flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-emerald-800 font-bold">الشروط والأحكام</span>
        </div>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 mb-8 shadow-xl relative overflow-hidden border border-amber-500/30">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-semibold mb-4 border border-amber-500/40">
              <FileText className="w-4 h-4" />
              ميثاق الاستخدام والشفافية - جمعية AMSED
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight text-white">
              شروط وأحكام استخدام المنصة الرقمية
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              تحدد هذه الوثيقة الضوابط والشروط القانونية والتنظيمية لاستخدام موقع جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              1. الطبيعة القانونية للجمعية والهدف غير الربحي
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة هي جمعية مدنية مغربية غير حكومية وغير ربحية، مسجلة خاضعة للظهير الشريف رقم 1.58.376. تهدف الجمعية حصرياً لرعاية أطفال التوحد، الدعم النفسي والتربوي، الإدماج المدرسي والمهني، ومساندة الأسر في وضعية صعبة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              2. طبيعة المحتوى المنشور والتوجيهات الطبية التربوية
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              كافة المقالات، الأدلة التوجيهية، والنصائح المنشورة على هذا الموقع تعد محتوى تثقيفياً وتوعوياً أعدته أطر وأخصائيو جمعية AMSED. لا يغني هذا المحتوى عن الاستشارة الطبية والتشخيص السريري المباشر لدى الطبيب المختص أو المراكز التأهيلية المعتمدة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-700" />
              3. الملكية الفكرية وحماية الهوية البصرية
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              جميع النصوص، الصور، الفيديوهات، وشعار جمعية AMSED محفوظة بحكم القانون المغربي والدولي. يُسمح بمشاركة المقالات والمحتوى التوعوي للأغراض التعليمية والإنسانية غير التجارية، شريطة الإشارة الصريحة للمصدر ورابط المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              4. الالتزام بالشفافية والنزاهة
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              تلتزم الجمعية بأعلى معايير الحكامة الرشيدة والشفافية في تقديم أنشطتها وتقاريرها، ولا يتضمن الموقع أي إعلانات تجارية خارجية أو ممارسات تسويقية مضللة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              5. القانون الواجب التطبيق والاختصاص القضائي
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              تخضع هذه الشروط والأحكام للقوانين والأنظمة الجاري بها العمل بالمملكة المغربية، وتختص محاكم مدينة <strong>القنيطرة</strong> بالنظر في أي نزاع قد ينشأ بخصوص استخدام هذا الموقع.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-950 text-base mb-2">للاستفسارات القانونية والتواصل المؤسساتي:</h3>
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-800">
              <div className="flex items-center gap-1.5 font-mono">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span dir="ltr">06 54 24 05 23</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span>asso.amsed@gmail.com</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
