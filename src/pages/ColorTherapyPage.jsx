import React, { useState, useEffect, useRef } from 'react';
import './ColorTherapyPage.css';

const PRESETS = [
  { name: 'Sunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#f368e0'], text: 'Warmth fading into evening calm' },
  { name: 'Ocean', colors: ['#0abde3', '#48dbfb', '#c7ecee', '#dff9fb'], text: 'Waves rolling in, rolling out' },
  { name: 'Aurora', colors: ['#6c5ce7', '#a29bfe', '#00cec9', '#55efc4'], text: 'Light dancing across the sky' },
  { name: 'Forest', colors: ['#00b894', '#55efc4', '#badc58', '#6ab04c'], text: 'Sunlight filtering through leaves' },
  { name: 'Twilight', colors: ['#30336b', '#6c5ce7', '#e056fd', '#f8a5c2'], text: 'The quiet space between day and night' },
];

function ColorTherapyPage({ onBack }) {
  const [preset, setPreset] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const timerRef = useRef(null);

  const current = PRESETS[preset];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setColorIdx(prev => (prev + 1) % current.colors.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [preset, current.colors.length]);

  const color1 = current.colors[colorIdx];
  const color2 = current.colors[(colorIdx + 1) % current.colors.length];

  return (
    <div
      className="color-therapy-page"
      style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      onClick={() => setShowControls(!showControls)}
    >
      <div className={`color-controls ${showControls ? 'visible' : 'hidden'}`}>
        <button className="back-btn" onClick={(e) => { e.stopPropagation(); onBack(); }} style={{ color: 'white' }}>← Back</button>
        <h1 className="color-title">{current.name}</h1>
        <p className="color-text">{current.text}</p>
        <div className="color-presets">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              className={`color-preset-btn ${preset === i ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setPreset(i); setColorIdx(0); }}
              style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="color-hint">Tap anywhere to hide controls. Just breathe.</p>
      </div>

      {!showControls && (
        <div className="color-breathe-text">
          <p>Breathe.</p>
        </div>
      )}
    </div>
  );
}

export default ColorTherapyPage;
