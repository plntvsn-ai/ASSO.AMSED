import { createClient } from "@supabase/supabase-js";

const DEFAULT_SETTINGS = {
  id: 1,
  association_full_name: "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة",
  association_short_name: "AMSED",
  site_title: "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED",
  association_subtitle: "لرعاية أطفال التوحد وفي وضعية صعبة • القنيطرة",
  association_name_style: "andalusian",
  address: "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA",
  city: "Kenitra",
  email: "asso.amsed@gmail.com",
  phone1: "06 54 24 05 23",
  phone2: "06 63 78 01 07",
  phone3: "",
  working_hours: "الإثنين - الجمعة: 08:30 إلى 17:00 | السبت: 09:00 إلى 13:00",
  lat: "34.250676",
  lng: "-6.540316",
  top_bar_title: "مصلحة عمومية وطنية ذات أهداف إنسانية وتضامنية",
  show_donations: false,
  show_bank: false,
  show_stats: true
};

function getSupabaseClient() {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""
  ).trim().replace(/\/+$/, "");

  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  ).trim();

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("xyzcompany") && !supabaseUrl.includes("placeholder")) {
    return createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      db: { schema: "public" }
    });
  }
  return null;
}

let inMemorySettings = null;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const supabase = getSupabaseClient();

  // GET: Fetch settings
  if (req.method === "GET") {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();

        if (!error && data) {
          inMemorySettings = { ...DEFAULT_SETTINGS, ...data, _user_saved: true };
          return res.status(200).json({
            success: true,
            source: "supabase",
            data: inMemorySettings
          });
        }
      }

      if (inMemorySettings) {
        return res.status(200).json({
          success: true,
          source: "memory",
          data: inMemorySettings
        });
      }

      return res.status(200).json({
        success: true,
        source: "default",
        data: DEFAULT_SETTINGS
      });
    } catch (err) {
      if (inMemorySettings) {
        return res.status(200).json({
          success: true,
          source: "memory",
          data: inMemorySettings
        });
      }
      return res.status(200).json({
        success: true,
        source: "fallback",
        warning: err.message,
        data: DEFAULT_SETTINGS
      });
    }
  }

  // POST: Save settings
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }
      body = body || {};

      // Exclude id and created_at to avoid PGRST125
      const { id, created_at, ...dataToSave } = body;
      dataToSave.updated_at = new Date().toISOString();
      dataToSave._user_saved = true;

      inMemorySettings = { ...DEFAULT_SETTINGS, ...dataToSave };

      let synced = false;
      let warning = null;

      if (supabase) {
        try {
          const { error } = await supabase
            .from("site_settings")
            .upsert({ id: 1, ...dataToSave });

          if (error) {
            console.warn("Supabase server-side upsert warning:", error);
            warning = error.message;
          } else {
            synced = true;
          }
        } catch (dbErr) {
          console.warn("Supabase server-side upsert exception:", dbErr);
          warning = dbErr.message;
        }
      } else {
        warning = "Supabase credentials not configured in Vercel environment";
      }

      return res.status(200).json({
        success: true,
        synced,
        warning,
        message: synced
          ? "تم الحفظ بنجاح في Supabase وقاعدة البيانات"
          : "تم الحفظ بنجاح في الخادم والمتصفح",
        data: inMemorySettings
      });
    } catch (err) {
      console.error("api/settings handler error:", err);
      return res.status(200).json({
        success: true,
        synced: false,
        warning: err.message,
        message: "تم الحفظ محلياً"
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
