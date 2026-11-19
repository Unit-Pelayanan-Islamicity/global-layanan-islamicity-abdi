import React, { useState, useEffect, useRef } from 'react';
import { DailyAyatVerse } from '../types';
import { CURATED_DAILY_AYAT_LIST } from '../data/dailyAyatData';
import {
  BookOpen,
  Sparkles,
  Shuffle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Share2,
  Bookmark,
  BookmarkCheck,
  Image,
  ExternalLink,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  HelpCircle,
  Clock,
  Sparkle,
  Type,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface DailyAyatProps {
  onNavigateToPoster?: (topicText: string) => void;
  onNavigateToQuran?: (surahNumber: number) => void;
}

export const DailyAyat: React.FC<DailyAyatProps> = ({
  onNavigateToPoster,
  onNavigateToQuran
}) => {
  // Deterministic daily verse index based on Gregorian date
  const getTodayVerse = (): DailyAyatVerse => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return CURATED_DAILY_AYAT_LIST[dayOfYear % CURATED_DAILY_AYAT_LIST.length];
  };

  const [currentVerse, setCurrentVerse] = useState<DailyAyatVerse>(getTodayVerse());
  const [isLoadingRandom, setIsLoadingRandom] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Display toggles
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [copied, setCopied] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
  const [readingTheme, setReadingTheme] = useState<'emerald' | 'paper'>('emerald');

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioError, setAudioError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Saved Bookmarks with localStorage
  const [bookmarkedVerses, setBookmarkedVerses] = useState<DailyAyatVerse[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_saved_daily_ayats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved ayats', e);
    }
    return [CURATED_DAILY_AYAT_LIST[0], CURATED_DAILY_AYAT_LIST[1]];
  });

  // Recent visited verses history
  const [recentVerses, setRecentVerses] = useState<DailyAyatVerse[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_recent_daily_ayats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [getTodayVerse()];
  });

  const [activeTab, setActiveTab] = useState<'verse' | 'bookmarks' | 'history'>('verse');

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_saved_daily_ayats', JSON.stringify(bookmarkedVerses));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedVerses]);

  // Sync Recent to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('abdicity_recent_daily_ayats', JSON.stringify(recentVerses));
    } catch (e) {
      console.error(e);
    }
  }, [recentVerses]);

  // Audio setup and cleanup
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      setAudioProgress(0);
      setAudioError(false);
    }
  }, [currentVerse]);

  // Allow Escape key to exit Mode Baca
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

  const togglePlayAudio = () => {
    if (!currentVerse.audioUrl) {
      setAudioError(true);
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(currentVerse.audioUrl);
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setAudioError(true);
      };
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.src = currentVerse.audioUrl;
      audioRef.current.play()
        .then(() => {
          setIsPlayingAudio(true);
          setAudioError(false);
        })
        .catch(() => {
          setAudioError(true);
          setIsPlayingAudio(false);
        });
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // Fetch random verse from public Al-Quran Cloud API or curated fallback
  const handleFetchRandomVerse = async () => {
    setIsLoadingRandom(true);
    setFetchError(null);

    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    // Generate random global ayah number (between 1 and 6236)
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-uthmani,id.indonesian,en.sahih`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API response status: ${res.status}`);
      }

      const json = await res.json();
      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
        const arabicData = json.data[0];
        const indoData = json.data[1];
        const englishData = json.data[2] || null;

        const newVerse: DailyAyatVerse = {
          id: `ayah-${randomAyahNumber}`,
          surahNumber: arabicData.surah.number,
          surahName: arabicData.surah.name,
          surahLatinName: arabicData.surah.englishName,
          surahTranslation: arabicData.surah.englishNameTranslation || 'Kitab Suci Al-Qur\'an',
          ayahNumber: arabicData.numberInSurah,
          globalAyahNumber: arabicData.number,
          juzNumber: arabicData.juz,
          revelationType: arabicData.surah.revelationType === 'Meccan' ? 'Makkiyyah' : 'Madaniyyah',
          arabic: arabicData.text,
          latin: `QS. ${arabicData.surah.englishName} : ${arabicData.numberInSurah}`,
          translationId: indoData.text,
          translationEn: englishData ? englishData.text : undefined,
          tafsirSummary: `Ayat ke-${arabicData.numberInSurah} dari Surah ${arabicData.surah.englishName}. Merupakan firman Allah SWT yang menjadi panduan hidup, penenteram kalbu, dan pengingat ketaqwaan bagi orang-orang beriman.`,
          theme: `Tadabbur Surah ${arabicData.surah.englishName}`,
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${arabicData.number}.mp3`
        };

        setCurrentVerse(newVerse);
        addRecentVerse(newVerse);
        setActiveTab('verse');
      } else {
        throw new Error('Data format invalid');
      }
    } catch (err) {
      console.warn('Al-Quran API fallback to curated pool:', err);
      // Fallback: Pick a different verse from curated list
      const remaining = CURATED_DAILY_AYAT_LIST.filter((v) => v.id !== currentVerse.id);
      const randomCurated = remaining[Math.floor(Math.random() * remaining.length)] || CURATED_DAILY_AYAT_LIST[0];
      setCurrentVerse(randomCurated);
      addRecentVerse(randomCurated);
      setActiveTab('verse');
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const addRecentVerse = (verse: DailyAyatVerse) => {
    setRecentVerses((prev) => {
      const filtered = prev.filter((v) => v.id !== verse.id);
      return [verse, ...filtered.slice(0, 14)];
    });
  };

  const isBookmarked = bookmarkedVerses.some((v) => v.id === currentVerse.id);

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarkedVerses((prev) => prev.filter((v) => v.id !== currentVerse.id));
    } else {
      setBookmarkedVerses((prev) => [currentVerse, ...prev]);
    }
  };

  const getShareText = () => {
    return `📖 *AYAT HARIAN ABDICITY* 📖
QS. ${currentVerse.surahLatinName} [${currentVerse.surahNumber}]: Ayat ${currentVerse.ayahNumber}

${currentVerse.arabic}

"${currentVerse.translationId}"

💡 *Tadabbur:*
${currentVerse.tafsirSummary}

✨ Dibagikan dari Ekosistem Digital ABDICity.cloud - Pilar Berdakwah Kaffah`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ayat Harian: QS. ${currentVerse.surahLatinName}: ${currentVerse.ayahNumber}`,
          text: getShareText(),
          url: window.location.href
        });
      } catch (e) {
        console.log('Share canceled', e);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `" ${currentVerse.translationId} " (QS. ${currentVerse.surahLatinName}: ${currentVerse.ayahNumber}) #AyatHarian #ABDICity`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // Format today's date in Indonesian
  const formattedTodayDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
                Mode Baca · QS. {currentVerse.surahLatinName} [{currentVerse.surahNumber}:{currentVerse.ayahNumber}]
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Surface Comfort Toggle */}
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

              {/* Font Size Selector */}
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

          {/* Pure Arabic & Translation Text */}
          <div className="space-y-8 py-4">
            <p
              dir="rtl"
              className={`text-right font-serif select-text transition-all ${
                isPaper ? 'text-stone-900' : 'text-amber-50'
              } ${
                fontSize === 'md'
                  ? 'text-2xl sm:text-3xl leading-[2.3]'
                  : fontSize === 'lg'
                  ? 'text-3xl sm:text-4xl leading-[2.4]'
                  : 'text-4xl sm:text-5xl leading-[2.5]'
              }`}
              style={{ fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', serif" }}
            >
              {currentVerse.arabic}
            </p>

            {showLatin && currentVerse.latin && (
              <p
                className={`text-sm sm:text-base font-serif italic leading-relaxed ${
                  isPaper ? 'text-stone-600' : 'text-emerald-300/90'
                }`}
              >
                {currentVerse.latin}
              </p>
            )}

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
                "{currentVerse.translationId}"
              </p>

              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isPaper ? 'text-stone-600' : 'text-emerald-300/85'
                }`}
              >
                {currentVerse.tafsirSummary}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HERO BANNER CARD */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-white rounded-3xl border-2 border-amber-400/70 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon & Subnav */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold shadow-inner">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-amber-300 text-xl sm:text-2xl leading-tight">
                  Ayat Harian (Daily Ayat)
                </h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Pilihan Hari Ini
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{formattedTodayDate}</span>
                <span>•</span>
                <span>Penyejuk Jiwa & Cahaya Hidayah</span>
              </p>
            </div>
          </div>

          {/* Action Tabs + Mode Baca Toggle */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setActiveTab('verse');
                setIsReadingMode(true);
              }}
              className="bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-amber-400/40 transition-colors"
              title="Buka Mode Baca (Focus Reading) untuk tadabbur tanpa gangguan"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Mode Baca</span>
            </button>

            <div className="flex items-center gap-1.5 bg-emerald-900/80 p-1.5 rounded-2xl border border-emerald-700/60">
              <button
                onClick={() => setActiveTab('verse')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'verse'
                    ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ayat</span>
              </button>

              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'bookmarks'
                    ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Favorit ({bookmarkedVerses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Riwayat</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: MAIN DAILY VERSE DISPLAY */}
        {activeTab === 'verse' && (
          <div className="pt-6 space-y-6 relative z-10">
            {/* Surah Identification Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-mono font-black text-sm flex items-center justify-center shadow-md">
                  {currentVerse.surahNumber}:{currentVerse.ayahNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base font-serif">
                      Surah {currentVerse.surahLatinName}
                    </h4>
                    <span className="font-serif text-amber-300 text-lg font-bold">
                      {currentVerse.surahName}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200">
                    Artinya: "{currentVerse.surahTranslation}" • {currentVerse.revelationType}
                    {currentVerse.juzNumber ? ` • Juz ${currentVerse.juzNumber}` : ''}
                  </p>
                </div>
              </div>

              {/* Theme & Controls Button Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-800/90 text-amber-300 font-bold text-[11px] px-3 py-1 rounded-xl border border-amber-400/30">
                  {currentVerse.theme}
                </span>

                {/* Font Size Selector */}
                <div className="flex items-center bg-emerald-950/70 rounded-xl border border-emerald-700/70 p-0.5 text-[11px]">
                  <button
                    onClick={() => setFontSize('md')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      fontSize === 'md' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-200'
                    }`}
                    title="Ukuran Font Sedang"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      fontSize === 'lg' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-200'
                    }`}
                    title="Ukuran Font Besar"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xl')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      fontSize === 'xl' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-200'
                    }`}
                    title="Ukuran Font Ekstra Besar"
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>

            {/* Arabic Verse Container with Vowel Marks */}
            <div className="bg-emerald-950/70 rounded-3xl p-6 sm:p-8 border border-emerald-700/60 shadow-inner relative group">
              <div className="text-right">
                <p
                  className={`font-serif leading-[2.3] text-white font-medium select-text tracking-wide transition-all ${
                    fontSize === 'md'
                      ? 'text-xl sm:text-2xl'
                      : fontSize === 'lg'
                      ? 'text-2xl sm:text-3xl'
                      : 'text-3xl sm:text-4xl leading-[2.5]'
                  }`}
                  style={{ fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', serif" }}
                  dir="rtl"
                >
                  {currentVerse.arabic}
                </p>
              </div>

              {/* Latin Transliteration (Toggleable) */}
              {showLatin && currentVerse.latin && (
                <div className="mt-5 pt-4 border-t border-emerald-800/80">
                  <p className="text-xs sm:text-sm text-emerald-300/90 font-serif italic leading-relaxed">
                    {currentVerse.latin}
                  </p>
                </div>
              )}
            </div>

            {/* Indonesian & English Translation */}
            <div className="bg-gradient-to-r from-emerald-900/60 to-teal-900/60 p-5 sm:p-6 rounded-2xl border border-emerald-700/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-b border-emerald-800/60 pb-2">
                <span>Terjemahan Kemenag RI:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLatin(!showLatin)}
                    className="text-[11px] text-emerald-200 hover:text-amber-300 flex items-center gap-1 transition-all"
                  >
                    {showLatin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showLatin ? 'Sembunyikan Latin' : 'Tampilkan Latin'}</span>
                  </button>

                  <button
                    onClick={() => setShowEnglish(!showEnglish)}
                    className="text-[11px] text-emerald-200 hover:text-amber-300 flex items-center gap-1 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{showEnglish ? 'Tutup Inggris' : 'Versi Inggris'}</span>
                  </button>
                </div>
              </div>

              <p className="text-sm sm:text-base text-emerald-100 font-serif leading-relaxed">
                "{currentVerse.translationId}"
              </p>

              {showEnglish && currentVerse.translationEn && (
                <div className="pt-2 border-t border-emerald-800/60">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                    English Translation (Sahih International):
                  </span>
                  <p className="text-xs text-emerald-200 italic leading-relaxed">
                    "{currentVerse.translationEn}"
                  </p>
                </div>
              )}
            </div>

            {/* Murottal Audio Player Card */}
            {currentVerse.audioUrl && (
              <div className="bg-emerald-900/70 p-4 rounded-2xl border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayAudio}
                    className="w-11 h-11 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 flex-shrink-0"
                    title={isPlayingAudio ? 'Jeda Audio Murottal' : 'Putar Audio Murottal'}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Lantunan Murottal: Syaikh Mishary Rashid Alafasy</span>
                    </span>
                    <p className="text-[11px] text-emerald-200">
                      Audio qari resmi jernih untuk mentadabburi makhorijul huruf & tartil
                    </p>
                  </div>
                </div>

                {/* Progress bar / restart */}
                <div className="flex items-center gap-3">
                  <div className="w-32 sm:w-40 bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-800">
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <button
                    onClick={restartAudio}
                    className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800"
                    title="Ulangi dari Awal"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tadabbur & Hikmah Explanation */}
            <div className="bg-gradient-to-r from-amber-400/10 via-emerald-800/20 to-teal-900/20 p-5 rounded-2xl border border-amber-400/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Sparkle className="w-4 h-4" />
                <span>Mutiara Tadabbur & Hikmah Ayat:</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/95 leading-relaxed font-sans">
                {currentVerse.tafsirSummary}
              </p>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-800/80">
              {/* Left Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleFetchRandomVerse}
                  disabled={isLoadingRandom}
                  className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
                  title="Dapatkan Ayat Qur'an Lain Secara Acak"
                >
                  {isLoadingRandom ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-950" />
                  ) : (
                    <Shuffle className="w-4 h-4 text-emerald-950" />
                  )}
                  <span>{isLoadingRandom ? 'Memuat Ayat...' : 'Acak Ayat Lain'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-600 transition-all"
                  title="Salin Ayat & Terjemah"
                >
                  {copied ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Ayat'}</span>
                </button>

                <button
                  onClick={toggleBookmark}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    isBookmarked
                      ? 'bg-amber-400 text-emerald-950 border-amber-300 font-extrabold'
                      : 'bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-600'
                  }`}
                  title={isBookmarked ? 'Hapus dari Favorit' : 'Simpan ke Ayat Favorit'}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-emerald-950" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-600 transition-all"
                  title="Bagikan Ayat Ini"
                >
                  <Share2 className="w-4 h-4 text-amber-300" />
                  <span>Bagikan</span>
                </button>
              </div>

              {/* Right Workflow Link Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {onNavigateToPoster && (
                  <button
                    onClick={() =>
                      onNavigateToPoster(
                        `Kajian Ayat: QS. ${currentVerse.surahLatinName} ayat ${currentVerse.ayahNumber} - "${currentVerse.translationId}"`
                      )
                    }
                    className="bg-gradient-to-r from-teal-800 to-emerald-800 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-teal-600 shadow-xs transition-all"
                    title="Buat Poster Dakwah Media Sosial dari Ayat Ini"
                  >
                    <Image className="w-4 h-4 text-amber-300" />
                    <span>Jadikan Poster Dakwah</span>
                  </button>
                )}

                {onNavigateToQuran && (
                  <button
                    onClick={() => onNavigateToQuran(currentVerse.surahNumber)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-600 transition-all"
                    title="Buka Surah Penuh di Al-Qur'an Digital"
                  >
                    <span>Baca Surah Penuh</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKMARKED AYATS */}
        {activeTab === 'bookmarks' && (
          <div className="pt-6 space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <h4 className="font-bold text-base text-amber-300 font-serif flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>Ayat Pilihan Tersimpan ({bookmarkedVerses.length})</span>
              </h4>
              <button
                onClick={() => setActiveTab('verse')}
                className="text-xs text-emerald-200 hover:text-white font-bold"
              >
                Kembali ke Ayat Utama
              </button>
            </div>

            {bookmarkedVerses.length === 0 ? (
              <div className="p-8 text-center text-emerald-200 space-y-2 bg-emerald-900/40 rounded-2xl border border-emerald-800">
                <Bookmark className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="text-xs">Belum ada ayat yang disimpan ke favorit.</p>
                <p className="text-[11px] text-emerald-300">
                  Tekan tombol "Simpan" pada ayat yang sedang Anda baca untuk menyimpannya di sini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {bookmarkedVerses.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setCurrentVerse(v);
                      setActiveTab('verse');
                    }}
                    className="bg-emerald-900/60 hover:bg-emerald-800/80 p-4 rounded-2xl border border-emerald-700/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md font-mono">
                        QS. {v.surahLatinName} : {v.ayahNumber}
                      </span>
                      <span className="font-serif text-amber-300 text-sm font-bold">
                        {v.surahName}
                      </span>
                    </div>

                    <p className="font-serif text-right text-base text-white line-clamp-2" dir="rtl">
                      {v.arabic}
                    </p>

                    <p className="text-xs text-emerald-100 line-clamp-2">"{v.translationId}"</p>

                    <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-[11px] text-emerald-300">
                      <span>{v.theme}</span>
                      <span className="group-hover:text-amber-300 font-bold flex items-center gap-1">
                        Baca <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RECENT VERSES HISTORY */}
        {activeTab === 'history' && (
          <div className="pt-6 space-y-4 relative z-10">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <h4 className="font-bold text-base text-amber-300 font-serif flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Riwayat Ayat yang Baru Saja Dibaca ({recentVerses.length})</span>
              </h4>
              <button
                onClick={() => setActiveTab('verse')}
                className="text-xs text-emerald-200 hover:text-white font-bold"
              >
                Kembali ke Ayat Utama
              </button>
            </div>

            <div className="space-y-2.5">
              {recentVerses.map((v, idx) => (
                <div
                  key={`${v.id}-${idx}`}
                  onClick={() => {
                    setCurrentVerse(v);
                    setActiveTab('verse');
                  }}
                  className="bg-emerald-900/50 hover:bg-emerald-800/70 p-3.5 rounded-xl border border-emerald-800/80 cursor-pointer transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-xs text-white">
                          QS. {v.surahLatinName} : {v.ayahNumber}
                        </h5>
                        <span className="text-[10px] text-emerald-300 font-mono">
                          ({v.surahName})
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200 truncate max-w-md">
                        {v.translationId}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1 flex-shrink-0">
                    Buka <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SHARE MODAL FALLBACK */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-emerald-100">
            <h4 className="font-bold font-serif text-emerald-950 text-base text-center">
              Bagikan Ayat Harian
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleWhatsAppShare}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Bagikan ke WhatsApp</span>
              </button>
              <button
                onClick={handleTwitterShare}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Bagikan ke X / Twitter</span>
              </button>
              <button
                onClick={() => {
                  handleCopy();
                  setShowShareModal(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Teks Lengkap</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full text-xs text-gray-500 hover:text-gray-700 py-1 font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
