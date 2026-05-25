import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function MiddleGeometryGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    const isCircle = Math.random() > 0.5;
    let text = '';
    let correct = '';
    
    if (isCircle) {
      const r = Math.floor(Math.random() * 5) + 2;
      correct = `${2*r}π`;
      text = `Circle Radius = ${r}. Circumference?`;
      
      const newOps = [correct, `${r*r}π`, `${r}π`, `${(r+1)*2}π`].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    } else {
      const a1 = Math.floor(Math.random() * 50) + 30;
      const a2 = Math.floor(Math.random() * 50) + 30;
      correct = 180 - a1 - a2;
      text = `Triangle angles are ${a1}° & ${a2}°. 3rd angle?`;
      
      const newOps = [correct, correct+10, Math.abs(correct-10), 180].sort(() => Math.random() - 0.5);
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
      <h2 className="title">Middle School Geometry</h2>
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
