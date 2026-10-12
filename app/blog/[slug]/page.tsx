import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

async function getArticle(slug: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
    );
    const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (data) return data;
  } catch {}
  return {
    title: 'مقال جمعية AMSED',
    slug,
    excerpt: 'جمعية المبادرة المغربية للتكافل والتعاون لرعاية الأطفال في وضعية صعبة',
    content: 'تفاصيل المقال...',
    created_at: new Date().toISOString()
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const article = await getArticle(resolvedParams.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ArticleSchema article={article} />
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      {article.excerpt && <p className="text-lg text-gray-600 mb-6">{article.excerpt}</p>}
      <div className="prose max-w-none whitespace-pre-line text-gray-800 leading-relaxed">
        {article.content}
      </div>
    </article>
  );
}
