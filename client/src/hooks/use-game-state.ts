import { useReducer, useCallback } from 'react';
import { gameStateReducer, initialGameState, type GameAction } from '@/lib/game-state';

export function useGameState() {
  const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

  const setPlayer = useCallback((id: number, name: string, gender: string) => {
    dispatch({ type: 'SET_PLAYER', payload: { id, name, gender } });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const makeChoice = useCallback((choice: string) => {
    dispatch({ type: 'MAKE_CHOICE', payload: choice });
  }, []);

  const nextLevel = useCallback(() => {
    dispatch({ type: 'NEXT_LEVEL' });
  }, []);

  const setAnimating = useCallback((animating: boolean) => {
    dispatch({ type: 'SET_ANIMATING', payload: animating });
  }, []);

  const resetChoice = useCallback(() => {
    dispatch({ type: 'RESET_CHOICE' });
  }, []);

  return {
    state,
    actions: {
      setPlayer,
      startGame,
      makeChoice,
      nextLevel,
      setAnimating,
      resetChoice,
    },
  };
}
