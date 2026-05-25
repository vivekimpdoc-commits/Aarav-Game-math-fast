import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function MiddleAlgebraGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    const isSolve = Math.random() > 0.5;
    let text = '';
    let correct = 0;
    
    if (isSolve) {
      // ax + b = c
      const a = Math.floor(Math.random() * 5) + 1; // 1 to 5
      const x = Math.floor(Math.random() * 10) - 5; // -5 to 4
      const b = Math.floor(Math.random() * 10) + 1;
      const c = (a * x) + b;
      
      correct = x;
      text = `Solve for x: ${a===1?'':a}x ${b>=0?'+':'-'} ${Math.abs(b)} = ${c}`;
    } else {
      // evaluate ax + b when x = y
      const a = Math.floor(Math.random() * 5) + 2;
      const x = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 10) + 1;
      
      correct = (a * x) + b;
      text = `Evaluate ${a}x + ${b} when x = ${x}`;
    }

    setQuestion({ text, correct });
    const newOps = [
      correct, correct+1, correct-1, correct*-1
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
      <h2 className="title">Algebra Fundamentals</h2>
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
