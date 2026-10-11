import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { defaultCmsData } from '../../services/cmsService';
import { HandHeart, Save, Check, RefreshCw, Sparkles, Image, Tag, FileText } from 'lucide-react';

export const ServicesAdmin = () => {
  const { cmsData, updateService, updateAllServices } = useCms();
  const [servicesList, setServicesList] = useState([]);
  const [savedMessage, setSavedMessage] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [globalSaving, setGlobalSaving] = useState(false);

  useEffect(() => {
    const list = (cmsData?.services && cmsData.services.length > 0)
      ? cmsData.services
      : defaultCmsData.services;
    setServicesList(list);
  }, [cmsData?.services]);

  const handleFieldChange = (id, field, value) => {
    setServicesList(prev => prev.map(s => 
      String(s.id) === String(id) ? { ...s, [field]: value } : s
    ));
  };

  // Save single service
  const handleSaveSingle = async (service) => {
    setSavingId(service.id);
    updateService(service.id, {
      name: service.name,
      category: service.category,
      description: service.description,
      image: service.image,
      price: service.price || "تواصل معنا",
      status: "published",
      isApproved: true
    });
    setTimeout(() => {
      setSavingId(null);
      setSavedMessage(`تم حفظ خدمة "${service.name}" بنجاح في Firebase والموقع!`);
      setTimeout(() => setSavedMessage(''), 4000);
    }, 400);
  };

  // Save all services
  const handleSaveAll = async () => {
    setGlobalSaving(true);
    updateAllServices(servicesList);
    setTimeout(() => {
      setGlobalSaving(false);
      setSavedMessage("تم حفظ وتحديث كافة الخدمات الـ 8 بنجاح في Firebase والموقع!");
      setTimeout(() => setSavedMessage(''), 5000);
    }, 500);
  };

  // Reset to default services
  const handleResetDefaults = () => {
    if (window.confirm("هل تريد استعادة البيانات الأصلية للخدمات الـ 8؟")) {
      updateAllServices(defaultCmsData.services);
      setServicesList(defaultCmsData.services);
      setSavedMessage("تمت استعادة الخدمات الأصلية بنجاح.");
      setTimeout(() => setSavedMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <HandHeart className="w-6 h-6 text-emerald-700" />
            <span>إعدادات الخدمات الـ 8 (/admin/services)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تعديل عناوين، أوصاف، وتصاوير الخدمات الـ 8 المنشورة مباشرة فالموقع مع الحفظ التلقائي في Firebase
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleResetDefaults}
            type="button"
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-2xl border border-slate-200 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>استعادة الافتراضي</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={globalSaving}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50 text-xs sm:text-sm"
          >
            <Save className="w-5 h-5" />
            <span>{globalSaving ? 'جاري الحفظ في Firebase...' : 'حفظ كافة التعديلات في Firebase'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedMessage && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn shadow-sm">
          <Check className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Services Grid (8 Services Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicesList.map((service, index) => {
          const isSavingThis = savingId === service.id;

          return (
            <div
              key={service.id || index}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition space-y-5"
            >
              <div className="space-y-4">
                
                {/* Header of Card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">ID: {service.id}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>منشور ومفعل (Published)</span>
                  </span>
                </div>

                {/* Service Poster Image Preview & Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-emerald-700" />
                    <span>رابط أو مسار صورة الملصق (Image URL)</span>
                  </label>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-sm">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/logo.png";
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={service.image || ''}
                        onChange={(e) => handleFieldChange(service.id, 'image', e.target.value)}
                        placeholder="/products/01_TSA_ABA.jpg"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                        dir="ltr"
                      />
                      <span className="text-[11px] text-slate-400 block">
                        الملف موجود في <code className="text-emerald-700 font-mono">/public/products/</code>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>عنوان الخدمة (العنوان) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={service.name || ''}
                    onChange={(e) => handleFieldChange(service.id, 'name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900"
                    placeholder="مثال: مركز أطفال التوحد - TSA & ABA"
                  />
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>التصنيف (Category)</span>
                  </label>
                  <input
                    type="text"
                    value={service.category || ''}
                    onChange={(e) => handleFieldChange(service.id, 'category', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                    placeholder="التوحد، التخاطب، حركية، نفسي، اجتماعية..."
                  />
                </div>

                {/* Service Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    وصف الخدمة (الوصف) *
                  </label>
                  <textarea
                    rows={3}
                    value={service.description || ''}
                    onChange={(e) => handleFieldChange(service.id, 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-700 leading-relaxed"
                    placeholder="شرح مبسط ومختصر للخدمة وما تقدمه للطفل والأسرة..."
                  />
                </div>

              </div>

              {/* Bottom Action Button for this service */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSingle(service)}
                  disabled={isSavingThis}
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingThis ? 'جاري الحفظ...' : 'حفظ التعديل'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ServicesAdmin;
