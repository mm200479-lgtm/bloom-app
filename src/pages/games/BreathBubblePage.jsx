import React, { useState, useRef, useCallback } from 'react';
import './BreathBubblePage.css';

function BreathBubblePage({ onBack }) {
  const [size, setSize] = useState(80);
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [sessions, setSessions] = useState(0);
  const [breaths, setBreaths] = useState(0);
  const intervalRef = useRef(null);

  const startInhale = useCallback(() => {
    setBreathing(true);
    setPhase('inhale');
    intervalRef.current = setInterval(() => {
      setSize(prev => Math.min(prev + 2, 200));
    }, 50);
  }, []);

  const startExhale = useCallback(() => {
    clearInterval(intervalRef.current);
    setPhase('exhale');
    setBreaths(b => b + 1);
    intervalRef.current = setInterval(() => {
      setSize(prev => {
        if (prev <= 80) {
          clearInterval(intervalRef.current);
          setPhase('idle');
          setBreathing(false);
          return 80;
        }
        return prev - 2;
      });
    }, 50);
  }, []);

  const handlePointerDown = () => {
    if (phase === 'exhale') return;
    startInhale();
  };

  const handlePointerUp = () => {
    if (phase === 'inhale') {
      startExhale();
      if (breaths > 0 && (breaths + 1) % 5 === 0) {
        setSessions(s => s + 1);
      }
    }
  };

  const guideText = phase === 'inhale'
    ? 'Breathe in...'
    : phase === 'exhale'
    ? 'Breathe out...'
    : 'Hold to breathe in';

  return (
    <div className="breathbubble-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Breathing Bubble 🫧</h1>
        <p className="page-subtitle">Hold to breathe in, release to breathe out</p>
      </header>

      <div className="breath-stats">
        <span className="breath-stat">🫁 {breaths} breaths</span>
        <span className="breath-stat">✨ {sessions} sessions</span>
      </div>

      <div
        className="breath-area"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className={`breath-bubble ${phase}`}
          style={{ width: size, height: size }}
        >
          <span className="breath-inner-text">
            {phase === 'inhale' ? '🌬️' : phase === 'exhale' ? '🍃' : '🫧'}
          </span>
        </div>
        <p className={`breath-guide ${phase !== 'idle' ? 'active' : ''}`}>
          {guideText}
        </p>
      </div>

      <p className="breath-encouragement fade-in">
        {breaths === 0
          ? 'Tap and hold the bubble to begin'
          : breaths < 5
          ? 'You\'re doing great, keep going 💜'
          : breaths < 10
          ? 'Beautiful breathing rhythm 🌊'
          : 'You\'re a natural at this ✨'}
      </p>
    </div>
  );
}

export default BreathBubblePage;
