import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Shield, BookOpen, Flower2 } from 'lucide-react';
import './ParentGuidePage.css';

const FEATURES = [
  { title: 'Mood & Check-ins', emoji: '😊', desc: 'Daily mood tracking, energy levels, and sleep quality. Helps identify patterns over time.' },
  { title: 'Journal & Brain Dump', emoji: '📝', desc: 'Private space to write thoughts and feelings. Brain dump is for quick, unfiltered thoughts.' },
  { title: 'Safety Plan & Emergency', emoji: '🛟', desc: 'Crisis resources, grounding exercises, and safe contacts. Available anytime.' },
  { title: 'Garden & Rewards', emoji: '🌸', desc: 'Earn petals for healthy habits. Grow a virtual garden as a visual reward for consistency.' },
  { title: 'Coping Tools', emoji: '🧘', desc: 'Breathing exercises, grounding techniques, fidget tools, and distraction activities.' },
  { title: 'Self-Discovery', emoji: '🪞', desc: 'Values explorer, strengths finder, identity map — tools for building self-awareness.' },
  { title: 'Relationships', emoji: '💜', desc: 'Safe people profiles, boundary builder, and social scripts for difficult conversations.' },
  { title: 'Therapist Report', emoji: '📋', desc: 'Generates a summary of mood, sleep, and activity data to share with a therapist.' },
];

const TIPS = [
  { emoji: '📖', title: "Don't read their journal", desc: "The journal is a private space. Respecting that privacy builds trust. If you're worried, ask them directly how they're feeling." },
  { emoji: '🌸', title: 'Ask about their garden', desc: "\"How's your garden doing?\" is a gentle way to check in on their wellness habits without being intrusive." },
  { emoji: '🔥', title: 'Celebrate streaks together', desc: "When they hit a streak milestone, acknowledge it. \"I noticed you've been checking in every day — that's awesome.\"" },
  { emoji: '🤝', title: 'Let them show you features', desc: "Ask them to give you a tour of the app. It shows interest without hovering." },
  { emoji: '💬', title: 'Use it as a conversation starter', desc: "\"I saw the app has a values explorer — what values did you pick?\" opens doors without pressure." },
  { emoji: '🛟', title: 'Review the safety plan together', desc: "Help them fill out the safety plan. Know who their safe contacts are. This is a team effort." },
  { emoji: '⏰', title: "Don't force daily use", desc: "Some days they won't want to check in. That's okay. The app is a tool, not a requirement." },
  { emoji: '💜', title: 'Model vulnerability', desc: "Share your own feelings sometimes. \"I had a tough day too\" goes a long way." },
];

function ParentGuidePage({ onBack }) {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [expandedTip, setExpandedTip] = useState(null);

  return (
    <div className="parent-guide-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Parent Guide 👨‍👩‍👧</h1>
        <p className="page-subtitle">How to support without hovering</p>
      </header>

      <div className="parent-intro card fade-in">
        <Heart size={20} color="var(--lavender-dark)" />
        <p>This app is designed to help your teen build emotional awareness and healthy coping skills. Here's how you can support them.</p>
      </div>

      <div className="parent-section">
        <h3 className="section-title"><BookOpen size={14} /> What each feature does</h3>
        {FEATURES.map((f, i) => (
          <button key={i} className="parent-card card" onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}>
            <div className="parent-card-header">
              <span>{f.emoji} {f.title}</span>
              {expandedFeature === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFeature === i && <p className="parent-card-desc slide-up">{f.desc}</p>}
          </button>
        ))}
      </div>

      <div className="parent-section">
        <h3 className="section-title"><Shield size={14} /> Tips for parents</h3>
        {TIPS.map((t, i) => (
          <button key={i} className="parent-card card" onClick={() => setExpandedTip(expandedTip === i ? null : i)}>
            <div className="parent-card-header">
              <span>{t.emoji} {t.title}</span>
              {expandedTip === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedTip === i && <p className="parent-card-desc slide-up">{t.desc}</p>}
          </button>
        ))}
      </div>

      <div className="parent-footer card">
        <Flower2 size={20} color="var(--sage-dark)" />
        <p>Remember: the goal isn't to monitor — it's to support. Your teen is building skills that will last a lifetime. 💜</p>
      </div>
    </div>
  );
}

export default ParentGuidePage;
