import React, { useState, useRef, useEffect, useCallback } from 'react';
import './RainWindowPage.css';

function RainWindowPage({ onBack }) {
  const [drops, setDrops] = useState([]);
  const nextId = useRef(0);
  const windowRef = useRef(null);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setDrops(prev => prev.filter(d => Date.now() - d.born < 8000));
    }, 2000);
    return () => clearInterval(cleanup);
  }, []);

  const addDrop = useCallback((e) => {
    const rect = windowRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const id = nextId.current++;
    const size = 4 + Math.random() * 6;
    const speed = 2 + Math.random() * 3;

    setDrops(prev => [...prev, {
      id,
      x,
      y,
      size,
      speed,
      born: Date.now(),
      wobble: (Math.random() - 0.5) * 2,
    }]);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    addDrop(e);
  };

  return (
    <div className="rainwindow-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Rain on Window 🌧️</h1>
        <p className="page-subtitle">Tap anywhere to create raindrops — watch them slide down</p>
      </header>

      <div className="rw-count">
        💧 {drops.length} drops
      </div>

      <div
        className="rw-window"
        ref={windowRef}
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        <div className="rw-fog" />
        {drops.map(drop => (
          <div
            key={drop.id}
            className="rw-drop"
            style={{
              left: drop.x,
              top: drop.y,
              width: drop.size,
              height: drop.size * 1.5,
              animationDuration: `${drop.speed}s`,
              '--wobble': `${drop.wobble}px`,
            }}
          >
            <div className="rw-trail" style={{
              height: 40 + Math.random() * 60,
              width: drop.size * 0.6,
            }} />
          </div>
        ))}
      </div>

      <p className="rw-mood fade-in">
        Listen to the quiet. Let the rain wash your thoughts away. 🌧️
      </p>
    </div>
  );
}

export default RainWindowPage;
