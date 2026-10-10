import { useState, useEffect } from "react";
export default function Logo({size=56}){
  const [url,setUrl]=useState("/logo.png");
  useEffect(()=>{
    (async()=>{
      try{
        const {doc,getDoc}=await import("firebase/firestore");
        const {db}=await import("../firebase");
        const s=await getDoc(doc(db,"siteSettings","main"));
        if(s.exists()&&s.data().logoUrl) setUrl(s.data().logoUrl);
      }catch(e){}
    })();
  },[]);
  return (
    <div style={{background:"transparent",display:"inline-block",lineHeight:0,padding:0,margin:0}}>
      <img src={url} alt="AMSED" width={size} height={size} style={{background:"transparent",display:"block",objectFit:"contain"}} className="logo-transparent" />
    </div>
  );
}
