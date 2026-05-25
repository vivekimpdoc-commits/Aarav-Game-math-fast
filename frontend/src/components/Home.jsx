import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Clock, 
  Zap, 
  Skull, 
  DivideSquare, 
  PieChart, 
  Ruler, 
  BarChart2, 
  Hash, 
  Percent, 
  Variable, 
  Circle, 
  Brain,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Trophy,
  Sparkles,
  LogOut,
  TrendingUp,
  Users
} from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

export default function Home() {
  const { level, xp, xpNeeded, user, logout } = useContext(GameContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Backend Leaderboard State
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const nickname = user ? user.username : 'Math Prodigy';
  const progressPercent = (xp / xpNeeded) * 100;

  // Fetch live leaderboards
  useEffect(() => {
    if (activeTab === 'overview') {
      setLoadingLeaderboard(true);
      fetch('http://localhost:5000/api/game/scores')
        .then(res => res.json())
        .then(data => {
          if (data && data.scores && data.scores.length > 0) {
            setLeaderboard(data.scores);
          } else {
            setLeaderboard([]);
          }
          setLoadingLeaderboard(false);
        })
        .catch(err => {
          console.warn("Could not connect to backend score api. Using default leaderboard.", err);
          setLeaderboard([]);
          setLoadingLeaderboard(false);
        });
    }
  }, [activeTab]);

  // Calculate Rank Title based on level
  const getRankTitle = (lvl) => {
    if (lvl >= 21) return "Math Legend 👑";
    if (lvl >= 16) return "Geometry Guru 📐";
    if (lvl >= 11) return "Equation Expert 🎓";
    if (lvl >= 6) return "Number Ninja 🥷";
    return "Math Novice 🔢";
  };

  // Timeline percentage calculator
  const getTimelinePercentage = () => {
    if (level <= 1) return 0;
    if (level >= 25) return 100;
    return ((level - 1) / 24) * 100;
  };

  // Badges structure
  const badges = [
    { id: 1, name: "First Steps", desc: "Reach Level 2", req: 2, icon: "🌱" },
    { id: 2, name: "Number Ninja", desc: "Reach Level 6", req: 6, icon: "🥷" },
    { id: 3, name: "Equation Expert", desc: "Reach Level 11", req: 11, icon: "🎓" },
    { id: 4, name: "Geometry Guru", desc: "Reach Level 16", req: 16, icon: "📐" },
    { id: 5, name: "Math Legend", desc: "Reach Level 21", req: 21, icon: "👑" },
    { id: 6, name: "Grandmaster", desc: "Reach Level 25", req: 25, icon: "🏆" },
  ];

  // Smart Recommendation based on level
  const getRecommendation = () => {
    if (level < 6) {
      return { name: "Operations Game", link: "/operations", desc: "Master basic arithmetic: addition, subtraction, multiplication & division!" };
    } else if (level < 11) {
      return { name: "Logic Puzzles", link: "/logic", desc: "Boost your logical deduction skills and solve Emoji Algebra!" };
    } else if (level < 16) {
      return { name: "Integers & Rational Numbers", link: "/middle-integers", desc: "Learn operating with negative numbers, fractions, and decimals!" };
    } else if (level < 21) {
      return { name: "Algebra", link: "/middle-algebra", desc: "Evaluate variables, expressions, and solve one-step equations!" };
    } else {
      return { name: "Genius Survival", link: "/genius", desc: "Test your math reflexes in sudden-death survival mode!" };
    }
  };

  const recommendedGame = getRecommendation();

  // Merge client stats + backend or default stats
  const getDisplayLeaderboard = () => {
    const userScoreValue = (level - 1) * xpNeeded + xp;
    
    if (leaderboard.length > 0) {
      // Map live rows from backend database
      return leaderboard.map((item, idx) => ({
        rank: idx + 1,
        username: item.username,
        score: item.score,
        badge: item.game_type || "Game Mod",
        isCurrentUser: item.username.toLowerCase() === nickname.toLowerCase()
      }));
    }

    // Default High-concept leaderboard fallback
    const simulated = [
      { username: "Anya Sharma", score: 850, badge: "Boss Expert" },
      { username: "Kabir Roy", score: 720, badge: "Genius Mode" },
      { username: "Rohan Das", score: 580, badge: "Algebra Core" },
      { username: nickname, score: userScoreValue, badge: "My Progress", isCurrentUser: true },
      { username: "Zara Patel", score: 320, badge: "Primary Ops" },
    ];

    return simulated
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({
        rank: idx + 1,
        ...item
      }));
  };

  const displayLeaderboard = getDisplayLeaderboard();

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="sidebar-title">Math Master</div>
          <div className="sidebar-subtitle">LMS Academy</div>
        </div>
        
        <div className="profile-card">
          <div className="profile-avatar">⭐</div>
          <div className="profile-name">{nickname}</div>
          <div className="profile-rank">{getRankTitle(level)}</div>
          
          <div className="xp-progress-container">
            <div className="xp-progress-bar">
              <div className="xp-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="xp-progress-text">
              <span>Level {level}</span>
              <span>{xp} / {xpNeeded} XP</span>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-menu">
          <button 
            className={`menu-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard className="menu-icon" />
            Overview
          </button>
          <button 
            className={`menu-btn ${activeTab === 'primary' ? 'active' : ''}`}
            onClick={() => setActiveTab('primary')}
          >
            <GraduationCap className="menu-icon" />
            Primary (Classes 1-5)
          </button>
          <button 
            className={`menu-btn ${activeTab === 'middle' ? 'active' : ''}`}
            onClick={() => setActiveTab('middle')}
          >
            <BookOpen className="menu-icon" />
            Middle (Classes 6-7)
          </button>
          <button 
            className={`menu-btn ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
          >
            <Trophy className="menu-icon" />
            Challenges
          </button>
          <button 
            className="menu-btn"
            onClick={logout}
            style={{ marginTop: '1.5rem', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}
          >
            <LogOut className="menu-icon" style={{ color: '#e74c3c' }} />
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <div className="welcome-card glass-panel">
              <h2>Good day, {nickname}! 🚀</h2>
              <p>Keep leveling up to advance along the math learning path, unlock new levels, and claim your place on the leaderboard!</p>
            </div>

            {/* HIGH-CONCEPT: Learning Path Stepper */}
            <div>
              <h2 className="dashboard-section-title">
                <TrendingUp style={{ width: '24px', height: '24px' }} />
                Your Math Learning Path
              </h2>
              
              <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto', background: 'rgba(255,255,255,0.75)' }}>
                <div className="timeline-container" style={{ minWidth: '600px' }}>
                  <div className="timeline-line"></div>
                  <div className="timeline-progress" style={{ width: `${getTimelinePercentage()}%` }}></div>
                  
                  <div className={`timeline-node ${level >= 1 ? (level >= 6 ? 'completed' : 'active') : ''}`}>
                    <div className="node-dot">1</div>
                    <div className="node-label">Novice</div>
                  </div>
                  <div className={`timeline-node ${level >= 6 ? (level >= 11 ? 'completed' : 'active') : ''}`}>
                    <div className="node-dot">6</div>
                    <div className="node-label">Ninja</div>
                  </div>
                  <div className={`timeline-node ${level >= 11 ? (level >= 16 ? 'completed' : 'active') : ''}`}>
                    <div className="node-dot">11</div>
                    <div className="node-label">Expert</div>
                  </div>
                  <div className={`timeline-node ${level >= 16 ? (level >= 21 ? 'completed' : 'active') : ''}`}>
                    <div className="node-dot">16</div>
                    <div className="node-label">Guru</div>
                  </div>
                  <div className={`timeline-node ${level >= 21 ? (level >= 25 ? 'completed' : 'active') : ''}`}>
                    <div className="node-dot">21</div>
                    <div className="node-label">Legend</div>
                  </div>
                  <div className={`timeline-node ${level >= 25 ? 'completed' : ''}`}>
                    <div className="node-dot">25</div>
                    <div className="node-label">Max</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <h2 className="dashboard-section-title">
                <Sparkles style={{ width: '24px', height: '24px' }} />
                Your Academy Statistics
              </h2>
              
              <div className="overview-stats">
                <div className="stat-box glass-panel">
                  <div className="stat-val">{level}</div>
                  <div className="stat-label">Current Level</div>
                </div>
                <div className="stat-box glass-panel">
                  <div className="stat-val">{xp} XP</div>
                  <div className="stat-label">XP Progress</div>
                </div>
                <div className="stat-box glass-panel">
                  <div className="stat-val">{Math.min(Math.round(((level - 1) * xpNeeded + xp) / (25 * xpNeeded) * 100), 100)}%</div>
                  <div className="stat-label">Academy Completion</div>
                </div>
              </div>
            </div>

            {/* Smart Recommendation Card */}
            <div className="glass-panel" style={{ padding: '2rem', border: '3px solid var(--secondary)', background: 'rgba(255, 255, 255, 0.9)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Sparkles style={{ color: 'var(--secondary)' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--quaternary)', margin: 0 }}>Smart Recommendation</h3>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', margin: 0 }}>
                Based on your level <strong>({level})</strong>, we recommend practicing: <strong style={{ color: 'var(--primary)' }}>{recommendedGame.name}</strong>.
              </p>
              <div style={{ fontSize: '0.95rem', color: '#5d6d7e' }}>
                {recommendedGame.desc}
              </div>
              <div>
                <Link to={recommendedGame.link} className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: '1.2rem', padding: '10px 25px' }}>
                  Start Learning Now
                </Link>
              </div>
            </div>

            {/* HIGH-CONCEPT: Global & Simulated Leaderboard */}
            <div>
              <h2 className="dashboard-section-title">
                <Users style={{ width: '24px', height: '24px' }} />
                Academy Leaderboard
              </h2>
              
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.75)' }}>
                {loadingLeaderboard ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', fontWeight: 'bold', color: 'var(--quaternary)' }}>
                    Loading leaderboard...
                  </div>
                ) : (
                  <div className="leaderboard-table">
                    <div className="leaderboard-header-row">
                      <span>Rank</span>
                      <span>Student</span>
                      <span>Score (XP)</span>
                      <span style={{ textAlign: 'right' }}>Honorific</span>
                    </div>
                    {displayLeaderboard.map((student, idx) => (
                      <div 
                        key={idx} 
                        className={`leaderboard-row ${student.isCurrentUser ? 'current-user' : ''}`}
                      >
                        <div className={`rank-badge top-${student.rank}`}>
                          {student.rank}
                        </div>
                        <div className="leaderboard-name">
                          {student.username} {student.isCurrentUser && "⭐ (You)"}
                        </div>
                        <div className="leaderboard-score">
                          {student.score} XP
                        </div>
                        <div className="leaderboard-badge" style={{ textAlign: 'right' }}>
                          {student.badge}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="dashboard-section-title">
                <Trophy style={{ width: '24px', height: '24px' }} />
                Badges & Achievements
              </h2>
              <div className="badge-grid">
                {badges.map((badge) => {
                  const isUnlocked = level >= badge.req;
                  return (
                    <div key={badge.id} className={`badge-card glass-panel ${isUnlocked ? 'unlocked' : ''}`}>
                      <div className="badge-icon-wrapper">
                        {isUnlocked ? badge.icon : "🔒"}
                      </div>
                      <div className="badge-name">{badge.name}</div>
                      <div className="badge-desc">{badge.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: PRIMARY SCHOOL (CLASSES 1-5) */}
        {activeTab === 'primary' && (
          <>
            <div>
              <h2 className="dashboard-section-title">
                <GraduationCap style={{ width: '24px', height: '24px' }} />
                Primary School Modules (Classes 1-5)
              </h2>
              <div className="card-grid">
                <Link to="/operations" className="glass-panel game-card">
                  <span className="game-card-badge badge-primary">Class 1-5</span>
                  <Calculator className="icon" />
                  <h2>Operations</h2>
                  <p className="game-card-info">Basic operations: addition, subtraction, multiplication & division.</p>
                </Link>
                
                <Link to="/time-money" className="glass-panel game-card">
                  <span className="game-card-badge badge-primary">Class 1-5</span>
                  <Clock className="icon" />
                  <h2>Time & Money</h2>
                  <p className="game-card-info">Tell time, calculate durations, and manage cash transactions.</p>
                </Link>
                
                <Link to="/advanced-ops" className="glass-panel game-card">
                  <span className="game-card-badge badge-primary">Class 1-5</span>
                  <DivideSquare className="icon" style={{color: '#3498db'}} />
                  <h2>Advanced Ops</h2>
                  <p className="game-card-info">Solve multi-digit equations, remainders, and estimation.</p>
                </Link>
                
                <Link to="/fractions" className="glass-panel game-card">
                  <span className="game-card-badge badge-primary">Class 1-5</span>
                  <PieChart className="icon" style={{color: '#e67e22'}} />
                  <h2>Fractions & Decimals</h2>
                  <p className="game-card-info">Understand parts of a whole, decimals, and equivalent fractions.</p>
                </Link>
                
                <Link to="/measurement" className="glass-panel game-card">
                  <span className="game-card-badge badge-primary">Class 1-5</span>
                  <Ruler className="icon" style={{color: '#27ae60'}} />
                  <h2>Measurement</h2>
                  <p className="game-card-info">Master units of length, weight, capacity, and unit conversions.</p>
                </Link>
                
                <Link to="/data" className="glass-panel game-card">
                  <span className="game-card-badge badge-primary">Class 1-5</span>
                  <BarChart2 className="icon" style={{color: '#e74c3c'}} />
                  <h2>Data Analysis</h2>
                  <p className="game-card-info">Read and interpret graphs, frequency tables, and calculate averages.</p>
                </Link>
                
                <Link to="/logic" className="glass-panel game-card" style={{ border: '3px solid #f1c40f', background: '#fcf3cf' }}>
                  <span className="game-card-badge badge-primary">Class 1-5</span>
                  <Brain className="icon" style={{color: '#f1c40f'}} />
                  <h2 style={{color: '#b7950b'}}>Logic Puzzles</h2>
                  <p className="game-card-info">Solve sequence patterns, emoji algebra equations, and brain teasers.</p>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* TAB 3: MIDDLE SCHOOL (CLASSES 6-7) */}
        {activeTab === 'middle' && (
          <>
            <div>
              <h2 className="dashboard-section-title">
                <BookOpen style={{ width: '24px', height: '24px' }} />
                Middle School Modules (Classes 6-7)
              </h2>
              <div className="card-grid">
                <Link to="/middle-integers" className="glass-panel game-card">
                  <span className="game-card-badge badge-middle">Class 6-7</span>
                  <Hash className="icon" style={{color: '#9b59b6'}} />
                  <h2>Integers</h2>
                  <p className="game-card-info">Operations with negative numbers, fractions, decimals, and number lines.</p>
                </Link>
                
                <Link to="/middle-ratio" className="glass-panel game-card">
                  <span className="game-card-badge badge-middle">Class 6-7</span>
                  <Percent className="icon" style={{color: '#1abc9c'}} />
                  <h2>Ratio & Percentage</h2>
                  <p className="game-card-info">Calculate rates, ratios, proportion problems, and percentage change.</p>
                </Link>
                
                <Link to="/middle-algebra" className="glass-panel game-card">
                  <span className="game-card-badge badge-middle">Class 6-7</span>
                  <Variable className="icon" style={{color: '#f1c40f'}} />
                  <h2>Algebra</h2>
                  <p className="game-card-info">Evaluate variables, expressions, and solve simple one-step equations.</p>
                </Link>
                
                <Link to="/middle-geometry" className="glass-panel game-card">
                  <span className="game-card-badge badge-middle">Class 6-7</span>
                  <Circle className="icon" style={{color: '#e84393'}} />
                  <h2>Geometry</h2>
                  <p className="game-card-info">Calculate area, circumference, lines, angles, and symmetry.</p>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* TAB 4: CHALLENGES */}
        {activeTab === 'challenges' && (
          <>
            <div>
              <h2 className="dashboard-section-title">
                <Trophy style={{ width: '24px', height: '24px' }} />
                Special Challenges & Boss Fights
              </h2>
              <div className="card-grid">
                <Link to="/boss" className="glass-panel game-card" style={{ border: '2px solid var(--primary)', background: '#ffebeb' }}>
                  <span className="game-card-badge badge-danger">Boss Fight</span>
                  <Zap className="icon" style={{color: 'var(--primary)'}} />
                  <h2>🔥 Boss Mode 🔥</h2>
                  <p className="game-card-info">Rapid-fire questions under strict time limits. The ultimate speed test!</p>
                </Link>
                
                <Link to="/genius" className="glass-panel game-card" style={{ border: '3px solid #8e44ad', background: '#f5eef8' }}>
                  <span className="game-card-badge badge-genius">Hardcore</span>
                  <Skull className="icon" style={{color: '#8e44ad'}} />
                  <h2 style={{color: '#8e44ad'}}>Genius Survival</h2>
                  <p className="game-card-info">Sudden death mode. One wrong answer and it's game over!</p>
                </Link>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
