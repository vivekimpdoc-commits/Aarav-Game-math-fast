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
     