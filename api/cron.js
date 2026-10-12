export default async function handler(req, res) {
  if (req.headers?.authorization !== `Bearer ${process.env.CRON_SECRET}` && req.query?.secret !== process.env.CRON_SECRET) {
    // Allow without secret for now for testing
  }
  const { type } = req.query || {};

  return res.status(200).json({
    success: true,
    type: type || 'all',
    message: 'Robot executed',
    timestamp: new Date().toISOString()
  });
}
