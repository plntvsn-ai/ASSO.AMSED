import { NextResponse } from 'next/server'

const TOPICS = [
  "كيفاش نعلم طفل التوحد يطلب الماء",
  "تمارين التخاطب للأطفال في المنزل",
  "كيفاش نتعامل مع نوبات الغضب عند أطفال التوحد",
  "الدمج المدرسي للأطفال في وضعية صعبة",
  "تنمية المهارات الدقيقة للأطفال"
]

export async function GET() {
  try {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    const images = [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
    ]

    const articleContent = `
      <h2>مقدمة</h2>
      <p>بزاف ديال الأمهات فالقنيطرة كيسولونا على ${topic}... هاد التجربة ديال أم سارة من الساكنية 30 غادي تفيدكم بزاف.</p>
      <img src="${images[0]}" style="width:100%;border-radius:15px;margin:15px 0" />
      <h2>1. علاش هاد المهارة مهمة؟</h2>
      <p>الطفل ملي كيتعلم يطلب بوحدو كتزيد الثقة ديالو فراسو وكينقص التوتر فالدار.</p>
      <h2>2. 3 خطوات عملية تقدري تديريها اليوم فالدار</h2>
      <ul><li>الخطوة 1: استعملي الصور</li><li>الخطوة 2: قسمي المهمة</li><li>الخطوة 3: شجعيه مباشرة</li></ul>
      <img src="${images[1]}" style="width:100%;border-radius:15px;margin:15px 0" />
      <h2>3. الأخطاء اللي خاصك تتجنبيها</h2>
      <p>ما تطلبيش منو بزاف دقة وحدة، وخلي كل حاجة بلعب.</p>
      <p><strong>مركز AMSED - SAKNIA 30 - القنيطرة - 06 54 24 05 23</strong></p>
    `

    const data = {
      id: Date.now().toString(),
      title: topic,
      content: articleContent,
      images: images,
      image: images[0],
      published: true,
      status: 'published',
      isApproved: true,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ success: true, article: data })
  } catch(e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export const POST = GET
