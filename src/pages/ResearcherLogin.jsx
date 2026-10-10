import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { UserCheck, Lock, Mail, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ResearcherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }
    // Set researcher session
    localStorage.setItem('amsed_researcher_session', JSON.stringify({ email, name: email.split('@')[0] }));
    navigate('/researcher/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans text-slate-800" dir="rtl">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6">
        
        {/* Header with Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size={72} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">بوابة المحررين والباحثين</h1>
          <p className="text-xs text-slate-500">جمعية المبادرة المغربية للتكافل والتعاون (AMSED)</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني المعتمد</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amina@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">رمز الدخول أو كلمة المرور</label>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>تسجيل الدخول للمنصة</span>
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/" className="hover:text-emerald-700 transition">العودة للرئيسية</Link>
          <Link to="/admin" className="hover:text-emerald-700 transition">لوحة تحكم الإدارة</Link>
        </div>

      </div>
    </div>
  );
}
export { ResearcherLogin };
