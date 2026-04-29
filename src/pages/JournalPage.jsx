import React, { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp, Shuffle } from 'lucide-react';
import { getJournalEntries, addJournalEntry, deleteJournalEntry } from '../utils/storage';
import './JournalPage.css';

const PROMPTS = [
  "What's one thing that went okay today?",
  "What's taking up the most space in your head right now?",
  "If your feelings were weather, what would it be?",
  "What's something small that made you smile recently?",
  "What would you tell your best friend if they felt like you do?",
  "What's one thing you're grateful for, even if it's tiny?",
  "What do you need to let go of today?",
  "Describe your safe place in detail.",
  "What's a boundary you're proud of setting?",
  "What would make tomorrow a little easier?",
  "Write a letter to your future self.",
  "What's something you did today that took courage?",
  "If you could change one thing about today, what would it be?",
  "What's a song that matches your mood right now?",
  "What are 3 things you can see, hear, and feel right now?",
  "What's something you're looking forward to?",
  "Write about a time you surprised yourself.",
  "What does 'safe' feel like to you?",
];

const ENTRY_TYPES = [
  { id: 'free', label: '✍️ Free write', desc: 'Just let it flow' },
  { id: 'prompt', label: '💭 Use a prompt', desc: 'Need a starting point?' },
  { id: 'gratitude', label: '🌸 Gratitude', desc: '3 good things' },
  { id: 'worry', label: '📦 Worry dump', desc: 'Get it out of your head' },
];

function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [mode, setMode] = useState(null);
  const [content, setContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [expandedEntry, setExpandedEntry] = useState(null);

  useEffect(() => {
    setEntries(getJournalEntries());
    shufflePrompt();
  }, []);

  const shufflePrompt = () => {
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const handleSave = () => {
    let text = '';
    let type = mode;

    if (mode === 'gratitude') {
      const filled = gratitudes.filter(g => g.trim());
      if (filled.length === 0) return;
      text = filled.map((g, i) => `${i + 1}. ${g}`).join('\n');
    } else if (mode === 'prompt') {
      if (!content.trim()) return;
      text = `Prompt: ${currentPrompt}\n\n${content.trim()}`;
    } else {
      if (!content.trim()) return;
      text = content.trim();
    }

    const newEntries = addJournalEntry({ type, text });
    setEntries(newEntries);
    setContent('');
    setGratitudes(['', '', '']);
    setMode(null);
  };

  const handleDelete = (id) => {
    const updated = deleteJournalEntry(id);
    setEntries(updated);
  };

  return (
    <div className="journal-page">
      <header className="page-header">
        <h1>Journal</h1>
        <p className="page-subtitle">Your private space to think and feel 📝</p>
      </header>

      {!mode ? (
        <div className="entry-types fade-in">
          <h3 className="section-title">What kind of writing?</h3>
          {ENTRY_TYPES.map(type => (
            <button
              key={type.id}
              className="entry-type-btn"
              onClick={() => setMode(type.id)}
            >
              <span className="type-label">{type.label}</span>
              <span className="type-desc">{type.desc}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="writing-area slide-up">
          <button className="back-btn" onClick={() => setMode(null)}>
            ← Back to options
          </button>

          {mode === 'prompt' && (
            <div className="prompt-card">
              <p className="prompt-text">{currentPrompt}</p>
              <button className="shuffle-btn" onClick={shufflePrompt} aria-label="Get new prompt">
                <Shuffle size={14} /> New prompt
              </button>
            </div>
          )}

          {mode === 'worry' && (
            <div className="worry-intro">
              <p>📦 Dump your worries here. Getting them out of your head and onto the page can help them feel smaller.</p>
            </div>
          )}

          {mode === 'gratitude' ? (
            <div className="gratitude-inputs">
              <p className="gratitude-intro">What are 3 things you're grateful for? They can be tiny! 🌸</p>
              {gratitudes.map((g, i) => (
                <div key={i} className="gratitude-row">
                  <span className="gratitude-num">{i + 1}.</span>
                  <input
                    type="text"
                    className="gratitude-input"
                    placeholder={i === 0 ? "e.g., My cozy blanket" : i === 1 ? "e.g., A good song" : "e.g., My pet"}
                    value={g}
                    onChange={e => {
                      const updated = [...gratitudes];
                      updated[i] = e.target.value;
                      setGratitudes(updated);
                    }}
                    aria-label={`Gratitude item ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <textarea
              className="journal-textarea"
              placeholder={
                mode === 'worry' ? "What's weighing on you? Let it all out..." :
                mode === 'prompt' ? "Start writing..." :
                "What's on your mind?"
              }
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              autoFocus
              aria-label="Journal entry"
            />
          )}

          <button className="save-entry-btn" onClick={handleSave}>
            Save entry ✨
          </button>
        </div>
      )}

      {entries.length > 0 && (
        <div className="entries-section">
          <h3 className="section-title">Past entries</h3>
          <div className="entries-list">
            {entries.map(entry => (
              <div key={entry.id} className="entry-card fade-in">
                <button
                  className="entry-header"
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  aria-expanded={expandedEntry === entry.id}
                >
                  <div className="entry-meta">
                    <span className="entry-type-badge">
                      {entry.type === 'gratitude' ? '🌸' : entry.type === 'worry' ? '📦' : entry.type === 'prompt' ? '💭' : '✍️'}
                    </span>
                    <span className="entry-date">
                      {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {expandedEntry === entry.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedEntry === entry.id && (
                  <div className="entry-body slide-up">
                    <p className="entry-text">{entry.text}</p>
                    <button
                      className="delete-entry-btn"
                      onClick={() => handleDelete(entry.id)}
                      aria-label="Delete entry"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JournalPage;
