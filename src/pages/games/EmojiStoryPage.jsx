import React, { useState } from 'react';
import { Shuffle, Save, Trash2 } from 'lucide-react';
import './EmojiStoryPage.css';

const EMOJI_POOL = [
  '🌸', '🌊', '🦋', '🌙', '⭐', '🌈', '🍀', '💜', '🔥', '🎵',
  '🏠', '🐱', '🐶', '🌻', '🍎', '📚', '✈️', '🎨', '🌍', '💡',
  '🎭', '🧸', '🕊️', '🌺', '🎪', '🏔️', '🌅', '🎈', '🦁', '🐝',
  '🌿', '🎶', '💫', '🧊', '🎯', '🪴', '🦜', '🐚', '🌾', '🎀',
];

function getRandomEmojis() {
  const shuffled = [...EMOJI_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function EmojiStoryPage({ onBack }) {
  const [emojis, setEmojis] = useState(getRandomEmojis);
  const [story, setStory] = useState('');
  const [stories, setStories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bloom-emoji-stories') || '[]');
    } catch { return []; }
  });
  const [saved, setSaved] = useState(false);

  const shuffleEmojis = () => {
    setEmojis(getRandomEmojis());
    setStory('');
  };

  const saveStory = () => {
    if (!story.trim()) return;
    const newStory = {
      id: Date.now(),
      emojis: [...emojis],
      text: story.trim(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    localStorage.setItem('bloom-emoji-stories', JSON.stringify(updated));
    setStory('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    shuffleEmojis();
  };

  const deleteStory = (id) => {
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    localStorage.setItem('bloom-emoji-stories', JSON.stringify(updated));
  };

  return (
    <div className="emojistory-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Emoji Story 📖</h1>
        <p className="page-subtitle">Write a tiny story using these emojis — let your imagination play</p>
      </header>

      <div className="es-emojis fade-in">
        {emojis.map((e, i) => (
          <span key={i} className="es-emoji">{e}</span>
        ))}
      </div>

      <button className="es-shuffle" onClick={shuffleEmojis}>
        <Shuffle size={14} /> New Emojis
      </button>

      <textarea
        className="es-textarea input-field"
        placeholder="Once upon a time..."
        value={story}
        onChange={e => setStory(e.target.value)}
        rows={4}
      />

      <button className="primary-btn es-save-btn" onClick={saveStory} disabled={!story.trim()}>
        <Save size={14} /> Save Story
      </button>

      {saved && <p className="es-saved fade-in">✨ Story saved!</p>}

      {stories.length > 0 && (
        <div className="es-stories">
          <h3 className="section-title">Your Stories ({stories.length})</h3>
          {stories.map((s, i) => (
            <div key={s.id} className="es-story-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="es-story-emojis">
                {s.emojis.map((e, j) => <span key={j}>{e}</span>)}
              </div>
              <p className="es-story-text">{s.text}</p>
              <div className="es-story-footer">
                <span className="es-story-date">{s.date}</span>
                <button className="delete-btn" onClick={() => deleteStory(s.id)} aria-label="Delete story">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {stories.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 36 }}>📝</span>
          <p>No stories yet — write your first one!</p>
        </div>
      )}
    </div>
  );
}

export default EmojiStoryPage;
