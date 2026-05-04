import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shuffle, Gift } from 'lucide-react';
import { getRewardMenu, saveRewardMenu } from '../utils/storage';
import './RewardMenuPage.css';

const CATEGORIES = [
  { value: 'free', label: 'Free', emoji: '🆓' },
  { value: 'low-cost', label: 'Low-cost', emoji: '💰' },
  { value: 'treat', label: 'Treat yourself', emoji: '🎁' },
];

function RewardMenuPage({ onBack }) {
  const [rewards, setRewards] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('free');
  const [randomReward, setRandomReward] = useState(null);

  useEffect(() => { setRewards(getRewardMenu()); }, []);

  const handleAdd = () => {
    if (!text.trim()) return;
    const updated = [...rewards, { id: Date.now(), text: text.trim(), category }];
    saveRewardMenu(updated);
    setRewards(updated);
    setText('');
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    const updated = rewards.filter(r => r.id !== id);
    saveRewardMenu(updated);
    setRewards(updated);
  };

  const showRandom = () => {
    if (rewards.length === 0) return;
    const r = rewards[Math.floor(Math.random() * rewards.length)];
    setRandomReward(r);
  };

  return (
    <div className="reward-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Reward Menu 🎁</h1>
        <p className="page-subtitle">You deserve good things — build your reward list</p>
      </header>

      {rewards.length > 0 && (
        <button className="random-reward-btn" onClick={showRandom}>
          <Shuffle size={16} /> Pick a random reward
        </button>
      )}

      {randomReward && (
        <div className="random-reward-card card slide-up">
          <Gift size={24} color="var(--lavender-dark)" />
          <p className="random-reward-text">{randomReward.text}</p>
          <span className="random-reward-cat">
            {CATEGORIES.find(c => c.value === randomReward.category)?.emoji}{' '}
            {CATEGORIES.find(c => c.value === randomReward.category)?.label}
          </span>
        </div>
      )}

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Add a reward
        </button>
      ) : (
        <div className="reward-form card slide-up">
          <input className="input-field" placeholder="Something that feels good..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <div className="reward-categories">
            {CATEGORIES.map(c => (
              <button key={c.value} className={`rcat-btn ${category === c.value ? 'active' : ''}`} onClick={() => setCategory(c.value)}>
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

      {CATEGORIES.map(cat => {
        const catRewards = rewards.filter(r => r.category === cat.value);
        if (catRewards.length === 0) return null;
        return (
          <div key={cat.value} className="reward-section">
            <h3 className="section-title">{cat.emoji} {cat.label}</h3>
            {catRewards.map(r => (
              <div key={r.id} className="reward-item fade-in">
                <span className="reward-text">{r.text}</span>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        );
      })}

      {rewards.length === 0 && !showAdd && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🎁</span>
          <p>Build your reward menu — things that make you feel good.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>A warm drink, a favorite show, a walk outside...</p>
        </div>
      )}
    </div>
  );
}

export default RewardMenuPage;
