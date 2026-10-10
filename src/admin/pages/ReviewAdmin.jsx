import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { CheckSquare, CheckCircle, XCircle, Eye, Trash2, Calendar, User, Tag } from 'lucide-react';

export default function ReviewAdmin() {
  const { cmsData, addArticle } = useCms();
  const [loading, setLoading] = useState(true);

  const [pendingArticles, setPendingArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('amsed_pending_reviews');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "rev-1",
        title: "التكامل الحسي وأثره في تخفيف نوبات التوتر عند أطفال التوحد",
        author: "د. أمينة المرابط",
        category: "التوحد ورعاية الطفل",
        summary: "دراسة وتوجيهات عملية للأسر حول كيفية تهيئة الغرفة الحسية والأدوات المساعدة في البيت.",
        content: "<p>يعتبر التكامل الحسي مدخلاً أساسياً في استقرار الحالة المزاجية لطفل التوحد...</p>",
        createdAt: new Date().toISOString().split('T')[0],
        status: "pending"
      }
    ];
  });

  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (db) {
          const snap = await getDoc(doc(db, "siteSettings", "main"));
        }
      } catch (e) {
        console.error("ReviewAdmin fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const savePending = (list) => {
    setPendingArticles(list);
    localStorage.setItem('amsed_pending_reviews', JSON.stringify(list));
    if (db) {
      setDoc(doc(db, "pendingArticles", "list"), { list }, { merge: true }).catch(() => {});
    }
  };

  const handleApprove = (item) => {
    // Add to live published articles!
    addArticle({
      title: item.title,
      content: item.content,
      category: item.category || "التوحد ورعاية الطفل",
      author: item.author,
      image: item.image || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80",
      published: true
    });

    const updated = pendingArticles.filter(p => p.id !== item.id);
    savePending(updated);
    alert(`تمت الموافقة ونشر المقال "${item.title}" في الموقع فوراً!`);
  };

  const handleReject = (id) => {
    if (window.confirm("هل أنت متأكد من رفض وحذف هذا المقال من قائمة المراجعة؟")) {
      const updated = pendingArticles.filter(p => p.id !== id);
      savePending(updated);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-700" />
            <span>مراجعة وتدقيق مقالات المحررين (/admin/review)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            مقالات الباحثين والأطر التربوية التي تنتظر موافقة الإدارة قبل نشرها رسمياً في الموقع
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          المقالات المعلقة قيد التدقيق ({pendingArticles.length})
        </h3>

        {pendingArticles.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            لا توجد مقالات معلقة قيد المراجعة حالياً.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingArticles.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition space-y-3 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{item.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{item.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{item.createdAt}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px]">{item.category}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 w-fit">
                    قيد المراجعة
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.summary || item.content?.replace(/<[^>]+>/g, '').substring(0, 200) + '...'}
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>معاينة المحتوى</span>
                  </button>

                  <button
                    onClick={() => handleReject(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>رفض</span>
                  </button>

                  <button
                    onClick={() => handleApprove(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>موافقة ونشر بالموقع فوراً</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900">{previewItem.title}</h3>
            <div className="text-xs text-slate-500">الكاتب: {previewItem.author}</div>
            <div 
              className="prose text-slate-700 text-sm leading-relaxed border-y border-slate-100 py-4"
              dangerouslySetInnerHTML={{ __html: previewItem.content }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  handleApprove(previewItem);
                  setPreviewItem(null);
                }}
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
              >
                موافقة ونشر الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { ReviewAdmin };
