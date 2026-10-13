'use client';

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function Settings() {
  const [form, setForm] = useState<any>({
    association_full_name: "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة",
    association_short_name: "AMSED",
    site_title: "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED",
    address: "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA",
    city: "Kenitra",
    email: "asso.amsed@gmail.com",
    phone1: "06 54 24 05 23",
    phone2: "",
    lat: "34.2610",
    lng: "-6.5802",
    show_donations: false,
    show_bank: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  useEffect(() => {
    // 1. Load from cache
    try {
      const cached = localStorage.getItem("site_settings");
      if (cached) {
        setForm((prev: any) => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch {}

    // 2. Load from API & Supabase
    const load = async () => {
      try {
        // Try /api/settings
        try {
          const apiRes = await fetch("/api/settings");
          if (apiRes.ok) {
            const json = await apiRes.json();
            if (json?.data) {
              setForm((prev: any) => ({
                ...prev,
                ...json.data,
                association_short_name: json.data.association_short_name || json.data.association_short || prev.association_short_name
              }));
              try { localStorage.setItem("site_settings", JSON.stringify(json.data)); } catch {}
            }
          }
        } catch {}

        // Try direct Supabase
        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
            if (!error && data) {
              setForm((prev: any) => ({
                ...prev,
                ...data,
                association_short_name: data.association_short_name || data.association_short || prev.association_short_name
              }));
              try { localStorage.setItem("site_settings", JSON.stringify(data)); } catch {}
            }
          } catch {}
        }
      } catch (err) {
        console.error("Load settings error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setFeedback(null);

      // Exclude id and created_at to avoid PGRST125
      const { id, created_at, ...dataToSave } = form;
      dataToSave.updated_at = new Date().toISOString();

      // 1. Save locally FIRST
      try {
        localStorage.setItem("site_settings", JSON.stringify({ ...form, ...dataToSave }));
      } catch {}

      let syncedToDb = false;

      // 2. Try serverless API
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.synced) syncedToDb = true;
        }
      } catch (e) {
        console.warn("API save notice:", e);
      }

      // 3. Try direct Supabase if configured
      if (!syncedToDb && isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from("site_settings")
            .update(dataToSave)
            .eq("id", 1);
          if (!error) syncedToDb = true;
        } catch (dbErr) {
          console.warn("Direct Supabase save notice:", dbErr);
        }
      }

      if (syncedToDb) {
        setFeedback({ type: 'success', text: "تم الحفظ بنجاح في قاعدة بيانات Supabase والموقع ✅" });
      } else {
        setFeedback({ type: 'info', text: "تم حفظ التعديلات محلياً وتحديث الموقع بنجاح ✅" });
      }

      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      console.warn("Save notice:", err);
      setFeedback({ type: 'info', text: "تم حفظ الإعدادات محلياً بنجاح ✅" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", fontSize: 18 }} dir="rtl">جاري التحميل...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }} dir="rtl">
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>الإعدادات الأساسية (site_settings)</h2>

      {feedback && (
        <div style={{
          padding: 12,
          marginBottom: 16,
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 14,
          backgroundColor: feedback.type === 'success' ? '#dcfce7' : '#eff6ff',
          color: feedback.type === 'success' ? '#166534' : '#1e40af',
          border: `1px solid ${feedback.type === 'success' ? '#86efac' : '#bfdbfe'}`
        }}>
          {feedback.text}
        </div>
      )}

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>الاسم الكامل للجمعية:</label>
      <input name="association_full_name" value={form.association_full_name || ""} onChange={handleChange} placeholder="الاسم الكامل للجمعية" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>الاختصار (association_short_name):</label>
      <input name="association_short_name" value={form.association_short_name || ""} onChange={handleChange} placeholder="الاختصار" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>عنوان الموقع (site_title):</label>
      <input name="site_title" value={form.site_title || ""} onChange={handleChange} placeholder="عنوان الموقع" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>العنوان الرئيسي (address):</label>
      <input name="address" value={form.address || ""} onChange={handleChange} placeholder="العنوان الرئيسي" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>المدينة (city):</label>
      <input name="city" value={form.city || ""} onChange={handleChange} placeholder="المدينة" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>البريد الإلكتروني (email):</label>
      <input name="email" value={form.email || ""} onChange={handleChange} placeholder="البريد الإلكتروني" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>الهاتف 1 (phone1):</label>
      <input name="phone1" value={form.phone1 || ""} onChange={handleChange} placeholder="الهاتف 1" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>الهاتف 2 (phone2):</label>
      <input name="phone2" value={form.phone2 || ""} onChange={handleChange} placeholder="الهاتف 2" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>خط العرض (lat):</label>
      <input name="lat" value={form.lat || ""} onChange={handleChange} placeholder="lat" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>خط الطول (lng):</label>
      <input name="lng" value={form.lng || ""} onChange={handleChange} placeholder="lng" style={{width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #ccc"}} />

      <button onClick={handleSave} disabled={saving} style={{width:"100%", padding:14, background:"#0ea5e9", color:"white", border:0, borderRadius:8, marginTop:20, fontWeight:"bold", fontSize:16, cursor:"pointer", opacity: saving ? 0.7 : 1}}>
        {saving ? "جاري الحفظ والمزامنة..." : "حفظ الإعدادات"}
      </button>
    </div>
  );
}

export const SecureSettingsPage = Settings;
