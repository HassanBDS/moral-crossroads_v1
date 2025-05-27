import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Scenario } from '@shared/schema';

interface GameBoardProps {
  playerId: number;
  playerName: string;
  playerGender: string;
  currentLevel: number;
  language: 'en' | 'ar';
  onNextLevel: () => void;
}

export function GameBoard({ playerId, playerName, playerGender, currentLevel, language, onNextLevel }: GameBoardProps) {
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading scenario...</div>
      </div>
    );
  }

  const title = language === 'ar' && scenario.titleArabic ? scenario.titleArabic : scenario.title;
  const description = language === 'ar' && scenario.descriptionArabic ? scenario.descriptionArabic : scenario.description;
  const choice1Text = language === 'ar' && scenario.choice1Arabic ? scenario.choice1Arabic : scenario.choice1;
  const choice2Text = language === 'ar' && scenario.choice2Arabic ? scenario.choice2Arabic : scenario.choice2;

  const texts = {
    en: {
      stats: "Voting Statistics:",
      basedOn: "Based on",
      responses: "responses",
      next: "Next →"
    },
    ar: {
      stats: "إحصائيات التصويت:",
      basedOn: "بناءً على",
      responses: "إجابة",
      next: "التالي ←"
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Level Header */}
      <div className="neal-box bg-orange-100 p-6 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Level {currentLevel}: {title}</h2>
        <p className="text-lg leading-relaxed">{description}</p>
      </div>

      {/* Status Text */}
      {statusText && (
        <div className="text-center text-xl font-bold text-blue-600 mb-6">
          {statusText}
        </div>
      )}

      {/* Main Choice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Green Choice Button */}
        <div className="order-1 lg:order-1">
          <Button
            onClick={() => handleChoice('green')}
            disabled={!!currentChoice || voteMutation.isPending}
            className={`w-full h-40 neal-box text-white text-lg font-bold transition-all duration-300 ${
              currentChoice === 'green' 
                ? 'bg-green-600 scale-95 shadow-[2px_2px_0px_#000]' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <div className="text-center">
              <div className="text-7xl mb-3">○</div>
              <div className="text-sm px-2">{choice1Text}</div>
            </div>
          </Button>
        </div>

        {/* User Profile (Center) */}
        <div className="order-3 lg:order-2">
          <div className="neal-box bg-yellow-100 p-4 h-40 flex flex-col items-center justify-center">
            <div className="text-center">
              <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto mb-2">
                {/* Character Avatar */}
                <circle cx="40" cy="25" r="15" stroke="#000" strokeWidth="2" fill="#fff" />
                <circle cx="35" cy="22" r="2" fill="#000" />
                <circle cx="45" cy="22" r="2" fill="#000" />
                <path d="M 35 28 Q 40 32 45 28" stroke="#000" strokeWidth="2" fill="none" />
                <rect x="28" y="35" width="24" height="30" stroke="#000" strokeWidth="2" fill="#fff" rx="3" />
                <line x1="28" y1="45" x2="15" y2="55" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                <line x1="52" y1="45" x2="65" y2="55" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                <line x1="34" y1="65" x2="34" y2="85" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                <line x1="46" y1="65" x2="46" y2="85" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="text-xs font-medium">
                <div>{playerName}</div>
                <div>{playerGender}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Red Choice Button */}
        <div className="order-2 lg:order-3">
          <Button
            onClick={() => handleChoice('red')}
            disabled={!!currentChoice || voteMutation.isPending}
            className={`w-full h-40 neal-box text-white text-lg font-bold transition-all duration-300 ${
              currentChoice === 'red' 
                ? 'bg-red-600 scale-95 shadow-[2px_2px_0px_#000]' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <div className="text-center">
              <div className="text-7xl mb-3">✕</div>
              <div className="text-sm px-2">{choice2Text}</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Character Consequence Scenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Scene */}
        <div className="neal-box bg-purple-100 p-6 h-64">
          <h4 className="text-lg font-bold mb-4 text-center">
            {language === 'ar' ? 'المجموعة الأولى' : 'Group 1'}
          </h4>
          <div className="flex justify-center">
            <svg width="200" height="160" viewBox="0 0 200 160">
              {/* Render characters based on scenario type and animation state */}
              {Array.from({ length: scenario.type === 'consequence' ? 5 : scenario.type === 'bystander' ? 2 : 4 }, (_, i) => {
                const x = (i % 3) * 40 + 30;
                const y = Math.floor(i / 3) * 50 + 40;
                const isAffected = currentChoice === 'green' ? true : false;
                
                return (
                  <g key={i} transform={`translate(${x}, ${y})`}>
                    <circle 
                      cx="0" cy="0" r="12" 
                      stroke="#000" strokeWidth="2" 
                      fill={isAffected && showResults ? '#22c55e' : '#fff'}
                      className={isAnimating ? 'transition-all duration-1000' : ''}
                    />
                    <circle cx="-4" cy="-3" r="1.5" fill="#000" />
                    <circle cx="4" cy="-3" r="1.5" fill="#000" />
                    <path d="M -3 3 Q 0 6 3 3" stroke="#000" strokeWidth="1.5" fill="none" />
                    <line x1="0" y1="12" x2="0" y2="30" stroke="#000" strokeWidth="2" />
                    <line x1="0" y1="18" x2="-8" y2="26" stroke="#000" strokeWidth="2" />
                    <line x1="0" y1="18" x2="8" y2="26" stroke="#000" strokeWidth="2" />
                    {showResults && isAffected && (
                      <text x="0" y="40" textAnchor="middle" fontSize="8" fill="#22c55e">
                        {language === 'ar' ? 'آمن!' : 'Safe!'}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Scene */}
        <div className="neal-box bg-cyan-100 p-6 h-64">
          <h4 className="text-lg font-bold mb-4 text-center">
            {language === 'ar' ? 'المجموعة الثانية' : 'Group 2'}
          </h4>
          <div className="flex justify-center">
            <svg width="200" height="160" viewBox="0 0 200 160">
              {/* Single character for group 2 */}
              <g transform="translate(100, 80)">
                <circle 
                  cx="0" cy="0" r="12" 
                  stroke="#000" strokeWidth="2" 
                  fill={currentChoice === 'red' && showResults ? '#22c55e' : currentChoice === 'green' && showResults ? '#f59e0b' : '#fff'}
                  className={isAnimating ? 'transition-all duration-1000' : ''}
                />
                <circle cx="-4" cy="-3" r="1.5" fill="#000" />
                <circle cx="4" cy="-3" r="1.5" fill="#000" />
                <path d="M -3 3 Q 0 6 3 3" stroke="#000" strokeWidth="1.5" fill="none" />
                <line x1="0" y1="12" x2="0" y2="30" stroke="#000" strokeWidth="2" />
                <line x1="0" y1="18" x2="-8" y2="26" stroke="#000" strokeWidth="2" />
                <line x1="0" y1="18" x2="8" y2="26" stroke="#000" strokeWidth="2" />
                {showResults && currentChoice === 'green' && (
                  <text x="0" y="40" textAnchor="middle" fontSize="8" fill="#f59e0b">
                    {language === 'ar' ? 'ألم' : 'Pain'}
                  </text>
                )}
                {showResults && currentChoice === 'red' && (
                  <text x="0" y="40" textAnchor="middle" fontSize="8" fill="#22c55e">
                    {language === 'ar' ? 'آمن!' : 'Safe!'}
                  </text>
                )}
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Voting Statistics */}
      {showResults && stats && (
        <div className="neal-box bg-blue-50 p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">{texts[language].stats}</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>{choice1Text}</span>
                <span className="font-bold text-green-600">{(stats as any).choice1Percent || 0}%</span>
              </div>
              <Progress 
                value={(stats as any).choice1Percent || 0} 
                className="h-3 bg-gray-200"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>{choice2Text}</span>
                <span className="font-bold text-red-600">{(stats as any).choice2Percent || 0}%</span>
              </div>
              <Progress 
                value={(stats as any).choice2Percent || 0} 
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
            className="neal-box bg-purple-500 text-white px-8 py-3 font-semibold hover:bg-purple-600 transition-colors"
          >
            {texts[language].next}
          </Button>
        </div>
      )}
    </main>
  );
}
