import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Key } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function Login() {
  const { user, requestOtp, verifyOtp } = useContext(GameContext);
  const navigate = useNavigate();

  // OTP state
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [demoOtpAlert, setDemoOtpAlert] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    setDemoOtpAlert(null);

    try {
      const result = await requestOtp(email);
      if (result.success) {
        setOtpSent(true);
        setTimer(30); // 30-second resend limit
        if (result.demoOtp) {
          setDemoOtpAlert(`Verification Code (Demo Mode): ${result.demoOtp}`);
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await verifyOtp(email, otpCode);
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
          <h1>{otpSent ? 'Verify Email' : 'Email OTP Login'}</h1>
          <p>
            {otpSent ? 'We sent a verification code to your email' : 'Sign in or sign up instantly with your email'}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-alert">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {demoOtpAlert && (
          <div className="auth-success-alert" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#27ae60', padding: '12px', borderRadius: '10px', marginBottom: '1.2rem', textAlign: 'center', fontWeight: 'bold', border: '1px solid rgba(46,204,113,0.3)', fontSize: '0.95rem' }}>
            🎉 {demoOtpAlert}
          </div>
        )}

        {/* EMAIL OTP LOGIN FLOW */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="auth-input-group">
              <label>Verification Code</label>
              <div className="auth-input-wrapper">
                <Key className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  maxLength={6}
                  minLength={6}
                  style={{ letterSpacing: '0.2em', textAlign: 'center', fontWeight: 'bold', fontSize: '1.15rem' }}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {timer > 0 ? (
                <span style={{ color: '#7f8c8d' }}>Resend code in {timer}s</span>
              ) : (
                <button 
                  type="button" 
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={handleSendOtp}
                >
                  Resend Code
                  </button>
              )}
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: '#7f8c8d', fontSize: '0.85rem', cursor: 'pointer', marginTop: '4px' }}
                onClick={() => {
                  setOtpSent(false);
                  setOtpCode('');
                  setDemoOtpAlert(null);
                }}
              >
                ← Use a different email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
