import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Award, Phone, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export const TermsPage = () => {
  const { lang, dir } = useLanguage();

  const content = {
    ar: {
      breadcrumbHome: "الرئيسية",
      breadcrumbCurrent: "الشروط والأحكام",
      badge: "ميثاق الاستخدام والشفافية - جمعية AMSED",
      title: "شروط وأحكام استخدام المنصة الرقمية",
      desc: "تحدد هذه الوثيقة الضوابط والشروط القانونية والتنظيمية لاستخدام موقع جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة.",
      sec1Title: "1. الطبيعة القانونية للجمعية والهدف غير الربحي",
      sec1Text: "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة هي جمعية مدنية مغربية غير حكومية وغير ربحية، مسجلة خاضعة للظهير الشريف رقم 1.58.376. تهدف الجمعية حصرياً لرعاية أطفال التوحد، الدعم النفسي والتربوي، الإدماج المدرسي والمهني، ومساندة الأسر في وضعية صعبة.",
      sec2Title: "2. طبيعة المحتوى المنشور والتوجيهات الطبية التربوية",
      sec2Text: "كافة المقالات، الأدلة التوجيهية، والنصائح المنشورة على هذا الموقع تعد محتوى تثقيفياً وتوعوياً أعدته أطر وأخصائيو جمعية AMSED. لا يغني هذا المحتوى عن الاستشارة الطبية والتشخيص السريري المباشر لدى الطبيب المختص أو المراكز التأهيلية المعتمدة.",
      sec3Title: "3. الملكية الفكرية وحماية الهوية البصرية",
      sec3Text: "جميع النصوص، الصور، الفيديوهات، وشعار جمعية AMSED محفوظة بحكم القانون المغربي والدولي. يُسمح بمشاركة المقالات والمحتوى التوعوي للأغراض التعليمية والإنسانية غير التجارية، شريطة الإشارة الصريحة للمصدر ورابط المنصة.",
      sec4Title: "4. الالتزام بالشفافية والنزاهة",
      sec4Text: "تلتزم الجمعية بأعلى معايير الحكامة الرشيدة والشفافية في تقديم أنشطتها وتقاريرها، ولا يتضمن الموقع أي إعلانات تجارية خارجية أو ممارسات تسويقية مضللة.",
      sec5Title: "5. القانون الواجب التطبيق والاختصاص القضائي",
      sec5Text: "تخضع هذه الشروط والأحكام للقوانين والأنظمة الجاري بها العمل بالمملكة المغربية، وتختص محاكم مدينة القنيطرة بالنظر في أي نزاع قد ينشأ بخصوص استخدام هذا الموقع.",
      contactTitle: "للاستفسارات القانونية والتواصل المؤسساتي:",
      city: "القنيطرة، المملكة المغربية"
    },
    fr: {
      breadcrumbHome: "Accueil",
      breadcrumbCurrent: "Conditions Générales",
      badge: "Charte d'Utilisation & Transparence - AMSED",
      title: "Conditions Générales d'Utilisation de la Plateforme",
      desc: "Le présent document définit les conditions légales et déontologiques régissant l'utilisation du site de l'Association AMSED Kénitra.",
      sec1Title: "1. Statut Juridique et Vocation Non Lucrative",
      sec1Text: "L'Association AMSED Kénitra est une organisation non gouvernementale à but non lucratif, régie par la législation marocaine sur les associations. Elle a pour mission exclusive l'accompagnement des enfants autistes, le soutien psychologique, l'insertion scolaire et professionnelle, et l'assistance aux familles vulnérables.",
      sec2Title: "2. Nature des Contenus et Orientation Médico-Éducative",
      sec2Text: "Les articles et guides publiés sur la plateforme ont une visée informative et éducative élaborée par les professionnels d'AMSED. Ils ne remplacent en aucun cas une consultation médicale directe ou un diagnostic clinique spécialisé.",
      sec3Title: "3. Propriété Intellectuelle et Droits d'Auteur",
      sec3Text: "Les textes, photographies, vidéos et l'emblème officiel d'AMSED sont protégés par la législation sur la propriété intellectuelle. Le partage éducatif et solidaire est encouragé sous réserve de citer expressément la source.",
      sec4Title: "4. Transparence et Gouvernance",
      sec4Text: "L'association applique les normes les plus strictes de transparence institutionnelle et d'intégrité humanitaire. Le site ne contient aucune publicité commerciale lucrative.",
      sec5Title: "5. Loi Applicable et Juridiction Compétente",
      sec5Text: "Les présentes conditions sont soumises au droit marocain. En cas de litige relatif à l'utilisation du site, compétence expresse est attribuée aux tribunaux compétents de Kénitra.",
      contactTitle: "Contact Institutionnel & Questions Légales :",
      city: "Kénitra, Royaume du Maroc"
    },
    en: {
      breadcrumbHome: "Home",
      breadcrumbCurrent: "Terms of Use",
      badge: "Terms & Transparency Charter - AMSED",
      title: "Terms and Conditions of Platform Use",
      desc: "This document outlines the legal and ethical guidelines governing the use of the AMSED Kenitra association digital platform.",
      sec1Title: "1. Legal Status and Non-Profit Mission",
      sec1Text: "AMSED Kenitra is a registered Moroccan non-profit NGO governed by the Dahir regulating non-profit associations. The association is exclusively dedicated to autism care, psychological support, school inclusion, and vulnerable family relief.",
      sec2Title: "2. Nature of Content & Educational Guidance",
      sec2Text: "All articles and guides published on this platform are for educational and guidance purposes prepared by AMSED specialists. They do not substitute for individual clinical diagnosis or licensed medical consultations.",
      sec3Title: "3. Intellectual Property and Visual Identity",
      sec3Text: "All materials, images, videos, and the official AMSED emblem are protected by Moroccan and international copyright law. Non-commercial educational sharing is welcome provided proper attribution is made.",
      sec4Title: "4. Commitment to Transparency and Integrity",
      sec4Text: "The association adheres to rigorous governance, ethical transparency, and zero third-party commercial advertisements.",
      sec5Title: "5. Governing Law and Jurisdiction",
      sec5Text: "These terms are governed by the laws of the Kingdom of Morocco. Any disputes arising in connection with this platform fall under the jurisdiction of the courts of Kenitra.",
      contactTitle: "Institutional Inquiries & Legal Contact:",
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
              <FileText className="w-4 h-4" />
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
              <Award className="w-5 h-5 text-emerald-700" />
              {t.sec1Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec1Text}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              {t.sec2Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec2Text}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-700" />
              {t.sec3Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec3Text}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              {t.sec4Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec4Text}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              {t.sec5Title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.sec5Text}
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-950 text-base mb-2">{t.contactTitle}</h3>
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

export default TermsPage;
