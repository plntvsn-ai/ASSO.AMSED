import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Lock, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPage = () => {
  const { lang, dir } = useLanguage();

  const content = {
    ar: {
      breadcrumbHome: "الرئيسية",
      breadcrumbCurrent: "سياسة الخصوصية وحماية المعطيات",
      badge: "ميثاق الشفافية والخصوصية - جمعية AMSED",
      title: "سياسة الخصوصية وحماية المعطيات ذات الطابع الشخصي",
      desc: "تلتزم جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة باحترام خصوصية زوارها والمستفيدين، وفقاً لمقتضيات القانون المغربي رقم 09-08 والمعايير الدولية للنزاهة والشفافية.",
      sec1Title: "1. هوية الجهة المسؤولة عن المعالجة",
      sec1Text: "هذا الموقع الإلكتروني تديره جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED، وهي منظمة غير ربحية تأسست بموجب الظهير الشريف المنظم للجمعيات بالمملكة المغربية، ومقرها الاجتماعي بمدينة القنيطرة (SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA).",
      sec2Title: "2. المعطيات التي يتم جمعها والغرض منها",
      sec2Intro: "نحن نجمع البيانات لأغراض إنسانية، تواصلية وتربوية حصرية، ولا نستخدم أي بيانات لأغراض تجارية أو ربحية. وتشمل:",
      sec2Point1Title: "استمارة التواصل والتسجيل:",
      sec2Point1Text: "الاسم الكامل، رقم الهاتف، والبريد الإلكتروني، للرد على استفسارات الآباء والأمهات وتوجيه الأسر.",
      sec2Point2Title: "بيانات التصفح والتحليلات:",
      sec2Point2Text: "ملفات تعريف الارتباط الفنية وإحصائيات الزيارات غير الشخصية عبر Google Analytics لتحسين أداء الموقع وسهولة الوصول لذوي الاحتياجات الخاصة.",
      sec3Title: "3. الامتثال للقانون المغربي 09-08",
      sec3Text: "تتم معالجة كافة المعطيات الشخصية في توافق تام مع القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي. لا يتم نقل أو بيع أو مشاركة أي معلومة مع أي طرف ثالث تجاري.",
      sec4Title: "4. حقوق المستخدم والآباء",
      sec4Intro: "يحق لكل مستخدم، ولي أمر، أو متطوع:",
      sec4Point1: "حق الولوج إلى بياناته الشخصية المسجلة لدينا.",
      sec4Point2: "حق التصحيح أو التعديل في أي وقت.",
      sec4Point3: "حق طلب مسح بياناته نهائياً من سجلات التواصل عبر مراسلتنا مباشرة.",
      sec5Title: "5. ملفات تعريف الارتباط (Cookies)",
      sec5Text: "يستخدم الموقع ملفات تعريف الارتباط الفنية الضرورية لتحسين تجربة المستخدم وسرعة التصفح وتذكر تفضيلات اللغة. يمكنك تعطيل هذه الملفات عبر إعدادات متصفحك في أي وقت.",
      contactTitle: "للاستفسار أو ممارسة حقوقك في الخصوصية:",
      contactDesc: "يمكنك التواصل مباشرة مع إدارة الجمعية بمدينة القنيطرة عبر القنوات الرسمية التالية:",
      city: "القنيطرة، المملكة المغربية"
    },
    fr: {
      breadcrumbHome: "Accueil",
      breadcrumbCurrent: "Politique de Confidentialité",
      badge: "Charte de Transparence & Confidentialité - AMSED",
      title: "Politique de Confidentialité et Protection des Données",
      desc: "L'Association Initiative Marocaine pour la Coopération et la Solidarité (AMSED Kénitra) s'engage à protéger la vie privée de ses usagers, conformément à la loi marocaine 09-08 et aux exigences déontologiques internationales.",
      sec1Title: "1. Responsable du Traitement",
      sec1Text: "Le présent site est administré par l'Association AMSED Kénitra, organisation à but non lucratif régie par la législation marocaine des associations, située à Kénitra (SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA).",
      sec2Title: "2. Données Collectées et Finalités",
      sec2Intro: "Les données sont exclusivement collectées à des fins humanitaires, sociales et d'orientation éducative, à l'exclusion de tout usage commercial :",
      sec2Point1Title: "Formulaire de contact et orientation :",
      sec2Point1Text: "Nom, téléphone, email afin de répondre aux familles d'enfants autistes et d'assurer le suivi.",
      sec2Point2Title: "Données techniques :",
      sec2Point2Text: "Cookies techniques pour la navigation fluide et la sélection linguistique.",
      sec3Title: "3. Conformité à la Loi Marocaine 09-08",
      sec3Text: "Tous les traitements respectent scrupuleusement la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP).",
      sec4Title: "4. Droits des Familles et Utilisateurs",
      sec4Intro: "Chaque parent ou visiteur dispose des droits suivants :",
      sec4Point1: "Droit d'accès aux informations le concernant.",
      sec4Point2: "Droit de rectification à tout moment.",
      sec4Point3: "Droit de suppression définitive sur simple demande écrite.",
      sec5Title: "5. Politique des Cookies",
      sec5Text: "Des cookies techniques strictement nécessaires au bon fonctionnement de la plateforme sont utilisés. Vous pouvez les désactiver dans votre navigateur.",
      contactTitle: "Pour toute question relative à vos données :",
      contactDesc: "Contactez l'administration de l'association à Kénitra :",
      city: "Kénitra, Royaume du Maroc"
    },
    en: {
      breadcrumbHome: "Home",
      breadcrumbCurrent: "Privacy Policy",
      badge: "Transparency & Privacy Charter - AMSED",
      title: "Privacy and Personal Data Protection Policy",
      desc: "The Moroccan Initiative Association for Cooperation and Solidarity (AMSED Kenitra) is dedicated to protecting user and beneficiary privacy in accordance with Moroccan Law 09-08 and international transparency principles.",
      sec1Title: "1. Identity of Data Controller",
      sec1Text: "This website is managed by AMSED Kenitra, a registered Moroccan non-profit NGO based in Kenitra (SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA).",
      sec2Title: "2. Collected Data and Purposes",
      sec2Intro: "Data is collected strictly for humanitarian, guidance, and educational purposes with zero commercial monetization:",
      sec2Point1Title: "Contact and Enrollment Inquiry:",
      sec2Point1Text: "Name, phone number, and email to assist parents of children with autism and respond to inquiries.",
      sec2Point2Title: "Technical Navigation Data:",
      sec2Point2Text: "Standard technical cookies to remember language choices and optimize platform accessibility.",
      sec3Title: "3. Compliance with Moroccan Law 09-08",
      sec3Text: "All personal information is strictly protected under Moroccan Law No. 09-08. No personal information is ever sold or shared with third-party advertisers.",
      sec4Title: "4. User and Parent Rights",
      sec4Intro: "Parents, volunteers, and visitors hold the following rights:",
      sec4Point1: "Right of access to registered personal data.",
      sec4Point2: "Right of correction or modification.",
      sec4Point3: "Right of permanent deletion upon written request.",
      sec5Title: "5. Cookie Policy",
      sec5Text: "We utilize essential technical cookies to ensure smooth accessibility and navigation. You can adjust your cookie settings at any time.",
      contactTitle: "Privacy Inquiries & User Rights:",
      contactDesc: "Contact our association administration directly at Kenitra:",
      city: "Kenitra, Kingdom of Morocco"
    }
  };

  const t = content[lang] || content.ar;

  return (
    <div className="min-h-screen flex flex-col moroccan-zellij-bg text-slate-800 font-sans" dir={dir}>
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-emerald-700 transition flex items-center gap-1">
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t.breadcrumbHome}
          </Link>
          <span>/</span>
          <span className="text-emerald-800 font-bold">{t.breadcrumbCurrent}</span>
        </div>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 mb-8 shadow-xl relative overflow-hidden border border-amber-500/30">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-semibold mb-4 border border-amber-500/40">
              <ShieldCheck className="w-4 h-4" />
              {t.badge}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight text-white">
              {t.title}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              {t.desc}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-700" />
              {t.sec1Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec1Text}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              {t.sec2Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-3">
              {t.sec2Intro}
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm sm:text-base pr-2">
              <li><strong>{t.sec2Point1Title}</strong> {t.sec2Point1Text}</li>
              <li><strong>{t.sec2Point2Title}</strong> {t.sec2Point2Text}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              {t.sec3Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec3Text}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              {t.sec4Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-2">
              {t.sec4Intro}
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm sm:text-base pr-2">
              <li>{t.sec4Point1}</li>
              <li>{t.sec4Point2}</li>
              <li>{t.sec4Point3}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              {t.sec5Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec5Text}
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-950 text-base mb-2">{t.contactTitle}</h3>
            <p className="text-slate-700 text-xs sm:text-sm mb-4">
              {t.contactDesc}
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
                <span>{t.city}</span>
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
