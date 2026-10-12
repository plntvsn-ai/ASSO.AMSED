import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SOCIAL_PLATFORMS } from '@/lib/social-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').trim();
  const genAI = new GoogleGenerativeAI(geminiKey || 'dummy_key');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let settings: any[] = [];
  try {
    const { data } = await supabase.from('robot_settings').select('*');
    if (data) settings = data;
  } catch {}

  const getSetting = (id: string) => settings?.find(s => s.id === id);
  if (getSetting('master')?.enabled === false) return Response.json({ skipped: 'master disabled' });

  let logs: string[] = [];

  try {
    const masterPrompt = getSetting('master')?.prompt_template || 'كتب مقال 800 كلمة عن التنمية المستدامة ورعاية الأطفال في المغرب، بأسلوب صحفي مغربي بسيط، مع لمسة دارجة خفيفة، واذكر جمعية أمسي AMSED';
    const articlePrompt = `${masterPrompt}. Output JSON format ONLY: {"title": "العنوان", "slug": "slug-in-latin-or-arabic", "excerpt": "ملخص قصير", "content": "مقال 800 كلمة مع H2 و H3", "keywords": ["كلمة1", "كلمة2"]}`;

    const result = await model.generateContent(articlePrompt);
    let raw = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
    let newArticle = JSON.parse(raw);

    if (!newArticle.slug) {
      newArticle.slug = `amsed-article-${Date.now()}`;
    }

    const altPrompt = `Write SEO ALT in Arabic for image about ${newArticle.title}, include "جمعية امسد الدار البيضاء"`;
    let image_alt = `جمعية امسد - ${newArticle.title}`;
    try {
      const altRes = await model.generateContent(altPrompt);
      image_alt = altRes.response.text().trim();
    } catch {}

    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(newArticle.slug)}/800/450`;

    const { data: inserted, error: insErr } = await supabase.from('articles').insert({
      title: newArticle.title,
      slug: newArticle.slug,
      excerpt: newArticle.excerpt || newArticle.title,
      content: newArticle.content,
      image: imageUrl,
      image_alt,
      keywords: newArticle.keywords || [],
      status: 'published',
      created_at: new Date().toISOString()
    }).select().single();

    if (insErr) {
      logs.push(`Insert note: ${insErr.message}`);
    }

    const currentId = inserted?.id;

    if (currentId && getSetting('seo_linking')?.enabled !== false) {
      const { data: oldArticles } = await supabase.from('articles').select('id, slug, title, content').neq('id', currentId).order('created_at', { ascending: false }).limit(50);
      if (oldArticles && oldArticles.length > 3) {
        const linkPrompt = `New: ${newArticle.title}. Old list: ${oldArticles.map(a => a.slug + ":" + a.title).join(', ')}. Return JSON array of 3 most relevant slugs only.`;
        try {
          const linkRes = await model.generateContent(linkPrompt);
          const relatedSlugs = JSON.parse(linkRes.response.text().replace(/```json/gi, '').replace(/```/g, '').trim());
          const related = oldArticles.filter(a => relatedSlugs.includes(a.slug)).slice(0, 3);
          const relatedSection = `\n\n## 📚 مقالات ذات صلة\n${related.map(r => `- [${r.title}](/blog/${r.slug})`).join('\n')}`;
          await supabase.from('articles').update({ content: newArticle.content + relatedSection }).eq('id', currentId);
          for (let old of related.slice(0, 2)) {
            await supabase.from('articles').update({ content: old.content + `\n\n> 🆕 اقرأ أيضا: [${newArticle.title}](/blog/${newArticle.slug})` }).eq('id', old.id);
          }
        } catch (e) {}
      }
    }

    const isFriday = new Date().getDay() === 5;
    if (isFriday && getSetting('seo_refresher')?.enabled !== false) {
      const { data: oldest } = await supabase.from('articles').select('*').order('updated_at', { ascending: true }).limit(1).single();
      if (oldest && oldest.content) {
        const refreshPrompt = `Add one new paragraph 60 words with 2026 updated info about sustainable development in Morocco. Keep same style. Article: ${oldest.content.slice(0, 2000)}`;
        try {
          const refreshRes = await model.generateContent(refreshPrompt);
          await supabase.from('articles').update({
            content: oldest.content + `\n\n**تحديث ${new Date().getFullYear()}:** ${refreshRes.response.text()}`,
            updated_at: new Date().toISOString()
          }).eq('id', oldest.id);
        } catch {}
      }
    }

    for (const [key, platform] of Object.entries(SOCIAL_PLATFORMS)) {
      const robot = getSetting(key);
      if (robot?.enabled && (platform as any).enabled && (platform as any).token) {
        if (key === 'facebook' && (platform as any).pageId) {
          try {
            await fetch(`https://graph.facebook.com/${(platform as any).pageId}/feed`, {
              method: 'POST',
              body: new URLSearchParams({
                message: `${newArticle.title}\n\n${newArticle.excerpt}\n\nاقرأ المزيد: https://amsed.ma/blog/${newArticle.slug}`,
                link: `https://amsed.ma/blog/${newArticle.slug}`,
                access_token: (platform as any).token
              })
            });
          } catch (fbErr: any) {
            logs.push(`FB note: ${fbErr?.message}`);
          }
        }
      }
    }

    try {
      await supabase.from('robot_settings').update({ last_run: new Date().toISOString(), status: 'idle' }).eq('id', 'master');
    } catch {}

    return Response.json({ success: true, article: newArticle.slug, logs });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
