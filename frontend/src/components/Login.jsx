import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function Login() {
  const { login, register, user } = useContext(GameContext);
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLoginView) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-outer-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Sparkles style={{ width: '32px', height: '32px', color: 'var(--tertiary)' }} />
          </div>
          <h1>{isLoginView ? 'Welcome Back!' : 'Create Account'}</h1>
          <p>{isLoginView ? 'Log in to continue your math journey' : 'Sign up to start saving your progress'}</p>
        </div>

        {errorMsg && (
          <div className="auth-error-alert">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label>Username</label>
            <div className="auth-input-wrapper">
              <User className="input-icon" />
              <input 
                type="text" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={12}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              'Processing...'
            ) : (
              <>
                {isLoginView ? <LogIn className="btn-icon" /> : <UserPlus className="btn-icon" />}
                {isLoginView ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>{isLoginView ? "Don't have an account?" : "Already have an account?"}</span>
          <button 
            type="button" 
            className="auth-toggle-view"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setErrorMsg(null);
              setUsername('');
              setPassword('');
            }}
          >
            {isLoginView ? 'Register here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}
