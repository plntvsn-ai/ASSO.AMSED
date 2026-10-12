import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { CreditCard, Check, Copy, ShieldCheck, Gift, PhoneCall } from 'lucide-react';

export const BankAccountSection = () => {
  const { lang, t } = useLanguage();
  const { data } = useData();
  const [copied, setCopied] = useState(false);

  const association = data.association;

  const handleCopyRib = () => {
    navigator.clipboard.writeText(association.rib.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="bank-account" className="py-12 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow font-sans shrink-0 cursor-pointer"
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

export default BankAccountSection;
