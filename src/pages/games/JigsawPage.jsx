import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import './JigsawPage.css';

const IMAGES = [
  { name: 'Sunset', gradient: 'linear-gradient(135deg, #f093fb, #f5576c, #fda085)' },
  { name: 'Ocean', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe, #43e97b)' },
  { name: 'Forest', gradient: 'linear-gradient(135deg, #38ef7d, #11998e, #0f3443)' },
  { name: 'Lavender', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb, #f6d5f7)' },
  { name: 'Dawn', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f, #ff9a9e)' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createPieces() {
  return shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
}

function isSolved(pieces) {
  return pieces.every((p, i) => p === i);
}

function JigsawPage({ onBack }) {
  const [imageIdx, setImageIdx] = useState(0);
  const [pieces, setPieces] = useState(createPieces);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const image = IMAGES[imageIdx];

  const handlePieceClick = (index) => {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
    } else {
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]];
      setPieces(newPieces);
      setMoves(m => m + 1);
      setSelected(null);
      if (isSolved(newPieces)) {
        setSolved(true);
      }
    }
  };

  const reset = () => {
    setPieces(createPieces());
    setSelected(null);
    setMoves(0);
    setSolved(false);
  };

  const switchImage = (idx) => {
    setImageIdx(idx);
    reset();
  };

  return (
    <div className="jigsaw-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Jigsaw Lite 🧩</h1>
        <p className="page-subtitle">Tap two pieces to swap them into place</p>
      </header>

      <div className="jig-image-picker">
        {IMAGES.map((img, i) => (
          <button
            key={i}
            className={`jig-img-btn ${imageIdx === i ? 'active' : ''}`}
            style={{ background: img.gradient }}
            onClick={() => switchImage(i)}
            aria-label={img.name}
          />
        ))}
      </div>

      <div className="jig-stats">
        <span className="jig-stat">🔄 {moves} swaps</span>
      </div>

      {solved && (
        <div className="jig-complete card slide-up">
          🎉 Beautiful! You completed it in {moves} swaps!
        </div>
      )}

      <div className="jig-grid fade-in">
        {pieces.map((piece, index) => {
          const row = Math.floor(piece / 3);
          const col = piece % 3;
          return (
            <button
              key={index}
              className={`jig-piece ${selected === index ? 'selected' : ''} ${solved ? 'solved' : ''}`}
              style={{
                background: image.gradient,
                backgroundSize: '300% 300%',
                backgroundPosition: `${col * 50}% ${row * 50}%`,
              }}
              onClick={() => handlePieceClick(index)}
            >
              {!solved && <span className="jig-piece-num">{piece + 1}</span>}
            </button>
          );
        })}
      </div>

      <button className="clear-btn" onClick={reset}>
        <RotateCcw size={14} /> Shuffle Again
      </button>
    </div>
  );
}

export default JigsawPage;
