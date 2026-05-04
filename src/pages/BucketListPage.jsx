import React, { useState, useEffect } from 'react';
import { Plus, Check, Star, Filter } from 'lucide-react';
import { getBucketList, saveBucketList } from '../utils/storage';
import './BucketListPage.css';

const CATEGORIES = [
  { value: 'experiences', label: 'Experiences', emoji: '✨' },
  { value: 'places', label: 'Places', emoji: '🌍' },
  { value: 'skills', label: 'Skills', emoji: '🎯' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'other', label: 'Other', emoji: '💫' },
];

function BucketListPage({ onBack }) {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('experiences');
  const [filter, setFilter] = useState('all');

  useEffect(() => { setItems(getBucketList()); }, []);

  const handleAdd = () => {
    if (!text.trim()) return;
    const updated = [
      { id: Date.now(), text: text.trim(), category, done: false, timestamp: new Date().toISOString() },
      ...items
    ];
    saveBucketList(updated);
    setItems(updated);
    setText('');
    setShowAdd(false);
  };

  const toggleDone = (id) => {
    const updated = items.map(i => i.id === id ? { ...i, done: !i.done } : i);
    saveBucketList(updated);
    setItems(updated);
  };

  const filtered = filter === 'all' ? items
    : filter === 'done' ? items.filter(i => i.done)
    : filter === 'todo' ? items.filter(i => !i.done)
    : items.filter(i => i.category === filter);

  const doneCount = items.filter(i => i.done).length;

  return (
    <div className="bucket-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Bucket List ⭐</h1>
        <p className="page-subtitle">Big dreams and small ones — they all count</p>
      </header>

      {items.length > 0 && (
        <div className="bucket-stats card fade-in">
          <span className="bucket-stat">{doneCount}/{items.length} done</span>
          <div className="bucket-progress-bar">
            <div className="bucket-progress-fill" style={{ width: `${(doneCount / items.length) * 100}%` }} />
          </div>
        </div>
      )}

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)} style={{ width: '100%', marginBottom: 14 }}>
          <Plus size={16} /> Add to bucket list
        </button>
      ) : (
        <div className="bucket-form card slide-up">
          <input className="input-field" placeholder="Something you want to do, see, learn, or try..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <div className="bucket-categories">
            {CATEGORIES.map(c => (
              <button key={c.value} className={`cat-btn ${category === c.value ? 'active' : ''}`} onClick={() => setCategory(c.value)}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>Add</button>
            <button className="back-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="bucket-filters">
          {['all', 'todo', 'done', ...CATEGORIES.map(c => c.value)].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'todo' ? 'To do' : f === 'done' ? 'Done' : CATEGORIES.find(c => c.value === f)?.emoji + ' ' + CATEGORIES.find(c => c.value === f)?.label}
            </button>
          ))}
        </div>
      )}

      <div className="bucket-list">
        {filtered.map((item, i) => {
          const cat = CATEGORIES.find(c => c.value === item.category);
          return (
            <div key={item.id} className={`bucket-item fade-in ${item.done ? 'done' : ''}`} style={{ animationDelay: `${i * 0.03}s` }}>
              <button className="bucket-check" onClick={() => toggleDone(item.id)}>
                {item.done ? <Check size={16} /> : <Star size={16} />}
              </button>
              <div className="bucket-content">
                <span className="bucket-text">{item.text}</span>
                <span className="bucket-cat">{cat?.emoji} {cat?.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>⭐</span>
          <p>What do you want to do before you're done being a teenager?</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Big or small — add anything that excites you.</p>
        </div>
      )}
    </div>
  );
}

export default BucketListPage;
