import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shuffle, Tv, Film, Youtube, Music, Headphones, Star } from 'lucide-react';
import { getComfortMedia, saveComfortMedia } from '../utils/storage';
import './ComfortMediaPage.css';

const CATEGORIES = [
  { value: 'shows', label: 'Shows', emoji: '📺', icon: Tv },
  { value: 'movies', label: 'Movies', emoji: '🎬', icon: Film },
  { value: 'youtube', label: 'YouTube', emoji: '▶️', icon: Youtube },
  { value: 'songs', label: 'Songs', emoji: '🎵', icon: Music },
  { value: 'podcasts', label: 'Podcasts', emoji: '🎧', icon: Headphones },
  { value: 'other', label: 'Other', emoji: '💫', icon: Star },
];

function ComfortMediaPage({ onBack }) {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('shows');
  const [randomPick, setRandomPick] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { setItems(getComfortMedia()); }, []);

  const handleAdd = () => {
    if (!title.trim()) return;
    const updated = [{ id: Date.now(), title: title.trim(), note: note.trim(), category, timestamp: new Date().toISOString() }, ...items];
    saveComfortMedia(updated);
    setItems(updated);
    setTitle(''); setNote('');
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    const updated = items.filter(i => i.id !== id);
    saveComfortMedia(updated);
    setItems(updated);
  };

  const showRandom = () => {
    if (items.length === 0) return;
    setRandomPick(items[Math.floor(Math.random() * items.length)]);
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = filtered.filter(i => i.category === cat.value);
    return acc;
  }, {});

  return (
    <div className="comfort-media-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Comfort Media 📺</h1>
        <p className="page-subtitle">Your go-to shows, songs, and comfort picks</p>
      </header>

      {items.length > 0 && (
        <button className="random-affirmation-btn" onClick={showRandom}>
          <Shuffle size={16} /> Random comfort pick
        </button>
      )}

      {randomPick && (
        <div className="random-affirmation-card card slide-up">
          <span style={{ fontSize: 28 }}>{CATEGORIES.find(c => c.value === randomPick.category)?.emoji}</span>
          <p className="random-affirmation-text">{randomPick.title}</p>
          {randomPick.note && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{randomPick.note}</p>}
        </div>
      )}

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Add comfort media
        </button>
      ) : (
        <div className="comfort-form card slide-up">
          <input className="input-field" placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} />
          <input className="input-field" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
          <div className="comfort-categories">
            {CATEGORIES.map(c => (
              <button key={c.value} className={`cat-btn ${category === c.value ? 'active' : ''}`} onClick={() => setCategory(c.value)}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>Save</button>
            <button className="back-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="comfort-filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.value} className={`filter-btn ${filter === c.value ? 'active' : ''}`} onClick={() => setFilter(c.value)}>
            {c.emoji}
          </button>
        ))}
      </div>

      {filter === 'all' ? (
        CATEGORIES.map(cat => grouped[cat.value].length > 0 && (
          <div key={cat.value} className="comfort-group">
            <h3 className="section-title">{cat.emoji} {cat.label}</h3>
            {grouped[cat.value].map((item, i) => (
              <div key={item.id} className="comfort-item fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="comfort-content">
                  <span className="comfort-title">{item.title}</span>
                  {item.note && <span className="comfort-note">{item.note}</span>}
                </div>
                <button className="delete-btn" onClick={() => handleDelete(item.id)} aria-label="Delete"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        ))
      ) : (
        filtered.map((item, i) => (
          <div key={item.id} className="comfort-item fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
            <div className="comfort-content">
              <span className="comfort-title">{item.title}</span>
              {item.note && <span className="comfort-note">{item.note}</span>}
            </div>
            <button className="delete-btn" onClick={() => handleDelete(item.id)} aria-label="Delete"><Trash2 size={12} /></button>
          </div>
        ))
      )}

      {items.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>📺</span>
          <p>Add the shows, songs, and media that make you feel safe.</p>
        </div>
      )}
    </div>
  );
}

export default ComfortMediaPage;
