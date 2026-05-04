import React, { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './WordSearchPage.css';

const WORDS = ['BRAVE', 'CALM', 'PEACE', 'STRONG', 'HOPE', 'LOVE', 'SAFE', 'KIND', 'GROW', 'HEAL'];
const SIZE = 10;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generatePuzzle() {
  const grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(''));
  const placed = [];
  const directions = [
    [0, 1], [1, 0], [1, 1], [0, -1], [1, -1],
  ];

  for (const word of WORDS) {
    let attempts = 0;
    let didPlace = false;
    while (attempts < 100 && !didPlace) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const maxR = SIZE - (dir[0] > 0 ? word.length : 1);
      const maxC = dir[1] > 0 ? SIZE - word.length : dir[1] < 0 ? SIZE - 1 : SIZE - 1;
      const minC = dir[1] < 0 ? word.length - 1 : 0;
      const r = Math.floor(Math.random() * (maxR + 1));
      const c = minC + Math.floor(Math.random() * (maxC - minC + 1));

      let canPlace = true;
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        const nr = r + dir[0] * i;
        const nc = c + dir[1] * i;
        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) { canPlace = false; break; }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { canPlace = false; break; }
        cells.push([nr, nc]);
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[cells[i][0]][cells[i][1]] = word[i];
        }
        placed.push({ word, cells });
        didPlace = true;
      }
    }
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }

  return { grid, placed };
}

function WordSearchPage({ onBack }) {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle());
  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState([]);
  const [foundCells, setFoundCells] = useState(new Set());

  const isSelected = (r, c) => selected.some(s => s[0] === r && s[1] === c);
  const isFound = (r, c) => foundCells.has(`${r}-${c}`);

  const handleCellClick = useCallback((r, c) => {
    const newSelected = [...selected, [r, c]];
    setSelected(newSelected);

    const selectedStr = newSelected.map(([sr, sc]) => puzzle.grid[sr][sc]).join('');

    for (const p of puzzle.placed) {
      if (found.includes(p.word)) continue;
      const wordStr = p.cells.map(([wr, wc]) => puzzle.grid[wr][wc]).join('');
      if (selectedStr === wordStr || selectedStr === wordStr.split('').reverse().join('')) {
        const match = newSelected.length === p.word.length &&
          newSelected.every(([sr, sc], i) => {
            const cell = selectedStr === wordStr ? p.cells[i] : p.cells[p.word.length - 1 - i];
            return sr === cell[0] && sc === cell[1];
          });
        if (match) {
          setFound(f => [...f, p.word]);
          const newFoundCells = new Set(foundCells);
          p.cells.forEach(([cr, cc]) => newFoundCells.add(`${cr}-${cc}`));
          setFoundCells(newFoundCells);
          setSelected([]);
          return;
        }
      }
    }

    if (newSelected.length >= 7) {
      setSelected([]);
    }
  }, [selected, puzzle, found, foundCells]);

  const newPuzzle = () => {
    setPuzzle(generatePuzzle());
    setSelected([]);
    setFound([]);
    setFoundCells(new Set());
  };

  return (
    <div className="wordsearch-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Word Search 🔤</h1>
        <p className="page-subtitle">Find positive words hidden in the grid</p>
      </header>

      <div className="ws-word-list">
        {WORDS.map(w => (
          <span key={w} className={`ws-word ${found.includes(w) ? 'found' : ''}`}>
            {w}
          </span>
        ))}
      </div>

      {found.length === WORDS.length && (
        <div className="ws-complete card slide-up">
          🎉 You found them all! Every word is a reminder of your strength.
        </div>
      )}

      <div className="ws-grid fade-in">
        {puzzle.grid.map((row, r) => (
          <div key={r} className="ws-row">
            {row.map((letter, c) => (
              <button
                key={c}
                className={`ws-cell ${isSelected(r, c) ? 'selected' : ''} ${isFound(r, c) ? 'found' : ''}`}
                onClick={() => handleCellClick(r, c)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="ws-actions">
        <button className="clear-btn" onClick={() => setSelected([])}>Clear Selection</button>
        <button className="clear-btn" onClick={newPuzzle}>
          <RotateCcw size={14} /> New Puzzle
        </button>
      </div>
    </div>
  );
}

export default WordSearchPage;
