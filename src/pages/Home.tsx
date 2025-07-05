import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  const highScores = JSON.parse(
    localStorage.getItem('highScores') || '{}'
  ) as Record<number, number>;
  const highScore = Math.max(
    ...[1, 2, 3, 4].map((level) => highScores[level] || 0),
    0
  );

  const [refreshKey, setRefreshKey] = useState(0);

  const highestLevelUnlocked = parseInt(
    localStorage.getItem('highestLevelUnlocked') || '1',
    10
  );

  const selectLevel = (level: number) => {
    if (level <= highestLevelUnlocked) {
      navigate(`/game/${level}`);
    }
  };

  const resetProgress = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset your progress?'
    );
    if (confirmReset) {
      localStorage.setItem('highestLevelUnlocked', '1');
      setRefreshKey((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        const confirmReset = window.confirm(
          'Are you sure you want to reset your progress?'
        );
        if (confirmReset) {
          localStorage.setItem('highestLevelUnlocked', '1');
          setRefreshKey((prev) => prev + 1);
        }
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div
      key={refreshKey}
      className="flex flex-col items-center justify-center h-screen bg-white"
    >
      <h1 className="text-4xl font-bold mb-4 text-orange-500">
        Welcome to Sign Orange Game
      </h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          type="button"
          onClick={() => selectLevel(1)}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Play
        </button>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Settings
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[1, 2, 3, 4].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => selectLevel(level)}
            className={`px-4 py-2 rounded ${
              level <= highestLevelUnlocked
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={level > highestLevelUnlocked}
          >
            Level {level}
          </button>
        ))}
      </div>
      <p className="text-lg mb-4 text-orange-500">High Score: {highScore}</p>
      <button
        type="button"
        onClick={() => navigate('/tutorial')}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Tutorial
      </button>
      <button
        type="button"
        onClick={() => navigate('/high-score')}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        High Score
      </button>
      <button
        type="button"
        onClick={resetProgress}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Reset Progress
      </button>
    </div>
  );
}

export default Home;
