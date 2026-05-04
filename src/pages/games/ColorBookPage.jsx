import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import './ColorBookPage.css';

const COLORS = [
  '#f8b4c8', '#f4a0a0', '#f8d49e', '#f9e88e',
  '#b8e6b8', '#8ed4a8', '#8ec8e8', '#a0b4f4',
  '#c8a0f4', '#e8a0e0', '#d4c4b0', '#f0e8e0',
];

const PATTERNS = {
  flower: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,2,2,1,1,0],
    [1,1,2,3,3,2,1,1],
    [1,1,2,3,3,2,1,1],
    [0,1,1,2,2,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
  ],
  heart: [
    [0,1,1,0,0,1,1,0],
    [1,2,2,1,1,2,2,1],
    [1,2,3,2,2,3,2,1],
    [1,2,2,2,2,2,2,1],
    [0,1,2,2,2,2,1,0],
    [0,0,1,2,2,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  star: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,2,2,1,0,0],
    [1,1,2,3,3,2,1,1],
    [0,1,2,3,3,2,1,0],
    [0,0,1,2,2,1,0,0],
    [0,1,2,1,1,2,1,0],
    [1,2,1,0,0,1,2,1],
    [1,1,0,0,0,0,1,1],
  ],
  mandala: [
    [1,0,1,2,2,1,0,1],
    [0,2,3,1,1,3,2,0],
    [1,3,2,3,3,2,3,1],
    [2,1,3,1,1,3,1,2],
    [2,1,3,1,1,3,1,2],
    [1,3,2,3,3,2,3,1],
    [0,2,3,1,1,3,2,0],
    [1,0,1,2,2,1,0,1],
  ],
};

const PATTERN_NAMES = [
  { key: 'flower', emoji: '🌸', label: 'Flower' },
  { key: 'heart', emoji: '💜', label: 'Heart' },
  { key: 'star', emoji: '⭐', label: 'Star' },
  { key: 'mandala', emoji: '🔮', label: 'Mandala' },
];

function ColorBookPage({ onBack }) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [patternKey, setPatternKey] = useState('flower');
  const [grid, setGrid] = useState(() => Array(8).fill(null).map(() => Array(8).fill(null)));

  const pattern = PATTERNS[patternKey];

  const handleCellClick = (r, c) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = selectedColor;
    setGrid(newGrid);
  };

  const clearAll = () => {
    setGrid(Array(8).fill(null).map(() => Array(8).fill(null)));
  };

  const switchPattern = (key) => {
    setPatternKey(key);
    setGrid(Array(8).fill(null).map(() => Array(8).fill(null)));
  };

  return (
    <div className="colorbook-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Coloring Book 🎨</h1>
        <p className="page-subtitle">Pick a color and fill in the pattern — take your time</p>
      </header>

      <div className="pattern-selector">
        {PATTERN_NAMES.map(p => (
          <button
            key={p.key}
            className={`pattern-btn ${patternKey === p.key ? 'active' : ''}`}
            onClick={() => switchPattern(p.key)}
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      <div className="coloring-grid fade-in">
        {grid.map((row, r) => (
          <div key={r} className="coloring-row">
            {row.map((cell, c) => {
              const zone = pattern[r][c];
              return (
                <button
                  key={c}
                  className={`coloring-cell zone-${zone}`}
                  style={cell ? { backgroundColor: cell } : {}}
                  onClick={() => handleCellClick(r, c)}
                  aria-label={`Cell ${r},${c}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="color-palette">
        {COLORS.map(color => (
          <button
            key={color}
            className={`palette-color ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      <button className="clear-btn" onClick={clearAll}>
        <RotateCcw size={14} /> Clear All
      </button>
    </div>
  );
}

export default ColorBookPage;
