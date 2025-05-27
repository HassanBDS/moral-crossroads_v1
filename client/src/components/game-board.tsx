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
    <main className="max-w-6xl mx-auto p-6 relative z-10">
      {/* Futuristic Level Header */}
      <div className="glass-panel p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4 neon-text">Level {currentLevel}: {title}</h2>
        <p className="text-lg leading-relaxed text-gray-200 max-w-4xl mx-auto">{description}</p>
      </div>

      {/* Status Text with Neon Effect */}
      {statusText && (
        <div className="text-center text-2xl font-bold mb-8" style={{ color: 'var(--neon-blue)' }}>
          <div className="animate-pulse">{statusText}</div>
        </div>
      )}

      {/* Main Choice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Green Choice Button */}
        <div className="order-1 lg:order-1">
          <button
            onClick={() => handleChoice('green')}
            disabled={!!currentChoice || voteMutation.isPending}
            className={`w-full h-48 neon-button green text-xl font-bold ${
              currentChoice === 'green' ? 'pressed' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-8xl mb-4">○</div>
              <div className="text-sm px-4 leading-tight">{choice1Text}</div>
            </div>
          </button>
        </div>

        {/* Enhanced User Profile (Center) */}
        <div className="order-3 lg:order-2">
          <div className="glass-panel p-6 h-48 flex flex-col items-center justify-center">
            <div className="profile-avatar w-20 h-20 mb-4">
              <div className="avatar-inner w-full h-full flex items-center justify-center">
                <svg width="60" height="70" viewBox="0 0 60 70" className="character-enhanced">
                  {/* Enhanced Character Avatar */}
                  <circle cx="30" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="26" cy="17" r="1.5" fill="currentColor" />
                  <circle cx="34" cy="17" r="1.5" fill="currentColor" />
                  <path d="M 26 23 Q 30 26 34 23" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="24" y="30" width="12" height="20" stroke="currentColor" strokeWidth="2" fill="none" rx="2" />
                  <line x1="24" y1="38" x2="16" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="36" y1="38" x2="44" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="27" y1="50" x2="27" y2="62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="33" y1="50" x2="33" y2="62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="text-center text-white">
              <div className="font-bold text-lg">{playerName}</div>
              <div className="text-sm text-blue-300 capitalize">{playerGender}</div>
            </div>
          </div>
        </div>

        {/* Red Choice Button */}
        <div className="order-2 lg:order-3">
          <button
            onClick={() => handleChoice('red')}
            disabled={!!currentChoice || voteMutation.isPending}
            className={`w-full h-48 neon-button red text-xl font-bold ${
              currentChoice === 'red' ? 'pressed' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-8xl mb-4">✕</div>
              <div className="text-sm px-4 leading-tight">{choice2Text}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Character Consequence Scenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left Consequence Scene */}
        <div className="glass-panel p-8 min-h-80">
          <h4 className="text-xl font-bold mb-6 text-center text-purple-300">
            {language === 'ar' ? 'المجموعة الأولى' : 'Group 1'}
          </h4>
          <div className="flex justify-center">
            <svg width="240" height="200" viewBox="0 0 240 200">
              {/* Render enhanced characters with better spacing and details */}
              {Array.from({ length: 5 }, (_, i) => {
                const positions = [
                  { x: 120, y: 60 },   // Center front
                  { x: 80, y: 80 },    // Left
                  { x: 160, y: 80 },   // Right
                  { x: 100, y: 100 },  // Back left
                  { x: 140, y: 100 }   // Back right
                ];
                const pos = positions[i];
                const isAffected = currentChoice === 'green';
                const shouldAnimate = isAnimating || showResults;
                
                return (
                  <g key={i} transform={`translate(${pos.x}, ${pos.y})`} 
                     className={`character-enhanced ${shouldAnimate && isAffected ? 'affected' : ''}`}>
                    {/* Enhanced character body */}
                    <circle 
                      cx="0" cy="-15" r="15" 
                      stroke="currentColor" strokeWidth="2" 
                      fill="none"
                      className="transition-all duration-1000"
                    />
                    {/* Eyes */}
                    <circle cx="-5" cy="-18" r="2" fill="currentColor" />
                    <circle cx="5" cy="-18" r="2" fill="currentColor" />
                    {/* Mouth - changes based on state */}
                    <path 
                      d={showResults && isAffected ? "M -5 -10 Q 0 -6 5 -10" : "M -5 -8 Q 0 -12 5 -8"} 
                      stroke="currentColor" strokeWidth="2" fill="none" 
                    />
                    {/* Body */}
                    <rect x="-8" y="0" width="16" height="25" stroke="currentColor" strokeWidth="2" fill="none" rx="3" />
                    {/* Arms */}
                    <line x1="-8" y1="8" x2="-20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="8" y1="8" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    {/* Legs */}
                    <line x1="-4" y1="25" x2="-4" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4" y1="25" x2="4" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    
                    {/* Status text */}
                    {showResults && (
                      <text x="0" y="55" textAnchor="middle" fontSize="10" 
                            fill={isAffected ? 'var(--neon-green)' : 'var(--neon-red)'}>
                        {isAffected ? (language === 'ar' ? 'آمن!' : 'Safe!') : 
                                     (language === 'ar' ? 'ضحية' : 'Victim')}
                      </text>
                    )}
                    
                    {/* Special labels for some characters */}
                    {i === 0 && (
                      <text x="0" y="-35" textAnchor="middle" fontSize="8" fill="var(--neon-blue)">
                        {language === 'ar' ? 'أمك' : 'Your Mom'}
                      </text>
                    )}
                    {i === 1 && (
                      <text x="0" y="-35" textAnchor="middle" fontSize="8" fill="var(--neon-purple)">
                        {language === 'ar' ? 'صديقك' : 'Friend'}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Consequence Scene */}
        <div className="glass-panel p-8 min-h-80">
          <h4 className="text-xl font-bold mb-6 text-center text-cyan-300">
            {language === 'ar' ? 'المجموعة الثانية' : 'Group 2'}
          </h4>
          <div className="flex justify-center">
            <svg width="240" height="200" viewBox="0 0 240 200">
              {/* Single character with pet */}
              <g transform="translate(120, 100)" 
                 className={`character-enhanced ${isAnimating || showResults ? 
                   (currentChoice === 'green' ? 'suffering' : 'affected') : ''}`}>
                {/* Main character */}
                <circle 
                  cx="0" cy="-15" r="15" 
                  stroke="currentColor" strokeWidth="2" 
                  fill="none"
                />
                <circle cx="-5" cy="-18" r="2" fill="currentColor" />
                <circle cx="5" cy="-18" r="2" fill="currentColor" />
                <path 
                  d={showResults && currentChoice === 'green' ? "M -5 -8 Q 0 -12 5 -8" : "M -5 -10 Q 0 -6 5 -10"} 
                  stroke="currentColor" strokeWidth="2" fill="none" 
                />
                <rect x="-8" y="0" width="16" height="25" stroke="currentColor" strokeWidth="2" fill="none" rx="3" />
                <line x1="-8" y1="8" x2="-20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="8" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="-4" y1="25" x2="-4" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="25" x2="4" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                
                {/* Pet dog/cat beside them */}
                <g transform="translate(25, 15)">
                  <ellipse cx="0" cy="0" rx="8" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="-6" cy="-3" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="-8" cy="-5" r="1" fill="currentColor" />
                  <circle cx="-4" cy="-5" r="1" fill="currentColor" />
                  <line x1="8" y1="-2" x2="15" y2="-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </g>
                
                {/* Status text */}
                {showResults && (
                  <text x="0" y="65" textAnchor="middle" fontSize="10" 
                        fill={currentChoice === 'green' ? 'var(--neon-red)' : 'var(--neon-green)'}>
                    {currentChoice === 'green' ? (language === 'ar' ? 'يعاني' : 'Suffering') : 
                                                (language === 'ar' ? 'آمن!' : 'Safe!')}
                  </text>
                )}
                
                {/* Character label */}
                <text x="0" y="-35" textAnchor="middle" fontSize="8" fill="var(--neon-blue)">
                  {language === 'ar' ? 'حيوانك الأليف' : 'Your Pet'}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Neal.fun Style Voting Statistics */}
      {showResults && stats && (
        <div className="glass-panel p-8 mb-12">
          <h3 className="font-semibold text-2xl mb-8 text-center neon-text">{texts[language].stats}</h3>
          <div className="flex justify-center">
            <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
              {/* Donut Chart Background */}
              <circle
                cx="150"
                cy="150"
                r="100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="20"
              />
              
              {/* Green Choice Arc */}
              <circle
                cx="150"
                cy="150"
                r="100"
                fill="none"
                stroke="var(--neon-green)"
                strokeWidth="20"
                strokeDasharray={`${(((stats as any).choice1Percent || 0) * 628) / 100} 628`}
                strokeDashoffset="0"
                transform="rotate(-90 150 150)"
                className="stats-donut"
                style={{
                  filter: 'drop-shadow(0 0 10px var(--neon-green))'
                }}
              />
              
              {/* Red Choice Arc */}
              <circle
                cx="150"
                cy="150"
                r="100"
                fill="none"
                stroke="var(--neon-red)"
                strokeWidth="20"
                strokeDasharray={`${(((stats as any).choice2Percent || 0) * 628) / 100} 628`}
                strokeDashoffset={`-${(((stats as any).choice1Percent || 0) * 628) / 100}`}
                transform="rotate(-90 150 150)"
                className="stats-donut"
                style={{
                  filter: 'drop-shadow(0 0 10px var(--neon-red))'
                }}
              />
              
              {/* Center Text */}
              <text x="150" y="140" textAnchor="middle" className="text-2xl font-bold fill-white">
                Choices
              </text>
              <text x="150" y="160" textAnchor="middle" className="text-sm fill-gray-300">
                Made by Others
              </text>
            </svg>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'var(--neon-green)' }}></div>
                <span className="text-white font-medium">{choice1Text}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: 'var(--neon-green)' }}>
                {(stats as any).choice1Percent || 0}%
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'var(--neon-red)' }}></div>
                <span className="text-white font-medium">{choice2Text}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: 'var(--neon-red)' }}>
                {(stats as any).choice2Percent || 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Futuristic Next Button */}
      {showResults && (
        <div className="flex justify-center">
          <button
            onClick={handleNextLevel}
            className="glass-panel px-12 py-4 text-lg font-bold text-white hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(45deg, var(--neon-purple), var(--neon-blue))',
              border: '2px solid var(--neon-purple)',
              boxShadow: '0 0 30px rgba(159, 0, 255, 0.5)'
            }}
          >
            {texts[language].next}
          </button>
        </div>
      )}
    </main>
  );
}
