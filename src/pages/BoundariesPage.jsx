import React, { useState, useEffect } from 'react';
import { Plus, Check, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { getBoundaries, saveBoundaries } from '../utils/storage';
import './BoundariesPage.css';

const CATEGORIES = [
  { value: 'physical', label: 'Physical', emoji: '🤚', templates: [
    'I need personal space when I\'m overwhelmed',
    'I don\'t have to hug anyone I don\'t want to',
    'My body, my rules',
  ]},
  { value: 'emotional', label: 'Emotional', emoji: '💜', templates: [
    'I don\'t have to take on other people\'s emotions',
    'It\'s okay to walk away from conversations that hurt me',
    'I can say "I\'m not ready to talk about that"',
  ]},
  { value: 'digital', label: 'Digital', emoji: '📱', templates: [
    'I don\'t have to respond to messages immediately',
    'I can mute or unfollow accounts that make me feel bad',
    'Screen-free time before bed is okay',
  ]},
  { value: 'time', label: 'Time', emoji: '⏰', templates: [
    'I can say no to plans when I need rest',
    'My time is valuable and I get to choose how to spend it',
    'It\'s okay to cancel if I\'m not feeling up to it',
  ]},
  { value: 'social', label: 'Social', emoji: '👥', templates: [
    'I don\'t have to be friends with everyone',
    'I can leave a situation that makes me uncomfortable',
    'I choose who I share my energy with',
  ]},
];

function BoundariesPage({ onBack }) {
  const [boundaries, setBoundaries] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [newText, setNewText] = useState('');
  const [addingTo, setAddingTo] = useState(null);

  useEffect(() => {
    const saved = getBoundaries();
    if (saved.length === 0) {
      const defaults = CATEGORIES.flatMap(cat =>
        cat.templates.map(t => ({ id: Date.now() + Math.random(), text: t, category: cat.value, communicated: false, custom: false }))
      );
      saveBoundaries(defaults);
      setBoundaries(defaults);
    } else {
      setBoundaries(saved);
    }
  }, []);

  const toggleCommunicated = (id) => {
    const updated = boundaries.map(b => b.id === id ? { ...b, communicated: !b.communicated } : b);
    saveBoundaries(updated);
    setBoundaries(updated);
  };

  const addCustom = (category) => {
    if (!newText.trim()) return;
    const updated = [...boundaries, { id: Date.now(), text: newText.trim(), category, communicated: false, custom: true }];
    saveBoundaries(updated);
    setBoundaries(updated);
    setNewText('');
    setAddingTo(null);
  };

  const communicated = boundaries.filter(b => b.communicated).length;

  return (
    <div className="boundaries-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Boundary Builder 🛡️</h1>
        <p className="page-subtitle">Healthy boundaries protect your peace</p>
      </header>

      <div className="boundary-stats card fade-in">
        <Shield size={18} color="var(--lavender-dark)" />
        <span>{communicated}/{boundaries.length} communicated</span>
      </div>

      {CATEGORIES.map(cat => {
        const catBoundaries = boundaries.filter(b => b.category === cat.value);
        const isExpanded = expanded === cat.value;
        return (
          <div key={cat.value} className="boundary-category card fade-in">
            <button className="boundary-cat-header" onClick={() => setExpanded(isExpanded ? null : cat.value)}>
              <span>{cat.emoji} {cat.label}</span>
              <span className="boundary-cat-count">{catBoundaries.filter(b => b.communicated).length}/{catBoundaries.length}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isExpanded && (
              <div className="boundary-list slide-up">
                {catBoundaries.map(b => (
                  <div key={b.id} className={`boundary-item ${b.communicated ? 'communicated' : ''}`}>
                    <button className="boundary-check" onClick={() => toggleCommunicated(b.id)}>
                      {b.communicated ? <Check size={14} /> : <span className="boundary-circle" />}
                    </button>
                    <span className="boundary-text">{b.text}</span>
                  </div>
                ))}
                {addingTo === cat.value ? (
                  <div className="boundary-add-form">
                    <input className="input-field" placeholder="Add a custom boundary..." value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustom(cat.value)} />
                    <div className="form-actions">
                      <button className="primary-btn" onClick={() => addCustom(cat.value)} style={{ padding: '6px 12px', fontSize: 12 }}>Add</button>
                      <button className="back-btn" onClick={() => setAddingTo(null)} style={{ padding: '6px 12px', fontSize: 12 }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="boundary-add-btn" onClick={() => setAddingTo(cat.value)}>
                    <Plus size={14} /> Add custom
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BoundariesPage;
