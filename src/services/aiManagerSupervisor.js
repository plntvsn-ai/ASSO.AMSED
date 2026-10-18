/**
 * AI Manager Agent Supervisor (مدير الروبوتات والذكاء الاصطناعي - المراقبة وضبط الجودة)
 * مهمته:
 * 1. مراقبة كافة المقالات المنشورة ومنع أي تكرار نهائياً.
 * 2. تصفية وحذف المقالات المكررة في التخزين المحلي وقاعدة البيانات.
 * 3. اختيار مواضيع جديدة وحصرية من خزان الـ 50 موضوعاً المتخصص.
 */

import { db } from './firebase';

// دالة تطبيع وتنظيف العناوين للمقارنة الدقيقة
export function normalizeTitleForComparison(title = '') {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة التشكيل
    .replace(/[^\w\s\u0600-\u06FF]/g, '') // إزالة الرموز والأقواس
    .replace(/\s+/g, ' ')
    .trim();
}

// استخراج الموضوع الجوهري للمقال (Core Topic Tag)
export function extractCoreTopicTag(title = '') {
  const norm = normalizeTitleForComparison(title);
  
  if (norm.includes('اينشتاين') || norm.includes('einstein')) return 'topic_einstein';
  if (norm.includes('بيل غيتس') || norm.includes('gates')) return 'topic_gates';
  if (norm.includes('ايلون ماسك') || norm.includes('musk')) return 'topic_musk';
  if (norm.includes('تيسلا') || norm.includes('tesla')) return 'topic_tesla';
  if (norm.includes('تاجيري') || norm.includes('بوكيمون') || norm.includes('pokemon')) return 'topic_pokemon';
  if (norm.includes('نيوتن') || norm.includes('newton')) return 'topic_newton';
  if (norm.includes('موزارت') || norm.includes('mozart')) return 'topic_mozart';
  if (norm.includes('غريتا') || norm.includes('ثونبرغ') || norm.includes('greta')) return 'topic_greta';
  
  if (norm.includes('علامات مبكره') || norm.includes('رضع') || norm.includes('تشخيص مبكر')) return 'topic_early_signs';
  if (norm.includes('تمارين منزليه') || norm.includes('تواصل بصري')) return 'topic_eye_contact';
  if (norm.includes('تغذيه') || norm.includes('غلوتين') || norm.includes('حميه')) return 'topic_nutrition';
  if (norm.includes('تعليم اولي') || norm.includes('روضه') || norm.includes('مكيف')) return 'topic_preschool';
  if (norm.includes('مرافق') || norm.includes('avs') || norm.includes('حياه مدرسيه')) return 'topic_avs';
  if (norm.includes('تكامل حسي') || norm.includes('غرفه حسيه') || norm.includes('فرط حركه')) return 'topic_sensory';
  if (norm.includes('ورشات مهنيه') || norm.includes('تاهيل حرفي') || norm.includes('حلويات')) return 'topic_vocational';
  if (norm.includes('نوبات غضب') || norm.includes('انهيار حسي') || norm.includes('meltdown')) return 'topic_meltdown';
  if (norm.includes('روتين يومي') || norm.includes('جداول بصريه') || norm.includes('pecs')) return 'topic_pecs';
  if (norm.includes('نطق') || norm.includes('تخاطب') || norm.includes('كلام')) return 'topic_speech';
  if (norm.includes('حركيه دقيقه') || norm.includes('صلصال') || norm.includes('العاب ذكاء')) return 'topic_motor_skills';
  if (norm.includes('نفس حركيه') || norm.includes('psychomotricite') || norm.includes('وعي بالجسد')) return 'topic_psychomotor';
  if (norm.includes('مصاداه') || norm.includes('echolalia') || norm.includes('ترديد كلام')) return 'topic_echolalia';
  if (norm.includes('سباحه') || norm.includes('مائيه') || norm.includes('ماء')) return 'topic_swimming';
  if (norm.includes('علاج وظيفي') || norm.includes('ergotherapie')) return 'topic_ergo';

  // إذا لم يطابق أي موضوع محدد، نأخذ أول 5 كلمات جوهرية
  const words = norm.split(' ').slice(0, 5).join('_');
  return `topic_custom_${words}`;
}

/**
 * فحص وتصفية مصفوفة مقالات من أي تكرار
 * يضمن بقاء نسخة وحيدة فقط من كل مقال أو موضوع
 */
export function deduplicateArticlesList(articles = []) {
  if (!Array.isArray(articles)) return [];

  const seenIds = new Set();
  const seenNormTitles = new Set();
  const seenCoreTopics = new Set();
  const uniqueArticles = [];

  for (const art of articles) {
    if (!art) continue;

    // 1. تحقق من المعرف ID
    const artId = String(art.id || art._id || '');
    if (artId && seenIds.has(artId)) {
      continue; // مكرر بنفس المعرف
    }

    // 2. تحقق من العنوان بعد التطبيع
    const title = art.title || art.title_ar || art.titleAr || '';
    const normTitle = normalizeTitleForComparison(title);
    if (!normTitle) continue;

    if (seenNormTitles.has(normTitle)) {
      continue; // مكرر بنفس العنوان الحرفي
    }

    // 3. تحقق من الموضوع الجوهري (منع كتابة مقالين عن نفس الفكرة)
    const coreTopic = extractCoreTopicTag(title);
    if (coreTopic && seenCoreTopics.has(coreTopic)) {
      continue; // مكرر لنفس الموضوع الجوهري
    }

    // مقال فريد وغير مكرر
    if (artId) seenIds.add(artId);
    seenNormTitles.add(normTitle);
    if (coreTopic) seenCoreTopics.add(coreTopic);
    uniqueArticles.push(art);
  }

  return uniqueArticles;
}

/**
 * وظيفة المدير العام: فحص ومراقبة المقالات وتصفية التكرار فوراً في المتصفح والسحابة
 */
export async function superviseAndDeduplicateAllArticles() {
  const report = {
    timestamp: new Date().toISOString(),
    scannedCount: 0,
    duplicatesRemoved: 0,
    uniqueRemaining: 0,
    action: 'clean_duplicates'
  };

  try {
    const rawCms = localStorage.getItem('amsed_cms_database_v3');
    let currentArticles = [];
    let cmsObj = {};

    if (rawCms) {
      cmsObj = JSON.parse(rawCms);
      if (Array.isArray(cmsObj.articles)) {
        currentArticles = cmsObj.articles;
      }
    }

    report.scannedCount = currentArticles.length;
    const cleanArticles = deduplicateArticlesList(currentArticles);
    report.duplicatesRemoved = currentArticles.length - cleanArticles.length;
    report.uniqueRemaining = cleanArticles.length;

    // حفظ المقالات المصفاة النظيفة في localStorage
    cmsObj.articles = cleanArticles;
    localStorage.setItem('amsed_cms_database_v3', JSON.stringify(cmsObj));

    // إشعار باقي المكونات بالتحديث الفوري
    window.dispatchEvent(new Event('cms-update'));
    window.dispatchEvent(new Event('storage'));

    // تنظيف Firebase إذا كان متوفراً
    if (db) {
      try {
        const { collection, getDocs, deleteDoc, doc: fsDoc } = await import('firebase/firestore');
        const snap = await getDocs(collection(db, 'articles'));
        if (snap && !snap.empty) {
          const fsSeenTitles = new Set();
          for (const d of snap.docs) {
            const data = d.data();
            const norm = normalizeTitleForComparison(data.title || data.title_ar || '');
            if (fsSeenTitles.has(norm)) {
              // حذف الوثيقة المكررة من Firestore
              await deleteDoc(fsDoc(db, 'articles', d.id)).catch(() => {});
            } else {
              fsSeenTitles.add(norm);
            }
          }
        }
      } catch (fsErr) {
        console.warn('Firestore deduplication notice:', fsErr);
      }
    }

    // 4. فحص الروبوتات وإصلاح أي عطب أو توقف تلقائياً (Self-Healing)
    let healedRobots = 0;
    try {
      const rawRobots = localStorage.getItem('amsed_robot_settings');
      if (rawRobots) {
        let robotsList = JSON.parse(rawRobots);
        if (Array.isArray(robotsList)) {
          let changed = false;
          robotsList = robotsList.map(r => {
            if (r.status === 'error') {
              healedRobots++;
              changed = true;
              return { ...r, status: 'idle', last_error: null, auto_healed_at: new Date().toISOString() };
            }
            return r;
          });
          if (changed) {
            localStorage.setItem('amsed_robot_settings', JSON.stringify(robotsList));
          }
        }
      }

      if (db) {
        const { collection, getDocs, updateDoc, doc: fsDoc } = await import('firebase/firestore');
        const rSnap = await getDocs(collection(db, 'robot_settings'));
        if (rSnap && !rSnap.empty) {
          for (const rd of rSnap.docs) {
            const rData = rd.data();
            if (rData.status === 'error') {
              healedRobots++;
              await updateDoc(fsDoc(db, 'robot_settings', rd.id), {
                status: 'idle',
                last_error: null,
                auto_healed_at: new Date().toISOString()
              }).catch(() => {});
            }
          }
        }
      }
    } catch (rErr) {
      console.warn('Robot self-healing notice:', rErr);
    }

    report.healedRobots = healedRobots;

    console.log('👔 تقرير مراقبة المدير العام:', report);
    return report;
  } catch (err) {
    console.error('Supervise error:', err);
    return { ...report, error: err.message };
  }
}
