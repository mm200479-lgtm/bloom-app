import React, { useState, useEffect } from 'react';
import { Heart, Check } from 'lucide-react';
import { getValues, saveValues } from '../utils/storage';
import './ValuesPage.css';

const ALL_VALUES = [
  { name: 'Kindness', emoji: '💛', desc: 'Being gentle and caring toward others' },
  { name: 'Creativity', emoji: '🎨', desc: 'Expressing yourself in unique ways' },
  { name: 'Independence', emoji: '🦅', desc: 'Making your own choices and standing on your own' },
  { name: 'Family', emoji: '🏠', desc: 'Loving and supporting the people closest to you' },
  { name: 'Honesty', emoji: '💎', desc: 'Being truthful, even when it\'s hard' },
  { name: 'Courage', emoji: '🦁', desc: 'Facing fears and doing hard things anyway' },
  { name: 'Humor', emoji: '😂', desc: 'Finding joy and laughter in life' },
  { name: 'Learning', emoji: '📚', desc: 'Growing your mind and understanding the world' },
  { name: 'Nature', emoji: '🌿', desc: 'Connecting with the natural world' },
  { name: 'Justice', emoji: '⚖️', desc: 'Standing up for what\'s fair and right' },
  { name: 'Friendship', emoji: '🤝', desc: 'Building deep, meaningful connections' },
  { name: 'Adventure', emoji: '🗺️', desc: 'Exploring new places and experiences' },
  { name: 'Peace', emoji: '🕊️', desc: 'Seeking calm and harmony in your life' },
  { name: 'Growth', emoji: '🌱', desc: 'Always becoming a better version of yourself' },
  { name: 'Compassion', emoji: '🤲', desc: 'Feeling deeply for others and wanting to help' },
  { name: 'Freedom', emoji: '🌊', desc: 'Living life on your own terms' },
  { name: 'Loyalty', emoji: '🛡️', desc: 'Being there for the people you love, no matter what' },
  { name: 'Authenticity', emoji: '✨', desc: 'Being true to who you really are' },
  { name: 'Resilience', emoji: '💪', desc: 'Bouncing back from hard times' },
  { name: 'Joy', emoji: '🌈', desc: 'Choosing happiness and celebrating the good' },
];

function ValuesPage({ onBack }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => { setSelected(getValues()); }, []);

  const toggle = (name) => {
    let updated;
    if (selected.includes(name)) {
      updated = selected.filter(v => v !== name);
    } else if (selected.length < 5) {
      updated = [...selected, name];
    } else {
      return;
    }
    saveValues(updated);
    setSelected(updated);
  };

  const selectedValues = ALL_VALUES.filter(v => selected.includes(v.name));

  return (
    <div className="values-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Values Explorer 💎</h1>
        <p className="page-subtitle">What matters most to you? Pick your top 5.</p>
      </header>

      {selectedValues.length > 0 && (
        <div className="selected-values card slide-up">
          <h3 className="section-title"><Heart size={14} /> My core values</h3>
          <div className="selected-values-list">
            {selectedValues.map(v => (
              <span key={v.name} className="selected-value-tag">{v.emoji} {v.name}</span>
            ))}
          </div>
        </div>
      )}

      <p className="values-counter">{selected.length}/5 selected</p>

      <div className="values-grid">
        {ALL_VALUES.map((v, i) => (
          <button
            key={v.name}
            className={`value-card fade-in ${selected.includes(v.name) ? 'selected' : ''} ${selected.length >= 5 && !selected.includes(v.name) ? 'disabled' : ''}`}
            onClick={() => toggle(v.name)}
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <span className="value-emoji">{v.emoji}</span>
            <span className="value-name">{v.name}</span>
            <span className="value-desc">{v.desc}</span>
            {selected.includes(v.name) && <span className="value-check"><Check size={14} /></span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ValuesPage;
