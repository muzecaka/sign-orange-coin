import { GameState } from '../types';

function TopBar({
  score,
  level,
  triesLeft,
}: Pick<GameState, 'score' | 'level' | 'triesLeft'>) {
  const levelTextMap: Record<number, string> = {
    1: 'Level 1: Easy',
    2: 'Level 2: Medium',
    3: 'Level 3: Hard',
    4: 'Level 4: Difficult',
  };

  const pointsToPassMap: Record<number, number> = {
    1: 10,
    2: 12,
    3: 14,
    4: 16,
  };

  const levelText = levelTextMap[level] || `Level ${level}`;
  const pointsToPass = pointsToPassMap[level] || 10; // Fallback to 10

  return (
    <div className="flex justify-between p-4 bg-orange-500 text-white">
      <div>{levelText}</div>
      <div className="text-xl font-bold">
        Points: {score}/{pointsToPass}
      </div>
      <div>Tries: {triesLeft}/5</div>
    </div>
  );
}

export default TopBar;
