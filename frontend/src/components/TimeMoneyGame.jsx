import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function TimeMoneyGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [coins, setCoins] = useState([]);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    let coinTypes = [1, 2];
    let maxCoins = 3;

    if (level > 4) { coinTypes = [1, 2, 5]; maxCoins = 4; }
    if (level > 9) { coinTypes = [1, 2, 5, 10]; maxCoins = 5; }
    if (level > 15) { coinTypes = [5, 10, 20, 50]; maxCoins = 5; }
    if (level > 20) { coinTypes = [10, 20, 50, 100]; maxCoins = 6; }

    const numCoins = Math.floor(Math.random() * maxCoins) + 2;
    
    let total = 0;
    const currentCoins = [];
    for(let i=0; i<numCoins; i++) {
      const type = coinTypes[Math.floor(Math.random() * coinTypes.length)];
      total += type;
      currentCoins.push(type);
    }

    setCoins(currentCoins);

    const newOptions = [
      total,
      total + 5,
      Math.abs(total - 2) || 1,
      total + 10
    ].sort(() => Math.random() - 0.5);
    
    setOptions([...new Set(newOptions)].slice(0,4));
  };

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const handleAnswer = (opt) => {
    const correct = coins.reduce((a,b) => a+b, 0);
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
      
      <h2 className="title">Time & Money Market</h2>
      
      <div className="question-text">How much money is this?</div>
      
      <div className="visual-area">
        {coins.map((c, i) => (
          <div key={i} className="coin" style={c >= 20 ? {borderRadius: '5px', width: '90px', height: '50px', background: c===100?'#673ab7':c===50?'#009688':'#ff9800', border: '2px solid white', color: 'white'} : {}}>
             ₹{c}
          </div>
        ))}
      </div>
      
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
            ₹{opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? 'Cha-Ching! 💰 +10 XP' : 'Oops! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
