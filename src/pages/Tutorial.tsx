import { useNavigate } from 'react-router-dom';

function Tutorial() {
  const navigate = useNavigate();
  const levels = [
    {
      level: 1,
      name: 'Easy',
      specialPoints: 4,
      ordinaryPoints: 1.5,
      blankCount: 0,
      goal: 10,
    },
    {
      level: 2,
      name: 'Medium',
      specialPoints: 4,
      ordinaryPoints: 2,
      blankCount: 2,
      goal: 12,
    },
    {
      level: 3,
      name: 'Hard',
      specialPoints: 5,
      ordinaryPoints: 2.5,
      blankCount: 3,
      goal: 14,
    },
    {
      level: 4,
      name: 'Difficult',
      specialPoints: 6,
      ordinaryPoints: 3,
      blankCount: 5,
      goal: 16,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-white p-4 pt-12">
      <h1 className="text-4xl font-bold mb-4 text-orange-500">Tutorial</h1>
      <div className="max-w-2xl text-left">
        <p className="mb-4">
          Welcome to Sign Orange Coin! Pick 5 coins in each level to score
          enough points to pass. Special Coins give more points, Ordinary Coins
          give less, and Blank Coins waste a try with 0 points.
        </p>
        {levels.map((level) => (
          <div key={level.level} className="mb-4">
            <h2 className="text-2xl font-bold text-orange-500">
              Level {level.level}: {level.name}
            </h2>
            <p>
              - Goal: {level.goal} points
              <br />- Special Coins: {level.specialPoints} points (4 coins)
              <br />- Ordinary Coins: {level.ordinaryPoints} points (
              {28 - 4 - level.blankCount} coins)
              <br />- Blank Coins: 0 points ({level.blankCount} coin
              {level.blankCount !== 1 ? 's' : ''})
            </p>
          </div>
        ))}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default Tutorial;
