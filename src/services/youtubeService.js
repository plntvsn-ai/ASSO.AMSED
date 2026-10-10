import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const YOUTUBE_CHANNEL_CONFIG = {
  youtubeChannelId: "UCBPlqmKVq9KvzXMEmp5dDPQ",
  youtubeHandle: "@association-amesd",
  youtubeUrl: "https://youtube.com/@association-amesd"
};

export const OFFICIAL_CHANNEL_VIDEOS = [
  {
    id: "yt-CSwDq9szfj0",
    youtubeId: "CSwDq9szfj0",
    title: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
    desc: "الفيديو التعريفي الرسمي: أنشطة، برامج التعليم المكيف، والتأهيل المهني لأطفال الجمعية بالقنيطرة.",
    publishedDate: "2026-09-15",
    isDailyFeatured: true,
    views: "50+"
  },
  {
    id: "yt-1LD18Si_cMA",
    youtubeId: "1LD18Si_cMA",
    title: "الحلقة07 مستويات الدعم",
    desc: "سلسلة التوحد - الحلقة السابعة: التعرف على مختلف مستويات الدعم والمواكبة الفردية لطفل التوحد.",
    publishedDate: "2026-09-20",
    isDailyFeatured: false,
    views: "10+"
  },
  {
    id: "yt-MrGwiabWbXk",
    youtubeId: "MrGwiabWbXk",
    title: "الحلقة06 الأنواع النادرة",
    desc: "سلسلة التوحد - الحلقة السادسة: تسليط الضوء على الأنواع النادرة وطرق التدخل المبكر.",
    publishedDate: "2026-09-20",
    isDailyFeatured: false,
    views: "12+"
  },
  {
    id: "yt-k_UcFCFTD6g",
    youtubeId: "k_UcFCFTD6g",
    title: "الحلقة05 التوحد غير النمطي",
    desc: "سلسلة التوحد - الحلقة الخامسة: فهم التوحد غير النمطي والخصائص السلوكية المصاحبة له.",
    publishedDate: "2026-09-20",
    isDailyFeatured: false,
    views: "9+"
  },
  {
    id: "yt-BRqcX95FrIc",
    youtubeId: "BRqcX95FrIc",
    title: "الحلقة04 متلازمة أسبرجر",
    desc: "سلسلة التوحد - الحلقة الرابعة: متلازمة أسبرجر، المميزات المعرفية وطرق تنمية المهارات الاجتماعية.",
    publishedDate: "2026-09-20",
    isDailyFeatured: false,
    views: "32+"
  },
  {
    id: "yt-KX7O6au_vac",
    youtubeId: "KX7O6au_vac",
    title: "الحلقة03 التوحد الكلاسيكي",
    desc: "سلسلة التوحد - الحلقة الثالثة: التوحد الكلاسيكي وسبل تيسير التواصل اللغوي والجسدي.",
    publishedDate: "2026-09-20",
    isDailyFeatured: false,
    views: "57+"
  },
  {
    id: "yt-ZBrEN8Ks2nw",
    youtubeId: "ZBrEN8Ks2nw",
    title: "الحلقة02 أنواع التوحد",
    desc: "سلسلة التوحد - الحلقة الثانية: استعراض شامل لمختلف طيف التوحد والفروق الفردية بين الأطفال.",
    publishedDate: "2026-09-20",
    isDailyFeatured: false,
    views: "14+"
  },
  {
    id: "yt-gYssnHgr5Wg",
    youtubeId: "gYssnHgr5Wg",
    title: "الحلقة01 تعريف التوحد",
    desc: "سلسلة التوحد - الحلقة الأولى: المدخل العام لتعريف اضطراب طيف التوحد والمفاهيم الأساسية للأسر.",
    publishedDate: "2026-09-20",
    isDailyFeatured: false,
    views: "8+"
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
 * Fetch all videos from YouTube Channel automatically via RSS / XML feed
 * Falls back to OFFICIAL_CHANNEL_VIDEOS if offline or blocked.
 */
export async function fetchAllChannelVideos(channelId = "UCBPlqmKVq9KvzXMEmp5dDPQ") {
  // Sync settings to Firestore whenever videos are synced
  syncYouTubeSettingsToFirestore();

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const proxyEndpoints = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`,
    feedUrl
  ];

  for (const endpoint of proxyEndpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) continue;
      
      const xmlText = await response.text();
      if (!xmlText || !xmlText.includes("<entry>")) continue;

      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
      let match;
      const parsed = [];
      
      while ((match = entryRegex.exec(xmlText)) !== null) {
        const content = match[1];
        const videoId = (content.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || content.match(/<id>yt:video:(.*?)<\/id>/))?.[1]?.trim() || "";
        const title = content.match(/<title>(.*?)<\/title>/)?.[1]?.trim() || "";
        const published = content.match(/<published>(.*?)<\/published>/)?.[1]?.split("T")[0] || new Date().toISOString().split("T")[0];
        const descMatch = content.match(/<media:description>([\s\S]*?)<\/media:description>/);
        const desc = descMatch ? descMatch[1].trim() : "فيديو توعوي وتأهيلي من إنتاج جمعية AMSED بالقنيطرة.";
        const viewsMatch = content.match(/views="(\d+)"/);
        const views = viewsMatch ? viewsMatch[1] : "10+";

        if (videoId) {
          parsed.push({
            id: `yt-${videoId}`,
            youtubeId: videoId,
            title: title || `فيديو ${parsed.length + 1}`,
            desc,
            publishedDate: published,
            isDailyFeatured: videoId === "CSwDq9szfj0",
            views: views
          });
        }
      }

      if (parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      // Try next endpoint
    }
  }

  // Fallback to official dataset of the 8 channel videos
  return OFFICIAL_CHANNEL_VIDEOS;
}

