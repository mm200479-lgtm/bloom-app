import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageCircle, Shield, Heart } from 'lucide-react';
import { getSafetyPlan } from '../utils/storage';
import './EmergencyPage.css';

const BREATH_PHASES = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'];
const BREATH_DURATIONS = [4000, 4000, 4000, 4000];

function EmergencyPage({ onBack }) {
  const [safetyPlan, setSafetyPlan] = useState(null);
  const [breathPhase, setBreathPhase] = useState(-1);
  const [breathCount, setBreathCount] = useState(0);
  const [groundingStarted, setGroundingStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => { setSafetyPlan(getSafetyPlan()); }, []);

  const startBreathing = () => {
    setBreathPhase(0);
    setBreathCount(0);
    runBreathCycle(0);
  };

  const runBreathCycle = (phase) => {
    timerRef.current = setTimeout(() => {
      const next = (phase + 1) % 4;
      if (next === 0) setBreathCount(c => c + 1);
      setBreathPhase(next);
      runBreathCycle(next);
    }, BREATH_DURATIONS[phase]);
  };

  const stopBreathing = () => {
    clearTimeout(timerRef.current);
    setBreathPhase(-1);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const contacts = safetyPlan?.safeContacts || [];

  return (
    <div className="emergency-page">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <div className="emergency-header">
        <Shield size={32} />
        <h1>I need help NOW</h1>
      </div>

      <div className="crisis-numbers">
        <a href="tel:988" className="crisis-btn crisis-988">
          <Phone size={20} />
          <div>
            <strong>988</strong>
            <span>Suicide & Crisis Lifeline</span>
          </div>
        </a>
        <a href="sms:741741&body=HELLO" className="crisis-btn crisis-text">
          <MessageCircle size={20} />
          <div>
            <strong>Text HOME to 741741</strong>
            <span>Crisis Text Line</span>
          </div>
        </a>
        <a href="tel:911" className="crisis-btn crisis-911">
          <Phone size={20} />
          <div>
            <strong>911</strong>
            <span>Emergency</span>
          </div>
        </a>
      </div>

      {contacts.length > 0 && (
        <div className="safe-contacts-section">
          <h3 className="section-title">My safe people</h3>
          <div className="safe-contact-list">
            {contacts.map((c, i) => (
              <a key={i} href={`sms:${c.phone || ''}`} className="safe-contact-btn card">
                <Heart size={16} /> {c.name || c}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grounding-section card">
        <h3 className="section-title">Quick grounding</h3>
        {!groundingStarted ? (
          <button className="primary-btn" onClick={() => setGroundingStarted(true)} style={{ width: '100%' }}>
            Start grounding exercise
          </button>
        ) : (
          <div className="grounding-exercise slide-up">
            <p className="grounding-prompt">Name <strong>5 things</strong> you can see right now.</p>
            <p className="grounding-prompt">Name <strong>4 things</strong> you can touch.</p>
            <p className="grounding-prompt">Name <strong>3 things</strong> you can hear.</p>
            <p className="grounding-prompt">Name <strong>2 things</strong> you can smell.</p>
            <p className="grounding-prompt">Name <strong>1 thing</strong> you can taste.</p>
          </div>
        )}
      </div>

      <div className="breathing-section card">
        <h3 className="section-title">Box breathing</h3>
        {breathPhase === -1 ? (
          <button className="primary-btn" onClick={startBreathing} style={{ width: '100%' }}>
            Start breathing exercise
          </button>
        ) : (
          <div className="breath-box-container slide-up">
            <div className={`breath-box phase-${breathPhase}`}>
              <span className="breath-box-text">{BREATH_PHASES[breathPhase]}</span>
              <span className="breath-box-count">4 seconds</span>
            </div>
            <p className="breath-rounds">{breathCount} breaths completed</p>
            <button className="checkin-nav-btn" onClick={stopBreathing} style={{ margin: '8px auto 0' }}>Stop</button>
          </div>
        )}
      </div>

      <div className="affirmation-banner">
        <p>You are safe. You are here. This will pass.</p>
        <p>You have survived every bad moment so far. 💜</p>
      </div>
    </div>
  );
}

export default EmergencyPage;
