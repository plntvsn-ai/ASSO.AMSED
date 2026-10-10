import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { 
  Heart, Copy, Check, ShieldCheck, CreditCard, 
  Gift, Sparkles, Building2, PhoneCall 
} from 'lucide-react';

export const DonationSection = () => {
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

        {/* Official Bank Account Card (RIB) */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl max-w-4xl mx-auto border-2 border-emerald-700/50 relative overflow-hidden">
          <div className="absolute top-0 end-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-start flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-600/30 px-3 py-1 rounded-full">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{t('donation', 'bankDetails')}</span>
              </div>

              <h3 className="text-2xl font-black text-white">
                {association.bankName}
              </h3>

              <div className="space-y-1 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">{t('donation', 'accountHolder')}: </span>
                  <span className="font-bold text-white">{association.accountHolder}</span>
                </p>
                <p>
                  <span className="text-slate-400">{t('donation', 'swiftCode')}: </span>
                  <span className="font-mono text-amber-300 font-bold">{association.swift}</span>
                </p>
              </div>

              {/* RIB Box */}
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-700 font-mono text-center md:text-start flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-sans">{t('donation', 'ribNumber')}:</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400 tracking-wider select-all" dir="ltr">
                    {association.rib}
                  </span>
                </div>

                <button
                  onClick={handleCopyRib}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow font-sans shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t('donation', 'copied') : t('donation', 'copyRib')}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center md:justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('donation', 'bankNotice')}</span>
              </p>
            </div>

            {/* In-kind Donation box */}
            <div className="w-full md:w-64 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 text-center space-y-3 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'التبرع العيني المباشر' : lang === 'fr' ? 'Dons en Nature' : 'In-Kind Donations'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('donation', 'otherHelp')}
              </p>
              <a
                href={`tel:${association.phone1}`}
                className="inline-flex items-center justify-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-xl border border-slate-600 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'نسق معنا هاتفياً' : 'Appeler l\'association'}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
