import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CharacterScene } from './character-scene';
import { UserProfile } from './user-profile';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Scenario } from '@shared/schema';

interface MoralCrossroadsProps {
  playerId: number;
  playerName: string;
  playerGender: string;
  currentLevel: number;
  language: 'en' | 'ar';
  onNextLevel: () => void;
}

export function MoralCrossroads({ 
  playerId, 
  playerName, 
  playerGender, 
  currentLevel, 
  language, 
  onNextLevel 
}: MoralCrossroadsProps) {
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [statusText, setStatusText] = useState('');

  const { data: scenario, isLoading: scenarioLoading } = useQuery<Scenario>({
    queryKey: [`/api/scenarios/level/${currentLevel}`],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/scenarios/${scenario?.id}/stats`],
    enabled: !!scenario?.id && showResults,
  });

  const voteMutation = useMutation({
    mutationFn: async (choice: string) => {
      const response = await apiRequest('POST', '/api/votes', {
        scenarioId: scenario!.id,
        choice: choice === 'green' ? 'choice1' : 'choice2',
        playerId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/scenarios/${scenario?.id}/stats`] });
    },
  });

  const handleChoice = async (choice: 'green' | 'red') => {
    setCurrentChoice(choice);
    setIsAnimating(true);
    
    const statusTexts = {
      en: { green: 'Activating mechanism...', red: 'Accepting fate...' },
      ar: { green: 'تفعيل الآلية...', red: 'قبول القدر...' }
    };
    
    setStatusText(statusTexts[language][choice]);
    
    if (scenario) {
      await voteMutation.mutateAsync(choice);
    }

    // Simulate animation delay
    setTimeout(() => {
      setIsAnimating(false);
      setShowResults(true);
      setStatusText('');
    }, 2500);
  };

  const handleNextLevel = () => {
    setCurrentChoice(null);
    setIsAnimating(false);
    setShowResults(false);
    setStatusText('');
    onNextLevel();
  };

  // Reset state when level changes
  useEffect(() => {
    setCurrentChoice(null);
    setIsAnimating(false);
    setShowResults(false);
    setStatusText('');
  }, [currentLevel]);

  if (scenarioLoading || !scenario) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center">Loading scenario...</div>
      </div>
    );
  }

  const title = language === 'ar' && scenario.titleArabic ? scenario.titleArabic : scenario.title;
  const description = language === 'ar' && scenario.descriptionArabic ? scenario.descriptionArabic : scenario.description;
  const choice1Text = language === 'ar' && scenario.choice1Arabic ? scenario.choice1Arabic : scenario.choice1;
  const choice2Text = language === 'ar' && scenario.choice2Arabic ? scenario.choice2Arabic : scenario.choice2;

  return (
    <main className="max-w-6xl mx-auto p-4">
      {/* Scenario Description */}
      <div className="fancy-box bg-orange-400 text-white p-6 mb-6">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-lg leading-relaxed">{description}</p>
      </div>

      {/* Status Text */}
      {statusText && (
        <div className="text-center text-xl font-bold text-blue-600 mb-4">
          {statusText}
        </div>
      )}

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* First Choice Button */}
        <div className="order-1 lg:order-1">
          <Button
            onClick={() => handleChoice('green')}
            disabled={!!currentChoice || voteMutation.isPending}
            className={`w-full h-32 fancy-box text-white text-lg font-bold transition-all duration-300 ${
              currentChoice === 'green' 
                ? 'bg-green-600 scale-95 shadow-[2px_2px_0px_#000]' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-2">○</div>
              <div className="text-sm">{choice1Text}</div>
            </div>
          </Button>
        </div>

        {/* User Profile (Center) */}
        <div className="order-3 lg:order-2">
          <UserProfile 
            playerName={playerName}
            playerGender={playerGender}
            language={language}
          />
        </div>

        {/* Second Choice Button */}
        <div className="order-2 lg:order-3">
          <Button
            onClick={() => handleChoice('red')}
            disabled={!!currentChoice || voteMutation.isPending}
            className={`w-full h-32 fancy-box text-white text-lg font-bold transition-all duration-300 ${
              currentChoice === 'red' 
                ? 'bg-red-600 scale-95 shadow-[2px_2px_0px_#000]' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-2">✕</div>
              <div className="text-sm">{choice2Text}</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Character Scene */}
      <CharacterScene
        scenario={scenario}
        choice={currentChoice}
        isAnimating={isAnimating}
        language={language}
      />

      {/* Voting Statistics */}
      {showResults && stats && (
        <div className="fancy-box bg-blue-200 p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">
            {language === 'ar' ? 'إحصائيات التصويت:' : 'Voting Statistics:'}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>{choice1Text}</span>
                <span className="font-bold text-green-600">{stats.choice1Percent || 0}%</span>
              </div>
              <Progress 
                value={stats.choice1Percent || 0} 
                className="h-3 bg-gray-200"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>{choice2Text}</span>
                <span className="font-bold text-red-600">{stats.choice2Percent || 0}%</span>
              </div>
              <Progress 
                value={stats.choice2Percent || 0} 
                className="h-3 bg-gray-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {showResults && (
        <div className="flex justify-center">
          <Button
            onClick={handleNextLevel}
            className="fancy-box bg-purple-500 text-white px-8 py-3 font-semibold hover:bg-purple-600 transition-colors"
          >
            {language === 'ar' ? 'التالي ←' : 'Next →'}
          </Button>
        </div>
      )}
    </main>
  );
}