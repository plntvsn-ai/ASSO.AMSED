import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function localApiPlugin() {
  let devSettings = {
    id: 1,
    address_ar: "SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA",
    phone: "06 54 24 05 23",
    show_donation: false,
    show_bank: false,
    association_name: "جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة",
    acronym: "AMSED"
  };

  let devAdvancedSettings = {
    seo_title: 'جمعية المبادرة المغربية لرعاية الأطفال في وضعية صعبة | AMSED القنيطرة',
    seo_description: 'جمعية المبادرة المغربية للتكافل والتعاون AMSED بالقنيطرة - تأهيل أطفال التوحد، ترويض طبي، تقويم النطق، الدمج المدرسي والمواكبة النفسية.',
    seo_keywords: 'أطفال التوحد, القنيطرة, الساكنية, ترويض طبي, تقويم النطق, دمج مدرسي AVS, جمعية AMSED, مواكبة نفسية',
    og_image: 'https://asso-amsed.vercel.app/logo.jpg',
    robots_txt: 'User-agent: *\nAllow: /\nSitemap: https://asso-amsed.vercel.app/api/seo/sitemap',
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
    hreflang: 'ar-MA, fr-MA'
  };

  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/settings' || req.url === '/api/site_settings') {
          res.setHeader('Content-Type', 'application/json');
          if (req.method === 'GET') {
            res.end(JSON.stringify(devSettings));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                devSettings = { ...devSettings, ...parsed };
                res.end(JSON.stringify(devSettings));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
        }
        if (req.url === '/api/advanced-settings' || req.url === '/api/settings/advanced') {
          res.setHeader('Content-Type', 'application/json');
          if (req.method === 'GET') {
            res.end(JSON.stringify(devAdvancedSettings));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                devAdvancedSettings = { ...devAdvancedSettings, ...parsed };
                res.end(JSON.stringify(devAdvancedSettings));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
        }
        if (req.url === '/api/seo/sitemap' || req.url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://asso-amsed.vercel.app/</loc><priority>1.0</priority></url><url><loc>https://asso-amsed.vercel.app/articles</loc><priority>0.9</priority></url><url><loc>https://asso-amsed.vercel.app/about</loc><priority>0.8</priority></url></urlset>`);
          return;
        }
        if (req.url === '/api/autonomous-publish' || req.url === '/api/auto-publish') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            published: "مقال توعوي جديد حول رعاية أطفال التوحد",
            ar: "مقال توعوي جديد حول رعاية أطفال التوحد - AMSED",
            ai: true,
            timestamp: new Date().toISOString()
          }));
          return;
        }
        if (req.url === '/api/news') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            news: [
              {
                id: 'news-1',
                title: 'مستجدات برامج تأهيل أطفال التوحد والإدماج المدرسي AVS',
                summary: 'جمعية AMSED تواصل مواكبة الأسر وأطفال التوحد بمدينة القنيطرة.',
                formattedDate: new Date().toLocaleDateString('ar-MA'),
                source: 'AMSED News',
                category: 'التوحد والطفولة'
              }
            ]
          }));
          return;
        }
        if (req.url === '/api/seo/robots' || req.url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(devAdvancedSettings.robots_txt);
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './lib'),
    }
  }
})
