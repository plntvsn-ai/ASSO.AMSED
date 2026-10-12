import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { 
  Heart, Sparkles, Building2 
} from 'lucide-react';
import { BankAccountSection } from './BankAccountSection';

export const DonationSection = ({ showBank = false }) => {
  const { lang, t } = useLanguage();
  const { data } = useData();
  const [copied, setCopied] = useState(false);

  const association = data.association;

  const handleCopyRib = () => {
    navigator.clipboard.writeText(association.rib.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const programs = [
    {
      titleAr: "كفالة طفل يتيم أو مريض",
      titleFr: "Parrainage d'un orphelin ou malade",
      titleEn: "Sponsorship for an orphan or ill child",
      descAr: "التكفل الشهري بالرعاية الصحية الكاملة، التغذية، والمستلزمات الحيوية للطفل.",
      descFr: "Prise en charge mensuelle des soins médicaux, de la nutrition et des besoins vitaux.",
      descEn: "Monthly sponsorship covering full medical care, nutrition, and daily necessities.",
      amount: "300 DH / شهر"
    },
    {
      titleAr: "دعم العمليات الجراحية المستعجلة",
      titleFr: "Fonds chirurgies pédiatriques d'urgence",
      titleEn: "Emergency Pediatric Surgeries Fund",
      descAr: "المساهمة في تمويل التدخلات الجراحية المنقذة للحياة والفحوصات الدقيقة.",
      descFr: "Financement des actes chirurgicaux vitaux et des examens radiologiques coûteux.",
      descEn: "Funding life-saving surgeries and specialized hospital procedures.",
      amount: "حسب الاستطاعة"
    },
    {
      titleAr: "حقيبة الأمل ومحاربة الهدر المدرسي",
      titleFr: "Cartable solidaire & scolarité",
      titleEn: "School bag & educational kit",
      descAr: "توفير حقيبة مدرسية متكاملة بجميع المقررات والكتب والأدوات لطفل محتاج.",
      descFr: "Cartable complet équipé de manuels et fournitures pour un élève nécessiteux.",
      descEn: "Complete school kit with books and stationery for an underprivileged pupil.",
      amount: "250 DH"
    },
    {
      titleAr: "قفة الخير والمواد الغذائية",
      titleFr: "Panier alimentaire familial",
      titleEn: "Nutritional family food basket",
      descAr: "سلة غذائية متكاملة تسلم لأسر الأطفال في وضعية فقر مدقع.",
      descFr: "Colis alimentaire complet livré aux familles d'enfants en extrême vulnérabilité.",
      descEn: "Nutritional grocery basket delivered to vulnerable foster families.",
      amount: "400 DH"
    }
  ];

  return (
    <section id="donate" className="py-20 bg-gradient-to-b from-white via-emerald-50/40 to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>{t('donation', 'badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('donation', 'title')}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            {t('donation', 'subtitle')}
          </p>
        </div>

        {/* Donation Programs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {programs.map((prog, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-3 border border-emerald-100">
                  {prog.amount}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {lang === 'ar' ? prog.titleAr : lang === 'fr' ? prog.titleFr : prog.titleEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar' ? prog.descAr : lang === 'fr' ? prog.descFr : prog.descEn}
                </p>
              </div>

              <a
                href="#contact"
                className="mt-6 text-center text-xs font-bold bg-slate-900 hover:bg-emerald-700 text-white py-2.5 rounded-xl transition shadow-sm"
              >
                {t('services', 'sponsorService')}
              </a>
            </div>
          ))}
        </div>

        {/* Optional inline Bank Account Card if showBank prop is explicitly passed */}
        {showBank && (
          <div className="mt-8">
            <BankAccountSection />
          </div>
        )}

      </div>
    </section>
  );
};

export { BankAccountSection };
export default DonationSection;
