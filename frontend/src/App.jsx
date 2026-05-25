import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import OperationsGame from './components/OperationsGame';
import TimeMoneyGame from './components/TimeMoneyGame';
import BossGame from './components/BossGame';
import GeniusGame from './components/GeniusGame';
import AdvancedOpsGame from './components/AdvancedOpsGame';
import FractionsGame from './components/FractionsGame';
import MeasurementGame from './components/MeasurementGame';
import DataGame from './components/DataGame';
import MiddleIntegersGame from './components/MiddleIntegersGame';
import MiddleRatioGame from './components/MiddleRatioGame';
import MiddleAlgebraGame from './components/MiddleAlgebraGame';
import MiddleGeometryGame from './components/MiddleGeometryGame';
import LogicPuzzleGame from './components/LogicPuzzleGame';
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

// Protected Route Wrapper to guard layout and games
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(GameContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
        Loading Math Master...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <LevelUpModal />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/operations" element={<ProtectedRoute><OperationsGame /></ProtectedRoute>} />
          <Route path="/time-money" element={<ProtectedRoute><TimeMoneyGame /></ProtectedRoute>} />
          <Route path="/advanced-ops" element={<ProtectedRoute><AdvancedOpsGame /></ProtectedRoute>} />
          <Route path="/fractions" element={<ProtectedRoute><FractionsGame /></ProtectedRoute>} />
          <Route path="/measurement" element={<ProtectedRoute><MeasurementGame /></ProtectedRoute>} />
          <Route path="/data" element={<ProtectedRoute><DataGame /></ProtectedRoute>} />
          <Route path="/logic" element={<ProtectedRoute><LogicPuzzleGame /></ProtectedRoute>} />
          <Route path="/boss" element={<ProtectedRoute><BossGame /></ProtectedRoute>} />
          <Route path="/genius" element={<ProtectedRoute><GeniusGame /></ProtectedRoute>} />
          <Route path="/middle-integers" element={<ProtectedRoute><MiddleIntegersGame /></ProtectedRoute>} />
          <Route path="/middle-ratio" element={<ProtectedRoute><MiddleRatioGame /></ProtectedRoute>} />
          <Route path="/middle-algebra" element={<ProtectedRoute><MiddleAlgebraGame /></ProtectedRoute>} />
          <Route path="/middle-geometry" element={<ProtectedRoute><MiddleGeometryGame /></ProtectedRoute>} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;
