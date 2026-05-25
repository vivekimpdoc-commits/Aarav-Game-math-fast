import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OperationsGame from './components/OperationsGame';
import TimeMoneyGame from './components/TimeMoneyGame';
import BossGame from './components/BossGame';
import GeniusGame from './components/GeniusGame';
import AdvancedOpsGame from './components/AdvancedOpsGame';
import FractionsGame from './components/FractionsGame';
import MeasurementGame from './components/MeasurementGame';
import DataGame from './components/DataGame';
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
          <Route path="/operations" element={<OperationsGame />} />
          <Route path="/time-money" element={<TimeMoneyGame />} />
          <Route path="/advanced-ops" element={<AdvancedOpsGame />} />
          <Route path="/fractions" element={<FractionsGame />} />
          <Route path="/measurement" element={<MeasurementGame />} />
          <Route path="/data" element={<DataGame />} />
          <Route path="/boss" element={<BossGame />} />
          <Route path="/genius" element={<GeniusGame />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;
