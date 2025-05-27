import { SetupModal } from '@/components/setup-modal';
import { GameBoard } from '@/components/game-board';
import { useGameState } from '@/hooks/use-game-state';

export default function Home() {
  const { state, actions } = useGameState();

  const handleSetupComplete = (playerId: number, name: string, gender: string) => {
    actions.setPlayer(playerId, name, gender);
    actions.startGame();
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <SetupModal
        isOpen={state.showSetup}
        onComplete={handleSetupComplete}
      />

      {state.gameStarted && (
        <>
          {/* Header */}
          <header className="p-6 border-b-4 border-black">
            <div className="max-w-4xl mx-auto">
              {/* Branding Box */}
              <div className="fancy-box bg-gray-50 p-4 mb-4 inline-block">
                <h1 className="text-2xl font-bold">BORAQ RAILWAY</h1>
                <p className="text-sm text-gray-600">Ethical Dilemma Simulator</p>
              </div>
              
              {/* Title Box */}
              <div className="fancy-box bg-white p-6">
                <h2 className="text-4xl font-bold text-center">Absurd Trolley Problems</h2>
              </div>
            </div>
          </header>

          {/* Game Board */}
          {state.playerId && (
            <GameBoard
              playerId={state.playerId}
              playerName={state.playerName}
              currentLevel={state.currentLevel}
              onNextLevel={actions.nextLevel}
            />
          )}

          {/* Footer */}
          <footer className="mt-16 p-6 border-t-4 border-black bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-600">Inspired by philosophical thought experiments and ethical dilemmas</p>
              <p className="text-sm text-gray-500 mt-2">Built with modern web technologies</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
