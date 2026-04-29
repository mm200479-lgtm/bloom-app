import React, { useState, useEffect } from 'react';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryCharging } from 'lucide-react';
import { getEnergyLogs, addEnergyLog, addPetals } from '../utils/storage';
import './EnergyPage.css';

const LEVELS = [
  { value: 1, label: 'Empty', emoji: '🪫', color: '#e88a8a', icon: BatteryLow },
  { value: 2, label: 'Low', emoji: '🔋', color: '#e8c88a', icon: BatteryLow },
  { value: 3, label: 'Medium', emoji: '🔋', color: '#c8d88a', icon: BatteryMedium },
  { value: 4, label: 'Good', emoji: '🔋', color: '#8ac8a0', icon: BatteryFull },
  { value: 5, label: 'Full', emoji: '⚡', color: '#8ab8d8', icon: BatteryCharging },
];

function EnergyPage() {
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLogs(getEnergyLogs()); }, []);

  const handleSave = () => {
    if (!selected) return;
    const newLogs = addEnergyLog(selected, note.trim());
    addPetals(1);
    setLogs(newLogs);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelected(null);
      setNote('');
    }, 2000);
  };

  const todayLogs = logs.filter(l =>
    new Date(l.timestamp).toDateString() === new Date().toDateString()
  );

  const last7 = logs.filter(l => Date.now() - new Date(l.timestamp).getTime() < 7 * 86400000);
  const avgEnergy = last7.length > 0
    ? (last7.reduce((sum, l) => sum + l.level, 0) / last7.length).toFixed(1)
    : null;

  return (
    <div className="energy-page">
      <header className="page-header">
        <h1>Energy Tracker</h1>
        <p className="page-subtitle">Mood and energy are different — track both 🔋</p>
      </header>

      {saved ? (
        <div className="energy-saved slide-up">
          <span>⚡</span>
          <p>Energy logged! +1 petal 🌸</p>
        </div>
      ) : (
        <div className="energy-input fade-in">
          <p className="energy-prompt">What's your energy level right now?</p>
          <div className="energy-levels">
            {LEVELS.map(level => (
              <button
                key={level.value}
                className={`energy-btn ${selected === level.value ? 'active' : ''}`}
                style={selected === level.value ? { background: level.color, borderColor: level.color } : {}}
                onClick={() => setSelected(level.value)}
              >
                <span className="energy-emoji">{level.emoji}</span>
                <span className="energy-label">{level.label}</span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="energy-note slide-up">
              <input
                className="input-field"
                placeholder="What's affecting your energy? (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <button className="primary-btn" onClick={handleSave}>Log energy</button>
            </div>
          )}
        </div>
      )}

      {avgEnergy && (
        <div className="energy-avg card fade-in">
          <Battery size={18} color="var(--sage-dark)" />
          <div>
            <span className="avg-number">{avgEnergy}/5</span>
            <span className="avg-label">average energy this week ({last7.length} logs)</span>
          </div>
        </div>
      )}

      {todayLogs.length > 0 && (
        <div className="energy-today">
          <h3 className="section-title">Today</h3>
          <div className="energy-timeline">
            {todayLogs.map(l => {
              const level = LEVELS.find(lv => lv.value === l.level);
              return (
                <div key={l.id} className="timeline-item">
                  <span className="timeline-dot" style={{ background: level?.color }} />
                  <div className="timeline-content">
                    <span className="timeline-level">{level?.label} {level?.emoji}</span>
                    {l.note && <span className="timeline-note">{l.note}</span>}
                  </div>
                  <span className="timeline-time">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="energy-tip">
        💡 You can feel calm but exhausted, or anxious but energized. Tracking energy separately from mood helps you and your therapist understand your patterns better.
      </p>
    </div>
  );
}

export default EnergyPage;
