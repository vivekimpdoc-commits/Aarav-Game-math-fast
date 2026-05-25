import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('math_token') || null);
  const [loading, setLoading] = useState(true);

  // Flat 50 XP per level (5 correct answers) to keep it fun and attainable
  const xpNeeded = 50; 

  // Load and validate user session on mount
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Session expired');
        }
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setLevel(data.user.level);
        setXp(data.user.xp);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Auth validation error:", err.message);
        // Reset local token
        setToken(null);
        setUser(null);
        localStorage.removeItem('math_token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  // Register action
  const register = async (username, password) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register');
    }
    
    setToken(data.token);
    setUser(data.user);
    setLevel(data.user.level);
    setXp(data.user.xp);
    localStorage.setItem('math_token', data.token);
    return data.user;
  };

  // Login action
  const login = async (username, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }
    
    setToken(data.token);
    setUser(data.user);
    setLevel(data.user.level);
    setXp(data.user.xp);
    localStorage.setItem('math_token', data.token);
    return data.user;
  };

  // Logout action
  const logout = () => {
    if (token) {
      fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(err => console.error("Error logging out from server:", err));
    }
    setToken(null);
    setUser(null);
    setLevel(1);
    setXp(0);
    localStorage.removeItem('math_token');
  };

  // Synced addXp
  const addXp = (amount) => {
    if (level >= 25) return;

    setXp((prev) => {
      let newXp = prev + amount;
      let newLevel = level;
      
      if (newXp >= xpNeeded) {
        newLevel = Math.min(level + 1, 25);
        newXp = newXp - xpNeeded;
        setLevel(newLevel);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      // Update level and XP in the database if logged in
      if (token) {
        fetch('http://localhost:5000/api/auth/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ level: newLevel, xp: newXp })
        })
        .then(res => {
          if (res.ok) {
            setUser(prevUser => {
              if (!prevUser) return null;
              return {
                ...prevUser,
                level: newLevel,
                xp: newXp
              };
            });
          }
        })
        .catch(err => console.error("Could not sync progression with server:", err));
      }
      
      return newXp;
    });
  };

  return (
    <GameContext.Provider value={{ level, xp, xpNeeded, addXp, showLevelUp, user, token, loading, login, register, logout }}>
      {children}
    </GameContext.Provider>
  );
}
