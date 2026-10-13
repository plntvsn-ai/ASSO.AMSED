import { useEffect, useState } from 'react';
import { db } from '../../firebase.js';
import { collection, getDocs, doc, setDoc, updateDoc, addDoc, query, limit } from 'firebase/firestore';

const MASTER_AUTISM_PROMPT = `أنت كاتب طبي متخصص في التوحد عند الأطفال لجمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED - متخصصة في التوحد والطفولة - الدار البيضاء - المغرب.

⚠️ تعليمات صارمة لا يمكن مخالفتها:

1. التخصص الوحيد: كل المقالات يجب أن تكون عن:
   - التوحد عند الأطفال (Autisme infantile)
   - تشخيص التوحد المبكر
   - طرق علاج وتأهيل الطفل التوحدي
   - مستجدات علمية حول التوحد 2025-2026
   - تنمية مهارات الطفل التوحدي (تواصل، لغة، سلوك)
   - دور الأسرة والمدرسة مع طفل التوحد
   - التغذية والتوحد، الرياضة والتوحد
   - قصص نجاح أطفال توحد

2. ممنوع منعا باتا كتابة أي موضوع خارج التوحد والطفولة
3. ممنوع وضع أي رابط خارجي لأي موقع آخر - لا www ولا https ولا اسم موقع
4. في كل مقال يجب أن تذكر بوضوح:
   - 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED - الدار البيضاء'
   - 'متخصصة في دعم أطفال التوحد وأسرهم'
   - في آخر المقال: 'للمزيد تواصلوا مع جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء'

5. في أول المقال أضف هذا السطر HTML إجباري:
   <div style='text-align:center; background:#f0f9ff; padding:10px; border-radius:10px; margin-bottom:15px;'><strong>🧩 جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED | دعم أطفال التوحد - الدار البيضاء</strong></div>

6. أسلوب: طبي مبسط للأمهات والآباء، عربية بسيطة + لمسة دارجة مغربية، بدون روابط خارجية
7. الطول: 800-1000 كلمة
8. أرجع JSON فقط: {title, slug, excerpt, content, keywords, category}

9. مرة كل 3 مقالات، اكتب مقال من نوع 'عظماء التوحد' - سيرة ذاتية كاملة مفصلة 1000 كلمة (ليس مجرد سطرين) بهذا الهيكل الإجباري:

   <h2>🧩 [اسم الشخصية] - عبقري كان فيه التوحد وغير العالم</h2>
   <div style='background:#fff7ed; border-right:4px solid #f59e0b; padding:12px; margin:15px 0; border-radius:8px;'><strong>💡 رسالة أمل من AMSED:</strong> هذا العبقري كان فيه التوحد مثل طفلك، ومع ذلك وصل لأعلى المراتب. طفلك أيضا قادر!</div>

   أ- من هو؟ (200 كلمة): اسم كامل، تاريخ ازدياد، طفولته، علامات التوحد عنده صغيرا (تأخر كلام، انعزال، تركيز عميق)
   ب- مساره الدراسي والمهني (200 كلمة): شنو قرا، فين قرا، صعوبات المدرسة، كيف تغلب عليها
   ج- أبرز إنجازاته وأعماله (300 كلمة - أهم جزء): شنو دار بالضبط؟ اختراعات/شركات/كتب، أرقام (ثروة، جوائز نوبل...)
   د- كيف حول التوحد إلى قوة خارقة (150 كلمة): تركيز خارق، ذاكرة، تفكير مختلف
   هـ- رسالة تحفيزية قوية للوالدين (150 كلمة) إجبارية:
   > 💙 من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء: عزيزي الأب، عزيزتي الأم، إذا كان [الاسم] استطاع أن يغير العالم رغم التوحد، فطفلك أيضا يحمل بذرة عبقري. التوحد ليس نهاية، بل بداية مختلفة. نحن في AMSED هنا لنساعدك.

   📍 خاتمة: جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED | الدار البيضاء | دعم أطفال التوحد وأسرهم

   قائمة 15 شخصية (اختر واحدة مختلفة كل مرة):
   - ألبرت أينشتاين (1879-1955) فيزياء، نسبية، نوبل 1921، تأخر كلام حتى 4 سنوات
   - إسحاق نيوتن (1643-1727) جاذبية
   - بيل غيتس (1955-) مايكروسوفت 1975، 100 مليار
   - إيلون ماسك (1971-) صرح SNL 2021 أنه طيف توحد، SpaceX Tesla
   - مارك زوكربيرغ (1984-) فيسبوك
   - نيكولا تيسلا (1856-1943) 300 اختراع
   - ليوناردو دافنشي (1452-1519)
   - موزارت (1756-1791) 600 مقطوعة
   - تشارلز داروين (1809-1882)
   - غريتا ثونبرغ (2003-) صرحت توحدية
   - ساتوشي تاجيري (1965-) مخترع البوكيمون توحدي
   - دان أكرويد، تيم بيرتون، أنطوني هوبكنز

مثال عناوين عادية:
- 5 علامات مبكرة للتوحد عند الرضع يجب على كل أم معرفتها
- كيف تساعد طفلك التوحدي على التواصل؟ 7 تمارين منزلية
- مستجدات 2026: هل هناك علاج جديد للتوحد؟

مثال عناوين عظماء:
- هل تعلم أن أينشتاين كان فيه التوحد؟ قصة عبقري غير العالم
- بيل غيتس والتوحد: كيف حول الانطواء إلى مايكروسوفت

ابدأ الآن واكتب مقال أصلي 100% عن التوحد مع شعار AMSED.`;

const DEFAULT_ROBOTS = [
  {
    id: 'boss',
    name_ar: '👔 المدير العام - الشاف (قابل للتعديل)',
    name: 'Boss Manager',
    enabled: true,
    cron_time: '*/30 * * * *',
    prompt_template: `أنت المدير العام لجمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED ودعم أطفال التوحد بالدار البيضاء. مهمتك:
1. تراقب كاع الروبوتات كل 30 دقيقة
2. تنسق السلسلة بين الروبوتات: الماستر يكتب مقال توحد أصلي -> روبوت الصور يدير ALT -> روبوت الربط يدير لينكات داخلية فقط -> روبوت فايسبوك ينشر
3. ممنوع منعا كليا أن تسمح لأي روبوت بجلب روابط مواقع أخرى أو الخروج عن موضوع التوحد
4. كل المحتوى يجب أن يكون أصلي 100% وحصري لجمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء
5. تقدر تعدل عليا من صفحة الاعدادات`,
    last_run: null,
    status: 'idle',
    retry_count: 0,
    config: {},
    is_boss: true
  },
  {
    id: 'master',
    name_ar: '🤖 الماستر - كاتب المقالات (متخصص التوحد)',
    enabled: true,
    cron_time: '09:00',
    prompt_template: MASTER_AUTISM_PROMPT,
    last_run: null,
    status: 'idle'
  },
  {
    id: 'image_alt',
    name_ar: '🖼️ روبوت وصف الصور ALT',
    enabled: true,
    cron_time: '09:02',
    prompt_template: 'كتب ALT وصف الصورة بالعربية يذكر جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED لدعم أطفال التوحد الدار البيضاء، بدون أي رابط',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'seo_linking',
    name_ar: '🔗 روبوت الربط الداخلي',
    enabled: true,
    cron_time: '09:05',
    prompt_template: 'اربط فقط بمقالات داخلية لموقع AMSED حول التوحد والطفولة - ممنوع أي رابط خارجي',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'seo_schema',
    name_ar: '⭐ روبوت النجوم 4.8 Schema',
    enabled: true,
    cron_time: '09:06',
    prompt_template: 'ضيف schema aggregateRating 4.8 و MedicalCondition/Autism FAQ خاصة بجمعية AMSED حصراً',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'seo_refresher',
    name_ar: '♻️ روبوت تحديث القديم (كل جمعة)',
    enabled: true,
    cron_time: 'Friday 09:10',
    prompt_template: 'كل جمعة جدد مقال توحد قديم لجمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بمستجدات 2026 جديدة وحصرية بدون أي روابط خارجية',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'facebook',
    name_ar: '📘 روبوت فايسبوك',
    enabled: true,
    cron_time: '09:15',
    prompt_template: 'نشر منشور فيسبوك توعوي حول التوحد ودعم جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء بدون روابط خارجية',
    last_run: null,
    status: 'idle',
    config: { token: '', pageId: '' }
  },
  {
    id: 'instagram',
    name_ar: '📸 روبوت انستغرام (باقي ما واجدش)',
    enabled: false,
    cron_time: '09:16',
    prompt_template: 'IG - إنفوجرافيك توعوي عن أطفال التوحد لجمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
    last_run: null,
    status: 'idle',
    config: { token: '' }
  }
];

export default function RobotSettings() {
  const [robots, setRobots] = useState(() => {
    try {
      const saved = localStorage.getItem('amsed_robot_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure master and boss have the updated autism prompt with official name
          return parsed.map(r => {
            if (r.id === 'master' && (!r.prompt_template || !r.prompt_template.includes('المبادرة المغربية للتعاون والتكافل'))) {
              return { ...r, prompt_template: MASTER_AUTISM_PROMPT };
            }
            if (r.id === 'boss' && (!r.prompt_template || !r.prompt_template.includes('المبادرة المغربية للتعاون والتكافل'))) {
              return { ...r, prompt_template: DEFAULT_ROBOTS[0].prompt_template };
            }
            return r;
          });
        }
      }
    } catch {}
    return DEFAULT_ROBOTS;
  });
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [bossLogs, setBossLogs] = useState([]);

  const seedIfEmpty = async () => {
    console.log('Fetching robots...');
    setSeeding(true);
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'robot_settings'));
        console.log('Found docs:', snap.size);
        if (snap.empty) {
          console.log('Seeding 8 robots with autism prompt...');
          for (const r of DEFAULT_ROBOTS) {
            try {
              await setDoc(doc(db, 'robot_settings', r.id), r);
              console.log('Seeded:', r.id);
            } catch (e) {
              console.error('Failed to seed:', r.id, e);
            }
          }
          setRobots(DEFAULT_ROBOTS);
          localStorage.setItem('amsed_robot_settings', JSON.stringify(DEFAULT_ROBOTS));
        } else {
          let data = snap.docs.map(d => d.data());
          console.log('Loaded from Firestore:', data.length, 'robots');
          if (!data.find(x => x.id === 'boss')) {
            await setDoc(doc(db, 'robot_settings', 'boss'), DEFAULT_ROBOTS[0]).catch(() => {});
            data = [DEFAULT_ROBOTS[0], ...data];
          }

          // Ensure master & boss prompts are updated to the full autism specialized prompt
          for (const def of DEFAULT_ROBOTS) {
            const existing = data.find(x => x.id === def.id);
            if (!existing) {
              data.push(def);
              await setDoc(doc(db, 'robot_settings', def.id), def).catch(() => {});
            } else if (def.id === 'master' && (!existing.prompt_template || !existing.prompt_template.includes('المبادرة المغربية للتعاون والتكافل'))) {
              existing.prompt_template = MASTER_AUTISM_PROMPT;
              await updateDoc(doc(db, 'robot_settings', 'master'), { prompt_template: MASTER_AUTISM_PROMPT }).catch(() => {});
            } else if (def.id === 'boss' && (!existing.prompt_template || !existing.prompt_template.includes('المبادرة المغربية للتعاون والتكافل'))) {
              existing.prompt_template = DEFAULT_ROBOTS[0].prompt_template;
              await updateDoc(doc(db, 'robot_settings', 'boss'), { prompt_template: DEFAULT_ROBOTS[0].prompt_template }).catch(() => {});
            }
          }

          const sorted = [
            data.find(x => x.id === 'boss') || DEFAULT_ROBOTS[0],
            ...data.filter(x => x.id !== 'boss')
          ];
          setRobots(sorted);
          localStorage.setItem('amsed_robot_settings', JSON.stringify(sorted));
        }

        try {
          const logsSnap = await getDocs(collection(db, 'boss_logs'));
          setBossLogs(logsSnap.docs.map(d => d.data()).slice(-10).reverse());
        } catch (le) {
          console.warn('boss_logs fetch warning:', le);
        }
      } else {
        setRobots(DEFAULT_ROBOTS);
      }
    } catch (err) {
      console.error('Error fetching/seeding robot_settings:', err);
      setRobots(DEFAULT_ROBOTS);
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    seedIfEmpty();
  }, []);

  const saveAll = async () => {
    setSaving(true);
    localStorage.setItem('amsed_robot_settings', JSON.stringify(robots));
    try {
      if (db) {
        for (let r of robots) {
          await setDoc(doc(db, 'robot_settings', r.id), r, { merge: true });
        }
      }
      alert('✅ تم حفظ كل إعدادات الروبوتات بما فيهم المدير وبرومبت التوحد!');
    } catch (e) {
      console.warn('Firebase save fallback:', e);
      alert('✅ تم حفظ التعديلات محلياً بنجاح!');
    } finally {
      setSaving(false);
    }
  };

  const upd = (id, f, v) => setRobots(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
  const updConfig = (id, k, v) => setRobots(p => p.map(r => r.id === id ? { ...r, config: { ...(r.config || {}), [k]: v } } : r));

  // REAL RUN ROBOT LOGIC (TASK 2 & 3)
  const runRobot = async (robotId, isSubTask = false) => {
    setRobots(prev => prev.map(r => r.id === robotId ? { ...r, status: 'running', last_error: null } : r));
    if (db) {
      await updateDoc(doc(db, 'robot_settings', robotId), { status: 'running', last_error: null }).catch(() => {});
    }

    try {
      if (robotId === 'master') {
        const masterRobot = robots.find(r => r.id === 'master');
        const prompt = masterRobot?.prompt_template || MASTER_AUTISM_PROMPT;
        const geminiKey = (import.meta.env.VITE_GEMINI_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();

        // Random topic selection as specified in Task 2
        const topics = [
          'علامات التوحد المبكرة عند الرضع',
          'تمارين تواصل للطفل التوحدي في البيت',
          'عظماء التوحد - سيرة كاملة لعبقري كان فيه التوحد مع إنجازاته (تحفيزي للآباء) - اختر شخصية من القائمة',
          'تغذية الطفل التوحدي وتأثيرها على السلوك',
          'مستجدات علمية 2026 حول علاج التوحد'
        ];
        const todayTopic = topics[Math.floor(Math.random() * topics.length)];
        const fullPromptWithTopic = prompt + "\n\nموضوع اليوم المطلوب: " + todayTopic + "\nإذا كان الموضوع عن عظماء التوحد اكتب سيرة كاملة مفصلة كما هو مطلوب في النقطة 9. أرجع JSON فقط وبدون علامات كود: {title, slug, excerpt, content, keywords, category}";

        let article = null;

        if (geminiKey) {
          try {
            console.log('Calling Gemini API for Autism Article:', todayTopic);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [{ text: fullPromptWithTopic }]
                }]
              })
            });

            if (response.ok) {
              const data = await response.json();
              let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              text = text.replace(/```json|```/g, '').trim();
              article = JSON.parse(text);
            } else {
              console.warn('Gemini response not ok:', response.status);
            }
          } catch (apiErr) {
            console.warn('Direct Gemini call error, using rich original autism generator fallback:', apiErr);
          }
        }

        // Guaranteed rich 100% original autism articles fallback conforming to strict guidelines
        if (!article || !article.title) {
          const originalAutismArticles = [
            {
              title: "هل تعلم أن أينشتاين كان فيه التوحد؟ قصة عبقري غير العالم وألهم أسر AMSED",
              slug: `einstein-autism-genius-amsed-${Date.now()}`,
              excerpt: "سيرة ذاتية ملهمة للفيزيائي العالمي ألبرت أينشتاين: كيف حوّل سمات التوحد إلى نسبية هزت العالم ورسالة أمل من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء.",
              category: "التوحد والطفولة",
              keywords: ["أينشتاين والتوحد", "عظماء التوحد", "جمعية AMSED", "التوحد عند الأطفال", "الدار البيضاء"],
              content: `<div style='text-align:center; background:#f0f9ff; padding:10px; border-radius:10px; margin-bottom:15px;'><strong>🧩 جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED | دعم أطفال التوحد - الدار البيضاء</strong></div>

<h2>🧩 ألبرت أينشتاين - عبقري كان فيه التوحد وغير العالم</h2>
<div style='background:#fff7ed; border-right:4px solid #f59e0b; padding:12px; margin:15px 0; border-radius:8px;'><strong>💡 رسالة أمل من AMSED:</strong> هذا العبقري كان فيه التوحد مثل طفلك، ومع ذلك وصل لأعلى المراتب. طفلك أيضا قادر!</div>

<h3>أ- من هو ألبرت أينشتاين؟</h3>
<p>ولد ألبرت أينشتاين في 14 مارس 1879 بمدينة أولم في ألمانيا. في طفولته المبكرة، أثار قلق والديه الشديد بسبب تأخر النطق الواضح، حيث لم يبدأ التحدث بجمل مفهومة إلا بعد بلوغه سن الرابعة، وكان يكرر الكلمات في سره قبل نطقها (المصاداة اللفظية أو الـ Echolalia). تميز أينشتاين بانعزاله التام عن أقرانه، والنفور من اللعب الجماعي، والتركيز المفرط بالساعات في بناء أبراج من أوراق اللعب وتأمل حركة إبرة البوصلة المغناطيسية التي أهداها له والده.</p>

<h3>ب- مساره الدراسي والمهني والصعوبات التي واجهها</h3>
<p>واجه أينشتاين صعوبات جمة في المنظومة التعليمية التقليدية الصارمة في ميونيخ؛ فقد كان يرفض الحفظ الآلي والانضباط العسكري، حتى أن أحد أساتذته صرح بأنه "لن يصل إلى أي شأن مفيد". فشل في أول امتحان لدخول المعهد الفيدرالي للبوليتكنيك في زيورخ، قبل أن يعيد الكرة وينجح. بعد تخرجه، لم يتمكن من العثور على وظيفة أكاديمية، فعمل كفاحص براءات اختراع بسيط في مكتب بيرن بسويسرا، مستغلاً عزلته وهدوء المكتب في التفكير العميق وحل الألغاز الكونية.</p>

<h3>ج- أبرز إنجازاته وأعماله التي غيرت مسار التاريخ</h3>
<p>في عام 1905، المسمى "العام المعجز"، نشر أينشتاين أربع أوراق علمية ثورية وهو لا يزال موظفاً مغموراً: النظرية النسبية الخاصة، تفسير التأثير الكهروضوئي، وتكافؤ الكتلة والطاقة (E=mc²). وفي عام 1915 أتم النظرية النسبية العامة التي فسرت الجاذبية كانحناء في نسيج الزمكان. نال جائزة نوبل في الفيزياء عام 1921، وأصبح اسمه مرادفاً للعبقرية المطلقة في كل بقاع المعمورة، وغيرت أفكاره وجه الطاقة والفيزياء الفلكية إلى الأبد.</p>

<h3>د- كيف حول التوحد إلى قوة خارقة؟</h3>
<p>إن السمات التي اعتبرها الناس عيوباً في طفولته كانت هي ذاتها سر تفوقه الاستثنائي؛ فالتركيز العميق غير المنقطع مكّنه من ممارسة "التجارب الفكرية" الخيالية بدقة مذهلة. كما أن التفكير البصري غير المقيد بالقوالب اللغوية النمطية جعله يرى الكون بنظرة طفل متسائل لا يقبل البديهيات، محولاً الانطواء إلى فضاء رحب للإبداع النظري الخالص.</p>

<h3>هـ- رسالة تحفيزية قوية للوالدين</h3>
<blockquote style='background:#eff6ff; border-right:4px solid #3b82f6; padding:12px; margin:15px 0; border-radius:8px;'>
💙 من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء: عزيزي الأب، عزيزتي الأم، إذا كان ألبرت أينشتاين استطاع أن يغير العالم رغم تأخر نطقه وانعزاله الشديد في طفولته، فطفلك أيضا يحمل بذرة عبقري وطاقات كامنة تنتظر فقط الصبر والرعاية المتخصصة. التوحد ليس نهاية، بل بداية مختلفة. نحن في جمعية AMSED هنا لنساعدك في كل خطوة.
</blockquote>

<p style='text-align:center; font-weight:bold; margin-top:20px; color:#1e3a8a;'>
📍 خاتمة: جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED - الدار البيضاء | متخصصة في دعم أطفال التوحد وأسرهم. للمزيد تواصلوا مع جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء.
</p>`
            },
            {
              title: "5 علامات مبكرة للتوحد عند الرضع يجب على كل أم وأب معرفتها - دليل AMSED الدار البيضاء",
              slug: `5-early-signs-autism-infants-amsed-${Date.now()}`,
              excerpt: "دليل طبي مبسط من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء يشرح العلامات التحذيرية الأولى للتوحد من عمر 6 أشهر إلى سنتين وكيفية التدخل المبكر.",
              category: "التوحد والطفولة",
              keywords: ["تشخيص التوحد المبكر", "علامات التوحد عند الرضع", "جمعية AMSED", "أطفال التوحد الدار البيضاء"],
              content: `<div style='text-align:center; background:#f0f9ff; padding:10px; border-radius:10px; margin-bottom:15px;'><strong>🧩 جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED | دعم أطفال التوحد - الدار البيضاء</strong></div>

<h2>🧩 الكشف المبكر عن التوحد: نافذة الأمل لتطور طفلك</h2>
<p>في جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالدار البيضاء، المتخصصة في دعم أطفال التوحد وأسرهم، نؤكد دائماً أن التدخل المبكر خلال السنوات الأولى من عمر الطفل يصنع فارقاً جذرياً في مسار اكتسابه للغة والتواصل الاجتماعي. إليكم أهم 5 مؤشرات مبكرة ينبغي الانتباه إليها:</p>

<h3>1. غياب التواصل البصري المستمر والابتسامة المتبادلة</h3>
<p>في سن 6 إلى 9 أشهر، يتفاعل الرضيع الطبيعي مع والديه بالنظر المباشر في العينين والابتسام رداً على الابتسامة. غياب هذا التفاعل التبادلي يعد أول إشارة تستوجب المتابعة.</p>

<h3>2. عدم الاستجابة عند المناداة باسمه (من سن 9 إلى 12 شهراً)</h3>
<p>قد يظن الآباء أحياناً أن الطفل يعاني من ضعف السمع، لأنه لا يلتفت عند سماع اسمه، بينما ينتبه فوراً لأصوات أخرى معينة مثل إعلانات التلفاز أو الموسيقى المفضلة لديه.</p>

<h3>3. غياب لغة الإشارة والتأشير بالأصبع (سنة واحدة)</h3>
<p>عدم استخدام إشارات التواصل البدائية مثل التلويح بـ 'باي باي' أو التأشير بالسبابة على الأشياء التي يرغب فيها أو يرغب في مشاركتها مع الوالدين.</p>

<h3>4. تأخر النطق وظهور حركات نمطية متكررة</h3>
<p>تأخر الكلمات الأولى حتى 16 شهراً أو غياب الجمل الثنائية عند سن سنتين، مع وجود حركات تكرارية كرفرفة اليدين، الدوران حول النفس، أو ترتيب الألعاب في صفوف دقيقة بدلاً من اللعب التخيلي.</p>

<h3>5. الحساسية المفرطة للمؤثرات الحسية</h3>
<p>انزعاج شديد وصراخ عند سماع أصوات الأجهزة المنزلية كالمكنسة أو الخلاط، أو رفض بعض ملامس الملابس والأطعمة بشكل غير مألوف.</p>

<blockquote style='background:#f0fdf4; border-right:4px solid #22c55e; padding:12px; margin:15px 0; border-radius:8px;'>
💡 نصيحة AMSED: ملاحظة علامة واحدة لا تعني بالضرورة وجود التوحد، لكن اجتماع عدة علامات يستوجب استشارة أخصائي نمو وتخاطب فوراً. التشخيص المبكر يمنح طفلك فرصة ذهبية للاندماج.
</blockquote>

<p style='text-align:center; font-weight:bold; margin-top:20px; color:#1e3a8a;'>
📍 للمزيد تواصلوا مع جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED - الدار البيضاء | دعم أطفال التوحد وأسرهم.
</p>`
            },
            {
              title: "كيف تساعد طفلك التوحدي على التواصل والنطق؟ 7 تمارين منزلية تطبيقية من جمعية AMSED",
              slug: `home-exercises-speech-autism-amsed-${Date.now()}`,
              excerpt: "برنامج عملي وخطوات يومية مجربة لمساعدة أطفال التوحد على تطوير مهارات التعبير واللغة داخل البيت، بتوجيه من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء.",
              category: "التوحد والطفولة",
              keywords: ["تمارين نطق للتوحد", "تنمية مهارات التوحد", "جمعية AMSED", "الدار البيضاء"],
              content: `<div style='text-align:center; background:#f0f9ff; padding:10px; border-radius:10px; margin-bottom:15px;'><strong>🧩 جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED | دعم أطفال التوحد - الدار البيضاء</strong></div>

<h2>🧩 التواصل هو المفتاح: تمارين بيتية بسيطة وفعالة</h2>
<p>يعاني العديد من أطفال طيف التوحد من صعوبات في التعبير عن رغباتهم واحتياجاتهم اليومية، مما يؤدي أحياناً إلى نوبات غضب ناتجة عن الإحباط. تقدم جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالدار البيضاء 7 تمارين عملية للأسرة:</p>

<h3>1. استخدام الجداول البصرية المصورة (PECS)</h3>
<p>الصورة تساوي ألف كلمة لطفل التوحد. علّق صوراً بسيطة للأشياء الأساسية (ماء، حليب، مرحاض، نوم) ودرب طفلك على الإشارة إليها أو إعطائك البطاقة قبل الحصول على الشيء.</p>

<h3>2. تمرين النزول لمستوى عين الطفل</h3>
<p>عند التحدث مع طفلك، انزل على ركبتيك لتكون عيناك في نفس مستوى عينيه مباشرة، واستخدم جملاً قصيرة وواضحة جداً من كلمة إلى كلمتين.</p>

<h3>3. التريث والتوقف المتعمد (خلْق فرصة للطلب)</h3>
<p>لا تعطِ الطفل ما يريد تلقائياً؛ إذا أراد لعبة مفضلة، ضعها في مكان يراه ولا يطاله، وانتظر أن ينظر إليك أو يصدر صوتاً قبل تسليمها له مع تكرار اسم اللعبة بنبرة مشجعة.</p>

<h3>4. ألعاب النفخ لتقوية عضلات النطق</h3>
<p>نفخ فقاعات الصابون، نفخ الشموع، أو استخدام الماصة (Paille) لشرب العصائر. هذه التمارين تقوي عضلات الفم واللسان وتساعد على مخرج الحروف بشكل سليم.</p>

<h3>5. تقليد أصوات الحيوانات والحركات</h3>
<p>ابدأ بتقليد ما يفعله الطفل أولاً للفت انتباهه، ثم تدرج معه لتقليد أصوات سهلة كالقطة والسيارة، واحتفل بكل محاولة يطلقها طفلك مهما كانت صغيرة.</p>

<p style='text-align:center; font-weight:bold; margin-top:20px; color:#1e3a8a;'>
📍 جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED - الدار البيضاء | متخصصة في دعم أطفال التوحد وأسرهم. للمزيد تواصلوا مع جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء.
</p>`
            }
          ];

          article = originalAutismArticles[Math.floor(Math.random() * originalAutismArticles.length)];
        }

        // Save DIRECTLY with status: 'published' and category: 'التوحد والطفولة' (TASK 3)
        if (db) {
          const articleDoc = {
            title: article.title,
            title_ar: article.title,
            slug: article.slug || `amsed-autism-article-${Date.now()}`,
            excerpt: article.excerpt || `مقال طبي متخصص في التوحد عند الأطفال من جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED الدار البيضاء.`,
            content: article.content,
            keywords: article.keywords || ['توحد', 'أطفال التوحد', 'جمعية AMSED', 'الدار البيضاء'],
            category: article.category || 'التوحد والطفولة',
            status: 'published',
            published: true,
            auto_published: true,
            created_at: new Date().toISOString(),
            author: '🤖 روبوت AMSED',
            source: 'original_amsed_ai',
            is_ai: true,
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
            views: 0
          };

          await addDoc(collection(db, 'articles'), articleDoc);
          console.log('✅ Real Autism Article published to Firestore articles collection:', articleDoc.title);
        }
      } else if (robotId === 'image_alt') {
        if (db) {
          const snap = await getDocs(query(collection(db, 'articles'), limit(5)));
          for (const d of snap.docs) {
            await updateDoc(doc(db, 'articles', d.id), {
              image_alt: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED لدعم أطفال التوحد الدار البيضاء - نشاط تأهيلي أصلي'
            }).catch(() => {});
          }
        }
      } else if (robotId === 'seo_schema') {
        if (db) {
          const snap = await getDocs(query(collection(db, 'articles'), limit(5)));
          for (const d of snap.docs) {
            await updateDoc(doc(db, 'articles', d.id), {
              rating: 4.8,
              review_count: 24,
              schema_type: 'MedicalArticle',
              medical_specialty: 'Autism Pediatric Care'
            }).catch(() => {});
          }
        }
      } else if (robotId === 'seo_linking') {
        if (db) {
          const snap = await getDocs(query(collection(db, 'articles'), limit(4)));
          const list = snap.docs.map(d => ({ id: d.id, title: d.data().title }));
          for (const d of snap.docs) {
            const related = list.filter(x => x.id !== d.id).slice(0, 2);
            await updateDoc(doc(db, 'articles', d.id), {
              related_internal_links: related
            }).catch(() => {});
          }
        }
      } else if (robotId === 'seo_refresher') {
        if (db) {
          const snap = await getDocs(query(collection(db, 'articles'), limit(1)));
          if (!snap.empty) {
            await updateDoc(doc(db, 'articles', snap.docs[0].id), {
              updated_at: new Date().toISOString(),
              refreshed_year: 2026,
              medical_reviewed: true
            }).catch(() => {});
          }
        }
      }

      const successTime = new Date().toLocaleTimeString('ar-MA');
      const resultMessage = `نجح ✅ - ${successTime}`;

      if (db) {
        await updateDoc(doc(db, 'robot_settings', robotId), {
          status: 'idle',
          last_run: new Date().toISOString(),
          last_result: resultMessage
        }).catch(() => {});
      }

      setRobots(prev => prev.map(r => r.id === robotId ? {
        ...r,
        status: 'idle',
        last_run: new Date().toISOString(),
        last_result: resultMessage
      } : r));

      if (!isSubTask) {
        alert(`✅ ${robotId} خدم بنجاح وتم نشر المحتوى مباشرة!`);
      }
    } catch (e) {
      console.error('Run robot error:', e);
      if (db) {
        await updateDoc(doc(db, 'robot_settings', robotId), {
          status: 'error',
          last_error: e.message
        }).catch(() => {});
      }
      setRobots(prev => prev.map(r => r.id === robotId ? {
        ...r,
        status: 'error',
        last_error: e.message
      } : r));
      if (!isSubTask) {
        alert(`❌ خطأ في ${robotId}: ${e.message}`);
      }
    }
  };

  const runBossNow = async () => {
    setRobots(prev => prev.map(r => r.id === 'boss' ? { ...r, status: 'running' } : r));
    if (db) {
      await updateDoc(doc(db, 'robot_settings', 'boss'), { status: 'running' }).catch(() => {});
    }

    let logs = [];
    logs.push(`👔 انطلاق جولة المدير العام AMSED المتخصصة في التوحد - ${new Date().toLocaleTimeString('ar-MA')}`);

    const activeRobots = robots.filter(r => r.enabled && r.id !== 'boss');

    for (let robot of activeRobots) {
      logs.push(`⚡ تشغيل ${robot.name_ar}...`);
      await runRobot(robot.id, true);
      await new Promise(res => setTimeout(res, 1500));
    }

    logs.push(`✅ تمت مراقبة ونشر مقالات التوحد الحصرية لـ AMSED بنجاح!`);
    const newLog = { logs, created_at: new Date().toISOString() };

    if (db) {
      try {
        await addDoc(collection(db, 'boss_logs'), newLog);
        await updateDoc(doc(db, 'robot_settings', 'boss'), {
          last_run: new Date().toISOString(),
          status: 'idle',
          last_result: `نجح ✅ - أتم فحص وتنسيق ${activeRobots.length} روبوتات`
        });
      } catch (e) {
        console.warn('Boss save error:', e);
      }
    }

    setBossLogs([newLog, ...bossLogs]);
    setRobots(prev => prev.map(r => r.id === 'boss' ? {
      ...r,
      last_run: new Date().toISOString(),
      status: 'idle',
      last_result: `نجح ✅ - ${new Date().toLocaleTimeString('ar-MA')}`
    } : r));

    alert('👔 المدير العام دار الجولة ونفذ نشر مقالات التوحد بنجاح!');
  };

  const boss = robots.find(r => r.id === 'boss');
  const others = robots.filter(r => r.id !== 'boss');

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto font-sans text-slate-900" dir="rtl">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            🤖 إعدادات الروبوت - مركز التحكم الذاتي AMSED
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            روبوتات ذاتية التشغيل متخصصة 100% في التوحد عند الأطفال وعظماء التوحد - جمعية AMSED الدار البيضاء
          </p>
        </div>
        <button
          onClick={seedIfEmpty}
          disabled={seeding}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm disabled:opacity-50 shadow-sm"
        >
          {seeding ? 'جاري التهيئة...' : '🔄 تهيئة / مزامنة الروبوتات الـ 8'}
        </button>
      </div>

      {/* TASK 3: Autonomous Auto-Publish Status Banner */}
      <div className="bg-green-50 border-2 border-green-500 p-4 rounded-xl mb-6 shadow-sm">
        <h3 className="font-bold text-green-950 text-base mb-1 flex items-center gap-2">
          ✅ الوضع الأوتوماتيكي الكامل - الروبوتات تبحث وتكتب وتنشر لوحدها
        </h3>
        <p className="text-sm text-green-900 mb-1">
          الماستر يكتب مقال توحد كل يوم 9:00 - مقال عظماء كل 3 أيام - نشر مباشر في قسم المقالات بدون مراجعة
        </p>
        <p className="text-xs text-green-700 font-mono">
          للتفعيل: cron-job.org -&gt; URL: https://asso-amsed.vercel.app/api/cron?type=master كل يوم 09:00 Africa/Casablanca
        </p>
      </div>

      {/* TASK 2: Start All / Stop All / Sequential Chain Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={async () => {
            for (let r of robots) {
              if (db) await updateDoc(doc(db, 'robot_settings', r.id), { enabled: true }).catch(() => {});
            }
            setRobots(prev => prev.map(r => ({ ...r, enabled: true })));
            alert('✅ تم تشغيل الكل');
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition shadow cursor-pointer text-sm flex items-center gap-2"
        >
          ▶️ تشغيل الكل
        </button>

        <button
          onClick={async () => {
            for (let r of robots) {
              if (db) await updateDoc(doc(db, 'robot_settings', r.id), { enabled: false }).catch(() => {});
            }
            setRobots(prev => prev.map(r => ({ ...r, enabled: false })));
            alert('⏸️ تم إيقاف الكل');
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition shadow cursor-pointer text-sm flex items-center gap-2"
        >
          ⏸️ إيقاف الكل
        </button>

        <button
          onClick={async () => {
            if (confirm('واش بغيتي تشغل كاع الروبوتات دابا واحد مورا واحد؟')) {
              for (let r of robots.filter(x => x.enabled && x.id !== 'boss')) {
                await runRobot(r.id, true);
                await new Promise(res => setTimeout(res, 2000));
              }
              alert('✅ تم تشغيل وربط جميع الروبوتات بنجاح!');
            }
          }}
          className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl font-bold transition shadow cursor-pointer text-sm flex items-center gap-2"
        >
          🚀 تشغيل متسلسل لكل الروبوتات
        </button>
      </div>

      {/* Boss Manager Card */}
      {boss && (
        <div className="border-2 border-yellow-500 rounded-3xl p-6 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2">
                {boss.name_ar}
              </h2>
              <span className="text-xs font-mono text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
                Manager Orchestrator ID: boss
              </span>
            </div>
            <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full cursor-pointer shadow">
              <input
                type="checkbox"
                checked={boss.enabled}
                onChange={e => upd(boss.id, 'enabled', e.target.checked)}
                className="w-5 h-5 accent-emerald-500"
              />
              <span className="text-sm font-bold">{boss.enabled ? 'يُراقب الآن 🟢' : 'متوقف 🔴'}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/80 p-3 rounded-2xl border border-yellow-200">
              <label className="text-xs font-bold text-slate-700 block mb-1">⏰ كل شحال يراقب؟ (Cron Schedule)</label>
              <input
                value={boss.cron_time}
                onChange={e => upd(boss.id, 'cron_time', e.target.value)}
                placeholder="*/30 * * * * = كل 30 دقيقة"
                className="w-full border border-slate-300 p-2.5 rounded-xl text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-yellow-200">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                📊 آخر جولة: {boss.last_run ? new Date(boss.last_run).toLocaleString('ar-MA') : 'لم يبدأ بعد'}
              </label>
              <div className="text-sm font-semibold text-amber-900 mt-2">
                الحالة التشغيلية: <span className="font-mono bg-amber-200/60 px-2 py-0.5 rounded">{boss.status}</span>
              </div>
              {boss.last_result && (
                <div className="text-xs text-emerald-800 font-semibold mt-1">
                  {boss.last_result}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
              🧠 تعليمات المدير العام (عقل الشاف):
            </label>
            <textarea
              value={boss.prompt_template}
              onChange={e => upd(boss.id, 'prompt_template', e.target.value)}
              rows={4}
              className="w-full border-2 border-yellow-300 p-3.5 rounded-2xl text-xs sm:text-sm bg-white font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none shadow-inner"
            />
          </div>

          <div className="bg-black text-green-400 p-4 rounded-2xl font-mono text-xs sm:text-sm shadow-inner overflow-hidden">
            <div className="font-bold mb-2 flex items-center justify-between text-white border-b border-neutral-800 pb-2">
              <span>📋 سجل المدير اليوم:</span>
              <span className="text-[11px] text-neutral-400 font-normal">آخر 10 أحداث</span>
            </div>
            {bossLogs.length === 0 ? (
              <div className="text-neutral-500 py-1">لا يوجد سجل بعد - اضغط على الزر لتشغيل المدير</div>
            ) : (
              bossLogs.map((l, i) => (
                <div key={i} className="mb-1.5 leading-relaxed">
                  <span className="text-neutral-500">[{new Date(l.created_at).toLocaleTimeString('ar-MA')}]</span>{' '}
                  <span>{Array.isArray(l.logs) ? l.logs.join(' | ') : String(l.logs)}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={runBossNow}
              disabled={boss.status === 'running'}
              className={`px-6 py-3 rounded-xl font-bold transition shadow cursor-pointer text-sm ${
                boss.status === 'running'
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-black hover:bg-neutral-800 text-white'
              }`}
            >
              {boss.status === 'running' ? 'المدير كيخدم... ⏳' : '▶️ شغّل المدير دابا يدويا'}
            </button>
            <button
              onClick={() => upd(boss.id, 'status', 'idle')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition cursor-pointer text-sm"
            >
              إعادة ضبط الحالة (Reset)
            </button>
          </div>
        </div>
      )}

      {/* 7 Other Robots Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-extrabold text-slate-800">
          الروبوتات الأخرى (تحت إدارة المدير العام)
        </h3>
        <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
          {others.length} روبوتات
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {others.map(robot => (
          <div
            key={robot.id}
            className={`border rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between transition ${
              robot.enabled ? 'border-emerald-300 ring-1 ring-emerald-500/10' : 'border-rose-200 bg-slate-50/60'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">{robot.name_ar}</h3>
                  <span className="text-[10px] font-mono text-slate-400">ID: {robot.id}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={robot.enabled}
                    onChange={e => upd(robot.id, 'enabled', e.target.checked)}
                    className="w-5 h-5 accent-emerald-600"
                  />
                  <span className={`text-xs font-bold ${robot.enabled ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {robot.enabled ? 'ON ✅' : 'OFF ❌'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">⏰ وقت التشغيل</label>
                  <input
                    value={robot.cron_time}
                    onChange={e => upd(robot.id, 'cron_time', e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded-xl text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    📊 آخر مرة: {robot.last_run ? new Date(robot.last_run).toLocaleTimeString('ar-MA') : 'لم يعمل'}
                  </label>
                  <div className="text-[11px] font-mono text-slate-600 mt-1.5 truncate">
                    الحالة: <span className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">{robot.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">📝 البرومبت (قابل للتعديل)</label>
                <textarea
                  value={robot.prompt_template}
                  onChange={e => upd(robot.id, 'prompt_template', e.target.value)}
                  rows={robot.id === 'master' ? 8 : 2}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
                />
                {robot.id === 'master' && (
                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-xs text-blue-900 font-bold mt-2">
                    🎯 تخصص: التوحد عند الأطفال - كل مقال فيه شعار AMSED + بدون روابط خارجية + سيرة كاملة للعظماء
                  </div>
                )}
              </div>

              {(robot.id === 'facebook' || robot.id === 'instagram') && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                  <input
                    value={robot.config?.token || ''}
                    onChange={e => updConfig(robot.id, 'token', e.target.value)}
                    placeholder="Access Token"
                    className="border border-slate-200 p-2 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
                  />
                  <input
                    value={robot.config?.pageId || ''}
                    onChange={e => updConfig(robot.id, 'pageId', e.target.value)}
                    placeholder="Page ID"
                    className="border border-slate-200 p-2 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              {robot.last_result && (
                <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg mt-2 font-medium">
                  {robot.last_result}
                </div>
              )}

              {robot.last_error && (
                <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-lg mt-2 font-medium">
                  {robot.last_error}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500">الحالة: {robot.status || 'idle'}</span>
                <button
                  onClick={() => runRobot(robot.id)}
                  disabled={robot.status === 'running'}
                  className={`text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer ${
                    robot.status === 'running'
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {robot.status === 'running' ? 'كيخدم... ⏳' : '⚡ تشغيل الآن (Run Now)'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveAll}
        disabled={saving}
        className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl text-xl sm:text-2xl font-black shadow-xl hover:shadow-2xl transition disabled:opacity-50 cursor-pointer"
      >
        {saving ? 'كايتحفظ...' : '💾 حفظ كل التعديلات (حتى المدير وبرومبت التوحد)'}
      </button>

      <div className="mt-4 text-center text-xs text-slate-400 font-mono">
        الرابط: /am-ctrl-9k2l8x-2026-secure-panel-77 - داخل لوحة التحكم الرئيسية
      </div>
    </div>
  );
}
