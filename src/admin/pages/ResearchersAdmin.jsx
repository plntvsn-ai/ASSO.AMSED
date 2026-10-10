import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, UserPlus, Trash2, CheckCircle2, XCircle, Mail, Phone, Award } from 'lucide-react';

export default function ResearchersAdmin() {
  const [loading, setLoading] = useState(true);
  const [researchers, setResearchers] = useState(() => {
    try {
      const saved = localStorage.getItem('amsed_researchers_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: "res-1", name: "د. أمينة المرابط", email: "amina.morabit@gmail.com", phone: "0661234567", role: "أخصائية تربية خاصة وتوحد", active: true },
      { id: "res-2", name: "أ. رشيد بنسعيد", email: "rachid.bensaid@gmail.com", phone: "0669876543", role: "مواكب الحياة المدرسية AVS", active: true }
    ];
  });

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'أخصائي وباحث تربوي' });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (db) {
          const snap = await getDoc(doc(db, "siteSettings", "main"));
        }
      } catch (e) {
        console.error("ResearchersAdmin fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveList = (newList) => {
    setResearchers(newList);
    localStorage.setItem('amsed_researchers_list', JSON.stringify(newList));
    if (db) {
      setDoc(doc(db, "researchers", "list"), { list: newList }, { merge: true }).catch(() => {});
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const newRes = {
      id: 'res-' + Date.now(),
      ...form,
      active: true,
      createdAt: new Date().toISOString()
    };
    const updated = [newRes, ...researchers];
    saveList(updated);
    setForm({ name: '', email: '', phone: '', role: 'أخصائي وباحث تربوي' });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const toggleStatus = (id) => {
    const updated = researchers.map(r => r.id === id ? { ...r, active: !r.active } : r);
    saveList(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المحرر؟")) {
      const updated = researchers.filter(r => r.id !== id);
      saveList(updated);
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
            <Users className="w-6 h-6 text-emerald-700" />
            <span>إدارة المحررين والباحثين التربويين (/admin/researchers)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إضافة أطر وباحثين لكتابة مقالات تخصصية تخضع لمراجعة إدارة الجمعية قبل النشر
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>تمت إضافة المحرر بنجاح!</span>
        </div>
      )}

      {/* Add Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-emerald-700" />
          <span>إضافة محرر / باحث جديد</span>
        </h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="د. فاطمة الزهراء"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="fatima@example.com"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="06XXXXXXXX"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الصفة / التخصص</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow"
            >
              إضافة المحرر
            </button>
          </div>
        </form>
      </div>

      {/* Researchers List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          قائمة المحررين المعتمدين ({researchers.length})
        </h3>

        <div className="divide-y divide-slate-100">
          {researchers.map((res) => (
            <div key={res.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{res.name}</h4>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    res.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {res.active ? 'نشط' : 'معلق'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-600" />{res.role}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{res.email}</span>
                  {res.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{res.phone}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(res.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    res.active ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }`}
                >
                  {res.active ? 'تعليق الحساب' : 'تفعيل'}
                </button>

                <button
                  onClick={() => handleDelete(res.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
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
export { ResearchersAdmin };
