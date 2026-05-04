import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FirefliesPage.css';

function FirefliesPage({ onBack }) {
  const [fireflies, setFireflies] = useState([]);
  const [caught, setCaught] = useState(0);
  const [catches, setCatches] = useState([]);
  const nextId = useRef(0);

  const spawnFirefly = useCallback(() => {
    const id = nextId.current++;
    const x = 5 + Math.random() * 90;
    const y = 5 + Math.random() * 85;
    const dx = (Math.random() - 0.5) * 0.3;
    const dy = (Math.random() - 0.5) * 0.3;
    const size = 6 + Math.random() * 6;
    setFireflies(prev => [...prev, { id, x, y, dx, dy, size }]);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 5; i++) spawnFirefly();
    const interval = setInterval(spawnFirefly, 2000);
    return () => clearInterval(interval);
  }, [spawnFirefly]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setFireflies(prev =>
        prev.map(f => {
          let nx = f.x + f.dx;
          let ny = f.y + f.dy;
          let ndx = f.dx;
          let ndy = f.dy;
          if (nx < 2 || nx > 98) ndx = -ndx;
          if (ny < 2 || ny > 93) ndy = -ndy;
          ndx += (Math.random() - 0.5) * 0.05;
          ndy += (Math.random() - 0.5) * 0.05;
          return { ...f, x: nx, y: ny, dx: ndx, dy: ndy };
        }).slice(-30)
      );
    }, 50);
    return () => clearInterval(moveInterval);
  }, []);

  const catchFirefly = (fly, e) => {
    e.stopPropagation();
    setCaught(c => c + 1);
    setFireflies(prev => prev.filter(f => f.id !== fly.id));

    const catchId = Date.now() + Math.random();
    setCatches(prev => [...prev, { id: catchId, x: fly.x, y: fly.y }]);
    setTimeout(() => {
      setCatches(prev => prev.filter(c => c.id !== catchId));
    }, 500);
  };

  return (
    <div className="fireflies-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Catch Fireflies ✨</h1>
        <p className="page-subtitle">Gently tap the glowing lights in the night</p>
      </header>

      <div className="ff-jar">
        🫙 {caught} fireflies in your jar
      </div>

      <div className="ff-sky">
        <div className="ff-stars" />
        {fireflies.map(f => (
          <button
            key={f.id}
            className="ff-fly"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: f.size,
              height: f.size,
            }}
            onClick={(e) => catchFirefly(f, e)}
            aria-label="Catch firefly"
          />
        ))}
        {catches.map(c => (
          <div
            key={c.id}
            className="ff-catch"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            ✨
          </div>
        ))}
      </div>

      <p className="ff-encouragement fade-in">
        {caught === 0
          ? 'Tap the glowing dots to catch them'
          : caught < 5
          ? 'Your jar is starting to glow 🌟'
          : caught < 15
          ? 'What a beautiful collection ✨'
          : 'You\'re a firefly whisperer 💫'}
      </p>
    </div>
  );
}

export default FirefliesPage;
