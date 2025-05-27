import { useState } from 'react';
import { SetupModal } from '@/components/setup-modal';
import { MoralCrossroads } from '@/components/moral-crossroads';
import { useGameState } from '@/hooks/use-game-state';

export default function Home() {
  const { state, actions } = useGameState();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [donateAnimations, setDonateAnimations] = useState(0);

  const handleSetupComplete = (playerId: number, name: string, gender: string) => {
    actions.setPlayer(playerId, name, gender);
    actions.startGame();
  };

  const handleNextLevel = () => {
    actions.nextLevel();
    // Show donate animation every 3 levels
    if (state.currentLevel % 3 === 0) {
      setDonateAnimations(prev => prev + 1);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const texts = {
    en: {
      brand: "MORAL CROSSROADS",
      subtitle: "Interactive Ethical Dilemmas",
      title: "Moral Crossroads",
      donate: "Donate 💖",
      profile: "Profile Board"
    },
    ar: {
      brand: "مفترق الأخلاق",
      subtitle: "معضلات أخلاقية تفاعلية", 
      title: "مفترق الأخلاق",
      donate: "تبرع 💖",
      profile: "لوحة الملف الشخصي"
    }
  };

  return (
    <div className={`min-h-screen bg-white font-inter ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <SetupModal
        isOpen={state.showSetup}
        onComplete={handleSetupComplete}
        language={language}
      />

      {state.gameStarted && (
        <>
          {/* Header */}
          <header className="p-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Left - Brand Logo */}
                <div className="fancy-box bg-blue-500 text-white p-4">
                  <h1 className="text-lg font-bold">{texts[language].brand}</h1>
                  <p className="text-sm opacity-90">{texts[language].subtitle}</p>
                </div>
                
                {/* Center - Level Title */}
                <div className="fancy-box bg-purple-400 text-white p-4 text-center">
                  <h2 className="text-xl font-bold">
                    Level {state.currentLevel}: {texts[language].title}
                  </h2>
                </div>
                
                {/* Right - Profile & Controls */}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={toggleLanguage}
                    className="fancy-box bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200"
                  >
                    {language === 'en' ? 'العربية' : 'English'}
                  </button>
                  <div className="fancy-box bg-blue-600 text-white px-3 py-2 text-sm">
                    {texts[language].profile}
                  </div>
                  <div className="relative">
                    <a
                      href="https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fancy-box bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      {texts[language].donate}
                    </a>
                    {donateAnimations > 0 && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 animate-bounce">
                        <span className="text-red-500 text-xl">→</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Game Content */}
          {state.playerId && (
            <MoralCrossroads
              playerId={state.playerId}
              playerName={state.playerName}
              playerGender={state.playerGender}
              currentLevel={state.currentLevel}
              language={language}
              onNextLevel={handleNextLevel}
            />
          )}
        </>
      )}
    </div>
  );
}
