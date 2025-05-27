import { useState, useEffect } from 'react';
import type { Scenario } from '@shared/schema';

interface CharacterSceneProps {
  scenario: Scenario;
  choice: string | null;
  isAnimating: boolean;
  language: 'en' | 'ar';
}

export function CharacterScene({ scenario, choice, isAnimating, language }: CharacterSceneProps) {
  const [animationState, setAnimationState] = useState<'initial' | 'green' | 'red'>('initial');

  useEffect(() => {
    if (choice && isAnimating) {
      setAnimationState(choice as 'green' | 'red');
    } else if (!choice) {
      setAnimationState('initial');
    }
  }, [choice, isAnimating]);

  const renderCharacterGroup = (count: number, state: 'normal' | 'saved' | 'dead' | 'suffering') => {
    const characters = [];
    for (let i = 0; i < count; i++) {
      const x = (i % 3) * 40 + 20;
      const y = Math.floor(i / 3) * 50 + 30;
      
      characters.push(
        <g key={i} transform={`translate(${x}, ${y})`}>
          {/* Character body */}
          <circle 
            cx="0" cy="0" r="15" 
            stroke="#000" strokeWidth="3" 
            fill={state === 'dead' ? '#ff4444' : state === 'suffering' ? '#ffaa44' : '#fff'}
            className={isAnimating ? 'transition-all duration-1000' : ''}
          />
          
          {/* Face */}
          {state === 'normal' && (
            <>
              <circle cx="-5" cy="-3" r="2" fill="#000" />
              <circle cx="5" cy="-3" r="2" fill="#000" />
              <path d="M -5 5 Q 0 8 5 5" stroke="#000" strokeWidth="2" fill="none" />
            </>
          )}
          {state === 'saved' && (
            <>
              <circle cx="-5" cy="-3" r="2" fill="#000" />
              <circle cx="5" cy="-3" r="2" fill="#000" />
              <path d="M -5 3 Q 0 8 5 3" stroke="#000" strokeWidth="2" fill="none" />
              <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#22c55e">
                {language === 'ar' ? 'آمن!' : 'Safe!'}
              </text>
            </>
          )}
          {state === 'dead' && (
            <>
              <line x1="-7" y1="-5" x2="-3" y2="-1" stroke="#000" strokeWidth="2" />
              <line x1="-3" y1="-5" x2="-7" y2="-1" stroke="#000" strokeWidth="2" />
              <line x1="3" y1="-5" x2="7" y2="-1" stroke="#000" strokeWidth="2" />
              <line x1="7" y1="-5" x2="3" y2="-1" stroke="#000" strokeWidth="2" />
              <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#ef4444">SPLAT</text>
            </>
          )}
          {state === 'suffering' && (
            <>
              <circle cx="-5" cy="-3" r="2" fill="#000" />
              <circle cx="5" cy="-3" r="2" fill="#000" />
              <path d="M -5 8 Q 0 5 5 8" stroke="#000" strokeWidth="2" fill="none" />
              <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#f59e0b">
                {language === 'ar' ? 'ألم' : 'Pain'}
              </text>
            </>
          )}
          
          {/* Body stripes */}
          <line x1="-10" y1="10" x2="10" y2="10" stroke="#000" strokeWidth="2" />
          <line x1="-10" y1="20" x2="10" y2="20" stroke="#000" strokeWidth="2" />
        </g>
      );
    }
    return characters;
  };

  const getSceneState = () => {
    if (scenario.type === 'consequence') {
      if (animationState === 'green') {
        return { left: 'saved', right: 'suffering' };
      } else if (animationState === 'red') {
        return { left: 'dead', right: 'saved' };
      }
    } else if (scenario.type === 'bystander') {
      if (animationState === 'green') {
        return { left: 'saved', right: 'dead' };
      } else if (animationState === 'red') {
        return { left: 'dead', right: 'saved' };
      }
    } else if (scenario.type === 'resource') {
      if (animationState === 'green') {
        return { left: 'saved', right: 'dead' };
      } else if (animationState === 'red') {
        return { left: 'dead', right: 'saved' };
      }
    }
    return { left: 'normal', right: 'normal' };
  };

  const sceneState = getSceneState();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Left Scene */}
      <div className="fancy-box bg-purple-300 p-6 h-64">
        <h4 className="text-lg font-bold mb-4 text-center">
          {language === 'ar' ? 'المجموعة الأولى' : 'Group 1'}
        </h4>
        <div className="flex justify-center">
          <svg width="200" height="160" viewBox="0 0 200 160">
            {scenario.type === 'consequence' && renderCharacterGroup(5, sceneState.left as any)}
            {scenario.type === 'bystander' && renderCharacterGroup(2, sceneState.left as any)}
            {scenario.type === 'resource' && renderCharacterGroup(4, sceneState.left as any)}
          </svg>
        </div>
      </div>

      {/* Right Scene */}
      <div className="fancy-box bg-cyan-300 p-6 h-64">
        <h4 className="text-lg font-bold mb-4 text-center">
          {language === 'ar' ? 'المجموعة الثانية' : 'Group 2'}
        </h4>
        <div className="flex justify-center">
          <svg width="200" height="160" viewBox="0 0 200 160">
            {scenario.type === 'consequence' && renderCharacterGroup(1, sceneState.right as any)}
            {scenario.type === 'bystander' && renderCharacterGroup(3, sceneState.right as any)}
            {scenario.type === 'resource' && renderCharacterGroup(1, sceneState.right as any)}
          </svg>
        </div>
      </div>
    </div>
  );
}