/**
 * YouTube Real-Time Channel Sync API
 * يجلب كافة فيديوهات قناة جمعية AMSED مباشرة وبدون حظر CORS
 * https://youtube.com/@association-amesd (Channel ID: UCBPlqmKVq9KvzXMEmp5dDPQ)
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const channelId = req.query.channelId || "UCBPlqmKVq9KvzXMEmp5dDPQ";
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });

    if (!response.ok) {
      throw new Error(`YouTube RSS returned status ${response.status}`);
    }

    const xmlText = await response.text();
    if (!xmlText || !xmlText.includes('<entry>')) {
      throw new Error("Invalid or empty RSS feed from YouTube");
    }

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    const parsedVideos = [];

    while ((match = entryRegex.exec(xmlText)) !== null) {
      const content = match[1];
      const videoId = (
        content.match(/<yt:videoId>(.*?)<\/yt:videoId>/) ||
        content.match(/<id>yt:video:(.*?)<\/id>/)
      )?.[1]?.trim() || "";

      const title = content.match(/<title>(.*?)<\/title>/)?.[1]?.trim() || "";
      const published = content.match(/<published>(.*?)<\/published>/)?.[1]?.split("T")[0] || new Date().toISOString().split("T")[0];
      const descMatch = content.match(/<media:description>([\s\S]*?)<\/media:description>/);
      const desc = descMatch ? descMatch[1].trim() : "فيديو توعوي وتأهيلي رسمي من إنتاج جمعية AMSED بالقنيطرة.";
      
      const viewsMatch = content.match(/views="(\d+)"/);
      const views = viewsMatch ? `${viewsMatch[1]}` : "25+";

      if (videoId) {
        parsedVideos.push({
          id: `yt-${videoId}`,
          youtubeId: videoId,
          title: title || `فيديو ${parsedVideos.length + 1}`,
          desc,
          publishedDate: published,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          thumbnail_hq: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          isDailyFeatured: videoId === "CSwDq9szfj0",
          url: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
          views: views
        });
      }
    }

    if (parsedVideos.length > 0) {
      return res.status(200).json({
        success: true,
        source: "youtube_live_rss",
        channelId,
        count: parsedVideos.length,
        videos: parsedVideos,
        syncedAt: new Date().toISOString()
      });
    }

    throw new Error("No video entries parsed from XML feed");
  } catch (err) {
    console.warn("YouTube live RSS sync warning:", err.message);
    
    // Return fallback with 200 so the frontend always has working videos
    return res.status(200).json({
      success: false,
      source: "fallback",
      error: err.message,
      videos: [
        {
          id: "yt-nz-B1nPZjbo",
          youtubeId: "nz-B1nPZjbo",
          title: "جديد جمعية AMSED - أنشطة أطفال التوحد",
          desc: "أنشطة الجمعية بالقنيطرة ومواكبة أطفال التوحد",
          publishedDate: "2026-10-15",
          thumbnail: "https://i.ytimg.com/vi/nz-B1nPZjbo/hqdefault.jpg",
          isDailyFeatured: false
        },
        {
          id: "yt-CSwDq9szfj0",
          youtubeId: "CSwDq9szfj0",
          title: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
          desc: "الفيديو التعريفي الرسمي: أنشطة، برامج التعليم المكيف، والتأهيل المهني لأطفال الجمعية بالقنيطرة.",
          publishedDate: "2026-09-15",
          thumbnail: "https://i.ytimg.com/vi/CSwDq9szfj0/hqdefault.jpg",
          isDailyFeatured: true
        }
      ]
    });
  }
}
