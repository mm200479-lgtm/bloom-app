import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Clock, Sparkles } from 'lucide-react';
import { getTasks, saveTasks } from '../utils/storage';
import './TasksPage.css';

const ENCOURAGEMENTS = [
  "You did it! 🎉",
  "One step at a time! ✨",
  "Look at you go! 💪",
  "That's progress! 🌟",
  "Proud of you! 💜",
  "Crushing it! 🌸",
];

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [celebrating, setCelebrating] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const save = (updated) => {
    setTasks(updated);
    saveTasks(updated);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      done: false,
      createdAt: new Date().toISOString(),
      size: 'small',
    };
    save([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        if (!t.done) {
          const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
          setCelebrating(msg);
          setTimeout(() => setCelebrating(null), 2000);
        }
        return { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null };
      }
      return t;
    });
    save(updated);
  };

  const deleteTask = (id) => {
    save(tasks.filter(t => t.id !== id));
  };

  const setSize = (id, size) => {
    save(tasks.map(t => t.id === id ? { ...t, size } : t));
  };

  const filtered = tasks.filter(t => {
    if (filter === 'todo') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const completedToday = tasks.filter(t =>
    t.done && t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="tasks-page">
      <header className="page-header">
        <h1>My Tasks</h1>
        <p className="page-subtitle">Break it down, one small thing at a time ✨</p>
      </header>

      {celebrating && (
        <div className="celebration slide-up" role="status" aria-live="polite">
          {celebrating}
        </div>
      )}

      {completedToday > 0 && (
        <div className="today-progress fade-in">
          <Sparkles size={16} color="var(--warning)" />
          <span>You completed {completedToday} task{completedToday > 1 ? 's' : ''} today!</span>
        </div>
      )}

      <div className="add-task-row">
        <input
          type="text"
          className="add-task-input"
          placeholder="Add a small, doable task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          aria-label="New task"
        />
        <button className="add-task-btn" onClick={addTask} aria-label="Add task">
          <Plus size={20} />
        </button>
      </div>

      <div className="task-tip">
        💡 Tip: Make tasks tiny! Instead of "clean room" try "pick up 5 things"
      </div>

      <div className="filter-row">
        {['all', 'todo', 'done'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'todo' ? 'To do' : 'Done'}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filtered.length === 0 ? (
          <p className="empty-state">
            {filter === 'done' ? 'Nothing completed yet — you\'ll get there! 🌱' :
             filter === 'todo' ? 'All done! Take a break 🎉' :
             'Add your first task above! Start small 🌸'}
          </p>
        ) : (
          filtered.map(task => (
            <div key={task.id} className={`task-item ${task.done ? 'done' : ''} fade-in`}>
              <button
                className={`task-check ${task.done ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
                aria-label={task.done ? `Mark "${task.text}" as not done` : `Complete "${task.text}"`}
              >
                {task.done && <Check size={14} />}
              </button>
              <div className="task-content">
                <span className={`task-text ${task.done ? 'completed' : ''}`}>{task.text}</span>
                <div className="task-meta">
                  <div className="size-pills">
                    {['tiny', 'small', 'medium'].map(s => (
                      <button
                        key={s}
                        className={`size-pill ${task.size === s ? 'active' : ''}`}
                        onClick={() => setSize(task.id, s)}
                        aria-label={`Set task size to ${s}`}
                      >
                        {s === 'tiny' ? '🟢' : s === 'small' ? '🟡' : '🟠'} {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="task-delete"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete "${task.text}"`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TasksPage;
