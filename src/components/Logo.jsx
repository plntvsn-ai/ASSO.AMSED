import { useState, useEffect } from "react";

export default function Logo({ size = 68, className = "" }) {
  const getInitialLogo = () => {
    try {
      const siteSettings = localStorage.getItem('site_settings');
      if (siteSettings) {
        const parsed = JSON.parse(siteSettings);
        if (parsed.logo_url || parsed.logoUrl) return parsed.logo_url || parsed.logoUrl;
      }
      const rawCms = localStorage.getItem('amsed_cms_database_v3');
      if (rawCms) {
        const cms = JSON.parse(rawCms);
        if (cms?.logo?.url) return cms.logo.url;
      }
    } catch (e) {}
    return "/logo_amesd_original_transparent.png";
  };

  const [url, setUrl] = useState(getInitialLogo);

  useEffect(() => {
    const handleUpdate = () => {
      setUrl(getInitialLogo());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cms-update', handleUpdate);

    // Sync with Firestore if present
    (async () => {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        if (db) {
          const s = await getDoc(doc(db, "siteSettings", "main"));
          if (s.exists() && s.data().logoUrl) {
            // Only use if not an old deprecated image
            const firestoreUrl = s.data().logoUrl;
            if (firestoreUrl && !firestoreUrl.includes('photo-1488521787991')) {
              setUrl(firestoreUrl);
            }
          }
        }
      } catch (e) {}
    })();

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cms-update', handleUpdate);
    };
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
        margin: 0
      }}
      className={className}
    >
      <img
        src={url || "/logo_amesd_original_transparent.png"}
        alt="AMSED Logo"
        width={size}
        height={size}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/logo_amesd_original_transparent.png";
        }}
        style={{
          background: "transparent",
          backgroundColor: "transparent",
          display: "block",
          objectFit: "contain",
          border: "none",
          borderRadius: 0,
          clipPath: "none",
          boxShadow: "none"
        }}
        className="select-none drop-shadow-md hover:scale-105 transition-transform"
      />
    </div>
  );
}
