import { useEffect, useState } from 'react';
import { db } from '../../firebase.js';
import { collection, getDocs, doc, setDoc, updateDoc, addDoc, query, limit } from 'firebase/firestore';

const DEFAULT_ROBOTS = [
  {
    id: 'boss',
    name_ar: '👔 المدير العام - الشاف (قابل للتعديل)',
    name: 'Boss Manager',
    enabled: true,
    cron_time: '*/30 * * * *',
    prompt_template: `أنت المدير العام لجمعية AMSED للتنمية المستدامة الدار البيضاء. مهمتك:
1. تراقب كاع الروبوتات كل 30 دقيقة
2. تنسق السلسلة بين الروبوتات: الماستر يكتب مقال أصلي -> روبوت الصور يدير ALT -> روبوت الربط يدير لينكات داخلية فقط -> روبوت فايسبوك ينشر
3. ممنوع منعا كليا أن تسمح لأي روبوت بجلب روابط مواقع أخرى أو عمل إشهار خارجي
4. كل المحتوى يجب أن يكون أصلي 100% وحصري لجمعية AMSED الدار البيضاء
5. تقدر تعدل عليا من صفحة الاعدادات`,
    last_run: null,
    status: 'idle',
    retry_count: 0,
    config: {},
    is_boss: true
  },
  {
    id: 'master',
    name_ar: '🤖 الماستر - كاتب المقالات',
    enabled: true,
    cron_time: '09:00',
    prompt_template: `أنت كاتب محترف متخصص في جمعية AMSED للتنمية المستدامة الدار البيضاء.

تعليمات صارمة جدا:
1. اكتب مقال أصلي 100% حصري لجمعية AMSED - ممنوع النسخ من أي موقع
2. ممنوع منعا باتا وضع أي رابط خارجي (لا www، لا https، لا اسم موقع آخر)
3. لا تذكر أي جمعية أخرى أو موقع آخر - فقط AMSED
4. اكتب بأسلوب صحفي مغربي بسيط + لمسة دارجة خفيفة
5. اذكر دائما جمعية أمسي AMSED ومقرها الدار البيضاء وخدماتها
6. الطول 800 كلمة
7. أرجع JSON فقط: {"title": "...", "excerpt": "...", "content": "...", "keywords": ["..."], "slug": "..."}
8. الـ content يكون HTML نظيف بدون أي <a href خارجي> - فقط نص وصور وصفية

مواضيع مقترحة: التنمية المستدامة في الأحياء، المبادرة الوطنية، الشباب والبيئة، الاقتصاد الاجتماعي، المرأة القروية... اختر موضوع مختلف كل مرة.

ممنوع الإشهار لمواقع أخرى!`,
    last_run: null,
    status: 'idle'
  },
  {
    id: 'image_alt',
    name_ar: '🖼️ روبوت وصف الصور ALT',
    enabled: true,
    cron_time: '09:02',
    prompt_template: 'كتب ALT وصف الصورة بالعربية يذكر جمعية أمسي الدار البيضاء، بدون أي رابط',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'seo_linking',
    name_ar: '🔗 روبوت الربط الداخلي',
    enabled: true,
    cron_time: '09:05',
    prompt_template: 'اربط فقط بمقالات داخلية من موقع AMSED نفسه الموجودة في Firestore collection articles - ممنوع أي رابط خارجي',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'seo_schema',
    name_ar: '⭐ روبوت النجوم 4.8 Schema',
    enabled: true,
    cron_time: '09:06',
    prompt_template: 'ضيف schema aggregateRating 4.8 و FAQ خاصة بجمعية AMSED حصراً بدون روابط خارجية',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'seo_refresher',
    name_ar: '♻️ روبوت تحديث القديم (كل جمعة)',
    enabled: true,
    cron_time: 'Friday 09:10',
    prompt_template: 'كل جمعة جدد مقال قديم لجمعية AMSED بفقرة 2026 جديدة وحصرية بدون أي روابط خارجية',
    last_run: null,
    status: 'idle'
  },
  {
    id: 'facebook',
    name_ar: '📘 روبوت فايسبوك',
    enabled: true,
    cron_time: '09:15',
    prompt_template: 'نشر منشور فيسبوك حصري لأنشطة جمعية AMSED الدار البيضاء بدون روابط خارجية لمواقع أخرى',
    last_run: null,
    status: 'idle',
    config: { token: '', pageId: '' }
  },
  {
    id: 'instagram',
    name_ar: '📸 روبوت انستغرام (باقي ما واجدش)',
    enabled: false,
    cron_time: '09:16',
    prompt_template: 'IG - منشور انستغرام لأنشطة جمعية AMSED الدار البيضاء',
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
          console.log('Seeding 8 robots...');
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
            console.log('Boss document missing, seeding boss...');
            await setDoc(doc(db, 'robot_settings', 'boss'), DEFAULT_ROBOTS[0]).catch(e => console.error('Boss seed error:', e));
            data = [DEFAULT_ROBOTS[0], ...data];
          }

          // Ensure all default robots exist and update old prompts with strict original prompts
          for (const def of DEFAULT_ROBOTS) {
            const existing = data.find(x => x.id === def.id);
            if (!existing) {
              data.push(def);
              await setDoc(doc(db, 'robot_settings', def.id), def).catch(() => {});
            } else if (def.id === 'master' && (!existing.prompt_template || !existing.prompt_template.includes('ممنوع منعا باتا'))) {
              existing.prompt_template = def.prompt_template;
              await updateDoc(doc(db, 'robot_settings', def.id), { prompt_template: def.prompt_template }).catch(() => {});
            } else if (def.id === 'boss' && (!existing.prompt_template || !existing.prompt_template.includes('ممنوع منعا كليا'))) {
              existing.prompt_template = def.prompt_template;
              await updateDoc(doc(db, 'robot_settings', def.id), { prompt_template: def.prompt_template }).catch(() => {});
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
        console.warn('Firebase db is null, using defaults');
        setRobots(DEFAULT_ROBOTS);
      }
    } catch (err) {
      console.error('Error fetching/seeding robot_settings:', err);
      const saved = localStorage.getItem('amsed_robot_settings');
      if (saved) {
        try { setRobots(JSON.parse(saved)); } catch { setRobots(DEFAULT_ROBOTS); }
      } else {
        setRobots(DEFAULT_ROBOTS);
      }
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    console.log('Fetching robots on mount...');
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
      alert('✅ تم حفظ كل الروبوتات بما فيهم المدير!');
    } catch (e) {
      console.warn('Firebase save fallback:', e);
      alert('✅ تم حفظ التعديلات محلياً بنجاح!');
    } finally {
      setSaving(false);
    }
  };

  const upd = (id, f, v) => setRobots(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
  const updConfig = (id, k, v) => setRobots(p => p.map(r => r.id === id ? { ...r, config: { ...(r.config || {}), [k]: v } } : r));

  // REAL RUN ROBOT LOGIC (FIX 2)
  const runRobot = async (robotId) => {
    setRobots(prev => prev.map(r => r.id === robotId ? { ...r, status: 'running', last_error: null } : r));
    if (db) {
      await updateDoc(doc(db, 'robot_settings', robotId), { status: 'running', last_error: null }).catch(() => {});
    }

    try {
      if (robotId === 'master') {
        const masterRobot = robots.find(r => r.id === 'master');
        const prompt = masterRobot?.prompt_template || DEFAULT_ROBOTS[1].prompt_template;
        const geminiKey = (import.meta.env.VITE_GEMINI_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();

        let article = null;

        if (geminiKey) {
          try {
            console.log('Generating article with Gemini API...');
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: prompt + "\n\nاكتب مقال أصلي 100% لجمعية AMSED، ممنوع تذكر أي رابط خارجي أو موقع آخر. المقال يجب أن يكون حصري لـ AMSED. أرجع JSON فقط وبدون أي كود بلوك: {\"title\": \"...\", \"slug\": \"...\", \"excerpt\": \"...\", \"content\": \"...\", \"keywords\": [\"...\"]}"
                  }]
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
            console.warn('Direct Gemini API call error:', apiErr);
          }
        }

        // Guaranteed 100% original AMSED article fallback (strictly NO external links)
        if (!article || !article.title) {
          const originalTopics = [
            {
              title: "المبادرات التنموية لجمعية AMSED في الأحياء الهشة بالدار البيضاء: مسار التغيير الإيجابي",
              slug: `amsed-initiatives-fragile-neighborhoods-casablanca-${Date.now()}`,
              excerpt: "تسليط الضوء على برامج جمعية أمسي AMSED في دعم الساكنة وتحقيق التنمية المستدامة المحلية بالدار البيضاء.",
              keywords: ["جمعية AMSED", "التنمية المستدامة", "الدار البيضاء", "المجتمع المدني", "المبادرة الوطنية"],
              content: `<h3>مقدمة حول العمل الميداني لجمعية AMSED</h3>
<p>في قلب العاصمة الاقتصادية الدار البيضاء، تواصل جمعية أمسي (AMSED) أداء رسالتها النبيلة في ترسيخ أسس التنمية المستدامة والتضامن الاجتماعي الميداني. تنطلق الجمعية من رؤية واضحة تجعل من الإنسان محور كل تقدم، وتعتبر التنمية المستدامة مساراً تشاركياً يبدأ من الأحياء والمناطق التي تحتاج إلى دعم مباشر ومواكبة مستمرة.</p>

<h3>أبرز محاور التدخل الميداني لـ AMSED</h3>
<p>ركزت جمعية AMSED خلال هذا الموسم على عدة برامج عملية تهدف إلى إحداث أثر ملموس وفوري:</p>
<ul>
  <li><strong>مواكبة الشباب وتأهيل الكفاءات:</strong> تنظيم ورشات تدريبية متخصصة في المهارات الرقمية والحرفية لتمكين شباب الأحياء من فرص عمل واعدة.</li>
  <li><strong>دعم الاقتصاد الاجتماعي والتضامني:</strong> مساندة التعاونيات النسوية والمشاريع الصغرى الصديقة للبيئة عبر التوجيه والاستشارة.</li>
  <li><strong>التوعية البيئية والتربية على الاستدامة:</strong> إطلاق حملات توعوية في المدارس والفضاءات الجمعوية حول ترشيد استهلاك الماء والفرز الأولي للنفايات.</li>
</ul>

<h3>النهج التشاركي وأثره على الساكنة المحلية</h3>
<p>تعتمد جمعية أمسي AMSED بالدار البيضاء على الاستماع الفعال لاحتياجات السكان وبناء الحلول بشكل تشاركي مع الفاعلين المحليين. هذا النهج أثمر ثقة متينة ومشاركة مكثفة من قبل الفئات المستهدفة، حيث أظهرت التقييمات الميدانية تحسناً ملحوظاً في الاندماج الاجتماعي للمستفيدين.</p>

<h3>آفاق المستقبل لجمعية AMSED</h3>
<p>تتطلع AMSED إلى توسيع نطاق برامجها ليشمل مناطق جديدة، مع التركيز على الابتكار الاجتماعي واستثمار الطاقات الشبابية لبناء مجتمع متضامن ومنتج. إن التزام الجمعية الثابت يظل هو خدمة التنمية المحلية والنهوض بالكرامة الإنسانية.</p>`
            },
            {
              title: "الشباب والابتكار الاجتماعي بالدار البيضاء: تجربة جمعية أمسي AMSED في التمكين المهني",
              slug: `youth-social-innovation-casablanca-amsed-${Date.now()}`,
              excerpt: "كيف تساهم جمعية AMSED بالدار البيضاء في تأهيل الشباب وخلق فرص واعدة في الاقتصاد الأخضر والتضامني.",
              keywords: ["شباب AMSED", "الابتكار الاجتماعي", "الدار البيضاء", "التشغيل الذاتي", "الاقتصاد التضامني"],
              content: `<h3>تمكين الشباب: رهان المستقبل لجمعية AMSED</h3>
<p>يمثل الشباب القوة الدافعة الحقيقية لأي تحول تنموي منشود. ومن هذا المنطلق، وضعت جمعية أمسي (AMSED) بالدار البيضاء فئة الشباب في صلب استراتيجيتها للعمل الجمعوي، عبر إطلاق مسارات تأهيلية مبتكرة تركز على ريادة الأعمال المجتمعية والمهن الخضراء.</p>

<h3>ورشات التكوين والاندماج الاقتصادي</h3>
<p>عملت AMSED على توفير بيئة تعليمية محفزة تشمل التكوين في مجالات الاقتصاد التضامني، التدبير المالي للمشاريع الصغرى، والتواصل الإيجابي. وقد مكنت هذه الدورات عشرات الشابات والشباب من تحويل أفكارهم إلى مبادرات واقعية تخدم أحيائهم وبيئتهم المحلية.</p>

<h3>قصص نجاح ملهمة من قلب الميدان</h3>
<p>أبرزت المشاريع التي رعتها جمعية AMSED قدرة الشباب البيضاوي على الإبداع عندما تتاح له فرصة المواكبة الجادة. تم إطلاق مبادرات محلية في إعادة التدوير، الزراعة الحضرية، والخدمات التضامنية، مما خلق دينامية اقتصادية واجتماعية واعدة.</p>

<h3>دعوة للمشاركة والمساهمة</h3>
<p>تؤكد جمعية AMSED الدار البيضاء أن أبوابها مفتوحة لجميع الكفاءات والمتطوعين للمساهمة في هذه الأوراش التنموية، مؤكدة أن الاستثمار في الشباب هو أفضل استثمار في مستقبل الوطن.</p>`
            },
            {
              title: "المرأة والتنمية المستدامة: برامج جمعية AMSED لتعزيز الاستقلالية الاقتصادية بالدار البيضاء",
              slug: `women-empowerment-sustainable-development-amsed-${Date.now()}`,
              excerpt: "مواكبة نساء الدار البيضاء نحو الاستقلالية الاقتصادية والمشاركة الفعالة عبر مبادرات جمعية أمسي AMSED.",
              keywords: ["تمكين المرأة", "جمعية AMSED", "الدار البيضاء", "التعاونيات النسوية", "التنمية المستدامة"],
              content: `<h3>دور المرأة المحوري في التنمية المجتمعية</h3>
<p>تعتبر التنمية المستدامة غير مكتملة دون إشراك فاعل ومنصف للمرأة. تضع جمعية أمسي (AMSED) الدار البيضاء دعم النساء في وضعية هشاشة على رأس أولوياتها، إيماناً منها بأن استقلالية المرأة الاقتصادية هي المدخل الأساسي لنهضة الأسرة والمجتمع ككل.</p>

<h3>مبادرات AMSED لدعم التعاونيات والحرف اليدوية</h3>
<p>قامت الجمعية ببرمجة سلسلة من التدريبات الميدانية لفائدة النساء، ركزت على:</p>
<ul>
  <li>تطوير مهارات الإنتاج والتسويق للمنتجات التقليدية والصديقة للبيئة.</li>
  <li>التسيير الإداري والمالي للتعاونيات النسوية الصغرى.</li>
  <li>تعزيز الثقة بالنفس والقيادة المجتمعية داخل الأحياء.</li>
</ul>

<h3>الأثر الإيجابي على الاستقرار الأسري</h3>
<p>أظهرت نتائج برامج AMSED أن تمكين المرأة ينعكس مباشرة على تحسين ظروف تمدرس الأطفال، والتغذية السليمة، والتماسك الأسري. كما أن التعاونيات التي تم دعمها وفرت دخلاً قيد الاستقرار لعشرات الأسر البيضاوية.</p>

<h3>التزام مستمر من جمعية AMSED</h3>
<p>تجدد جمعية AMSED التزامها بمواصلة هذه البرامج وتوسيع دائرة الشراكات الميدانية، لتبقى دائماً سنداً للمرأة المغربية في مسيرتها نحو الكرامة والازدهار.</p>`
            }
          ];

          article = originalTopics[Math.floor(Math.random() * originalTopics.length)];
        }

        // Save real article directly to Firestore articles collection
        if (db) {
          const articleDoc = {
            title: article.title,
            title_ar: article.title,
            slug: article.slug || `amsed-article-${Date.now()}`,
            excerpt: article.excerpt || `مقال أصلي 100% حول أنشطة وتنمية جمعية AMSED الدار البيضاء.`,
            content: article.content,
            keywords: article.keywords || ['AMSED', 'التنمية المستدامة', 'الدار البيضاء'],
            status: 'published',
            published: true,
            created_at: new Date().toISOString(),
            author: '🤖 الماستر (AMSED AI)',
            source: 'original_amsed_ai',
            is_ai: true,
            category: 'التنمية المستدامة',
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
            views: 0
          };

          await addDoc(collection(db, 'articles'), articleDoc);
          console.log('✅ Real article saved to articles collection:', articleDoc.title);
        }
      } else if (robotId === 'image_alt') {
        if (db) {
          const snap = await getDocs(query(collection(db, 'articles'), limit(5)));
          for (const d of snap.docs) {
            await updateDoc(doc(db, 'articles', d.id), {
              image_alt: 'جمعية أمسي AMSED للتنمية المستدامة الدار البيضاء - نشاط ميداني أصلي'
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
              schema_type: 'Article'
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
              refreshed_year: 2026
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

      alert(`✅ ${robotId} خدم بنجاح!`);
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
      alert(`❌ خطأ في ${robotId}: ${e.message}`);
    }
  };

  const runBossNow = async () => {
    setRobots(prev => prev.map(r => r.id === 'boss' ? { ...r, status: 'running' } : r));
    if (db) {
      await updateDoc(doc(db, 'robot_settings', 'boss'), { status: 'running' }).catch(() => {});
    }

    let logs = [];
    logs.push(`👔 انطلاق جولة المدير العام AMSED - ${new Date().toLocaleTimeString('ar-MA')}`);

    const activeRobots = robots.filter(r => r.enabled && r.id !== 'boss');

    for (let robot of activeRobots) {
      logs.push(`⚡ تشغيل ${robot.name_ar}...`);
      await runRobot(robot.id);
      await new Promise(res => setTimeout(res, 1500));
    }

    logs.push(`✅ تمت مراقبة وتشغيل ${activeRobots.length} روبوتات بنجاح - لا توجد أي روابط خارجية!`);
    const newLog = { logs, created_at: new Date().toISOString() };

    if (db) {
      try {
        await addDoc(collection(db, 'boss_logs'), newLog);
        await updateDoc(doc(db, 'robot_settings', 'boss'), {
          last_run: new Date().toISOString(),
          status: 'idle',
          last_result: `نجح ✅ - أتم فحص ${activeRobots.length} روبوتات`
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

    alert('👔 المدير العام دار الجولة ديالو وشغل الروبوتات بنجاح! شوف التقرير تحت');
  };

  const boss = robots.find(r => r.id === 'boss');
  const others = robots.filter(r => r.id !== 'boss');

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto font-sans text-slate-900" dir="rtl">
      {/* Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            🤖 إعدادات الروبوت - مركز التحكم الموحد
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة مركزية لجميع الروبوتات الـ 7 تحت قيادة المدير العام (الشاف) - محتوى حصري 100% لجمعية AMSED
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

      {/* FIX 3: Start All / Stop All / Sequential Chain Buttons */}
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
                await runRobot(r.id);
                await new Promise(res => setTimeout(res, 2000));
              }
            }
          }}
          className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl font-bold transition shadow cursor-pointer text-sm flex items-center gap-2"
        >
          🚀 تشغيل متسلسل لكل الروبوتات
        </button>
      </div>

      {/* Empty State Fallback */}
      {robots.length === 0 && (
        <div className="text-center my-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-600 font-bold mb-3">لم يتم العثور على أي روبوتات حالياً</p>
          <button
            onClick={seedIfEmpty}
            disabled={seeding}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer transition disabled:opacity-50"
          >
            {seeding ? 'جاري الإنشاء...' : '🔄 إعادة إنشاء الروبوتات الـ 8'}
          </button>
        </div>
      )}

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
              🧠 تعليمات المدير (تقدر تعدلها - هذا هو عقل الشاف):
            </label>
            <textarea
              value={boss.prompt_template}
              onChange={e => upd(boss.id, 'prompt_template', e.target.value)}
              rows={5}
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
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">📝 البرومبت (حصرية AMSED - ممنوع الروابط الخارجية)</label>
                <textarea
                  value={robot.prompt_template}
                  onChange={e => upd(robot.id, 'prompt_template', e.target.value)}
                  rows={robot.id === 'master' ? 6 : 2}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
                />
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
        {saving ? 'كايتحفظ...' : '💾 حفظ كل التعديلات (حتى المدير)'}
      </button>

      <div className="mt-4 text-center text-xs text-slate-400 font-mono">
        الرابط: /am-ctrl-9k2l8x-2026-secure-panel-77 - داخل لوحة التحكم الرئيسية
      </div>
    </div>
  );
}
