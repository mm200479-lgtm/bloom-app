import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { getMoods, addMood, updateStreaks } from '../utils/storage';
import './MoodPage.css';

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 5, color: '#a0e8c8' },
  { emoji: '😌', label: 'Calm', value: 4, color: '#b8d4c8' },
  { emoji: '😐', label: 'Okay', value: 3, color: '#d0e4f5' },
  { emoji: '😔', label: 'Sad', value: 2, color: '#c8c0d8' },
  { emoji: '😰', label: 'Anxious', value: 2, color: '#e8d0a0' },
  { emoji: '😤', label: 'Frustrated', value: 2, color: '#e8b0a0' },
  { emoji: '😴', label: 'Tired', value: 2, color: '#d0d0e0' },
  { emoji: '🥺', label: 'Overwhelmed', value: 1, color: '#e8a0c8' },
  { emoji: '😶', label: 'Numb', value: 1, color: '#d0d0d0' },
  { emoji: '🌟', label: 'Proud', value: 5, color: '#e8d4a0' },
  { emoji: '💪', label: 'Strong', value: 4, color: '#a0c8e8' },
  { emoji: '🫂', label: 'Need a hug', value: 1, color: '#f0c8d8' },
];

const FOLLOW_UPS = [
  "What's on your mind?",
  "Want to share more about how you're feeling?",
  "Anything specific going on?",
  "What would help right now?",
];

function MoodPage() {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMoods(getMoods());
  }, []);

  const handleSave = () => {
    if (!selectedMood) return;
    const newMoods = addMood({
      emoji: selectedMood.emoji,
      label: selectedMood.label,
      value: selectedMood.value,
      note: note.trim(),
    });
    updateStreaks();
    setMoods(newMoods);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelectedMood(null);
      setNote('');
    }, 2500);
  };

  const followUp = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];

  const todaysMoods = moods.filter(m =>
    new Date(m.timestamp).toDateString() === new Date().toDateString()
  );

  const last7Days = moods.filter(m => {
    const diff = Date.now() - new Date(m.timestamp).getTime();
    return diff < 7 * 86400000;
  });

  return (
    <div className="mood-page">
      <header className="page-header">
        <h1>How are you feeling?</h1>
        <p className="page-subtitle">No wrong answers here 💜</p>
      </header>

      {saved ? (
        <div className="mood-saved slide-up">
          <span className="saved-emoji">✨</span>
          <h2>Noted!</h2>
          <p>Thanks for checking in with yourself. That takes courage.</p>
        </div>
      ) : (
        <>
          <div className="mood-grid fade-in">
            {MOODS.map(mood => (
              <button
                key={mood.label}
                className={`mood-option ${selectedMood?.label === mood.label ? 'selected' : ''}`}
                style={{
                  background: selectedMood?.label === mood.label ? mood.color : 'var(--cream)',
                  borderColor: selectedMood?.label === mood.label ? mood.color : 'transparent',
                }}
                onClick={() => setSelectedMood(mood)}
                aria-label={`Feeling ${mood.label}`}
                aria-pressed={selectedMood?.label === mood.label}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mood-note-section slide-up">
              <label htmlFor="mood-note" className="note-label">{followUp}</label>
              <textarea
                id="mood-note"
                className="mood-note-input"
                placeholder="Optional — write as much or as little as you want..."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
              />
              <button className="save-mood-btn" onClick={handleSave}>
                Save check-in {selectedMood.emoji}
              </button>
            </div>
          )}
        </>
      )}

      <div className="mood-history-toggle">
        <button
          className="toggle-history-btn"
          onClick={() => setShowHistory(!showHistory)}
          aria-expanded={showHistory}
        >
          <Calendar size={16} />
          {showHistory ? 'Hide' : 'Show'} recent check-ins
        </button>
      </div>

      {showHistory && (
        <div className="mood-history fade-in">
          {moods.length === 0 ? (
            <p className="empty-state">No check-ins yet. You'll see your history here!</p>
          ) : (
            <div className="history-list">
              {moods.slice(0, 20).map(m => (
                <div key={m.id} className="history-item">
                  <span className="history-emoji">{m.emoji}</span>
                  <div className="history-details">
                    <span className="history-label">{m.label}</span>
                    {m.note && <p className="history-note">{m.note}</p>}
                  </div>
                  <span className="history-time">
                    {new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    {' '}
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {last7Days.length >= 3 && (
        <div className="mood-insight fade-in">
          <TrendingUp size={16} color="var(--sage-dark)" />
          <p>
            You've checked in {last7Days.length} times this week.
            {todaysMoods.length > 0 && ` Today you felt ${todaysMoods.map(m => m.label.toLowerCase()).join(', ')}.`}
            {' '}Keep it up! 🌱
          </p>
        </div>
      )}
    </div>
  );
}

export default MoodPage;
