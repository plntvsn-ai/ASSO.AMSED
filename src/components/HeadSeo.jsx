import React, { useEffect } from 'react';

export default function HeadSeo() {
  useEffect(() => {
    fetch('/api/advanced-settings')
      .then(res => res.json())
      .then(settings => {
        if (!settings || typeof settings !== 'object') return;

        // 1. Update Title
        if (settings.seo_title) {
          document.title = settings.seo_title;
        }

        // Helper to update or create meta tags
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

        // 2. SEO & Descriptions
        setMeta('name', 'description', settings.seo_description);
        setMeta('name', 'keywords', settings.seo_keywords);

        // 3. OpenGraph
        setMeta('property', 'og:title', settings.seo_title);
        setMeta('property', 'og:description', settings.seo_description);
        setMeta('property', 'og:image', settings.og_image || 'https://asso-amsed.vercel.app/logo.jpg');
        setMeta('property', 'og:type', 'website');
        setMeta('property', 'og:locale', 'ar_MA');

        // 4. GEO Meta Tags
        if (settings.geo_lat && settings.geo_lng) {
          setMeta('name', 'geo.position', `${settings.geo_lat};${settings.geo_lng}`);
          setMeta('name', 'ICBM', `${settings.geo_lat}, ${settings.geo_lng}`);
        }
        setMeta('name', 'geo.placename', settings.geo_city || 'Kenitra');
        setMeta('name', 'geo.region', settings.geo_region || 'MA-KEN');

        // 5. Verification
        if (settings.google_verification) {
          setMeta('name', 'google-site-verification', settings.google_verification);
        }

        // 6. JSON-LD Schema
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
          "name": "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
          "alternateName": "AMSED",
          "url": "https://asso-amsed.vercel.app",
          "logo": settings.og_image || "https://asso-amsed.vercel.app/logo.jpg",
          "description": settings.seo_description,
          "telephone": "+212654240523",
          "email": "asso.amsed@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM",
            "addressLocality": settings.geo_city || "Kenitra",
            "addressRegion": settings.geo_region || "MA-KEN",
            "addressCountry": settings.geo_country || "Morocco"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": parseFloat(settings.geo_lat) || 34.2610,
            "longitude": parseFloat(settings.geo_lng) || -6.5802
          }
        });

        // 7. Google Analytics gtag script
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
      })
      .catch(() => {});
  }, []);

  return null;
}
