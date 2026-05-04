import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import './ComplimentPage.css';

const COMPLIMENTS = [
  "You have a kind heart.",
  "Your creativity is a gift.",
  "People feel safe around you.",
  "You notice things others miss.",
  "Your resilience is inspiring.",
  "You make the world a little brighter.",
  "Your laugh is contagious.",
  "You're braver than you believe.",
  "You have a beautiful mind.",
  "Your empathy is a superpower.",
  "You deserve every good thing coming your way.",
  "You light up the room without even trying.",
  "Your honesty is refreshing.",
  "You're someone people can count on.",
  "Your perspective matters.",
  "You handle hard things with grace.",
  "You're growing in ways you can't even see yet.",
  "Your kindness creates ripples.",
  "You're exactly where you need to be.",
  "You make people feel heard.",
  "Your strength is quiet but powerful.",
  "You're doing better than you think.",
  "Your smile can change someone's whole day.",
  "You have a gift for making others feel welcome.",
  "You're worthy of love — exactly as you are.",
  "Your curiosity makes you interesting.",
  "You bring out the best in people.",
  "Your feelings make you human, not weak.",
  "You're someone's reason to smile.",
  "You have more courage than you give yourself credit for.",
  "Your voice deserves to be heard.",
  "You're a work of art in progress.",
  "The world needs more people like you.",
  "You're not too much — you're just enough.",
  "Your gentleness is a strength.",
];

function ComplimentPage({ onBack }) {
  const [compliment, setCompliment] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const showNew = () => {
    let next;
    do {
      next = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    } while (next === compliment && COMPLIMENTS.length > 1);
    setCompliment(next);
    setAnimKey(prev => prev + 1);
  };

  return (
    <div className="compliment-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Compliment Generator 💝</h1>
        <p className="page-subtitle">Tap for a genuine compliment — you deserve it</p>
      </header>

      <div className="compliment-display">
        {compliment ? (
          <div className="compliment-card slide-up" key={animKey}>
            <Sparkles size={24} color="var(--lavender-dark)" />
            <p className="compliment-text">{compliment}</p>
            <span className="compliment-heart">💜</span>
          </div>
        ) : (
          <div className="compliment-placeholder">
            <span style={{ fontSize: 48 }}>💝</span>
            <p>Tap the button below for a compliment</p>
          </div>
        )}
      </div>

      <button className="compliment-btn" onClick={showNew}>
        <Sparkles size={18} /> {compliment ? 'Another one!' : 'Give me a compliment'}
      </button>

      <p className="compliment-footer">Every single one of these is true about you. 🌸</p>
    </div>
  );
}

export default ComplimentPage;
