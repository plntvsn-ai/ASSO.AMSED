'use client'
import {useEffect, useState} from 'react'

export default function SettingsPage(){
  const [s,setS]=useState<any>({address_ar:'', phone:'', show_donation:false, show_bank:false})
  const [saved,setSaved]=useState(false)

  useEffect(()=>{ 
    try {
      const cached = localStorage.getItem('site_settings')
      if (cached) setS(JSON.parse(cached))
    } catch {}

    fetch('/api/settings')
      .then(r=>r.json())
      .then(d => {
        if (d && typeof d === 'object') {
          setS((prev: any) => ({ ...prev, ...d }))
          try { localStorage.setItem('site_settings', JSON.stringify(d)) } catch {}
        }
      })
      .catch(() => {})
  },[])

  const save = async ()=>{
    try { localStorage.setItem('site_settings', JSON.stringify(s)) } catch {}
    try {
      await fetch('/api/settings',{method:'POST', body:JSON.stringify(s), headers:{'Content-Type':'application/json'}})
    } catch (e) {
      console.warn(e)
    }
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6" dir="rtl">
      <h1 className="text-2xl font-black">⚙️ إعدادات الموقع</h1>
      
      <div className="bg-white p-5 rounded-xl border space-y-4">
        <label className="block font-bold">📍 العنوان (يظهر فالأسفل فقط)</label>
        <input value={s.address_ar || ''} onChange={e=>setS({...s,address_ar:e.target.value})} 
          className="w-full border p-3 rounded-lg" placeholder="SAKNIA 30 LOT EL HIZAM..." />
        
        <label className="block font-bold mt-4">📞 رقم الهاتف</label>
        <input value={s.phone || ''} dir="ltr" onChange={e=>setS({...s,phone:e.target.value})} 
          className="w-full border p-3 rounded-lg" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
            <input type="checkbox" checked={!s.show_donation} onChange={e=>setS({...s,show_donation:!e.target.checked})} className="w-5 h-5" />
            <span className="font-bold">{s.show_donation ? '✅ التبرعات ظاهرة' : '🚫 إخفاء التبرعات'}</span>
          </label>
          <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
            <input type="checkbox" checked={!s.show_bank} onChange={e=>setS({...s,show_bank:!e.target.checked})} className="w-5 h-5" />
            <span className="font-bold">{s.show_bank ? '✅ الحساب البنكي ظاهر' : '🚫 إخفاء الحساب البنكي'}</span>
          </label>
        </div>

        <button onClick={save} className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-black mt-6 transition shadow">
          حفظ التعديلات
        </button>
        {saved && <p className="text-green-600 text-center font-bold">✅ تم الحفظ - الموقع تجدد تلقائيا</p>}
      </div>

      <p className="text-sm text-gray-500">ملي تخفيهم من هنا - غادي يختفيو مباشرة من asso-amsed.vercel.app بلا ما تمسح الكود</p>
    </div>
  )
}
