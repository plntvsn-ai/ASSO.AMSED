import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ImageUploader } from '../components/ImageUploader';
import { Image, Plus, Trash2, Check, Tag } from 'lucide-react';

export const GalleryAdmin = () => {
  const { cmsData, addGalleryItem, deleteGalleryItem } = useCms();
  const [form, setForm] = useState({
    title: '',
    image: '',
    category: 'activities'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const gallery = cmsData?.gallery || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("يرجى رفع أو وضع رابط الصورة");
      return;
    }

    addGalleryItem(form);
    setForm({
      title: '',
      image: '',
      category: 'activities'
    });
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
            <Image className="w-6 h-6 text-emerald-700" />
            <span>إدارة معرض الصور (/admin/gallery)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            رفع صور جديدة بالسحب والإفلات أو الروابط وتصنيفها مع حفظ فوري في Firestore
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تمت إضافة الصورة بنجاح إلى المعرض!</span>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base mb-2">إضافة صورة جديدة للمعرض</h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الصورة أو الوصف</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثال: ورشة صناعة الحلويات..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
              >
                <option value="activities">أنشطة وترفيه وورشات</option>
                <option value="education">التعليم والإدماج المدرسي</option>
                <option value="medical">القوافل الصحية</option>
                <option value="social">المساعدات الاجتماعية</option>
              </select>
            </div>
          </div>

          <ImageUploader
            label="رفع الصورة (Drag & Drop)"
            value={form.image}
            onChange={(img) => setForm({ ...form, image: img })}
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
            >
              إضافة الصورة للمعرض
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="relative group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("هل تريد حذف هذه الصورة نهائياً؟")) {
                    deleteGalleryItem(item.id);
                  }
                }}
                className="absolute top-2 end-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
                title="حذف الصورة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block w-fit mb-1">
                {item.category}
              </span>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.title || 'بدون عنوان'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
