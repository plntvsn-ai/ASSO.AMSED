import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://asso-amsed.vercel.app';
  
  // Pages statiques
  const staticPages = [
    '', '/about', '/services', '/blog', '/contact', '/donate'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Pages blog dynamiques depuis Supabase si possible
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: posts } = await supabase.from('blog_posts').select('slug, created_at').eq('status', 'published');
    
    const blogPages = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    
    return [...staticPages, ...blogPages];
  } catch {
    return staticPages;
  }
}
