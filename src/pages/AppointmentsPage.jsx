import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Trash2 } from 'lucide-react';
import { getAppointments, saveAppointments } from '../utils/storage';
import './AppointmentsPage.css';

const TYPES = [
  { value: 'therapy', label: 'Therapy', emoji: '🧠' },
  { value: 'doctor', label: 'Doctor', emoji: '🏥' },
  { value: 'school', label: 'School', emoji: '🏫' },
  { value: 'other', label: 'Other', emoji: '📋' },
];

function AppointmentsPage({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('therapy');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setAppointments(getAppointments()); }, []);

  const handleSave = () => {
    if (!title.trim() || !date) return;
    const updated = [
      { id: Date.now(), title: title.trim(), date, time, type, notes: notes.trim(), timestamp: new Date().toISOString() },
      ...appointments
    ];
    saveAppointments(updated);
    setAppointments(updated);
    setTitle(''); setDate(''); setTime(''); setType('therapy'); setNotes('');
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id) => {
    const updated = appointments.filter(a => a.id !== id);
    saveAppointments(updated);
    setAppointments(updated);
  };

  const now = new Date();
  const upcoming = appointments
    .filter(a => new Date(a.date + 'T' + (a.time || '23:59')) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = appointments
    .filter(a => new Date(a.date + 'T' + (a.time || '23:59')) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const typeInfo = (t) => TYPES.find(tp => tp.value === t) || TYPES[3];

  return (
    <div className="appointments-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Appointments 📅</h1>
        <p className="page-subtitle">Keep track of what's coming up</p>
      </header>

      {saved && <div className="appt-saved slide-up">✅ Appointment added!</div>}

      {!showForm ? (
        <button className="primary-btn" onClick={() => setShowForm(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Add appointment
        </button>
      ) : (
        <div className="appt-form card slide-up">
          <h3 className="section-title">New appointment</h3>
          <input className="input-field" placeholder="Title (e.g., Therapy with Dr. Smith)" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="appt-row">
            <div className="appt-field">
              <label>Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="appt-field">
              <label>Time</label>
              <input type="time" className="input-field" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <label>Type</label>
          <div className="appt-types">
            {TYPES.map(t => (
              <button key={t.value} className={`type-chip ${type === t.value ? 'active' : ''}`} onClick={() => setType(t.value)}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <textarea className="input-field" rows={2} placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="form-actions">
            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button className="back-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="appt-section">
          <h3 className="section-title">Upcoming ({upcoming.length})</h3>
          {upcoming.map(a => {
            const ti = typeInfo(a.type);
            return (
              <div key={a.id} className="appt-card card fade-in">
                <div className="appt-card-header">
                  <span className="appt-type-emoji">{ti.emoji}</span>
                  <div className="appt-info">
                    <span className="appt-title">{a.title}</span>
                    <span className="appt-datetime">
                      <Calendar size={12} /> {new Date(a.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      {a.time && <> <Clock size={12} /> {a.time}</>}
                    </span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(a.id)}><Trash2 size={12} /></button>
                </div>
                {a.notes && <p className="appt-notes">{a.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {past.length > 0 && (
        <div className="appt-section">
          <h3 className="section-title">Past</h3>
          {past.slice(0, 10).map(a => {
            const ti = typeInfo(a.type);
            return (
              <div key={a.id} className="appt-card card past fade-in">
                <div className="appt-card-header">
                  <span className="appt-type-emoji">{ti.emoji}</span>
                  <div className="appt-info">
                    <span className="appt-title">{a.title}</span>
                    <span className="appt-datetime">
                      {new Date(a.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(a.id)}><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {appointments.length === 0 && !showForm && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>📅</span>
          <p>No appointments yet. Add one to stay on top of things.</p>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
