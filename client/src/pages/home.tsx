import { useState } from 'react';
import { SetupModal } from '@/components/setup-modal';
import { GameBoard } from '@/components/game-board';
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
      brand: "MC",
      brandFull: "MORAL CROSSROADS",
      subtitle: "Interactive Ethical Dilemmas",
      donate: "Donate 💖",
      profile: "Profile Board"
    },
    ar: {
      brand: "م ق",
      brandFull: "مفترق الأخلاق",
      subtitle: "معضلات أخلاقية تفاعلية", 
      donate: "تبرع 💖",
      profile: "لوحة الملف الشخصي"
    }
  };

  return (
    <div className={`min-h-screen bg-white font-inter ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SetupModal
        isOpen={state.showSetup}
        onComplete={handleSetupComplete}
        language={language}
      />

      {state.gameStarted && (
        <>
          {/* Clean Neal.fun Style Header */}
          <header className="p-6 border-b-2 border-black">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Left - MC Logo */}
                <div className="neal-box p-4">
                  <h1 className="text-2xl font-bold text-black">{texts[language].brand}</h1>
                  <p className="text-xs text-gray-600 mt-1">{texts[language].brandFull}</p>
                </div>
                
                {/* Right - Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleLanguage}
                    className="neal-box px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50"
                  >
                    {language === 'en' ? 'العربية' : 'English'}
                  </button>
                  <div className="neal-box px-4 py-2 text-sm bg-gray-100">
                    {texts[language].profile}
                  </div>
                  <div className="relative">
                    <a
                      href="https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neal-box px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
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
            <GameBoard
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
