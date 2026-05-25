import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function FractionsGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    const isDecimal = Math.random() > 0.5;
    let text = ''; let correct = '';
    
    if (isDecimal) {
      const n1 = (Math.random() * 10).toFixed(1);
      const n2 = (Math.random() * 5).toFixed(1);
      const isAdd = Math.random() > 0.5;
      correct = isAdd ? (parseFloat(n1) + parseFloat(n2)).toFixed(1) : (parseFloat(n1) - parseFloat(n2)).toFixed(1);
      text = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;
      
      const newOps = [correct, (parseFloat(correct) + 1.2).toFixed(1), (parseFloat(correct) - 0.5).toFixed(1), (parseFloat(correct) + 0.1).toFixed(1)].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    } else {
      const den = Math.floor(Math.random() * 8) + 3;
      const num1 = Math.floor(Math.random() * den) + 1;
      const num2 = Math.floor(Math.random() * den) + 1;
      const isAdd = Math.random() > 0.5;
      
      let resNum = isAdd ? num1 + num2 : Math.abs(num1 - num2);
      correct = `${resNum}/${den}`;
      text = `${num1}/${den} ${isAdd ? '+' : '-'} ${num2}/${den} = ?`;
      
      const newOps = [correct, `${resNum + 1}/${den}`, `${Math.abs(resNum - 1)}/${den}`, `${resNum}/${den+1}`].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    }
    setQuestion({ text, correct });
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
      <h2 className="title">Fractions & Decimals</h2>
      <div className="question-text">{question?.text}</div>
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? 'Perfect! 🌟 +15 XP' : 'Oops! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
