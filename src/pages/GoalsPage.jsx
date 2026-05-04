import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Target, Trophy, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { getGoals, saveGoals, addPetals } from '../utils/storage';
import './GoalsPage.css';

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [celebrating, setCelebrating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('short');
  const [milestones, setMilestones] = useState(['']);

  useEffect(() => { setGoals(getGoals()); }, []);

  const save = (updated) => { setGoals(updated); saveGoals(updated); };

  const addGoal = () => {
    if (!title.trim()) return;
    const goal = {
      id: Date.now(),
      title: title.trim(),
      type,
      milestones: milestones.filter(m => m.trim()).map((m, i) => ({ id: i, text: m.trim(), done: false })),
      done: false,
      timestamp: new Date().toISOString(),
    };
    save([goal, ...goals]);
    setTitle(''); setMilestones(['']); setShowAdd(false);
  };

  const toggleMilestone = (goalId, milestoneId) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const newMilestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        const allDone = newMilestones.length > 0 && newMilestones.every(m => m.done);
        if (allDone && !g.done) {
          setCelebrating(g.title);
          addPetals(5);
          setTimeout(() => setCelebrating(null), 3000);
        }
        return { ...g, milestones: newMilestones, done: allDone };
      }
      return g;
    });
    save(updated);
  };

  const toggleGoalDone = (goalId) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        if (!g.done) {
          setCelebrating(g.title);
          addPetals(5);
          setTimeout(() => setCelebrating(null), 3000);
        }
        return { ...g, done: !g.done };
      }
      return g;
    });
    save(updated);
  };

  const deleteGoal = (id) => {
    save(goals.filter(g => g.id !== id));
  };

  const addMilestoneField = () => setMilestones([...milestones, '']);
  const updateMilestone = (i, val) => {
    const updated = [...milestones];
    updated[i] = val;
    setMilestones(updated);
  };

  const getProgress = (goal) => {
    if (!goal.milestones || goal.milestones.length === 0) return goal.done ? 100 : 0;
    const done = goal.milestones.filter(m => m.done).length;
    return Math.round((done / goal.milestones.length) * 100);
  };

  const activeGoals = goals.filter(g => !g.done);
  const completedGoals = goals.filter(g => g.done);

  return (
    <div className="goals-page">
      <header className="page-header">
        <h1>Goal Tracker 🎯</h1>
        <p className="page-subtitle">Dream big, start small, keep going</p>
      </header>

      {celebrating && (
        <div className="goal-celebration slide-up" role="status" aria-live="polite">
          <Trophy size={20} color="var(--warning)" />
          <div>
            <span className="celebration-title">Goal achieved!</span>
            <span className="celebration-goal">"{celebrating}" +5 petals 🌸</span>
          </div>
        </div>
      )}

      {showAdd ? (
        <div className="goal-add-form card slide-up">
          <h3 className="section-title">New goal</h3>

          <div className="goal-type-picker">
            <button
              className={`type-btn ${type === 'short' ? 'active' : ''}`}
              onClick={() => setType('short')}
            >
              🏃 Short-term
            </button>
            <button
              className={`type-btn ${type === 'long' ? 'active' : ''}`}
              onClick={() => setType('long')}
            >
              🌟 Long-term
            </button>
          </div>

          <input
            className="input-field"
            placeholder="What's your goal?"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <div className="milestones-section">
            <label className="milestones-label">Milestones (optional)</label>
            {milestones.map((m, i) => (
              <input
                key={i}
                className="input-field milestone-input"
                placeholder={`Milestone ${i + 1}`}
                value={m}
                onChange={e => updateMilestone(i, e.target.value)}
              />
            ))}
            <button className="add-milestone-btn" onClick={addMilestoneField}>+ Add milestone</button>
          </div>

          <div className="goal-form-actions">
            <button className="primary-btn" onClick={addGoal}>Set goal</button>
            <button className="secondary-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="primary-btn goal-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add a goal
        </button>
      )}

      {activeGoals.length > 0 && (
        <div className="goals-section">
          <h3 className="section-title">Active goals ({activeGoals.length})</h3>
          <div className="goal-list">
            {activeGoals.map(goal => {
              const progress = getProgress(goal);
              const isExpanded = expandedId === goal.id;

              return (
                <div key={goal.id} className="goal-item fade-in">
                  <div className="goal-header" onClick={() => setExpandedId(isExpanded ? null : goal.id)}>
                    <div className="goal-icon">
                      {goal.type === 'short' ? <Target size={18} color="var(--sage-dark)" /> : <Sparkles size={18} color="var(--lavender-dark)" />}
                    </div>
                    <div className="goal-info">
                      <span className="goal-type-badge" style={{ background: goal.type === 'short' ? 'var(--sage)' : 'var(--lavender)' }}>
                        {goal.type === 'short' ? '🏃 Short-term' : '🌟 Long-term'}
                      </span>
                      <span className="goal-title">{goal.title}</span>
                      <div className="goal-progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="goal-progress-text">{progress}% complete</span>
                    </div>
                    <div className="goal-expand">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="goal-expanded slide-up">
                      {goal.milestones && goal.milestones.length > 0 ? (
                        <div className="milestone-list">
                          {goal.milestones.map(m => (
                            <div key={m.id} className={`milestone-item ${m.done ? 'done' : ''}`}>
                              <button
                                className={`milestone-check ${m.done ? 'checked' : ''}`}
                                onClick={() => toggleMilestone(goal.id, m.id)}
                              >
                                {m.done && <Check size={10} />}
                              </button>
                              <span className={m.done ? 'completed' : ''}>{m.text}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <button className="primary-btn" onClick={() => toggleGoalDone(goal.id)}>
                          <Check size={16} /> Mark as complete
                        </button>
                      )}
                      <button className="delete-btn goal-delete" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 size={12} /> Remove goal
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="goals-section">
          <h3 className="section-title">Completed 🎉 ({completedGoals.length})</h3>
          <div className="goal-list">
            {completedGoals.map(goal => (
              <div key={goal.id} className="goal-item completed fade-in">
                <div className="goal-header">
                  <Trophy size={18} color="var(--warning)" />
                  <div className="goal-info">
                    <span className="goal-title completed">{goal.title}</span>
                    <span className="goal-completed-date">
                      Completed {new Date(goal.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <button className="delete-btn" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>🎯</span>
          <p>No goals yet. What do you want to work toward?</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
            Start with something small and achievable 💜
          </p>
        </div>
      )}
    </div>
  );
}

export default GoalsPage;
