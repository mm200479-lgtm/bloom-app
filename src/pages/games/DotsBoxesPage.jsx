import React, { useState, useCallback, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import './DotsBoxesPage.css';

const GRID = 4;

function initLines() {
  const h = {};
  const v = {};
  for (let r = 0; r <= GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      h[`h-${r}-${c}`] = null;
    }
  }
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c <= GRID; c++) {
      v[`v-${r}-${c}`] = null;
    }
  }
  return { ...h, ...v };
}

function checkBoxes(lines) {
  const boxes = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const top = lines[`h-${r}-${c}`];
      const bottom = lines[`h-${r + 1}-${c}`];
      const left = lines[`v-${r}-${c}`];
      const right = lines[`v-${r}-${c + 1}`];
      if (top && bottom && left && right) {
        boxes.push({ r, c, owner: top });
      }
    }
  }
  return boxes;
}

function getAvailableLines(lines) {
  return Object.keys(lines).filter(k => !lines[k]);
}

function DotsBoxesPage({ onBack }) {
  const [lines, setLines] = useState(initLines);
  const [turn, setTurn] = useState('player');
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [completedBoxes, setCompletedBoxes] = useState([]);

  const placeLine = useCallback((key, who) => {
    setLines(prev => {
      const next = { ...prev, [key]: who };
      const oldBoxes = checkBoxes(prev);
      const newBoxes = checkBoxes(next);
      const gained = newBoxes.length - oldBoxes.length;

      setCompletedBoxes(newBoxes);

      if (gained > 0) {
        setScores(s => ({ ...s, [who]: s[who] + gained }));
        if (who === 'player') {
          return next;
        }
      } else {
        setTurn(who === 'player' ? 'ai' : 'player');
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (turn !== 'ai') return;
    const timer = setTimeout(() => {
      const available = getAvailableLines(lines);
      if (available.length === 0) return;
      const pick = available[Math.floor(Math.random() * available.length)];
      placeLine(pick, 'ai');
    }, 600);
    return () => clearTimeout(timer);
  }, [turn, lines, placeLine]);

  const handleLineClick = (key) => {
    if (turn !== 'player' || lines[key]) return;
    placeLine(key, 'player');
  };

  const reset = () => {
    setLines(initLines());
    setTurn('player');
    setScores({ player: 0, ai: 0 });
    setCompletedBoxes([]);
  };

  const available = getAvailableLines(lines);
  const gameOver = available.length === 0;

  const getBoxOwner = (r, c) => {
    const box = completedBoxes.find(b => b.r === r && b.c === c);
    return box ? box.owner : null;
  };

  return (
    <div className="dotsboxes-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Dots & Boxes 🔲</h1>
        <p className="page-subtitle">Connect the dots and claim your boxes</p>
      </header>

      <div className="db-scores">
        <div className={`db-score ${turn === 'player' ? 'active' : ''}`}>
          <span className="db-score-label">You 💜</span>
          <span className="db-score-num">{scores.player}</span>
        </div>
        <div className={`db-score ${turn === 'ai' ? 'active' : ''}`}>
          <span className="db-score-label">AI 🤖</span>
          <span className="db-score-num">{scores.ai}</span>
        </div>
      </div>

      {gameOver && (
        <div className="db-result card slide-up">
          {scores.player >= scores.ai
            ? '🎉 You did great!'
            : '💜 Nice try! Play again?'}
        </div>
      )}

      <div className="db-board fade-in">
        {Array.from({ length: GRID * 2 + 1 }, (_, row) => (
          <div key={row} className="db-row">
            {row % 2 === 0 ? (
              Array.from({ length: GRID * 2 + 1 }, (_, col) => {
                const r = row / 2;
                if (col % 2 === 0) {
                  return <div key={col} className="db-dot" />;
                } else {
                  const c = (col - 1) / 2;
                  const key = `h-${r}-${c}`;
                  return (
                    <button
                      key={col}
                      className={`db-line db-h-line ${lines[key] ? `filled-${lines[key]}` : ''}`}
                      onClick={() => handleLineClick(key)}
                      disabled={!!lines[key] || turn !== 'player'}
                      aria-label={`Horizontal line ${r},${c}`}
                    />
                  );
                }
              })
            ) : (
              Array.from({ length: GRID * 2 + 1 }, (_, col) => {
                const r = (row - 1) / 2;
                if (col % 2 === 0) {
                  const c = col / 2;
                  const key = `v-${r}-${c}`;
                  return (
                    <button
                      key={col}
                      className={`db-line db-v-line ${lines[key] ? `filled-${lines[key]}` : ''}`}
                      onClick={() => handleLineClick(key)}
                      disabled={!!lines[key] || turn !== 'player'}
                      aria-label={`Vertical line ${r},${c}`}
                    />
                  );
                } else {
                  const c = (col - 1) / 2;
                  const owner = getBoxOwner(r, c);
                  return (
                    <div key={col} className={`db-box ${owner ? `box-${owner}` : ''}`}>
                      {owner === 'player' ? '💜' : owner === 'ai' ? '🤖' : ''}
                    </div>
                  );
                }
              })
            )}
          </div>
        ))}
      </div>

      <button className="clear-btn" onClick={reset}>
        <RotateCcw size={14} /> New Game
      </button>
    </div>
  );
}

export default DotsBoxesPage;
