import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import GameBoard from '../components/GameBoard';
import EndScreen from '../components/EndScreen';
import { GameState } from '../types';

// Define the type for coinConfig
type CoinConfig = {
  specialCount: number;
  ordinaryCount: number;
  blankCount: number;
};

function Game() {
  const navigate = useNavigate();
  const { level: levelParam } = useParams<{ level: string }>();
  console.log(`Raw levelParam from useParams: ${levelParam}`);
  const level = parseInt(levelParam || '1', 10);
  console.log(`Parsed level: ${level}`);
  const highestLevelUnlocked = parseInt(
    localStorage.getItem('highestLevelUnlocked') || '1',
    10
  );
  console.log(`Highest Level Unlocked: ${highestLevelUnlocked}`);

  const [showRulesPopup, setShowRulesPopup] = useState(level > 1);

  useEffect(() => {
    console.log(`Level Param: ${levelParam}, Parsed Level: ${level}`);
    if (level > 1) {
      setShowRulesPopup(true);
      console.log(`Set showRulesPopup to true for Level ${level}`);
    } else {
      setShowRulesPopup(false);
      console.log(`No rules popup for Level ${level}`);
    }
  }, [level]);

  useEffect(() => {
    if (!localStorage.getItem('highestLevelUnlocked')) {
      localStorage.setItem('highestLevelUnlocked', '1');
    }
    if (level > highestLevelUnlocked) {
      console.log(
        `Navigating to Main Menu: Level ${level} > Highest Unlocked ${highestLevelUnlocked}`
      );
      navigate('/');
    }
  }, [level, highestLevelUnlocked, navigate]);

  const initializeGameState = (gameLevel: number): GameState => {
    const coinConfigMap: Record<number, CoinConfig> = {
      1: { specialCount: 4, ordinaryCount: 24, blankCount: 0 },
      2: { specialCount: 4, ordinaryCount: 22, blankCount: 2 },
      3: { specialCount: 4, ordinaryCount: 21, blankCount: 3 },
      4: { specialCount: 4, ordinaryCount: 19, blankCount: 5 },
    };

    const coinConfig = coinConfigMap[gameLevel];

    if (!coinConfig) {
      throw new Error(`Invalid level: ${gameLevel}`);
    }

    const { specialCount, ordinaryCount, blankCount } = coinConfig;

    const specialCoins = Array(specialCount)
      .fill(null)
      .map((_, index) => ({
        id: index,
        type: 'special' as const,
        value: index + 1,
        revealed: false,
      }));

    const ordinaryCoins = Array(ordinaryCount)
      .fill(null)
      .map((_, index) => ({
        id: index + specialCount,
        type: 'ordinary' as const,
        value: 1,
        revealed: false,
      }));

    const blankCoins = Array(blankCount)
      .fill(null)
      .map((_, index) => ({
        id: index + specialCount + ordinaryCount,
        type: 'blank' as const,
        value: 0,
        revealed: false,
      }));

    const allCoins = [...specialCoins, ...ordinaryCoins, ...blankCoins];
    for (let i = allCoins.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCoins[i], allCoins[j]] = [allCoins[j], allCoins[i]];
    }

    return {
      score: 0,
      level: gameLevel,
      triesLeft: 5,
      isGameOver: false,
      isPaused: false,
      coins: allCoins,
      enlargedCoin: null,
    };
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

  const getSpecialCoinValue = (level: number) => {
    switch (level) {
      case 1:
        return 4;
      case 2:
        return 4;
      case 3:
        return 5;
      case 4:
        return 6;
      default:
        return 4;
    }
  };

  const getOrdinaryCoinValue = (level: number) => {
    switch (level) {
      case 1:
        return 1.5;
      case 2:
        return 2;
      case 3:
        return 2.5;
      case 4:
        return 3;
      default:
        return 1.5;
    }
  };

  const getBlankCount = (level: number) => {
    switch (level) {
      case 1:
        return 0;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 5;
      default:
        return 0;
    }
  };

  const [gameState, setGameState] = useState<GameState>(
    initializeGameState(level)
  );

  const handleLevelComplete = (completedLevel: number) => {
    const currentHighest = parseInt(
      localStorage.getItem('highestLevelUnlocked') || '1',
      10
    );
    if (completedLevel >= currentHighest) {
      localStorage.setItem(
        'highestLevelUnlocked',
        (completedLevel + 1).toString()
      );
    }
  };

  const resetGame = () => {
    setGameState(initializeGameState(gameState.level));
  };

  const goToNextLevel = () => {
    if (gameState.level < 4) {
      const nextLevel = gameState.level + 1;
      setGameState(initializeGameState(nextLevel));
      navigate(`/game/${nextLevel}`);
      console.log(`Navigating to Level ${nextLevel}`);
    }
  };

  const resumeGame = () => {
    setGameState({ ...gameState, isPaused: false });
  };

  useEffect(() => {
    if (gameState.isGameOver) {
      const highScores = JSON.parse(
        localStorage.getItem('highScores') || '{}'
      ) as Record<number, number>;
      const currentHighScore = highScores[gameState.level] ?? 0;
      if (gameState.score > currentHighScore) {
        highScores[gameState.level] = gameState.score;
        localStorage.setItem('highScores', JSON.stringify(highScores));
      }
    }
  }, [gameState.isGameOver, gameState.level, gameState.score]);

  const renderContent = () => {
    if (gameState.isPaused) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 bg-white">
          <h1 className="text-4xl font-bold mb-4 text-orange-500">Paused</h1>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={resumeGame}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Retry
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Main Menu
            </Link>
          </div>
        </div>
      );
    }
    if (gameState.isGameOver) {
      return (
        <EndScreen
          score={gameState.score}
          level={gameState.level}
          hasWon={gameState.score >= getWinThreshold(gameState.level)}
          onRetry={resetGame}
          onNextLevel={goToNextLevel}
        />
      );
    }
    return (
      <>
        <GameBoard
          gameState={gameState}
          setGameState={setGameState}
          onLevelComplete={handleLevelComplete}
        />
        <div className="pause-button">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setGameState({ ...gameState, isPaused: true })}
          >
            Pause
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white game-container relative">
      <div className="sticky top-0 z-10 pt-4">
        <TopBar
          score={gameState.score}
          level={gameState.level}
          triesLeft={gameState.triesLeft}
        />
      </div>
      {showRulesPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">
              Level {level} Rules
            </h2>
            <p className="text-lg mb-2">
              <strong>Rules:</strong> Click coins to score points, 5 tries per
              level.
            </p>
            <p className="text-lg mb-2">
              <strong>Points to Pass:</strong> {getWinThreshold(level)}
            </p>
            <p className="text-lg mb-2">
              <strong>Special Coin Value:</strong> {getSpecialCoinValue(level)}{' '}
              points
            </p>
            <p className="text-lg mb-2">
              <strong>Sign Coin Value:</strong> {getOrdinaryCoinValue(level)}{' '}
              points
            </p>
            <p className="text-lg mb-4">
              <strong>Blanks Present:</strong> {getBlankCount(level)}
            </p>
            <button
              type="button"
              onClick={() => {
                setShowRulesPopup(false);
                console.log(`Rules popup dismissed for Level ${level}`);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      {renderContent()}
    </div>
  );
}

export default Game;
