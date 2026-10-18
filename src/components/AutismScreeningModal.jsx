import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, RotateCcw, MessageCircle, X } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    title: "التواصل البصري والاستجابة للاسم",
    desc: "هل يلتفت طفلك وينظر إليك في عينيك مباشرة عند مناداته باسمه أو التحدث إليه؟",
    options: [
      { text: "نعم، يستجيب وينظر دائماً وبشكل طبيعي", score: 2 },
      { text: "أحياناً، يستجيب بعد تكرار النداء عدة مرات", score: 1 },
      { text: "نادراً أو لا، يبدو كأنه لا يسمع أو يتجنب النظر", score: 0 }
    ]
  },
  {
    id: 2,
    title: "الانتباه المشترك والإشارة بالأصبع",
    desc: "هل يشاركك النظر والإشارة بسبابته نحو لعبة أو طائر أو شيء يثير إعجابه ويطلب منك رؤيته؟",
    options: [
      { text: "نعم، يشير بسبابته ويشارك اهتمامه بحماس", score: 2 },
      { text: "أحياناً يمسك بيدي ويقودني دون النظر أو الإشارة", score: 1 },
      { text: "نادراً أو لا يشارك انتباهه البصري مع المحيط", score: 0 }
    ]
  },
  {
    id: 3,
    title: "الكلام والتواصل الوظيفي (المصاداة)",
    desc: "هل يوظف الكلمات للتعبير عن احتياجاته (ماء، جوعان)، أم يكتفي بترديد نفس الكلمات والأصوات كالمصاداة؟",
    options: [
      { text: "يتكلم بجمل أو كلمات مفهومة ووظيفية حسب عمره", score: 2 },
      { text: "لديه حصيلة لغوية محدودة ويكرر بعض الكلمات", score: 1 },
      { text: "تأخر ملحوظ في النطق أو ترديد ميكانيكي دون فهم", score: 0 }
    ]
  },
  {
    id: 4,
    title: "التفاعل الاجتماعي واللعب التشاركي",
    desc: "هل يفضل الانعزال التام واللعب بمفرده وتدوير الأشياء، أم يحب اللعب التشاركي مع الأطفال؟",
    options: [
      { text: "يحب اللعب التخيلي والتشاركي مع أقرانه وإخوته", score: 2 },
      { text: "يلعب بجانب الأطفال ولكن دون تفاعل متبادل", score: 1 },
      { text: "ينعزل تماماً، ويفضل صف الألعاب في طابور أو تدويرها", score: 0 }
    ]
  },
  {
    id: 5,
    title: "الروتين والحساسية للمؤثرات الحسية",
    desc: "هل يظهر نوبات انهيار عند تغيير مسار الطريق، أو حساسية شديدة للأصوات العالية والأطعمة؟",
    options: [
      { text: "مرن ويتقبل التغييرات العادية دون انزعاج شديد", score: 2 },
      { text: "يتوتر من بعض الأصوات القوية أو الروائح أحياناً", score: 1 },
      { text: "نوبات غضب شديدة عند تغيير الروتين أو انزعاج حاد من الأصوات", score: 0 }
    ]
  }
];

export const AutismScreeningModal = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[currentIdx];
  const totalQuestions = QUESTIONS.length;

  const handleSelectOption = (score) => {
    const updated = { ...answers, [currentIdx]: score };
    setAnswers(updated);

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
    }
  };

  const calculateTotalScore = () => {
    return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setCompleted(false);
  };

  const score = calculateTotalScore();

  // تقييم النتيجة والتوجيه التربوي
  let resultLevel = '';
  let resultTitle = '';
  let resultAdvice = '';
  let resultColor = '';

  if (score >= 8) {
    resultLevel = 'مطمئن وطبيعي';
    resultTitle = 'المؤشرات ضمن المعدل النمائي السليم 🌟';
    resultAdvice = 'يُظهر طفلك مؤشرات تواصل وتفاعل اجتماعي طبيعية جداً. ننصحك بالاستمرار في تحفيز ذكائه والحديث معه وتطوير مهاراته الحركية والاجتماعية.';
    resultColor = 'border-emerald-500 bg-emerald-50 text-emerald-900';
  } else if (score >= 5) {
    resultLevel = 'يحتاج لملاحظة ومواكبة تحفيزية';
    resultTitle = 'مؤشرات تستوجب الانتباه والتدخل التحفيزي ⚠️';
    resultAdvice = 'توجد بعض النقاط التي تحتاج إلى تعزيز مثل التواصل البصري والتفاعل اللغوي. التدخل المنزلي المنظم والأنشطة الحسية يصنعان فارقاً كبيراً في هذا السن.';
    resultColor = 'border-amber-500 bg-amber-50 text-amber-950';
  } else {
    resultLevel = 'يُنصح بشدة بتقييم تشخيصي أولي مبكر';
    resultTitle = 'توجد علامات واضحة تستدعي استشارة متخصصة 💡';
    resultAdvice = 'تظهر نتائج الاستبيان علامات واضحة مرتبطة بطيف التوحد أو تأخر النمو اللغوي والحسي. التدخل المبكر قبل سن 4 سنوات هو العامل الحاسم في تحسن الطفل وتطوره.';
    resultColor = 'border-rose-500 bg-rose-50 text-rose-950';
  }

  const phone = '06 54 24 05 23';
  const whatsappMsg = `السلام عليكم ورحمة الله، قمت باجتياز استبيان التقييم التوجيهي بموقع جمعية AMSED، وحصل طفلي على نتيجة: (${score} من 10 - ${resultLevel}). أرغب في حجز استشارة وموعد تقييم أولي مع أخصائيي الجمعية بالقنيطرة.`;
  const whatsappUrl = `https://wa.me/212654240523?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-400 text-black rounded-xl font-bold">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                المستشار الذكي: استبيان المؤشرات المبكرة
              </h3>
              <span className="text-xs text-emerald-100 font-medium">
                دليل استرشادي للأمهات والآباء • جمعية AMSED القنيطرة
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!completed ? (
            <div className="space-y-6">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                  <span>السؤال {currentIdx + 1} من {totalQuestions}</span>
                  <span className="text-emerald-700">{Math.round(((currentIdx + 1) / totalQuestions) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block">
                  {currentQ.title}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {currentQ.desc}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(opt.score)}
                    className="w-full text-right p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition font-bold text-sm text-slate-800 cursor-pointer shadow-sm flex items-center justify-between group"
                  >
                    <span>{opt.text}</span>
                    <span className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 flex items-center justify-center text-white text-xs transition">
                      ✓
                    </span>
                  </button>
                ))}
              </div>

              {/* Back button if past question 0 */}
              {currentIdx > 0 && (
                <button
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السؤال السابق</span>
                </button>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 text-center animate-fade-in">
              <div className={`p-6 rounded-3xl border-2 ${resultColor} space-y-3`}>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl">
                  {score >= 8 ? '🌟' : score >= 5 ? '⚠️' : '💡'}
                </div>
                <h4 className="text-xl font-black">{resultTitle}</h4>
                <div className="text-sm font-bold opacity-80">
                  النتيجة الاسترشادية: {score} من 10 نقاط ({resultLevel})
                </div>
                <p className="text-xs sm:text-sm leading-relaxed pt-2">
                  {resultAdvice}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed text-right">
                <span className="font-bold text-slate-800 block mb-1">📌 تنبيه طبي وأخلاقي:</span>
                هذا الاستبيان هو أداة توجيهية استرشادية ولا يُغني عن التشخيص العيادي الفردي من قبل طبيب أطفال نفسي أو مختص في التوحد.
              </div>

              {/* Direct WhatsApp Call-To-Action */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl transition shadow-lg hover:shadow-xl cursor-pointer text-sm sm:text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>حجز موعد استشارة وتوجيه مجاني عبر واتساب</span>
                </a>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة اجتياز الاستبيان من جديد</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutismScreeningModal;
