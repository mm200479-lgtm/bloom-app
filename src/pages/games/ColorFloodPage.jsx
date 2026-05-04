import React, { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './ColorFloodPage.css';

const SIZE = 8;
const COLORS = ['#f8b4c8', '#a0d4a0', '#a0c4f0', '#f0d4a0', '#d0b0f0', '#f0a0a0'];

function createGrid() {
  return Array(SIZE).fill(null).map(() =>
    Array(SIZE).fill(null).map(() =>
      COLORS[Math.floor(Math.random() * COLORS.length)]
    )
  );
}

function floodFill(grid, newColor) {
  const oldColor = grid[0][0];
  if (oldColor === newColor) return grid;
  const next = grid.map(r => [...r]);
  const stack = [[0, 0]];
  const visited = new Set();

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    const key = `${r}-${c}`;
    if (visited.has(key)) continue;
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) continue;
    if (next[r][c] !== oldColor) continue;
    visited.add(key);
    next[r][c] = newColor;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }
  return next;
}

function isComplete(grid) {
  const color = grid[0][0];
  return grid.every(row => row.every(cell => cell === color));
}

function ColorFloodPage({ onBack }) {
  const [grid, setGrid] = useState(createGrid);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const handleColorPick = useCallback((color) => {
    if (won) return;
    if (color === grid[0][0]) return;
    const newGrid = floodFill(grid, color);
    setGrid(newGrid);
    setMoves(m => m + 1);
    if (isComplete(newGrid)) {
      setWon(true);
    }
  }, [grid, won]);

  const reset = () => {
    setGrid(createGrid());
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="colorflood-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Color Flood 🌈</h1>
        <p className="page-subtitle">Make the whole board one color, starting from the top-left</p>
      </header>

      <div className="cf-stats">
        <span className="cf-stat">🎨 {moves} moves</span>
      </div>

      {won && (
        <div className="cf-complete card slide-up">
          🎉 You flooded the board in {moves} moves! Wonderful!
        </div>
      )}

      <div className="cf-grid fade-in">
        {grid.map((row, r) => (
          <div key={r} className="cf-row">
            {row.map((color, c) => (
              <div
                key={c}
                className="cf-cell"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="cf-palette">
        {COLORS.map(color => (
          <button
            key={color}
            className={`cf-color-btn ${grid[0][0] === color ? 'current' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorPick(color)}
            disabled={won}
            aria-label={`Pick color`}
          />
        ))}
      </div>

      <button className="clear-btn" onClick={reset}>
        <RotateCcw size={14} /> New Board
      </button>
    </div>
  );
}

export default ColorFloodPage;
