import React, { useEffect } from 'react';

export default function HeadSeo() {
  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      fetch('/api/advanced-settings').then(r => r.json()).catch(() => ({}))
    ]).then(([siteSettings, advSettings]) => {
      const settings = { ...siteSettings, ...advSettings };

      const title = settings.seo_title || settings.site_title || settings.association_name;
      if (title) {
        document.title = title;
      }

      const description = settings.seo_description || settings.site_description;
      const setMeta = (attr, name, content) => {
        if (!content) return;
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      setMeta('name', 'description', description);
      setMeta('name', 'keywords', settings.seo_keywords);

      setMeta('property', 'og:title', title);
      setMeta('property', 'og:description', description);
      setMeta('property', 'og:image', settings.og_image || '/logo.jpg');
      setMeta('property', 'og:type', 'website');
      setMeta('property', 'og:locale', 'ar_MA');

      const lat = settings.geo_lat || settings.lat || '34.2610';
      const lng = settings.geo_lng || settings.lng || '-6.5802';
      setMeta('name', 'geo.position', `${lat};${lng}`);
      setMeta('name', 'ICBM', `${lat}, ${lng}`);
      setMeta('name', 'geo.placename', settings.geo_city || settings.city || 'Kenitra');
      setMeta('name', 'geo.region', settings.geo_region || 'MA-KEN');

      if (settings.google_verification) {
        setMeta('name', 'google-site-verification', settings.google_verification);
      }

      let schemaScript = document.getElementById('schema-jsonld');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": settings.site_title || title || "جمعية المبادرة المغربية للتكافل والتعاون",
        "alternateName": "AMSED",
        "url": "https://asso-amsed.vercel.app",
        "logo": settings.og_image || "https://asso-amsed.vercel.app/logo.jpg",
        "description": description,
        "telephone": "+212654240523",
        "email": settings.email || "asso.amsed@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": settings.address || settings.address_ar || "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM",
          "addressLocality": settings.geo_city || settings.city || "Kenitra",
          "addressRegion": settings.geo_region || "MA-KEN",
          "addressCountry": settings.geo_country || "Morocco"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": parseFloat(lat),
          "longitude": parseFloat(lng)
        }
      });

      if (settings.google_analytics && settings.google_analytics !== 'G-XXXXXXXXXX') {
        if (!document.getElementById('gtag-script')) {
          const gtagScript = document.createElement('script');
          gtagScript.id = 'gtag-script';
          gtagScript.async = true;
          gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics}`;
          document.head.appendChild(gtagScript);

          const gtagInline = document.createElement('script');
          gtagInline.id = 'gtag-inline';
          gtagInline.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.google_analytics}');
          `;
          document.head.appendChild(gtagInline);
        }
      }
    });
  }, []);

  return null;
}
