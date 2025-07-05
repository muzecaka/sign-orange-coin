import { useNavigate } from 'react-router-dom';

function HighScore() {
  const navigate = useNavigate();
  const highScores = JSON.parse(
    localStorage.getItem('highScores') || '{}'
  ) as Record<number, number>;

  const levels = [
    { level: 1, name: 'Easy' },
    { level: 2, name: 'Medium' },
    { level: 3, name: 'Hard' },
    { level: 4, name: 'Difficult' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4 text-orange-500">High Scores</h1>
      <div className="flex flex-col space-y-2">
        {levels.map((level) => (
          <p key={level.level} className="text-xl">
            Level {level.level} ({level.name}): {highScores[level.level] ?? 0}{' '}
            points
          </p>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mt-4"
      >
        Back to Menu
      </button>
    </div>
  );
}

export default HighScore;
