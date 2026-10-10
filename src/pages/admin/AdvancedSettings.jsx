import { useState, useEffect } from "react";
import { 
  doc, getDoc, setDoc, collection, getDocs, addDoc, 
  deleteDoc, updateDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "../../firebase";
import { autoGenerateAndPublish } from "../../services/autoPublisher";
import { 
  Settings, Bot, Sparkles, PlusCircle, Trash2, CheckCircle2, 
  Clock, AlertCircle, RefreshCw, BookOpen, Send, ToggleLeft, ToggleRight
} from "lucide-react";

export const DEFAULT_50_TOPICS = [
  "كيف يبدأ طفل التوحد يومه؟ روتين الصباح خطوة بخطوة",
  "كيف نعلم طفل التوحد يلبس حوايجو بوحدو بلا ضغط",
  "وقت الفطور: كيف نحول الأكل لنشاط ممتع لطفل التوحد",
  "كيف نعلم طفل التوحد النظافة الشخصية بطريقة بصرية",
  "لماذا يحب طفل التوحد الروتين؟ وكيف نتعامل مع تغييره",
  "كيف تتعامل مع نوبات البكاء والغضب عند طفل التوحد بهدوء",
  "لغة العيون والكلمات: كيف نتواصل مع طفل لا يتكلم كثيرا",
  "كيف نلعب مع طفل التوحد؟ ألعاب بسيطة تنمي التركيز",
  "طفل التوحد في الشارع: كيف يتعامل معه الناس باحترام",
  "التمدرس الدامج: كيف ينجح طفل التوحد داخل القسم",
  "دور المرافقة المدرسية AVS في نجاح إدماج الطفل",
  "كيف نكتشف علامات التوحد الأولى في السنوات المبكرة",
  "التغذية واضطرابات الجهاز الهضمي لدى أطفال التوحد",
  "ورشات المهارات الحياتية: كيف نبني استقلالية الطفل",
  "التأهيل المهني للشباب فوق 12 سنة: الخياطة والحلويات والرسم",
  "محاربة الأمية للأطفال الذين تجاوزهم سن التمدرس",
  "أهمية البرنامج الفردي المخصص لكل طفل حسب قدراته",
  "أثر الرحلات والخرجات الترفيهية في كسر عزلة الأطفال",
  "الدعم النفسي والإرشادي لأولياء أمور أطفال التوحد",
  "كيف نشرح معنى التوحد للإخوة داخل نفس البيت",
  "التعامل مع الحساسيات الحسية للأصوات والأضواء العالية",
  "تدريب الطفل على انتظار الدور والمشاركة مع الأقران",
  "أهمية القوافل الطبية والتحسيسية في المناطق الهشة",
  "كيف نحمي طفل التوحد من مخاطر الشارع والتوهان",
  "دور العلاج الوظيفي وتقويم النطق في تطوير لغة الطفل",
  "التعبير بالفن والألوان: إطلاق إبداع الطفل التوحدي",
  "كيف نساعد طفل التوحد على النوم الهادئ ليلاً",
  "الألعاب الحركية والرياضة المكيفة ودورها في توازن الطفل",
  "كيفية تهيئة الطفل للزيارات العائلية والمناسبات الاجتماعية",
  "التكنولوجيا والتطبيقات الذكية في خدمة تأهيل التوحد",
  "إدماج الأطفال في وضعية صعبة: حماية الحق في الطفولة",
  "قصص نجاح ملهمة لأبطال كسروا حاجز التوحد",
  "التكافل الاجتماعي والتضامن مع الأسر المعوزة بالقنيطرة",
  "تدريب الأطفال على مهارات الشراء واستعمال النقود",
  "التعامل الإيجابي مع السلوكيات النمطية والمتكررة",
  "كيف نطور مهارة التركيز والانتباه عبر اللعب البصري",
  "دور معلمي المدارس النظامية في احتضان الطفل الدامج",
  "ورشات الطبخ والحلويات كوسيلة لتطوير التنسيق الحركي",
  "أهمية الاستماع للطفل وتفسير بكائه بدون توبيخ",
  "كيف نصنع بيئة صفية ومنزلية خالية من المشتتات",
  "دور الجمعيات المدنية في سد الفجوة التأهيلية بالمغرب",
  "الترويح عن النفس للأمهات: محاربة الإجهاد النفسي للأسرة",
  "تدريب الطفل على السلام والتفاعل الاجتماعي بالابتسامة",
  "المهارات الاجتماعية: تكوين صداقات وتفادي العزلة",
  "الاستثمار في التدخل المبكر يغير مستقبل الطفل بالكامل",
  "بطاقات التواصل المصور PECS وكيفية تطبيقها في البيت",
  "التنسيق بين المركز والأسرة: شراكة مستمرة للنجاح",
  "تنظيم الوقت في العطل المدرسية للحفاظ على المكتسبات",
  "التحسيس المجتمعي: تقبل الاختلاف واجب إنساني ووطني",
  "مسار جمعية AMSED في خدمة الطفولة بالقنيطرة: آفاق وأمل"
];

export default function AdvancedSettings(){
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [newTopics, setNewTopics] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [stats, setStats] = useState({ lastRun: null, nextRun: null, total: 0 });
  const [message, setMessage] = useState(null);

  const fetchAll = async () => {
    try {
      if (db) {
        const s = await getDoc(doc(db, "autoSettings", "main"));
        if (s.exists()) {
          setEnabled(s.data().enabled ?? true);
          setStats({
            lastRun: s.data().lastRun?.toDate ? s.data().lastRun.toDate() : null,
            nextRun: s.data().nextRun?.toDate ? s.data().nextRun.toDate() : (s.data().nextRun ? new Date(s.data().nextRun) : null),
            total: s.data().totalPublished || 0
          });
        }

        const tSnap = await getDocs(collection(db, "autoTopics"));
        if (tSnap.empty) {
          // Add default 50 topics if autoTopics is empty
          for (const title of DEFAULT_50_TOPICS) {
            await addDoc(collection(db, "autoTopics"), {
              title,
              used: false,
              createdAt: serverTimestamp()
            });
          }
          const snap2 = await getDocs(collection(db, "autoTopics"));
          setTopics(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setTopics(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } else {
        // Local fallback
        setTopics(DEFAULT_50_TOPICS.map((title, i) => ({ id: `loc-${i}`, title, used: i < 3 })));
      }
    } catch (e) {
      console.error("AdvancedSettings fetch error:", e);
      setTopics(DEFAULT_50_TOPICS.map((title, i) => ({ id: `loc-${i}`, title, used: false })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleEnabled = async () => {
    const newVal = !enabled;
    setEnabled(newVal);
    try {
      if (db) {
        await setDoc(doc(db, "autoSettings", "main"), { enabled: newVal }, { merge: true });
      }
      setMessage({ type: "success", text: newVal ? "تم تفعيل النشر الأوتوماتيكي (ON)" : "تم إيقاف النشر الأوتوماتيكي (OFF)" });
      setTimeout(() => setMessage(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTopics = async () => {
    const lines = newTopics.split("\n").map(l => l.trim()).filter(l => l.length > 5);
    if (lines.length === 0) {
      alert("يرجى كتابة موضوع واحد على الأقل!");
      return;
    }

    try {
      if (db) {
        for (const line of lines) {
          await addDoc(collection(db, "autoTopics"), {
            title: line,
            used: false,
            createdAt: serverTimestamp()
          });
        }
        const snap = await getDocs(collection(db, "autoTopics"));
        setTopics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        const added = lines.map((l, i) => ({ id: `new-${Date.now()}-${i}`, title: l, used: false }));
        setTopics(prev => [...prev, ...added]);
      }
      setNewTopics("");
      setMessage({ type: "success", text: `تمت إضافة ${lines.length} موضوع بنجاح!` });
      setTimeout(() => setMessage(null), 3500);
    } catch (e) {
      alert("خطأ: " + e.message);
    }
  };

  const handlePublishNow = async () => {
    setPublishing(true);
    try {
      const title = await autoGenerateAndPublish();
      if (title) {
        setMessage({ type: "success", text: `تم نشر مقال بنجاح: "${title}"` });
        await fetchAll();
      } else {
        setMessage({ type: "warning", text: "لم يتم العثور على مواضيع للنشر" });
      }
    } catch (e) {
      setMessage({ type: "error", text: "خطأ أثناء النشر: " + e.message });
    } finally {
      setPublishing(false);
      setTimeout(() => setMessage(null), 6000);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm("حذف هذا الموضوع؟")) return;
    try {
      if (db && !id.startsWith("loc-") && !id.startsWith("new-")) {
        await deleteDoc(doc(db, "autoTopics", id));
      }
      setTopics(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      alert("خطأ في الحذف: " + e.message);
    }
  };

  const handleToggleTopicUsed = async (t) => {
    const nextUsed = !t.used;
    try {
      if (db && !t.id.startsWith("loc-") && !t.id.startsWith("new-")) {
        await updateDoc(doc(db, "autoTopics", t.id), { used: nextUsed });
      }
      setTopics(prev => prev.map(x => x.id === t.id ? { ...x, used: nextUsed } : x));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center" dir="rtl">
        <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-800">جاري تحميل الإعدادات المتقدمة...</h3>
      </div>
    );
  }

  const unusedCount = topics.filter(t => !t.used).length;
  const usedCount = topics.filter(t => t.used).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">إعدادات متقدمة - النشر الأوتوماتيكي</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            نظام النشر الذاتي 100% بدون تدخل يدوي - مقال إنساني يومي كل 24 ساعة
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fadeIn ${
          message.type === "success" ? "bg-emerald-100 text-emerald-900 border border-emerald-300" :
          message.type === "warning" ? "bg-amber-100 text-amber-900 border border-amber-300" :
          "bg-red-100 text-red-900 border border-red-300"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Card 1: Toggle & Run */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-600" />
              1. تفعيل النشر الأوتوماتيكي الذكي
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              يقوم النظام بجلب موضوع من الخزان وتوليد مقال موثق ونشره تلقائياً كل 24 ساعة
            </p>
          </div>

          <button
            type="button"
            onClick={toggleEnabled}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm transition shadow-sm ${
              enabled 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20" 
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            }`}
          >
            {enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            <span>{enabled ? "مفعل ON (ينشر كل 24 ساعة)" : "متوقف OFF"}</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">آخر مقال تم نشره:</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">
              {stats.lastRun ? stats.lastRun.toLocaleString("ar-MA") : "لم ينشر بعد"}
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">إجمالي المقالات المنشورة:</span>
            <span className="text-lg font-black text-emerald-700 mt-1 block">
              {stats.total} مقال
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">المواضيع المتاحة في الخزان:</span>
            <span className="text-lg font-black text-blue-700 mt-1 block">
              {unusedCount} متبقي / {topics.length} إجمالي
            </span>
          </div>
        </div>

        {/* Instant publish button */}
        <div className="pt-2">
          <button
            onClick={handlePublishNow}
            disabled={publishing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {publishing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري توليد ونشر المقال الآن...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>جرب دابا - نشر مقال الآن (Publish Now)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card 2: Topic Bank */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            2. بنك وخزان المواضيع ({topics.length} موضوع)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            أضف مواضيعك الخاصة دفعة واحدة. كل سطر يعتبر موضوعاً مستقلاً سيتحول لمقال كامل.
          </p>
        </div>

        <div>
          <textarea
            value={newTopics}
            onChange={(e) => setNewTopics(e.target.value)}
            placeholder={"اكتب موضوعاً في كل سطر... مثال:\nكيف نعلم طفل التوحد التعبير عن رغباته\nأهمية الأنشطة الرياضية في تفريغ الطاقة الحركية\nدور الأسرة في مساندة الطفل في المدرسة"}
            rows={5}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition leading-relaxed resize-none"
          />
          <button
            onClick={handleAddTopics}
            className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>حفظ وإضافة المواضيع إلى الخزان</span>
          </button>
        </div>

        {/* Topics List with Filter & Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
            <span>قائمة المواضيع المحفوظة</span>
            <span>(✅ مستعمل | ⏳ متبقي)</span>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {topics.map((t, idx) => (
              <div 
                key={t.id} 
                className="pt-2 flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-slate-400 w-6 text-start">{idx + 1}.</span>
                  <span className={`text-xs sm:text-sm font-semibold truncate ${
                    t.used ? "line-through text-slate-400" : "text-slate-800"
                  }`}>
                    {t.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleTopicUsed(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      t.used ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    }`}
                    title={t.used ? "إعادة تعيين كمتبقي" : "تحديد كمستعمل"}
                  >
                    {t.used ? "✅ استُعمل" : "⏳ متبقي"}
                  </button>

                  <button
                    onClick={() => handleDeleteTopic(t.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    title="حذف الموضوع"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export { AdvancedSettings };
