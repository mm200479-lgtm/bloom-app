import React, { useState, useEffect } from 'react';
import { Shuffle, Plus, Clock, Trash2 } from 'lucide-react';
import { getDistractionBox, saveDistractionBox } from '../utils/storage';
import './DistractionPage.css';

const DEFAULT_BOX = {
  quick: [
    'Splash cold water on your face',
    'Name 5 things you can see',
    'Do 10 jumping jacks',
    'Smell something strong (coffee, soap)',
    'Hold an ice cube',
    'Count backwards from 100 by 7s',
  ],
  medium: [
    'Draw or doodle for 10 minutes',
    'Listen to 3 songs you love',
    'Take a walk around the block',
    'Organize one drawer or shelf',
    'Watch a funny video compilation',
    'Do a guided breathing exercise',
    'Write a brain dump',
  ],
  long: [
    'Watch an episode of a comfort show',
    'Take a long shower or bath',
    'Cook or bake something',
    'Go for a longer walk or bike ride',
    'Call or text a friend',
    'Do a creative project',
    'Clean your room while listening to music',
  ],
};

const CATEGORIES = [
  { key: 'quick', label: 'Quick (2 min)', emoji: '⚡', color: '#e8c88a' },
  { key: 'medium', label: 'Medium (5-15 min)', emoji: '🕐', color: '#8ac8a0' },
  { key: 'long', label: 'Long (30+ min)', emoji: '🌊', color: '#8ab8d8' },
];

function DistractionPage() {
  const [box, setBox] = useState({ quick: [], medium: [], long: [] });
  const [random, setRandom] = useState({});
  const [addingTo, setAddingTo] = useState(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    let b = getDistractionBox();
    if (b.quick.length === 0 && b.medium.length === 0 && b.long.length === 0) {
      b = DEFAULT_BOX;
      saveDistractionBox(b);
    }
    setBox(b);
  }, []);

  const showRandom = (key) => {
    const items = box[key];
    if (items.length === 0) return;
    setRandom({ ...random, [key]: items[Math.floor(Math.random() * items.length)] });
  };

  const handleAdd = (key) => {
    if (!newItem.trim()) return;
    const updated = { ...box, [key]: [...box[key], newItem.trim()] };
    saveDistractionBox(updated);
    setBox(updated);
    setNewItem('');
    setAddingTo(null);
  };

  const handleDelete = (key, index) => {
    const updated = { ...box, [key]: box[key].filter((_, i) => i !== index) };
    saveDistractionBox(updated);
    setBox(updated);
  };

  return (
    <div className="distraction-page">
      <header className="page-header">
        <h1>Distraction Box 📦</h1>
        <p className="page-subtitle">Healthy distractions for when you need a break</p>
      </header>

      {CATEGORIES.map(cat => (
        <div key={cat.key} className="distraction-section">
          <div className="distraction-header">
            <span className="distraction-emoji">{cat.emoji}</span>
            <h3 className="section-title">{cat.label}</h3>
            <button className="shuffle-btn" onClick={() => showRandom(cat.key)}>
              <Shuffle size={14} /> Random
            </button>
          </div>

          {random[cat.key] && (
            <div className="random-suggestion card slide-up" style={{ borderLeft: `4px solid ${cat.color}` }}>
              <p>💡 {random[cat.key]}</p>
            </div>
          )}

          <div className="distraction-items">
            {box[cat.key].map((item, i) => (
              <div key={i} className="distraction-item fade-in">
                <span className="item-text">{item}</span>
                <button className="delete-btn" onClick={() => handleDelete(cat.key, i)}><Trash2 size={10} /></button>
              </div>
            ))}
          </div>

          {addingTo === cat.key ? (
            <div className="add-distraction-form">
              <input className="input-field" placeholder="Add your own distraction..." value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd(cat.key)} />
              <div className="form-actions">
                <button className="primary-btn" onClick={() => handleAdd(cat.key)}>Add</button>
                <button className="back-btn" onClick={() => { setAddingTo(null); setNewItem(''); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="add-item-btn" onClick={() => setAddingTo(cat.key)}>
              <Plus size={12} /> Add your own
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default DistractionPage;
