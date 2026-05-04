import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import './WorryTimePage.css';

const TOTAL_SECONDS = 15 * 60; // 15 minutes

function WorryTimePage() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [worries, setWorries] = useState('');
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
    setWorries('');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;

  return (
    <div className="worrytime-page">
      <header className="page-header">
        <h1>Worry Time ⏰</h1>
        <p className="page-subtitle">Give your worries 15 minutes — then let them go</p>
      </header>

      {!finished ? (
        <>
          <div className="timer-section card fade-in">
            <div className="timer-circle">
              <svg viewBox="0 0 100 100" className="timer-svg">
                <circle cx="50" cy="50" r="45" className="timer-bg-circle" />
                <circle
                  cx="50" cy="50" r="45"
                  className="timer-progress-circle"
                  style={{ strokeDashoffset: 283 - (283 * progress / 100) }}
                />
              </svg>
              <div className="timer-display">
                <span className="timer-time">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                <span className="timer-label">{running ? 'worrying allowed' : 'tap to start'}</span>
              </div>
            </div>

            <div className="timer-controls">
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
            <div className="worry-input slide-up">
              <label className="worry-label">Write your worries here:</label>
              <textarea
                className="input-field worry-textarea"
                rows={6}
                placeholder="Let it all out... this is your time to worry freely. No judgment."
                value={worries}
                onChange={e => setWorries(e.target.value)}
              />
              <p className="worry-hint">Nobody sees this. It disappears when you reset.</p>
            </div>
          )}

          {!running && timeLeft === TOTAL_SECONDS && (
            <div className="worry-instructions">
              <h3 className="section-title">How it works</h3>
              <div className="instruction-steps">
                <div className="instruction-step">
                  <span className="step-num">1</span>
                  <span>Start the 15-minute timer</span>
                </div>
                <div className="instruction-step">
                  <span className="step-num">2</span>
                  <span>Write down everything you're worried about</span>
                </div>
                <div className="instruction-step">
                  <span className="step-num">3</span>
                  <span>When the timer ends, practice letting go</span>
                </div>
              </div>
              <p className="instruction-note">
                💡 Research shows that scheduling "worry time" actually reduces overall anxiety. Your brain learns that worries have a time and place.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="worry-finished slide-up">
          <span className="finished-emoji">🕊️</span>
          <h2>Time's up</h2>
          <p className="finished-message">
            You gave your worries their time. Now let them go.
          </p>
          <p className="finished-sub">
            Take a deep breath. You don't have to carry these right now.
          </p>

          <div className="grounding-prompt card">
            <h3>Quick grounding:</h3>
            <p>Place both feet on the floor. Feel the ground beneath you. Take 3 slow breaths. You are here. You are safe. 💜</p>
          </div>

          <button className="primary-btn" onClick={resetTimer}>
            <RotateCcw size={16} /> Start over
          </button>
        </div>
      )}
    </div>
  );
}

export default WorryTimePage;
