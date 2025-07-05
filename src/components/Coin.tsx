import { GameState } from '../types';

interface CoinProps {
  id: number;
  type: 'special' | 'ordinary' | 'blank';
  value: number;
  revealed: boolean;
  onClick: (id: number) => void;
}

function Coin({ id, type, value, revealed, onClick }: CoinProps) {
  const getImageSrc = () => {
    if (!revealed) return '/assets/white-sign.png'; // Unrevealed state
    switch (type) {
      case 'special':
        return `/assets/special-${value}.png`; // Maps to special-1.png, special-2.png, etc.
      case 'ordinary':
        return '/assets/sign.png'; // Ordinary coin
      case 'blank':
        return '/assets/blank.png'; // Blank coin
      default:
        return '/assets/white-sign.png';
    }
  };

  return (
    <img
      src={getImageSrc()}
      alt={type}
      className="w-16 h-16 cursor-pointer"
      onClick={() => onClick(id)}
    />
  );
}

export default Coin;
