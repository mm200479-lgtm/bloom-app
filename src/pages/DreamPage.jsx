import React, { useState, useEffect } from 'react';
import { Moon, Plus, Sparkles } from 'lucide-react';
import { getDreams, addDream } from '../utils/storage';
import './DreamPage.css';

const MOODS = ['😊 Happy', '😰 Anxious', '😢 Sad', '😡 Angry', '🤔 Confused', '😌 Peaceful', '😱 Scary', '🤩 Exciting', '😶 Neutral'];

function DreamPage({ onBack }) {
  const [dreams, setDreams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('');
  const [vivid, setVivid] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDreams(getDreams()); }, []);

  const handleSave = () => {
    if (!description.trim()) return;
    const updated = addDream({ description: description.trim(), mood, vivid });
    setDreams(updated);
    setDescription(''); setMood(''); setVivid(false);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="dream-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Dream Journal 🌙</h1>
        <p className="page-subtitle">Capture your dreams before they fade</p>
      </header>

      {saved && <div className="dream-saved slide-up">✨ Dream captured!</div>}

      {!showForm ? (
        <button className="primary-btn" onClick={() => setShowForm(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Log a dream
        </button>
      ) : (
        <div className="dream-form card slide-up">
          <h3 className="section-title">What did you dream?</h3>
          <textarea
            className="input-field"
            rows={5}
            placeholder="Describe your dream... write as much or as little as you remember."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <label className="dream-label">Mood of the dream</label>
          <div className="dream-moods">
            {MOODS.map(m => (
              <button key={m} className={`mood-btn ${mood === m ? 'active' : ''}`} onClick={() => setMood(m)}>
                {m}
              </button>
            ))}
          </div>
          <label className="dream-vivid">
            <input type="checkbox" checked={vivid} onChange={e => setVivid(e.target.checked)} />
            <Sparkles size={14} />
            <span>This was a vivid dream</span>
          </label>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleSave}>Save dream</button>
            <button className="back-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {dreams.length > 0 && (
        <div className="dream-list">
          <h3 className="section-title">Dream history ({dreams.length})</h3>
          {dreams.map(d => (
            <div key={d.id} className="dream-entry card fade-in">
              <div className="dream-entry-header">
                <Moon size={14} />
                <span className="dream-date">
                  {new Date(d.timestamp).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                {d.vivid && <span className="vivid-badge"><Sparkles size={10} /> Vivid</span>}
                {d.mood && <span className="dream-mood-badge">{d.mood}</span>}
              </div>
              <p className="dream-text">{d.description}</p>
            </div>
          ))}
        </div>
      )}

      {dreams.length === 0 && !showForm && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🌙</span>
          <p>No dreams logged yet.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Try writing them down right when you wake up — they fade fast!</p>
        </div>
      )}
    </div>
  );
}

export default DreamPage;
