import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ChevronDown, ChevronUp, Calendar, Sparkles } from 'lucide-react';
import { getHomework, saveHomework, addPetals } from '../utils/storage';
import './HomeworkPage.css';

const SUBJECTS = [
  { name: 'Math', emoji: '🔢', color: '#e88a8a' },
  { name: 'English', emoji: '📖', color: '#8ab8d8' },
  { name: 'Science', emoji: '🔬', color: '#8ac8a0' },
  { name: 'History', emoji: '🏛️', color: '#e8c88a' },
  { name: 'Art', emoji: '🎨', color: '#c8a0d8' },
  { name: 'Other', emoji: '📝', color: '#b8b8b8' },
];

const ENCOURAGEMENTS = [
  "You did it! 🎉", "One less thing to worry about! ✨",
  "Look at you being responsible! 💪", "That's progress! 🌟",
  "Proud of you! 💜", "Crushing it! 🌸",
];

function HomeworkPage() {
  const [assignments, setAssignments] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [celebrating, setCelebrating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [subject, setSubject] = useState('Math');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [steps, setSteps] = useState(['']);

  useEffect(() => { setAssignments(getHomework()); }, []);

  const save = (updated) => { setAssignments(updated); saveHomework(updated); };

  const getStartByDate = (due) => {
    const d = new Date(due);
    d.setDate(d.getDate() - 3);
    return d.toISOString().split('T')[0];
  };

  const addAssignment = () => {
    if (!description.trim() || !dueDate) return;
    const subjectInfo = SUBJECTS.find(s => s.name === subject);
    const assignment = {
      id: Date.now(),
      subject,
      emoji: subjectInfo?.emoji || '📝',
      color: subjectInfo?.color || '#b8b8b8',
      description: description.trim(),
      dueDate,
      startByDate: getStartByDate(dueDate),
      steps: steps.filter(s => s.trim()).map((s, i) => ({ id: i, text: s.trim(), done: false })),
      done: false,
      timestamp: new Date().toISOString(),
    };
    save([assignment, ...assignments]);
    setDescription(''); setDueDate(''); setSteps(['']); setShowAdd(false);
  };

  const toggleDone = (id) => {
    const updated = assignments.map(a => {
      if (a.id === id) {
        if (!a.done) {
          const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
          setCelebrating(msg);
          addPetals(3);
          setTimeout(() => setCelebrating(null), 2500);
        }
        return { ...a, done: !a.done, completedAt: !a.done ? new Date().toISOString() : null };
      }
      return a;
    });
    save(updated);
  };

  const toggleStep = (assignmentId, stepId) => {
    const updated = assignments.map(a => {
      if (a.id === assignmentId) {
        const newSteps = a.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s);
        return { ...a, steps: newSteps };
      }
      return a;
    });
    save(updated);
  };

  const deleteAssignment = (id) => {
    save(assignments.filter(a => a.id !== id));
  };

  const addStepField = () => setSteps([...steps, '']);
  const updateStep = (i, val) => {
    const updated = [...steps];
    updated[i] = val;
    setSteps(updated);
  };

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filtered = assignments.filter(a => {
    if (filter === 'upcoming') return !a.done && a.dueDate >= todayStr;
    if (filter === 'overdue') return !a.done && a.dueDate < todayStr;
    if (filter === 'done') return a.done;
    return true;
  });

  const overdueCount = assignments.filter(a => !a.done && a.dueDate < todayStr).length;

  return (
    <div className="homework-page">
      <header className="page-header">
        <h1>Homework Planner 📚</h1>
        <p className="page-subtitle">Break it down, plan ahead, get it done</p>
      </header>

      {celebrating && (
        <div className="hw-celebration slide-up" role="status" aria-live="polite">
          <Sparkles size={16} /> {celebrating} +3 petals 🌸
        </div>
      )}

      <div className="hw-filter-row">
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'overdue', label: `Overdue${overdueCount > 0 ? ` (${overdueCount})` : ''}` },
          { key: 'done', label: 'Done' },
        ].map(f => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'active' : ''} ${f.key === 'overdue' && overdueCount > 0 ? 'has-overdue' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {showAdd ? (
        <div className="hw-add-form card slide-up">
          <h3 className="section-title">New assignment</h3>

          <div className="subject-picker">
            {SUBJECTS.map(s => (
              <button
                key={s.name}
                className={`subject-btn ${subject === s.name ? 'active' : ''}`}
                style={subject === s.name ? { background: s.color, borderColor: s.color } : {}}
                onClick={() => setSubject(s.name)}
              >
                <span>{s.emoji}</span>
                <span className="subject-label">{s.name}</span>
              </button>
            ))}
          </div>

          <input
            className="input-field"
            placeholder="What's the assignment?"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className="hw-date-row">
            <div className="hw-date-field">
              <label><Calendar size={12} /> Due date</label>
              <input type="date" className="input-field" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            {dueDate && (
              <div className="hw-date-field fade-in">
                <label>Start by</label>
                <span className="start-by-date">{new Date(getStartByDate(dueDate)).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          <div className="hw-steps-section">
            <label className="steps-label">Break into steps (optional)</label>
            {steps.map((s, i) => (
              <input
                key={i}
                className="input-field step-input"
                placeholder={`Step ${i + 1}`}
                value={s}
                onChange={e => updateStep(i, e.target.value)}
              />
            ))}
            <button className="add-step-btn" onClick={addStepField}>+ Add step</button>
          </div>

          <div className="hw-form-actions">
            <button className="primary-btn" onClick={addAssignment}>Add assignment</button>
            <button className="secondary-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="primary-btn hw-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add assignment
        </button>
      )}

      <div className="hw-list">
        {filtered.length === 0 ? (
          <p className="empty-state">
            {filter === 'done' ? 'Nothing completed yet — you\'ll get there! 🌱' :
             filter === 'overdue' ? 'Nothing overdue! You\'re on top of it 🎉' :
             'No upcoming assignments. Enjoy the break! 🌸'}
          </p>
        ) : (
          filtered.map(a => {
            const isExpanded = expandedId === a.id;
            const stepsComplete = a.steps?.filter(s => s.done).length || 0;
            const totalSteps = a.steps?.length || 0;
            const isOverdue = !a.done && a.dueDate < todayStr;
            const shouldStart = !a.done && a.startByDate <= todayStr && a.dueDate >= todayStr;

            return (
              <div
                key={a.id}
                className={`hw-item ${a.done ? 'done' : ''} ${isOverdue ? 'overdue' : ''} fade-in`}
                style={{ borderLeftColor: a.color }}
              >
                <div className="hw-item-header" onClick={() => setExpandedId(isExpanded ? null : a.id)}>
                  <button
                    className={`hw-check ${a.done ? 'checked' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleDone(a.id); }}
                    aria-label={a.done ? 'Unmark complete' : 'Mark complete'}
                  >
                    {a.done && <Check size={14} />}
                  </button>
                  <div className="hw-item-info">
                    <span className="hw-subject" style={{ color: a.color }}>
                      {a.emoji} {a.subject}
                    </span>
                    <span className={`hw-desc ${a.done ? 'completed' : ''}`}>{a.description}</span>
                    <span className="hw-due">
                      {isOverdue && '⚠️ '}
                      {shouldStart && '🟡 Start now · '}
                      Due {new Date(a.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      {totalSteps > 0 && ` · ${stepsComplete}/${totalSteps} steps`}
                    </span>
                  </div>
                  <div className="hw-item-actions">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="hw-item-expanded slide-up">
                    {a.startByDate && (
                      <p className="hw-start-by">
                        📅 Start by: {new Date(a.startByDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                    {totalSteps > 0 && (
                      <div className="hw-steps">
                        {a.steps.map(step => (
                          <div key={step.id} className={`hw-step ${step.done ? 'done' : ''}`}>
                            <button
                              className={`step-check ${step.done ? 'checked' : ''}`}
                              onClick={() => toggleStep(a.id, step.id)}
                            >
                              {step.done && <Check size={10} />}
                            </button>
                            <span className={step.done ? 'completed' : ''}>{step.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="delete-btn hw-delete" onClick={() => deleteAssignment(a.id)}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default HomeworkPage;
