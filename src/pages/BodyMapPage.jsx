import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getBodyMapEntries, addBodyMapEntry } from '../utils/storage';
import './BodyMapPage.css';

const REGIONS = [
  { id: 'head', label: 'Head', top: '5%', left: '50%' },
  { id: 'jaw', label: 'Jaw', top: '15%', left: '50%' },
  { id: 'shoulders', label: 'Shoulders', top: '24%', left: '50%' },
  { id: 'chest', label: 'Chest', top: '34%', left: '50%' },
  { id: 'stomach', label: 'Stomach', top: '46%', left: '50%' },
  { id: 'hands', label: 'Hands', top: '52%', left: '18%' },
  { id: 'back', label: 'Back', top: '40%', left: '82%' },
  { id: 'legs', label: 'Legs', top: '72%', left: '50%' },
];

const EMOTIONS = ['Tension', 'Pain', 'Anxiety', 'Warmth', 'Numbness', 'Heaviness', 'Tingling', 'Tightness', 'Nausea', 'Calm'];

function BodyMapPage() {
  const [entries, setEntries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setEntries(getBodyMapEntries()); }, []);

  const handleSave = () => {
    if (!selectedRegion || !selectedEmotion) return;
    const updated = addBodyMapEntry({
      region: selectedRegion,
      emotion: selectedEmotion,
      note: note.trim(),
    });
    setEntries(updated);
    setSelectedRegion(null);
    setSelectedEmotion('');
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const recentForRegion = (regionId) => {
    return entries.find(e => e.region === regionId);
  };

  return (
    <div className="bodymap-page">
      <header className="page-header">
        <h1>Body Map 🫀</h1>
        <p className="page-subtitle">Where do you feel your emotions? Tap to explore.</p>
      </header>

      {saved && <div className="bm-saved slide-up">✨ Body sensation logged!</div>}

      <div className="body-outline card">
        <div className="body-figure">
          {/* Head */}
          <div className="body-part head" />
          {/* Neck */}
          <div className="body-part neck" />
          {/* Torso */}
          <div className="body-part torso" />
          {/* Arms */}
          <div className="body-part arm-left" />
          <div className="body-part arm-right" />
          {/* Hands */}
          <div className="body-part hand-left" />
          <div className="body-part hand-right" />
          {/* Legs */}
          <div className="body-part leg-left" />
          <div className="body-part leg-right" />

          {/* Tappable regions */}
          {REGIONS.map(r => {
            const recent = recentForRegion(r.id);
            return (
              <button
                key={r.id}
                className={`body-region ${selectedRegion === r.id ? 'selected' : ''} ${recent ? 'has-entry' : ''}`}
                style={{ top: r.top, left: r.left }}
                onClick={() => setSelectedRegion(selectedRegion === r.id ? null : r.id)}
                aria-label={r.label}
              >
                <span className="region-label">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedRegion && (
        <div className="bm-form card slide-up">
          <h3 className="section-title">What do you feel in your {REGIONS.find(r => r.id === selectedRegion)?.label.toLowerCase()}?</h3>
          <div className="emotion-options">
            {EMOTIONS.map(e => (
              <button
                key={e}
                className={`emotion-btn ${selectedEmotion === e ? 'active' : ''}`}
                onClick={() => setSelectedEmotion(e)}
              >{e}</button>
            ))}
          </div>
          <input className="input-field" placeholder="Any notes? (optional)" value={note} onChange={e => setNote(e.target.value)} />
          <button className="primary-btn" onClick={handleSave} disabled={!selectedEmotion}>Log sensation</button>
        </div>
      )}

      {entries.length > 0 && (
        <div className="bm-history">
          <h3 className="section-title">Recent entries</h3>
          {entries.slice(0, 15).map(e => (
            <div key={e.id} className="bm-entry fade-in">
              <span className="bm-region-badge">{e.region}</span>
              <div className="bm-entry-content">
                <span className="bm-emotion">{e.emotion}</span>
                {e.note && <span className="bm-note">{e.note}</span>}
              </div>
              <span className="bm-date">
                {new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && !selectedRegion && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🫀</span>
          <p>Tap a body region above to log what you feel there.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Your body holds emotions — learning where helps you understand them.</p>
        </div>
      )}
    </div>
  );
}

export default BodyMapPage;
