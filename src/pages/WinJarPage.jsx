import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shuffle, Trophy } from 'lucide-react';
import { getWins, addWin, deleteWin, addPetals } from '../utils/storage';
import './WinJarPage.css';

function WinJarPage() {
  const [wins, setWins] = useState([]);
  const [newWin, setNewWin] = useState('');
  const [randomWin, setRandomWin] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setWins(getWins()); }, []);

  const handleAdd = () => {
    if (!newWin.trim()) return;
    const updated = addWin(newWin.trim());
    addPetals(2);
    setWins(updated);
    setNewWin('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id) => {
    setWins(deleteWin(id));
  };

  const showRandom = () => {
    if (wins.length === 0) return;
    const random = wins[Math.floor(Math.random() * wins.length)];
    setRandomWin(random);
  };

  return (
    <div className="win-page">
      <header className="page-header">
        <h1>Win Jar 🏆</h1>
        <p className="page-subtitle">Save your victories — scroll through on bad days</p>
      </header>

      <div className="win-input-section">
        <label htmlFor="win-input" className="win-prompt">What's a win, no matter how small?</label>
        <div className="win-input-row">
          <input
            id="win-input"
            className="input-field"
            placeholder="e.g., I got out of bed, I drank water, I was kind..."
            value={newWin}
            onChange={e => setNewWin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="win-add-btn" onClick={handleAdd} aria-label="Add win">
            <Plus size={18} />
          </button>
        </div>
        {saved && <span className="win-saved">✨ Win saved! +2 petals 🌸</span>}
      </div>

      {wins.length > 0 && (
        <button className="random-win-btn" onClick={showRandom}>
          <Shuffle size={16} /> Read a random win
        </button>
      )}

      {randomWin && (
        <div className="random-win-card slide-up">
          <Trophy size={24} color="var(--warning)" />
          <p className="random-win-text">"{randomWin.text}"</p>
          <span className="random-win-date">
            {new Date(randomWin.timestamp).toLocaleDateString([], { month: 'long', day: 'numeric' })}
          </span>
        </div>
      )}

      {wins.length > 0 && (
        <div className="win-list">
          <h3 className="section-title">All your wins ({wins.length})</h3>
          <div className="win-jar-visual">
            {wins.map((w, i) => (
              <div
                key={w.id}
                className="win-item fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="win-content">
                  <span className="win-star">⭐</span>
                  <div>
                    <p className="win-text">{w.text}</p>
                    <span className="win-date">
                      {new Date(w.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(w.id)} aria-label="Delete win">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {wins.length === 0 && (
        <div className="empty-jar">
          <span className="jar-emoji">🫙</span>
          <p>Your jar is empty! Start adding wins — even tiny ones count.</p>
          <p className="jar-examples">
            "I brushed my teeth" • "I asked for help" • "I made it through the day"
          </p>
        </div>
      )}
    </div>
  );
}

export default WinJarPage;
