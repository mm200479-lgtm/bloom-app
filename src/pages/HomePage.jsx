import React, { useState, useEffect } from 'react';
import { Heart, Flame, Sun, Moon, Star, ChevronRight } from 'lucide-react';
import { getStreaks, getMoods, getGarden, getWins, getEnergyLogs, getSleepLogs, getSettings } from '../utils/storage';
import './HomePage.css';

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

function greetings(name) {
  const n = name ? `, ${name}` : '';
  return {
    morning: { text: `Good morning${n}`, icon: Sun, note: 'A new day, a fresh start 🌅' },
    afternoon: { text: `Good afternoon${n}`, icon: Sun, note: "You're doing great today 🌤️" },
    evening: { text: `Good evening${n}`, icon: Moon, note: 'Time to wind down gently 🌙' },
    night: { text: `Hey there${n}`, icon: Star, note: 'Rest is important too 💜' },
  };
}

const AFFIRMATIONS = [
  "You are enough, exactly as you are right now.",
  "It's okay to take things one moment at a time.",
  "Your feelings are valid, even the messy ones.",
  "You don't have to have it all figured out today.",
  "Being here is brave. You're doing it.",
  "Small steps still move you forward.",
  "You deserve kindness — especially from yourself.",
  "It's okay to rest. You've earned it.",
  "Your brain works differently, and that's a superpower too.",
  "You are more than your hardest days.",
  "Progress isn't always visible, but it's happening.",
  "You're allowed to take up space.",
  "Today doesn't have to be perfect to be good.",
  "You are loved more than you know.",
  "Healing isn't linear, and that's okay.",
];

const CATEGORIES = [
  {
    id: 'track', title: 'Track', emoji: '📊', color: 'var(--sky)',
    desc: 'Check in with yourself',
    items: [
      { id: 'mood', emoji: '💜', label: 'Mood' },
      { id: 'energy', emoji: '🔋', label: 'Energy' },
      { id: 'sleep', emoji: '😴', label: 'Sleep' },
      { id: 'period', emoji: '🩸', label: 'Period' },
      { id: 'social', emoji: '👥', label: 'Social Battery' },
      { id: 'triggers', emoji: '📋', label: 'Triggers' },
      { id: 'insights', emoji: '📊', label: 'Insights' },
    ]
  },
  {
    id: 'write', title: 'Write', emoji: '📝', color: 'var(--blush)',
    desc: 'Express & reflect',
    items: [
      { id: 'journal', emoji: '📝', label: 'Journal' },
      { id: 'photos', emoji: '📸', label: 'Photo Journal' },
      { id: 'wins', emoji: '🏆', label: 'Win Jar' },
      { id: 'letters', emoji: '💌', label: 'Letters to Self' },
      { id: 'dreams', emoji: '💭', label: 'Dreams' },
      { id: 'nightmares', emoji: '🌙', label: 'Nightmares' },
      { id: 'quotes', emoji: '💬', label: 'Quotes' },
      { id: 'braindump', emoji: '🧠', label: 'Brain Dump' },
    ]
  },
  {
    id: 'calm', title: 'Calm', emoji: '🧘', color: 'var(--sage)',
    desc: 'Ground & soothe',
    items: [
      { id: 'grounding', emoji: '🌊', label: 'Grounding' },
      { id: 'coping', emoji: '💜', label: 'Coping Cards' },
      { id: 'sounds', emoji: '🎵', label: 'Sounds' },
      { id: 'dbt', emoji: '🧰', label: 'DBT Skills' },
      { id: 'thought', emoji: '💡', label: 'Thought Challenger' },
      { id: 'emotions', emoji: '🎯', label: 'Emotion Wheel' },
      { id: 'angry', emoji: '🌡️', label: 'Anger Thermometer' },
      { id: 'bodymap', emoji: '🫀', label: 'Body Map' },
      { id: 'urgesurf', emoji: '🏄', label: 'Urge Surfing' },
      { id: 'worrytime', emoji: '⏰', label: 'Worry Time' },
      { id: 'distraction', emoji: '📦', label: 'Distraction Box' },
      { id: 'sensory', emoji: '✋', label: 'Sensory Kit' },
      { id: 'fidget', emoji: '🫧', label: 'Fidget Tools' },
      { id: 'colortherapy', emoji: '🎨', label: 'Color Therapy' },
      { id: 'breathbubble', emoji: '🫧', label: 'Breathing Bubble' },
    ]
  },
  {
    id: 'safety', title: 'Safety', emoji: '🛡️', color: '#f0e0e8',
    desc: 'Support & crisis tools',
    items: [
      { id: 'safety', emoji: '🛡️', label: 'Safety Plan' },
      { id: 'debrief', emoji: '📋', label: 'Crisis Debrief' },
      { id: 'scripts', emoji: '💬', label: 'Conversation Scripts' },
      { id: 'emergency', emoji: '🚨', label: 'Emergency' },
      { id: 'safepeople', emoji: '🤝', label: 'Safe People' },
      { id: 'badday', emoji: '🩹', label: 'Bad Day Kit' },
    ]
  },
  {
    id: 'school', title: 'School & ADHD', emoji: '📚', color: 'var(--lavender)',
    desc: 'Focus, plan, get it done',
    items: [
      { id: 'routines', emoji: '⏰', label: 'Routines' },
      { id: 'pomodoro', emoji: '🍅', label: 'Focus Timer' },
      { id: 'homework', emoji: '📚', label: 'Homework' },
      { id: 'goals', emoji: '🎯', label: 'Goals' },
      { id: 'tasks', emoji: '✨', label: 'Tasks' },
      { id: 'appointments', emoji: '📅', label: 'Appointments' },
      { id: 'meds', emoji: '💊', label: 'Medications' },
      { id: 'studyplanner', emoji: '📖', label: 'Study Planner' },
      { id: 'testanxiety', emoji: '📝', label: 'Test Anxiety' },
    ]
  },
  {
    id: 'selfcare', title: 'Self-Care', emoji: '💪', color: '#e8f0d8',
    desc: 'Take care of your body',
    items: [
      { id: 'selfcare', emoji: '💧', label: 'Water/Meals/Move' },
      { id: 'activity', emoji: '💡', label: 'Activity Ideas' },
      { id: 'rewardmenu', emoji: '🎁', label: 'Reward Menu' },
      { id: 'compliment', emoji: '💌', label: 'Compliment Jar' },
    ]
  },
  {
    id: 'selfdiscovery', title: 'Self-Discovery', emoji: '🪞', color: '#e8d8f0',
    desc: 'Know yourself better',
    items: [
      { id: 'values', emoji: '💎', label: 'Values' },
      { id: 'strengths', emoji: '🌟', label: 'Strengths' },
      { id: 'identity', emoji: '🪞', label: 'Identity' },
      { id: 'boundaries', emoji: '🚧', label: 'Boundaries' },
      { id: 'affirmations', emoji: '💜', label: 'Affirmations' },
    ]
  },
  {
    id: 'fun', title: 'Fun & Growth', emoji: '🌸', color: '#f5e8d0',
    desc: 'Rewards, dreams & play',
    items: [
      { id: 'garden', emoji: '🌸', label: 'My Garden' },
      { id: 'achievements', emoji: '🏅', label: 'Achievements' },
      { id: 'bucketlist', emoji: '✨', label: 'Bucket List' },
      { id: 'playlists', emoji: '🎧', label: 'Playlists' },
      { id: 'learn', emoji: '📖', label: 'Learn About It' },
      { id: 'comfortmedia', emoji: '🎬', label: 'Comfort Media' },
      { id: 'timecapsule', emoji: '💊', label: 'Time Capsule' },
      { id: 'stickerboard', emoji: '⭐', label: 'Sticker Board' },
    ]
  },
  {
    id: 'games', title: 'Games', emoji: '🎮', color: '#d8e8f0',
    desc: 'Gentle fun & play',
    items: [
      { id: 'games', emoji: '🎮', label: 'Games Hub' },
    ]
  },
  {
    id: 'reports', title: 'Reports', emoji: '📋', color: '#e0e8d8',
    desc: 'Share & review progress',
    items: [
      { id: 'report', emoji: '📊', label: 'Therapist Report' },
      { id: 'parentguide', emoji: '👨‍👩‍👧', label: 'Parent Guide' },
      { id: 'holidaysurvival', emoji: '🎄', label: 'Holiday Survival' },
    ]
  },
];

function HomePage({ onNavigate, profile }) {
  const [affirmation] = useState(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const [expandedCat, setExpandedCat] = useState(null);
  const streaks = getStreaks();
  const garden = getGarden();
  const wins = getWins();
  const timeOfDay = getTimeOfDay();
  const GREETINGS = greetings(profile?.name);
  const greeting = GREETINGS[timeOfDay];
  const GreetingIcon = greeting.icon;

  const todaysMoods = getMoods().filter(m =>
    new Date(m.timestamp).toDateString() === new Date().toDateString()
  );

  const toggleCat = (id) => {
    setExpandedCat(expandedCat === id ? null : id);
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header fade-in">
        <div className="greeting-row">
          <span className="header-avatar">{profile?.avatar || '🌸'}</span>
          <h1 className="app-title">Bloom</h1>
        </div>
        <div className="greeting-card">
          <div className="greeting-text">
            <GreetingIcon size={18} color="var(--warning)" />
            <h2>{greeting.text}</h2>
          </div>
          <p className="greeting-note">{greeting.note}</p>
        </div>
      </header>

      {/* Affirmation */}
      <section className="affirmation-card slide-up" aria-label="Daily affirmation">
        <Heart size={16} color="var(--blush-dark)" />
        <p className="affirmation-text">{affirmation}</p>
      </section>

      {/* Stats row */}
      <div className="stats-row fade-in">
        {streaks.currentStreak > 0 && (
          <div className="stat-chip"><Flame size={14} color="#e8a060" /><span>{streaks.currentStreak} day streak</span></div>
        )}
        {garden.totalPetals > 0 && (
          <div className="stat-chip"><span>🌸</span><span>{garden.petals} petals</span></div>
        )}
        {garden.flowers.length > 0 && (
          <div className="stat-chip"><span>🌱</span><span>{garden.flowers.length} plants</span></div>
        )}
        {wins.length > 0 && (
          <div className="stat-chip"><span>⭐</span><span>{wins.length} wins</span></div>
        )}
      </div>

      {/* Quick actions */}
      <section className="quick-row">
        <button className="quick-btn" style={{ background: 'var(--lavender)' }} onClick={() => onNavigate('mood')}>
          <span>💜</span><span>Check in</span>
        </button>
        <button className="quick-btn" style={{ background: 'var(--sky)' }} onClick={() => onNavigate('grounding')}>
          <span>🌊</span><span>Calm</span>
        </button>
        <button className="quick-btn" style={{ background: 'var(--sage)' }} onClick={() => onNavigate('journal')}>
          <span>📝</span><span>Write</span>
        </button>
        <button className="quick-btn" style={{ background: 'var(--blush)' }} onClick={() => onNavigate('safety')}>
          <span>🛡️</span><span>Safety</span>
        </button>
      </section>

      {/* Today's moods */}
      {todaysMoods.length > 0 && (
        <section className="today-moods fade-in">
          <div className="mood-pills">
            {todaysMoods.map(m => (
              <span key={m.id} className="mood-pill">
                {m.emoji} {m.label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Daily Check-in button */}
      <button
        className="quick-btn"
        style={{ background: 'var(--sage)', width: '100%', flexDirection: 'row', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}
        onClick={() => onNavigate('dailycheckin')}
      >
        <span>🌅</span><span>Daily Check-in</span>
      </button>

      {/* Emergency button */}
      <button
        className="quick-btn"
        style={{ background: '#f0d0d0', width: '100%', flexDirection: 'row', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}
        onClick={() => onNavigate('emergency')}
      >
        <span>🚨</span><span>Emergency — I need help now</span>
      </button>

      {/* Category tiles */}
      <section className="categories-section">
        <h3 className="section-title">Everything you need</h3>
        <div className="category-list">
          {CATEGORIES.map(cat => {
            const isOpen = expandedCat === cat.id;
            return (
              <div key={cat.id} className={`category-tile ${isOpen ? 'open' : ''}`}>
                <button
                  className="category-header"
                  style={{ background: cat.color }}
                  onClick={() => toggleCat(cat.id)}
                  aria-expanded={isOpen}
                >
                  <div className="cat-left">
                    <span className="cat-emoji">{cat.emoji}</span>
                    <div>
                      <span className="cat-title">{cat.title}</span>
                      <span className="cat-desc">{cat.desc}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`cat-arrow ${isOpen ? 'rotated' : ''}`} />
                </button>
                {isOpen && (
                  <div className="category-items slide-up">
                    {cat.items.map(item => (
                      <button
                        key={item.id}
                        className="cat-item"
                        onClick={() => onNavigate(item.id)}
                      >
                        <span className="cat-item-emoji">{item.emoji}</span>
                        <span className="cat-item-label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings link */}
      <button className="settings-link" onClick={() => onNavigate('settings')}>
        ⚙️ Settings
      </button>
    </div>
  );
}

export default HomePage;
