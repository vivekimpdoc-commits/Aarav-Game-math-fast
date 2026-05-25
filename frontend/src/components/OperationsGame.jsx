import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function OperationsGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [op, setOp] = useState('+');
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    let maxNum = 10;
    let allowSub = false;

    if (level > 5) { maxNum = 20; allowSub = true; }
    if (level > 10) { maxNum = 50; }
    if (level > 18) { maxNum = 100; }

    const isAdd = allowSub ? Math.random() > 0.5 : true;
    let n1 = Math.floor(Math.random() * maxNum) + 1;
    let n2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (!isAdd && n1 < n2) {
      const temp = n1;
      n1 = n2;
      n2 = temp;
    }

    setNum1(n1);
    setNum2(n2);
    setOp(isAdd ? '+' : '-');

    const ans = isAdd ? n1 + n2 : n1 - n2;
    const newOptions = [
      ans,
      ans + Math.floor(Math.random() * 5) + 1,
      Math.abs(ans - Math.floor(Math.random() * 3) - 1),
      ans + 10
    ].sort(() => Math.random() - 0.5);
    
    setOptions([...new Set(newOptions)].slice(0,4));
  };

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const handleAnswer = (opt) => {
    const correct = op === '+' ? num1 + num2 : num1 - num2;
    if (opt === correct) {
      setFeedback('correct');
      addXp(10);
      setTimeout(() => {
        setFeedback(null);
        generateQuestion();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="game-container glass-panel">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft />
      </button>
      <div className="score-display">Level {level}</div>
      
      <h2 className="title">Operation Station</h2>
      
      <div className="visual-area">
        {op === '+' && num1 + num2 <= 15 && (
          <>
             <div style={{display:'flex', gap: '5px', flexWrap: 'wrap'}}>
               {Array(num1).fill(0).map((_,i) => <div key={'n1'+i} className="block"></div>)}
             </div>
             <div style={{fontSize: '2rem', alignSelf: 'center'}}>+</div>
             <div style={{display:'flex', gap: '5px', flexWrap: 'wrap'}}>
               {Array(num2).fill(0).map((_,i) => <div key={'n2'+i} className="block" style={{background: 'var(--secondary)'}}></div>)}
             </div>
          </>
        )}
      </div>

      <div className="question-text">{num1} {op} {num2} = ?</div>
      
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>

   