import React from 'react';
import { PillarType } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Cpu,
  BookOpen,
  ShieldCheck,
  Users,
  ShoppingBag,
  HeartHandshake,
  Moon,
  Sun
} from 'lucide-react';

interface HeaderProps {
  activePillar: PillarType;
  setActivePillar: (pillar: PillarType) => void;
  onOpenInfaqModal: () => void;
}

const NAV_ITEMS: { id: PillarType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'platform', label: 'Platform Studio', icon: Cpu },
  { id: 'berdakwah', label: '1. Berdakwah', icon: BookOpen },
  { id: 'bersyariah', label: '2. Bersyariah', icon: ShieldCheck },
  { id: 'berjamaah', label: '3. Berjamaah', icon: Users },
  { id: 'bermuamalah', label: '4. Bermuamalah', icon: ShoppingBag }
];

export const Header: React.FC<HeaderProps> = ({
  activePillar,
  setActivePillar,
  onOpenInfaqModal
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 dark:bg-slate-950/95 backdrop-blur-md text-emerald-50 border-b border-emerald-800/70 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActivePillar('platform')}
          className="flex items-center gap-2.5 shrink-0 text-left focus:outline-none group"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-serif font-black text-base text-emerald-950 tracking-tight shadow-sm">
            4B
          </span>
          <span className="text-lg font-bold tracking-tight text-white font-serif whitespace-nowrap">
            ABDICity<span className="text-amber-400 font-sans text-sm font-semibold">.cloud</span>
          </span>
        </button>

        {/* Zone 2: Primary Navigation (Single Row) */}
        <nav
          aria-label="Navigasi Utama Platform 4B"
          className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePillar === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePillar(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 dark:bg-emerald-900 text-white border border-emerald-600/80 shadow-xs'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/70 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle & Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Malam (Dark Mode)'}
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Malam (Dark Mode)'}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-emerald-700/80 dark:border-slate-700 bg-emerald-900/80 dark:bg-slate-900 hover:bg-emerald-800 dark:hover:bg-slate-800 text-amber-300 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-300" />}
            <span className="hidden lg:inline">{isDark ? 'Mode Terang' : 'Mode Malam'}</span>
          </button>

          <button
            onClick={onOpenInfaqModal}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3.5 py-2 rounded-lg shadow-sm transition-colors whitespace-nowrap text-xs sm:text-sm"
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Infaq & Zakat</span>
            <span className="sm:hidden">Infaq</span>
          </button>
        </div>
      </div>
    </header>
  );
};
