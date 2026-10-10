import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { MousePointerClick, Save, Check, ExternalLink } from 'lucide-react';

export const ButtonsAdmin = () => {
  const { cmsData, updateButtons } = useCms();
  const [buttons, setButtons] = useState(cmsData?.buttons || {});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (cmsData?.buttons) {
      setButtons(cmsData.buttons);
    }
    setLoading(false);
  }, [cmsData?.buttons]);

  const buttonDefinitions = [
    {
      id: "heroBtn1",
      name: "زر الـ Hero الرئيسي 1 (تبرع / مساهمة)",
      location: "واجهة الموقع الرئيسية - أعلى الشاشة",
      textKey: "heroBtn1_text",
      linkKey: "heroBtn1_link",
      colorKey: "heroBtn1_color"
    },
    {
      id: "heroBtn2",
      name: "زر الـ Hero الثاني (خدماتنا)",
      location: "واجهة الموقع الرئيسية - بجوار زر 1",
      textKey: "heroBtn2_text",
      linkKey: "heroBtn2_link",
      colorKey: "heroBtn2_color"
    },
    {
      id: "navDonate",
      name: "زر التبرع في شريط الهيدر (Navbar)",
      location: "الهيدر العلوي في جميع الصفحات",
      textKey: "navDonate_text",
      linkKey: "navDonate_link",
      colorKey: "navDonate_color"
    },
    {
      id: "serviceInquire",
      name: "زر طلب الخدمة في قسم الخدمات",
      location: "بطاقات الخدمات وقسم البرامج",
      textKey: "serviceInquire_text",
      linkKey: "serviceInquire_link",
      colorKey: "serviceInquire_color"
    },
    {
      id: "whatsappBtn",
      name: "زر المراسلة الفورية عبر واتساب",
      location: "الزر العائم وقسم اتصل بنا",
      textKey: "whatsappBtn_text",
      linkKey: "whatsappBtn_link",
      colorKey: "whatsappBtn_color"
    },
    {
      id: "mapBtn",
      name: "زر فتح موقع الجمعية على الخريطة",
      location: "قسم الخريطة وتفاصيل العنوان بالقنيطرة",
      textKey: "mapBtn_text",
      linkKey: "mapBtn_link",
      colorKey: "mapBtn_color"
    }
  ];

  const handleFieldChange = (key, val) => {
    setButtons(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    updateButtons(buttons);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getColorClasses = (color) => {
    switch(color) {
      case 'amber': return 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold';
      case 'blue': return 'bg-blue-600 hover:bg-blue-700 text-white font-bold';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700 text-white font-bold';
      case 'slate': return 'bg-slate-900 hover:bg-slate-800 text-white font-bold';
      default: return 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold';
    }
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
            <MousePointerClick className="w-6 h-6 text-emerald-700" />
            <span>تعديل أزرار الموقع بالكامل (/admin/buttons)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            كل زر في الموقع يمتلك ID فريداً يمكنك تعديل نصه، رابطه، ولونه وحفظه فورياً في Firestore
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Save className="w-5 h-5" />
          <span>حفظ تغييرات الأزرار</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ إعدادات الأزرار بنجاح وتحديثها في الموقع!</span>
        </div>
      )}

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {buttonDefinitions.map((b) => {
          const textVal = buttons[b.textKey] || '';
          const linkVal = buttons[b.linkKey] || '';
          const colorVal = buttons[b.colorKey] || 'emerald';

          return (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
                  <span className="text-xs text-slate-400 block mt-0.5">{b.location} • ID: <strong className="text-emerald-700 font-mono">{b.id}</strong></span>
                </div>

                {/* Preview Button */}
                <div className="shrink-0 text-center">
                  <span className="text-[10px] text-slate-400 block mb-1">المعاينة</span>
                  <div className={`px-4 py-2 rounded-xl text-xs transition shadow-sm ${getColorClasses(colorVal)}`}>
                    {textVal || 'زر تجريبي'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نص الزر</label>
                  <input
                    type="text"
                    value={textVal}
                    onChange={(e) => handleFieldChange(b.textKey, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الرابط الموجه إليه (Link / Anchor)</label>
                  <input
                    type="text"
                    value={linkVal}
                    onChange={(e) => handleFieldChange(b.linkKey, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">لون الزر ونمطه</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'emerald', label: 'أخضر زمردي', bg: 'bg-emerald-700' },
                      { id: 'amber', label: 'ذهبي / كهرماني', bg: 'bg-amber-500' },
                      { id: 'slate', label: 'رمادي داكن / أسود', bg: 'bg-slate-900' },
                      { id: 'blue', label: 'أزرق ملكي', bg: 'bg-blue-600' },
                      { id: 'rose', label: 'أحمر مغربي', bg: 'bg-rose-600' },
                    ].map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleFieldChange(b.colorKey, c.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          colorVal === c.id 
                            ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50' 
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${c.bg}`}></span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
