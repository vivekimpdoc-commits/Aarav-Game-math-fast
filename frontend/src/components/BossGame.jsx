import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Zap } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function BossGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    generateMixedQuestion();
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      addXp(Math.floor(score / 5)); // Award XP based on high score
    }
  }, [isPlaying, timeLeft]);

  const generateMixedQuestion = () => {
    const types = ['operations'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let maxNum = level > 10 ? 50 : 20;

    if (type === 'operations') {
      const isAdd = Math.random() > 0.5;
      let n1 = Math.floor(Math.random() * maxNum) + 1;
      let n2 = Math.floor(Math.random() * maxNum) + 1;
      if (!isAdd && n1 < n2) { const t = n1; n1 = n2; n2 = t; }
      const ans = isAdd ? n1 + n2 : n1 - n2;
      setCurrentQuestion({ type: 'text', text: `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`, correct: ans });
      
      const newOps = [ans, ans+2, ans-1, ans+10].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0,4));
    } 
    else if (type === 'numbers') {
      const skip = Math.floor(Math.random() * 5) + 1;
      const start = Math.floor(Math.random() * maxNum);
      const seq = [start, start + skip, start + skip*2];
      const ans = start + skip*3;
      setCurrentQuestion({ type: 'text', text: `Next: ${seq.join(', ')}, ?`, correct: ans });
      
      const newOps = [ans, ans+skip, ans-skip || 1, ans+1].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0,4));
    }
    else if (type === 'shapes') {
      const shapesList = [
        { name: 'Circle', style: { borderRadius: '50%', width: '80px', height: '80px', background: 'var(--primary)' } },
        { name: 'Square', style: { width: '80px', height: '80px', background: 'var(--secondary)' } },
        { name: 'Triangle', style: { width: '0', height: '0', borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '80px solid var(--quaternary)' } }
      ];
      const shape = shapesList[Math.floor(Math.random() * shapesList.length)];
      setCurrentQuestion({ type: 'shape', text: 'What shape?', correct: shape.name, style: shape.style });
      setOptions(shapesList.map(s => s.name).sort(() => Math.random() - 0.5));
    }
  };

  const handleAnswer = (opt) => {
    if (opt === currentQuestion.correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const multiplier = Math.min(newCombo, 5);
      setScore(s => s + (10 * multiplier));
      
      setFeedback({ type: 'correct', text: `Correct! ${multiplier > 1 ? multiplier+'x Combo!' : ''}` });
      setTimeout(() => {
        setFeedback(null);
        generateMixedQuestion();
      }, 300);
    } else {
      setCombo(0);
      setFeedback({ type: 'incorrect', text: 'Oops!' });
      setTimeout(() => setFeedback(null), 500);
    }
  };

  if (!isPlaying && timeLeft === 60) {
    return (
      <div className="game-container glass-panel" style={{textAlign: 'center', borderColor: 'var(--primary)', borderWidth: '3px'}}>
         <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="title" style={{color: 'var(--primary)'}}>🔥 Boss Mode 🔥</h1>
        <p style={{fontSize: '1.5rem', margin: '2rem 0'}}>60 seconds. Rapid-fire questions. Build your combo streak!</p>
        <button className="btn-primary" style={{fontSize: '2rem', padding: '1rem 3rem'}} onClick={startGame}>Start Challenge!</button>
      </div>
    );
  }

  if (!isPlaying && timeLeft === 0) {
     return (
      <div className="game-container glass-panel" style={{textAlign: 'center'}}>
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="title">Time's Up! ⏰</h1>
        <h2 style={{fontSize: '3rem', margin: '2rem 0', color: 'var(--primary)'}}>Final Score: {score}</h2>
        <p style={{fontSize: '1.5rem'}}>You earned {Math.floor(score / 5)} XP towards your Level!</p>
        <button className="btn-secondary" style={{marginTop: '2rem'}} onClick={startGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="game-container glass-panel" style={{border: combo > 2 ? '3px solid var(--primary)' : '1px solid white'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 1rem'}}>
         <div className="score-display" style={{position: 'static', background: 'var(--primary)', color: 'white'}}>
           <Timer /> {timeLeft}s
         </div>
         <div className="score-display" style={{position: 'static'}}>
           Score: {score}
         </div>
         {combo > 1 && (
           <div className="score-display" style={{position: 'static', background: 'var(--tertiary)', color: 'var(--quaternary)'}}>
             <Zap /> {combo}x COMBO!
           </div>
         )}
      </div>
      
      <h2 className="title" style={{marginTop: '2rem', fontSize: '2rem'}}>🔥 Boss Mode 🔥</h2>
      
      <div className="question-text">{currentQuestion?.text}</div>
      
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback.type === 'correct' ? 'success-text' : 'error-text'}>
            {feedback.text}
          </h1>
        </div>
      )}
    </div>
  );
}
