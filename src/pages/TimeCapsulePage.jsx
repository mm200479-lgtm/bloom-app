import React, { useState, useEffect } from 'react';
import { Plus, Lock, Unlock, Clock } from 'lucide-react';
import { getTimeCapsules, addTimeCapsule } from '../utils/storage';
import './TimeCapsulePage.css';

const DURATIONS = [
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
  { label: '1 year', days: 365 },
];

function TimeCapsulePage({ onBack }) {
  const [capsules, setCapsules] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [song, setSong] = useState('');
  const [grateful, setGrateful] = useState('');
  const [photo, setPhoto] = useState('');
  const [duration, setDuration] = useState(90);
  const [openedId, setOpenedId] = useState(null);

  useEffect(() => { setCapsules(getTimeCapsules()); }, []);

  const handleCreate = () => {
    if (!note.trim()) return;
    const openDate = new Date(Date.now() + duration * 86400000).toISOString();
    const updated = addTimeCapsule({ mood, note: note.trim(), song: song.trim(), grateful: grateful.trim(), photo: photo.trim(), openDate });
    setCapsules(updated);
    setMood(''); setNote(''); setSong(''); setGrateful(''); setPhoto('');
    setShowCreate(false);
  };

  const isUnlocked = (capsule) => new Date(capsule.openDate) <= new Date();

  const getCountdown = (capsule) => {
    const diff = new Date(capsule.openDate) - new Date();
    if (diff <= 0) return 'Ready to open!';
    const days = Math.ceil(diff / 86400000);
    return days > 30 ? `${Math.floor(days / 30)} months, ${days % 30} days` : `${days} days`;
  };

  return (
    <div className="capsule-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Time Capsule 💌</h1>
        <p className="page-subtitle">Capture this moment. Open it later.</p>
      </header>

      {!showCreate ? (
        <button className="primary-btn" onClick={() => setShowCreate(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Create a time capsule
        </button>
      ) : (
        <div className="capsule-form card slide-up">
          <h3 className="section-title">What's in your capsule?</h3>
          <input className="input-field" placeholder="How are you feeling right now?" value={mood} onChange={e => setMood(e.target.value)} />
          <textarea className="input-field" rows={3} placeholder="A note to your future self..." value={note} onChange={e => setNote(e.target.value)} />
          <input className="input-field" placeholder="A song that fits right now (optional)" value={song} onChange={e => setSong(e.target.value)} />
          <input className="input-field" placeholder="Something you're grateful for (optional)" value={grateful} onChange={e => setGrateful(e.target.value)} />
          <input className="input-field" placeholder="Describe a photo/memory (optional)" value={photo} onChange={e => setPhoto(e.target.value)} />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 8 }}>Open in:</p>
          <div className="duration-picker">
            {DURATIONS.map(d => (
              <button key={d.days} className={`duration-btn ${duration === d.days ? 'active' : ''}`} onClick={() => setDuration(d.days)}>
                {d.label}
              </button>
            ))}
          </div>
          <div className="form-actions" style={{ marginTop: 10 }}>
            <button className="primary-btn" onClick={handleCreate}><Lock size={14} /> Seal capsule</button>
            <button className="back-btn" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="capsules-list">
        {capsules.map((c, i) => {
          const unlocked = isUnlocked(c);
          const opened = openedId === c.id;
          return (
            <div key={c.id} className={`capsule-card card fade-in ${unlocked ? 'unlocked' : 'locked'}`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="capsule-header">
                {unlocked ? <Unlock size={18} color="var(--sage-dark)" /> : <Lock size={18} color="var(--text-light)" />}
                <div>
                  <span className="capsule-date">Created {new Date(c.timestamp).toLocaleDateString()}</span>
                  <span className="capsule-countdown">
                    <Clock size={12} /> {getCountdown(c)}
                  </span>
                </div>
              </div>
              {unlocked && !opened && (
                <button className="primary-btn" onClick={() => setOpenedId(c.id)} style={{ width: '100%', marginTop: 8 }}>
                  Open capsule 💌
                </button>
              )}
              {opened && (
                <div className="capsule-contents slide-up">
                  {c.mood && <p><strong>Feeling:</strong> {c.mood}</p>}
                  <p><strong>Note:</strong> {c.note}</p>
                  {c.song && <p><strong>Song:</strong> {c.song}</p>}
                  {c.grateful && <p><strong>Grateful for:</strong> {c.grateful}</p>}
                  {c.photo && <p><strong>Memory:</strong> {c.photo}</p>}
                </div>
              )}
              {!unlocked && (
                <p className="capsule-locked-msg">🔒 This capsule is sealed until {new Date(c.openDate).toLocaleDateString()}</p>
              )}
            </div>
          );
        })}
      </div>

      {capsules.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>💌</span>
          <p>Create a capsule to capture how you feel right now.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Future you will love reading it.</p>
        </div>
      )}
    </div>
  );
}

export default TimeCapsulePage;
