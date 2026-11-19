import React, { useState, useEffect } from 'react';
import { HADITH_LIST } from '../data/mockData';
import { DailyHadith } from '../types';
import {
  Quote,
  Share2,
  Shuffle,
  Copy,
  Check,
  MessageCircle,
  Twitter,
  Sparkles,
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface HaditsHarianWidgetProps {
  onNavigateToPoster?: (topicText: string) => void;
}

export const HaditsHarianWidget: React.FC<HaditsHarianWidgetProps> = ({ onNavigateToPoster }) => {
  // Select Hadith based on day of year by default
  const getTodayHadith = (): DailyHadith => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return HADITH_LIST[dayOfYear % HADITH_LIST.length];
  };

  const [currentHadith, setCurrentHadith] = useState<DailyHadith>(getTodayHadith());
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [readingTheme, setReadingTheme] = useState<'emerald' | 'paper'>('emerald');
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    if (!isReadingMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsReadingMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isReadingMode]);

  const handleRandomizeHadith = () => {
    const remaining = HADITH_LIST.filter((h) => h.id !== currentHadith.id);
    const randomIndex = Math.floor(Math.random() * remaining.length);
    setCurrentHadith(remaining[randomIndex] || HADITH_LIST[0]);
  };

  const getFormattedShareText = () => {
    return `✨ *HADITS HARIAN ABDICity* ✨\n\n${currentHadith.arabic}\n\n"${currentHadith.translation}"\n\n📌 *Perawi:* ${currentHadith.narrator}\n💡 *Hikmah:* ${currentHadith.explanation}\n\nDisebarkan melalui Ekosistem Digital ABDICity.cloud`;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getFormattedShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getFormattedShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`" ${currentHadith.translation} "\n\n${currentHadith.narrator} #HaditsHarian #ABDICity`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hadits Harian: ${currentHadith.category}`,
          text: getFormattedShareText(),
          url: window.location.href,
        });
      } catch (e) {
        console.log('Share canceled or failed', e);
      }
    } else {
      setShowShareModal(true);
    }
  };

  if (isReadingMode) {
    const isPaper = readingTheme === 'paper';
    return (
      <div
        className={`rounded-3xl border transition-colors duration-300 p-6 sm:p-10 md:p-12 shadow-xl ${
          isPaper
            ? 'bg-amber-50/90 text-stone-900 border-amber-200'
            : 'bg-emerald-950 text-emerald-50 border-emerald-800'
        }`}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Minimal Mode Baca Controls */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
              isPaper ? 'border-amber-200/80' : 'border-emerald-800/70'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <BookOpen className={`w-4 h-4 ${isPaper ? 'text-emerald-800' : 'text-amber-400'}`} />
              <span className={isPaper ? 'text-stone-700' : 'text-emerald-200'}>
                Mode Baca · {currentHadith.book} ({currentHadith.narrator})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center rounded-lg border p-0.5 text-[11px] font-semibold ${
                  isPaper ? 'bg-white border-amber-200 text-stone-700' : 'bg-emerald-900/70 border-emerald-800 text-emerald-200'
                }`}
              >
                <button
                  onClick={() => setReadingTheme('emerald')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    !isPaper ? 'bg-emerald-800 text-white' : 'hover:text-stone-900'
                  }`}
                >
                  Gelap
                </button>
                <button
                  onClick={() => setReadingTheme('paper')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    isPaper ? 'bg-amber-200 text-stone-900' : 'hover:text-white'
                  }`}
                >
                  Kertas
                </button>
              </div>

              <div
                className={`flex items-center rounded-lg border p-0.5 text-[11px] font-bold ${
                  isPaper ? 'bg-white border-amber-200 text-stone-700' : 'bg-emerald-900/70 border-emerald-800 text-emerald-200'
                }`}
              >
                {(['md', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      fontSize === sz
                        ? isPaper
                          ? 'bg-emerald-800 text-white'
                          : 'bg-amber-400 text-emerald-950'
                        : ''
                    }`}
                  >
                    {sz === 'md' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsReadingMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  isPaper
                    ? 'bg-white hover:bg-amber-100 text-stone-800 border-amber-300'
                    : 'bg-emerald-900 hover:bg-emerald-800 text-amber-300 border-emerald-700'
                }`}
                title="Keluar dari Mode Baca (Esc)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Keluar Mode Baca</span>
              </button>
            </div>
          </div>

          {/* Pure Hadith Text Content */}
          <div className="space-y-8 py-4">
            <p
              dir="rtl"
              className={`text-right font-serif select-text transition-all ${
                isPaper ? 'text-stone-900' : 'text-amber-100'
              } ${
                fontSize === 'md'
                  ? 'text-2xl sm:text-3xl leading-[2.2]'
                  : fontSize === 'lg'
                  ? 'text-3xl sm:text-4xl leading-[2.3]'
                  : 'text-4xl sm:text-5xl leading-[2.4]'
              }`}
              style={{ fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', serif" }}
            >
              {currentHadith.arabic}
            </p>

            <div
              className={`pt-6 border-t space-y-4 ${
                isPaper ? 'border-amber-200/80' : 'border-emerald-800/60'
              }`}
            >
              <p
                className={`font-serif leading-relaxed ${
                  isPaper ? 'text-stone-800' : 'text-emerald-100'
                } ${
                  fontSize === 'md'
                    ? 'text-base sm:text-lg'
                    : fontSize === 'lg'
                    ? 'text-lg sm:text-xl'
                    : 'text-xl sm:text-2xl'
                }`}
              >
                "{currentHadith.translation}"
              </p>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isPaper ? 'text-stone-600' : 'text-emerald-300/85'
                }`}
              >
                {currentHadith.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-3xl border-2 border-amber-400/60 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold shadow-inner">
            <Quote className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-amber-300 text-lg sm:text-xl leading-tight">Hadits Harian ABDICity</h3>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Pilihan Hari Ini
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">Mutiara Sunnah Rasulullah ﷺ untuk Penyejuk Hati</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReadingMode(true)}
            className="bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 border border-amber-400/40 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            title="Buka Mode Baca (Focus Reading) untuk perenungan tanpa gangguan"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mode Baca</span>
          </button>

          <button
            onClick={handleRandomizeHadith}
            className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="Tampilkan Hadits Lain Secara Acak"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Acak Hadits</span>
          </button>
        </div>
      </div>

      {/* Main Hadith Content */}
      <div className="space-y-5 relative z-10">
        {/* Category & Grade */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-emerald-800/90 text-amber-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-700 shadow-2xs">
            {currentHadith.category}
          </span>
          <span className="bg-amber-400 text-emerald-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-2xs">
            {currentHadith.grade || 'Shahih'}
          </span>
          <span className="text-xs text-emerald-300 font-mono">
            {currentHadith.narrator}
          </span>
        </div>

        {/* Arabic Matan */}
        <div className="bg-emerald-900/60 p-5 sm:p-6 rounded-2xl border border-amber-400/30 shadow-inner">
          <p className="font-serif text-right text-2xl sm:text-3xl font-bold text-amber-200 leading-loose sm:leading-loose tracking-wide">
            {currentHadith.arabic}
          </p>
        </div>

        {/* Indonesian Translation */}
        <div className="bg-emerald-950/80 p-4 sm:p-5 rounded-2xl border border-emerald-800/80 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">Terjemahan Matan:</span>
          <p className="text-sm sm:text-base text-gray-100 font-sans italic leading-relaxed">
            "{currentHadith.translation}"
          </p>
          <p className="text-xs text-emerald-300 font-semibold pt-1">
            — {currentHadith.book} ({currentHadith.narrator})
          </p>
        </div>

        {/* Hikmah / Explanation */}
        <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 block text-xs">Pelajaran & Hikmah Utama:</span>
            <p className="leading-relaxed text-emerald-100">{currentHadith.explanation}</p>
          </div>
        </div>
      </div>

      {/* Share & Actions Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-800/80 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          {/* Twitter / X Share */}
          <button
            onClick={handleTwitterShare}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Twitter className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">Twitter / X</span>
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={handleNativeShare}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyText}
            className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-emerald-600"
          >
            {copied ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>
        </div>

        {/* Bridge to AI Poster Generator */}
        {onNavigateToPoster && (
          <button
            onClick={() => onNavigateToPoster(`${currentHadith.category}: ${currentHadith.translation}`)}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            <span>Jadikan Poster Dakwah AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Fallback Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h4 className="font-serif font-bold text-emerald-950 text-base">Bagikan Hadits Harian</h4>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Pilih platform media sosial untuk menyebarkan pesan kebaikan ini:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  handleWhatsAppShare();
                  setShowShareModal(false);
                }}
                className="w-full bg-emerald-600 text-white font-bold p-3 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Kirim via WhatsApp Chat / Group</span>
              </button>

              <button
                onClick={() => {
                  handleTwitterShare();
                  setShowShareModal(false);
                }}
                className="w-full bg-sky-600 text-white font-bold p-3 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-sky-700 transition-all"
              >
                <Twitter className="w-4 h-4 fill-white" />
                <span>Post di Twitter / X</span>
              </button>

              <button
                onClick={() => {
                  handleCopyText();
                  setShowShareModal(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold p-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border border-gray-300"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Teks Lengkap ke Clipboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
