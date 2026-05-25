import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NumbersGame from './components/NumbersGame';
import OperationsGame from './components/OperationsGame';
import TimeMoneyGame from './components/TimeMoneyGame';
import ShapesGame from './components/ShapesGame';
import BossGame from './components/BossGame';
import { GameProvider, GameContext } from './context/GameContext';
import { useContext } from 'react';

// Wrapper to show the level up modal anywhere in the app
function LevelUpModal() {
  const { showLevelUp, level } = useContext(GameContext);
  if (!showLevelUp) return null;
  
  return (
    <div className="feedback-overlay" style={{background: 'rgba(255,230,109,0.95)'}}>
      <h1 className="success-text" style={{fontSize: '4rem', textAlign: 'center'}}>
        🎉 LEVEL UP! 🎉<br/>You reached Level {level}!
      </h1>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <LevelUpModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/numbers" element={<NumbersGame />} />
          <Route path="/operations" element={<OperationsGame />} />
          <Route path="/time-money" element={<TimeMoneyGame />} />
          <Route path="/shapes" element={<ShapesGame />} />
          <Route path="/boss" element={<BossGame />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;
