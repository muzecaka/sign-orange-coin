import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Settings() {
  const [isMuted, setIsMuted] = useState<boolean>(
    localStorage.getItem('isMuted') === 'true'
  );

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('isMuted', newMuteState.toString());
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4 text-orange-500">Settings</h1>
      <div className="flex flex-col space-y-4">
        <button
          type="button"
          onClick={toggleMute}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xl"
        >
          {isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
        </button>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xl"
        >
          Back to Main Menu
        </Link>
      </div>
    </div>
  );
}

export default Settings;
