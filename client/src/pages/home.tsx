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
    <div className={`min-h-screen font-inter ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Animated Starfield Background */}
      <div className="starfield-bg"></div>
      
      <SetupModal
        isOpen={state.showSetup}
        onComplete={handleSetupComplete}
        language={language}
      />

      {state.gameStarted && (
        <>
          {/* Futuristic Header */}
          <header className="p-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Left - MC Logo */}
                <div className="glass-panel p-4">
                  <h1 className="text-3xl font-bold neon-text">{texts[language].brand}</h1>
                  <p className="text-xs text-blue-300 mt-1">{texts[language].brandFull}</p>
                </div>
                
                {/* Right - Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleLanguage}
                    className="glass-panel px-4 py-2 text-sm font-medium text-white hover:text-blue-300 transition-colors"
                  >
                    {language === 'en' ? 'العربية' : 'English'}
                  </button>
                  <div className="glass-panel px-4 py-2 text-sm text-purple-300">
                    {texts[language].profile}
                  </div>
                  <div className="relative">
                    <a
                      href="https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`glass-panel px-4 py-2 text-sm font-medium text-white transition-colors border border-red-400 ${
                        donateAnimations > 0 ? 'donate-pulse' : ''
                      }`}
                      style={{
                        background: 'linear-gradient(45deg, rgba(255, 0, 85, 0.2), rgba(255, 0, 85, 0.1))'
                      }}
                    >
                      {texts[language].donate}
                    </a>
                    {donateAnimations > 0 && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 animate-bounce">
                        <span style={{ color: 'var(--neon-red)' }} className="text-xl">→</span>
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
