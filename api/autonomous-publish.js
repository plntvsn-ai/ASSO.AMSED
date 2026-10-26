import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

async function translateFree(text, to) {
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=ar|${to}`);
    const j = await r.json();
    return j.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

function makeFallbackArticle(topic) {
  return {
    ar: `# ${topic}

في جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة، نضع بين أيدي الأسر الكريمة هذا الدليل العملي والتوجيهي لمواكبة أطفالنا خطوة بخطوة وتوفير بيئة تربوية وتأهيلية محفزة.

## أهمية هذا الموضوع في مسار الطفل
إن الرعاية المتخصصة والتفهم العميق لخصائص كل طفل يشكلان الركيزة الأساسية للنجاح. يؤكد فريقنا في جمعية AMSED بالقنيطرة أن كل خطوة تأهيلية يتم تطبيقها داخل الأسرة بالتنسيق مع الأخصائيين تسهم بشكل مباشر في تعزيز ثقة الطفل بنفسه وتطوير استقلاليته اليومية.

## خمس خطوات عملية وتطبيقية للأسر
1. **التهيئة البصرية والروتين اليومي المنظم:** استخدام الجداول المصورة (PECS) يساعد الطفل على توقع الأحداث القادمة وتنظيم وقته بسلاسة.
2. **التشجيع الإيجابي الفوري:** مكافأة كل إنجاز، مهما بدا بسيطاً، بالثناء والابتسامة والتعزيز المعنوي.
3. **تبسيط المهام وتقسيمها:** تجزئة كل نشاط إلى خطوات صغيرة متتالية يسهل على الطفل إتقان المهارة والشعور بالإنجاز.
4. **مراعاة الحساسيات الحسية:** توفير بيئة هادئة ومريحة تحد من المثيرات المربكة.
5. **التواصل والتنسيق الدائم مع المركز:** توحيد لغة التعامل بين المركز التأهيلي والبيت لضمان استمرارية المكتسبات.

> 💙 "الطفل التوحدي يحمل طاقات فريدة تنتظر الاحتضان والتوجيه السليم. بتضافر جهودنا جميعاً، نصنع غداً أفضل لأطفالنا الأبطال."

📍 للمزيد من المعلومات، تواصلوا مع جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة: 06 54 24 05 23`,
    fr: `# Guide AMSED: ${topic}

Au sein de l'Association Marocaine pour l'Initiative de Coopération et de Solidarité Sociale pour la Protection de l'Enfance en Situation Difficile (AMSED) à Kénitra, nous accompagnons les enfants autistes et leurs familles à travers un encadrement médico-éducatif spécialisé.

## Importance de l'accompagnement précoce
L'enfant avec un trouble du spectre de l'autisme a besoin d'un cadre structuré, sécurisant et bienveillant pour s'épanouir. Une approche personnalisée respectant son rythme favorise grandement sa communication avec son environnement familial et scolaire.

## 5 Recommandations pratiques de l'équipe AMSED :
1. **Routine visuelle et structuration du temps :** Utilisation de pictogrammes PECS pour anticiper les étapes de la journée.
2. **Renforcement positif immédiat :** Encourager et valoriser chaque progrès pour consolider la confiance en soi.
3. **Décomposition des tâches :** Découper les activités en petites étapes faciles à assimiler.
4. **Aménagement d'un espace sensoriel apaisant :** Limiter les bruits forts et les stimuli visuels excessifs.
5. **Collaboration étroite entre la famille et les éducateurs :** Assurer la continuité des apprentissages à la maison.

📍 Contact et orientation AMSED Kénitra : 06 54 24 05 23`,
    en: `# AMSED Guide: ${topic}

At AMSED Association in Kenitra, Morocco, we are dedicated to supporting children with autism and special needs through specialized therapeutic, educational, and vocational programs.

## Key Insights for Parents and Educators
Children on the autism spectrum thrive in supportive, predictable, and sensory-friendly environments. Early intervention tailored to the child's individual pace builds confidence and independence.

## 5 Practical Strategies from AMSED:
1. **Visual Schedules & Routines:** Visual cues reduce anxiety and offer clear structure throughout the day.
2. **Positive Reinforcement:** Immediate praise and encouragement motivate children to develop positive behaviors.
3. **Breaking Down Tasks:** Simplifying daily activities into manageable steps fosters a sense of accomplishment.
4. **Sensory Regulation:** Creating quiet spaces helps prevent sensory overload and emotional stress.
5. **Center & Family Alignment:** Close collaboration between therapists and parents reinforces lasting skills.

📍 For guidance and support, contact AMSED Kenitra: +212 654-240523`
  };
}

function getTopicMatchedImage(topic = '') {
  const t = topic.toLowerCase();

  // 1. العظماء والشخصيات التاريخية (صور شخصية تاريخية حقيقية ومطابقة 100%)
  if (t.includes('أينشتاين') || t.includes('اينشتاين') || t.includes('einstein')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/800px-Albert_Einstein_Head.jpg",
      alt: "بورتريه ألبرت أينشتاين وسيرة العبقرية والتغلب على تأخر النطق - AMSED"
    };
  }
  if (t.includes('غيتس') || t.includes('بيل غيتس') || t.includes('gates')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/800px-Bill_Gates_2017_%28cropped%29.jpg",
      alt: "صورة بيل غيتس وثورة البرمجة والشغف الفائق - AMSED"
    };
  }
  if (t.includes('ماسك') || t.includes('إيلون ماسك') || t.includes('ايلون ماسك') || t.includes('musk')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop1%29.jpg/800px-Elon_Musk_Royal_Society_%28crop1%29.jpg",
      alt: "صورة إيلون ماسك والتفكير الاستثنائي وطيف التوحد أسبرجر - AMSED"
    };
  }
  if (t.includes('تيسلا') || t.includes('نيكولا تيسلا') || t.includes('tesla')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/800px-N.Tesla.JPG",
      alt: "صورة المخترع نيكولا تيسلا وقوة التفكير البصري الخارق - AMSED"
    };
  }
  if (t.includes('نيوتن') || t.includes('إسحاق نيوتن') || t.includes('newton')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/800px-GodfreyKneller-IsaacNewton-1689.jpg",
      alt: "بورتريه العالم إسحاق نيوتن ومكتشف الجاذبية والانعزال العلمي - AMSED"
    };
  }
  if (t.includes('موزارت') || t.includes('موتسارت') || t.includes('mozart')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wolfgang-amadeus-mozart_1.jpg/800px-Wolfgang-amadeus-mozart_1.jpg",
      alt: "بورتريه الموسيقار العالمي ولفغانغ أماديوس موزارت والعبقرية السمعية - AMSED"
    };
  }
  if (t.includes('تاجيري') || t.includes('بوكيمون') || t.includes('tajiri')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Satoshi_Tajiri_2006.jpg/800px-Satoshi_Tajiri_2006.jpg",
      alt: "صورة ساتوشي تاجيري مبتكر البوكيمون - AMSED"
    };
  }
  if (t.includes('غريتا') || t.includes('ثونبرغ') || t.includes('thunberg')) {
    return {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Greta_Thunberg_urged_MEPs%2C_2019_%28cropped%29.jpg/800px-Greta_Thunberg_urged_MEPs%2C_2019_%28cropped%29.jpg",
      alt: "صورة الناشطة غريتا ثونبرغ والتوحد كقوة خارقة - AMSED"
    };
  }

  // 2. التغذية الصحية والخضار والفواكه والحمية
  if (t.includes('تغذي') || t.includes('أكل') || t.includes('حمية') || t.includes('غلوتين') || t.includes('كازين') || t.includes('طعام') || t.includes('فواكه') || t.includes('خضر') || t.includes('nutrition')) {
    return {
      url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=85",
      alt: "خضار وفواكه طازجة وتغذية صحية متوازنة لأطفال التوحد - AMSED"
    };
  }

  // 3. النطق والتخاطب وتطوير الكلام
  if (t.includes('نطق') || t.includes('تخاطب') || t.includes('كلام') || t.includes('صوت') || t.includes('مصاداة') || t.includes('echolalia') || t.includes('orthophonie') || t.includes('speech')) {
    return {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85",
      alt: "جلسات تأهيل النطق والتخاطب والتواصل التفاعلي - AMSED"
    };
  }

  // 4. التعليم والإدماج المدرسي ومرافقة الحياة المدرسية
  if (t.includes('مدرس') || t.includes('دمج') || t.includes('قسم') || t.includes('avs') || t.includes('تعليم أولي') || t.includes('school')) {
    return {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
      alt: "الإدماج المدرسي والتعليم الأولي المكيف لأطفال التوحد - AMSED"
    };
  }

  // 5. الأنشطة المائية والسباحة العلاجية
  if (t.includes('ماء') || t.includes('مائي') || t.includes('سباح') || t.includes('hydro') || t.includes('swim')) {
    return {
      url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=85",
      alt: "السباحة العلاجية والأنشطة المائية لأطفال التوحد - AMSED"
    };
  }

  // 6. العلاج بالخيول
  if (t.includes('خيل') || t.includes('خيول') || t.includes('فروسية') || t.includes('حصان') || t.includes('equitherapie') || t.includes('horse')) {
    return {
      url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=85",
      alt: "العلاج بالخيول والفروسية العلاجية للأطفال - AMSED"
    };
  }

  // 7. الورشات الحرفية والنجارة والطبخ
  if (t.includes('ورش') || t.includes('حلويات') || t.includes('طبخ') || t.includes('نجار') || t.includes('خياط') || t.includes('حرف')) {
    return {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85",
      alt: "الورشات المهنية والتأهيل الحرفي لليافعين - AMSED"
    };
  }

  // 8. الروتين والجداول البصرية PECS
  if (t.includes('روتين') || t.includes('جدول') || t.includes('pecs') || t.includes('بصري')) {
    return {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
      alt: "الجداول البصرية المصورة PECS والروتين اليومي المنظم - AMSED"
    };
  }

  // 9. العلامات والتشخيص المبكر
  if (t.includes('علامات') || t.includes('رضع') || t.includes('مبكر') || t.includes('تشخيص') || t.includes('أعراض')) {
    return {
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85",
      alt: "العلامات المبكرة والتشخيص الدقيق لطيف التوحد - AMSED"
    };
  }

  // 10. التكامل الحسي والغرفة الحسية
  if (t.includes('حسي') || t.includes('غرفة حسية') || t.includes('توتر') || t.includes('meltdown') || t.includes('sensory')) {
    return {
      url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85",
      alt: "الغرفة الحسية وتقنيات الاسترخاء وضبط السلوك - AMSED"
    };
  }

  return {
    url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=85",
    alt: "رعاية وتأهيل أطفال التوحد في بيئة دافئة ومحفزة - AMSED"
  };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
    let supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

    const supabase = (supabaseUrl && supabaseKey) 
      ? createClient(supabaseUrl, supabaseKey) 
      : null;

const DIVERSE_AUTISM_TOPICS = [
  "أعراض وعلامات التوحد عند الرضع بالمغرب: دليل الأم المبكر من 6 أشهر إلى سنتين",
  "أفضل مراكز التكفل بالتوحد بالقنيطرة وجهة الرباط سلا: خدمات جمعية AMSED المتخصصة",
  "كيفية الاستفادة من دعم ومواكبة مرافقة الحياة المدرسية AVS بالمغرب: الشروط والمساطر",
  "أهمية ترويض النطق والعلاج الوظيفي لأطفال صعوبات التعلم والتوحد بالقنيطرة",
  "بطاقة شخص في وضعية إعاقة بالمغرب: حقوق الطفل التوحدي ومزايا الدعم الاجتماعي",
  "الحمية الغذائية لأطفال التوحد وخلو الغلوتين والكازين: تجارب عملية وإرشادات أمهات بالمغرب",
  "أقسام التعليم الأولي المكيف وخطوات الإدماج المدرسي الناجح بجهة الرباط سلا القنيطرة",
  "طرق تأهيل أطفال التوحد وتنمية مهارات النطق والتواصل التفاعلي",
  "تمارين منزلية عملية لتطوير التواصل البصري ولفت الانتباه المشترك",
  "التكامل الحسي وأنشطة الغرفة الحسية للحد من نوبات التوتر وفرط الحركة",
  "الورشات المهنية والتأهيل الحرفي لليافعين والشباب ذوي الاحتياجات الخاصة",
  "استراتيجيات التعامل الإيجابي مع نوبات الغضب والانهيار الحسي (Meltdown) في البيت المغربي",
  "أهمية الروتين اليومي والجداول البصرية المصورة PECS لأطفال التوحد",
  "عظماء غيروا العالم: ألبرت أينشتاين وسيرة العبقرية والتغلب على تأخر النطق",
  "عظماء غيروا العالم: بيل غيتس وكيف حوّل التركيز الفائق وشغف البرمجة إلى ثورة رقمية",
  "عظماء غيروا العالم: قصة نجاح إيلون ماسك وتصريحه حول طيف التوحد (متلازمة أسبرجر)",
  "عظماء غيروا العالم: العالم والمخترع نيكولا تيسلا وقوة التفكير البصري الخارق",
  "عظماء غيروا العالم: ساتوشي تاجيري مبتكر عالم البوكيمون وكيف ألهمه التوحد في طفولته",
  "عظماء غيروا العالم: إسحاق نيوتن وسيرة مكتشف الجاذبية والانعزال العلمي المثمر",
  "عظماء غيروا العالم: الموسيقار العالمي موزارت وسر العبقرية السمعية المبكرة",
  "عظماء غيروا العالم: الناشطة البيئية غريتا ثونبرغ واعتبار التوحد قوة خارقة للتغيير",
  "الأنشطة المائية والسباحة العلاجية وأثرها المهدئ للجهاز العصبي وتناسق الحركة",
  "التربية الإيجابية والدعم النفسي لأولياء أمور وأمهات أطفال التوحد لمواجهة الإرهاق",
  "الكشف المبكر عن صعوبات التعلم والنمو اللغوي عند الأطفال بمدينة القنيطرة",
  "تنمية المهارات الحركية الدقيقة واستخدام ألعاب التركيز والصلصال والذكاء",
  "العلاج بالفن التشكيلي والرسم الحر كأداة للتعبير العاطفي وتفريغ الشحنات الزائدة",
  "أثر الموسيقى والإيقاعات الهادئة في تحفيز الوصلات العصبية وتطوير النطق",
  "التدريب على الاستقلالية اليومية: ارتداء الملابس، النظافة الشخصية، واستخدام المرحاض",
  "المستجدات العلمية والطبية الحديثة في أبحاث طيف التوحد لعام 2026",
  "الفرق بين طيف التوحد، تأخر النطق البسيط، وفرط الحركة وتشتت الانتباه (ADHD)",
  "كيفية التعامل مع الحساسية المفرطة للأصوات العالية والملابس والأطعمة",
  "كيف تدرب طفلك التوحدي على التفاعل واللعب التشاركي مع إخوته وأقرانه",
  "أهمية الأنشطة الرياضية وتمارين التوازن في ضبط السلوك وتفريغ الطاقة الحركية",
  "دور العلاج الوظيفي (Ergothérapie) في تطوير تناسق عضلات اليدين وأنشطة الحياة اليومية",
  "استخدام التطبيقات والوسائط التكنولوجية واللوحات الذكية كوسيلة مساعدة للتواصل",
  "أهمية النوم المنتظم والتغلب على اضطرابات الأرق وصعوبة الاستغراق في النوم",
  "دور ورشات الطبخ وإعداد الحلويات في تعزيز ثقة الشباب التوحدي واستقلاليتهم",
  "أهمية التربية النفس-حركية (Psychomotricité) في الوعي بالجسد والمحيط المكاني",
  "كيف تخبر طفلك عن خصوصيته وتميزه بأسلوب تربوي يعزز ثقته بنفسه",
  "دور الأب في مسار رعاية طفل التوحد وتقاسم المهام الأسرية والتأهيلية",
  "التعامل السليم مع المصاداة اللفظية (Echolalia) وتحويلها إلى كلام وظيفي مفيد",
  "تنمية مهارات حل المشكلات والتفكير المنطقي عبر الألغاز والمكعبات الهندسية",
  "الرحلات الاستكشافية والخرجات الميدانية للطبيعة وأثرها في الانفتاح الاجتماعي",
  "حقوق الأطفال ذوي الاحتياجات الخاصة في المنظومة التعليمية والقانون المغربي",
  "كيفية بناء بيئة منزلية هادئة وصديقة للطفل التوحدي تحد من المثيرات المربكة",
  "طرق تعزيز الانتباه والتركيز للطفل أثناء أداء الواجبات والتمارين التربوية",
  "أهمية التشجيع اللفظي والمكافآت المعنوية في غرس العادات السلوكية الإيجابية",
  "تقنيات تدليك واسترخاء العضلات للتخفيف من التشنجات والتوتر الحركي",
  "التدريب على حماية النفس وإدراك المخاطر المحيطة (الشارع، الماء، الكهرباء)",
  "دور الحيوانات الأليفة والعلاج بالخيول (Equithérapie) في تحفيز المشاعر والتواصل",
  "كيفية تهيئة الطفل التوحدي لزيارة الطبيب، عيادة الأسنان، وحلاق الأطفال دون خوف",
  "التأهيل قبل المهني وتنمية الحرف اليدوية كالخياطة والنجارة والزراعة البيئية",
  "قصص نجاح ملهمة من واقع جمعية AMSED بالقنيطرة: أبطال كسروا حاجز الصمت"
];

    let topic_ar = DIVERSE_AUTISM_TOPICS[0];
    let topicId = null;

    if (supabase) {
      try {
        const { data: topics, error: tError } = await supabase.from('topics_bank').select('*').eq('used', false).limit(1);
        if (!tError && topics?.length) {
          topic_ar = topics[0].topic || topics[0].title || topic_ar;
          topicId = topics[0].id;
        } else {
          // If topics_bank is empty or all used, check recent articles to avoid repeating yesterday's topic
          const { data: recentArticles } = await supabase.from('articles').select('title_ar').order('id', { ascending: false }).limit(20);
          const usedTitles = new Set((recentArticles || []).map(a => a.title_ar));
          const availableTopic = DIVERSE_AUTISM_TOPICS.find(t => !usedTitles.has(t)) || DIVERSE_AUTISM_TOPICS[Math.floor(Math.random() * DIVERSE_AUTISM_TOPICS.length)];
          topic_ar = availableTopic;
        }
      } catch (err) {
        console.warn('Topics bank query notice:', err);
        topic_ar = DIVERSE_AUTISM_TOPICS[Math.floor(Math.random() * DIVERSE_AUTISM_TOPICS.length)];
      }
    } else {
      topic_ar = DIVERSE_AUTISM_TOPICS[Math.floor(Math.random() * DIVERSE_AUTISM_TOPICS.length)];
    }

    let final_title_ar = topic_ar;
    let final_title_fr = '';
    let final_title_en = '';
    let final_content_ar = '';
    let final_content_fr = '';
    let final_content_en = '';
    let generatedWithAi = false;

    const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.VITE_GEMINI_KEY || "").trim();

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `أنت كاتب مقالات طبي وتربوي متخصص في جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED (رعاية أطفال التوحد وفي وضعية صعبة).
الموضوع: "${topic_ar}"

اكتب مقالاً مفيداً وتطبيقياً للأمهات والآباء.
يجب أن ترجع النتيجة بصيغة JSON فقط بهذه الحقول:
{
  "title_ar": "${topic_ar}",
  "content_ar": "نص المقال كامل بالعربية بتنسيق markdown",
  "title_fr": "Titre en Français",
  "content_fr": "Article complet en Français",
  "title_en": "Title in English",
  "content_en": "Full article in English"
}
لا تضف أي نص خارج كائن الـ JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed?.content_ar) {
          final_title_ar = parsed.title_ar || topic_ar;
          final_title_fr = parsed.title_fr || await translateFree(topic_ar, 'fr');
          final_title_en = parsed.title_en || await translateFree(topic_ar, 'en');
          final_content_ar = parsed.content_ar;
          final_content_fr = parsed.content_fr || `Guide AMSED: ${final_title_fr}`;
          final_content_en = parsed.content_en || `AMSED Guide: ${final_title_en}`;
          generatedWithAi = true;
        }
      } catch (aiErr) {
        console.warn("Gemini generation fallback notice:", aiErr?.message);
      }
    }

    if (!generatedWithAi) {
      final_title_fr = await translateFree(topic_ar, 'fr');
      final_title_en = await translateFree(topic_ar, 'en');
      const fallback = makeFallbackArticle(topic_ar);
      final_content_ar = fallback.ar;
      final_content_fr = fallback.fr;
      final_content_en = fallback.en;
    }

    if (supabase) {
      try {
        await supabase.from('articles').insert({
          title_ar: final_title_ar,
          title_fr: final_title_fr,
          title_en: final_title_en,
          content_ar: final_content_ar,
          content_fr: final_content_fr,
          content_en: final_content_en,
          status: 'published'
        });
      } catch (insertErr) {
        console.warn('Supabase article insert notice:', insertErr);
      }

      if (topicId) {
        try {
          await supabase.from('topics_bank').update({ used: true }).eq('id', topicId);
        } catch (updateErr) {
          console.warn('Topic status update notice:', updateErr);
        }
      }

      // Update robot settings & boss logs in Supabase
      try {
        const nowIso = new Date().toISOString();
        await supabase.from('robot_settings').upsert([
          { id: 'master', status: 'idle', last_run: nowIso },
          { id: 'boss', status: 'idle', last_run: nowIso }
        ]);
        await supabase.from('boss_logs').insert({
          logs: [`✅ نشر آلي عبر الكرون: ${final_title_ar}`],
          created_at: nowIso
        });
      } catch (logErr) {
        console.warn('Supabase robot settings log notice:', logErr);
      }
    }

    const articlePayload = {
      id: `robot-${Date.now()}`,
      title: final_title_ar,
      title_ar: final_title_ar,
      title_fr: final_title_fr,
      title_en: final_title_en,
      slug: `amsed-autism-article-${Date.now()}`,
      excerpt: `مقال طبي متخصص في التوحد عند الأطفال من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED القنيطرة.`,
      content: final_content_ar,
      content_ar: final_content_ar,
      content_fr: final_content_fr,
      content_en: final_content_en,
      category: "التوحد والطفولة",
      author: "أطر جمعية AMSED",
      published: true,
      autoGenerated: true,
      is_ai: true,
      createdAt: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      image: getTopicMatchedImage(final_title_ar).url,
      imageUrl: getTopicMatchedImage(final_title_ar).url,
      image_alt: getTopicMatchedImage(final_title_ar).alt,
      views: 0
    };

    return res.status(200).json({
      success: true,
      published: final_title_ar,
      ar: final_title_ar,
      fr: final_title_fr,
      en: final_title_en,
      content_ar: final_content_ar,
      ai: generatedWithAi,
      article: articlePayload,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message || String(e) });
  }
}
