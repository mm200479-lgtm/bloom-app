import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Heart, Phone, MessageCircle } from 'lucide-react';
import { getSafePeople, saveSafePeople } from '../utils/storage';
import './SafePeoplePage.css';

const SKILLS = ['🤗 Hugs', '🎮 Distraction', '👂 Listening', '💡 Advice', '😂 Humor', '🍕 Food', '🚗 Rides', '💪 Motivation'];
const AVATARS = ['💜', '💛', '💚', '🧡', '❤️', '💙', '🩷', '🩵', '🌸', '⭐', '🌻', '🦋'];

function SafePeoplePage({ onBack }) {
  const [people, setPeople] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('💜');
  const [relationship, setRelationship] = useState('');
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState('');

  useEffect(() => { setPeople(getSafePeople()); }, []);

  const toggleSkill = (s) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleAdd = () => {
    if (!name.trim()) return;
    const updated = [...people, { id: Date.now(), name: name.trim(), avatar, relationship: relationship.trim(), skills, contact: contact.trim() }];
    saveSafePeople(updated);
    setPeople(updated);
    setName(''); setAvatar('💜'); setRelationship(''); setSkills([]); setContact('');
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    const updated = people.filter(p => p.id !== id);
    saveSafePeople(updated);
    setPeople(updated);
  };

  return (
    <div className="safe-people-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Safe People 💜</h1>
        <p className="page-subtitle">The people who make you feel safe and seen</p>
      </header>

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Add a safe person
        </button>
      ) : (
        <div className="safe-form card slide-up">
          <div className="avatar-picker">
            {AVATARS.map(a => (
              <button key={a} className={`avatar-btn ${avatar === a ? 'selected' : ''}`} onClick={() => setAvatar(a)}>{a}</button>
            ))}
          </div>
          <input className="input-field" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input-field" placeholder="Relationship (e.g., best friend, mom)" value={relationship} onChange={e => setRelationship(e.target.value)} />
          <input className="input-field" placeholder="Phone or contact info (optional)" value={contact} onChange={e => setContact(e.target.value)} />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 8 }}>Good at:</p>
          <div className="skills-picker">
            {SKILLS.map(s => (
              <button key={s} className={`skill-btn ${skills.includes(s) ? 'active' : ''}`} onClick={() => toggleSkill(s)}>{s}</button>
            ))}
          </div>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>Save</button>
            <button className="back-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="people-grid">
        {people.map((p, i) => (
          <div key={p.id} className="person-card card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="person-header">
              <span className="person-avatar">{p.avatar}</span>
              <div>
                <h4 className="person-name">{p.name}</h4>
                {p.relationship && <span className="person-rel">{p.relationship}</span>}
              </div>
              <button className="delete-btn" onClick={() => handleDelete(p.id)} aria-label="Delete" style={{ marginLeft: 'auto' }}><Trash2 size={12} /></button>
            </div>
            {p.skills && p.skills.length > 0 && (
              <div className="person-skills">
                {p.skills.map(s => <span key={s} className="person-skill-tag">{s}</span>)}
              </div>
            )}
            {p.contact && (
              <div className="person-contact">
                <a href={`tel:${p.contact}`} className="contact-link"><Phone size={12} /> Call</a>
                <a href={`sms:${p.contact}`} className="contact-link"><MessageCircle size={12} /> Text</a>
              </div>
            )}
          </div>
        ))}
      </div>

      {people.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>💜</span>
          <p>Add the people who make you feel safe.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Even one person is enough.</p>
        </div>
      )}
    </div>
  );
}

export default SafePeoplePage;
