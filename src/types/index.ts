export interface Coin {
  id: number;
  type: 'special' | 'ordinary' | 'blank';
  value: number;
  revealed: boolean;
}

export interface EnlargedCoin {
  id: number;
  type: 'special' | 'ordinary' | 'blank';
  value: number;
}

export interface GameState {
  score: number;
  level: number;
  triesLeft: number;
  isGameOver: boolean;
  isPaused: boolean; // Added for pause/resume
  coins: Coin[];
  enlargedCoin: EnlargedCoin | null;
}
