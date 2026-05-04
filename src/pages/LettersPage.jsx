import React, { useState, useEffect } from 'react';
import { Mail, Lock, Unlock, Trash2, Plus, ChevronLeft, Send, Heart } from 'lucide-react';
import { getLetters, addLetter, deleteLetter } from '../utils/storage';
import './LettersPage.css';

const OPEN_WHEN_CATEGORIES = [
  { key: 'sad', label: 'Sad', emoji: '😢' },
  { key: 'anxious', label: 'Anxious', emoji: '😰' },
  { key: 'angry', label: 'Angry', emoji: '😤' },
  { key: 'lonely', label: 'Lonely', emoji: '🥺' },
  { key: 'proud', label: 'Proud', emoji: '🥹' },
  { key: 'happy', label: 'Happy', emoji: '😊' },
  { key: 'scared', label: 'Scared', emoji: '😨' },
  { key: 'hopeless', label: 'Hopeless', emoji: '💔' },
];

const LETTER_TYPES = [
  { key: 'future', label: 'Letter to future me', emoji: '🔮', description: 'Write to who you\'ll become' },
  { key: 'past', label: 'Letter to past me', emoji: '🕰️', description: 'Tell your younger self what you know now' },
  { key: 'open-when', label: 'Open when...', emoji: '💌', description: 'Letters for specific feelings' },
];

function LettersPage() {
  const [letters, setLetters] = useState([]);
  const [view, setView] = useState('home'); // home, write, read
  const [letterType, setLetterType] = useState(null);
  const [readingLetter, setReadingLetter] = useState(null);

  // Form state
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [openWhenCategory, setOpenWhenCategory] = useState('sad');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLetters(getLetters()); }, []);

  const handleSave = () => {
    if (!content.trim()) return;
    const letter = {
      type: letterType,
      content: content.trim(),
      unlockDate: letterType === 'future' ? unlockDate : null,
      category: letterType === 'open-when' ? openWhenCategory : null,
    };
    const updated = addLetter(letter);
    setLetters(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setContent('');
      setUnlockDate('');
      setView('home');
      setLetterType(null);
    }, 2500);
  };

  const handleDelete = (id) => {
    setLetters(deleteLetter(id));
    setReadingLetter(null);
    setView('home');
  };

  const isLocked = (letter) => {
    if (letter.type !== 'future' || !letter.unlockDate) return false;
    return new Date(letter.unlockDate) > new Date();
  };

  const futureLetters = letters.filter(l => l.type === 'future');
  const pastLetters = letters.filter(l => l.type === 'past');
  const openWhenLetters = letters.filter(l => l.type === 'open-when');

  const openWhenByCategory = OPEN_WHEN_CATEGORIES.map(cat => ({
    ...cat,
    letters: openWhenLetters.filter(l => l.category === cat.key),
  })).filter(cat => cat.letters.length > 0);

  // Writing view
  if (view === 'write' && letterType) {
    const typeInfo = LETTER_TYPES.find(t => t.key === letterType);

    if (saved) {
      return (
        <div className="letters-page">
          <div className="letter-saved slide-up">
            <span>💌</span>
            <p>Letter saved with love</p>
          </div>
        </div>
      );
    }

    return (
      <div className="letters-page">
        <button className="back-btn" onClick={() => { setView('home'); setLetterType(null); }}>
          <ChevronLeft size={18} /> Back
        </button>

        <div className="write-header fade-in">
          <span className="write-emoji">{typeInfo?.emoji}</span>
          <h2 className="write-title">{typeInfo?.label}</h2>
          <p className="write-desc">{typeInfo?.description}</p>
        </div>

        {letterType === 'future' && (
          <div className="unlock-date-section fade-in">
            <label className="date-label">
              <Lock size={14} /> Open this letter on:
            </label>
            <input
              type="date"
              className="input-field"
              value={unlockDate}
              onChange={e => setUnlockDate(e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            />
          </div>
        )}

        {letterType === 'open-when' && (
          <div className="category-picker fade-in">
            <label className="category-label">Open when I feel:</label>
            <div className="category-grid">
              {OPEN_WHEN_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  className={`category-btn ${openWhenCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setOpenWhenCategory(cat.key)}
                >
                  <span>{cat.emoji}</span>
                  <span className="cat-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea
          className="input-field letter-textarea fade-in"
          placeholder={
            letterType === 'future' ? 'Dear future me...' :
            letterType === 'past' ? 'Dear younger me...' :
            'Dear me, when you\'re feeling this way...'
          }
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={10}
        />

        {content.trim() && (
          <button className="primary-btn letter-send-btn slide-up" onClick={handleSave}>
            <Send size={16} /> Seal & save letter
          </button>
        )}
      </div>
    );
  }

  // Reading view
  if (view === 'read' && readingLetter) {
    const locked = isLocked(readingLetter);

    return (
      <div className="letters-page">
        <button className="back-btn" onClick={() => { setView('home'); setReadingLetter(null); }}>
          <ChevronLeft size={18} /> Back
        </button>

        {locked ? (
          <div className="locked-letter fade-in">
            <Lock size={36} color="var(--text-light)" />
            <h3>This letter is sealed</h3>
            <p>It will unlock on {new Date(readingLetter.unlockDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <span className="locked-note">Good things are worth waiting for 💜</span>
          </div>
        ) : (
          <div className="open-letter fade-in">
            <div className="letter-paper">
              <span className="letter-date">
                Written {new Date(readingLetter.timestamp).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <p className="letter-content">{readingLetter.content}</p>
              <Heart size={16} color="var(--blush-dark)" className="letter-heart" />
            </div>
            <button className="delete-btn letter-delete" onClick={() => handleDelete(readingLetter.id)}>
              <Trash2 size={12} /> Delete letter
            </button>
          </div>
        )}
      </div>
    );
  }

  // Home view
  return (
    <div className="letters-page">
      <header className="page-header">
        <h1>Letters to Myself 💌</h1>
        <p className="page-subtitle">Words of kindness from you, for you</p>
      </header>

      <div className="letter-type-cards">
        {LETTER_TYPES.map(t => (
          <button
            key={t.key}
            className="letter-type-card card fade-in"
            onClick={() => { setLetterType(t.key); setView('write'); }}
          >
            <span className="type-emoji">{t.emoji}</span>
            <span className="type-name">{t.label}</span>
            <span className="type-desc">{t.description}</span>
            <span className="type-write"><Plus size={14} /> Write</span>
          </button>
        ))}
      </div>

      {futureLetters.length > 0 && (
        <div className="letters-section">
          <h3 className="section-title">🔮 Letters to future me ({futureLetters.length})</h3>
          <div className="letter-list">
            {futureLetters.map(l => {
              const locked = isLocked(l);
              return (
                <button
                  key={l.id}
                  className={`letter-item ${locked ? 'locked' : ''} fade-in`}
                  onClick={() => { setReadingLetter(l); setView('read'); }}
                >
                  {locked ? <Lock size={16} color="var(--text-light)" /> : <Unlock size={16} color="var(--sage-dark)" />}
                  <div className="letter-item-info">
                    <span className="letter-preview">
                      {locked ? '🔒 Sealed letter' : l.content.substring(0, 50) + (l.content.length > 50 ? '...' : '')}
                    </span>
                    <span className="letter-meta">
                      {locked
                        ? `Opens ${new Date(l.unlockDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
                        : `Written ${new Date(l.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
                      }
                    </span>
                  </div>
                  <Mail size={14} color="var(--text-light)" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pastLetters.length > 0 && (
        <div className="letters-section">
          <h3 className="section-title">🕰️ Letters to past me ({pastLetters.length})</h3>
          <div className="letter-list">
            {pastLetters.map(l => (
              <button
                key={l.id}
                className="letter-item fade-in"
                onClick={() => { setReadingLetter(l); setView('read'); }}
              >
                <Mail size={16} color="var(--lavender-dark)" />
                <div className="letter-item-info">
                  <span className="letter-preview">{l.content.substring(0, 50)}{l.content.length > 50 ? '...' : ''}</span>
                  <span className="letter-meta">
                    Written {new Date(l.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {openWhenByCategory.length > 0 && (
        <div className="letters-section">
          <h3 className="section-title">💌 Open when...</h3>
          <div className="open-when-grid">
            {openWhenByCategory.map(cat => (
              <div key={cat.key} className="open-when-category fade-in">
                <span className="ow-emoji">{cat.emoji}</span>
                <span className="ow-label">{cat.label}</span>
                <span className="ow-count">{cat.letters.length} letter{cat.letters.length > 1 ? 's' : ''}</span>
                <div className="ow-letters">
                  {cat.letters.map(l => (
                    <button
                      key={l.id}
                      className="ow-letter-btn"
                      onClick={() => { setReadingLetter(l); setView('read'); }}
                    >
                      Read →
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {letters.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>✉️</span>
          <p>No letters yet. Write one to yourself — you deserve kind words.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
            Future you will be grateful 💜
          </p>
        </div>
      )}
    </div>
  );
}

export default LettersPage;
