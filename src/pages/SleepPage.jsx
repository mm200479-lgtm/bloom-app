import React, { useState, useEffect } from 'react';
import { Moon, Sun, Star, CloudMoon, Sparkles } from 'lucide-react';
import { getSleepLogs, addSleepLog, addPetals } from '../utils/storage';
import './SleepPage.css';

const TIPS = [
  "Put screens away 30 minutes before bed 📱",
  "Try a warm drink like chamomile tea 🍵",
  "Write down worries before bed so your brain can let go 📝",
  "Keep your room cool and dark 🌙",
  "Try the 4-7-8 breathing technique as you fall asleep 🌬️",
  "A consistent bedtime helps your body know when to rest ⏰",
  "Gentle stretching before bed can release tension 🧘",
  "Listening to rain sounds or white noise can help 🌧️",
];

function SleepPage({ onBack }) {
  const [logs, setLogs] = useState([]);
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(0);
  const [nightmares, setNightmares] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLogs(getSleepLogs()); }, []);

  const calcHours = () => {
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wakeTime.split(':').map(Number);
    let bedMin = bh * 60 + bm;
    let wakeMin = wh * 60 + wm;
    if (wakeMin <= bedMin) wakeMin += 24 * 60;
    const diff = wakeMin - bedMin;
    return (diff / 60).toFixed(1);
  };

  const handleSave = () => {
    if (quality === 0) return;
    const hours = parseFloat(calcHours());
    const newLogs = addSleepLog({ bedtime, wakeTime, quality, nightmares, hours });
    addPetals(2);
    setLogs(newLogs);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setQuality(0);
      setNightmares(false);
    }, 2500);
  };

  const todayTip = TIPS[new Date().getDate() % TIPS.length];

  const recentLogs = logs.slice(0, 14);
  const avgHours = recentLogs.length > 0
    ? (recentLogs.reduce((s, l) => s + (l.hours || 0), 0) / recentLogs.length).toFixed(1)
    : null;
  const avgQuality = recentLogs.length > 0
    ? (recentLogs.reduce((s, l) => s + (l.quality || 0), 0) / recentLogs.length).toFixed(1)
    : null;

  return (
    <div className="sleep-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Sleep Tracker 🌙</h1>
        <p className="page-subtitle">Rest is productive — your body and brain need it</p>
      </header>

      {saved ? (
        <div className="sleep-saved slide-up">
          <span>🌙</span>
          <p>Sleep logged! +2 petals 🌸</p>
        </div>
      ) : (
        <div className="sleep-form fade-in">
          <div className="sleep-times">
            <div className="sleep-time-input">
              <Moon size={16} color="var(--lavender-dark)" />
              <label>Bedtime</label>
              <input type="time" className="input-field" value={bedtime} onChange={e => setBedtime(e.target.value)} />
            </div>
            <div className="sleep-time-input">
              <Sun size={16} color="var(--warning)" />
              <label>Wake time</label>
              <input type="time" className="input-field" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
            </div>
          </div>

          <div className="sleep-hours-display card">
            <span className="hours-number">{calcHours()}</span>
            <span className="hours-label">hours of sleep</span>
          </div>

          <div className="sleep-quality">
            <p className="sleep-prompt">How was your sleep quality?</p>
            <div className="star-row">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  className={`star-btn ${quality >= s ? 'active' : ''}`}
                  onClick={() => setQuality(s)}
                  aria-label={`${s} star${s > 1 ? 's' : ''}`}
                >
                  <Star size={28} fill={quality >= s ? 'var(--warning)' : 'none'} color={quality >= s ? 'var(--warning)' : 'var(--text-light)'} />
                </button>
              ))}
            </div>
          </div>

          <div className="nightmare-toggle">
            <label className="toggle-label">
              <CloudMoon size={16} />
              <span>Had nightmares?</span>
            </label>
            <button
              className={`toggle-btn ${nightmares ? 'active' : ''}`}
              onClick={() => setNightmares(!nightmares)}
              role="switch"
              aria-checked={nightmares}
            >
              <span className="toggle-knob" />
            </button>
          </div>

          {quality > 0 && (
            <button className="primary-btn slide-up" onClick={handleSave}>Log sleep</button>
          )}
        </div>
      )}

      <div className="sleep-tip card fade-in">
        <Sparkles size={16} color="var(--lavender-dark)" />
        <div>
          <span className="tip-title">Tonight's sleep tip</span>
          <p className="tip-text">{todayTip}</p>
        </div>
      </div>

      {avgHours && (
        <div className="sleep-stats">
          <div className="stat-card card">
            <span className="stat-number">{avgHours}h</span>
            <span className="stat-label">avg sleep</span>
          </div>
          <div className="stat-card card">
            <span className="stat-number">{avgQuality}★</span>
            <span className="stat-label">avg quality</span>
          </div>
          <div className="stat-card card">
            <span className="stat-number">{recentLogs.length}</span>
            <span className="stat-label">logs</span>
          </div>
        </div>
      )}

      {recentLogs.length > 0 && (
        <div className="sleep-history">
          <h3 className="section-title">Recent nights</h3>
          <div className="sleep-log-list">
            {recentLogs.map(log => (
              <div key={log.id} className="sleep-log-item fade-in">
                <div className="log-date">
                  {new Date(log.timestamp).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="log-details">
                  <span className="log-hours">{log.hours}h</span>
                  <span className="log-stars">{'★'.repeat(log.quality)}{'☆'.repeat(5 - log.quality)}</span>
                  {log.nightmares && <span className="log-nightmare">😰</span>}
                </div>
                <div className="log-times">
                  {log.bedtime} → {log.wakeTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <p className="empty-state">
          No sleep logs yet. Track your first night above! 🌟
        </p>
      )}
    </div>
  );
}

export default SleepPage;
