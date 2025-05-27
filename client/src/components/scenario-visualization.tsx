import { useState, useEffect } from 'react';
import { SvgCharacter } from './svg-character';
import { TrolleySvg } from './trolley-svg';
import { getCharacterLayout } from '@/lib/scenarios';
import type { Scenario } from '@shared/schema';

interface ScenarioVisualizationProps {
  scenario: Scenario;
  choice: string | null;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

export function ScenarioVisualization({ 
  scenario, 
  choice, 
  isAnimating, 
  onAnimationComplete 
}: ScenarioVisualizationProps) {
  const [trolleyPosition, setTrolleyPosition] = useState({ x: 80, y: 170 });
  const [leverPulled, setLeverPulled] = useState(false);
  const [playerPulling, setPlayerPulling] = useState(false);
  const [splatted, setSplatted] = useState<string>('');
  
  const mainTrackCharacters = getCharacterLayout(
    scenario.type === 'sleeping' ? 'sleeping' : 'basic', 
    scenario.type === 'sleeping' ? 5 : getMainCharacterCount(scenario.level)
  );
  const branchTrackCharacters = getCharacterLayout('branch', 1);

  useEffect(() => {
    if (choice && isAnimating) {
      animateChoice(choice);
    }
  }, [choice, isAnimating]);

  const animateChoice = async (selectedChoice: string) => {
    if (selectedChoice === 'pull') {
      // Animate lever pull
      setLeverPulled(true);
      setPlayerPulling(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Move trolley to upper track
      setTrolleyPosition({ x: 400, y: 50 });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Splat branch character
      setSplatted('branch');
    } else {
      // Trolley continues straight
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move trolley forward
      setTrolleyPosition({ x: 500, y: 170 });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Splat main characters
      setSplatted('main');
    }
    
    setTimeout(() => {
      onAnimationComplete();
    }, 1000);
  };

  const resetAnimation = () => {
    setTrolleyPosition({ x: 80, y: 170 });
    setLeverPulled(false);
    setPlayerPulling(false);
    setSplatted('');
  };

  useEffect(() => {
    if (!isAnimating && !choice) {
      resetAnimation();
    }
  }, [isAnimating, choice]);

  return (
    <div className="bg-gray-50 p-8 mb-8 fancy-box">
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        {/* Track system */}
        <path 
          d="M 50 200 Q 300 200 400 200 Q 500 200 750 200" 
          stroke="#333" 
          strokeWidth="8" 
          fill="none"
        />
        <path 
          d="M 350 200 Q 400 150 450 100 Q 500 50 700 50" 
          stroke="#333" 
          strokeWidth="8" 
          fill="none"
        />
        <path 
          d="M 350 200 L 380 170" 
          stroke="#333" 
          strokeWidth="6" 
          fill="none"
        />
        
        {/* Trolley */}
        <TrolleySvg 
          x={trolleyPosition.x} 
          y={trolleyPosition.y}
          className={isAnimating ? "transition-all duration-1000 ease-in-out" : "trolley-animation"}
        />

        {/* Player character */}
        <SvgCharacter 
          x={playerPulling ? 320 : 250} 
          y={180}
          className={playerPulling ? "transition-all duration-500" : ""}
        />

        {/* Main track characters */}
        {mainTrackCharacters.map((char, index) => (
          <SvgCharacter
            key={`main-${index}`}
            x={char.x}
            y={char.y}
            sleeping={char.sleeping}
            splatted={splatted === 'main'}
          />
        ))}

        {/* Branch track characters */}
        {branchTrackCharacters.map((char, index) => (
          <SvgCharacter
            key={`branch-${index}`}
            x={char.x}
            y={char.y}
            sleeping={char.sleeping}
            splatted={splatted === 'branch'}
          />
        ))}

        {/* Lever mechanism */}
        <g>
          <rect x="320" y="160" width="20" height="60" stroke="#000" strokeWidth="3" fill="#DDD" />
          <line 
            x1="340" 
            y1="180" 
            x2="365" 
            y2={leverPulled ? "200" : "160"} 
            stroke="#000" 
            strokeWidth="4" 
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <circle cx="365" cy={leverPulled ? "200" : "160"} r="5" fill="#000" className="transition-all duration-300" />
        </g>
      </svg>
    </div>
  );
}

function getMainCharacterCount(level: number): number {
  switch (level) {
    case 1: return 5;
    case 2: return 4;
    case 3: return 3;
    case 4: return 2;
    case 5: return 1;
    default: return 5;
  }
}
