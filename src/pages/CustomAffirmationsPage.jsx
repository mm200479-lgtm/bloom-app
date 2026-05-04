import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shuffle, Sparkles } from 'lucide-react';
import { getCustomAffirmations, saveCustomAffirmations } from '../utils/storage';
import './CustomAffirmationsPage.css';

const BUILT_IN = [
  "I am enough, exactly as I am.",
  "My feelings are valid.",
  "I deserve kindness — especially from myself.",
  "I am growing at my own pace.",
  "It's okay to take up space.",
  "I am worthy of love and belonging.",
  "My best is enough.",
  "I choose to be gentle with myself today.",
  "I am more than my worst moments.",
  "Every day is a fresh start.",
  "I am allowed to say no.",
  "My story matters.",
  "I am brave for showing up.",
  "I trust myself to handle what comes.",
  "I am learning, and that's okay.",
];

function CustomAffirmationsPage({ onBack }) {
  const [custom, setCustom] = useState([]);
  const [newText, setNewText] = useState('');
  const [random, setRandom] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { setCustom(getCustomAffirmations()); }, []);

  const allAffirmations = [...custom.map(c => c.text), ...BUILT_IN];

  const handleAdd = () => {
    if (!newText.trim()) return;
    const updated = [{ id: Date.now(), text: newText.trim(), timestamp: new Date().toISOString() }, ...custom];
    saveCustomAffirmations(updated);
    setCustom(updated);
    setNewText('');
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    const updated = custom.filter(c => c.id !== id);
    saveCustomAffirmations(updated);
    setCustom(updated);
  };

  const showRandom = () => {
    const r = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
    setRandom(r);
  };

  return (
    <div className="affirmations-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Affirmations ✨</h1>
        <p className="page-subtitle">Words of kindness you can always come back to</p>
      </header>

      <button className="random-affirmation-btn" onClick={showRandom}>
        <Shuffle size={16} /> Show me an affirmation
      </button>

      {random && (
        <div className="random-affirmation-card card slide-up">
          <Sparkles size={20} color="var(--lavender-dark)" />
          <p className="random-affirmation-text">"{random}"</p>
        </div>
      )}

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Add your own affirmation
        </button>
      ) : (
        <div className="affirmation-form card slide-up">
          <input className="input-field" placeholder="Write something kind to yourself..." value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>Save</button>
            <button className="back-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {custom.length > 0 && (
        <div className="affirmation-section">
          <h3 className="section-title">Your affirmations ({custom.length})</h3>
          {custom.map((a, i) => (
            <div key={a.id} className="affirmation-item fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
              <span className="affirmation-text">💜 {a.text}</span>
              <button className="delete-btn" onClick={() => handleDelete(a.id)} aria-label="Delete"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}

      <div className="affirmation-section">
        <h3 className="section-title">Built-in affirmations ({BUILT_IN.length})</h3>
        {BUILT_IN.map((a, i) => (
          <div key={i} className="affirmation-item builtin fade-in" style={{ animationDelay: `${i * 0.02}s` }}>
            <span className="affirmation-text">🌸 {a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomAffirmationsPage;
