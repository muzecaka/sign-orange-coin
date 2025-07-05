import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Tutorial from './pages/Tutorial';
import HighScore from './pages/HighScore';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:level" element={<Game />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/high-score" element={<HighScore />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
