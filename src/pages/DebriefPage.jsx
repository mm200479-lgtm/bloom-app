import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { getDebriefs, addDebrief } from '../utils/storage';
import './DebriefPage.css';

const QUESTIONS = [
  { key: 'whatHappened', label: 'What happened?', placeholder: 'Describe the situation...' },
  { key: 'whatFelt', label: 'What did I feel?', placeholder: 'What emotions came up?' },
  { key: 'whatHelped', label: 'What helped?', placeholder: 'What coping skills or actions helped, even a little?' },
  { key: 'whatDidntHelp', label: "What didn't help?", placeholder: 'What made things worse or didn\'t work?' },
  { key: 'nextTime', label: 'What will I try next time?', placeholder: 'What could I do differently?' },
];

function DebriefPage() {
  const [debriefs, setDebriefs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [openDebrief, setOpenDebrief] = useState(null);

  useEffect(() => { setDebriefs(getDebriefs()); }, []);

  const handleSave = () => {
    const hasContent = QUESTIONS.some(q => form[q.key]?.trim());
    if (!hasContent) return;
    const updated = addDebrief(form);
    setDebriefs(updated);
    setForm({});
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="debrief-page">
      <header className="page-header">
        <h1>After-Crisis Debrief 🛡️</h1>
        <p className="page-subtitle">Processing what happened helps you heal and prepare</p>
      </header>

      {saved && <div className="debrief-saved slide-up">✨ Debrief saved. You're learning from this. 💪</div>}

      <p className="debrief-intro">
        After a tough moment, it helps to look back with compassion — not judgment. These questions guide you through it.
      </p>

      {!showForm ? (
        <button className="primary-btn" onClick={() => setShowForm(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Start a debrief
        </button>
      ) : (
        <div className="debrief-form card slide-up">
          {QUESTIONS.map((q, i) => (
            <div key={q.key} className="debrief-question">
              <label className="question-label">{i + 1}. {q.label}</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder={q.placeholder}
                value={form[q.key] || ''}
                onChange={e => setForm({ ...form, [q.key]: e.target.value })}
              />
            </div>
          ))}
          <div className="form-actions">
            <button className="primary-btn" onClick={handleSave}>Save debrief</button>
            <button className="back-btn" onClick={() => { setShowForm(false); setForm({}); }}>Cancel</button>
          </div>
        </div>
      )}

      {debriefs.length > 0 && (
        <div className="debrief-history">
          <h3 className="section-title">Past debriefs ({debriefs.length})</h3>
          {debriefs.map(d => (
            <div key={d.id} className="debrief-entry card fade-in">
              <button className="debrief-entry-header" onClick={() => setOpenDebrief(openDebrief === d.id ? null : d.id)}>
                <Shield size={14} />
                <span className="debrief-date">
                  {new Date(d.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {d.whatHappened && <span className="debrief-preview">{d.whatHappened.substring(0, 40)}...</span>}
                {openDebrief === d.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openDebrief === d.id && (
                <div className="debrief-detail slide-up">
                  {QUESTIONS.map(q => d[q.key] && (
                    <div key={q.key} className="detail-field">
                      <span className="detail-label">{q.label}</span>
                      <p className="detail-text">{d[q.key]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {debriefs.length === 0 && !showForm && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🛡️</span>
          <p>No debriefs yet — and that's okay.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>This is here for you when you need it.</p>
        </div>
      )}
    </div>
  );
}

export default DebriefPage;
