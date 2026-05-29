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
      if (token.startsWith('demo_')) {
        const localUser = JSON.parse(localStorage.getItem('math_demo_user') || 'null');
        if (localUser) {
          setUser(localUser);
          setLevel(localUser.level || 1);
          setXp(localUser.xp || 0);
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem('math_token');
        }
        setLoading(false);
        return;
      }

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
        // Fallback to local storage demo session if network error
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message === 'Failed to fetch') {
          const localUser = JSON.parse(localStorage.getItem('math_demo_user') || 'null');
          if (localUser) {
            setUser(localUser);
            setLevel(localUser.level || 1);
            setXp(localUser.xp || 0);
          } else {
            setToken(null);
            setUser(null);
            localStorage.removeItem('math_token');
          }
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem('math_token');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  // Register action
  const register = async (username, password) => {
    try {
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
      localStorage.setItem('math_demo_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message === 'Failed to fetch') {
        // Run in local demo mode!
        const users = JSON.parse(localStorage.getItem('math_demo_users') || '{}');
        const trimmed = username.trim();
        if (users[trimmed.toLowerCase()]) {
          throw new Error('Username is already taken (Demo Mode)');
        }
        const newUser = { username: trimmed, level: 1, xp: 0 };
        users[trimmed.toLowerCase()] = { username: trimmed, password, level: 1, xp: 0 };
        localStorage.setItem('math_demo_users', JSON.stringify(users));
        
        const demoToken = 'demo_' + Math.random().toString(36).substr(2, 9);
        setToken(demoToken);
        setUser(newUser);
        setLevel(1);
        setXp(0);
        localStorage.setItem('math_token', demoToken);
        localStorage.setItem('math_demo_user', JSON.stringify(newUser));
        return newUser;
      }
      throw err;
    }
  };

  // Login action
  const login = async (username, password) => {
    try {
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
      localStorage.setItem('math_demo_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message === 'Failed to fetch') {
        // Run in local demo mode!
        const users = JSON.parse(localStorage.getItem('math_demo_users') || '{}');
        const trimmed = username.trim();
        const existing = users[trimmed.toLowerCase()];
        if (!existing) {
          throw new Error('User does not exist (Demo Mode)');
        }
        if (existing.password !== password) {
          throw new Error('Incorrect password (Demo Mode)');
        }
        
        const demoToken = 'demo_' + Math.random().toString(36).substr(2, 9);
        const loggedUser = { username: existing.username, level: existing.level, xp: existing.xp };
        setToken(demoToken);
        setUser(loggedUser);
        setLevel(existing.level);
        setXp(existing.xp);
        localStorage.setItem('math_token', demoToken);
        localStorage.setItem('math_demo_user', JSON.stringify(loggedUser));
        return loggedUser;
      }
      throw err;
    }
  };

  // Logout action
  const logout = () => {
    if (token && !token.startsWith('demo_')) {
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
    localStorage.removeItem('math_demo_user');
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
        if (token.startsWith('demo_')) {
          // Local storage demo mode progress sync
          const users = JSON.parse(localStorage.getItem('math_demo_users') || '{}');
          const localUser = JSON.parse(localStorage.getItem('math_demo_user') || 'null');
          if (localUser) {
            localUser.level = newLevel;
            localUser.xp = newXp;
            localStorage.setItem('math_demo_user', JSON.stringify(localUser));
            
            if (users[localUser.username.toLowerCase()]) {
              users[localUser.username.toLowerCase()].level = newLevel;
              users[localUser.username.toLowerCase()].xp = newXp;
              localStorage.setItem('math_demo_users', JSON.stringify(users));
            }
            
            setUser(localUser);
          }
          return newXp;
        }

        // Live server progress sync
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
              const updated = { ...prevUser, level: newLevel, xp: newXp };
              localStorage.setItem('math_demo_user', JSON.stringify(updated));
              return updated;
            });
          }
        })
        .catch(err => {
          console.warn("Could not sync progression with server, updating locally:", err);
          setUser(prevUser => {
            if (!prevUser) return null;
            const updated = { ...prevUser, level: newLevel, xp: newXp };
            localStorage.setItem('math_demo_user', JSON.stringify(updated));
            return updated;
          });
        });
      }
      
      return newXp;
    });
  };

  // OTP actions
  const requestOtp = async (email) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      return { success: true, demoOtp: data.demoOtp };
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message === 'Failed to fetch') {
        // Fallback to local demo mode!
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('math_demo_otp_' + email.trim().toLowerCase(), code);
        return { success: true, demoOtp: code, isDemoMode: true };
      }
      throw err;
    }
  };

  const verifyOtp = async (email, code) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP code');

      setToken(data.token);
      setUser(data.user);
      setLevel(data.user.level);
      setXp(data.user.xp);
      localStorage.setItem('math_token', data.token);
      localStorage.setItem('math_demo_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message === 'Failed to fetch' || err.message.includes('Demo Mode')) {
        // Fallback to local demo mode!
        const storedOtp = localStorage.getItem('math_demo_otp_' + email.trim().toLowerCase());
        if (!storedOtp || storedOtp !== code.trim()) {
          throw new Error('Incorrect OTP code (Demo Mode)');
        }
        
        const users = JSON.parse(localStorage.getItem('math_demo_users') || '{}');
        const cleanEmail = email.trim().toLowerCase();
        let username = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'player';
        
        let matchedUser = Object.values(users).find(u => u.email === cleanEmail);
        if (!matchedUser) {
          if (users[username.toLowerCase()]) {
            username = username + Math.floor(100 + Math.random() * 900);
          }
          matchedUser = { username, email: cleanEmail, level: 1, xp: 0 };
          users[username.toLowerCase()] = matchedUser;
          localStorage.setItem('math_demo_users', JSON.stringify(users));
        }

        const demoToken = 'demo_' + Math.random().toString(36).substr(2, 9);
        setToken(demoToken);
        setUser(matchedUser);
        setLevel(matchedUser.level);
        setXp(matchedUser.xp);
        localStorage.setItem('math_token', demoToken);
        localStorage.setItem('math_demo_user', JSON.stringify(matchedUser));
        return matchedUser;
      }
      throw err;
    }
  };

  return (
    <GameContext.Provider value={{ level, xp, xpNeeded, addXp, showLevelUp, user, token, loading, login, register, logout, requestOtp, verifyOtp }}>
      {children}
    </GameContext.Provider>
  );
}
