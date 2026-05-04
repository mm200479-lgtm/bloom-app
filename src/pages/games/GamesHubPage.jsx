import React from 'react';
import './GamesHubPage.css';

const GAMES = [
  { id: 'colorbook', emoji: '🎨', title: 'Coloring Book', desc: 'Fill in calming patterns with beautiful colors' },
  { id: 'dotsboxes', emoji: '🔲', title: 'Dots & Boxes', desc: 'Connect dots and claim boxes — gentle strategy' },
  { id: 'breathbubble', emoji: '🫧', title: 'Breathing Bubble', desc: 'A calming bubble that breathes with you' },
  { id: 'wordsearch', emoji: '🔤', title: 'Word Search', desc: 'Find positive words hidden in the grid' },
  { id: 'tapstars', emoji: '⭐', title: 'Tap the Stars', desc: 'Catch twinkling stars at your own pace' },
  { id: 'memorymatch', emoji: '🦋', title: 'Memory Match', desc: 'Find calming emoji pairs — no rush' },
  { id: 'zengarden', emoji: '🪨', title: 'Zen Garden', desc: 'Rake sand, place stones, find peace' },
  { id: 'bubblepop', emoji: '🟣', title: 'Bubble Pop', desc: 'Pop colorful bubbles floating by' },
  { id: 'colorflood', emoji: '🌈', title: 'Color Flood', desc: 'Flood the board with one color' },
  { id: 'jigsaw', emoji: '🧩', title: 'Jigsaw Lite', desc: 'Swap pieces to complete the picture' },
  { id: 'doodlepad', emoji: '✏️', title: 'Doodle Pad', desc: 'Draw freely — no rules, just create' },
  { id: 'fireflies', emoji: '✨', title: 'Catch Fireflies', desc: 'Gather glowing fireflies in the night' },
  { id: 'gratitudebingo', emoji: '🎯', title: 'Gratitude Bingo', desc: 'Mark off self-care wins on your card' },
  { id: 'emojistory', emoji: '📖', title: 'Emoji Story', desc: 'Write tiny stories from random emojis' },
  { id: 'pixelart', emoji: '🟩', title: 'Pixel Art', desc: 'Create pixel masterpieces one square at a time' },
  { id: 'rainwindow', emoji: '🌧️', title: 'Rain on Window', desc: 'Tap to create raindrops on glass' },
  { id: 'stackblocks', emoji: '🧱', title: 'Stack Blocks', desc: 'Stack blocks as high as you like' },
];

function GamesHubPage({ onNavigate, onBack }) {
  return (
    <div className="games-hub-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Games & Activities 🎮</h1>
        <p className="page-subtitle">No pressure, no timers — just gentle fun to help you feel better</p>
      </header>

      <div className="games-grid">
        {GAMES.map((game, i) => (
          <button
            key={game.id}
            className="game-card fade-in"
            style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => onNavigate(game.id)}
          >
            <span className="game-card-emoji">{game.emoji}</span>
            <span className="game-card-title">{game.title}</span>
            <span className="game-card-desc">{game.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GamesHubPage;
