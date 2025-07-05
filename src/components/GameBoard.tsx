import { useEffect } from 'react';
import Coin from './Coin';
import { GameState } from '../types';

interface GameBoardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onLevelComplete: (level: number) => void;
}

// Preload the sounds for each coin type
const blankSound = new Audio('/sounds/blank-dud.mp3');
const signSound = new Audio('/sounds/coin-drop.mp3');
const specialSound = new Audio('/sounds/special-chime.mp3');

function GameBoard({
  gameState,
  setGameState,
  onLevelComplete,
}: GameBoardProps) {
  const handleCoinClick = (id: number) => {
    if (gameState.triesLeft <= 0 || gameState.isGameOver) return undefined;

    const coin = gameState.coins.find((c) => c.id === id);
    if (!coin || coin.revealed) return undefined;

    // Check mute state
    const isMuted = localStorage.getItem('isMuted') === 'true';
    if (!isMuted) {
      // Play the appropriate sound based on coin type
      let soundToPlay: HTMLAudioElement;
      switch (coin.type) {
        case 'blank':
          soundToPlay = blankSound;
          break;
        case 'ordinary':
          soundToPlay = signSound;
          break;
        case 'special':
          soundToPlay = specialSound;
          break;
        default:
          soundToPlay = signSound; // Fallback to sign sound
      }

      soundToPlay.play().catch((error) => {
        console.error(`Error playing ${coin.type} sound:`, error);
      });
    }

    setGameState((prev) => ({
      ...prev,
      enlargedCoin: { id: coin.id, type: coin.type, value: coin.value },
    }));

    return undefined;
  };

  const getPoints = (type: 'special' | 'ordinary' | 'blank', level: number) => {
    if (type === 'blank') return 0;
    switch (level) {
      case 1:
        return type === 'special' ? 4 : 1.5;
      case 2:
        return type === 'special' ? 4 : 2;
      case 3:
        return type === 'special' ? 5 : 2.5;
      case 4:
        return type === 'special' ? 6 : 3;
      default:
        return 0;
    }
  };

  const getWinThreshold = (level: number) => {
    switch (level) {
      case 1:
        return 10;
      case 2:
        return 12;
      case 3:
        return 14;
      case 4:
        return 16;
      default:
        return 10;
    }
  };

  const getEnlargedImageSrc = (
    type: 'special' | 'ordinary' | 'blank',
    value: number
  ): string => {
    switch (type) {
      case 'special':
        return `/assets/special-${value}.png`;
      case 'ordinary':
        return '/assets/sign.png';
      case 'blank':
        return '/assets/blank.png';
      default:
        return '/assets/blank.png';
    }
  };

  useEffect(() => {
    if (!gameState.enlargedCoin) return;

    const timer = setTimeout(() => {
      const coin = gameState.coins.find(
        (c) => c.id === gameState.enlargedCoin!.id
      );
      if (!coin) return;

      const points = getPoints(coin.type, gameState.level);

      setGameState((prev) => {
        const newCoins = prev.coins.map((c) =>
          c.id === gameState.enlargedCoin!.id ? { ...c, revealed: true } : c
        );
        const newScore = prev.score + points;
        const newTriesLeft = prev.triesLeft - 1;
        const winThreshold = getWinThreshold(prev.level);
        const isWin = newScore >= winThreshold;
        const newIsGameOver = newTriesLeft <= 0 || isWin;

        if (isWin && !prev.isGameOver) {
          onLevelComplete(prev.level);
        }

        return {
          ...prev,
          score: newScore,
          triesLeft: newTriesLeft,
          isGameOver: newIsGameOver,
          coins: newCoins,
          enlargedCoin: null,
        };
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    gameState.enlargedCoin,
    gameState.coins,
    gameState.level,
    setGameState,
    onLevelComplete,
  ]);

  return (
    <div className="relative flex-1 p-4 bg-white rounded-lg shadow-md">
      <div className="game-grid">
        {gameState.coins.map((coin) => (
          <Coin
            key={coin.id}
            id={coin.id}
            type={coin.type}
            value={coin.value}
            revealed={coin.revealed}
            onClick={handleCoinClick}
          />
        ))}
      </div>

      {/* Enlarged Coin Overlay */}
      {gameState.enlargedCoin && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-1/2 max-w-md">
            <img
              src={getEnlargedImageSrc(
                gameState.enlargedCoin.type,
                gameState.enlargedCoin.value
              )}
              alt={`${gameState.enlargedCoin.type} coin`}
              className={`w-full h-full ${
                gameState.enlargedCoin.type === 'blank'
                  ? 'animate-shake'
                  : 'animate-flip'
              }`}
            />
            <span className="absolute top-0 left-0 font-bold text-3xl text-lime-400">
              {gameState.enlargedCoin.type === 'blank'
                ? 'No Points!'
                : `+${getPoints(gameState.enlargedCoin.type, gameState.level)}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
