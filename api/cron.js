import autonomousPublishHandler from './autonomous-publish.js';

export default async function handler(req, res) {
  try {
    return await autonomousPublishHandler(req, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || String(err),
      time: new Date().toISOString()
    });
  }
}
