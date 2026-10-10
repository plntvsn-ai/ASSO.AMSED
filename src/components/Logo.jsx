import { useState, useEffect } from "react";

export default function Logo({ size = 56, className = "" }) {
  const [url, setUrl] = useState("/logo.png");
  useEffect(() => {
    (async () => {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        const s = await getDoc(doc(db, "siteSettings", "main"));
        if (s.exists() && s.data().logoUrl) setUrl(s.data().logoUrl);
      } catch (e) {}
    })();
  }, []);

  return (
    <div
      style={{
        background: "transparent",
        backgroundColor: "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 0,
        padding: 0,
        margin: 0,
        borderRadius: "9999px",
        overflow: "hidden"
      }}
      className={className}
    >
      <img
        src={url}
        alt="AMSED"
        width={size}
        height={size}
        style={{
          background: "transparent",
          backgroundColor: "transparent",
          display: "block",
          objectFit: "contain",
          borderRadius: "9999px",
          clipPath: "circle(50%)",
          border: "none",
          boxShadow: "none"
        }}
        className="logo-transparent rounded-full"
      />
    </div>
  );
}

