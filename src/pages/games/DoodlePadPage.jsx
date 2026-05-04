import React, { useState, useRef, useCallback } from 'react';
import { RotateCcw, Eraser } from 'lucide-react';
import './DoodlePadPage.css';

const COLORS = [
  '#2d2d2d', '#f8b4c8', '#f4a0a0', '#f8d49e',
  '#f9e88e', '#b8e6b8', '#8ed4a8', '#8ec8e8',
  '#a0b4f4', '#c8a0f4', '#e8a0e0', '#d4c4b0',
];

const SIZES = [
  { label: 'S', value: 3 },
  { label: 'M', value: 8 },
  { label: 'L', value: 16 },
];

function DoodlePadPage({ onBack }) {
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(8);
  const [eraser, setEraser] = useState(false);
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
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
    setCurrentLine({
      points: [pos],
      color: eraser ? '#ffffff' : color,
      size: eraser ? 20 : brushSize,
    });
  }, [color, brushSize, eraser]);

  const handlePointerMove = useCallback((e) => {
    e.preventDefault();
    if (!currentLine) return;
    const pos = getPos(e);
    setCurrentLine(prev => ({
      ...prev,
      points: [...prev.points, pos],
    }));
  }, [currentLine]);

  const handlePointerUp = useCallback(() => {
    if (currentLine && currentLine.points.length > 0) {
      setLines(prev => [...prev, currentLine]);
    }
    setCurrentLine(null);
  }, [currentLine]);

  const clearAll = () => {
    setLines([]);
    setCurrentLine(null);
  };

  const allLines = currentLine ? [...lines, currentLine] : lines;

  return (
    <div className="doodlepad-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Doodle Pad ✏️</h1>
        <p className="page-subtitle">Draw whatever you feel — no rules, just create</p>
      </header>

      <div
        className="dp-canvas"
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <svg width="100%" height="100%">
          {allLines.map((line, li) => (
            <polyline
              key={li}
              points={line.points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={line.color}
              strokeWidth={line.size}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>

      <div className="dp-tools">
        <div className="dp-colors">
          {COLORS.map(c => (
            <button
              key={c}
              className={`dp-color ${color === c && !eraser ? 'selected' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => { setColor(c); setEraser(false); }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        <div className="dp-options">
          <div className="dp-sizes">
            {SIZES.map(s => (
              <button
                key={s.label}
                className={`dp-size-btn ${brushSize === s.value && !eraser ? 'active' : ''}`}
                onClick={() => { setBrushSize(s.value); setEraser(false); }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            className={`dp-eraser-btn ${eraser ? 'active' : ''}`}
            onClick={() => setEraser(!eraser)}
          >
            <Eraser size={16} /> Eraser
          </button>

          <button className="dp-clear-btn" onClick={clearAll}>
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoodlePadPage;
