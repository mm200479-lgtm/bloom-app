import React from 'react';
import './MorePage.css';

const SECTIONS = [
  {
    title: '📊 Tracking & Insights',
    items: [
      { id: 'insights', label: 'Insights Dashboard', desc: 'Mood trends & patterns', emoji: '📊' },
      { id: 'energy', label: 'Energy Tracker', desc: 'Track energy separately', emoji: '🔋' },
      { id: 'sleep', label: 'Sleep Tracker', desc: 'Log sleep & nightmares', emoji: '😴' },
      { id: 'period', label: 'Period Tracker', desc: 'Cycle predictions & PMS', emoji: '🩸' },
      { id: 'social', label: 'Social Battery', desc: 'Track social energy', emoji: '👥' },
      { id: 'triggers', label: 'Trigger Log', desc: 'Spot patterns', emoji: '📋' },
    ]
  },
  {
    title: '📝 Journaling & Reflection',
    items: [
      { id: 'journal', label: 'Journal', desc: 'Write, prompt, gratitude', emoji: '📝' },
      { id: 'photos', label: 'Photo Journal', desc: 'One photo a day', emoji: '📸' },
      { id: 'wins', label: 'Win Jar', desc: 'Save your victories', emoji: '🏆' },
      { id: 'letters', label: 'Letters to Self', desc: 'Future, past, open when...', emoji: '💌' },
      { id: 'dreams', label: 'Dream Journal', desc: 'Log your dreams', emoji: '💭' },
      { id: 'nightmares', label: 'Nightmare Journal', desc: 'Process bad dreams', emoji: '🌙' },
      { id: 'quotes', label: 'Quote Collection', desc: 'Save quotes you love', emoji: '💬' },
      { id: 'braindump', label: 'Brain Dump', desc: 'Get thoughts out', emoji: '🧠' },
    ]
  },
  {
    title: '🧘 Coping & Calming',
    items: [
      { id: 'coping', label: 'Coping Cards', desc: 'Swipeable strategies', emoji: '💜' },
      { id: 'emotions', label: 'Emotion Wheel', desc: 'Name what you feel', emoji: '🎯' },
      { id: 'sounds', label: 'Sound Machine', desc: 'Rain, ocean, noise', emoji: '🎵' },
      { id: 'dbt', label: 'DBT Skills', desc: 'TIPP, DEAR MAN & more', emoji: '🧰' },
      { id: 'thought', label: 'Thought Challenger', desc: 'CBT thought records', emoji: '💡' },
      { id: 'angry', label: 'Anger Thermometer', desc: 'Coping by level', emoji: '🌡️' },
      { id: 'bodymap', label: 'Body Map', desc: 'Where do you feel it?', emoji: '🫀' },
      { id: 'urgesurf', label: 'Urge Surfing', desc: 'Ride the wave timer', emoji: '🏄' },
      { id: 'worrytime', label: 'Worry Time', desc: '15 min allowed worrying', emoji: '⏰' },
      { id: 'distraction', label: 'Distraction Box', desc: 'Quick, medium, long', emoji: '📦' },
      { id: 'sensory', label: 'Sensory Kit', desc: 'Your grounding tools', emoji: '✋' },
    ]
  },
  {
    title: '🛡️ Safety & Support',
    items: [
      { id: 'safety', label: 'Safety Plan', desc: 'Crisis contacts & tools', emoji: '🛡️' },
      { id: 'debrief', label: 'Crisis Debrief', desc: 'Process what happened', emoji: '📋' },
      { id: 'scripts', label: 'Conversation Scripts', desc: 'What to say when...', emoji: '💬' },
    ]
  },
  {
    title: '📚 ADHD & School',
    items: [
      { id: 'routines', label: 'Routines', desc: 'Morning & evening', emoji: '⏰' },
      { id: 'pomodoro', label: 'Focus Timer', desc: 'Pomodoro for ADHD', emoji: '🍅' },
      { id: 'homework', label: 'Homework Planner', desc: 'Assignments & steps', emoji: '📚' },
      { id: 'goals', label: 'Goal Tracker', desc: 'Short & long term', emoji: '🎯' },
      { id: 'appointments', label: 'Appointments', desc: 'Therapy, doctor, school', emoji: '📅' },
      { id: 'meds', label: 'Medication Reminders', desc: 'Track daily meds', emoji: '💊' },
    ]
  },
  {
    title: '💪 Self-Care & Body',
    items: [
      { id: 'selfcare', label: 'Self-Care Tracker', desc: 'Water, meals, movement', emoji: '💧' },
      { id: 'activity', label: 'Activity Ideas', desc: 'Based on energy level', emoji: '💡' },
      { id: 'rewardmenu', label: 'Reward Menu', desc: 'Things that feel good', emoji: '🎁' },
    ]
  },
  {
    title: '🌸 Fun & Growth',
    items: [
      { id: 'garden', label: 'My Garden', desc: 'Grow with your progress', emoji: '🌸' },
      { id: 'achievements', label: 'Achievements', desc: 'Badges & milestones', emoji: '🏅' },
      { id: 'bucketlist', label: 'Bucket List', desc: 'Things to look forward to', emoji: '✨' },
      { id: 'playlists', label: 'Playlist Builder', desc: 'Mood-based playlists', emoji: '🎧' },
      { id: 'learn', label: 'Learn About It', desc: 'ADHD, anxiety, PTSD...', emoji: '📖' },
    ]
  },
  {
    title: '⚙️ Settings',
    items: [
      { id: 'settings', label: 'Settings', desc: 'Theme, colors, sync, export', emoji: '⚙️' },
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
