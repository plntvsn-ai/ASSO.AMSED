export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    published: "طرق تأهيل أطفال التوحد وتنمية مهارات النطق والتواصل",
    ar: "طرق تأهيل أطفال التوحد وتنمية مهارات النطق والتواصل",
    fr: "Méthodes de rééducation pour enfants autistes",
    en: "Rehabilitation methods for autistic children",
    ai: true,
    timestamp: new Date().toISOString()
  });
}
