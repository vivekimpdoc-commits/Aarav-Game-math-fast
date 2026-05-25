import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Skull } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function GeniusGame() {
  const navigate = useNavigate();
  const { addXp } = useContext(GameContext);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setStreak(0);
    generateGeniusQuestion();
  };

  const generateGeniusQuestion = () => {
    const types = ['multiply', 'divide', 'multistep'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let qText = '';
    let correctAns = 0;

    if (type === 'multiply') {
      const n1 = Math.floor(Math.random() * 11) + 2;
      const n2 = Math.floor(Math.random() * 11) + 2;
      correctAns = n1 * n2;
      qText = `${n1} × ${n2} = ?`;
    } 
    else if (type === 'divide') {
      const n1 = Math.floor(Math.random() * 11) + 2;
      const n2 = Math.floor(Math.random() * 11) + 2;
      const prod = n1 * n2;
      correctAns = n1;
      qText = `${prod} ÷ ${n2} = ?`;
    }
    else if (type === 'multistep') {
      const n1 = Math.floor(Math.random() * 20) + 10;
      const n2 = Math.floor(Math.random() * 20) + 1;
      const n3 = Math.floor(Math.random() * 15) + 1;
      const isAddFirst = Math.random() > 0.5;
      
      if (isAddFirst) {
        correctAns = n1 + n2 - n3;
        qText = `${n1} + ${n2} - ${n3} = ?`;
      } else {
        correctAns = n1 - n2 + n3;
        qText = `${n1} - ${n2} + ${n3} = ?`;
      }
    }

    setCurrentQuestion({ text: qText, correct: correctAns });
    
    const newOps = [
      correctAns, 
      correctAns + (Math.floor(Math.random() * 3) + 1), 
      correctAns - (Math.floor(Math.random() * 3) + 1), 
      correctAns + 10
    ].sort(() => Math.random() - 0.5);
    
    setOptions([...new Set(newOps)].slice(0, 4));
  };

  const handleAnswer = (opt) => {
    if (opt === currentQuestion.correct) {
      setStreak(s => s + 1);
      setFeedback({ type: 'correct', text: 'Genius!' });
      setTimeout(() => {
        setFeedback(null);
        generateGeniusQuestion();
      }, 500);
    } else {
      setIsGameOver(true);
      setIsPlaying(false);
      addXp(streak * 10); // Reward heavily for streak
    }
  };

  if (!isPlaying && !isGameOver) {
    return (
      <div className="game-container glass-panel" style={{textAlign: 'center', borderColor: '#8e44ad', borderWidth: '4px', background: '#f5eef8'}}>
         <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="title" style={{color: '#8e44ad'}}><Skull style={{display:'inline', marginBottom: '-5px'}}/> Genius Mode</h1>
        <p style={{fontSize: '1.5rem', margin: '2rem 0'}}>Multiplication, Division, Multi-step. <br/><br/><strong>ONE mistake and it's GAME OVER.</strong></p>
        <button className="btn-primary" style={{fontSize: '2rem', padding: '1rem 3rem', background: '#8e44ad'}} onClick={startGame}>Accept Risk</button>
      </div>
    );
  }

  if (isGameOver) {
     return (
      <div className="game-container glass-panel" style={{textAlign: 'center', background: '#fdedec'}}>
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft />
        </button>
        <h1 className="title" style={{color: 'var(--primary)'}}>Game Over 💀</h1>
        <h2 style={{fontSize: '3rem', margin: '2rem 0'}}>Streak: {streak}</h2>
        <p style={{fontSize: '1.5rem'}}>You earned {streak * 10} XP!</p>
        <button className="btn-secondary" style={{marginTop: '2rem', background: '#8e44ad'}} onClick={startGame}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="game-container glass-panel" style={{borderColor: '#8e44ad', borderWidth: '3px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 1rem'}}>
         <div className="score-display" style={{position: 'static', background: '#8e44ad', color: 'white'}}>
           Streak: {streak}
         </div>
      </div>
      
      <h2 className="title" style={{marginTop: '2rem', fontSize: '2rem', color: '#8e44ad'}}>Genius Survival</h2>
      
      <div className="question-text" style={{fontSize: '4rem'}}>{currentQuestion?.text}</div>
      
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)} style={{borderColor: '#8e44ad', color: '#8e44ad'}}>
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="feedback-overlay">
          <h1 className="success-text" style={{color: '#8e44ad'}}>
            {feedback.text}
          </h1>
        </div>
      )}
    </div>
  );
}
