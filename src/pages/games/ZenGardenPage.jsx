import React, { useState, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './ZenGardenPage.css';

const PLANTS = ['🌿', '🌸', '🌺', '🍃', '🌱', '🪷'];

function ZenGardenPage({ onBack }) {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [stones, setStones] = useState([]);
  const [plants, setPlants] = useState([]);
  const [tool, setTool] = useState('rake');
  const [selectedPlant, setSelectedPlant] = useState('🌿');
  const canvasRef = useRef(null);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const pos = getPos(e);
    if (tool === 'rake') {
      setCurrentLine([pos]);
    } else if (tool === 'stone') {
      setStones(prev => [...prev, { ...pos, size: 16 + Math.random() * 20, id: Date.now() }]);
    } else if (tool === 'plant') {
      setPlants(prev => [...prev, { ...pos, emoji: selectedPlant, id: Date.now() }]);
    }
  }, [tool, selectedPlant]);

  const handlePointerMove = useCallback((e) => {
    e.preventDefault();
    if (tool !== 'rake' || !currentLine) return;
    const pos = getPos(e);
    setCurrentLine(prev => [...prev, pos]);
  }, [tool, currentLine]);

  const handlePointerUp = useCallback(() => {
    if (currentLine && currentLine.length > 1) {
      setLines(prev => [...prev, currentLine]);
    }
    setCurrentLine(null);
  }, [currentLine]);

  const clearAll = () => {
    setLines([]);
    setStones([]);
    setPlants([]);
    setCurrentLine(null);
  };

  const allLines = currentLine ? [...lines, currentLine] : lines;

  return (
    <div className="zengarden-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Zen Garden 🪨</h1>
        <p className="page-subtitle">Rake the sand, place stones, find your calm</p>
      </header>

      <div className="zen-tools">
        <button
          className={`zen-tool ${tool === 'rake' ? 'active' : ''}`}
          onClick={() => setTool('rake')}
        >
          〰️ Rake
        </button>
        <button
          className={`zen-tool ${tool === 'stone' ? 'active' : ''}`}
          onClick={() => setTool('stone')}
        >
          🪨 Stone
        </button>
        <button
          className={`zen-tool ${tool === 'plant' ? 'active' : ''}`}
          onClick={() => setTool('plant')}
        >
          🌿 Plant
        </button>
      </div>

      {tool === 'plant' && (
        <div className="zen-plant-picker">
          {PLANTS.map(p => (
            <button
              key={p}
              className={`zen-plant-btn ${selectedPlant === p ? 'active' : ''}`}
              onClick={() => setSelectedPlant(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div
        className="zen-canvas"
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <svg className="zen-svg" width="100%" height="100%">
          {allLines.map((line, li) => (
            <polyline
              key={li}
              points={line.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#8B7355"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          ))}
        </svg>
        {stones.map(s => (
          <div
            key={s.id}
            className="zen-stone"
            style={{
              left: s.x - s.size / 2,
              top: s.y - s.size / 2,
              width: s.size,
              height: s.size * 0.8,
            }}
          />
        ))}
        {plants.map(p => (
          <span
            key={p.id}
            className="zen-plant"
            style={{ left: p.x - 12, top: p.y - 12 }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <button className="clear-btn" onClick={clearAll}>
        <RotateCcw size={14} /> Clear Garden
      </button>
    </div>
  );
}

export default ZenGardenPage;
