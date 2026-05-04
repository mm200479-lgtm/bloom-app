import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Play, Check, Edit3, RotateCcw } from 'lucide-react';
import { getBadDayProtocol, saveBadDayProtocol } from '../utils/storage';
import './BadDayPage.css';

const DEFAULT_STEPS = [
  { id: 1, text: 'Take 3 deep breaths', emoji: '🫁' },
  { id: 2, text: 'Drink a glass of water', emoji: '💧' },
  { id: 3, text: 'Text someone you trust', emoji: '💬' },
  { id: 4, text: 'Do one grounding exercise (5-4-3-2-1)', emoji: '🌿' },
  { id: 5, text: 'Be kind to yourself — you\'re doing your best', emoji: '💜' },
];

function BadDayPage({ onBack }) {
  const [steps, setSteps] = useState([]);
  const [activeMode, setActiveMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    const saved = getBadDayProtocol();
    if (saved.length === 0) {
      saveBadDayProtocol(DEFAULT_STEPS);
      setSteps(DEFAULT_STEPS);
    } else {
      setSteps(saved);
    }
  }, []);

  const addStep = () => {
    if (!newStep.trim()) return;
    const updated = [...steps, { id: Date.now(), text: newStep.trim(), emoji: '✨' }];
    saveBadDayProtocol(updated);
    setSteps(updated);
    setNewStep('');
  };

  const deleteStep = (id) => {
    const updated = steps.filter(s => s.id !== id);
    saveBadDayProtocol(updated);
    setSteps(updated);
  };

  const activateProtocol = () => {
    setActiveMode(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const completeCurrentStep = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const allDone = completedSteps.length === steps.length;

  if (activeMode) {
    return (
      <div className="badday-page">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="protocol-active">
          <div className="protocol-progress-bar">
            <div className="protocol-progress-fill" style={{ width: `${(completedSteps.length / steps.length) * 100}%` }} />
          </div>

          {!allDone ? (
            <div className="protocol-step-active slide-up" key={currentStep}>
              <span className="protocol-step-emoji">{steps[currentStep]?.emoji}</span>
              <p className="protocol-step-text">{steps[currentStep]?.text}</p>
              <p className="protocol-step-count">Step {currentStep + 1} of {steps.length}</p>
              <button className="primary-btn" onClick={completeCurrentStep} style={{ marginTop: 16 }}>
                <Check size={16} /> Done — next step
              </button>
            </div>
          ) : (
            <div className="protocol-complete slide-up">
              <span style={{ fontSize: 48 }}>🌸</span>
              <h2>You did it.</h2>
              <p>You followed your protocol. That takes real strength.</p>
              <p>Be proud of yourself. 💜</p>
              <button className="primary-btn" onClick={() => setActiveMode(false)} style={{ marginTop: 16 }}>
                Back to protocol
              </button>
            </div>
          )}

          <div className="protocol-steps-mini">
            {steps.map((s, i) => (
              <span key={s.id} className={`step-dot ${completedSteps.includes(i) ? 'done' : i === currentStep ? 'current' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="badday-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Bad Day Protocol 🛟</h1>
        <p className="page-subtitle">Your personalized plan for tough moments</p>
      </header>

      <button className="protocol-activate-btn" onClick={activateProtocol}>
        <Play size={18} /> Activate protocol
      </button>

      <div className="protocol-edit-header">
        <h3 className="section-title">Your steps ({steps.length})</h3>
        <button className="identity-suggest-btn" onClick={() => setEditing(!editing)}>
          <Edit3 size={14} /> {editing ? 'Done editing' : 'Edit'}
        </button>
      </div>

      <div className="protocol-steps">
        {steps.map((s, i) => (
          <div key={s.id} className="protocol-step fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="protocol-num">{i + 1}</span>
            <span className="protocol-step-icon">{s.emoji}</span>
            <span className="protocol-step-label">{s.text}</span>
            {editing && (
              <button className="delete-btn" onClick={() => deleteStep(s.id)} aria-label="Delete"><Trash2 size={12} /></button>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="protocol-add slide-up">
          <input className="input-field" placeholder="Add a new step..." value={newStep} onChange={e => setNewStep(e.target.value)} onKeyDown={e => e.key === 'Enter' && addStep()} />
          <button className="primary-btn" onClick={addStep} style={{ marginTop: 6 }}>
            <Plus size={14} /> Add step
          </button>
        </div>
      )}

      <button className="protocol-reset-btn" onClick={() => { saveBadDayProtocol(DEFAULT_STEPS); setSteps(DEFAULT_STEPS); }}>
        <RotateCcw size={14} /> Reset to default
      </button>
    </div>
  );
}

export default BadDayPage;
