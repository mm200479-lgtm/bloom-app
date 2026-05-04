import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import './MemoryMatchPage.css';

const EMOJIS = ['🌸', '🌊', '🦋', '🌙', '⭐', '🌈', '🍀', '💜'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards() {
  const pairs = [...EMOJIS, ...EMOJIS];
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

function MemoryMatchPage({ onBack }) {
  const [cards, setCards] = useState(createCards);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      setChecking(true);
      setMoves(m => m + 1);
      const [a, b] = flipped;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, matched: true } : c
          ));
          setMatched(m => m + 1);
          setFlipped([]);
          setChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setChecking(false);
        }, 800);
      }
    }
  }, [flipped, cards]);

  const handleFlip = (index) => {
    if (checking || cards[index].flipped || cards[index].matched || flipped.length >= 2) return;
    setCards(prev => prev.map((c, i) =>
      i === index ? { ...c, flipped: true } : c
    ));
    setFlipped(prev => [...prev, index]);
  };

  const reset = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setMatched(0);
    setChecking(false);
  };

  const allMatched = matched === EMOJIS.length;

  return (
    <div className="memorymatch-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Memory Match 🦋</h1>
        <p className="page-subtitle">Find the matching pairs — take your time</p>
      </header>

      <div className="mm-stats">
        <span className="mm-stat">🔄 {moves} moves</span>
        <span className="mm-stat">✅ {matched}/{EMOJIS.length} pairs</span>
      </div>

      {allMatched && (
        <div className="mm-complete card slide-up">
          🎉 You found them all in {moves} moves! Beautiful work!
        </div>
      )}

      <div className="mm-grid fade-in">
        {cards.map((card, i) => (
          <button
            key={card.id}
            className={`mm-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleFlip(i)}
            aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
          >
            <div className="mm-card-inner">
              <div className="mm-card-front">
                <span>🌿</span>
              </div>
              <div className="mm-card-back">
                <span>{card.emoji}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button className="clear-btn" onClick={reset}>
        <RotateCcw size={14} /> New Game
      </button>
    </div>
  );
}

export default MemoryMatchPage;
