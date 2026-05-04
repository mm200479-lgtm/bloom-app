import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { getIdentity, saveIdentity } from '../utils/storage';
import './IdentityPage.css';

const SUGGESTIONS = [
  "I am creative", "I am a good friend", "I am more than my diagnosis",
  "I am learning every day", "I am worthy of love", "I am brave",
  "I am enough", "I am growing", "I am kind", "I am resilient",
];

function IdentityPage({ onBack }) {
  const [statements, setStatements] = useState([]);
  const [newText, setNewText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => { setStatements(getIdentity()); }, []);

  const handleAdd = (text) => {
    const t = (text || newText).trim();
    if (!t) return;
    if (statements.some(s => s.text.toLowerCase() === t.toLowerCase())) return;
    const updated = [{ id: Date.now(), text: t, timestamp: new Date().toISOString() }, ...statements];
    saveIdentity(updated);
    setStatements(updated);
    setNewText('');
  };

  const handleDelete = (id) => {
    const updated = statements.filter(s => s.id !== id);
    saveIdentity(updated);
    setStatements(updated);
  };

  return (
    <div className="identity-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Identity Map 🪞</h1>
        <p className="page-subtitle">Who are you? Build your "I am..." statements.</p>
      </header>

      <div className="identity-input-section">
        <div className="identity-input-row">
          <span className="identity-prefix">I am</span>
          <input className="input-field" placeholder="creative, strong, learning..." value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <button className="win-add-btn" onClick={() => handleAdd()} aria-label="Add"><Plus size={18} /></button>
        </div>
      </div>

      <button className="identity-suggest-btn" onClick={() => setShowSuggestions(!showSuggestions)}>
        <Sparkles size={14} /> {showSuggestions ? 'Hide suggestions' : 'Need ideas?'}
      </button>

      {showSuggestions && (
        <div className="identity-suggestions slide-up">
          {SUGGESTIONS.filter(s => !statements.some(st => st.text.toLowerCase() === s.toLowerCase())).map(s => (
            <button key={s} className="suggestion-btn" onClick={() => handleAdd(s)}>{s}</button>
          ))}
        </div>
      )}

      {statements.length > 0 && (
        <div className="identity-display">
          <h3 className="section-title">My identity ({statements.length})</h3>
          <div className="identity-cloud">
            {statements.map((s, i) => (
              <div key={s.id} className="identity-statement fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="identity-text">{s.text}</span>
                <button className="delete-btn" onClick={() => handleDelete(s.id)} aria-label="Delete"><Trash2 size={10} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {statements.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🪞</span>
          <p>Start building your identity map.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>You are so much more than you think.</p>
        </div>
      )}
    </div>
  );
}

export default IdentityPage;
