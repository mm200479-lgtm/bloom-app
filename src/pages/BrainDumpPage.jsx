import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Brain } from 'lucide-react';
import { getBrainDump, addBrainDump, deleteBrainDump } from '../utils/storage';
import './BrainDumpPage.css';

function BrainDumpPage({ onBack }) {
  const [dumps, setDumps] = useState([]);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDumps(getBrainDump()); }, []);

  const handleAdd = () => {
    if (!text.trim()) return;
    const updated = addBrainDump(text.trim());
    setDumps(updated);
    setText('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id) => {
    setDumps(deleteBrainDump(id));
  };

  return (
    <div className="braindump-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Brain Dump 🧠</h1>
        <p className="page-subtitle">Get it out of your head and onto the page</p>
      </header>

      <div className="dump-input-section">
        <textarea
          className="input-field dump-textarea"
          rows={4}
          placeholder="Whatever's on your mind — no filter, no judgment. Just dump it here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button className="primary-btn" onClick={handleAdd} disabled={!text.trim()}>
          <Brain size={16} /> Dump it
        </button>
        {saved && <span className="dump-saved fade-in">✨ Out of your head!</span>}
      </div>

      {dumps.length > 0 && (
        <div className="dump-list">
          <h3 className="section-title">Your brain dumps ({dumps.length})</h3>
          {dumps.map((d, i) => (
            <div key={d.id} className="dump-item fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="dump-content">
                <p className="dump-text">{d.text}</p>
                <span className="dump-date">
                  {new Date(d.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(d.id)} aria-label="Delete">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {dumps.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🧠</span>
          <p>Your brain is holding a lot. Let some of it go here.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Nobody sees this but you.</p>
        </div>
      )}
    </div>
  );
}

export default BrainDumpPage;
