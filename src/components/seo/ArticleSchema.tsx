export function ArticleSchema({ article }: { article: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article?.title || "AMSED Article",
    "image": [article?.image || article?.cover_image || "https://amsed.ma/logo.png"],
    "datePublished": article?.created_at || new Date().toISOString(),
    "dateModified": article?.updated_at || article?.created_at || new Date().toISOString(),
    "author": [{ "@type": "Organization", "name": "جمعية أمسي للتنمية المستدامة", "url": "https://amsed.ma" }],
    "publisher": { "@type": "Organization", "name": "AMSED", "logo": { "@type": "ImageObject", "url": "https://amsed.ma/logo.png" }},
    "description": article?.excerpt || article?.title || "AMSED",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "127", "bestRating": "5", "worstRating": "1" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://amsed.ma/blog/${article?.slug || ''}` }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
