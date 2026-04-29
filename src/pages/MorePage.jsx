import React from 'react';
import {
  BookHeart, Shield, Clock, Timer, Heart, Compass, Volume2,
  AlertTriangle, Zap, Camera, Battery, Trophy, Flower2, Settings, Download
} from 'lucide-react';
import './MorePage.css';

const SECTIONS = [
  {
    title: 'Journaling & Reflection',
    items: [
      { id: 'journal', label: 'Journal', desc: 'Write, prompt, gratitude, worry dump', icon: BookHeart, emoji: '📝' },
      { id: 'photos', label: 'Photo Journal', desc: 'One photo a day', icon: Camera, emoji: '📸' },
      { id: 'wins', label: 'Win Jar', desc: 'Save your victories', icon: Trophy, emoji: '🏆' },
    ]
  },
  {
    title: 'Coping & Calming',
    items: [
      { id: 'coping', label: 'Coping Cards', desc: 'Swipeable coping strategies', icon: Heart, emoji: '💜' },
      { id: 'emotions', label: 'Emotion Wheel', desc: 'Name what you feel', icon: Compass, emoji: '🎯' },
      { id: 'sounds', label: 'Sound Machine', desc: 'Rain, ocean, white noise', icon: Volume2, emoji: '🎵' },
      { id: 'safety', label: 'Safety Plan', desc: 'Crisis contacts & coping tools', icon: Shield, emoji: '🛡️' },
    ]
  },
  {
    title: 'Tracking & Growth',
    items: [
      { id: 'routines', label: 'Routines', desc: 'Morning & evening checklists', icon: Clock, emoji: '⏰' },
      { id: 'pomodoro', label: 'Focus Timer', desc: 'Pomodoro for ADHD brains', icon: Timer, emoji: '🍅' },
      { id: 'energy', label: 'Energy Tracker', desc: 'Track your energy levels', icon: Battery, emoji: '🔋' },
      { id: 'triggers', label: 'Trigger Log', desc: 'Spot patterns with your therapist', icon: AlertTriangle, emoji: '📋' },
      { id: 'activity', label: 'Activity Ideas', desc: 'Gentle nudges when you\'re stuck', icon: Zap, emoji: '💡' },
    ]
  },
  {
    title: 'Rewards & Settings',
    items: [
      { id: 'garden', label: 'My Garden', desc: 'Grow flowers with your progress', icon: Flower2, emoji: '🌸' },
      { id: 'settings', label: 'Settings', desc: 'Theme, colors, export data', icon: Settings, emoji: '⚙️' },
    ]
  },
];

function MorePage({ onNavigate }) {
  return (
    <div className="more-page">
      <header className="page-header">
        <h1>Everything</h1>
        <p className="page-subtitle">All your tools in one place 🌸</p>
      </header>

      {SECTIONS.map(section => (
        <div key={section.title} className="more-section fade-in">
          <h3 className="section-title">{section.title}</h3>
          <div className="more-grid">
            {section.items.map(item => (
              <button
                key={item.id}
                className="more-item"
                onClick={() => onNavigate(item.id)}
              >
                <span className="more-emoji">{item.emoji}</span>
                <div className="more-text">
                  <span className="more-label">{item.label}</span>
                  <span className="more-desc">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MorePage;
