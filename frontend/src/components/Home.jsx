import { Link } from 'react-router-dom';
import { Calculator, Clock, Zap, Skull, DivideSquare, PieChart, Ruler, BarChart2, PlusMinus, Percent, Variable, Circle } from 'lucide-react';
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
      
      <h2 style={{marginTop: '2rem', borderBottom: '2px solid rgba(255,255,255,0.5)', paddingBottom: '10px', color: 'var(--text-dark)'}}>Primary School (Classes 1-5)</h2>
      <div className="card-grid">
        <Link to="/operations" className="glass-panel game-card">
          <Calculator className="icon" />
          <h2>Operations</h2>
        </Link>
        <Link to="/time-money" className="glass-panel game-card">
          <Clock className="icon" />
          <h2>Time & Money</h2>
        </Link>
        <Link to="/advanced-ops" className="glass-panel game-card">
          <DivideSquare className="icon" style={{color: '#3498db'}} />
          <h2>Advanced Ops</h2>
        </Link>
        <Link to="/fractions" className="glass-panel game-card">
          <PieChart className="icon" style={{color: '#e67e22'}} />
          <h2>Fractions & Decimals</h2>
        </Link>
        <Link to="/measurement" className="glass-panel game-card">
          <Ruler className="icon" style={{color: '#27ae60'}} />
          <h2>Measurement</h2>
        </Link>
        <Link to="/data" className="glass-panel game-card">
          <BarChart2 className="icon" style={{color: '#e74c3c'}} />
          <h2>Data Analysis</h2>
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

      <h2 style={{marginTop: '3rem', borderBottom: '2px solid rgba(255,255,255,0.5)', paddingBottom: '10px', color: 'var(--text-dark)'}}>Middle School (Classes 6-7)</h2>
      <div className="card-grid" style={{marginBottom: '3rem'}}>
        <Link to="/middle-integers" className="glass-panel game-card">
          <PlusMinus className="icon" style={{color: '#9b59b6'}} />
          <h2>Integers</h2>
        </Link>
        <Link to="/middle-ratio" className="glass-panel game-card">
          <Percent className="icon" style={{color: '#1abc9c'}} />
          <h2>Ratio & Percentage</h2>
        </Link>
        <Link to="/middle-algebra" className="glass-panel game-card">
          <Variable className="icon" style={{color: '#f1c40f'}} />
          <h2>Algebra</h2>
        </Link>
        <Link to="/middle-geometry" className="glass-panel game-card">
          <Circle className="icon" style={{color: '#e84393'}} />
          <h2>Geometry</h2>
        </Link>
      </div>
    </div>
  );
}
