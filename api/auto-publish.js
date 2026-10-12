import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();
    console.log("API KEY FOUND:", apiKey ? apiKey.substring(0, 15) + "..." : "AUCUNE");

    if (!apiKey || !apiKey.startsWith("AIza")) {
      return res.status(500).json({ error: "Invalid API key - GEMINI_API_KEY manquante dans Vercel", hasKey: !!apiKey });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "اكتب مقال قصير 300 كلمة عن صحة الطفل في المناطق الهشة";

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ success: true, article: text });
  } catch (e) {
    console.error("GEMINI ERROR:", e.message);
    return res.status(500).json({ error: "Gemini Error: " + e.message });
  }
}
