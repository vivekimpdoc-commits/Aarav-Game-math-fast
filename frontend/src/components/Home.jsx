import { Link } from 'react-router-dom';
import { Hash, Calculator, Clock, Shapes, Zap, Skull } from 'lucide-react';
import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function Home() {
  const { level, xp, xpNeeded } = useContext(GameContext);
  
  const progressPercent = (xp / xpNeeded) * 100;

  return (
    <div className="game-container">
      <div className="level-badge glass-panel" style={{marginBottom: '2rem', padding: '1.5rem', textAlign: 'center'}}>
        <span style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--quaternary)'}}>⭐ Level {level} / 25</span>
        <div className="xp-bar-container" style={{width: '100%', height: '20px', background: '#ddd', borderRadius: '10px', marginTop: '1rem', overflow: 'hidden'}}>
          <div className="xp-bar-fill" style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--secondary)', transition: 'width 0.5s ease' }}></div>
        </div>
        <div style={{fontSize: '1rem', marginTop: '0.5rem', color: 'var(--text-dark)', fontWeight: 'bold'}}>XP: {xp} / {xpNeeded}</div>
      </div>
      
      <h1 className="title">Math Master</h1>
      <div className="card-grid">
        <Link to="/numbers" className="glass-panel game-card">
          <Hash className="icon" />
          <h2>Numbers & Place Value</h2>
        </Link>
        <Link to="/operations" className="glass-panel game-card">
          <Calculator className="icon" />
          <h2>Operations</h2>
        </Link>
        <Link to="/time-money" className="glass-panel game-card">
          <Clock className="icon" />
          <h2>Time & Money</h2>
        </Link>
        <Link to="/shapes" className="glass-panel game-card">
          <Shapes className="icon" />
          <h2>Shapes & Space</h2>
        </Link>
        <Link to="/boss" className="glass-panel game-card" style={{border: '2px solid var(--primary)', background: '#ffebeb'}}>
          <Zap className="icon" style={{color: 'var(--primary)'}} />
          <h2>🔥 Boss Mode 🔥</h2>
        </Link>
        <Link to="/genius" className="glass-panel game-card" style={{border: '3px solid #8e44ad', background: '#f5eef8'}}>
          <Skull className="icon" style={{color: '#8e44ad'}} />
          <h2 style={{color: '#8e44ad'}}>Genius Survival</h2>
        </Link>
      </div>
    </div>
  );
}
