import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Brain, Heart } from 'lucide-react';
import './TestAnxietyPage.css';

const SECTIONS = [
  {
    title: 'Before the Test',
    emoji: '📚',
    icon: BookOpen,
    strategies: [
      { title: 'Break it into chunks', desc: 'Study in 25-minute blocks with 5-minute breaks. Your brain absorbs more in short bursts.' },
      { title: 'Teach it to someone', desc: 'Explain the material out loud — to a friend, a pet, or even a stuffed animal. If you can teach it, you know it.' },
      { title: 'Make a cheat sheet (even if you can\'t use it)', desc: 'The act of writing down key points helps lock them in your memory.' },
      { title: 'Visualize success', desc: 'Close your eyes and picture yourself calmly working through the test. Your brain responds to rehearsal.' },
      { title: 'Prepare your body', desc: 'Sleep well, eat breakfast, drink water. Your brain needs fuel to perform.' },
      { title: 'Set a "worry time"', desc: 'Give yourself 10 minutes to worry, then move on. Containing worry helps it feel less overwhelming.' },
    ],
  },
  {
    title: 'During the Test',
    emoji: '✏️',
    icon: Brain,
    strategies: [
      { title: 'Read everything first', desc: 'Skim the whole test before starting. This gives your brain a roadmap and reduces surprises.' },
      { title: 'Start with what you know', desc: 'Answer the easy questions first. This builds confidence and momentum.' },
      { title: 'Box breathe when stuck', desc: 'Breathe in 4 counts, hold 4, out 4, hold 4. This resets your nervous system in under a minute.' },
      { title: 'Use positive self-talk', desc: 'Replace "I can\'t do this" with "I\'m going to do my best." Words shape your experience.' },
      { title: 'Skip and return', desc: 'If a question is stumping you, mark it and move on. Your subconscious will work on it while you answer others.' },
      { title: 'Ground yourself', desc: 'Feel your feet on the floor. Press your hands on the desk. You are here, you are safe, you can do this.' },
    ],
  },
  {
    title: 'After the Test',
    emoji: '🌸',
    icon: Heart,
    strategies: [
      { title: 'Don\'t replay it', desc: 'Resist the urge to go over every answer. What\'s done is done, and you did your best.' },
      { title: 'Celebrate showing up', desc: 'You took the test. That alone is worth acknowledging. Be proud of yourself.' },
      { title: 'Do something kind for yourself', desc: 'Watch something comforting, eat a snack you love, or take a walk. You earned it.' },
      { title: 'Talk about it (if it helps)', desc: 'Share how you feel with someone you trust. But if comparing answers stresses you out, skip it.' },
      { title: 'Remember: one test ≠ your worth', desc: 'A grade is a snapshot of one day. It doesn\'t define your intelligence or your future.' },
    ],
  },
];

function TestAnxietyPage({ onBack }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (sIdx, cIdx) => {
    const key = `${sIdx}-${cIdx}`;
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="test-anxiety-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Test Anxiety Toolkit 📝</h1>
        <p className="page-subtitle">Strategies that actually help — before, during, and after</p>
      </header>

      {SECTIONS.map((section, sIdx) => (
        <div key={section.title} className="anxiety-section fade-in" style={{ animationDelay: `${sIdx * 0.1}s` }}>
          <h2 className="anxiety-section-title">
            <span>{section.emoji}</span> {section.title}
          </h2>
          <div className="anxiety-cards">
            {section.strategies.map((s, cIdx) => {
              const key = `${sIdx}-${cIdx}`;
              const isOpen = expanded[key];
              return (
                <button key={cIdx} className={`anxiety-card card ${isOpen ? 'open' : ''}`} onClick={() => toggle(sIdx, cIdx)}>
                  <div className="anxiety-card-header">
                    <span className="anxiety-card-title">{s.title}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {isOpen && <p className="anxiety-card-desc slide-up">{s.desc}</p>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TestAnxietyPage;
