import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import { useLanguage } from '../context/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  Calendar, User, Tag, ArrowRight, Share2, 
  MessageCircle, Clock, ArrowLeft 
} from 'lucide-react';
import { FacebookIcon } from '../components/SocialIcons';
import { ArticleSchema } from '../components/seo/ArticleSchema';

export const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cmsData } = useCms();
  const { lang, dir, getLocalized } = useLanguage();

  const article = (cmsData.articles || []).find(a => a.id === id || a.slug === id || String(a.id) === String(id));
  const otherArticles = (cmsData.articles || []).filter(a => a.id !== id && a.published !== false).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800" dir={dir}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {lang === 'ar' ? 'المقال غير موجود أو تم حذفه' : lang === 'fr' ? 'Article non trouvé ou supprimé' : 'Article not found or removed'}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {lang === 'ar' ? 'يرجى التأكد من صحة الرابط أو الرجوع إلى قائمة المقالات.' : lang === 'fr' ? 'Veuillez vérifier le lien ou retourner à la liste des articles.' : 'Please check the link or return to the articles list.'}
          </p>
          <Link
            to="/articles"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            {lang === 'ar' ? 'العودة لصفحة المقالات' : lang === 'fr' ? 'Retour aux articles' : 'Back to articles'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shareUrl = window.location.href;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`;

  return (
    <div className="min-h-screen flex flex-col moroccan-zellij-bg font-sans text-slate-800" dir={dir}>
      <Navbar />

      <main className="flex-1 py-10">
        <ArticleSchema article={article} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Back Button */}
          <div>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
            >
              {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{lang === 'ar' ? 'العودة إلى جميع المقالات والأخبار' : lang === 'fr' ? 'Retour aux articles et actualités' : 'Back to all articles and news'}</span>
            </Link>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {article.category || 'AMSED'}
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {getLocalized(article, 'title')}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{lang === 'ar' ? `تاريخ النشر: ${article.createdAt}` : lang === 'fr' ? `Publié le: ${article.createdAt}` : `Published on: ${article.createdAt}`}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>
                    {lang === 'ar' 
                      ? `بقلم: ${article.author && !article.author.includes('روبوت') ? article.author : 'أطر جمعية AMSED'}` 
                      : lang === 'fr' 
                      ? `Par: ${article.author && !article.author.includes('روبوت') ? article.author : 'Équipe AMSED'}` 
                      : `By: ${article.author && !article.author.includes('روبوت') ? article.author : 'AMSED Team'}`}
                  </span>
                </span>
              </div>

              {/* Share */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">{lang === 'ar' ? 'مشاركة:' : lang === 'fr' ? 'Partager:' : 'Share:'}</span>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {(() => {
            const displayImg = (article.image && !article.image.includes('photo-1503676260728'))
              ? article.image
              : 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80';
            return (
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 max-h-[500px]">
                <img
                  src={displayImg}
                  alt={getLocalized(article, 'title')}
                  className="w-full h-full object-cover max-h-[500px]"
                />
              </div>
            );
          })()}

          {/* Content Body */}
          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div 
              className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-loose whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: getLocalized(article, 'content') || article.content }}
            />
          </article>

          {/* Other Articles Recommendation */}
          {otherArticles.length > 0 && (
            <div className="pt-8 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'ar' ? 'مقالات وأخبار أخرى قد تهمك' : lang === 'fr' ? 'Autres articles recommandés' : 'Other recommended articles'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherArticles.map(other => (
                  <Link
                    key={other.id}
                    to={`/article/${other.id}`}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      {other.image && (
                        <img
                          src={other.image}
                          alt=""
                          className="w-full h-32 rounded-xl object-cover mb-3"
                        />
                      )}
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
                        {other.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono mt-3 block">{other.createdAt}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
