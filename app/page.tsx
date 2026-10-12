import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AMSED | جمعية المبادرة المغربية - القنيطرة',
  description: 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة - SAKNIA 30 LOT EL HIZAM N° D Kénitra',
}

export default function Home() {
  const services = [
    { t: "تنمية المهارات الحركية", f: "Psychomotricité", img: "/products/01_psychomotricite.jpg" },
    { t: "مركز أطفال التوحد TSA & ABA", f: "Centre TSA & ABA", img: "/products/02_tsa_aba.jpg" },
    { t: "التخاطب Orthophonie", f: "Orthophonie", img: "/products/03_orthophonie.jpg" },
    { t: "الإرشاد النفسي", f: "Soutien Psychologique", img: "/products/04_soutien_psy.jpg" },
    { t: "تنمية المهارات الدقيقة", f: "Motricité Fine", img: "/products/05_psy_fine.jpg" },
    { t: "التأهيل للدمج المدرسي", f: "Intégration Scolaire", img: "/products/06_integration.jpg" },
    { t: "روض الأطفال Crèche", f: "Crèche Spécialisée", img: "/products/07_creche.jpg" },
    { t: "المهارات الاجتماعية", f: "Habiletés Sociales", img: "/products/08_habiletes.jpg" },
  ];

  return (
    <main style={{fontFamily:'Segoe UI, Tahoma', background:'#fff', color:'#222'}} dir="rtl">
      <header style={{background:'#0a4a3a', color:'white', padding:'25px 15px', textAlign:'center'}}>
        <h1 style={{fontSize:'22px', margin:0}}>جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة</h1>
        <h2 style={{fontSize:'15px', fontWeight:400, opacity:0.9, margin:'8px 0'}}>AMSED</h2>
        <div style={{background:'rgba(255,255,255,0.15)', display:'inline-block', padding:'5px 15px', borderRadius:'20px', fontSize:'12px', marginTop:'10px'}}>
          الإيداع القانوني: 376.58.1 | SAKNIA 30 LOT EL HIZAM N° D Kénitra
        </div>
        <div style={{marginTop:'20px'}}>
          <img src="/logo-amsed.png" alt="AMSED" style={{height:'90px', background:'white', borderRadius:'15px', padding:'8px'}} />
        </div>
        <div style={{marginTop:'20px', maxWidth:'700px', margin:'20px auto 0'}}>
          <div style={{position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:'20px', overflow:'hidden', background:'#000'}}>
            <iframe
              src="https://www.youtube-nocookie.com/embed/CSwDq9szfj0?autoplay=0&controls=1&rel=0"
              title="AMSED Official Video"
              style={{width:'100%', height:'100%', border:0}}
              allowFullScreen
            />
          </div>
        </div>
        {/* زر صغير فقط - بلا تبرع */}
        <div style={{marginTop:'25px'}}>
          <a href="tel:0654240523" style={{background:'white', color:'#0a4a3a', padding:'10px 25px', borderRadius:'50px', textDecoration:'none', fontWeight:'bold', fontSize:'14px', display:'inline-block'}}>
            📞 اتصلوا بنا - <span dir="ltr" className="inline-block" style={{unicodeBidi: 'isolate'}}>06 54 24 05 23</span>
          </a>
          <p style={{fontSize:'11px', marginTop:'8px', opacity:0.7}}>Lundi 9h - SAKNIA 30</p>
        </div>
      </header>

      <section style={{padding:'35px 15px', maxWidth:'1200px', margin:'0 auto'}}>
        <h2 style={{textAlign:'center', fontSize:'28px', color:'#0a4a3a'}}>خدماتنا المتخصصة</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'22px', marginTop:'30px'}}>
          {services.map((s,i) => (
            <div key={i} style={{border:'1px solid #e0e0e0', borderRadius:'22px', overflow:'hidden', boxShadow:'0 4px 10px rgba(0,0,0,0.06)'}}>
              <img src={s.img} alt={s.t} style={{width:'100%', height:'320px', objectFit:'cover'}} />
              <div style={{padding:'16px', textAlign:'center'}}>
                <h3 style={{margin:'0 0 5px', fontSize:'16px', fontWeight:'bold'}}>{s.t}</h3>
                <small style={{color:'#0a4a3a', fontWeight:600}}>{s.f}</small>
                <div style={{marginTop:'10px'}}>
                  <span style={{background:'#e8f5e9', color:'#2e7d32', padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'bold'}}>✓ Disponible</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{background:'#f6f8f6', padding:'30px 15px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <h2 style={{textAlign:'center', color:'#0a4a3a'}}>📍 زورونا</h2>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.3352707977733!2d-6.542888223788758!3d34.250668007226096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7598d933e7443%3A0xf8e9c56f2cb95186!2z2KzZhdi52YrYqSDYp9mE2YXYqNin2K_YsdipINin2YTZhdi62LHYqNmK2Kkg2YTZhNiq2YPYp9mB2YQg2YjYp9mE2KrYudin2YjZhiDZhNix2LnYp9mK2Kkg2KfZhNij2LfZgdin2YQg2YHZiiDZiNi22LnZitipINi12LnYqNip!5e1!3m2!1sen!2sma!4v1791728796328!5m2!1sen!2sma" 
            width="100%" 
            height="450" 
            style={{border:0, borderRadius:'20px'}} 
            allowFullScreen 
            loading="lazy" 
          />
        </div>
      </section>

      <footer style={{background:'#0a4a3a', color:'white', padding:'25px 15px', textAlign:'center', fontSize:'13px'}}>
        <p>© 2026 AMSED | الإيداع القانوني 376.58.1 | SAKNIA 30 LOT EL HIZAM N° D, Kénitra</p>
      </footer>
    </main>
  )
}
