import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function LogicPuzzleGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    const isEmoji = Math.random() > 0.5;
    let text = ''; let correct = '';
    
    if (isEmoji) {
      const emojis = ['🍎', '🍌', '🍉', '⭐', '🚀'];
      const e1 = emojis[Math.floor(Math.random() * emojis.length)];
      let e2 = emojis[Math.floor(Math.random() * emojis.length)];
      while(e1 === e2) e2 = emojis[Math.floor(Math.random() * emojis.length)];
      
      const v1 = Math.floor(Math.random() * 10) + 2;
      const v2 = Math.floor(Math.random() * 10) + 1;
      
      correct = v2;
      text = `If ${e1} + ${e1} = ${v1*2}\nand ${e1} + ${e2} = ${v1+v2}\nwhat is ${e2}?`;
      
      const newOps = [correct, correct+1, correct+2, Math.abs(correct-2)||1].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    } else {
      const isMult = Math.random() > 0.5;
      const start = Math.floor(Math.random() * 5) + 1;
      const step = Math.floor(Math.random() * 5) + 2;
      
      let seq = [];
      for(let i=0; i<4; i++) {
         if(isMult) seq.push(start * Math.pow(step, i));
         else seq.push(start + (step * i));
      }
      
      correct = isMult ? start * Math.pow(step, 4) : start + (step * 4);
      text = `Next number?\n${seq.join(', ')}, ?`;
      
      const newOps = [correct, correct+step, correct-step, correct*2].sort(() => Math.random() - 0.5);
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
      <h2 className="title">Logic & Patterns</h2>
      <div className="question-text" style={{whiteSpace: 'pre-wrap', fontSize: '2.5rem', lineHeight: '1.5'}}>{question?.text}</div>
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? 'Brilliant! 🌟 +20 XP' : 'Oops! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
