import React, { useState, useEffect } from 'react';
import { Plus, X, Phone, Heart, MapPin, AlertTriangle, Star } from 'lucide-react';
import { getSafetyPlan, saveSafetyPlan } from '../utils/storage';
import './SafetyPage.css';

const SECTIONS = [
  {
    key: 'warningSignals',
    title: '⚠️ My Warning Signs',
    desc: 'How do I know when things are getting hard?',
    placeholder: 'e.g., Can\'t sleep, snapping at people, feeling numb...',
    icon: AlertTriangle,
  },
  {
    key: 'calmingStrategies',
    title: '🧘 Things That Help Me Calm Down',
    desc: 'What works when I\'m overwhelmed?',
    placeholder: 'e.g., Box breathing, listening to music, going for a walk...',
    icon: Heart,
  },
  {
    key: 'safeSpaces',
    title: '🏡 My Safe Spaces',
    desc: 'Places where I feel safe and calm',
    placeholder: 'e.g., My room, the park, grandma\'s house...',
    icon: MapPin,
  },
  {
    key: 'safeContacts',
    title: '📱 People I Can Reach Out To',
    desc: 'Who can I talk to when I need help?',
    placeholder: 'e.g., Mom - 555-0123, Best friend Sarah...',
    icon: Phone,
  },
  {
    key: 'reasonsToKeepGoing',
    title: '🌟 Reasons to Keep Going',
    desc: 'What matters to me? What am I looking forward to?',
    placeholder: 'e.g., My pet, summer vacation, becoming an artist...',
    icon: Star,
  },
];

function SafetyPage() {
  const [plan, setPlan] = useState(getSafetyPlan());
  const [editingSection, setEditingSection] = useState(null);
  const [newItem, setNewItem] = useState('');

  const addItem = (key) => {
    if (!newItem.trim()) return;
    const updated = { ...plan, [key]: [...plan[key], newItem.trim()] };
    setPlan(updated);
    saveSafetyPlan(updated);
    setNewItem('');
  };

  const removeItem = (key, index) => {
    const updated = { ...plan, [key]: plan[key].filter((_, i) => i !== index) };
    setPlan(updated);
    saveSafetyPlan(updated);
  };

  return (
    <div className="safety-page">
      <header className="page-header">
        <h1>My Safety Plan</h1>
        <p className="page-subtitle">Your personal toolkit for tough moments 🛡️</p>
      </header>

      <div className="crisis-banner" role="alert">
        <div className="crisis-header">
          <Phone size={18} />
          <strong>If you're in crisis right now:</strong>
        </div>
        <div className="crisis-contacts">
          <a href="tel:988" className="crisis-link">
            📞 Call/Text 988 (Suicide & Crisis Lifeline)
          </a>
          <a href="sms:741741&body=HELLO" className="crisis-link">
            💬 Text HOME to 741741 (Crisis Text Line)
          </a>
          <a href="tel:911" className="crisis-link emergency">
            🚨 Call 911 for emergencies
          </a>
        </div>
        <p className="crisis-note">You are not alone. Help is available 24/7. 💜</p>
      </div>

      <div className="plan-sections">
        {SECTIONS.map(section => {
          const Icon = section.icon;
          const isEditing = editingSection === section.key;
          const items = plan[section.key] || [];

          return (
            <div key={section.key} className="plan-section fade-in">
              <div className="section-header">
                <div>
                  <h3 className="section-title">{section.title}</h3>
                  <p className="section-desc">{section.desc}</p>
                </div>
              </div>

              {items.length > 0 && (
                <ul className="plan-items">
                  {items.map((item, i) => (
                    <li key={i} className="plan-item">
                      <span>{item}</span>
                      {isEditing && (
                        <button
                          className="remove-item-btn"
                          onClick={() => removeItem(section.key, i)}
                          aria-label={`Remove "${item}"`}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {isEditing ? (
                <div className="add-item-row">
                  <input
                    type="text"
                    className="add-item-input"
                    placeholder={section.placeholder}
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addItem(section.key)}
                    autoFocus
                    aria-label={`Add to ${section.title}`}
                  />
                  <button className="add-item-btn" onClick={() => addItem(section.key)}>
                    <Plus size={16} />
                  </button>
                  <button
                    className="done-editing-btn"
                    onClick={() => { setEditingSection(null); setNewItem(''); }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  className="edit-section-btn"
                  onClick={() => setEditingSection(section.key)}
                >
                  <Plus size={14} /> {items.length === 0 ? 'Add items' : 'Edit'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="safety-footer">
        <p>💜 This plan is stored only on your device. No one else can see it.</p>
        <p>Update it anytime — it grows with you.</p>
      </div>
    </div>
  );
}

export default SafetyPage;
