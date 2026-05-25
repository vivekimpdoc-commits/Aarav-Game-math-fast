import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function DataGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [data, setData] = useState({});
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    const A = Math.floor(Math.random() * 10) + 2;
    const B = Math.floor(Math.random() * 10) + 2;
    const C = Math.floor(Math.random() * 10) + 2;
    setData({ Apples: A, Bananas: B, Cherries: C });
    
    const isSum = Math.random() > 0.5;
    let correct = 0; let text = '';
    
    if (isSum) {
      correct = A + B; text = 'How many Apples and Bananas in total?';
    } else {
      correct = Math.abs(A - C); text = 'What is the difference between Apples and Cherries?';
    }

    setQuestion({ text, correct: correct.toString() });
    const newOps = [correct, correct+1, Math.abs(correct-1), correct+2].sort(() => Math.random() - 0.5);
    setOptions([...new Set(newOps)].slice(0, 4));
  };

  useEffect(() => { generateQuestion(); }, [level]);

  const handleAnswer = (opt) => {
    if (opt.toString() === question.correct) {
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
      <h2 className="title">Data Analysis</h2>
      
      {/* CSS Bar Chart */}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '150px', gap: '20px', margin: '2rem 0', borderBottom: '2px solid var(--text-dark)', paddingBottom: '10px'}}>
         {Object.entries(data).map(([key, val]) => (
            <div key={key} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
               <div style={{fontWeight: 'bold', marginBottom: '5px'}}>{val}</div>
               <div style={{width: '50px', height: `${val * 10}px`, background: 'var(--primary)', borderRadius: '5px 5px 0 0', transition: 'height 0.5s'}}></div>
               <div style={{marginTop: '5px', fontSize: '1rem'}}>{key}</div>
            </div>
         ))}
      </div>

      <div className="question-text" style={{fontSize: '2rem'}}>{question?.text}</div>
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? 'Data Master! 📊 +15 XP' : 'Oops! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
