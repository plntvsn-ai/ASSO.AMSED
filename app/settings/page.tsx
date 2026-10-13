'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
        if (error) console.log("Fetching settings error:", error);
        if (data) {
          setForm((prev: any) => ({
            ...prev,
            ...data,
            association_short_name: data.association_short_name || data.association_short || prev.association_short_name
          }));
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
      // مهم بزاف: كنحيدو id باش ما يتصيفطش فـ update - هادا هو سبب PGRST125
      const { id, created_at, ...dataToSave } = form;
      dataToSave.updated_at = new Date().toISOString();

      console.log("Updating Supabase site_settings id=1:", dataToSave);

      const { error } = await supabase
        .from("site_settings")
        .update(dataToSave)
        .eq("id", 1);

      if (error) throw error;

      alert("تم الحفظ بنجاح ✅");
    } catch (err: any) {
      console.error("Supabase save error:", err);
      alert(`خطأ في الحفظ: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", fontSize: 18 }} dir="rtl">جاري التحميل...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }} dir="rtl">
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>الإعدادات الأساسية (site_settings)</h2>

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
        {saving ? "جاري الحفظ في Supabase..." : "حفظ الإعدادات"}
      </button>
    </div>
  );
}

export const SettingsPage = Settings;
