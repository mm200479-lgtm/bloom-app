import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, BookOpen, Calendar } from 'lucide-react';
import { getHomework, saveHomework } from '../utils/storage';
import './StudyPlannerPage.css';

function StudyPlannerPage({ onBack }) {
  const [sessions, setSessions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(25);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  useEffect(() => {
    const all = getHomework();
    setSessions(all.filter(h => h.type === 'study'));
  }, []);

  useEffect(() => {
    if (!pomodoroRunning || pomodoroTime <= 0) return;
    const t = setInterval(() => setPomodoroTime(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [pomodoroRunning, pomodoroTime]);

  const handleAdd = () => {
    if (!subject.trim()) return;
    const all = getHomework();
    const newSession = { id: Date.now(), type: 'study', subject: subject.trim(), duration, date, done: false, timestamp: new Date().toISOString() };
    const updated = [newSession, ...all];
    saveHomework(updated);
    setSessions(updated.filter(h => h.type === 'study'));
    setSubject('');
    setShowAdd(false);
  };

  const toggleDone = (id) => {
    const all = getHomework().map(h => h.id === id ? { ...h, done: !h.done } : h);
    saveHomework(all);
    setSessions(all.filter(h => h.type === 'study'));
  };

  const handleDelete = (id) => {
    const all = getHomework().filter(h => h.id !== id);
    saveHomework(all);
    setSessions(all.filter(h => h.type === 'study'));
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);
  const futureSessions = sessions.filter(s => s.date > today);
  const pastSessions = sessions.filter(s => s.date < today);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const startPomodoro = (mins) => {
    setPomodoroTime(mins * 60);
    setPomodoroActive(true);
    setPomodoroRunning(true);
  };

  return (
    <div className="study-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Study Planner 📖</h1>
        <p className="page-subtitle">Plan your study sessions and stay on track</p>
      </header>

      {pomodoroActive && (
        <div className="pomodoro-card card slide-up">
          <h3 className="section-title"><Clock size={14} /> Pomodoro Timer</h3>
          <span className="pomodoro-time">{formatTime(pomodoroTime)}</span>
          {pomodoroTime <= 0 ? (
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--sage-dark)' }}>🎉 Time's up! Great work!</p>
              <button className="primary-btn" onClick={() => setPomodoroActive(false)} style={{ marginTop: 8 }}>Close</button>
            </div>
          ) : (
            <div className="pomodoro-controls">
              <button className="primary-btn" onClick={() => setPomodoroRunning(!pomodoroRunning)}>
                {pomodoroRunning ? 'Pause' : 'Resume'}
              </button>
              <button className="back-btn" onClick={() => setPomodoroActive(false)}>Stop</button>
            </div>
          )}
        </div>
      )}

      {!pomodoroActive && (
        <div className="pomodoro-quick">
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Quick timer:</span>
          {[15, 25, 45].map(m => (
            <button key={m} className="pomodoro-quick-btn" onClick={() => startPomodoro(m)}>
              <Clock size={12} /> {m}min
            </button>
          ))}
        </div>
      )}

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Add study session
        </button>
      ) : (
        <div className="study-form card slide-up">
          <input className="input-field" placeholder="Subject..." value={subject} onChange={e => setSubject(e.target.value)} />
          <div className="study-form-row">
            <label className="study-label">
              <Clock size={14} /> Duration (min)
              <input type="number" className="input-field" value={duration} onChange={e => setDuration(Number(e.target.value))} min={5} max={180} style={{ width: 80 }} />
            </label>
            <label className="study-label">
              <Calendar size={14} /> Date
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </label>
          </div>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>Add</button>
            <button className="back-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {todaySessions.length > 0 && (
        <div className="study-section">
          <h3 className="section-title">📅 Today's plan</h3>
          {todaySessions.map((s, i) => (
            <div key={s.id} className={`study-item fade-in ${s.done ? 'done' : ''}`} style={{ animationDelay: `${i * 0.03}s` }}>
              <button className="boundary-check" onClick={() => toggleDone(s.id)}>
                {s.done ? '✅' : <span className="boundary-circle" />}
              </button>
              <div className="study-info">
                <span className="study-subject">{s.subject}</span>
                <span className="study-meta">{s.duration} min</span>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(s.id)} aria-label="Delete"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {futureSessions.length > 0 && (
        <div className="study-section">
          <h3 className="section-title">📆 Upcoming</h3>
          {futureSessions.map((s, i) => (
            <div key={s.id} className="study-item fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
              <BookOpen size={16} color="var(--text-light)" />
              <div className="study-info">
                <span className="study-subject">{s.subject}</span>
                <span className="study-meta">{s.duration} min · {new Date(s.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(s.id)} aria-label="Delete"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {sessions.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>📖</span>
          <p>Plan your study sessions here.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Small consistent effort beats cramming every time.</p>
        </div>
      )}
    </div>
  );
}

export default StudyPlannerPage;
