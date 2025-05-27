import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScenarioVisualization } from './scenario-visualization';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Scenario } from '@shared/schema';

interface GameBoardProps {
  playerId: number;
  playerName: string;
  currentLevel: number;
  onNextLevel: () => void;
}

export function GameBoard({ playerId, playerName, currentLevel, onNextLevel }: GameBoardProps) {
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
        choice,
        playerId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/scenarios/${scenario?.id}/stats`] });
    },
  });

  const handleChoice = async (choice: string) => {
    setCurrentChoice(choice);
    setIsAnimating(true);
    
    if (scenario) {
      await voteMutation.mutateAsync(choice);
    }
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setShowResults(true);
  };

  const handleNextLevel = () => {
    setCurrentChoice(null);
    setIsAnimating(false);
    setShowResults(false);
    onNextLevel();
  };

  // Reset state when level changes
  useEffect(() => {
    setCurrentChoice(null);
    setIsAnimating(false);
    setShowResults(false);
  }, [currentLevel]);

  if (scenarioLoading || !scenario) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading scenario...</div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Level Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <Badge className="w-12 h-12 bg-boraq-green rounded-full flex items-center justify-center text-white font-bold text-lg">
          {currentLevel}
        </Badge>
        <div className="fancy-box bg-gray-50 p-3 flex-1">
          <h3 className="font-semibold">{scenario.title}</h3>
        </div>
      </div>

      {/* Problem Description */}
      <div className="border-4 border-boraq-green p-6 mb-8 relative">
        <div className="w-3 h-3 bg-boraq-green rounded-full absolute -left-2 top-6"></div>
        <p className="text-lg leading-relaxed">{scenario.description}</p>
      </div>

      {/* Scenario Visualization */}
      <ScenarioVisualization
        scenario={scenario}
        choice={currentChoice}
        isAnimating={isAnimating}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Choice Buttons */}
      {!showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Button
            onClick={() => handleChoice('pull')}
            disabled={!!currentChoice || voteMutation.isPending}
            className="fancy-box bg-white p-6 text-left hover:bg-gray-50 transition-colors h-auto"
            variant="outline"
          >
            <div>
              <h3 className="font-semibold text-lg mb-2">Pull the lever</h3>
              <p className="text-gray-600">Divert the trolley to the other track</p>
            </div>
          </Button>
          <Button
            onClick={() => handleChoice('nothing')}
            disabled={!!currentChoice || voteMutation.isPending}
            className="fancy-box bg-white p-6 text-left hover:bg-gray-50 transition-colors h-auto"
            variant="outline"
          >
            <div>
              <h3 className="font-semibold text-lg mb-2">Do nothing</h3>
              <p className="text-gray-600">Let the trolley continue on its current path</p>
            </div>
          </Button>
        </div>
      )}

      {/* Voting Statistics */}
      {showResults && stats && (
        <div className="fancy-box bg-gray-50 p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">What others chose:</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Pull the lever</span>
                <span className="font-bold text-boraq-green">{stats.pullPercent}%</span>
              </div>
              <Progress value={stats.pullPercent} className="h-2 bg-gray-200">
                <div 
                  className="h-full bg-boraq-green transition-all duration-500 rounded"
                  style={{ width: `${stats.pullPercent}%` }}
                />
              </Progress>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Do nothing</span>
                <span className="font-bold text-boraq-red">{stats.nothingPercent}%</span>
              </div>
              <Progress value={stats.nothingPercent} className="h-2 bg-gray-200">
                <div 
                  className="h-full bg-boraq-red transition-all duration-500 rounded"
                  style={{ width: `${stats.nothingPercent}%` }}
                />
              </Progress>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Based on {stats.totalVotes} responses
          </p>
        </div>
      )}

      {/* Navigation */}
      {showResults && (
        <div className="flex justify-center">
          <Button
            onClick={handleNextLevel}
            className="fancy-box bg-boraq-green text-white px-8 py-3 font-semibold hover:bg-green-600 transition-colors"
          >
            Next →
          </Button>
        </div>
      )}
    </main>
  );
}
