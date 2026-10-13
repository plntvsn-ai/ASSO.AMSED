import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function SecureLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validUsers = [
    'admin_amsed_2026',
    'amsed_admin',
    (import.meta.env.VITE_ADMIN_USER || '').trim()
  ].filter(Boolean);

  const validPasses = [
    (import.meta.env.VITE_ADMIN_PASS || '').trim(),
    'Amsed@2026!Secure#77',
    'admin_amsed_2026',
    'amsed_2026'
  ].filter(Boolean);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (validUsers.includes(inputUser) && validPasses.includes(inputPass)) {
      localStorage.setItem('amsed_auth', 'true');
      localStorage.setItem('amsed_admin_authorized', 'amsed_vault_secure_987654');
      navigate('/am-ctrl-9k2l8x-2026-secure-panel-77');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التحقق من بيانات الدخول.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Logo and Brand */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-inner">
              <Logo size={56} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            لوحة التحكم المركزية الآمنة
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AMSED Secure Master Panel 2026</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              اسم المستخدم (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin_amsed_2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              <User className="w-5 h-5 text-slate-500 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              كلمة المرور (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              <Lock className="w-5 h-5 text-slate-500 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول إلى لوحة التحكم 🚀'}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
          مسار آمن ومشفر: /am-ctrl-9k2l8x-2026-secure-panel-77
        </div>

      </div>
    </div>
  );
}
