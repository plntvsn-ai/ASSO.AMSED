import { collection, getDocs, query, where, limit, addDoc, updateDoc, doc, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { smartTranslate } from "./translator";
import { getTopicMatchedImage } from "./topicImageService";

async function fetchFromWikipedia(topic){
  try{
    const r1=await fetch(`https://ar.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=2&format=json&origin=*`);
    const d1=await r1.json();
    if(d1[1]&&d1[1][0]){
      const t=d1[1][0];
      const r2=await fetch(`https://ar.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(t)}&format=json&origin=*`);
      const d2=await r2.json();
      return Object.values(d2.query.pages)[0]?.extract?.slice(0,900)||"";
    }
  }catch(e){}
  return "";
}

export async function autoGenerateAndPublish(){
  // 1. Get topics bank from local storage or defaults
  let topicsList = [];
  try {
    const rawCms = localStorage.getItem('amsed_cms_database_v3');
    if (rawCms) {
      const parsed = JSON.parse(rawCms);
      if (Array.isArray(parsed.autoTopics) && parsed.autoTopics.length > 0) {
        topicsList = parsed.autoTopics;
      }
    }
  } catch (e) {}

  if (topicsList.length === 0) {
    topicsList = [
      { id: "top-1", title: "طرق تأهيل أطفال التوحد وتنمية مهارات النطق والتواصل", used: false },
      { id: "top-2", title: "العلامات المبكرة لطيف التوحد عند الرضع من 6 أشهر إلى سنتين", used: false },
      { id: "top-3", title: "تمارين منزلية عملية لتطوير التواصل البصري والتفاعل الاجتماعي", used: false },
      { id: "top-4", title: "التغذية الصحية ودور النظام الغذائي المتوازن في تحسين سلوك طفل التوحد", used: false },
      { id: "top-5", title: "أهمية قسم التعليم الأولي المكيف وخطوات الإدماج المدرسي الناجح", used: false },
      { id: "top-6", title: "دور مرافق الحياة المدرسية AVS في دعم استقلالية الطفل داخل الفصل", used: false },
      { id: "top-7", title: "التكامل الحسي وأنشطة الغرفة الحسية للحد من التوتر وفرط الحركة", used: false },
      { id: "top-8", title: "الورشات المهنية والتأهيل الحرفي لليافعين والشباب ذوي الاحتياجات الخاصة", used: false },
      { id: "top-9", title: "استراتيجيات التعامل الإيجابي مع نوبات الغضب والاضطراب الحسي في البيت", used: false },
      { id: "top-10", title: "أهمية الروتين اليومي والجداول البصرية المصورة PECS لأطفال التوحد", used: false },
      { id: "top-11", title: "عظماء غيروا العالم: ألبرت أينشتاين وسيرة العبقرية والتغلب على الصعاب", used: false },
      { id: "top-12", title: "عظماء غيروا العالم: قصة نجاح بيل غيتس وكيف حوّل الشغف إلى إمبراطورية", used: false },
      { id: "top-13", title: "الأنشطة المائية والسباحة العلاجية وأثرها في الاسترخاء وتناسق الحركة", used: false },
      { id: "top-14", title: "التربية الإيجابية والدعم النفسي لأولياء أمور وأمهات أطفال التوحد", used: false },
      { id: "top-15", title: "الكشف المبكر عن صعوبات التعلم والنمو اللغوي عند الأطفال بالقنيطرة", used: false },
      { id: "top-16", title: "تنمية المهارات الحركية الدقيقة واستخدام ألعاب التركيز والذكاء", used: false },
      { id: "top-17", title: "العلاج بالفن التشكيلي والرسم كأداة للتعبير العاطفي وتفريغ الطاقة", used: false },
      { id: "top-18", title: "أثر الموسيقى والإيقاعات الهادئة في تحفيز التواصل العصبي للطفل", used: false },
      { id: "top-19", title: "التدريب على الاستقلالية اليومية: ارتداء الملابس، النظافة، وتناول الطعام", used: false },
      { id: "top-20", title: "المستجدات العلمية والطبية الحديثة في أبحاث طيف التوحد 2026", used: false }
    ];
  }

  // 2. Load existing articles to check already published titles
  let existingArticles = [];
  try {
    const rawCms = localStorage.getItem('amsed_cms_database_v3');
    if (rawCms) {
      const parsed = JSON.parse(rawCms);
      existingArticles = Array.isArray(parsed.articles) ? parsed.articles : [];
    }
  } catch (e) {}

  const publishedTitles = new Set(existingArticles.map(a => (a.title || '').trim()));

  // 3. Find an unused topic that hasn't been published yet
  let chosenTopic = topicsList.find(t => !t.used && !publishedTitles.has(t.title));
  if (!chosenTopic) {
    // Reset all topics to false if all were used
    topicsList.forEach(t => { t.used = false; });
    chosenTopic = topicsList.find(t => !publishedTitles.has(t.title)) || topicsList[0];
  }

  const topicTitle = chosenTopic ? chosenTopic.title : "طرق تأهيل أطفال التوحد وتنمية مهارات النطق والتواصل";
  if (chosenTopic) {
    chosenTopic.used = true;
    chosenTopic.usedAt = new Date().toISOString();
  }

  // 4. Match image specifically for this chosen topic
  const matchedImage = getTopicMatchedImage(topicTitle);

  const wiki = await fetchFromWikipedia(topicTitle);

  // Rich ~400-500 words specialized autism article structure
  const content = `
    <p><strong>مقدمة معرفية:</strong> ${wiki || `يشكل موضوع ${topicTitle} ركيزة أساسية في فهم عالم الطفولة وتطوير قدرات الأطفال ذوي الاحتياجات الخاصة وفي وضعية صعبة.`}</p>
    
    <p>في جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED بالقنيطرة، نؤمن بأن كل طفل يحمل طاقات فريدة تنتظر الاحتضان والتوجيه السليم. إن التعامل مع موضوع <strong>"${topicTitle}"</strong> يتطلب رؤية تجمع بين المعرفة العلمية الدقيقة واللمسة الإنسانية المليئة بالصبر والمحبة، حيث تشير الدراسات الميدانية وتجارب المتخصصين إلى أن التدخل المبكر والدعم المستمر يصنعان فارقاً حاسماً في مسار الطفل وتطوره اليومي.</p>

    <h3>لماذا يكتسي هذا الموضوع أهمية بالغة؟</h3>
    <p>إن الطفل في بيئته اليومية يحتاج إلى الشعور بالأمان والاستقرار النفسي لكي يتمكن من التعبير عن ذاته والتفاعل مع محيطه الأسري والاجتماعي. عندما نواجه تحديات متعلقة بـ "${topicTitle}"، فإن الاستجابة الصحيحة تبدأ من تفهم خصوصية الطفل، وتجنب المقارنات المحبطة، واعتماد أسلوب تدريجي يراعي سرعته الفردية في التعلم والاكتساب. فالأطفال ذوو التوحد وصعوبات التعلم يتفاعلون بإيجابية كبيرة مع الوسائط البصرية والجداول المنتظمة التي تمنحهم خريطة واضحة ليومهم وتحد من مستويات التوتر والقلق لديهم.</p>

    <h3>خمس خطوات عملية وتطبيقية من واقع خبرة AMSED</h3>
    <p><strong>1. التهيئة البصرية والروتين الواضح:</strong> استخدام الجداول المصورة والإشارات البصرية يساعد الطفل على توقع الأحداث القادمة وتنظيم وقته بسلاسة ودون مفاجآت تربك توازنه الحسي.</p>
    <p><strong>2. التشجيع الإيجابي الفوري:</strong> مكافأة كل إنجاز، مهما بدا بسيطاً، بالثناء والابتسامة والتعزيز المعنوي، مما يبني ثقة الطفل بنفسه ويحفزه على تكرار السلوك الإيجابي.</p>
    <p><strong>3. تبسيط المهام وتقسيمها:</strong> تقسيم كل نشاط إلى خطوات صغيرة متتالية يسهل على الطفل إتقان المهارة والشعور بالإنجاز دون التعرض للإرهاق أو الإحباط.</p>
    <p><strong>4. مراعاة الحساسيات الحسية:</strong> الانتباه للمؤثرات البيئية مثل الإضاءة الساطعة أو الضوضاء العالية، وتوفير مساحات هادئة تسمح للطفل بالاسترخاء واستعادة توازنه النفسي.</p>
    <p><strong>5. التواصل والتنسيق الدائم مع الأسرة:</strong> توحيد لغة التعامل بين المركز التأهيلي والبيت لضمان استمرارية المكتسبات وتثبيتها في شتى مواقف الحياة اليومية.</p>

    <h3>رسالة جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED</h3>
    <p>تواصل جمعية AMSED جهودها الميدانية الحثيثة لمواكبة أكثر من 650 طفلاً وأسرة بمدينة القنيطرة والنواحي، من خلال أقسام التعليم الأولي المكيف، ورشات المهارات الحياتية، التأهيل المهني للشباب، وبرامج الإدماج المدرسي والأنشطة الترفيهية الهادفة. إن يد التكافل مفتوحة دائماً لكل من يرغب في مساندة هؤلاء الأبطال.</p>

    <p><em>"الطفل ليس مختلفاً ليعزل، بل هو مميز ليحتضن. بتضافر جهودنا جميعاً، نصنع غداً أفضل وأكثر إشراقاً لأطفالنا."</em></p>
  `.trim();

  // Smart translation
  let title_fr = topicTitle;
  let title_en = topicTitle;
  try {
    const [fr, en] = await Promise.all([
      smartTranslate(topicTitle, 'fr'),
      smartTranslate(topicTitle, 'en')
    ]);
    title_fr = fr;
    title_en = en;
  } catch (tErr) {}

  const newArticle = {
    id: `auto-${Date.now()}`,
    title: topicTitle,
    title_ar: topicTitle,
    title_fr,
    title_en,
    slug: `amsed-autism-${Date.now()}`,
    content,
    content_ar: content,
    excerpt: `مقال توجيهي وتطبيقي من جمعية AMSED حول ${topicTitle} وسبل دعم وتأهيل الأطفال خطوة بخطوة.`,
    imageUrl: matchedImage.url,
    image: matchedImage.url,
    image_alt: matchedImage.alt,
    category: "التوحد والطفولة",
    author: "أطر جمعية AMSED",
    published: true,
    autoGenerated: true,
    is_ai: true,
    createdAt: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    views: 0
  };

  // 5. SAVE TO LOCAL STORAGE IMMEDIATELY
  try {
    const rawCms = localStorage.getItem('amsed_cms_database_v3');
    const cmsObj = rawCms ? JSON.parse(rawCms) : {};
    if (!Array.isArray(cmsObj.articles)) cmsObj.articles = [];
    cmsObj.articles.unshift(newArticle);
    cmsObj.autoTopics = topicsList;
    localStorage.setItem('amsed_cms_database_v3', JSON.stringify(cmsObj));
    window.dispatchEvent(new Event('cms-update'));
  } catch (e) {}

  // 6. SYNC TO FIRESTORE IF AVAILABLE
  if (db) {
    try {
      await addDoc(collection(db, "articles"), {
        ...newArticle,
        createdAt: serverTimestamp()
      });
      const ref = doc(db, "autoSettings", "main");
      await setDoc(ref, {
        lastRun: serverTimestamp(),
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
        enabled: true
      }, { merge: true });
    } catch (dbErr) {
      console.warn("Firestore auto publish sync notice:", dbErr);
    }
  }

  // 7. SYNC TO SUPABASE VIA SERVERLESS API
  try {
    fetch('/api/autonomous-publish', { method: 'POST' }).catch(() => {});
  } catch (e) {}

  return topicTitle;
}

export const executeAutoPublish = autoGenerateAndPublish;
export default autoGenerateAndPublish;
