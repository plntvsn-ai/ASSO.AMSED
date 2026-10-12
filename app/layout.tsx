import React from 'react'
import { supabase } from '@/lib/supabase'

export const defaultSettings: Record<string, string> = {
  seo_title: 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة | AMSED القنيطرة',
  seo_description: 'جمعية المبادرة المغربية للتكافل والتعاون AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدمج المدرسي والمواكبة النفسية.',
  seo_keywords: 'أطفال التوحد, القنيطرة, الساكنية, ترويض طبي, تقويم النطق, دمج مدرسي AVS, جمعية AMSED, مواكبة نفسية',
  og_image: 'https://asso-amsed.vercel.app/logo.jpg',
  robots_txt: 'User-agent: *\nAllow: /\n\nSitemap: https://asso-amsed.vercel.app/api/seo/sitemap',
  sitemap_enabled: 'true',
  google_analytics: 'G-XXXXXXXXXX',
  google_verification: 'kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14',
  gtm_id: '',
  search_console: '',
  geo_lat: '34.2610',
  geo_lng: '-6.5802',
  geo_city: 'Kenitra',
  geo_region: 'MA-KEN',
  geo_country: 'Morocco',
  hreflang: 'ar-MA, fr-MA',
  phone1: '06 54 24 05 23',
  address: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA'
}

async function getMergedSettings(): Promise<Record<string, any>> {
  let combined: Record<string, any> = { ...defaultSettings }

  // 1. Fetch from site_settings (key-value or row)
  try {
    const { data: siteData } = await supabase.from('site_settings').select('*')
    if (siteData && siteData.length > 0) {
      if (siteData[0].key !== undefined) {
        siteData.forEach((row: { key: string; value: string }) => {
          if (row.key) combined[row.key] = row.value
        })
      } else if (siteData[0].id !== undefined) {
        combined = { ...combined, ...siteData[0] }
      }
    }
  } catch (err) {
    console.warn('site_settings load notice in layout:', err)
  }

  // 2. Fetch from advanced_settings
  try {
    const { data: advData } = await supabase.from('advanced_settings').select('*')
    if (advData && advData.length > 0) {
      advData.forEach((row: { key: string; value: string }) => {
        if (row.key) combined[row.key] = row.value ?? ''
      })
    }
  } catch (err) {
    console.warn('advanced_settings load notice in layout:', err)
  }

  // Normalize
  combined.seo_title = combined.seo_title || combined.site_title || defaultSettings.seo_title
  combined.seo_description = combined.seo_description || combined.site_description || defaultSettings.seo_description
  combined.geo_lat = combined.geo_lat || combined.lat || '34.2610'
  combined.geo_lng = combined.geo_lng || combined.lng || '-6.5802'
  combined.geo_city = combined.geo_city || combined.city || 'Kenitra'
  combined.phone = combined.phone1 || combined.phone || '06 54 24 05 23'
  combined.address = combined.address || combined.address_ar || 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA'

  return combined
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getMergedSettings()

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": settings.site_title || "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
    "alternateName": "AMSED",
    "url": "https://asso-amsed.vercel.app",
    "logo": settings.og_image || "https://asso-amsed.vercel.app/logo.jpg",
    "description": settings.seo_description,
    "telephone": "+212654240523",
    "email": settings.email || "asso.amsed@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address || "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM",
      "addressLocality": settings.geo_city,
      "addressRegion": settings.geo_region || "MA-KEN",
      "addressCountry": settings.geo_country || "Morocco"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": parseFloat(settings.geo_lat) || 34.2610,
      "longitude": parseFloat(settings.geo_lng) || -6.5802
    },
    "sameAs": [
      "https://facebook.com/amsed.maroc",
      "https://youtube.com/@association-amesd"
    ]
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Dynamic Title and Meta */}
        <title>{settings.seo_title}</title>
        <meta name="description" content={settings.seo_description} />
        {settings.seo_keywords && <meta name="keywords" content={settings.seo_keywords} />}
        
        {/* OpenGraph / Social Media */}
        <meta property="og:title" content={settings.seo_title} />
        <meta property="og:description" content={settings.seo_description} />
        {settings.og_image && <meta property="og:image" content={settings.og_image} />}
        <meta property="og:url" content="https://asso-amsed.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_MA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={settings.seo_title} />
        <meta name="twitter:description" content={settings.seo_description} />
        {settings.og_image && <meta name="twitter:image" content={settings.og_image} />}

        {/* GEO Tags for Local SEO */}
        <meta name="geo.position" content={`${settings.geo_lat};${settings.geo_lng}`} />
        <meta name="geo.placename" content={settings.geo_city} />
        <meta name="geo.region" content={settings.geo_region || "MA-KEN"} />
        <meta name="ICBM" content={`${settings.geo_lat}, ${settings.geo_lng}`} />

        {/* Google Site Verification */}
        <meta name="google-site-verification" content="kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14" />
        {settings.google_verification && settings.google_verification !== "kjDkzRmJppvcCc_okAdKUPHcr9FoarzwnytGYEEng14" && (
          <meta name="google-site-verification" content={settings.google_verification} />
        )}

        {/* Hreflang Alternate Links */}
        <link rel="alternate" hrefLang="ar-MA" href="https://asso-amsed.vercel.app/" />
        <link rel="alternate" hrefLang="fr-MA" href="https://asso-amsed.vercel.app/fr" />

        {/* Favicon & Manifest */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* LocalBusiness / NGO JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />

        {/* Google Analytics Script */}
        {settings.google_analytics && settings.google_analytics !== 'G-XXXXXXXXXX' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.google_analytics}');
                `
              }}
            />
          </>
        )}

        {/* Google Tag Manager (GTM) */}
        {settings.gtm_id && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${settings.gtm_id}');
              `
            }}
          />
        )}
      </head>
      <body>
        {settings.gtm_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.gtm_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  )
}
