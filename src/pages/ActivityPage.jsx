import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import './ActivityPage.css';

const LEVELS = [
  {
    id: 'bed',
    label: "I can't get out of bed",
    emoji: '🛏️',
    color: 'var(--lavender)',
    activities: [
      { text: "Open a window or curtain. Let some light in.", emoji: "🪟" },
      { text: "Drink some water. Your body needs it.", emoji: "💧" },
      { text: "Stretch your arms above your head for 10 seconds.", emoji: "🙆" },
      { text: "Text someone 'hi'. That's it. Just hi.", emoji: "📱" },
      { text: "Listen to one song you like.", emoji: "🎵" },
      { text: "Wiggle your toes. Feel them. You're here.", emoji: "🦶" },
      { text: "Change your shirt. Fresh clothes = tiny reset.", emoji: "👕" },
      { text: "Pet your pet if you have one. Or hug a pillow.", emoji: "🐾" },
      { text: "Watch one funny video. Just one.", emoji: "📺" },
      { text: "Eat something. Even a cracker counts.", emoji: "🍪" },
    ]
  },
  {
    id: 'low',
    label: "I'm up but have zero energy",
    emoji: '🪫',
    color: 'var(--sky)',
    activities: [
      { text: "Take a shower or wash your face.", emoji: "🚿" },
      { text: "Make your bed. It takes 2 minutes and changes the room.", emoji: "🛏️" },
      { text: "Go outside for 5 minutes. Just stand there.", emoji: "🌤️" },
      { text: "Eat a real meal. You deserve fuel.", emoji: "🍽️" },
      { text: "Tidy one small area — just your desk or nightstand.", emoji: "✨" },
      { text: "Draw or doodle something. No rules.", emoji: "🖍️" },
      { text: "Write down 3 things you can see, hear, and feel.", emoji: "📝" },
      { text: "Do a 2-minute body scan. Notice where you hold tension.", emoji: "🧘" },
      { text: "Water a plant or take care of something alive.", emoji: "🌱" },
      { text: "Put on comfortable clothes that make you feel okay.", emoji: "👚" },
    ]
  },
  {
    id: 'medium',
    label: "I have some energy",
    emoji: '🔋',
    color: 'var(--sage)',
    activities: [
      { text: "Go for a 10-minute walk. No destination needed.", emoji: "🚶" },
      { text: "Call or voice-message a friend.", emoji: "📞" },
      { text: "Cook or bake something simple.", emoji: "🍳" },
      { text: "Do 10 minutes of homework. Set a timer.", emoji: "📚" },
      { text: "Organize one drawer or shelf.", emoji: "🗄️" },
      { text: "Try a new playlist or podcast.", emoji: "🎧" },
      { text: "Write in your journal.", emoji: "📓" },
      { text: "Do some gentle yoga or stretching.", emoji: "🧘" },
      { text: "Take photos of things you find beautiful.", emoji: "📸" },
      { text: "Learn something new for 10 minutes (YouTube, etc).", emoji: "💡" },
    ]
  },
  {
    id: 'good',
    label: "I'm feeling okay today!",
    emoji: '✨',
    color: 'var(--blush)',
    activities: [
      { text: "Work on a creative project.", emoji: "🎨" },
      { text: "Exercise — dance, run, whatever feels good.", emoji: "💃" },
      { text: "Hang out with someone you like.", emoji: "👯" },
      { text: "Plan something fun for this week.", emoji: "📅" },
      { text: "Deep clean your space. Future you will thank you.", emoji: "🧹" },
      { text: "Try something you've been putting off.", emoji: "🎯" },
      { text: "Write a letter to someone you care about.", emoji: "💌" },
      { text: "Update your safety plan or win jar.", emoji: "🛡️" },
      { text: "Help someone else. It feels amazing.", emoji: "🤝" },
      { text: "Celebrate! You're having a good day. That matters.", emoji: "🎉" },
    ]
  },
];

function ActivityPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  const getSuggestion = (level) => {
    const activities = level.activities;
    const random = activities[Math.floor(Math.random() * activities.length)];
    setSuggestion(random);
    setSelectedLevel(level);
  };

  const shuffle = () => {
    if (selectedLevel) getSuggestion(selectedLevel);
  };

  return (
    <div className="activity-page">
      <header className="page-header">
        <h1>Activity Ideas</h1>
        <p className="page-subtitle">Gentle nudges based on your energy level 💡</p>
      </header>

      <p className="activity-prompt">How much energy do you have right now?</p>

      <div className="level-grid fade-in">
        {LEVELS.map(level => (
          <button
            key={level.id}
            className={`level-card ${selectedLevel?.id === level.id ? 'active' : ''}`}
            style={{ background: level.color }}
            onClick={() => getSuggestion(level)}
          >
            <span className="level-emoji">{level.emoji}</span>
            <span className="level-label">{level.label}</span>
          </button>
        ))}
      </div>

      {suggestion && (
        <div className="suggestion-card slide-up">
          <span className="suggestion-emoji">{suggestion.emoji}</span>
          <p className="suggestion-text">{suggestion.text}</p>
          <button className="shuffle-suggestion" onClick={shuffle}>
            <Shuffle size={14} /> Try another
          </button>
        </div>
      )}

      <p className="activity-note">
        💜 There's no wrong answer. Even the tiniest action counts. If all you did today was survive, that's enough.
      </p>
    </div>
  );
}

export default ActivityPage;
