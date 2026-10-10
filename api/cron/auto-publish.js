// Vercel Serverless Cron Handler
export default async function handler(req, res) {
  try {
    // 1. Fetch random topic or query Wikipedia
    const searchUrl = `https://ar.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent('صحة الطفل')}&limit=3&format=json&origin=*`;
    const wikiRes = await fetch(searchUrl);
    const wikiData = await wikiRes.json();

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Autonomous Publisher cron triggered successfully",
      sampleWikiMatch: wikiData?.[1] || []
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
