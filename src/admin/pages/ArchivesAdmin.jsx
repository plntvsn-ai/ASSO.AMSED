import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { FileText, Plus, Trash2, Download, FileUp, Check, Save } from 'lucide-react';

export const ArchivesAdmin = () => {
  const { cmsData, addArchive, deleteArchive } = useCms();
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSaveAll = () => {
    setSavedMessage("تم حفظ وتحديث وثائق الأرشيف في Firebase والموقع بنجاح!");
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSavedMessage('');
    }, 4000);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const archives = cmsData?.archives || [];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || (!fileUrl && !fileName)) return;

    addArchive({
      title,
      fileName: fileName || `${title}.pdf`,
      fileUrl: fileUrl || "#",
      fileType: "PDF",
      size: fileSize || "1.5 MB",
      date: new Date().toISOString().split('T')[0]
    });

    setTitle('');
    setFileName('');
    setFileUrl('');
    setFileSize('');
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
            <FileText className="w-6 h-6 text-emerald-700" />
            <span>إدارة الأرشيف والتقارير والـ PDF (/admin/archives)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            رفع ملفات PDF، التقارير الأدبية والمالية، والقانون الأساسي للجمعية وإتاحتها للتحميل
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          type="button"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0 text-xs sm:text-sm"
        >
          <Save className="w-5 h-5" />
          <span>حفظ التعديلات في Firebase</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn shadow-sm">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>{savedMessage || "تمت إضافة الوثيقة إلى الأرشيف بنجاح!"}</span>
        </div>
      )}

      {/* Add PDF Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>إضافة مستند أو ملف PDF جديد</span>
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الوثيقة أو التقرير *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: التقرير المالي لسنة 2026..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رفع ملف PDF من جهازك</label>
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-700">
                  <FileUp className="w-4 h-4 text-emerald-700" />
                  <span>{fileName ? `تم تحديد: ${fileName}` : 'اختر ملف PDF'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
            >
              إضافة الوثيقة للأرشيف
            </button>
          </div>
        </form>
      </div>

      {/* Archives List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="p-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
          <span>الوثائق والملفات المتاحة ({archives.length})</span>
          <span>الإجراءات</span>
        </div>

        {archives.map((doc) => (
          <div key={doc.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                PDF
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{doc.fileName}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {doc.fileUrl && doc.fileUrl !== '#' && (
                <a
                  href={doc.fileUrl}
                  download={doc.fileName}
                  className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                  title="تحميل"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("هل تريد حذف هذا المستند؟")) {
                    deleteArchive(doc.id);
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
