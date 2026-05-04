import React, { useState, useEffect } from 'react';
import { Plus, Pill, Check, Clock, Trash2, History, ChevronLeft } from 'lucide-react';
import { getMeds, saveMeds } from '../utils/storage';
import './MedsPage.css';

function MedsPage({ onBack }) {
  const [data, setData] = useState({ medications: [], logs: [] });
  const [showAdd, setShowAdd] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [dosage, setDosage] = useState('');

  useEffect(() => { setData(getMeds()); }, []);

  const save = (updated) => { setData(updated); saveMeds(updated); };

  const addMed = () => {
    if (!name.trim()) return;
    const med = { id: Date.now(), name: name.trim(), time, dosage: dosage.trim() };
    save({ ...data, medications: [...data.medications, med] });
    setName(''); setDosage(''); setTime('08:00'); setShowAdd(false);
  };

  const deleteMed = (id) => {
    save({ ...data, medications: data.medications.filter(m => m.id !== id) });
  };

  const today = new Date().toDateString();

  const isTakenToday = (medId) => {
    return data.logs.some(l => l.medId === medId && new Date(l.timestamp).toDateString() === today);
  };

  const toggleTaken = (medId) => {
    if (isTakenToday(medId)) {
      const updated = data.logs.filter(l => !(l.medId === medId && new Date(l.timestamp).toDateString() === today));
      save({ ...data, logs: updated });
    } else {
      const log = { medId, timestamp: new Date().toISOString(), taken: true };
      save({ ...data, logs: [...data.logs, log] });
    }
  };

  const takenToday = data.medications.filter(m => isTakenToday(m.id)).length;
  const totalMeds = data.medications.length;

  // Missed doses: past 7 days
  const missedDoses = () => {
    const missed = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(Date.now() - i * 86400000).toDateString();
      data.medications.forEach(med => {
        const taken = data.logs.some(l => l.medId === med.id && new Date(l.timestamp).toDateString() === d);
        if (!taken) missed.push({ med: med.name, date: d });
      });
    }
    return missed;
  };

  // History: last 14 days
  const historyDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toDateString();
      const meds = data.medications.map(med => ({
        ...med,
        taken: data.logs.some(l => l.medId === med.id && new Date(l.timestamp).toDateString() === dateStr),
      }));
      days.push({ date: d, meds });
    }
    return days;
  };

  if (showHistory) {
    const days = historyDays();
    return (
      <div className="meds-page">
        <button className="back-btn" onClick={() => setShowHistory(false)}>
          <ChevronLeft size={18} /> Back
        </button>
        <h2 className="section-title">Medication History</h2>
        <div className="history-list">
          {days.map((day, i) => (
            <div key={i} className="history-day fade-in">
              <span className="history-date">
                {day.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div className="history-meds">
                {day.meds.map(m => (
                  <span key={m.id} className={`history-pill ${m.taken ? 'taken' : 'missed'}`}>
                    {m.taken ? '✓' : '✗'} {m.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const missed = missedDoses();

  return (
    <div className="meds-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Medication Reminders 💊</h1>
        <p className="page-subtitle">Taking care of yourself includes taking your meds</p>
      </header>

      {totalMeds > 0 && (
        <div className="meds-progress card fade-in">
          <div className="progress-ring">
            <span className="progress-count">{takenToday}/{totalMeds}</span>
          </div>
          <span className="progress-label">
            {takenToday === totalMeds ? 'All taken today! Great job 🌟' : 'taken today'}
          </span>
        </div>
      )}

      <div className="meds-checklist">
        <h3 className="section-title">Today's medications</h3>
        {data.medications.length === 0 ? (
          <p className="empty-state">No medications added yet. Tap + to add one 💜</p>
        ) : (
          <div className="med-list">
            {data.medications.map(med => {
              const taken = isTakenToday(med.id);
              return (
                <div key={med.id} className={`med-item ${taken ? 'taken' : ''} fade-in`}>
                  <button
                    className={`med-check ${taken ? 'checked' : ''}`}
                    onClick={() => toggleTaken(med.id)}
                    aria-label={taken ? `Unmark ${med.name}` : `Mark ${med.name} as taken`}
                  >
                    {taken && <Check size={14} />}
                  </button>
                  <div className="med-info">
                    <span className="med-name">{med.name}</span>
                    <span className="med-details">
                      <Clock size={11} /> {med.time}
                      {med.dosage && ` · ${med.dosage}`}
                    </span>
                  </div>
                  <button className="delete-btn" onClick={() => deleteMed(med.id)} aria-label={`Delete ${med.name}`}>
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {missed.length > 0 && (
        <div className="missed-section">
          <h3 className="section-title">Missed doses (past week)</h3>
          <div className="missed-list">
            {missed.slice(0, 10).map((m, i) => (
              <div key={i} className="missed-item">
                <span className="missed-dot" />
                <span className="missed-name">{m.med}</span>
                <span className="missed-date">
                  {new Date(m.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
            {missed.length > 10 && (
              <p className="missed-more">+ {missed.length - 10} more</p>
            )}
          </div>
          <p className="missed-note">
            It's okay to miss sometimes. What matters is getting back on track 💜
          </p>
        </div>
      )}

      {showAdd ? (
        <div className="add-med-form card slide-up">
          <h3 className="section-title">Add medication</h3>
          <input
            className="input-field"
            placeholder="Medication name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="add-med-row">
            <div className="add-med-field">
              <label>Time</label>
              <input type="time" className="input-field" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className="add-med-field">
              <label>Dosage (optional)</label>
              <input
                className="input-field"
                placeholder="e.g., 10mg"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
              />
            </div>
          </div>
          <div className="add-med-actions">
            <button className="primary-btn" onClick={addMed}>Add</button>
            <button className="secondary-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="meds-actions">
          <button className="primary-btn" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add medication
          </button>
          {data.logs.length > 0 && (
            <button className="secondary-btn" onClick={() => setShowHistory(true)}>
              <History size={16} /> View history
            </button>
          )}
        </div>
      )}

      <p className="meds-tip">
        💡 Set phone alarms to match your medication times for extra reminders.
      </p>
    </div>
  );
}

export default MedsPage;
