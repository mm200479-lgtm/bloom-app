import React, { useState } from 'react';
import { Flame, ThermometerSun } from 'lucide-react';
import './AngryPage.css';

const LEVELS = [
  { value: 1, label: 'Calm', color: '#8ab8d8', emoji: '😌', strategies: ['You\'re doing great. Enjoy this calm moment.', 'Take a deep breath and appreciate the peace.'] },
  { value: 2, label: 'Slightly annoyed', color: '#8ac8a0', emoji: '😐', strategies: ['Notice the feeling without reacting.', 'Take 3 slow breaths.', 'Name what\'s bothering you.'] },
  { value: 3, label: 'Irritated', color: '#c8d88a', emoji: '😤', strategies: ['Step away from the situation for a moment.', 'Squeeze a stress ball or pillow.', 'Count to 10 slowly.'] },
  { value: 4, label: 'Frustrated', color: '#e8d88a', emoji: '😠', strategies: ['Go for a walk — movement helps.', 'Write down what you\'re feeling.', 'Splash cold water on your face.', 'Listen to music that matches your mood.'] },
  { value: 5, label: 'Angry', color: '#e8c88a', emoji: '🔥', strategies: ['Do intense exercise — jumping jacks, push-ups.', 'Rip up paper or scribble hard on a page.', 'Yell into a pillow.', 'Hold ice cubes in your hands.'] },
  { value: 6, label: 'Very angry', color: '#e8a88a', emoji: '🔥🔥', strategies: ['Remove yourself from the situation NOW.', 'Do the TIPP skill: cold water on face.', 'Run or do intense physical activity.', 'Call someone you trust.'] },
  { value: 7, label: 'Furious', color: '#e89a8a', emoji: '💢', strategies: ['You need to leave the room/situation.', 'Cold shower or ice on your neck.', 'Sprint, do burpees, or punch a pillow.', 'Don\'t make any decisions right now.'] },
  { value: 8, label: 'Rage building', color: '#e88a8a', emoji: '🌋', strategies: ['STOP. Don\'t act on this feeling.', 'Get somewhere safe and alone.', 'Intense cold — ice bath, cold shower.', 'Scream into a pillow. Let it out safely.', 'This will pass. Ride the wave.'] },
  { value: 9, label: 'Explosive', color: '#d87a7a', emoji: '💥', strategies: ['You are NOT your anger. This is temporary.', 'Get away from people until this passes.', 'Use every physical outlet available safely.', 'Call your crisis contact or text HOME to 741741.'] },
  { value: 10, label: 'Crisis', color: '#c86a6a', emoji: '🆘', strategies: ['This is a crisis level. Please reach out for help.', 'Text HOME to 741741 (Crisis Text Line).', 'Call 988 (Suicide & Crisis Lifeline).', 'You will get through this. You always have.'] },
];

function AngryPage() {
  const [selected, setSelected] = useState(null);

  const level = selected ? LEVELS.find(l => l.value === selected) : null;

  return (
    <div className="angry-page">
      <header className="page-header">
        <h1>Anger Thermometer 🌡️</h1>
        <p className="page-subtitle">Anger is valid — how you handle it matters</p>
      </header>

      <p className="angry-prompt">Tap your current anger level:</p>

      <div className="thermometer-container">
        <div className="thermometer">
          <div className="thermo-track">
            {LEVELS.slice().reverse().map(l => (
              <button
                key={l.value}
                className={`thermo-level ${selected === l.value ? 'active' : ''}`}
                style={selected === l.value ? { background: l.color } : {}}
                onClick={() => setSelected(l.value)}
              >
                <span className="thermo-num">{l.value}</span>
                <span className="thermo-emoji">{l.emoji}</span>
                <span className="thermo-label">{l.label}</span>
              </button>
            ))}
          </div>
          <div className="thermo-fill" style={{ height: selected ? `${(selected / 10) * 100}%` : '0%', background: level?.color || '#ccc' }} />
        </div>
      </div>

      {level && (
        <div className="anger-strategies card slide-up" style={{ borderTop: `4px solid ${level.color}` }}>
          <h3 className="section-title">{level.emoji} Level {level.value}: {level.label}</h3>
          <p className="strategies-intro">Try these:</p>
          <div className="strategies-list">
            {level.strategies.map((s, i) => (
              <div key={i} className="strategy-item fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="strategy-num">{i + 1}</span>
                <span className="strategy-text">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="angry-footer">
        💜 Anger is a normal emotion. It's telling you something important. The goal isn't to never feel angry — it's to express it safely.
      </p>
    </div>
  );
}

export default AngryPage;
