import React, { useState, useEffect } from 'react';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryCharging, Plus, Zap, ZapOff } from 'lucide-react';
import { getSocialBattery, addSocialBattery } from '../utils/storage';
import './SocialBatteryPage.css';

const LEVELS = [
  { value: 1, label: 'Empty', emoji: '😶', color: '#e88a8a' },
  { value: 2, label: 'Low', emoji: '😮‍💨', color: '#e8c88a' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#c8d88a' },
  { value: 4, label: 'Good', emoji: '😊', color: '#8ac8a0' },
  { value: 5, label: 'Full', emoji: '🤗', color: '#8ab8d8' },
];

const RECHARGE_TIPS = [
  '🎧 Listen to music with headphones',
  '📖 Read or scroll in a quiet spot',
  '🛁 Take a long shower or bath',
  '🎮 Play a game by yourself',
  '🌿 Sit outside and just breathe',
  '✏️ Draw, doodle, or journal',
  '🧸 Hang out with a pet',
  '😴 Take a nap — rest is productive',
  '🎬 Watch comfort shows',
  '🚶 Go for a solo walk',
];

function SocialBatteryPage() {
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState('drained');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setEntries(getSocialBattery()); }, []);

  const handleSave = () => {
    if (!selected) return;
    const updated = addSocialBattery({ level: selected, note: note.trim(), noteType });
    setEntries(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); setSelected(null); setNote(''); }, 2000);
  };

  const latest = entries.length > 0 ? entries[0] : null;
  const latestLevel = latest ? LEVELS.find(l => l.value === latest.level) : null;

  return (
    <div className="social-battery-page">
      <header className="page-header">
        <h1>Social Battery 🔋</h1>
        <p className="page-subtitle">It's okay to need alone time to recharge</p>
      </header>

      {saved ? (
        <div className="sb-saved slide-up">⚡ Battery level logged!</div>
      ) : (
        <div className="sb-input fade-in">
          <p className="sb-prompt">How's your social energy right now?</p>
          <div className="sb-levels">
            {LEVELS.map(level => (
              <button
                key={level.value}
                className={`sb-level-btn ${selected === level.value ? 'active' : ''}`}
                style={selected === level.value ? { background: level.color, borderColor: level.color } : {}}
                onClick={() => setSelected(level.value)}
              >
                <span className="sb-emoji">{level.emoji}</span>
                <span className="sb-label">{level.label}</span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="sb-details slide-up">
              <div className="sb-type-toggle">
                <button
                  className={`type-btn ${noteType === 'drained' ? 'active drain' : ''}`}
                  onClick={() => setNoteType('drained')}
                >
                  <ZapOff size={14} /> Drained by
                </button>
                <button
                  className={`type-btn ${noteType === 'charged' ? 'active charge' : ''}`}
                  onClick={() => setNoteType('charged')}
                >
                  <Zap size={14} /> Charged by
                </button>
              </div>
              <input
                className="input-field"
                placeholder={noteType === 'drained' ? 'What drained you?' : 'What charged you up?'}
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <button className="primary-btn" onClick={handleSave}>Log battery level</button>
            </div>
          )}
        </div>
      )}

      {latestLevel && (
        <div className="sb-current card fade-in">
          <div className="sb-battery-visual">
            <div className="battery-shell">
              <div className="battery-fill" style={{ width: `${(latest.level / 5) * 100}%`, background: latestLevel.color }} />
            </div>
            <span className="battery-cap" />
          </div>
          <span className="sb-current-label">Last logged: {latestLevel.label} {latestLevel.emoji}</span>
        </div>
      )}

      {latest && latest.level <= 2 && (
        <div className="recharge-section card">
          <h3 className="section-title">Recharge ideas 🔌</h3>
          <div className="recharge-tips">
            {RECHARGE_TIPS.slice(0, 5).map((tip, i) => (
              <div key={i} className="recharge-tip">{tip}</div>
            ))}
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="sb-history">
          <h3 className="section-title">Recent history</h3>
          {entries.slice(0, 10).map(e => {
            const level = LEVELS.find(l => l.value === e.level);
            return (
              <div key={e.id} className="sb-entry fade-in">
                <span className="sb-entry-dot" style={{ background: level?.color }} />
                <div className="sb-entry-content">
                  <span className="sb-entry-level">{level?.emoji} {level?.label}</span>
                  {e.note && (
                    <span className="sb-entry-note">
                      {e.noteType === 'charged' ? '⚡' : '🔻'} {e.note}
                    </span>
                  )}
                </div>
                <span className="sb-entry-time">
                  {new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SocialBatteryPage;
