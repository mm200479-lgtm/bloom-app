import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import './CopingCardsPage.css';

const CARDS = [
  { text: "This feeling is temporary. It will pass.", color: "var(--lavender)", emoji: "🌊" },
  { text: "You've survived 100% of your worst days so far.", color: "var(--sage)", emoji: "💪" },
  { text: "Put your hand on your heart. Feel it beating. You are alive and that matters.", color: "var(--blush)", emoji: "💜" },
  { text: "Name 5 things you can see right now. You are here, in this moment.", color: "var(--sky)", emoji: "👀" },
  { text: "It's okay to not be okay. You don't have to pretend.", color: "var(--lavender)", emoji: "🫂" },
  { text: "Breathe in for 4... hold for 4... out for 4... hold for 4...", color: "var(--sage)", emoji: "🫧" },
  { text: "You are not your thoughts. Thoughts are just visitors.", color: "var(--blush)", emoji: "☁️" },
  { text: "What would you say to your best friend right now? Say that to yourself.", color: "var(--sky)", emoji: "💬" },
  { text: "Squeeze an ice cube. Focus on the cold. Let it ground you.", color: "var(--lavender)", emoji: "🧊" },
  { text: "You don't have to figure everything out today.", color: "var(--sage)", emoji: "🌱" },
  { text: "Your brain is trying to protect you. Thank it, then remind it you're safe.", color: "var(--blush)", emoji: "🧠" },
  { text: "Splash cold water on your face. It activates your dive reflex and calms you down.", color: "var(--sky)", emoji: "💧" },
  { text: "Hum your favorite song. The vibration in your chest is soothing.", color: "var(--lavender)", emoji: "🎵" },
  { text: "Push your feet hard into the floor. Feel the ground holding you up.", color: "var(--sage)", emoji: "🦶" },
  { text: "You are more than this moment. You are a whole story.", color: "var(--blush)", emoji: "📖" },
  { text: "Wrap yourself in a blanket. You deserve comfort.", color: "var(--sky)", emoji: "🧸" },
  { text: "Count backwards from 10. Slowly. You've got this.", color: "var(--lavender)", emoji: "🔢" },
  { text: "It's okay to ask for help. That's strength, not weakness.", color: "var(--sage)", emoji: "🤝" },
  { text: "Clench your fists tight for 5 seconds... now release. Feel the difference.", color: "var(--blush)", emoji: "✊" },
  { text: "You are safe right now. Right here, right now, you are safe.", color: "var(--sky)", emoji: "🏡" },
  { text: "This is a flashback, not reality. You are in the present. Look around you.", color: "var(--lavender)", emoji: "⏰" },
  { text: "Smell something strong — coffee, soap, a candle. It brings you back.", color: "var(--sage)", emoji: "🕯️" },
  { text: "You've been brave before. You can be brave again.", color: "var(--blush)", emoji: "🦁" },
  { text: "Rest is not lazy. Rest is how you heal.", color: "var(--sky)", emoji: "😴" },
];

function CopingCardsPage() {
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState('');

  const next = () => {
    setAnimDir('left');
    setTimeout(() => {
      setIndex(i => (i + 1) % CARDS.length);
      setAnimDir('');
    }, 200);
  };

  const prev = () => {
    setAnimDir('right');
    setTimeout(() => {
      setIndex(i => (i - 1 + CARDS.length) % CARDS.length);
      setAnimDir('');
    }, 200);
  };

  const shuffle = () => {
    setAnimDir('left');
    setTimeout(() => {
      setIndex(Math.floor(Math.random() * CARDS.length));
      setAnimDir('');
    }, 200);
  };

  const card = CARDS[index];

  return (
    <div className="coping-page">
      <header className="page-header">
        <h1>Coping Cards</h1>
        <p className="page-subtitle">Swipe through when you need a reminder 💜</p>
      </header>

      <div className="card-container">
        <div className={`coping-card ${animDir}`} style={{ background: card.color }}>
          <span className="card-emoji">{card.emoji}</span>
          <p className="card-text">{card.text}</p>
          <span className="card-count">{index + 1} / {CARDS.length}</span>
        </div>
      </div>

      <div className="card-controls">
        <button className="card-nav-btn" onClick={prev} aria-label="Previous card">
          <ChevronLeft size={24} />
        </button>
        <button className="shuffle-btn" onClick={shuffle} aria-label="Random card">
          <Shuffle size={18} /> Shuffle
        </button>
        <button className="card-nav-btn" onClick={next} aria-label="Next card">
          <ChevronRight size={24} />
        </button>
      </div>

      <p className="coping-tip">
        💡 Try reading the card out loud. Hearing it in your own voice makes it more powerful.
      </p>
    </div>
  );
}

export default CopingCardsPage;
