import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getTriggers, addTrigger, deleteTrigger } from '../utils/storage';
import './TriggerPage.css';

const CATEGORIES = [
  { id: 'anxiety', label: '😰 Anxiety', color: 'var(--sky)' },
  { id: 'ptsd', label: '⚡ PTSD/Flashback', color: 'var(--blush)' },
  { id: 'depression', label: '😔 Depression', color: 'var(--lavender)' },
  { id: 'overwhelm', label: '🌊 Overwhelm', color: 'var(--sage)' },
  { id: 'anger', label: '😤 Anger', color: '#e8c0a0' },
  { id: 'other', label: '📝 Other', color: 'var(--cream)' },
];

const INTENSITY = [
  { level: 1, label: 'Mild', emoji: '🟢' },
  { level: 2, label: 'Moderate', emoji: '🟡' },
  { level: 3, label: 'Strong', emoji: '🟠' },
  { level: 4, label: 'Severe', emoji: '🔴' },
];

function TriggerPage() {
  const [triggers, setTriggers] = useState([]);
  const [adding, setAdding] = useState(false);
  const [category, setCategory] = useState('');
  const [intensity, setIntensity] = useState(0);
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const [coped, setCoped] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { setTriggers(getTriggers()); }, []);

  const handleSave = () => {
    if (!category || !intensity || !what.trim()) return;
    const newTriggers = addTrigger({ category, intensity, what: what.trim(), where: where.trim(), coped: coped.trim() });
    setTriggers(newTriggers);
    setAdding(false);
    setCategory('');
    setIntensity(0);
    setWhat('');
    setWhere('');
    setCoped('');
  };

  const handleDelete = (id) => {
    setTriggers(deleteTrigger(id));
  };

  // Pattern analysis
  const topCategories = triggers.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="trigger-page">
      <header className="page-header">
        <h1>Trigger Log</h1>
        <p className="page-subtitle">Track patterns to share with your therapist 📋</p>
      </header>

      <div className="trigger-privacy">
        🔒 This is completely private. Only you can see this.
      </div>

      {!adding ? (
        <button className="primary-btn" onClick={() => setAdding(true)} style={{ marginBottom: 20 }}>
          <Plus size={16} /> Log a trigger
        </button>
      ) : (
        <div className="trigger-form card slide-up">
          <h3>What happened?</h3>

          <label className="form-label">Type</label>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`cat-btn ${category === c.id ? 'active' : ''}`}
                style={category === c.id ? { background: c.color } : {}}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className="form-label">How intense? (1-4)</label>
          <div className="intensity-row">
            {INTENSITY.map(i => (
              <button
                key={i.level}
                className={`intensity-btn ${intensity === i.level ? 'active' : ''}`}
                onClick={() => setIntensity(i.level)}
              >
                {i.emoji} {i.label}
              </button>
            ))}
          </div>

          <label className="form-label" htmlFor="trigger-what">What triggered it?</label>
          <textarea
            id="trigger-what"
            className="input-field"
            placeholder="What happened or what were you thinking about?"
            value={what}
            onChange={e => setWhat(e.target.value)}
            rows={2}
          />

          <label className="form-label" htmlFor="trigger-where">Where were you? (optional)</label>
          <input
            id="trigger-where"
            className="input-field"
            placeholder="e.g., School, home, online..."
            value={where}
            onChange={e => setWhere(e.target.value)}
          />

          <label className="form-label" htmlFor="trigger-coped">How did you cope? (optional)</label>
          <textarea
            id="trigger-coped"
            className="input-field"
            placeholder="What did you do to feel better?"
            value={coped}
            onChange={e => setCoped(e.target.value)}
            rows={2}
          />

          <div className="form-actions">
            <button className="primary-btn" onClick={handleSave}>Save entry</button>
            <button className="back-btn" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {Object.keys(topCategories).length > 0 && (
        <div className="trigger-patterns card fade-in">
          <h3 className="section-title">Patterns</h3>
          <div className="pattern-bars">
            {Object.entries(topCategories).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
              const catInfo = CATEGORIES.find(c => c.id === cat);
              return (
                <div key={cat} className="pattern-row">
                  <span className="pattern-label">{catInfo?.label || cat}</span>
                  <div className="pattern-bar-bg">
                    <div
                      className="pattern-bar-fill"
                      style={{ width: `${(count / triggers.length) * 100}%`, background: catInfo?.color }}
                    />
                  </div>
                  <span className="pattern-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {triggers.length > 0 && (
        <div className="trigger-history">
          <h3 className="section-title">History</h3>
          {triggers.map(t => {
            const catInfo = CATEGORIES.find(c => c.id === t.category);
            const intInfo = INTENSITY.find(i => i.level === t.intensity);
            return (
              <div key={t.id} className="trigger-entry card fade-in">
                <button
                  className="trigger-entry-header"
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                  aria-expanded={expanded === t.id}
                >
                  <div className="trigger-entry-meta">
                    <span>{catInfo?.label}</span>
                    <span>{intInfo?.emoji}</span>
                  </div>
                  <div className="trigger-entry-right">
                    <span className="trigger-date">
                      {new Date(t.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    {expanded === t.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {expanded === t.id && (
                  <div className="trigger-entry-body slide-up">
                    <p><strong>Trigger:</strong> {t.what}</p>
                    {t.where && <p><strong>Where:</strong> {t.where}</p>}
                    {t.coped && <p><strong>Coped by:</strong> {t.coped}</p>}
                    <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TriggerPage;
