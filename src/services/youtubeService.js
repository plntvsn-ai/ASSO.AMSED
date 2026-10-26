import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const YOUTUBE_CHANNEL_CONFIG = {
  youtubeChannelId: "UCBPlqmKVq9KvzXMEmp5dDPQ",
  youtubeHandle: "@association-amesd",
  youtubeUrl: "https://youtube.com/@association-amesd"
};

export const OFFICIAL_CHANNEL_VIDEOS = [
  {
    id: "yt-nz-B1nPZjbo",
    youtubeId: "nz-B1nPZjbo",
    title: "الحلقة 20: روتين وقت النوم لأطفال التوحد",
    desc: "سلسلة التوحد - الحلقة 20: خطوات علمية وعملية لمساعدة طفل التوحد على الاستغراق في النوم بهدوء وراحة.",
    publishedDate: "2026-10-25",
    isDailyFeatured: true,
    views: "80+"
  },
  {
    id: "yt-JjWN4hb7jus",
    youtubeId: "JjWN4hb7jus",
    title: "الحلقة 19: روتين الشاشة والأجهزة الذكية",
    desc: "سلسلة التوحد - الحلقة 19: كيفية تقنين استخدام الشاشات وبدائل الأنشطة التفاعلية الحية.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "65+"
  },
  {
    id: "yt-A6o8ZXv3o1s",
    youtubeId: "A6o8ZXv3o1s",
    title: "الحلقة 18: تدريب الطفل على الاختيار المناسب",
    desc: "سلسلة التوحد - الحلقة 18: استراتيجيات تنمية قدرة الطفل على اتخاذ القرار والتعبير عن رغباته.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "54+"
  },
  {
    id: "yt-RkfJun8usaY",
    youtubeId: "RkfJun8usaY",
    title: "الحلقة 17: الراحة وتنظيم الحواس",
    desc: "سلسلة التوحد - الحلقة 17: أنشطة الاسترخاء الحسي وضبط التوتر العصبي في البيت.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "45+"
  },
  {
    id: "yt-00kgj0CiqDQ",
    youtubeId: "00kgj0CiqDQ",
    title: "الحلقة 16: التعبير السليم عن الغضب",
    desc: "سلسلة التوحد - الحلقة 16: كيفية التعامل مع نوبات الغضب والانهيار الحسي وتفريغ الشحنات بطريقة آمنة.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "72+"
  },
  {
    id: "yt-gHsuX5qg824",
    youtubeId: "gHsuX5qg824",
    title: "الحلقة 15: ترتيب الألعاب والمسؤولية",
    desc: "سلسلة التوحد - الحلقة 15: خطوات مبسطة لغرس مهارة تنظيم المكان وإعادة الألعاب لأماكنها.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "39+"
  },
  {
    id: "yt-PiQ4nFsTRvQ",
    youtubeId: "PiQ4nFsTRvQ",
    title: "الحلقة 14: الانتقال السلس بين نشاطين",
    desc: "سلسلة التوحد - الحلقة 14: التغلب على صعوبة الانتقال من اللعب إلى الدراسة أو النوم باستخدام المؤشرات البصرية.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "48+"
  },
  {
    id: "yt-_bgmIuxCo84",
    youtubeId: "_bgmIuxCo84",
    title: "الحلقة 13: تدريب الطفل على انتظار الدور",
    desc: "سلسلة التوحد - الحلقة 13: مهارة الانتظار والتفاعل الاجتماعي الإيجابي مع الأقران والإخوة.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "52+"
  },
  {
    id: "yt-uFXwp6swZj4",
    youtubeId: "uFXwp6swZj4",
    title: "الحلقة 12: اللعب المنظم والتشاركي",
    desc: "سلسلة التوحد - الحلقة 12: تحويل اللعب النمطي إلى ألعاب تفاعلية مشتركة تطور الذكاء الاجتماعي.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "61+"
  },
  {
    id: "yt-EjFo2SzvFr4",
    youtubeId: "EjFo2SzvFr4",
    title: "الحلقة 11: طلب الحاجة والتواصل الوظيفي",
    desc: "سلسلة التوحد - الحلقة 11: تمكين الطفل من الإشارة أو استخدام الكلمات والصور للتعبير عما يحتاجه.",
    publishedDate: "2026-10-25",
    isDailyFeatured: false,
    views: "77+"
  },
  {
    id: "yt-jDeDlO1dL7c",
    youtubeId: "jDeDlO1dL7c",
    title: "الحلقة 10: الاستعداد للخروج من المنزل",
    desc: "سلسلة التوحد - الحلقة 10: خطوات تحضير الطفل للخرجات دون توتر أو نوبات هلع.",
    publishedDate: "2026-10-22",
    isDailyFeatured: false,
    views: "43+"
  },
  {
    id: "yt-NFVWgtZb7L4",
    youtubeId: "NFVWgtZb7L4",
    title: "الحلقة 09: ارتداء الحذاء والجوارب باستقلالية",
    desc: "سلسلة التوحد - الحلقة 09: تنمية المهارات الحركية الدقيقة واستقلالية ارتداء الملابس.",
    publishedDate: "2026-10-22",
    isDailyFeatured: false,
    views: "56+"
  },
  {
    id: "yt-stHqQ3q2znU",
    youtubeId: "stHqQ3q2znU",
    title: "الحلقة 08: تحضير الحقيبة المدرسية",
    desc: "سلسلة التوحد - الحلقة 08: تدريب الطفل على تجهيز أدواته المدرسية ومتابعة جدوله اليومي.",
    publishedDate: "2026-10-22",
    isDailyFeatured: false,
    views: "38+"
  },
  {
    id: "yt-BBTq2XVSMJA",
    youtubeId: "BBTq2XVSMJA",
    title: "الحلقة 07: تمشيط الشعر والعناية الشخصية",
    desc: "سلسلة التوحد - الحلقة 07: التعامل مع حساسية فروة الرأس وجعل التمشيط تجربة ممتعة ومريحة.",
    publishedDate: "2026-10-22",
    isDailyFeatured: false,
    views: "49+"
  },
  {
    id: "yt-hFHoSM7qLXE",
    youtubeId: "hFHoSM7qLXE",
    title: "الحلقة 06: روتين الفطور الصحي",
    desc: "سلسلة التوحد - الحلقة 06: تنظيم مائدة الإفطار وتشجيع الطفل على تنويع الأغذية الصحية بهدوء.",
    publishedDate: "2026-10-22",
    isDailyFeatured: false,
    views: "64+"
  },
  {
    id: "yt-CSwDq9szfj0",
    youtubeId: "CSwDq9szfj0",
    title: "فيديو تعريفي بجمعية AMSED القنيطرة",
    desc: "الفيديو التعريفي الرسمي: أنشطة، برامج التعليم المكيف، والتأهيل المهني لأطفال الجمعية بالقنيطرة.",
    publishedDate: "2026-09-15",
    isDailyFeatured: false,
    views: "120+"
  }
];

/**
 * Update siteSettings/main in Firestore with official YouTube channel information
 */
export async function syncYouTubeSettingsToFirestore() {
  try {
    if (db) {
      await setDoc(doc(db, "siteSettings", "main"), {
        youtubeChannelId: YOUTUBE_CHANNEL_CONFIG.youtubeChannelId,
        youtubeHandle: YOUTUBE_CHANNEL_CONFIG.youtubeHandle,
        youtubeUrl: YOUTUBE_CHANNEL_CONFIG.youtubeUrl
      }, { merge: true });
    }
  } catch (e) {
    console.warn("Could not sync youtube channel to Firestore:", e);
  }
}

/**
 * Fetch all videos from YouTube Channel automatically in real-time
 * 1. Tries internal server API (/api/youtube-sync) with zero CORS issues
 * 2. Caches in localStorage for ultra-fast instant rendering
 * 3. Falls back to OFFICIAL_CHANNEL_VIDEOS if completely offline
 */
export async function fetchAllChannelVideos(channelId = "UCBPlqmKVq9KvzXMEmp5dDPQ") {
  syncYouTubeSettingsToFirestore();

  // 1. Try our internal serverless API (bypasses CORS completely and reaches YouTube directly)
  try {
    const apiRes = await fetch(`/api/youtube-sync?channelId=${channelId}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && Array.isArray(data.videos) && data.videos.length > 0) {
        try {
          localStorage.setItem('amsed_cached_youtube_videos', JSON.stringify(data.videos));
        } catch (e) {}
        return data.videos;
      }
    }
  } catch (apiErr) {
    console.warn("YouTube API internal sync notice:", apiErr);
  }

  // 2. Check local cached videos from previous successful sync
  try {
    const cached = localStorage.getItem('amsed_cached_youtube_videos');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Fallback to official dataset of 16 verified videos
  return OFFICIAL_CHANNEL_VIDEOS;
}

export default {
  YOUTUBE_CHANNEL_CONFIG,
  OFFICIAL_CHANNEL_VIDEOS,
  fetchAllChannelVideos,
  syncYouTubeSettingsToFirestore
};
