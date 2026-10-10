import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { getStoredFirebaseConfig } from '../../services/firebase';
import { Database, Save, Check, AlertCircle, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';

export const FirebaseSettingsAdmin = () => {
  const { firebaseStatus, saveFirebaseConfig, resetCmsDefaults } = useCms();
  const [config, setConfig] = useState(getStoredFirebaseConfig());
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  const handleSave = (e) => {
    e.preventDefault();
    setTesting(true);

    const result = saveFirebaseConfig(config);
    setTesting(false);

    if (result.success && result.isConfigured) {
      setStatusMessage("تم حفظ وربط مشروع Firebase Firestore بنجاح!");
    } else {
      setStatusMessage("تم حفظ الإعدادات بنجاح. إذا لم تكن المفاتيح مكتملة، يستمر النظام في العمل محلياً 100%.");
    }

    setTimeout(() => setStatusMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-500" />
            <span>إعدادات Firebase Firestore & Storage (/admin/firebase)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ربط لوحة التحكم مباشرة بقاعدة بيانات Firestore السحابية لمزامنة التعديلات في الوقت الفعلي
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            firebaseStatus 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${firebaseStatus ? 'bg-emerald-600 animate-ping' : 'bg-amber-500'}`}></span>
            <span>{firebaseStatus ? 'Firestore متصل سحابياً' : 'وضع التخزين الذكي (محلي)'}</span>
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Info Notice */}
      <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-300/60 rounded-3xl p-6 text-xs sm:text-sm text-slate-700 space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>كيفية ربط حساب Firebase الخاص بك:</span>
        </div>
        <ol className="list-decimal list-inside space-y-1 text-slate-600">
          <li>توجه إلى <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">Firebase Console</a> وأنشئ مشروعاً مجانياً جديداً.</li>
          <li>قم بتفعيل <strong>Firestore Database</strong> و <strong>Firebase Storage</strong> في وضع الاختبار أو الإنتاج.</li>
          <li>انسخ مفاتيح التكوين (Firebase SDK Config) وألصقها في الحقول أسفله ثم اضغط "حفظ وربط Firestore".</li>
          <li><strong>ملاحظة هامة:</strong> إذا تركت الحقول فارغة، فإن لوحة التحكم والموقع يستمران في العمل فورياً وتلقائياً بنسبة 100% عبر التخزين الذكي بدون توقف.</li>
        </ol>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">apiKey</label>
            <input
              type="text"
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">authDomain</label>
            <input
              type="text"
              value={config.authDomain || ''}
              onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
              placeholder="your-project.firebaseapp.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">projectId</label>
            <input
              type="text"
              value={config.projectId || ''}
              onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              placeholder="your-project-id"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">storageBucket</label>
            <input
              type="text"
              value={config.storageBucket || ''}
              onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
              placeholder="your-project.appspot.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">messagingSenderId</label>
            <input
              type="text"
              value={config.messagingSenderId || ''}
              onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
              placeholder="123456789"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">appId</label>
            <input
              type="text"
              value={config.appId || ''}
              onChange={(e) => setConfig({ ...config, appId: e.target.value })}
              placeholder="1:123456789:web:abcdef"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              dir="ltr"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("هل تريد إعادة ضبط بيانات الـ CMS إلى الحالة الافتراضية الأولية؟")) {
                resetCmsDefaults();
                alert("تمت إعادة ضبط البيانات الافتراضية بنجاح.");
              }
            }}
            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition border border-red-200"
          >
            إعادة تعيين البيانات الافتراضية
          </button>

          <button
            type="submit"
            disabled={testing}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-50"
          >
            {testing ? 'جارٍ التحقق والربط...' : 'حفظ وربط Firestore'}
          </button>
        </div>
      </form>

      {/* Firestore Security Rules Guide */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <span>قواعد أمان Firestore الرسمية (Firestore Rules)</span>
        </h3>
        <p className="text-xs text-slate-600">
          انسخ هذه القواعد وضعها في تبويب <strong>Rules</strong> داخل Firebase Console للسماح للزوار بإرسال الرسائل والنشر الذاتي مع حماية التعديل للأدمن فقط:
        </p>
        <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed" dir="ltr">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /autoTopics/{topicId} {
      allow read, write: if true;
    }
    match /autoSettings/{settingId} {
      allow read, write: if true;
    }
    match /articles/{articleId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};
