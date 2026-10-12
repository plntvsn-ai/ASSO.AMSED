import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();
    console.log("API KEY FOUND:", apiKey ? apiKey.substring(0, 15) + "..." : "AUCUNE");
    
    if (!apiKey || !apiKey.startsWith("AIza")) {
      return NextResponse.json({ error: "Invalid API key - GEMINI_API_KEY manquante dans Vercel", hasKey: !!apiKey }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "اكتب مقال قصير 300 كلمة عن صحة الطفل في المناطق الهشة";

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ success: true, article: text });

  } catch (e: any) {
    console.error("GEMINI ERROR:", e.message);
    return NextResponse.json({ error: "Gemini Error: " + e.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
