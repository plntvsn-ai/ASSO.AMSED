import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, FastForward } from 'lucide-react';

export const ArticleAudioPlayer = ({ text = '', title = '', lang = 'ar' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanTextForSpeech = () => {
    const raw = (title ? `${title}. ` : '') + text;
    return raw
      .replace(/<[^>]+>/g, ' ') // إزالة وسوم HTML
      .replace(/[#*`_~]/g, '')   // إزالة علامات Markdown
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handlePlay = () => {
    if (!supported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const clean = cleanTextForSpeech();
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utteranceRef.current = utterance;

    // Detect voice language
    const voices = window.speechSynthesis.getVoices();
    let targetLang = 'ar-SA';
    if (lang === 'fr') targetLang = 'fr-FR';
    if (lang === 'en') targetLang = 'en-US';

    const matchedVoice = voices.find(v => v.lang.startsWith(targetLang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = targetLang;
    utterance.rate = speed;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setSpeed(nextSpeed);

    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!supported) return null;

  return (
    <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm my-6" dir="rtl">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
          isPlaying ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'
        }`}>
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
            <span>{lang === 'ar' ? '🎧 الاستماع الصوتي للمقال' : lang === 'fr' ? '🎧 Écouter cet article' : '🎧 Listen to this article'}</span>
            {isPlaying && (
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-1 bg-emerald-600 animate-bounce h-2 rounded-full"></span>
                <span className="w-1 bg-emerald-600 animate-bounce h-3 rounded-full delay-75"></span>
                <span className="w-1 bg-emerald-600 animate-bounce h-1.5 rounded-full delay-150"></span>
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-500">
            {isPlaying 
              ? (lang === 'ar' ? 'جاري القراءة بصوت هادئ...' : lang === 'fr' ? 'Lecture en cours...' : 'Reading in progress...')
              : isPaused 
              ? (lang === 'ar' ? 'متوقف مؤقتاً' : lang === 'fr' ? 'En pause' : 'Paused')
              : (lang === 'ar' ? 'استمع للنصائح والتوجيهات أثناء انشغالك' : lang === 'fr' ? 'Écoutez les conseils à votre rythme' : 'Listen to guidance on the go')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Play / Pause Button */}
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isPaused ? (lang === 'ar' ? 'متابعة' : 'Reprendre') : (lang === 'ar' ? 'تشغيل' : 'Écouter')}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
          >
            <Pause className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
          </button>
        )}

        {/* Stop Button */}
        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
            title={lang === 'ar' ? 'إيقاف تام' : 'Arrêter'}
          >
            <Square className="w-4 h-4 fill-slate-700" />
          </button>
        )}

        {/* Speed Button */}
        <button
          onClick={toggleSpeed}
          className="text-xs font-mono font-bold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          title={lang === 'ar' ? 'سرعة القراءة' : 'Vitesse'}
        >
          {speed}x
        </button>
      </div>
    </div>
  );
};

export default ArticleAudioPlayer;
