import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Phone, Mail, MapPin, Save, Check, Compass, CreditCard } from 'lucide-react';

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
