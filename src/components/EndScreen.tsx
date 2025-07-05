import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface EndScreenProps {
  score: number;
  level: number;
  hasWon: boolean;
  onRetry: () => void;
  onNextLevel: () => void;
}

// Preload the fanfare sound for the celebration
const fanfareSound = new Audio('/sounds/fanfare.mp3');

function EndScreen({
  score,
  level,
  hasWon,
  onRetry,
  onNextLevel,
}: EndScreenProps) {
  const navigate = useNavigate();
  const pointsToPassMap: Record<number, number> = {
    1: 10,
    2: 12,
    3: 14,
    4: 16,
  };

  const pointsToPass = pointsToPassMap[level] || 10;
  const isLastLevel = level >= 4;
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (hasWon && isLastLevel && !showCelebration) {
      setShowCelebration(true);
      const isMuted = localStorage.getItem('isMuted') === 'true';
      if (!isMuted) {
        fanfareSound.play().catch((error) => {
          console.error('Error playing fanfare sound:', error);
        });
      }
    }
  }, [hasWon, isLastLevel, showCelebration]);

  const handlePlayAgain = () => {
    localStorage.setItem('highestLevelUnlocked', '1');
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative">
      <h1 className="text-4xl font-bold mb-4 text-orange-500">
        {hasWon ? 'Level Cleared!' : 'Game Over'}
      </h1>
      <p className="text-2xl mb-4 text-black font-bold">
        You scored: {score}/{pointsToPass}
      </p>
      <div className="flex space-x-4">
        {!showCelebration && (
          <>
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 opacity-100"
            >
              Retry
            </button>
            {hasWon && !isLastLevel && (
              <button
                type="button"
                onClick={onNextLevel}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 opacity-100"
              >
                Next Level
              </button>
            )}
            <Link
              to="/"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 opacity-100"
            >
              Main Menu
            </Link>
          </>
        )}
      </div>

      {showCelebration && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 pointer-events-none">
          <img
            src="/assets/Ultimate_Champion.png"
            alt="Ultimate Champion Celebration"
            className="w-3/4 max-w-lg animate-pulse"
          />
          <button
            type="button"
            onClick={handlePlayAgain}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 z-60 pointer-events-auto"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default EndScreen;
