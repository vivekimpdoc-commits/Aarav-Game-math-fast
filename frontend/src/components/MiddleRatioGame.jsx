import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function MiddleRatioGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

  const generateQuestion = () => {
    const isPerc = Math.random() > 0.5;
    let text = '';
    let correct = '';
    
    if (isPerc) {
      const percs = [10, 20, 25, 50, 75];
      const p = percs[Math.floor(Math.random() * percs.length)];
      const total = (Math.floor(Math.random() * 10) + 1) * 20;
      correct = (p / 100) * total;
      text = `What is ${p}% of ${total}?`;
      
      const newOps = [correct, correct+10, Math.abs(correct-10)||5, correct*2].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    } else {
      const mult = Math.floor(Math.random() * 5) + 2;
      const r1 = Math.floor(Math.random() * 5) + 1;
      const r2 = Math.floor(Math.random() * 5) + 2;
      const d = gcd(r1, r2);
      const simpR1 = r1/d; const simpR2 = r2/d;
      
      correct = `${simpR1}:${simpR2}`;
      text = `Simplify ratio ${r1*mult}:${r2*mult}`;
      
      const newOps = [correct, `${simpR2}:${simpR1}`, `${simpR1+1}:${simpR2}`, `${simpR1}:${simpR2+1}`].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    }
    setQuestion({ text, correct: correct.toString() });
  };

  useEffect(() => { generateQuestion(); }, [level]);

  const handleAnswer = (opt) => {
    if (opt.toString() === question.correct) {
      setFeedback('correct'); addXp(20);
      setTimeout(() => { setFeedback(null); generateQuestion(); }, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="game-container glass-panel">
      <button className="back-btn" onClick={() => navigate('/')}><ArrowLeft /></button>
      <div className="score-display">Level {level}</div>
      <h2 className="title">Ratio & Percentage</h2>
      <div className="question-text">{question?.text}</div>
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? 'Genius! 🌟 +20 XP' : 'Oops! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
