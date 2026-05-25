import { Link } from 'react-router-dom';
import { Hash, Calculator, Clock, Shapes, Zap } from 'lucide-react';
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
          <div className="xp-bar-fill" style={{ width: `${progressPercent}%`, height: '100%', background: 'var