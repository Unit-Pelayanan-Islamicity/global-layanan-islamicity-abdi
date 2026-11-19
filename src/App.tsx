import React, { useState } from 'react';
import { PillarType } from './types';
import { Header } from './components/Header';
import { PrayerTimeBanner } from './components/PrayerTimeBanner';
import { PillarBerdakwah } from './components/PillarBerdakwah';
import { PillarBersyariah } from './components/PillarBersyariah';
import { PillarBerjamaah } from './components/PillarBerjamaah';
import { PillarBermuamalah } from './components/PillarBermuamalah';
import { InfaqModal } from './components/InfaqModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GcpFacilitatorModal } from './components/GcpFacilitatorModal';
import { Footer } from './components/Footer';
import { PlatformStudio } from './components/PlatformStudio';
import { MurottalProvider } from './context/MurottalContext';
import { ThemeProvider } from './context/ThemeContext';
import { MurottalFloatingPlayer } from './components/MurottalFloatingPlayer';
import { MurottalStudioModal } from './components/MurottalStudioModal';

export default function App() {
  const [activePillar, setActivePillar] = useState<PillarType>('platform');
  const [selectedCity, setSelectedCity] = useState<string>('Jakarta Pusat');

  // Modal States
  const [isInfaqModalOpen, setIsInfaqModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGcpModalOpen, setIsGcpModalOpen] = useState(false);
  const [infaqTitle, setInfaqTitle] = useState('Infaq & Sedekah Umum ABDICity');
  const [infaqAmount, setInfaqAmount] = useState(50000);

  const handleOpenInfaqModal = (title?: string, amount?: number) => {
    if (title) setInfaqTitle(title);
    if (amount) setInfaqAmount(amount);
    setIsInfaqModalOpen(true);
  };

  return (
    <ThemeProvider>
      <MurottalProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-amber-400 selection:text-emerald-950 pb-16 transition-colors duration-200">
        {/* Header Navbar */}
        <Header
          activePillar={activePillar}
          setActivePillar={setActivePillar}
          onOpenInfaqModal={() => handleOpenInfaqModal()}
        />

        {/* Real-time Prayer Times, City Selector & Ayah Ticker Banner */}
        <PrayerTimeBanner
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          onOpenUserProfile={() => setIsProfileModalOpen(true)}
          onOpenGcpFacilitator={() => setIsGcpModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Superapp Infrastructure Platform & 4B Builder Studio */}
          {activePillar === 'platform' && (
            <PlatformStudio
              onNavigatePillar={setActivePillar}
              onOpenInfaqModal={handleOpenInfaqModal}
            />
          )}

          {/* Active 4B Pillar Content Component */}
          {activePillar === 'berdakwah' && (
            <PillarBerdakwah onOpenInfaqModal={handleOpenInfaqModal} />
          )}

          {activePillar === 'bersyariah' && (
            <PillarBersyariah onOpenInfaqModal={handleOpenInfaqModal} />
          )}

          {activePillar === 'berjamaah' && (
            <PillarBerjamaah onOpenInfaqModal={handleOpenInfaqModal} />
          )}

          {activePillar === 'bermuamalah' && <PillarBermuamalah />}
        </main>

        {/* Footer */}
        <Footer
          onSelectPillar={setActivePillar}
          onOpenGcpFacilitator={() => setIsGcpModalOpen(true)}
        />

        {/* Infaq & Zakat Transaction Modal */}
        <InfaqModal
          isOpen={isInfaqModalOpen}
          onClose={() => setIsInfaqModalOpen(false)}
          defaultTitle={infaqTitle}
          defaultAmount={infaqAmount}
        />

        {/* User Profile & Charity Bar Chart Modal */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenInfaqModal={handleOpenInfaqModal}
        />

        {/* Google Cloud Platform Intelligent Facilitator Modal */}
        <GcpFacilitatorModal
          isOpen={isGcpModalOpen}
          onClose={() => setIsGcpModalOpen(false)}
        />

        {/* Persistent Floating Murottal Player & Prayer Sync Widget */}
        <MurottalFloatingPlayer />

        {/* Comprehensive Murottal Studio & Prayer Scheduler Modal */}
        <MurottalStudioModal />
        </div>
      </MurottalProvider>
    </ThemeProvider>
  );
}
