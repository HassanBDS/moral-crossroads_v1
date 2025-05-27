export interface GameState {
  playerId: number | null;
  playerName: string;
  playerGender: string;
  currentLevel: number;
  currentChoice: string | null;
  showSetup: boolean;
  isAnimating: boolean;
  gameStarted: boolean;
}

export const initialGameState: GameState = {
  playerId: null,
  playerName: "",
  playerGender: "",
  currentLevel: 1,
  currentChoice: null,
  showSetup: true,
  isAnimating: false,
  gameStarted: false,
};

export type GameAction = 
  | { type: 'SET_PLAYER'; payload: { id: number; name: string; gender: string } }
  | { type: 'START_GAME' }
  | { type: 'MAKE_CHOICE'; payload: string }
  | { type: 'NEXT_LEVEL' }
  | { type: 'SET_ANIMATING'; payload: boolean }
  | { type: 'RESET_CHOICE' };

export function gameStateReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return {
        ...state,
        playerId: action.payload.id,
        playerName: action.payload.name,
        playerGender: action.payload.gender,
      };
    case 'START_GAME':
      return {
        ...state,
        showSetup: false,
        gameStarted: true,
      };
    case 'MAKE_CHOICE':
      return {
        ...state,
        currentChoice: action.payload,
      };
    case 'NEXT_LEVEL':
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        currentChoice: null,
        isAnimating: false,
      };
    case 'SET_ANIMATING':
      return {
        ...state,
        isAnimating: action.payload,
      };
    case 'RESET_CHOICE':
      return {
        ...state,
        currentChoice: null,
        isAnimating: false,
      };
    default:
      return state;
  }
}
