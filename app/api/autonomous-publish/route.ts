export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function translateFree(text: string, to: 'fr'|'en'){
  try{
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0,400))}&langpair=ar|${to}`)
    const j = await r.json()
    return j.responseData?.translatedText || text
  }catch{ return text }
}

function makeArticle(topic: string){
  return {
    ar: `# ${topic}

في مركز AMSED بالساكنية القنيطرة (SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA) نستقبل يوميا أمهات...

## ما هو ${topic}؟

## كيف نساعد في الجمعية؟

لدينا 8 خدمات: ترويض، نطق، دعم مدرسي AVS، ورشات مهنية، مواكبة نفسية.

## نصائح اليوم

1. الروتين ثابت
2. التشجيع الإيجابي
3. اتصلي بنا: 06 54 24 05 23

-- جمعية AMSED - 650+ طفل مستفيد`,
    fr: '',
    en: ''
  }
}

export async function POST(){
  try{
    const {createClient} = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
    const supabase = createClient(supabaseUrl, supabaseKey)

    const {data: topics, error: tError} = await supabase.from('topics_bank').select('*').eq('used', false).limit(1)
    if(tError) return Response.json({error: tError.message}, {status:500})
    if(!topics?.length) return Response.json({error: 'الخزان خاوي - زيد مواضيع'}, {status:400})

    const topic_ar = topics[0].topic || topics[0].title
    const topic_fr = await translateFree(topic_ar, 'fr')
    const topic_en = await translateFree(topic_ar, 'en')

    const art = makeArticle(topic_ar)

    const {error: iError} = await supabase.from('articles').insert({
      title_ar: topic_ar,
      title_fr: topic_fr,
      title_en: topic_en,
      content_ar: art.ar,
      content_fr: `Guide AMSED: ${topic_fr} - Contact 06 54 24 05 23 - SAKNIA 30 LOT EL HIZAM`,
      content_en: `AMSED Guide: ${topic_en} - Contact 06 54 24 05 23`,
      status: 'published'
    })
    if(iError) return Response.json({error: iError.message}, {status:500})

    await supabase.from('topics_bank').update({used: true}).eq('id', topics[0].id)

    return Response.json({success:true, ar: topic_ar, fr: topic_fr, en: topic_en})
  }catch(e:any){
    return Response.json({error: e.message}, {status:500})
  }
}

export async function GET(){ return POST() }
