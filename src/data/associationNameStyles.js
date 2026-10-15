/**
 * أنماط كتابة اسم الجمعية - AMSED
 * تضم أكثر من 18 نمطاً متنوعاً ثلاثي الأبعاد مع خيارات الألوان الملكية والذهبية والخطوط
 */

export const ASSOCIATION_NAME_STYLES = [
  {
    id: "royal_3d_red_gold",
    name: "👑 أحمر ملكي مجسم 3D محاط بالذهب (النمط الملكي المعتمد)",
    preview: "أحمر ملكي نافر 3D بحواف ذهبية مذهبة",
    tag: "3D الملكي",
    heroStyle: {
      color: "#b91c1c",
      textShadow: "0 1px 0 #d4af37, 0 2px 0 #b49129, 0 3px 0 #8f721a, 0 4px 0 #68520e, 0 6px 10px rgba(0,0,0,0.7), 0 0 12px rgba(250,204,21,0.6)",
      WebkitTextStroke: "1px #eab308",
      letterSpacing: "0.5px"
    },
    heroClass: "font-black tracking-wide",
    headerClass: "font-black text-rose-800 drop-shadow-[0_1px_2px_rgba(217,119,6,0.6)]"
  },
  {
    id: "pure_gold_3d",
    name: "⚜️ ذهب خالص عيار 24 مجسم ثلاثي الأبعاد",
    preview: "سبائك الذهب الخالص ببروز قوي وظلال عميقة",
    tag: "ذهب 24K",
    heroStyle: {
      color: "#ffd700",
      textShadow: "0 1px 0 #c29b38, 0 2px 0 #aa7c11, 0 3px 0 #856108, 0 4px 0 #5c4304, 0 6px 12px rgba(0,0,0,0.8), 0 0 15px rgba(255,215,0,0.6)",
      WebkitTextStroke: "0.8px #fff8db"
    },
    heroClass: "font-black tracking-wide",
    headerClass: "font-black text-amber-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
  },
  {
    id: "emerald_gold_royal",
    name: "🌿 أخضر زمردي ملكي بارز بحواف ذهبية",
    preview: "أخضر العلم المغربي مجسم بإطار ذهبي ساطع",
    tag: "زمردي ملكي",
    heroStyle: {
      color: "#047857",
      textShadow: "0 1px 0 #c29b38, 0 2px 0 #947119, 0 3px 0 #6a4f0d, 0 5px 8px rgba(0,0,0,0.7), 0 0 10px rgba(16,185,129,0.5)",
      WebkitTextStroke: "1px #f59e0b"
    },
    heroClass: "font-black tracking-wide",
    headerClass: "font-black text-emerald-900 drop-shadow-[0_1px_1px_rgba(217,119,6,0.4)]"
  },
  {
    id: "ruby_crimson_glow",
    name: "💎 ياقوتي قاني لامع مع بريق نحاسي",
    preview: "أحمر ياقوتي متوهج بظلال نحاسية أنيقة",
    tag: "ياقوتي",
    heroStyle: {
      color: "#991b1b",
      textShadow: "0 2px 4px rgba(0,0,0,0.6), 0 0 15px rgba(239,68,68,0.7), 0 0 25px rgba(245,158,11,0.5)",
      WebkitTextStroke: "0.8px #fef08a"
    },
    heroClass: "font-black",
    headerClass: "font-black text-red-800"
  },
  {
    id: "andalusian_gold",
    name: "📜 أندلسي موشكي (تدرج نحاسي وذهبي عتيق)",
    preview: "خط تراثي كلاسيكي فخم بتدرجات القصور الأندلسية",
    tag: "أندلسي",
    heroStyle: {
      background: "linear-gradient(135deg, #fef08a 0%, #eab308 30%, #b45309 70%, #78350f 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.7))"
    },
    heroClass: "font-black font-serif",
    headerClass: "font-black font-serif bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-900 bg-clip-text text-transparent"
  },
  {
    id: "maghrebi_kufi_3d",
    name: "🏛️ كوفي مغربي عريق بارز بالرخام والذهب",
    preview: "هندسة كوفية فخمة بألوان متباينة وظل ثلاثي الأبعاد",
    tag: "كوفي",
    heroStyle: {
      color: "#ffffff",
      textShadow: "0 1px 0 #d4af37, 0 2px 0 #b49129, 0 3px 0 #8f721a, 0 5px 8px rgba(0,0,0,0.8), -1px -1px 0 #9e1a24, 1px -1px 0 #9e1a24, -1px 1px 0 #9e1a24, 1px 1px 0 #9e1a24"
    },
    heroClass: "font-black tracking-widest",
    headerClass: "font-black text-slate-900 tracking-wider"
  },
  {
    id: "diwani_gradient",
    name: "✨ ديواني سلطاني متدرج (زمردي وعسلي)",
    preview: "ألوان ملكية انسيابية متدرجة من الأخضر إلى العسل الذهبي",
    tag: "ديواني",
    heroStyle: {
      background: "linear-gradient(135deg, #ecfdf5 0%, #34d399 35%, #fbbf24 75%, #d97706 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
    },
    heroClass: "font-bold font-serif",
    headerClass: "font-bold bg-gradient-to-r from-emerald-900 via-teal-800 to-amber-700 bg-clip-text text-transparent"
  },
  {
    id: "thuluth_classic",
    name: "🖋️ ثلث أميري راقي (أخضر داكن موحد)",
    preview: "خط تراثي كلاسيكي موقر ذو هيبة وطنية",
    tag: "ثلث",
    heroStyle: {
      color: "#ffffff",
      textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(16,185,129,0.5)",
      WebkitTextStroke: "0.5px #059669"
    },
    heroClass: "font-black font-serif",
    headerClass: "font-black font-serif text-emerald-950"
  },
  {
    id: "copper_bronze_3d",
    name: "🏺 برونزي مراكشي عتيق ثلاثي الأبعاد",
    preview: "نحاس مغربي مسكوب بظلال برونزية عميقة",
    tag: "برونزي",
    heroStyle: {
      color: "#ea580c",
      textShadow: "0 1px 0 #9a3412, 0 2px 0 #7c2d12, 0 3px 0 #431407, 0 5px 8px rgba(0,0,0,0.8)",
      WebkitTextStroke: "0.8px #fed7aa"
    },
    heroClass: "font-extrabold",
    headerClass: "font-extrabold text-amber-800"
  },
  {
    id: "neon_gold_glow",
    name: "🌟 ذهبي مشع متوهج بالنيون",
    preview: "إشعاع ذهبي فاقع مع إضاءة خلفية نيون راقية",
    tag: "نيون ذهبي",
    heroStyle: {
      color: "#fef9c3",
      textShadow: "0 0 5px #facc15, 0 0 10px #eab308, 0 0 20px #ca8a04, 0 0 35px #a16207"
    },
    heroClass: "font-black",
    headerClass: "font-black text-amber-500 drop-shadow"
  },
  {
    id: "white_silver_relief",
    name: "🤍 أبيض لؤلؤي بارز بإطار ذهبي أنيق",
    preview: "سطوع أبيض لؤلؤي نقي مع حواف ذهبية رقيقة",
    tag: "أبيض لؤلؤي",
    heroStyle: {
      color: "#ffffff",
      textShadow: "0 1px 0 #d4af37, 0 2px 0 #ca8a04, 0 4px 6px rgba(0,0,0,0.6)",
      WebkitTextStroke: "1px #eab308"
    },
    heroClass: "font-black",
    headerClass: "font-black text-slate-800 drop-shadow-sm"
  },
  {
    id: "sapphire_gold",
    name: "🔷 أزرق فيروزي سلطاني مطعم بالذهب",
    preview: "أزرق ملكي فاخر محاط بتطريز ذهبي ساطع",
    tag: "أزرق سلطاني",
    heroStyle: {
      color: "#0284c7",
      textShadow: "0 1px 0 #d4af37, 0 2px 0 #b45309, 0 4px 6px rgba(0,0,0,0.7), 0 0 10px rgba(56,189,248,0.5)",
      WebkitTextStroke: "1px #fbbf24"
    },
    heroClass: "font-black",
    headerClass: "font-black text-sky-900"
  },
  {
    id: "moroccan_flag_tribute",
    name: "🇲🇦 تحية الراية المغربية (أحمر نافر مع وميض زمردي)",
    preview: "روح الراية الوطنية المغربية بأحمر ساطع وظل أخضر ملكي",
    tag: "الراية الوطنية",
    heroStyle: {
      color: "#dc2626",
      textShadow: "0 1px 0 #047857, 0 2px 0 #065f46, 0 3px 0 #064e3b, 0 5px 8px rgba(0,0,0,0.8), 0 0 12px rgba(220,38,38,0.6)",
      WebkitTextStroke: "0.8px #34d399"
    },
    heroClass: "font-black",
    headerClass: "font-black text-red-700"
  },
  {
    id: "modern_bold_shadow",
    name: "🖤 عصري تقني بظلال حادة بارزة",
    preview: "خط عصري قوي وواضح جداً بظلال ثلاثية أفقية ورأسية",
    tag: "عصري",
    heroStyle: {
      color: "#ffffff",
      textShadow: "2px 2px 0 #000, 4px 4px 0 #044e3b, 6px 6px 10px rgba(0,0,0,0.7)"
    },
    heroClass: "font-black",
    headerClass: "font-black text-slate-900"
  },
  {
    id: "traditional_fez_mosaic",
    name: "🏺 نقش الزليج الفاسي (نحاس وأخضر وفيروز)",
    preview: "ألوان الفسيفساء الفاسية المعتقة بلمسات ملكية",
    tag: "زليج فاس",
    heroStyle: {
      background: "linear-gradient(135deg, #fef08a 0%, #b45309 40%, #047857 75%, #064e3b 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.7))"
    },
    heroClass: "font-black font-serif",
    headerClass: "font-black bg-gradient-to-r from-amber-700 via-emerald-800 to-amber-900 bg-clip-text text-transparent"
  },
  {
    id: "velvet_burgundy_3d",
    name: "🍷 مخملي عنّابي بارز مع لمسات ذهبية",
    preview: "أحمر داكن نبيذي فخم محاط بتطريزات ذهبية",
    tag: "عنّابي",
    heroStyle: {
      color: "#881337",
      textShadow: "0 1px 0 #eab308, 0 2px 0 #ca8a04, 0 3px 0 #854d0e, 0 5px 8px rgba(0,0,0,0.8), 0 0 10px rgba(244,63,94,0.4)",
      WebkitTextStroke: "0.8px #fde047"
    },
    heroClass: "font-black",
    headerClass: "font-black text-rose-900"
  },
  {
    id: "palace_imperial_green",
    name: "🏰 أخضر القصور السلاطينية ببروز ذهبي عتيق",
    preview: "أخضر داكن هيبة قصور المملكة بحواف ذهبية نافرة",
    tag: "قصور سلاطينية",
    heroStyle: {
      color: "#064e3b",
      textShadow: "0 1px 0 #d4af37, 0 2px 0 #b49129, 0 3px 0 #8f721a, 0 5px 8px rgba(0,0,0,0.9)",
      WebkitTextStroke: "1px #fef08a"
    },
    heroClass: "font-black",
    headerClass: "font-black text-emerald-950"
  },
  {
    id: "golden_relief_bevel",
    name: "🎖️ ميدالية ذهبية نافرة (Beveled 3D Gold)",
    preview: "تجسيم ثلاثي أبعاد كامل كما لو كان منحوتاً من صفيحة ذهب",
    tag: "منحوت 3D",
    heroStyle: {
      color: "#f59e0b",
      textShadow: "-1px -1px 0 #fff, 1px 1px 0 #78350f, 0 2px 0 #92400e, 0 3px 0 #78350f, 0 4px 0 #451a03, 0 6px 10px rgba(0,0,0,0.8)",
      WebkitTextStroke: "0.5px #fef3c7"
    },
    heroClass: "font-black tracking-wider",
    headerClass: "font-black text-amber-700"
  }
];

export const DEFAULT_STYLE_ID = "royal_3d_red_gold";

export function getStyleById(id) {
  return ASSOCIATION_NAME_STYLES.find(s => s.id === id) || ASSOCIATION_NAME_STYLES[0];
}
