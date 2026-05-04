import React, { useState, useEffect } from 'react';
import { Brain, ChevronRight, Trash2, RotateCcw, Check } from 'lucide-react';
import { getThoughtRecords, addThoughtRecord, deleteThoughtRecord } from '../utils/storage';
import './ThoughtPage.css';

const STEPS = [
  { key: 'situation', label: 'Situation', prompt: 'What happened? Describe the situation briefly.', placeholder: 'e.g., My friend didn\'t text me back...' },
  { key: 'thought', label: 'Automatic Thought', prompt: 'What thought popped into your head?', placeholder: 'e.g., They must be mad at me...' },
  { key: 'emotion', label: 'Emotion (1-10)', prompt: 'What emotion did you feel? How intense? (1 = barely, 10 = overwhelming)', placeholder: 'e.g., Anxious', isEmotion: true },
  { key: 'evidenceFor', label: 'Evidence For', prompt: 'What evidence supports this thought?', placeholder: 'e.g., They usually reply quickly...' },
  { key: 'evidenceAgainst', label: 'Evidence Against', prompt: 'What evidence goes against this thought?', placeholder: 'e.g., They mentioned being busy today...' },
  { key: 'balanced', label: 'Balanced Thought', prompt: 'What\'s a more balanced way to see this?', placeholder: 'e.g., They\'re probably just busy. I can check in later.' },
  { key: 'newEmotion', label: 'New Emotion (1-10)', prompt: 'How do you feel now? Rate the intensity again.', placeholder: 'e.g., Calmer', isEmotion: true },
];

function ThoughtPage({ onBack }) {
  const [records, setRecords] = useState([]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [intensity, setIntensity] = useState(5);
  const [newIntensity, setNewIntensity] = useState(5);
  const [showWizard, setShowWizard] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setRecords(getThoughtRecords()); }, []);

  const currentStep = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      if (currentStep.isEmotion) {
        const intVal = step === 2 ? intensity : newIntensity;
        setForm({ ...form, [currentStep.key]: form[currentStep.key] || '', [`${currentStep.key}Intensity`]: intVal });
      }
      setStep(step + 1);
    } else {
      // Save
      const record = {
        ...form,
        emotionIntensity: form.emotionIntensity || intensity,
        newEmotionIntensity: newIntensity,
      };
      const updated = addThoughtRecord(record);
      setRecords(updated);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowWizard(false);
        setStep(0);
        setForm({});
        setIntensity(5);
        setNewIntensity(5);
      }, 2500);
    }
  };

  const handleDelete = (id) => {
    setRecords(deleteThoughtRecord(id));
  };

  const startWizard = () => {
    setShowWizard(true);
    setStep(0);
    setForm({});
    setIntensity(5);
    setNewIntensity(5);
  };

  return (
    <div className="thought-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Thought Challenger 🧠</h1>
        <p className="page-subtitle">Challenge the thoughts that aren't serving you</p>
      </header>

      {saved ? (
        <div className="thought-saved slide-up">
          <Check size={24} />
          <p>Thought record saved! You just did something really powerful. 💪</p>
        </div>
      ) : showWizard ? (
        <div className="thought-wizard card fade-in">
          <div className="wizard-progress">
            {STEPS.map((_, i) => (
              <span key={i} className={`progress-dot ${i <= step ? 'active' : ''} ${i === step ? 'current' : ''}`} />
            ))}
          </div>
          <span className="wizard-step-label">Step {step + 1} of {STEPS.length}</span>
          <h3 className="wizard-title">{currentStep.label}</h3>
          <p className="wizard-prompt">{currentStep.prompt}</p>

          <textarea
            className="input-field"
            rows={3}
            placeholder={currentStep.placeholder}
            value={form[currentStep.key] || ''}
            onChange={e => setForm({ ...form, [currentStep.key]: e.target.value })}
          />

          {currentStep.isEmotion && (
            <div className="intensity-slider">
              <span className="intensity-label">Intensity</span>
              <input
                type="range"
                min="1"
                max="10"
                value={step === 2 ? intensity : newIntensity}
                onChange={e => step === 2 ? setIntensity(Number(e.target.value)) : setNewIntensity(Number(e.target.value))}
                className="slider"
              />
              <span className="intensity-value">{step === 2 ? intensity : newIntensity}/10</span>
            </div>
          )}

          <div className="wizard-actions">
            {step > 0 && (
              <button className="back-btn" onClick={() => setStep(step - 1)}>Back</button>
            )}
            <button className="primary-btn" onClick={handleNext}>
              {step === STEPS.length - 1 ? 'Save record' : 'Next'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button className="primary-btn start-btn" onClick={startWizard}>
          <Brain size={16} /> Start a thought record
        </button>
      )}

      {records.length > 0 && (
        <div className="thought-history">
          <h3 className="section-title">Past records ({records.length})</h3>
          {records.map(r => (
            <div key={r.id} className="thought-record card fade-in">
              <div className="record-header">
                <span className="record-date">
                  {new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}><Trash2 size={12} /></button>
              </div>
              <div className="record-field">
                <span className="field-label">Situation</span>
                <span className="field-value">{r.situation}</span>
              </div>
              <div className="record-field">
                <span className="field-label">Thought</span>
                <span className="field-value">{r.thought}</span>
              </div>
              <div className="record-emotions">
                <span className="emotion-badge">Before: {r.emotionIntensity}/10</span>
                <span className="emotion-arrow">→</span>
                <span className="emotion-badge after">After: {r.newEmotionIntensity}/10</span>
              </div>
              <div className="record-field">
                <span className="field-label">Balanced thought</span>
                <span className="field-value balanced">{r.balanced}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showWizard && records.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>💭</span>
          <p>Thoughts aren't facts. This tool helps you examine them.</p>
        </div>
      )}
    </div>
  );
}

export default ThoughtPage;
