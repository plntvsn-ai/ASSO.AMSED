export default async function handler(req, res) {
  return res.status(200).json({
    success: true,
    boss: 'checking all robots',
    timestamp: new Date().toISOString()
  });
}
