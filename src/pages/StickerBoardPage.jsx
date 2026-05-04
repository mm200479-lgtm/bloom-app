import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { getStickers, saveStickers } from '../utils/storage';
import './StickerBoardPage.css';

const AVAILABLE_STICKERS = [
  { id: 'star', emoji: '⭐', name: 'Gold Star', desc: 'Completed a check-in' },
  { id: 'heart', emoji: '❤️', name: 'Heart', desc: 'Logged a mood' },
  { id: 'flower', emoji: '🌸', name: 'Bloom', desc: 'Grew your garden' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', desc: 'Completed a journal entry' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly', desc: 'Used a coping tool' },
  { id: 'sparkle', emoji: '✨', name: 'Sparkle', desc: 'Reached a streak' },
  { id: 'sun', emoji: '☀️', name: 'Sunshine', desc: 'Had a good day' },
  { id: 'moon', emoji: '🌙', name: 'Moon', desc: 'Logged sleep' },
  { id: 'trophy', emoji: '🏆', name: 'Trophy', desc: 'Earned an achievement' },
  { id: 'gem', emoji: '💎', name: 'Gem', desc: 'Practiced gratitude' },
  { id: 'fire', emoji: '🔥', name: 'Fire', desc: '7-day streak' },
  { id: 'crown', emoji: '👑', name: 'Crown', desc: 'Completed all daily tasks' },
];

const BOARD_SIZE = 36;

function StickerBoardPage({ onBack }) {
  const [data, setData] = useState({ earned: [], placed: [] });
  const [selectedSticker, setSelectedSticker] = useState(null);

  useEffect(() => {
    const saved = getStickers();
    if (saved.earned.length === 0) {
      const defaults = { earned: AVAILABLE_STICKERS.slice(0, 6).map(s => s.id), placed: [] };
      saveStickers(defaults);
      setData(defaults);
    } else {
      setData(saved);
    }
  }, []);

  const placeSticker = (cellIdx) => {
    if (!selectedSticker) return;
    const sticker = AVAILABLE_STICKERS.find(s => s.id === selectedSticker);
    if (!sticker) return;
    const updated = {
      ...data,
      placed: [...data.placed.filter(p => p.cell !== cellIdx), { cell: cellIdx, stickerId: selectedSticker, emoji: sticker.emoji }],
    };
    saveStickers(updated);
    setData(updated);
    setSelectedSticker(null);
  };

  const clearBoard = () => {
    const updated = { ...data, placed: [] };
    saveStickers(updated);
    setData(updated);
  };

  const earnedStickers = AVAILABLE_STICKERS.filter(s => data.earned.includes(s.id));

  return (
    <div className="sticker-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Sticker Board ⭐</h1>
        <p className="page-subtitle">Tap a sticker, then tap the board to place it</p>
      </header>

      <div className="sticker-palette">
        <h3 className="section-title">Your stickers ({earnedStickers.length})</h3>
        <div className="sticker-list">
          {earnedStickers.map(s => (
            <button
              key={s.id}
              className={`sticker-pick ${selectedSticker === s.id ? 'selected' : ''}`}
              onClick={() => setSelectedSticker(selectedSticker === s.id ? null : s.id)}
              title={s.name}
            >
              {s.emoji}
            </button>
          ))}
        </div>
        {selectedSticker && <p className="sticker-hint">Now tap a spot on the board!</p>}
      </div>

      <div className="sticker-board">
        {Array.from({ length: BOARD_SIZE }, (_, i) => {
          const placed = data.placed.find(p => p.cell === i);
          return (
            <button
              key={i}
              className={`board-cell ${placed ? 'has-sticker' : ''} ${selectedSticker ? 'placeable' : ''}`}
              onClick={() => placeSticker(i)}
            >
              {placed ? placed.emoji : ''}
            </button>
          );
        })}
      </div>

      <button className="protocol-reset-btn" onClick={clearBoard} style={{ marginTop: 12 }}>
        <RotateCcw size={14} /> Clear board
      </button>

      <div className="sticker-achievements">
        <h3 className="section-title">All stickers</h3>
        <div className="sticker-achievement-list">
          {AVAILABLE_STICKERS.map(s => (
            <div key={s.id} className={`sticker-achievement ${data.earned.includes(s.id) ? 'earned' : 'locked'}`}>
              <span className="sticker-ach-emoji">{s.emoji}</span>
              <span className="sticker-ach-name">{s.name}</span>
              <span className="sticker-ach-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickerBoardPage;
