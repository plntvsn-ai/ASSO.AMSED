import { createClient } from '@supabase/supabase-js'

// In-memory cache to prevent repeated external network requests
let memoryCache = { data: [], timestamp: 0 }
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 mins

const TOPIC_IMAGES = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
]

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url && key) {
    try {
      return createClient(url, key)
    } catch {
      return null
    }
  }
  return null
}

function parseRssItem(block, index) {
  const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/i)
  let rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : ''

  const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/i)
  const link = linkMatch ? linkMatch[1].trim() : '#'

  const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)
  const pubDate = pubDateMatch ? pubDateMatch[1].trim() : ''

  const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i)
  let source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : 'Google News'

  let title = rawTitle
  if (source && title.includes(' - ')) {
    const parts = title.split(' - ')
    if (parts.length > 1 && parts[parts.length - 1].trim().toLowerCase() === source.toLowerCase()) {
      parts.pop()
      title = parts.join(' - ').trim()
    }
  }

  let formattedDate = pubDate
  try {
    const d = new Date(pubDate)
    if (!isNaN(d.getTime())) {
      const diffHours = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60))
      if (diffHours < 1) formattedDate = 'منذ لحظات'
      else if (diffHours < 24) formattedDate = `منذ ${diffHours} ساعة`
      else {
        const diffDays = Math.floor(diffHours / 24)
        if (diffDays === 1) formattedDate = 'أمس'
        else if (diffDays === 2) formattedDate = 'منذ يومين'
        else if (diffDays <= 7) formattedDate = `منذ ${diffDays} أيام`
        else formattedDate = d.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })
      }
    }
  } catch {}

  return {
    id: `news-${index + 1}-${pubDate.replace(/[^0-9]/g, '').slice(-6) || Math.random().toString(36).substring(2, 8)}`,
    title: title || rawTitle,
    rawTitle,
    link,
    pubDate,
    formattedDate,
    source: source || 'أخبار وطنية',
    image: TOPIC_IMAGES[index % TOPIC_IMAGES.length],
    category: 'طيف التوحد والتربية الدامجة'
  }
}

async function fetchAndProcessNews() {
  const now = Date.now()

  // Return cached data if valid
  if (memoryCache.data && memoryCache.data.length > 0 && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data
  }

  // 1. Google News RSS - autism (exact user query + Moroccan local feed for rich coverage)
  const userRssUrl = 'https://news.google.com/rss/search?q=autisme+enfant+OR+autism+children&hl=ar&gl=MA&ceid=MA:ar'
  const extraRssUrl = 'https://news.google.com/rss/search?q=%D8%B7%D9%8A%D9%81+%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D8%AF+%D8%A3%D8%B7%D9%81%D8%A7%D9%84+%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8&hl=ar&gl=MA&ceid=MA:ar'

  const [rssRes1, rssRes2] = await Promise.allSettled([
    fetch(userRssUrl, { headers: { 'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8' } }),
    fetch(extraRssUrl, { headers: { 'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8' } })
  ])

  const xmlList = []
  if (rssRes1.status === 'fulfilled' && rssRes1.value.ok) {
    xmlList.push(await rssRes1.value.text())
  }
  if (rssRes2.status === 'fulfilled' && rssRes2.value.ok) {
    xmlList.push(await rssRes2.value.text())
  }

  // 2. Convert RSS to JSON
  const seenLinks = new Set()
  const news = []

  for (const xml of xmlList) {
    const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/gi) || []
    for (const block of itemBlocks) {
      const item = parseRssItem(block, news.length)
      if (item.link && !seenLinks.has(item.link)) {
        const forbidden = ['كرة القدم', 'المباراة', 'البطولة', 'الجماهير', 'الملعب', 'الكاف', 'الفيفا']
        if (!forbidden.some(w => item.rawTitle.includes(w))) {
          seenLinks.add(item.link)
          news.push(item)
        }
      }
      if (news.length >= 15) break
    }
    if (news.length >= 15) break
  }

  // 3. Store in Supabase / cache
  memoryCache = { data: news, timestamp: now }

  const supabase = getSupabaseClient()
  if (supabase && news.length > 0) {
    try {
      await supabase.from('news').upsert(
        news.map(n => ({
          id: n.id,
          title: n.title,
          link: n.link,
          source: n.source,
          pub_date: n.pubDate,
          image: n.image,
          category: n.category,
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'link', ignoreDuplicates: true }
      )
    } catch (sbErr) {
      console.warn('Supabase cache note:', sbErr.message)
    }
  }

  return news
}

export async function GET() {
  const news = await fetchAndProcessNews()
  return Response.json(news, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
    }
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const news = await fetchAndProcessNews()
    return res.status(200).json(news)
  } catch (err) {
    console.error('RSS fetch handler error:', err)
    return res.status(200).json(memoryCache.data || [])
  }
}
