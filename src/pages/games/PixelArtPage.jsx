import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import './PixelArtPage.css';

const SIZE = 16;
const COLORS = [
  '#2d2d2d', '#f8b4c8', '#f4a0a0', '#f8d49e',
  '#f9e88e', '#b8e6b8', '#8ed4a8', '#8ec8e8',
  '#a0b4f4', '#c8a0f4', '#e8a0e0', '#ffffff',
];

function PixelArtPage({ onBack }) {
  const [selectedColor, setSelectedColor] = useState(COLORS[1]);
  const [grid, setGrid] = useState(() =>
    Array(SIZE).fill(null).map(() => Array(SIZE).fill(null))
  );
  const [painting, setPainting] = useState(false);

  const paint = (r, c) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = selectedColor;
      return next;
    });
  };

  const handlePointerDown = (r, c) => {
    setPainting(true);
    paint(r, c);
  };

  const handlePointerEnter = (r, c) => {
    if (painting) paint(r, c);
  };

  const handlePointerUp = () => {
    setPainting(false);
  };

  const clearAll = () => {
    setGrid(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)));
  };

  return (
    <div className="pixelart-page" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Pixel Art 🟩</h1>
        <p className="page-subtitle">Create pixel masterpieces one square at a time</p>
      </header>

      <div className="pa-grid fade-in">
        {grid.map((row, r) => (
          <div key={r} className="pa-row">
            {row.map((cell, c) => (
              <div
                key={c}
                className="pa-cell"
                style={cell ? { backgroundColor: cell } : {}}
                onPointerDown={() => handlePointerDown(r, c)}
                onPointerEnter={() => handlePointerEnter(r, c)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="pa-palette">
        {COLORS.map(color => (
          <button
            key={color}
            className={`pa-color ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select color`}
          />
        ))}
      </div>

      <button className="clear-btn" onClick={clearAll}>
        <RotateCcw size={14} /> Clear All
      </button>
    </div>
  );
}

export default PixelArtPage;
