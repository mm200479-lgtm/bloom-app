import React, { useState, useEffect } from 'react';
import { Shuffle, Check, Star } from 'lucide-react';
import { getStrengths, saveStrengths } from '../utils/storage';
import './StrengthsPage.css';

const ALL_STRENGTHS = [
  { name: 'Creative', emoji: '🎨' }, { name: 'Brave', emoji: '🦁' },
  { name: 'Kind', emoji: '💛' }, { name: 'Funny', emoji: '😂' },
  { name: 'Loyal', emoji: '🛡️' }, { name: 'Smart', emoji: '🧠' },
  { name: 'Resilient', emoji: '💪' }, { name: 'Empathetic', emoji: '🤲' },
  { name: 'Honest', emoji: '💎' }, { name: 'Patient', emoji: '🕊️' },
  { name: 'Determined', emoji: '🔥' }, { name: 'Curious', emoji: '🔍' },
  { name: 'Caring', emoji: '❤️' }, { name: 'Artistic', emoji: '🖌️' },
  { name: 'Musical', emoji: '🎵' }, { name: 'Athletic', emoji: '🏃' },
  { name: 'Organized', emoji: '📋' }, { name: 'Thoughtful', emoji: '💭' },
];

function StrengthsPage({ onBack }) {
  const [selected, setSelected] = useState([]);
  const [reminder, setReminder] = useState(null);

  useEffect(() => { setSelected(getStrengths()); }, []);

  const toggle = (name) => {
    const updated = selected.includes(name) ? selected.filter(s => s !== name) : [...selected, name];
    saveStrengths(updated);
    setSelected(updated);
  };

  const showReminder = () => {
    if (selected.length === 0) return;
    const s = ALL_STRENGTHS.find(s => s.name === selected[Math.floor(Math.random() * selected.length)]);
    setReminder(s);
  };

  return (
    <div className="strengths-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>My Strengths 💪</h1>
        <p className="page-subtitle">You have more strengths than you think. Tap the ones that are you.</p>
      </header>

      {selected.length > 0 && (
        <button className="random-affirmation-btn" onClick={showReminder}>
          <Shuffle size={16} /> Remind me of my strengths
        </button>
      )}

      {reminder && (
        <div className="strength-reminder card slide-up">
          <Star size={20} color="var(--warning)" />
          <span className="strength-reminder-emoji">{reminder.emoji}</span>
          <p className="strength-reminder-text">You are <strong>{reminder.name}</strong>.</p>
          <p className="strength-reminder-sub">That's a real strength. Don't forget it. 💜</p>
        </div>
      )}

      <div className="strengths-grid">
        {ALL_STRENGTHS.map((s, i) => (
          <button
            key={s.name}
            className={`strength-btn fade-in ${selected.includes(s.name) ? 'selected' : ''}`}
            onClick={() => toggle(s.name)}
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <span className="strength-emoji">{s.emoji}</span>
            <span className="strength-name">{s.name}</span>
            {selected.includes(s.name) && <span className="strength-check"><Check size={12} /></span>}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="strengths-summary card fade-in">
          <h3 className="section-title">Your strengths ({selected.length})</h3>
          <div className="strengths-tags">
            {selected.map(name => {
              const s = ALL_STRENGTHS.find(x => x.name === name);
              return <span key={name} className="strength-tag">{s?.emoji} {name}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default StrengthsPage;
