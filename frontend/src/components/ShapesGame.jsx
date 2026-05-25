import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function ShapesGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);

  const basicShapes = [
    { name: 'Circle', style: { borderRadius: '50%', width: '100px', height: '100px', background: 'var(--primary)' } },
    { name: 'Square', style: { width: '100px', height: '100px', background: 'var(--secondary)' } },
    { name: 'Triangle', style: { width: '0', height: '0', borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: '100px solid var(--quaternary)' } }
  ];

  const intermediateShapes = [
    { name: 'Rectangle', style: { width: '150px', height: '80px', background: 'var(--tertiary)' } },
    { name: 'Oval', style: { width: '150px', height: '100px', background: '#9b59b6', borderRadius: '50%' } }
  ];

  const advancedShapes = [
    { name: 'Diamond', style: { width: '80px', height: '80px', background: '#e67e22', transform: 'rotate(45deg)' } },
    { name: 'Parallelogram', style: { width: '150px', height: '100px', background: '#34495e', transform: 'skew(20deg)' } }
  ];

  const [currentShape, setCurrentShape] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    let availableShapes = [...basicShapes];
    
    if (level > 5) availableShapes = [...availableShapes, ...intermediateShapes];
    if (level > 15) availableShapes = [...availableShapes, ...advancedShapes];

    const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    setCurrentShape(shape);

    const newOptions = availableShapes.map(s => s.name).sort(() => Math.random() - 0.5);
    setOptions([...new Set(newOptions)].slice(0, 4));
  };

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const handleAnswer = (opt) => {
    if (opt === currentShape.name) {
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

  if (!currentShape) return null;

  return (
    <div className="game-container glass-panel">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft />
      </button>
      <div className="score-display">Level {level}</div>
      
      <h2 className="title">Shape Universe</h2>
      
      <div className="question-text">What shape is this?</div>
      
      <div className="visual-area" style={{ height: '150px', alignItems: 'center' }}>
        <div style={currentShape.style}></div>
      </div>
      
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="feedback-overlay">
          <h1 className={feedback === 'correct' ? 'success-text' : 'error-text'}>
            {feedback === 'correct' ? 'Super Shape! 🔶 +10 XP' : 'Try Again! ❌'}
          </h1>
        </div>
      )}
    </div>
  );
}
