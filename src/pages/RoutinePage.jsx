import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Sun, Moon } from 'lucide-react';
import { getRoutines, saveRoutines, addPetals } from '../utils/storage';
import './RoutinePage.css';

const DEFAULT_MORNING = [
  'Drink a glass of water 💧',
  'Stretch for 2 minutes 🧘',
  'Eat something (even small) 🍎',
  'Brush teeth 🪥',
  'Check today\'s tasks ✨',
];

const DEFAULT_EVENING = [
  'Put phone down 30 min before bed 📱',
  'Wash face 🧴',
  'Write one good thing from today 📝',
  'Brush teeth 🪥',
  'Deep breaths in bed 🌙',
];

function RoutinePage() {
  const [routines, setRoutines] = useState(getRoutines());
  const [adding, setAdding] = useState(null);
  const [newItem, setNewItem] = useState('');

  const today = new Date().toDateString();
  const completed = routines.completedToday?.date === today ? routines.completedToday.items || {} : {};

  useEffect(() => {
    if (routines.morning.length === 0 && routines.evening.length === 0) {
      const initial = { morning: DEFAULT_MORNING, evening: DEFAULT_EVENING, completedToday: { date: today, items: {} } };
      setRoutines(initial);
      saveRoutines(initial);
    }
  }, []);

  const toggleItem = (type, index) => {
    const key = `${type}-${index}`;
    const newCompleted = { ...completed, [key]: !completed[key] };
    const updated = { ...routines, completedToday: { date: today, items: newCompleted } };

    if (!completed[key]) {
      addPetals(1);
    }

    setRoutines(updated);
    saveRoutines(updated);
  };

  const addItem = (type) => {
    if (!newItem.trim()) return;
    const updated = { ...routines, [type]: [...routines[type], newItem.trim()] };
    setRoutines(updated);
    saveRoutines(updated);
    setNewItem('');
    setAdding(null);
  };

  const removeItem = (type, index) => {
    const updated = { ...routines, [type]: routines[type].filter((_, i) => i !== index) };
    setRoutines(updated);
    saveRoutines(updated);
  };

  const getProgress = (type) => {
    const items = routines[type] || [];
    if (items.length === 0) return 0;
    const done = items.filter((_, i) => completed[`${type}-${i}`]).length;
    return Math.round((done / items.length) * 100);
  };

  const renderRoutine = (type, title, Icon) => {
    const items = routines[type] || [];
    const progress = getProgress(type);

    return (
      <div className="routine-section card">
        <div className="routine-header">
          <div className="routine-title-row">
            <Icon size={18} color="var(--lavender-dark)" />
            <h3>{title}</h3>
          </div>
          <span className="routine-progress">{progress}%</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {progress === 100 && (
          <div className="routine-complete">✨ All done! You're amazing!</div>
        )}

        <div className="routine-items">
          {items.map((item, i) => {
            const key = `${type}-${i}`;
            const isDone = completed[key];
            return (
              <div key={i} className={`routine-item ${isDone ? 'done' : ''}`}>
                <button
                  className={`routine-check ${isDone ? 'checked' : ''}`}
                  onClick={() => toggleItem(type, i)}
                  aria-label={isDone ? `Uncheck ${item}` : `Check ${item}`}
                >
                  {isDone && <Check size={12} />}
                </button>
                <span className={`routine-text ${isDone ? 'completed' : ''}`}>{item}</span>
                <button className="routine-remove" onClick={() => removeItem(type, i)} aria-label={`Remove ${item}`}>
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {adding === type ? (
          <div className="add-routine-row">
            <input
              className="input-field"
              placeholder="Add a step..."
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem(type)}
              autoFocus
            />
            <button className="add-confirm" onClick={() => addItem(type)}>Add</button>
            <button className="add-cancel" onClick={() => { setAdding(null); setNewItem(''); }}>Cancel</button>
          </div>
        ) : (
          <button className="add-step-btn" onClick={() => setAdding(type)}>
            <Plus size={14} /> Add step
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="routine-page">
      <header className="page-header">
        <h1>My Routines</h1>
        <p className="page-subtitle">Small consistent steps build big change 🌱</p>
      </header>

      {renderRoutine('morning', 'Morning Routine', Sun)}
      {renderRoutine('evening', 'Evening Routine', Moon)}

      <p className="routine-tip">💡 Routines reset each day. Earn petals for each step you complete!</p>
    </div>
  );
}

export default RoutinePage;
