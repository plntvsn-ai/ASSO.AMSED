import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const PrivacyPage = () => {
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
          <span className="text-emerald-800 font-bold">سياسة الخصوصية وحماية المعطيات</span>
        </div>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 mb-8 shadow-xl relative overflow-hidden border border-amber-500/30">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-semibold mb-4 border border-amber-500/40">
              <ShieldCheck className="w-4 h-4" />
              ميثاق الشفافية والخصوصية - جمعية AMSED
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight text-white">
              سياسة الخصوصية وحماية المعطيات ذات الطابع الشخصي
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              تلتزم جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة باحترام خصوصية زوارها والمستفيدين، وفقاً لمقتضيات القانون المغربي رقم 09-08 والمعايير الدولية للنزاهة والشفافية.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-700" />
              1. هوية الجهة المسؤولة عن المعالجة
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              هذا الموقع الإلكتروني تديره <strong>جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED</strong>، وهي منظمة غير ربحية تأسست بموجب الظهير الشريف المنظم للجمعيات بالمملكة المغربية، ومقرها الاجتماعي بمدينة <strong>القنيطرة</strong> (SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              2. المعطيات التي يتم جمعها والغرض منها
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-3">
              نحن نجمع البيانات لأغراض إنسانية، تواصلية وتربوية حصرية، ولا نستخدم أي بيانات لأغراض تجارية أو ربحية. وتشمل:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm sm:text-base pr-2">
              <li><strong>استمارة التواصل والتسجيل:</strong> الاسم الكامل، رقم الهاتف، والبريد الإلكتروني، للرد على استفسارات الآباء والأمهات وتوجيه الأسر.</li>
              <li><strong>بيانات التصفح والتحليلات:</strong> ملفات تعريف الارتباط الفنية وإحصائيات الزيارات غير الشخصية عبر Google Analytics لتحسين أداء الموقع وسهولة الوصول لذوي الاحتياجات الخاصة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              3. الامتثال للقانون المغربي 09-08
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              تتم معالجة كافة المعطيات الشخصية في توافق تام مع القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي. لا يتم نقل أو بيع أو مشاركة أي معلومة مع أي طرف ثالث تجاري.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              4. حقوق المستخدم والآباء
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-2">
              يحق لكل مستخدم، ولي أمر، أو متطوع:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm sm:text-base pr-2">
              <li>حق الولوج إلى بياناته الشخصية المسجلة لدينا.</li>
              <li>حق التصحيح أو التعديل في أي وقت.</li>
              <li>حق طلب مسح بياناته نهائياً من سجلات التواصل عبر مراسلتنا مباشرة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              5. ملفات تعريف الارتباط (Cookies)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              يستخدم الموقع ملفات تعريف الارتباط الفنية الضرورية لتحسين تجربة المستخدم وسرعة التصفح وتذكر تفضيلات اللغة. يمكنك تعطيل هذه الملفات عبر إعدادات متصفحك في أي وقت.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-950 text-base mb-2">للاستفسار أو ممارسة حقوقك في الخصوصية:</h3>
            <p className="text-slate-700 text-xs sm:text-sm mb-4">
              يمكنك التواصل مباشرة مع إدارة الجمعية بمدينة القنيطرة عبر القنوات الرسمية التالية:
            </p>
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-800">
              <div className="flex items-center gap-1.5 font-mono">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span dir="ltr">06 54 24 05 23</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span>asso.amsed@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>القنيطرة، المملكة المغربية</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
