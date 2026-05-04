import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Moon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPeriodData, savePeriodData } from '../utils/storage';
import './PeriodPage.css';

function PeriodPage({ onBack }) {
  const [data, setData] = useState({ logs: [], cycleLength: 28 });
  const [showAdd, setShowAdd] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date());

  useEffect(() => { setData(getPeriodData()); }, []);

  const handleSave = () => {
    if (!startDate) return;
    const updated = { ...data };
    updated.logs = [
      { id: Date.now(), startDate, endDate: endDate || null, note: note.trim(), timestamp: new Date().toISOString() },
      ...updated.logs
    ];
    savePeriodData(updated);
    setData(updated);
    setStartDate(''); setEndDate(''); setNote('');
    setShowAdd(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCycleLength = (len) => {
    const num = parseInt(len) || 28;
    const updated = { ...data, cycleLength: Math.max(20, Math.min(45, num)) };
    savePeriodData(updated);
    setData(updated);
  };

  const lastPeriod = data.logs.length > 0 ? data.logs[0] : null;
  const nextPeriodDate = lastPeriod
    ? new Date(new Date(lastPeriod.startDate).getTime() + data.cycleLength * 86400000)
    : null;
  const pmsStart = nextPeriodDate
    ? new Date(nextPeriodDate.getTime() - 5 * 86400000)
    : null;
  const today = new Date();
  const daysUntilNext = nextPeriodDate
    ? Math.ceil((nextPeriodDate - today) / 86400000)
    : null;
  const inPmsWindow = pmsStart && today >= pmsStart && today < nextPeriodDate;

  // Calendar helpers
  const calYear = calMonth.getFullYear();
  const calMo = calMonth.getMonth();
  const firstDay = new Date(calYear, calMo, 1).getDay();
  const daysInMonth = new Date(calYear, calMo + 1, 0).getDate();

  const isInPeriod = (day) => {
    const d = new Date(calYear, calMo, day);
    return data.logs.some(l => {
      const s = new Date(l.startDate);
      const e = l.endDate ? new Date(l.endDate) : new Date(s.getTime() + 5 * 86400000);
      return d >= s && d <= e;
    });
  };

  const isPredicted = (day) => {
    if (!nextPeriodDate) return false;
    const d = new Date(calYear, calMo, day);
    const predEnd = new Date(nextPeriodDate.getTime() + 5 * 86400000);
    return d >= nextPeriodDate && d <= predEnd;
  };

  const isPms = (day) => {
    if (!pmsStart || !nextPeriodDate) return false;
    const d = new Date(calYear, calMo, day);
    return d >= pmsStart && d < nextPeriodDate;
  };

  return (
    <div className="period-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Period Tracker 🌙</h1>
        <p className="page-subtitle">Understanding your cycle is understanding yourself</p>
      </header>

      {saved && <div className="period-saved slide-up">✨ Period logged!</div>}

      {inPmsWindow && (
        <div className="pms-alert card fade-in">
          <Moon size={20} />
          <p>Your period might start soon — be extra kind to yourself 💜</p>
        </div>
      )}

      {nextPeriodDate && (
        <div className="prediction-card card fade-in">
          <Calendar size={18} />
          <div>
            <span className="prediction-label">Next period predicted</span>
            <span className="prediction-date">
              {nextPeriodDate.toLocaleDateString([], { month: 'long', day: 'numeric' })}
              {daysUntilNext !== null && daysUntilNext > 0 && ` (${daysUntilNext} days)`}
            </span>
          </div>
        </div>
      )}

      <div className="cycle-setting card">
        <label className="cycle-label">Cycle length (days)</label>
        <div className="cycle-input-row">
          <button onClick={() => updateCycleLength(data.cycleLength - 1)}>−</button>
          <span className="cycle-number">{data.cycleLength}</span>
          <button onClick={() => updateCycleLength(data.cycleLength + 1)}>+</button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="period-calendar card">
        <div className="cal-header">
          <button onClick={() => setCalMonth(new Date(calYear, calMo - 1))}><ChevronLeft size={18} /></button>
          <span className="cal-title">{calMonth.toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCalMonth(new Date(calYear, calMo + 1))}><ChevronRight size={18} /></button>
        </div>
        <div className="cal-days-header">
          {['S','M','T','W','T','F','S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="cal-grid">
          {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const classes = ['cal-day'];
            if (isInPeriod(day)) classes.push('period-day');
            if (isPredicted(day)) classes.push('predicted-day');
            if (isPms(day)) classes.push('pms-day');
            const isToday = day === today.getDate() && calMo === today.getMonth() && calYear === today.getFullYear();
            if (isToday) classes.push('today');
            return <span key={day} className={classes.join(' ')}>{day}</span>;
          })}
        </div>
        <div className="cal-legend">
          <span><span className="legend-dot period-dot" /> Period</span>
          <span><span className="legend-dot predicted-dot" /> Predicted</span>
          <span><span className="legend-dot pms-dot" /> PMS window</span>
        </div>
      </div>

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Log period
        </button>
      ) : (
        <div className="period-form card slide-up">
          <h3 className="section-title">Log a period</h3>
          <label>Start date</label>
          <input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <label>End date (optional)</label>
          <input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <label>Notes — how did your cycle affect your mood?</label>
          <textarea className="input-field" rows={3} placeholder="e.g., felt more anxious before, cramps made me tired..." value={note} onChange={e => setNote(e.target.value)} />
          <div className="form-actions">
            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button className="back-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {data.logs.length > 0 && (
        <div className="period-history">
          <h3 className="section-title">Recent cycles</h3>
          {data.logs.slice(0, 6).map(l => (
            <div key={l.id} className="period-entry fade-in">
              <Heart size={14} color="var(--blush-dark)" />
              <div>
                <span className="entry-dates">
                  {new Date(l.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  {l.endDate && ` — ${new Date(l.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}`}
                </span>
                {l.note && <span className="entry-note">{l.note}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.logs.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🌙</span>
          <p>Log your first period to start tracking your cycle.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Predictions get better with more data.</p>
        </div>
      )}
    </div>
  );
}

export default PeriodPage;
