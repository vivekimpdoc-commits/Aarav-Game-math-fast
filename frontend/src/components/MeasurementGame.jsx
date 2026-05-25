import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function MeasurementGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showTip, setShowTip] = useState(false);

  const generateQuestion = () => {
    setShowTip(false); // Reset tip state for new question
    const types = ['convert', 'area', 'perimeter'];
    const type = types[Math.floor(Math.random() * types.length)];
    let text = ''; let correct = ''; let tip = '';
    
    if (type === 'convert') {
      const val = Math.floor(Math.random() * 10) + 1;
      const isCm = Math.random() > 0.5;
      if (isCm) {
         correct = val * 100; 
         text = `${val} meters = ? cm`;
         tip = "💡 Hint: 1 meter is exactly 100 centimeters. Just multiply by 100!";
      } else {
         correct = val * 1000; 
         text = `${val} kg = ? grams`;
         tip = "💡 Hint: 1 kilogram is exactly 1000 grams. Just multiply by 1000!";
      }
      const newOps = [correct, correct*10, correct/10, correct+100].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    } else {
      const w = Math.floor(Math.random() * 10) + 2;
      const h = Math.floor(Math.random() * 10) + 2;
      if (type === 'area') {
        correct = w * h; 
        text = `Area of a ${w}x${h} rectangle?`;
        tip = "💡 Hint: Area = Width × Height. Multiply the two numbers together!";
      } else {
        correct = 2 * (w + h); 
        text = `Perimeter of a ${w}x${h} rectangle?`;
        tip = "💡 Hint: Perimeter = Add all 4 sides! (Width + Height) × 2";
      }
      const newOps = [correct, correct+2, correct-2, w*h + 2*(w+h)].sort(() => Math.random() - 0.5);
      setOptions([...new Set(newOps)].slice(0, 4));
    }
    setQuestion({ text, correct: correct.toString(), tip });
  };

  useEffect(() => { generateQuestion(); }, [level]);

  const handleAnswer = (opt) => {
    if (opt.toString() === question.correct) {
      setFeedback('correct'); 
      addXp(showTip ? 10 : 15); // Less XP if they used a tip
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
      <h2 className="title">Measurement & Geometry</h2>
      
      <div className="question-text" style={{fontSize: '3rem'}}>{question?.text}</div>
      
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        {!showTip ? (
          <button 
            onClick={() => setShowTip(true)} 
            style={{background: '#f1c40f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto'}}
          >
            <Lightbulb size={20} /> Need a hint?
          </button>
        ) : (
          <div style={{background: '#fff9c4', color: '#f39c12', padding: '15px', borderRadius: '15px', fontWeight: 'bold', display: 'inline-block', border: '2px dashed #f39c12'}}>
            {question?.tip}
          </div>
        )}
      </div>

      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      
      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? (showTip ? 'Correct! 🌟 +10 XP' : 'Measured Perfectly! 📏 +15 XP') : 'Oops! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
