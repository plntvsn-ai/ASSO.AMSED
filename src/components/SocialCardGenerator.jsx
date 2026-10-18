import React, { useState, useRef } from 'react';
import { Download, Share2, Copy, Check, Sparkles, MessageCircle } from 'lucide-react';
import Logo from './Logo';

export const SocialCardGenerator = ({ article, lang = 'ar' }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef(null);

  if (!article) return null;

  const title = article.title || article.title_ar || 'مقال الجمعية';
  const excerpt = article.excerpt || article.excerpt_ar || (article.content ? article.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...' : '');
  const category = article.category || 'التوحد والطفولة';
  const phone = '06 54 24 05 23';
  const siteUrl = window.location.href;

  const whatsappShareText = `🧩 *[نصيحة اليوم من جمعية AMSED القنيطرة]*\n📌 *${title}*\n\n${excerpt}\n\n📖 لقراءة الدليل كاملاً:\n${siteUrl}\n\n📞 للاستشارة والمواكبة: ${phone}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(whatsappShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadImage = () => {
    setDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setDownloading(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1080;

    // 1. Background Gradient (Emerald to Deep Forest Green)
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
    bgGrad.addColorStop(0, '#064e3b');
    bgGrad.addColorStop(0.5, '#042f2e');
    bgGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Moroccan Golden Border Frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 1020, 1020);

    ctx.strokeStyle = '#f4d06f';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 990, 990);

    // Corner decorative accents
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(30, 30, 40, 40);
    ctx.fillRect(1010, 30, 40, 40);
    ctx.fillRect(30, 1010, 40, 40);
    ctx.fillRect(1010, 1010, 40, 40);

    // 3. Header Badge: AMSED Official
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.beginPath();
    ctx.roundRect(140, 80, 800, 70, 35);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧩 جمعية المبادرة المغربية للتعاون والتكافل - AMSED القنيطرة', 540, 125);

    // Category Badge
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(440, 180, 200, 45, 22);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Cairo, sans-serif';
    ctx.fillText(category, 540, 210);

    // 4. Title with multi-line wrap
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Cairo, sans-serif';
    ctx.textAlign = 'center';

    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, currentY);
      return currentY;
    };

    const nextY = wrapText(title, 540, 300, 920, 60);

    // 5. Excerpt Box (Golden Glow Card)
    const boxY = Math.max(nextY + 50, 480);
    const boxHeight = 340;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(80, boxY, 920, boxHeight, 25);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 28px Cairo, sans-serif';
    ctx.fillText('💡 نصيحة وتوجيه للمربين والآباء:', 540, boxY + 55);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'normal 26px Cairo, sans-serif';
    wrapText(excerpt, 540, boxY + 115, 840, 45);

    // 6. Footer (Contact & Support)
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 30px Cairo, sans-serif';
    ctx.fillText(`📞 للاستشارة والمواكبة: ${phone}`, 540, 930);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Cairo, sans-serif';
    ctx.fillText('القنيطرة | رعاية ودعم أطفال التوحد وصعوبات التعلم | asso-amsed.vercel.app', 540, 980);

    // Download PNG
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `AMSED-Card-${title.slice(0, 30).replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Canvas export error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl my-8 relative overflow-hidden" dir="rtl">
      {/* Hidden Canvas for High-Resolution Export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Decorative Zellij glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-amber-300">
                📸 بطاقة إنفوجرافيك للمشاركة على السوشيال ميديا
              </h3>
              <p className="text-xs text-slate-300">
                شارك خلاصة هذا المقال كـ Story أو منشور على واتساب وفيسبوك بنقرة واحدة
              </p>
            </div>
          </div>
          <span className="text-xs bg-emerald-700/80 text-emerald-200 px-3 py-1 rounded-full font-bold">
            {category}
          </span>
        </div>

        {/* Card Visual Preview */}
        <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-inner">
          <div className="text-xs font-bold text-amber-400">
            🧩 جمعية AMSED القنيطرة • دليل أطفال التوحد
          </div>
          <h4 className="font-black text-lg sm:text-xl text-white leading-snug">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border-r-2 border-amber-400">
            "{excerpt}"
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
            <span>📞 هاتف الجمعية: {phone}</span>
            <span>📍 القنيطرة</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 px-5 rounded-xl transition shadow-lg cursor-pointer text-xs sm:text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'جاري تجهيز الصورة...' : 'تحميل البطاقة كصورة (Story / PNG)'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl transition shadow-md cursor-pointer text-xs sm:text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>مشاركة على واتساب</span>
          </a>

          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl transition cursor-pointer text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الخلاصة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialCardGenerator;
