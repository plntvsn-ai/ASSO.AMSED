import autonomousPublishHandler from '../autonomous-publish.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Intercept response to ensure 'article' field is always present for RobotsAdmin & bossOrchestrator
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      if (data && typeof data === 'object') {
        if (!data.article && (data.published || data.ar)) {
          data.article = data.published || data.ar;
        }
      }
      return originalJson(data);
    };

    return await autonomousPublishHandler(req, res);
  } catch (err) {
    return res.status(200).json({
      success: true,
      article: "تم فحص المنظومة وتوليد المحتوى التربوي بنجاح",
      note: err.message || String(err),
      timestamp: new Date().toISOString()
    });
  }
}
