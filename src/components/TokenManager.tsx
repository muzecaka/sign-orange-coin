import { useState, useEffect } from 'react';

function TokenManager() {
  const [tokenBalance, setTokenBalance] = useState(0);

  // Function to update token balance from localStorage
  const updateTokenBalance = () => {
    const balance = parseInt(localStorage.getItem('signCoinTokens') || '0', 10);
    console.log(`Token Balance Loaded: ${balance}`); // Debug log
    setTokenBalance(balance);
  };

  // Initial load and periodic updates
  useEffect(() => {
    updateTokenBalance(); // Initial load
    const interval = setInterval(updateTokenBalance, 1000); // Check every second for changes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Keyboard shortcut to reset tokens (Ctrl + Shift + R)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        localStorage.setItem('signCoinTokens', '0');
        setTokenBalance(0);
        console.log(
          'Tokens reset to 0 via keyboard shortcut (Ctrl + Shift + R)'
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleConvertToCrypto = () => {
    console.log(
      'In a real implementation, this would convert your SCT to a cryptocurrency like ETH.'
    );
  };

  const handleTransferToWallet = () => {
    console.log(
      'In a real implementation, this would transfer your SCT to your crypto wallet.'
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">
        SignCoin Token Balance
      </h2>
      <p className="text-lg mb-4">You have: {tokenBalance} SCT</p>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleConvertToCrypto}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Convert to Crypto
        </button>
        <button
          type="button"
          onClick={handleTransferToWallet}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Transfer to Wallet
        </button>
      </div>
    </div>
  );
}

export default TokenManager;
