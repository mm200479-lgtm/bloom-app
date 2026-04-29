import React, { useState, useEffect } from 'react';
import { Flower2, Heart, Flame, Star, Sun, Moon, CloudRain } from 'lucide-react';
import { getStreaks, getMoods } from '../utils/storage';
import './HomePage.css';

const GREETINGS = {
  morning: { text: 'Good morning', icon: Sun, note: 'A new day, a fresh start 🌅' },
  afternoon: { text: 'Good afternoon', icon: Sun, note: 'You\'re doing great today 🌤️' },
  evening: { text: 'Good evening', icon: Moon, note: 'Time to wind down gently 🌙' },
  night: { text: 'Hey there, night owl', icon: Star, note: 'Rest is important too 💜' },
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
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

function HomePage({ onNavigate }) {
  const [streaks, setStreaks] = useState(getStreaks());
  const [affirmation, setAffirmation] = useState('');
  const timeOfDay = getTimeOfDay();
  const greeting = GREETINGS[timeOfDay];
  const GreetingIcon = greeting.icon;

  useEffect(() => {
    const idx = Math.floor(Math.random() * AFFIRMATIONS.length);
    setAffirmation(AFFIRMATIONS[idx]);
  }, []);

  const todaysMoods = getMoods().filter(m => {
    const moodDate = new Date(m.timestamp).toDateString();
    return moodDate === new Date().toDateString();
  });

  const quickActions = [
    { id: 'mood', label: 'Check in', emoji: '💜', color: 'var(--lavender)' },
    { id: 'grounding', label: 'Calm down', emoji: '🌊', color: 'var(--sky)' },
    { id: 'tasks', label: 'My tasks', emoji: '✨', color: 'var(--sage)' },
    { id: 'journal', label: 'Write', emoji: '📝', color: 'var(--blush)' },
  ];

  return (
    <div className="home-page">
      <header className="home-header fade-in">
        <div className="greeting-row">
          <Flower2 size={28} color="var(--lavender-dark)" />
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

      <section className="affirmation-card slide-up" aria-label="Daily affirmation">
        <Heart size={16} color="var(--blush-dark)" />
        <p className="affirmation-text">{affirmation}</p>
      </section>

      {streaks.currentStreak > 0 && (
        <section className="streak-card fade-in" aria-label="Check-in streak">
          <Flame size={20} color="#e8a060" />
          <div>
            <span className="streak-count">{streaks.currentStreak} day streak!</span>
            <span className="streak-sub">You've checked in {streaks.totalCheckIns} times total</span>
          </div>
        </section>
      )}

      <section className="quick-actions" aria-label="Quick actions">
        <h3 className="section-title">What do you need right now?</h3>
        <div className="action-grid">
          {quickActions.map(action => (
            <button
              key={action.id}
              className="action-card"
              style={{ background: action.color }}
              onClick={() => onNavigate(action.id)}
              aria-label={action.label}
            >
              <span className="action-emoji">{action.emoji}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {todaysMoods.length > 0 && (
        <section className="today-moods fade-in" aria-label="Today's mood check-ins">
          <h3 className="section-title">Today's check-ins</h3>
          <div className="mood-pills">
            {todaysMoods.map(m => (
              <span key={m.id} className="mood-pill">
                {m.emoji} {m.label}
                <span className="mood-time">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="safety-reminder fade-in">
        <button className="safety-btn" onClick={() => onNavigate('safety')}>
          🛡️ My Safety Plan
        </button>
        <p className="safety-note">Always here when you need it</p>
      </section>
    </div>
  );
}

export default HomePage;
