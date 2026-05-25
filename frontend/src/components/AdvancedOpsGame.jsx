import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function AdvancedOpsGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    const isMult = Math.random() > 0.5;
    let text = '';
    let correct = 0;
    
    let multMax = level > 10 ? 50 : 20;
    
    if (isMult) {
      const n1 = Math.floor(Math.random() * multMax) + 10;
      const n2 = Math.floor(Math.random() * 15) + 2;
      correct = n1 * n2;
      text = `${n1} × ${n2} = ?`;
    } else {
      const divisor = Math.floor(Math.random() * 9) + 2;
      const quotient = Math.floor(Math.random() * multMax) + 5;
      const dividend = divisor * quotient;
      correct = quotient;
      text = `${dividend} ÷ ${divisor} = ?`;
    }

    setQuestion({ text, correct });
    const newOps = [
      correct,
      correct + (Math.floor(Math.random() * 5) + 1),
      Math.abs(correct - (Math.floor(Math.random() * 5) + 1)),
      correct + 10
    ].sort(() => Math.random() - 0.5);
    setOptions([...new Set(newOps)].slice(0, 4));
  };

  useEffect(() => { generateQuestion(); }, [level]);

  const handleAnswer = (opt) => {
    if (opt === question.correct) {
      setFeedback('correct'); addXp(15);
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
      <h2 className="title">Advanced Operations</h2>
      <div className="question-text">{question?.text}</div>
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? 'Genius! 🌟 +15 XP' : 'Oops! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
