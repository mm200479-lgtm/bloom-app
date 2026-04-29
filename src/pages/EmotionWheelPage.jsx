import React, { useState } from 'react';
import { addMood, updateStreaks } from '../utils/storage';
import './EmotionWheelPage.css';

const EMOTIONS = {
  'Happy 😊': {
    color: '#a0e8c8',
    deeper: ['Joyful', 'Content', 'Grateful', 'Proud', 'Hopeful', 'Playful', 'Excited', 'Peaceful']
  },
  'Sad 😢': {
    color: '#c8c0d8',
    deeper: ['Lonely', 'Disappointed', 'Hopeless', 'Grief', 'Empty', 'Homesick', 'Heartbroken', 'Defeated']
  },
  'Angry 😤': {
    color: '#e8b0a0',
    deeper: ['Frustrated', 'Irritated', 'Resentful', 'Betrayed', 'Jealous', 'Disrespected', 'Bitter', 'Hostile']
  },
  'Scared 😰': {
    color: '#e8d0a0',
    deeper: ['Anxious', 'Panicked', 'Insecure', 'Overwhelmed', 'Helpless', 'Threatened', 'Vulnerable', 'Paranoid']
  },
  'Disgusted 😣': {
    color: '#c8d8a0',
    deeper: ['Repulsed', 'Ashamed', 'Embarrassed', 'Judged', 'Self-loathing', 'Uncomfortable', 'Nauseated', 'Appalled']
  },
  'Surprised 😲': {
    color: '#d0e4f5',
    deeper: ['Shocked', 'Confused', 'Amazed', 'Startled', 'Awestruck', 'Bewildered', 'Moved', 'Speechless']
  },
};

function EmotionWheelPage() {
  const [selected, setSelected] = useState(null);
  const [deeper, setDeeper] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!deeper) return;
    const parentEmoji = selected.split(' ').pop();
    addMood({
      emoji: parentEmoji,
      label: deeper,
      value: ['Happy 😊'].includes(selected) ? 4 : 2,
      note: `From emotion wheel: ${selected} → ${deeper}`,
    });
    updateStreaks();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelected(null);
      setDeeper(null);
    }, 2500);
  };

  if (saved) {
    return (
      <div className="emotion-page">
        <div className="emotion-saved slide-up">
          <span className="saved-emoji">🎯</span>
          <h2>Feeling identified!</h2>
          <p>Naming your emotions is a superpower. It takes away some of their power over you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="emotion-page">
      <header className="page-header">
        <h1>Emotion Wheel</h1>
        <p className="page-subtitle">Sometimes "fine" isn't specific enough 🎯</p>
      </header>

      {!selected ? (
        <div className="emotion-wheel fade-in">
          <p className="wheel-prompt">Start with the big feeling:</p>
          <div className="wheel-grid">
            {Object.entries(EMOTIONS).map(([name, data]) => (
              <button
                key={name}
                className="wheel-segment"
                style={{ background: data.color }}
                onClick={() => setSelected(name)}
              >
                <span className="segment-emoji">{name.split(' ').pop()}</span>
                <span className="segment-label">{name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="deeper-feelings slide-up">
          <button className="back-btn" onClick={() => { setSelected(null); setDeeper(null); }}>
            ← Back to wheel
          </button>
          <div className="selected-parent" style={{ background: EMOTIONS[selected].color }}>
            <span>{selected}</span>
          </div>
          <p className="deeper-prompt">Can you get more specific?</p>
          <div className="deeper-grid">
            {EMOTIONS[selected].deeper.map(feeling => (
              <button
                key={feeling}
                className={`deeper-btn ${deeper === feeling ? 'active' : ''}`}
                style={deeper === feeling ? { background: EMOTIONS[selected].color } : {}}
                onClick={() => setDeeper(feeling)}
              >
                {feeling}
              </button>
            ))}
          </div>
          {deeper && (
            <button className="primary-btn" onClick={handleSave} style={{ marginTop: 16 }}>
              That's it — I feel {deeper.toLowerCase()} {selected.split(' ').pop()}
            </button>
          )}
        </div>
      )}

      <div className="emotion-info">
        <p>💡 Research shows that naming specific emotions ("I feel <em>overwhelmed</em>") reduces their intensity more than vague labels ("I feel <em>bad</em>"). This is called <strong>affect labeling</strong>.</p>
      </div>
    </div>
  );
}

export default EmotionWheelPage;
