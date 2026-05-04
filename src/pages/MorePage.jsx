import React from 'react';
import './MorePage.css';

const SECTIONS = [
  {
    title: '📊 Tracking & Insights',
    items: [
      { id: 'mood', label: 'Mood Check-in', desc: 'How are you feeling?', emoji: '💜' },
      { id: 'energy', label: 'Energy Tracker', desc: 'Track energy separately', emoji: '🔋' },
      { id: 'sleep', label: 'Sleep Tracker', desc: 'Log sleep & nightmares', emoji: '😴' },
      { id: 'period', label: 'Period Tracker', desc: 'Cycle predictions & PMS', emoji: '🩸' },
      { id: 'social', label: 'Social Battery', desc: 'Track social energy', emoji: '👥' },
      { id: 'triggers', label: 'Trigger Log', desc: 'Spot patterns', emoji: '📋' },
      { id: 'insights', label: 'Insights Dashboard', desc: 'Mood trends & patterns', emoji: '📊' },
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
      { id: 'grounding', label: 'Grounding', desc: '5-4-3-2-1 & breathing', emoji: '🌊' },
      { id: 'coping', label: 'Coping Cards', desc: 'Swipeable strategies', emoji: '💜' },
      { id: 'sounds', label: 'Sound Machine', desc: 'Rain, ocean, noise', emoji: '🎵' },
      { id: 'dbt', label: 'DBT Skills', desc: 'TIPP, DEAR MAN & more', emoji: '🧰' },
      { id: 'thought', label: 'Thought Challenger', desc: 'CBT thought records', emoji: '💡' },
      { id: 'emotions', label: 'Emotion Wheel', desc: 'Name what you feel', emoji: '🎯' },
      { id: 'angry', label: 'Anger Thermometer', desc: 'Coping by level', emoji: '🌡️' },
      { id: 'bodymap', label: 'Body Map', desc: 'Where do you feel it?', emoji: '🫀' },
      { id: 'urgesurf', label: 'Urge Surfing', desc: 'Ride the wave timer', emoji: '🏄' },
      { id: 'worrytime', label: 'Worry Time', desc: '15 min allowed worrying', emoji: '⏰' },
      { id: 'distraction', label: 'Distraction Box', desc: 'Quick, medium, long', emoji: '📦' },
      { id: 'sensory', label: 'Sensory Kit', desc: 'Your grounding tools', emoji: '✋' },
      { id: 'fidget', label: 'Fidget Tools', desc: 'Bubble wrap & spinners', emoji: '🫧' },
      { id: 'colortherapy', label: 'Color Therapy', desc: 'Calming color presets', emoji: '🎨' },
      { id: 'breathbubble', label: 'Breathing Bubble', desc: 'Breathe with the bubble', emoji: '🫧' },
    ]
  },
  {
    title: '🛡️ Safety & Support',
    items: [
      { id: 'safety', label: 'Safety Plan', desc: 'Crisis contacts & tools', emoji: '🛡️' },
      { id: 'debrief', label: 'Crisis Debrief', desc: 'Process what happened', emoji: '📋' },
      { id: 'scripts', label: 'Conversation Scripts', desc: 'What to say when...', emoji: '💬' },
      { id: 'emergency', label: 'Emergency', desc: 'I need help right now', emoji: '🚨' },
      { id: 'safepeople', label: 'Safe People', desc: 'Your trusted contacts', emoji: '🤝' },
      { id: 'badday', label: 'Bad Day Kit', desc: 'Step-by-step comfort', emoji: '🩹' },
    ]
  },
  {
    title: '📚 School & ADHD',
    items: [
      { id: 'routines', label: 'Routines', desc: 'Morning & evening', emoji: '⏰' },
      { id: 'pomodoro', label: 'Focus Timer', desc: 'Pomodoro for ADHD', emoji: '🍅' },
      { id: 'homework', label: 'Homework Planner', desc: 'Assignments & steps', emoji: '📚' },
      { id: 'goals', label: 'Goal Tracker', desc: 'Short & long term', emoji: '🎯' },
      { id: 'tasks', label: 'Tasks', desc: 'Daily to-do list', emoji: '✨' },
      { id: 'appointments', label: 'Appointments', desc: 'Therapy, doctor, school', emoji: '📅' },
      { id: 'meds', label: 'Medication Reminders', desc: 'Track daily meds', emoji: '💊' },
      { id: 'studyplanner', label: 'Study Planner', desc: 'Plan study sessions', emoji: '📖' },
      { id: 'testanxiety', label: 'Test Anxiety', desc: 'Strategies for test stress', emoji: '📝' },
    ]
  },
  {
    title: '💪 Self-Care',
    items: [
      { id: 'selfcare', label: 'Self-Care Tracker', desc: 'Water, meals, movement', emoji: '💧' },
      { id: 'activity', label: 'Activity Ideas', desc: 'Based on energy level', emoji: '💡' },
      { id: 'rewardmenu', label: 'Reward Menu', desc: 'Things that feel good', emoji: '🎁' },
      { id: 'compliment', label: 'Compliment Jar', desc: 'Kind words for yourself', emoji: '💌' },
    ]
  },
  {
    title: '🪞 Self-Discovery',
    items: [
      { id: 'values', label: 'Values Explorer', desc: 'What matters most to you', emoji: '💎' },
      { id: 'strengths', label: 'Strengths', desc: 'Know your superpowers', emoji: '🌟' },
      { id: 'identity', label: 'Identity Map', desc: 'Who you are & becoming', emoji: '🪞' },
      { id: 'boundaries', label: 'Boundaries', desc: 'Set & track boundaries', emoji: '🚧' },
      { id: 'affirmations', label: 'Custom Affirmations', desc: 'Your personal mantras', emoji: '💜' },
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
      { id: 'comfortmedia', label: 'Comfort Media', desc: 'Shows, movies & music', emoji: '🎬' },
      { id: 'timecapsule', label: 'Time Capsule', desc: 'Messages to future you', emoji: '💊' },
      { id: 'stickerboard', label: 'Sticker Board', desc: 'Earn & place stickers', emoji: '⭐' },
    ]
  },
  {
    title: '🎮 Games',
    items: [
      { id: 'games', label: 'Games Hub', desc: 'All games in one place', emoji: '🎮' },
    ]
  },
  {
    title: '📋 Reports',
    items: [
      { id: 'report', label: 'Therapist Report', desc: 'Summary for your therapist', emoji: '📊' },
      { id: 'parentguide', label: 'Parent Guide', desc: 'Help parents understand', emoji: '👨‍👩‍👧' },
      { id: 'holidaysurvival', label: 'Holiday Survival', desc: 'Tips for tough seasons', emoji: '🎄' },
    ]
  },
  {
    title: '🌅 Quick Actions',
    items: [
      { id: 'dailycheckin', label: 'Daily Check-in', desc: 'Quick morning check-in', emoji: '🌅' },
    ]
  },
  {
    title: '⚙️ Settings',
    items: [
      { id: 'settings', label: 'Settings', desc: 'Theme, colors, sync, export', emoji: '⚙️' },
    ]
  },
];

function MorePage({ onNavigate, profile }) {
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
