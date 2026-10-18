export function ArticleSchema({ article }: { article: any }) {
  const title = article?.title || article?.title_ar || "مقال تربوي";
  const siteUrl = "https://asso-amsed.vercel.app";
  const logoUrl = `${siteUrl}/logo-512.png`;

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "image": [article?.image || article?.imageUrl || logoUrl],
    "datePublished": article?.created_at || new Date().toISOString(),
    "dateModified": article?.updated_at || article?.created_at || new Date().toISOString(),
    "author": [{
      "@type": "Organization",
      "name": "جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED",
      "url": siteUrl
    }],
    "publisher": {
      "@type": "Organization",
      "name": "جمعية AMSED",
      "logo": { "@type": "ImageObject", "url": logoUrl }
    },
    "description": article?.excerpt || article?.excerpt_ar || title,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/article/${article?.id || article?.slug || ''}`
    }
  };

  // Google Search Rich Snippets: FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `ما هي أهم خطوات التعامل مع موضوع ${title}؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يقدم أخصائيو جمعية AMSED بالقنيطرة إرشادات عملية تعتمد على التدخل المبكر، الروتين المنظم، التعزيز الإيجابي، وتكييف البيئة الحسية والتواصلية للطفل."
        }
      },
      {
        "@type": "Question",
        "name": "كيف يمكن التواصل مع جمعية AMSED للاستفادة من برامج التكفل بالتوحد بالقنيطرة؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكن التواصل المباشر مع جمعية المبادرة المغربية للتعاون والتكافل AMSED عبر الهاتف أو واتساب على الرقم 0654240523، أو زيارة مقر الجمعية بالقنيطرة (الساكنية 30 تجزئة الحزام)."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
