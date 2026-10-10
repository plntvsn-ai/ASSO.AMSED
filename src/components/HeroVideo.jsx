export default function HeroVideo(){
  return (
    <section style={{width:"100%",height:"75vh",position:"relative",overflow:"hidden",borderRadius:"16px",margin:"20px auto",maxWidth:"1200px",background:"#000"}}>
      <iframe
        src="https://www.youtube-nocookie.com/embed/CSwDq9szfj0?autoplay=1&mute=1&loop=1&playlist=CSwDq9szfj0&controls=1&modestbranding=1&rel=0"
        style={{width:"100%",height:"100%",border:0}}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="AMSED Video">
      </iframe>
      <div style={{position:"absolute",bottom:20,left:20,right:20,color:"white",background:"rgba(0,0,0,0.45)",padding:"16px",borderRadius:"12px"}}>
        <h2 style={{margin:0,fontSize:"22px"}}>جمعية AMSED لرعاية أطفال التوحد</h2>
        <p style={{margin:"5px 0 0"}}>معا نصنع الفرق - الحب والصبر يصنعان المعجزات</p>
      </div>
    </section>
  );
}
