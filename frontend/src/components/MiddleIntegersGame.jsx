import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function MiddleIntegersGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    const isMult = Math.random() > 0.5;
    let n1 = Math.floor(Math.random() * 30) - 15;
    let n2 = Math.floor(Math.random() * 30) - 15;
    if (n1 === 0) n1 = 1;
    if (n2 === 0) n2 = -1;
    
    let text = '';
    let correct = 0;
    
    if (isMult) {
      const isDiv = Math.random() > 0.5;
      if(isDiv) {
         correct = n1;
         text = `${n1*n2} ÷ ${n2} = ?`;
      } else {
         correct = n1 * n2;
         text = `${n1} × ${n2} = ?`;
      }
    } else {
      const isSub = Math.random() > 0.5;
      correct = isSub ? n1 - n2 : n1 + n2;
      const op = isSub ? '-' : '+';
      text = `${n1} ${op} ${n2 < 0 ? '('+n2+')' : n2} = ?`;
    }

    setQuestion({ text, correct });
    const newOps = [
      correct,
      correct * -1,
      correct + (Math.floor(Math.random() * 5) + 1),
      correct - (Math.floor(Math.random() * 5) + 1)
    ].sort(() => Math.random() - 0.5);
    setOptions([...new Set(newOps)].slice(0, 4));
  };

  useEffect(() => { generateQuestion(); }, [level]);

  const handleAnswer = (opt) => {
    if (opt === question.correct) {
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
      <h2 className="title">Integers & Rationals</h2>
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
