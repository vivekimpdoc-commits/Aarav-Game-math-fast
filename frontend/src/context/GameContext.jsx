import { createContext, useState } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Flat 50 XP per level (5 correct answers) to keep it fun and attainable
  const xpNeeded = 50; 

  const addXp = (amount) => {
    if (level >= 25) return; // Max level reached

    setXp((prev) => {
      const newXp = prev + amount;
      if (newXp >= xpNeeded) {
        // Level Up
        setLevel((prevLevel) => Math.min(prevLevel + 1, 25));
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000); // Hide level up modal after 3 seconds
        return newXp - xpNeeded; // Carry over remaining xp
      }
      return newXp;
    });
  };

  return (
    <GameContext.Provider value={{ level, xp, xpNeeded, addXp, showLevelUp }}>
      {children}
    </GameContext.Provider>
  );
}
