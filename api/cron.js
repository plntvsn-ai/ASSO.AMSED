export default async function handler(req, res) {
  return res.json({
    success: true,
    autonomous: true,
    message: 'AMSED Autism robot ready for cron-job.org',
    time: new Date().toISOString()
  });
}
