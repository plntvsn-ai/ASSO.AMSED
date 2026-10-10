import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Send, LogOut, CheckCircle2, FileText, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function ResearcherDashboard() {
  const navigate = useNavigate();
  const session = (() => {
    try {
      return JSON.parse(localStorage.getItem('amsed_researcher_session') || '{}');
    } catch {
      return {};
    }
  })();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('التوحد ورعاية الطفل');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPending = {
      id: 'rev-' + Date.now(),
      title,
      category,
      summary,
      content,
      author: session.name || session.email || "باحث معتمد",
      createdAt: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    try {
      const saved = JSON.parse(localStorage.getItem('amsed_pending_reviews') || '[]');
      saved.unshift(newPending);
      localStorage.setItem('amsed_pending_reviews', JSON.stringify(saved));
    } catch {
      localStorage.setItem('amsed_pending_reviews', JSON.stringify([newPending]));
    }

    setSubmitted(true);
    setTitle('');
    setSummary('');
    setContent('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('amsed_researcher_session');
    navigate('/researcher/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800" dir="rtl">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Logo size={42} />
          <div>
            <h2 className="font-extrabold text-sm text-slate-900">منصة تحرير المقالات والبحوث</h2>
            <span className="text-xs text-slate-500">المحرر: <strong>{session.email || 'مستخدم معتمد'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs font-bold text-slate-600 hover:text-emerald-700">الموقع الرئيسي</Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <h1 className="text-xl font-black text-slate-900">كتابة مقال / بحث جديد للمراجعة</h1>
          </div>
          <p className="text-xs text-slate-500">
            سيتم إرسال المقال لإدارة جمعية AMSED لمراجعته وتدقيقه، وفور اعتماده سيتم نشره مباشرة في صفحة مقالات الموقع.
          </p>

          {submitted && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>تم إرسال مقالك بنجاح إلى إدارة الجمعية للمراجعة والاعتماد!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان المقال *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: استراتيجيات التعامل مع القلق الحسي عند طفل التوحد"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                >
                  <option value="التوحد ورعاية الطفل">التوحد ورعاية الطفل</option>
                  <option value="التعليم والإدماج">التعليم والإدماج</option>
                  <option value="التأهيل المهني">التأهيل المهني</option>
                  <option value="صحة الطفل">صحة الطفل</option>
                  <option value="دعم الأسرة">دعم الأسرة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملخص موجز</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="سطران يوضحان فكرة المقال..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">محتوى المقال الكامل *</label>
              <textarea
                rows={10}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب المقال هنا بتفاصيله وإرشاداته العملية..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm leading-relaxed"
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>إرسال المقال للمراجعة</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
export { ResearcherDashboard };
