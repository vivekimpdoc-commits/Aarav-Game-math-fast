import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameContext } from '../context/GameContext';

export default function NumbersGame() {
  const navigate = useNavigate();
  const { level, addXp } = useContext(GameContext);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = () => {
    // Difficulty scaling
    let skips = [1];
    let maxStart = 10;
    
    if (level > 3) { skips = [1, 2]; maxStart = 20; }
    if (level > 8) { skips = [2, 5]; maxStart = 50; }
    if (level > 15) { skips = [2, 3, 5, 10]; maxStart = 100; }
    if (level > 20) { skips = [3, 4, 7, 10]; maxStart = 200; }

    const skip = skips[Math.floor(Math.random() * skips.length)];
    const start = Math.floor(Math.random() * maxStart) + 1;
    
    const seq = [start, start + skip, start + skip * 2];
    const answer = start + skip * 3;
    
    const newOptions = [
      answer, 
      answer + skip, 
      Math.abs(answer - Math.floor(skip/2)) || answer + 1, 
      answer + 2
    ].sort(() => Math.random() - 0.5);
    
    setQuestion(`What comes next: ${seq.join(', ')}, ?`);
    setOptions([...new Set(newOptions)].slice(0,4));
  };

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const handleAnswer = (opt) => {
    const match = question.match(/, \?/);
    const parts = question.replace(match[0], '').replace('What comes next: ', '').split(', ').map(Number);
    const skip = parts[1] - parts[0];
    const correctAnswer = parts[2] + skip;

    if (opt === correctAnswer) {
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

  if (!question) return null;

  return (
    <div className="game-container glass-panel">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft />
      </button>
      <div className="score-display">Level {level}</div>
      
      <h2 className="title">Numbers Explorer</h2>
      
      <div className="question-text">{question}</div>
      
      <div className="options-grid">
        {options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
         