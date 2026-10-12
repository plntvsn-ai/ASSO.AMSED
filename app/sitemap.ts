import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://asso-amsed.vercel.app'
  
  // Pages statiques
  const routes = ['', '/about', '/services', '/articles', '/blog', '/contact', '/donate'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Essaie de lire Supabase mais ne bloque pas si erreur
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: articles } = await supabase.from('articles').select('slug, created_at').eq('published', true).limit(100)
    if (articles) {
      articles.forEach((a:any) => {
        routes.push({
          url: `${baseUrl}/articles/${a.slug}`,
          lastModified: new Date(a.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      })
    }
  } catch (e) {}

  return routes
}
