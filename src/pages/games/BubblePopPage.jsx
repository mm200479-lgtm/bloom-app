import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BubblePopPage.css';

const PASTEL_COLORS = [
  '#f8b4c8', '#b8d4f0', '#c8e8c0', '#f0d8a8',
  '#d4b8f0', '#a8e0e0', '#f0c0d8', '#c0d0f0',
];

function BubblePopPage({ onBack }) {
  const [bubbles, setBubbles] = useState([]);
  const [pops, setPops] = useState([]);
  const [score, setScore] = useState(0);
  const nextId = useRef(0);

  const spawnBubble = useCallback(() => {
    const id = nextId.current++;
    const x = 10 + Math.random() * 80;
    const size = 30 + Math.random() * 40;
    const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const speed = 4 + Math.random() * 6;

    setBubbles(prev => [...prev, { id, x, size, color, speed, y: 110 }]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnBubble, 800);
    spawnBubble();
    return () => clearInterval(interval);
  }, [spawnBubble]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y - 0.5 }))
          .filter(b => b.y > -20)
      );
    }, 50);
    return () => clearInterval(moveInterval);
  }, []);

  const popBubble = (bubble, e) => {
    e.stopPropagation();
    setScore(s => s + 1);
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));

    const popId = Date.now() + Math.random();
    setPops(prev => [...prev, { id: popId, x: bubble.x, y: bubble.y, color: bubble.color, size: bubble.size }]);
    setTimeout(() => {
      setPops(prev => prev.filter(p => p.id !== popId));
    }, 400);
  };

  return (
    <div className="bubblepop-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Bubble Pop 🟣</h1>
        <p className="page-subtitle">Pop the bubbles as they float by</p>
      </header>

      <div className="bp-score">🫧 {score} popped</div>

      <div className="bp-area">
        {bubbles.map(b => (
          <button
            key={b.id}
            className="bp-bubble"
            style={{
              left: `${b.x}%`,
              bottom: `${110 - b.y}%`,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, white, ${b.color})`,
              animationDuration: `${b.speed}s`,
            }}
            onClick={(e) => popBubble(b, e)}
            aria-label="Pop bubble"
          />
        ))}
        {pops.map(p => (
          <div
            key={p.id}
            className="bp-pop"
            style={{
              left: `${p.x}%`,
              bottom: `${110 - p.y}%`,
              width: p.size * 1.5,
              height: p.size * 1.5,
              borderColor: p.color,
            }}
          />
        ))}
      </div>

      <p className="bp-encouragement fade-in">
        {score === 0
          ? 'Tap the bubbles to pop them!'
          : score < 10
          ? 'Satisfying, right? 🫧'
          : score < 25
          ? 'You\'re a bubble-popping pro! 🌟'
          : 'So many bubbles! Keep going! ✨'}
      </p>
    </div>
  );
}

export default BubblePopPage;
