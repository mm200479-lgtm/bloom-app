import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { addPetals } from '../utils/storage';
import './PomodoroPage.css';

const PRESETS = [
  { label: '15 min focus', work: 15, break: 5, emoji: '🌱' },
  { label: '20 min focus', work: 20, break: 5, emoji: '🌿' },
  { label: '25 min classic', work: 25, break: 5, emoji: '🍅' },
  { label: '10 min sprint', work: 10, break: 3, emoji: '⚡' },
];

function PomodoroPage() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessions] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!isBreak) {
        setSessions(s => s + 1);
        addPetals(3);
        setShowComplete(true);
        setTimeout(() => setShowComplete(false), 3000);
        setIsBreak(true);
        setTimeLeft(preset.break * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(preset.work * 60);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const selectPreset = (p) => {
    setPreset(p);
    setTimeLeft(p.work * 60);
    setIsRunning(false);
    setIsBreak(false);
  };

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(preset.work * 60);
  };

  const totalSeconds = isBreak ? preset.break * 60 : preset.work * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-page">
      <header className="page-header">
        <h1>Focus Timer</h1>
        <p className="page-subtitle">Short bursts work best for ADHD brains 🍅</p>
      </header>

      <div className="preset-row">
        {PRESETS.map(p => (
          <button
            key={p.label}
            className={`preset-btn ${preset.label === p.label ? 'active' : ''}`}
            onClick={() => selectPreset(p)}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {showComplete && (
        <div className="focus-complete slide-up">
          ✨ Focus session done! You earned 3 petals! Take a break 💜
        </div>
      )}

      <div className="timer-display">
        <svg className="timer-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--bg-secondary)" strokeWidth="8" />
          <circle
            cx="100" cy="100" r="90" fill="none"
            stroke={isBreak ? 'var(--sage-dark)' : 'var(--lavender-dark)'}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="timer-center">
          <span className="timer-phase">{isBreak ? '☕ Break' : '🎯 Focus'}</span>
          <span className="timer-digits">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="timer-controls">
        <button className="timer-btn reset" onClick={reset} aria-label="Reset">
          <RotateCcw size={20} />
        </button>
        <button
          className={`timer-btn main ${isRunning ? 'pause' : 'play'}`}
          onClick={() => setIsRunning(!isRunning)}
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <div className="session-count">
          <span className="session-num">{sessionsCompleted}</span>
          <span className="session-label">sessions</span>
        </div>
      </div>

      <div className="focus-tips">
        <h3 className="section-title">ADHD Focus Tips</h3>
        <ul>
          <li>🎧 Put on music without lyrics</li>
          <li>📱 Put your phone face-down or in another room</li>
          <li>📝 Write down distracting thoughts to deal with later</li>
          <li>🧊 Keep a cold drink nearby — sensory input helps focus</li>
          <li>🏃 Move your body during breaks — don't scroll!</li>
          <li>✅ Pick ONE thing to focus on before starting</li>
        </ul>
      </div>
    </div>
  );
}

export default PomodoroPage;
