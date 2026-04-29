import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import './GroundingPage.css';

const EXERCISES = [
  {
    id: 'breathing',
    title: '🫧 Box Breathing',
    desc: 'Breathe in a calming square pattern',
    color: 'var(--sky)',
  },
  {
    id: 'grounding54321',
    title: '🌿 5-4-3-2-1 Grounding',
    desc: 'Come back to the present moment',
    color: 'var(--sage)',
  },
  {
    id: 'bodyscan',
    title: '🧘 Quick Body Scan',
    desc: 'Notice and release tension',
    color: 'var(--lavender)',
  },
  {
    id: 'butterfly',
    title: '🦋 Butterfly Hug',
    desc: 'Self-soothing bilateral stimulation',
    color: 'var(--blush)',
  },
  {
    id: 'safe-place',
    title: '🏡 Safe Place Visualization',
    desc: 'Go to your calm, safe space in your mind',
    color: 'var(--cream)',
  },
];

const BREATHING_PHASES = [
  { label: 'Breathe in...', duration: 4 },
  { label: 'Hold...', duration: 4 },
  { label: 'Breathe out...', duration: 4 },
  { label: 'Hold...', duration: 4 },
];

const GROUNDING_STEPS = [
  { count: 5, sense: 'SEE', prompt: 'Name 5 things you can see right now', emoji: '👀' },
  { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can touch or feel', emoji: '✋' },
  { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can hear', emoji: '👂' },
  { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can smell', emoji: '👃' },
  { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can taste', emoji: '👅' },
];

const BODY_SCAN_STEPS = [
  'Close your eyes and take a deep breath...',
  'Notice your feet on the ground. Wiggle your toes.',
  'Feel your legs. Let any tension melt away.',
  'Notice your stomach. Let it soften.',
  'Feel your chest rise and fall with each breath.',
  'Drop your shoulders away from your ears.',
  'Relax your jaw. Unclench your teeth.',
  'Soften the space between your eyebrows.',
  'Take one more deep breath...',
  'You are here. You are safe. You are okay. 💜',
];

const BUTTERFLY_STEPS = [
  'Cross your arms over your chest, hands on shoulders.',
  'Close your eyes if that feels safe.',
  'Gently tap your left hand...',
  'Now your right hand...',
  'Left... right... left... right...',
  'Keep a slow, steady rhythm.',
  'Breathe naturally as you tap.',
  'Notice how your body feels.',
  'You can slow down whenever you want.',
  'When you\'re ready, gently stop and rest your hands. 🦋',
];

const SAFE_PLACE_STEPS = [
  'Close your eyes and take 3 slow breaths...',
  'Think of a place where you feel completely safe.',
  'It can be real or imaginary — it\'s yours.',
  'What do you see there? Notice the colors and shapes.',
  'What sounds are there? Maybe it\'s quiet and peaceful.',
  'What can you feel? The warmth, a soft breeze?',
  'What does it smell like? Something comforting?',
  'You are safe here. Nothing can hurt you.',
  'Stay as long as you need.',
  'When you\'re ready, slowly open your eyes. You can come back anytime. 🏡',
];

function GroundingPage() {
  const [activeExercise, setActiveExercise] = useState(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathTimer, setBreathTimer] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);
  const [guidedStep, setGuidedStep] = useState(0);
  const [isGuiding, setIsGuiding] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathPhase(0);
    setBreathTimer(BREATHING_PHASES[0].duration);

    let phase = 0;
    let timer = BREATHING_PHASES[0].duration;

    intervalRef.current = setInterval(() => {
      timer -= 1;
      if (timer <= 0) {
        phase = (phase + 1) % BREATHING_PHASES.length;
        timer = BREATHING_PHASES[phase].duration;
      }
      setBreathPhase(phase);
      setBreathTimer(timer);
    }, 1000);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startGuided = (steps) => {
    setIsGuiding(true);
    setGuidedStep(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step >= steps.length) {
        clearInterval(intervalRef.current);
        setIsGuiding(false);
      }
      setGuidedStep(step);
    }, 5000);
  };

  const stopGuided = () => {
    setIsGuiding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetExercise = () => {
    stopBreathing();
    stopGuided();
    setGroundingStep(0);
    setGuidedStep(0);
  };

  const renderExercise = () => {
    switch (activeExercise) {
      case 'breathing':
        return (
          <div className="exercise-content">
            <div className={`breath-circle ${isBreathing ? `phase-${breathPhase}` : ''}`}>
              <span className="breath-timer">{isBreathing ? breathTimer : ''}</span>
              <span className="breath-label">
                {isBreathing ? BREATHING_PHASES[breathPhase].label : 'Ready?'}
              </span>
            </div>
            <div className="exercise-controls">
              {isBreathing ? (
                <button className="control-btn stop" onClick={stopBreathing}>
                  <Pause size={18} /> Pause
                </button>
              ) : (
                <button className="control-btn start" onClick={startBreathing}>
                  <Play size={18} /> Start
                </button>
              )}
            </div>
            <p className="exercise-tip">
              This technique activates your parasympathetic nervous system — it tells your body it's safe.
            </p>
          </div>
        );

      case 'grounding54321':
        return (
          <div className="exercise-content">
            {groundingStep < GROUNDING_STEPS.length ? (
              <div className="grounding-card slide-up" key={groundingStep}>
                <span className="grounding-emoji">{GROUNDING_STEPS[groundingStep].emoji}</span>
                <span className="grounding-count">{GROUNDING_STEPS[groundingStep].count}</span>
                <span className="grounding-sense">{GROUNDING_STEPS[groundingStep].sense}</span>
                <p className="grounding-prompt">{GROUNDING_STEPS[groundingStep].prompt}</p>
                <button
                  className="next-step-btn"
                  onClick={() => setGroundingStep(s => s + 1)}
                >
                  Done — next →
                </button>
              </div>
            ) : (
              <div className="grounding-complete slide-up">
                <span className="complete-emoji">🌟</span>
                <h3>You're here. You're present.</h3>
                <p>Great job grounding yourself. Take a moment to notice how you feel now.</p>
                <button className="control-btn start" onClick={() => setGroundingStep(0)}>
                  <RotateCcw size={16} /> Do it again
                </button>
              </div>
            )}
            <div className="step-dots">
              {GROUNDING_STEPS.map((_, i) => (
                <span key={i} className={`dot ${i <= groundingStep ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        );

      case 'bodyscan':
        return renderGuidedExercise(BODY_SCAN_STEPS, '🧘');

      case 'butterfly':
        return renderGuidedExercise(BUTTERFLY_STEPS, '🦋');

      case 'safe-place':
        return renderGuidedExercise(SAFE_PLACE_STEPS, '🏡');

      default:
        return null;
    }
  };

  const renderGuidedExercise = (steps, emoji) => (
    <div className="exercise-content">
      <div className="guided-display">
        <span className="guided-emoji">{emoji}</span>
        <p className="guided-text slide-up" key={guidedStep}>
          {steps[Math.min(guidedStep, steps.length - 1)]}
        </p>
        <div className="guided-progress">
          <div
            className="guided-progress-bar"
            style={{ width: `${((guidedStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="exercise-controls">
        {isGuiding ? (
          <button className="control-btn stop" onClick={stopGuided}>
            <Pause size={18} /> Pause
          </button>
        ) : (
          <button className="control-btn start" onClick={() => startGuided(steps)}>
            <Play size={18} /> {guidedStep > 0 ? 'Continue' : 'Start'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="grounding-page">
      <header className="page-header">
        <h1>Calm Corner</h1>
        <p className="page-subtitle">Tools to help you feel grounded and safe 🌊</p>
      </header>

      {!activeExercise ? (
        <div className="exercise-list fade-in">
          {EXERCISES.map(ex => (
            <button
              key={ex.id}
              className="exercise-card"
              style={{ background: ex.color }}
              onClick={() => setActiveExercise(ex.id)}
            >
              <span className="exercise-title">{ex.title}</span>
              <span className="exercise-desc">{ex.desc}</span>
            </button>
          ))}

          <div className="quick-calm">
            <h3 className="section-title">Quick calm-down tips</h3>
            <ul className="calm-tips">
              <li>🧊 Hold an ice cube — the cold sensation grounds you</li>
              <li>🎵 Put on your favorite song and focus on the lyrics</li>
              <li>🐾 Pet an animal or hold something soft</li>
              <li>💧 Splash cold water on your face</li>
              <li>🫧 Blow bubbles (real or imaginary)</li>
              <li>🖍️ Color or doodle — no rules, just movement</li>
              <li>🚶 Walk barefoot on grass or carpet</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="active-exercise slide-up">
          <button className="back-btn" onClick={() => { resetExercise(); setActiveExercise(null); }}>
            ← Back to exercises
          </button>
          <h2 className="active-title">
            {EXERCISES.find(e => e.id === activeExercise)?.title}
          </h2>
          {renderExercise()}
        </div>
      )}
    </div>
  );
}

export default GroundingPage;
