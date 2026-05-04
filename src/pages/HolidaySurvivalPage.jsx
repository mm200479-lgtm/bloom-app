import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './HolidaySurvivalPage.css';

const SECTIONS = [
  {
    title: 'Family Gatherings',
    emoji: '👨‍👩‍👧‍👦',
    tips: [
      'Have an exit plan — know where you can go for a break (bathroom, outside, car)',
      'Prepare responses for nosy questions: "I\'m doing well, thanks for asking!"',
      'Bring headphones or a comfort item in your bag',
      'Set a time limit — you don\'t have to stay the whole time',
      'Have a code word with a safe person to signal you need help',
      'Remember: you can love people and still need space from them',
    ],
  },
  {
    title: 'Sensory Overload',
    emoji: '🔊',
    tips: [
      'Step outside for fresh air when it gets too loud',
      'Wear earplugs or noise-canceling earbuds under your hair',
      'Find a quiet room and take 5 minutes to decompress',
      'Focus on one sense at a time — what can you feel right now?',
      'Bring a fidget tool or stress ball in your pocket',
      'It\'s okay to say "I need a minute" and walk away',
    ],
  },
  {
    title: 'Routine Disruption',
    emoji: '📅',
    tips: [
      'Keep one anchor habit — even if everything else changes, do this one thing',
      'Set phone reminders for meds, water, and check-ins',
      'Give yourself permission to not be productive during holidays',
      'Try to maintain your sleep schedule as much as possible',
      'Pack comfort items from home if you\'re traveling',
    ],
  },
  {
    title: 'Emotional Triggers',
    emoji: '💔',
    tips: [
      'It\'s okay to feel sad during "happy" times — your feelings are valid',
      'Have your coping tools ready: breathing exercises, grounding, journaling',
      'Limit social media if seeing other people\'s "perfect" holidays hurts',
      'Write down what you\'re grateful for — even small things count',
      'Remember: holidays are temporary. You will get through this.',
      'Reach out to your safe person if you need support',
    ],
  },
  {
    title: 'Alone Time',
    emoji: '🧘',
    tips: [
      'Being alone during holidays doesn\'t mean something is wrong with you',
      'Create your own traditions — movie marathon, favorite meal, self-care day',
      'Reach out online if you want connection without the pressure of in-person',
      'Use the time to do things you actually enjoy',
      'Check in with yourself: "What do I need right now?"',
    ],
  },
];

function HolidaySurvivalPage({ onBack }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="holiday-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Holiday Survival Guide 🎄</h1>
        <p className="page-subtitle">Strategies for getting through the tough parts</p>
      </header>

      <div className="holiday-intro card fade-in">
        <p>Holidays can be wonderful and overwhelming at the same time. That's normal. Here are some strategies for the hard parts.</p>
      </div>

      {SECTIONS.map((section, i) => (
        <div key={i} className="holiday-section card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
          <button className="holiday-section-header" onClick={() => setExpanded(expanded === i ? null : i)}>
            <span className="holiday-section-title">{section.emoji} {section.title}</span>
            {expanded === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expanded === i && (
            <div className="holiday-tips slide-up">
              {section.tips.map((tip, j) => (
                <div key={j} className="holiday-tip">
                  <span className="holiday-tip-dot">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default HolidaySurvivalPage;
