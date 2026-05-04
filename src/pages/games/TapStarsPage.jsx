import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TapStarsPage.css';

function TapStarsPage({ onBack }) {
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const nextId = useRef(0);
  const areaRef = useRef(null);

  const spawnStar = useCallback(() => {
    const id = nextId.current++;
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    const size = 24 + Math.random() * 20;
    setStars(prev => [...prev, { id, x, y, size, born: Date.now() }]);
    setTimeout(() => {
      setStars(prev => prev.filter(s => s.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnStar, 1200);
    spawnStar();
    return () => clearInterval(interval);
  }, [spawnStar]);

  const handleTap = (star, e) => {
    e.stopPropagation();
    setScore(s => s + 1);
    setStars(prev => prev.filter(s => s.id !== star.id));

    const sparkleId = Date.now() + Math.random();
    setSparkles(prev => [...prev, { id: sparkleId, x: star.x, y: star.y }]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== sparkleId));
    }, 600);
  };

  return (
    <div className="tapstars-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Tap the Stars ⭐</h1>
        <p className="page-subtitle">Catch the stars — no rush, they'll keep coming</p>
      </header>

      <div className="ts-score">
        <span>⭐ {score} stars caught</span>
      </div>

      <div className="ts-area" ref={areaRef}>
        {stars.map(star => (
          <button
            key={star.id}
            className="ts-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              fontSize: star.size,
            }}
            onClick={(e) => handleTap(star, e)}
            aria-label="Tap star"
          >
            ⭐
          </button>
        ))}
        {sparkles.map(sp => (
          <div
            key={sp.id}
            className="ts-sparkle"
            style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
          >
            ✨
          </div>
        ))}
      </div>

      <p className="ts-encouragement fade-in">
        {score === 0
          ? 'Tap the stars as they appear ✨'
          : score < 10
          ? 'You\'re a star catcher! 🌟'
          : score < 25
          ? 'Look at you go! ⭐'
          : 'You\'re absolutely shining! 💫'}
      </p>
    </div>
  );
}

export default TapStarsPage;
