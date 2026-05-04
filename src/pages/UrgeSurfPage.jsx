import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Waves } from 'lucide-react';
import './UrgeSurfPage.css';

const TOTAL_SECONDS = 20 * 60;

const MESSAGES = [
  { at: 20 * 60, text: "You've started. The urge is here, but so are you. 🌊" },
  { at: 15 * 60, text: "5 minutes in. You're doing this. The wave is building, but you can ride it." },
  { at: 10 * 60, text: "Halfway there. Urges peak and pass. You're in the hardest part — keep going. 💪" },
  { at: 5 * 60, text: "15 minutes done. The wave is getting smaller. You're stronger than you think." },
  { at: 0, text: "You did it. 20 minutes. The urge has passed. You rode the wave. 🏄‍♀️" },
];

const DISTRACTIONS = [
  'Hold ice cubes in your hands',
  'Do 20 jumping jacks',
  'Name 5 things you can see right now',
  'Draw or scribble on paper',
  'Listen to a song you love',
  'Text someone you trust',
  'Snap a rubber band on your wrist gently',
  'Smell something strong (coffee, soap, mint)',
  'Take a cold shower',
  'Watch a funny video',
];

function UrgeSurfPage({ onBack }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const toggleTimer = () => {
    if (finished) return;
    setRunning(!running);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(TOTAL_SECONDS);
    setRunning(false);
    setFinished(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;

  const currentMessage = MESSAGES.find(m => timeLeft <= m.at) || MESSAGES[0];

  const randomDistractions = DISTRACTIONS.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="urgesurf-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Urge Surfing 🌊</h1>
        <p className="page-subtitle">Urges peak and pass. You can ride this wave.</p>
      </header>

      {!finished ? (
        <>
          <div className="surf-timer card fade-in">
            <div className="wave-visual">
              <div className="wave-container">
                <div className="wave-fill" style={{ width: `${progress}%` }} />
                <Waves size={24} className="wave-icon" style={{ left: `${Math.max(5, progress - 5)}%` }} />
              </div>
            </div>

            <div className="surf-time-display">
              <span className="surf-time">{minutes}:{seconds.toString().padStart(2, '0')}</span>
              <span className="surf-label">remaining</span>
            </div>

            <div className="surf-controls">
              <button className="timer-btn" onClick={toggleTimer}>
                {running ? <Pause size={20} /> : <Play size={20} />}
                {running ? 'Pause' : 'Start'}
              </button>
              <button className="timer-btn reset" onClick={resetTimer}>
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {(running || timeLeft < TOTAL_SECONDS) && (
            <div className="surf-message card slide-up">
              <p>{currentMessage.text}</p>
            </div>
          )}

          {running && (
            <div className="surf-distractions">
              <h3 className="section-title">While you wait, try:</h3>
              {randomDistractions.map((d, i) => (
                <div key={i} className="distraction-suggestion fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="suggestion-num">{i + 1}</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}

          {!running && timeLeft === TOTAL_SECONDS && (
            <div className="surf-info">
              <h3 className="section-title">What is urge surfing?</h3>
              <p className="surf-explain">
                An urge is like a wave — it builds, peaks, and then passes. Most urges last 15-20 minutes. Instead of fighting the urge or giving in, you "surf" it — observe it, breathe through it, and let it pass on its own.
              </p>
              <p className="surf-explain">
                This timer gives you 20 minutes. By the end, the urge will be significantly weaker. You've got this. 🏄‍♀️
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="surf-finished slide-up">
          <span className="finished-emoji">🏄‍♀️</span>
          <h2>You rode the wave!</h2>
          <p className="finished-text">20 minutes. The urge has passed.</p>
          <p className="finished-sub">You just proved to yourself that you can get through it. That's huge. 💜</p>
          <button className="primary-btn" onClick={resetTimer}>
            <RotateCcw size={16} /> Reset timer
          </button>
        </div>
      )}
    </div>
  );
}

export default UrgeSurfPage;
