import React, { useState, useEffect } from 'react';
import { Eye, Ear, Hand, Wind, Coffee, Plus, Trash2 } from 'lucide-react';
import { getSensoryKit, saveSensoryKit } from '../utils/storage';
import './SensoryPage.css';

const SENSES = [
  {
    key: 'see', label: 'See', emoji: '👁️', icon: Eye,
    defaults: ['Look at nature photos', 'Watch a candle flame', 'Look at the sky', 'Watch a calming video'],
  },
  {
    key: 'hear', label: 'Hear', emoji: '👂', icon: Ear,
    defaults: ['Listen to rain sounds', 'Play calming music', 'Listen to birds', 'ASMR videos'],
  },
  {
    key: 'touch', label: 'Touch', emoji: '🤲', icon: Hand,
    defaults: ['Hold a soft blanket', 'Squeeze a stress ball', 'Pet an animal', 'Hold warm tea'],
  },
  {
    key: 'smell', label: 'Smell', emoji: '👃', icon: Wind,
    defaults: ['Light a candle', 'Smell essential oils', 'Fresh coffee', 'Flowers or herbs'],
  },
  {
    key: 'taste', label: 'Taste', emoji: '👅', icon: Coffee,
    defaults: ['Sip herbal tea', 'Eat a mint', 'Sour candy', 'Dark chocolate'],
  },
];

function SensoryPage({ onBack }) {
  const [kit, setKit] = useState([]);
  const [addingTo, setAddingTo] = useState(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    let saved = getSensoryKit();
    if (saved.length === 0) {
      saved = SENSES.map(s => ({
        sense: s.key,
        items: s.defaults.map((d, i) => ({ id: `${s.key}_${i}`, text: d, custom: false })),
      }));
      saveSensoryKit(saved);
    }
    setKit(saved);
  }, []);

  const handleAdd = (senseKey) => {
    if (!newItem.trim()) return;
    const updated = kit.map(k => {
      if (k.sense === senseKey) {
        return { ...k, items: [...k.items, { id: `custom_${Date.now()}`, text: newItem.trim(), custom: true }] };
      }
      return k;
    });
    saveSensoryKit(updated);
    setKit(updated);
    setNewItem('');
    setAddingTo(null);
  };

  const handleDelete = (senseKey, itemId) => {
    const updated = kit.map(k => {
      if (k.sense === senseKey) {
        return { ...k, items: k.items.filter(i => i.id !== itemId) };
      }
      return k;
    });
    saveSensoryKit(updated);
    setKit(updated);
  };

  return (
    <div className="sensory-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Sensory Kit 🧘</h1>
        <p className="page-subtitle">What helps ground you? Build your personal toolkit.</p>
      </header>

      <div className="sensory-sections">
        {SENSES.map(sense => {
          const senseKit = kit.find(k => k.sense === sense.key);
          const Icon = sense.icon;
          return (
            <div key={sense.key} className="sensory-section card fade-in">
              <div className="sensory-header">
                <span className="sensory-emoji">{sense.emoji}</span>
                <h3 className="section-title">{sense.label}</h3>
              </div>
              <div className="sensory-items">
                {senseKit?.items.map(item => (
                  <div key={item.id} className="sensory-item">
                    <span className="sensory-text">{item.text}</span>
                    {item.custom && (
                      <button className="delete-btn" onClick={() => handleDelete(sense.key, item.id)}>
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {addingTo === sense.key ? (
                <div className="add-sensory-form">
                  <input
                    className="input-field"
                    placeholder={`Add a ${sense.label.toLowerCase()} item...`}
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd(sense.key)}
                  />
                  <div className="form-actions">
                    <button className="primary-btn" onClick={() => handleAdd(sense.key)}>Add</button>
                    <button className="back-btn" onClick={() => { setAddingTo(null); setNewItem(''); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="add-sensory-btn" onClick={() => setAddingTo(sense.key)}>
                  <Plus size={12} /> Add your own
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="sensory-footer">
        💡 When you're overwhelmed, engaging your senses brings you back to the present moment.
      </p>
    </div>
  );
}

export default SensoryPage;
