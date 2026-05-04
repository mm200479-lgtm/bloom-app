import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Droplets, Pill, Moon, Zap, Smile } from 'lucide-react';
import { addMood, addEnergyLog, addSleepLog, getMeds, saveMeds, getWaterLog, saveWaterLog, addPetals, updateStreaks } from '../utils/storage';
import './DailyCheckinPage.css';

const MOOD_EMOJIS = [
  { emoji: '😊', label: 'Happy' }, { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Okay' }, { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Angry' }, { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' }, { emoji: '🥰', label: 'Loved' },
  { emoji: '😢', label: 'Crying' }, { emoji: '🤗', label: 'Grateful' },
  { emoji: '😖', label: 'Stressed' }, { emoji: '🤩', label: 'Excited' },
];

const STEPS = ['Mood', 'Energy', 'Sleep', 'Meds', 'Water', 'Word'];

function DailyCheckinPage({ onBack }) {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [medsTaken, setMedsTaken] = useState(null);
  const [waterCups, setWaterCups] = useState(0);
  const [word, setWord] = useState('');
  const [done, setDone] = useState(false);

  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = () => {
    if (step === 0) return mood !== null;
    if (step === 3) return medsTaken !== null;
    if (step === 5) return word.trim().length > 0;
    return true;
  };

  const handleFinish = () => {
    addMood({ mood: mood.emoji, label: mood.label });
    addEnergyLog(energy, '');
    addSleepLog({ quality: sleep });
    const medsData = getMeds();
    medsData.logs = medsData.logs || [];
    medsData.logs.unshift({ date: new Date().toISOString(), taken: medsTaken });
    saveMeds(medsData);
    const waterData = getWaterLog();
    waterData.date = new Date().toDateString();
    waterData.cups = waterCups;
    saveWaterLog(waterData);
    addPetals(5);
    updateStreaks();
    setDone(true);
  };

  if (done) {
    return (
      <div className="checkin-page">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="checkin-done slide-up">
          <span className="checkin-done-emoji">🌸</span>
          <h2>Check-in complete!</h2>
          <p>You earned <strong>5 petals</strong> for showing up today.</p>
          <p className="checkin-word-display">Your word for today: <strong>{word}</strong></p>
          <button className="primary-btn" onClick={onBack} style={{ marginTop: 16 }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkin-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Daily Check-in 🌅</h1>
        <p className="page-subtitle">A few minutes to check in with yourself</p>
      </header>

      <div className="checkin-progress">
        <div className="checkin-progress-bar">
          <div className="checkin-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="checkin-step-label">Step {step + 1} of {STEPS.length}: {STEPS[step]}</span>
      </div>

      <div className="checkin-step slide-up" key={step}>
        {step === 0 && (
          <div className="checkin-section">
            <h2 className="section-title"><Smile size={18} /> How are you feeling?</h2>
            <div className="mood-grid">
              {MOOD_EMOJIS.map(m => (
                <button key={m.label} className={`mood-btn ${mood?.label === m.label ? 'selected' : ''}`} onClick={() => setMood(m)}>
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="checkin-section">
            <h2 className="section-title"><Zap size={18} /> Energy level?</h2>
            <p className="checkin-hint">1 = running on empty, 5 = fully charged</p>
            <div className="level-selector">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className={`level-btn ${energy === n ? 'selected' : ''}`} onClick={() => setEnergy(n)}>
                  {n === 1 ? '🪫' : n === 2 ? '🔋' : n === 3 ? '⚡' : n === 4 ? '💪' : '🚀'}
                  <span>{n}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkin-section">
            <h2 className="section-title"><Moon size={18} /> How did you sleep?</h2>
            <div className="star-selector">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className={`star-btn ${sleep >= n ? 'filled' : ''}`} onClick={() => setSleep(n)}>
                  ⭐
                </button>
              ))}
            </div>
            <p className="checkin-hint">{sleep} out of 5 stars</p>
          </div>
        )}

        {step === 3 && (
          <div className="checkin-section">
            <h2 className="section-title"><Pill size={18} /> Meds taken today?</h2>
            <div className="yesno-selector">
              <button className={`yesno-btn ${medsTaken === true ? 'selected yes' : ''}`} onClick={() => setMedsTaken(true)}>
                ✅ Yes
              </button>
              <button className={`yesno-btn ${medsTaken === false ? 'selected no' : ''}`} onClick={() => setMedsTaken(false)}>
                ❌ No
              </button>
              <button className={`yesno-btn ${medsTaken === 'na' ? 'selected na' : ''}`} onClick={() => setMedsTaken('na')}>
                ➖ N/A
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="checkin-section">
            <h2 className="section-title"><Droplets size={18} /> Water today?</h2>
            <div className="water-counter">
              <button className="water-btn" onClick={() => setWaterCups(Math.max(0, waterCups - 1))}>−</button>
              <span className="water-count">{waterCups} 💧</span>
              <button className="water-btn" onClick={() => setWaterCups(waterCups + 1)}>+</button>
            </div>
            <p className="checkin-hint">cups of water</p>
          </div>
        )}

        {step === 5 && (
          <div className="checkin-section">
            <h2 className="section-title">One word for today?</h2>
            <input className="input-field word-input" placeholder="e.g., hopeful, tired, grateful..." value={word} onChange={e => setWord(e.target.value)} maxLength={30} />
          </div>
        )}
      </div>

      <div className="checkin-nav">
        {step > 0 && (
          <button className="checkin-nav-btn" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < STEPS.length - 1 ? (
          <button className="primary-btn" onClick={() => setStep(step + 1)} disabled={!canNext()}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button className="primary-btn" onClick={handleFinish} disabled={!canNext()}>
            <Check size={16} /> Finish
          </button>
        )}
      </div>
    </div>
  );
}

export default DailyCheckinPage;
