import React, { useState, useRef, useCallback } from 'react';
import './FidgetPage.css';

function FidgetPage({ onBack }) {
  // Bubble wrap
  const [popped, setPopped] = useState({});
  const popBubble = (i) => {
    if (popped[i]) return;
    setPopped(prev => ({ ...prev, [i]: true }));
  };
  const resetBubbles = () => setPopped({});

  // Toggle switches
  const [switches, setSwitches] = useState(Array(8).fill(false));
  const toggleSwitch = (i) => setSwitches(prev => prev.map((v, idx) => idx === i ? !v : v));

  // Spinner
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const spinTimer = useRef(null);
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const speed = 720 + Math.random() * 1080;
    setRotation(prev => prev + speed);
    spinTimer.current = setTimeout(() => setSpinning(false), 2000);
  };

  // Slider
  const [sliderVal, setSliderVal] = useState(50);

  const poppedCount = Object.keys(popped).length;

  return (
    <div className="fidget-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Fidget Tools 🫧</h1>
        <p className="page-subtitle">Tap, pop, flip, spin — whatever feels good</p>
      </header>

      <div className="fidget-section">
        <h3 className="section-title">Bubble Wrap</h3>
        <div className="bubble-grid">
          {Array.from({ length: 48 }, (_, i) => (
            <button
              key={i}
              className={`bubble ${popped[i] ? 'popped' : ''}`}
              onClick={() => popBubble(i)}
              aria-label={`Bubble ${i + 1}`}
            />
          ))}
        </div>
        <div className="bubble-footer">
          <span className="bubble-count">{poppedCount}/48 popped</span>
          <button className="identity-suggest-btn" onClick={resetBubbles}>Reset</button>
        </div>
      </div>

      <div className="fidget-section">
        <h3 className="section-title">Toggle Switches</h3>
        <div className="toggle-row">
          {switches.map((on, i) => (
            <button key={i} className={`toggle-switch ${on ? 'on' : ''}`} onClick={() => toggleSwitch(i)} aria-label={`Switch ${i + 1}`}>
              <span className="toggle-knob" />
            </button>
          ))}
        </div>
      </div>

      <div className="fidget-section">
        <h3 className="section-title">Spinner</h3>
        <div className="spinner-container" onClick={spin}>
          <div className="spinner" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 2s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none' }}>
            <span className="spinner-arm">●</span>
            <span className="spinner-arm">●</span>
            <span className="spinner-arm">●</span>
          </div>
          <p className="spinner-hint">{spinning ? 'Spinning...' : 'Tap to spin!'}</p>
        </div>
      </div>

      <div className="fidget-section">
        <h3 className="section-title">Slider</h3>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={e => setSliderVal(e.target.value)}
            className="fidget-slider"
          />
          <div className="slider-track-fill" style={{ width: `${sliderVal}%` }} />
        </div>
      </div>
    </div>
  );
}

export default FidgetPage;
