import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { ImageUploader } from '../components/ImageUploader';
import { 
  FileText, Plus, Trash2, Eye, EyeOff, 
  Save, Check, LayoutTemplate, Layers 
} from 'lucide-react';

export const PagesAdmin = ({ initialPage = 'home' }) => {
  const { pageKey } = useParams();
  const { cmsData, updatePageSection, addPageSection, deletePageSection } = useCms();
  const [activePage, setActivePage] = useState(pageKey || initialPage); // home, about

  useEffect(() => {
    if (pageKey && (pageKey === 'home' || pageKey === 'about')) {
      setActivePage(pageKey);
    }
  }, [pageKey]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [newSectionModal, setNewSectionModal] = useState(false);
  const [newSectionForm, setNewSectionForm] = useState({
    title: '',
    text: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    visible: true
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const currentPageData = cmsData?.pages?.[activePage] || { sections: [] };
  const sections = currentPageData.sections || [];

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSectionForm.title) return;
    addPageSection(activePage, newSectionForm);
    setNewSectionModal(false);
    setNewSectionForm({
      title: '',
      text: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      visible: true
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-emerald-700" />
            <span>تعديل محتوى وأقسام الصفحات (/admin/pages/{activePage})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تحكم في أقسام الصفحة الرئيسية وصفحة "من نحن" مع تعديل النصوص والصور والأزرار وإظهارها أو إخفائها
          </p>
        </div>

        <button
          onClick={() => setNewSectionModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة قسم جديد للصفحة</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ التعديلات في Firestore بنجاح!</span>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActivePage('home')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activePage === 'home'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          أقسام الصفحة الرئيسية (Home Page)
        </button>
        <button
          onClick={() => setActivePage('about')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activePage === 'about'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          صفحة "من نحن" والأهداف (About Page)
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
            لا توجد أقسام في هذه الصفحة حالياً. اضغط "إضافة قسم جديد" للبدء.
          </div>
        ) : (
          sections.map((sec, index) => (
            <div key={sec.id || index} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{sec.title || 'قسم بدون عنوان'}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {sec.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updatePageSection(activePage, sec.id, { visible: !sec.visible })}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      sec.visible 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{sec.visible ? 'القسم ظاهر' : 'القسم مخفي'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("هل تريد حذف هذا القسم نهائياً؟")) {
                        deletePageSection(activePage, sec.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="حذف القسم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Edit fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عنوان القسم</label>
                    <input
                      type="text"
                      value={sec.title || ''}
                      onChange={(e) => updatePageSection(activePage, sec.id, { title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نص المحتوى والتفاصيل</label>
                    <textarea
                      rows={4}
                      value={sec.text || ''}
                      onChange={(e) => updatePageSection(activePage, sec.id, { text: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm leading-relaxed resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">نص الزر</label>
                      <input
                        type="text"
                        value={sec.buttonText || ''}
                        onChange={(e) => updatePageSection(activePage, sec.id, { buttonText: e.target.value })}
                        placeholder="اقرأ المزيد"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رابط الزر</label>
                      <input
                        type="text"
                        value={sec.buttonLink || ''}
                        onChange={(e) => updatePageSection(activePage, sec.id, { buttonLink: e.target.value })}
                        placeholder="/#services"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <ImageUploader
                    label="صورة هذا القسم"
                    value={sec.image || ''}
                    onChange={(img) => updatePageSection(activePage, sec.id, { image: img })}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Section Modal */}
      {newSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-700" />
              <span>إضافة قسم جديد لصفحة {activePage === 'home' ? 'الرئيسية' : 'من نحن'}</span>
            </h3>

            <form onSubmit={handleAddSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان القسم *</label>
                <input
                  type="text"
                  required
                  value={newSectionForm.title}
                  onChange={(e) => setNewSectionForm({ ...newSectionForm, title: e.target.value })}
                  placeholder="مثال: رسالتنا، أهداف المركز..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نص المحتوى *</label>
                <textarea
                  rows={3}
                  required
                  value={newSectionForm.text}
                  onChange={(e) => setNewSectionForm({ ...newSectionForm, text: e.target.value })}
                  placeholder="تفاصيل وشرح هذا القسم..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نص الزر</label>
                  <input
                    type="text"
                    value={newSectionForm.buttonText}
                    onChange={(e) => setNewSectionForm({ ...newSectionForm, buttonText: e.target.value })}
                    placeholder="استكشف المزيد"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رابط الزر</label>
                  <input
                    type="text"
                    value={newSectionForm.buttonLink}
                    onChange={(e) => setNewSectionForm({ ...newSectionForm, buttonLink: e.target.value })}
                    placeholder="/#services"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <ImageUploader
                label="صورة للقسم (اختياري)"
                value={newSectionForm.image}
                onChange={(img) => setNewSectionForm({ ...newSectionForm, image: img })}
              />

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewSectionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white"
                >
                  إضافة القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
