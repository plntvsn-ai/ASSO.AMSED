import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BookOpen, Plus, Trash2, CheckCircle2, RotateCcw, Search, Sparkles } from 'lucide-react';

export default function TopicsAdmin() {
  const { cmsData, updateAutoTopics, bulkAddAutoTopics, toggleTopicUsed, deleteAutoTopic } = useCms();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkText, setBulkText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        if (db) {
          const snap = await getDoc(doc(db, "siteSettings", "main"));
        }
      } catch (e) {
        console.error("TopicsAdmin fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const topics = cmsData?.autoTopics || [];
  const filteredTopics = topics.filter(t => 
    (t.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBulkAdd = (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    const count = bulkAddAutoTopics(bulkText);
    setBulkText('');
    alert(`تمت إضافة ${count} موضوع بنجاح!`);
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-700" />
            <span>خزان ومواضيع النشر الآلي (/admin/topics)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة كافة مواضيع المقالات المبرمجة ({topics.length} موضوع) مع إمكانية إضافة وحذف وتبديل حالة النشر
          </p>
        </div>
      </div>

      {/* Bulk Add */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>إضافة مواضيع جديدة (كل سطر موضوع)</span>
        </h3>
        <form onSubmit={handleBulkAdd} className="space-y-3">
          <textarea
            rows={3}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="اكتب أو الصق مواضيع جديدة هنا..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={!bulkText.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition disabled:opacity-50"
          >
            إضافة إلى الخزان
          </button>
        </form>
      </div>

      {/* Filter and List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute end-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في المواضيع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pe-10 ps-4 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <span className="text-xs text-slate-500 font-bold">
            عدد النتائج: {filteredTopics.length}
          </span>
        </div>

        <div className="space-y-2">
          {filteredTopics.map((t, idx) => (
            <div
              key={t.id || idx}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                t.used ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 w-6">#{idx + 1}</span>
                <span className={`text-xs sm:text-sm font-bold ${t.used ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {t.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleTopicUsed(t.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    t.used ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {t.used ? 'مستعمل' : 'متاح'}
                </button>

                <button
                  onClick={() => deleteAutoTopic(t.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export { TopicsAdmin };
