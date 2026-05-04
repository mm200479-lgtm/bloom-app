import React, { useState, useEffect } from 'react';
import { Moon, Plus, AlertTriangle, Eye } from 'lucide-react';
import { getNightmares, addNightmare } from '../utils/storage';
import './NightmarePage.css';

const GROUNDING_STEPS = [
  'Look around and name 5 things you can see.',
  'Touch 4 different textures near you.',
  'Listen for 3 sounds you can hear.',
  'Notice 2 things you can smell.',
  'Name 1 thing you can taste.',
  'You are safe. You are here. The nightmare is over. 💜',
];

function NightmarePage() {
  const [nightmares, setNightmares] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [recurring, setRecurring] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  useEffect(() => { setNightmares(getNightmares()); }, []);

  const handleSave = () => {
    if (!description.trim()) return;
    const updated = addNightmare({ description: description.trim(), intensity, recurring });
    setNightmares(updated);
    setDescription(''); setIntensity(3); setRecurring(false);
    setShowForm(false);
    setSaved(true);
    setShowGrounding(true);
    setGroundingStep(0);
    setTimeout(() => setSaved(false), 2000);
  };

  const recurringThemes = nightmares.filter(n => n.recurring);
  const avgIntensity = nightmares.length > 0
    ? (nightmares.reduce((sum, n) => sum + n.intensity, 0) / nightmares.length).toFixed(1)
    : null;

  return (
    <div className="nightmare-page">
      <header className="page-header">
        <h1>Nightmare Journal 🌙</h1>
        <p className="page-subtitle">Writing it down takes away some of its power</p>
      </header>

      {saved && <div className="nm-saved slide-up">✨ Nightmare logged. You're safe now.</div>}

      {showGrounding && (
        <div className="grounding-card card slide-up">
          <Eye size={18} color="var(--lavender-dark)" />
          <h3>Grounding exercise</h3>
          <p className="grounding-text">{GROUNDING_STEPS[groundingStep]}</p>
          <div className="grounding-progress">
            {GROUNDING_STEPS.map((_, i) => (
              <span key={i} className={`g-dot ${i <= groundingStep ? 'active' : ''}`} />
            ))}
          </div>
          {groundingStep < GROUNDING_STEPS.length - 1 ? (
            <button className="primary-btn" onClick={() => setGroundingStep(groundingStep + 1)}>Next</button>
          ) : (
            <button className="primary-btn" onClick={() => setShowGrounding(false)}>Done 💜</button>
          )}
        </div>
      )}

      {!showForm ? (
        <button className="primary-btn" onClick={() => setShowForm(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Log a nightmare
        </button>
      ) : (
        <div className="nm-form card slide-up">
          <h3 className="section-title">What happened?</h3>
          <textarea
            className="input-field"
            rows={4}
            placeholder="Describe the nightmare... you don't have to include every detail."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="nm-intensity">
            <span className="nm-label">Intensity</span>
            <div className="intensity-btns">
              {[1,2,3,4,5].map(v => (
                <button
                  key={v}
                  className={`int-btn ${intensity === v ? 'active' : ''}`}
                  onClick={() => setIntensity(v)}
                >{v}</button>
              ))}
            </div>
            <span className="nm-scale">mild → severe</span>
          </div>
          <label className="nm-recurring">
            <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
            <span>This is a recurring nightmare</span>
          </label>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button className="back-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {avgIntensity && (
        <div className="nm-stats card fade-in">
          <div className="stat">
            <span className="stat-num">{nightmares.length}</span>
            <span className="stat-label">logged</span>
          </div>
          <div className="stat">
            <span className="stat-num">{avgIntensity}</span>
            <span className="stat-label">avg intensity</span>
          </div>
          <div className="stat">
            <span className="stat-num">{recurringThemes.length}</span>
            <span className="stat-label">recurring</span>
          </div>
        </div>
      )}

      {recurringThemes.length > 0 && (
        <div className="nm-patterns">
          <h3 className="section-title"><AlertTriangle size={14} /> Recurring patterns</h3>
          {recurringThemes.slice(0, 5).map(n => (
            <div key={n.id} className="pattern-item">
              <span className="pattern-text">{n.description.substring(0, 80)}{n.description.length > 80 ? '...' : ''}</span>
              <span className="pattern-date">{new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
        </div>
      )}

      {nightmares.length > 0 && (
        <div className="nm-history">
          <h3 className="section-title">All entries</h3>
          {nightmares.map(n => (
            <div key={n.id} className="nm-entry fade-in">
              <div className="nm-entry-header">
                <Moon size={14} />
                <span className="nm-entry-date">
                  {new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <span className="nm-entry-intensity">Intensity: {n.intensity}/5</span>
                {n.recurring && <span className="nm-recurring-badge">recurring</span>}
              </div>
              <p className="nm-entry-text">{n.description}</p>
            </div>
          ))}
        </div>
      )}

      {nightmares.length === 0 && !showForm && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🌙</span>
          <p>No nightmares logged yet. That's a good thing.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>If you do have one, writing it down can help.</p>
        </div>
      )}
    </div>
  );
}

export default NightmarePage;
