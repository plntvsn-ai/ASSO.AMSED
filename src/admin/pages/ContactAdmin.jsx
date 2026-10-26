import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Phone, Mail, MapPin, Save, Check, Compass, CreditCard, Eye, EyeOff } from 'lucide-react';

export const ContactAdmin = () => {
  const { cmsData, updateContact } = useCms();
  const [contact, setContact] = useState(cmsData?.contact || {});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (cmsData?.contact) {
      setContact(prev => ({ ...prev, ...cmsData.contact }));
    }
    setLoading(false);
  }, [cmsData?.contact]);

  const handleFieldChange = (key, val) => {
    setContact(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    updateContact(contact);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Phone className="w-6 h-6 text-emerald-700" />
            <span>معلومات الاتصال والمقر والحساب البنكي (/admin/contact)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تعديل أرقام الهاتف، البريد الإلكتروني، العنوان بالقنيطرة، رابط Google Maps والحساب البنكي
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Save className="w-5 h-5" />
          <span>حفظ التعديلات في Firestore</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ معلومات الاتصال بنجاح وتحديثها في الموقع!</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* التحكم في الظهور والإخفاء (خيارات إخفاء استمارة راسلنا) */}
        <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-3">
          <div>
            <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-700" />
              <span>التحكم في ظهور استمارة المراسلة (راسلنا) وقسم الاتصال</span>
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
              يمكنك إخفاء استمارة إرسال الرسائل التي يعبئها ولي الأمر، أو إخفاء قسم الاتصال كاملاً حسب رغبتك.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-white p-4 rounded-xl border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-800">استمارة "راسلنا" (نموذج ولي الأمر)</span>
                <span className="text-[11px] text-slate-500">
                  {contact.showContactForm === false ? 'مخفية حالياً من الموقع ❌' : 'ظاهرة ومفعلة حالياً بالموقع ✅'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleFieldChange('showContactForm', contact.showContactForm === false ? true : false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  contact.showContactForm === false 
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300' 
                    : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow'
                }`}
              >
                {contact.showContactForm === false ? 'إظهار الاستمارة' : 'إخفاء الاستمارة'}
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-800">قسم الاتصال كاملاً بالرئيسية</span>
                <span className="text-[11px] text-slate-500">
                  {contact.showContactSection === false ? 'مخفي بالكامل من الرئيسية ❌' : 'ظاهر ومفعل بالرئيسية ✅'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleFieldChange('showContactSection', contact.showContactSection === false ? true : false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  contact.showContactSection === false 
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300' 
                    : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow'
                }`}
              >
                {contact.showContactSection === false ? 'إظهار القسم' : 'إخفاء القسم'}
              </button>
            </div>
          </div>
        </div>

        {/* Phones */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>أرقام الهواتف الرسمية</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الرقم الأول (المعتمد لواتساب)</label>
              <input
                type="text"
                value={contact.phone1 || ''}
                onChange={(e) => handleFieldChange('phone1', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الرقم الثاني</label>
              <input
                type="text"
                value={contact.phone2 || ''}
                onChange={(e) => handleFieldChange('phone2', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Email & Socials */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-700" />
            <span>البريد الإلكتروني والشبكات الاجتماعية</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={contact.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رابط صفحة Facebook</label>
              <input
                type="url"
                value={contact.facebookUrl || ''}
                onChange={(e) => handleFieldChange('facebookUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رابط قناة YouTube</label>
              <input
                type="url"
                value={contact.youtubeUrl || 'https://youtube.com/@association-amesd'}
                onChange={(e) => handleFieldChange('youtubeUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">معرف القناة (Channel ID)</label>
              <input
                type="text"
                value={contact.youtubeChannelId || 'UCBPlqmKVq9KvzXMEmp5dDPQ'}
                onChange={(e) => handleFieldChange('youtubeChannelId', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المعرف (YouTube Handle)</label>
              <input
                type="text"
                value={contact.youtubeHandle || '@association-amesd'}
                onChange={(e) => handleFieldChange('youtubeHandle', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Address & Maps */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>العنوان الفعلي ورابط خريطة Google Maps</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان التفصيلي بالقنيطرة</label>
              <input
                type="text"
                value={contact.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رابط الخريطة المباشر (Google Maps)</label>
              <input
                type="url"
                value={contact.mapUrl || ''}
                onChange={(e) => handleFieldChange('mapUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Bank Account */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>الحساب البنكي الرسمي للتبرعات (RIB)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المؤسسة البنكية</label>
              <input
                type="text"
                value={contact.bankName || ''}
                onChange={(e) => handleFieldChange('bankName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم صاحب الحساب</label>
              <input
                type="text"
                value={contact.accountHolder || ''}
                onChange={(e) => handleFieldChange('accountHolder', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الحساب (RIB - 24 رقماً)</label>
              <input
                type="text"
                value={contact.rib || ''}
                onChange={(e) => handleFieldChange('rib', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
