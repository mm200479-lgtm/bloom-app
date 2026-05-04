import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './GratitudeBingoPage.css';

const ALL_ITEMS = [
  'Drank water', 'Went outside', 'Hugged someone', 'Said something kind',
  'Ate a meal', 'Stretched', 'Laughed', 'Helped someone',
  'Took deep breaths', 'Listened to music', 'Smiled at someone', 'Washed my face',
  'Made my bed', 'Said thank you', 'Rested when tired', 'Wrote something',
  'Moved my body', 'Called a friend', 'Ate a fruit', 'Tidied up',
  'Complimented myself', 'Drank tea', 'Watched the sky', 'Read something',
  'Let something go', 'Forgave myself', 'Asked for help', 'Took a walk',
  'Cooked something', 'Journaled', 'Meditated', 'Sang a song',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function checkBingo(marked) {
  const lines = [];
  for (let i = 0; i < 5; i++) {
    lines.push([i*5, i*5+1, i*5+2, i*5+3, i*5+4]);
    lines.push([i, i+5, i+10, i+15, i+20]);
  }
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);

  for (const line of lines) {
    if (line.every(idx => marked.includes(idx))) {
      return line;
    }
  }
  return null;
}

function GratitudeBingoPage({ onBack }) {
  const [items, setItems] = useState([]);
  const [marked, setMarked] = useState([]);
  const [bingoLine, setBingoLine] = useState(null);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem('bloom-bingo-' + todayKey);
    if (saved) {
      const data = JSON.parse(saved);
      setItems(data.items);
      setMarked(data.marked);
      const line = checkBingo(data.marked);
      if (line) setBingoLine(line);
    } else {
      const shuffled = shuffle(ALL_ITEMS).slice(0, 25);
      setItems(shuffled);
      setMarked([]);
    }
  }, []);

  const save = useCallback((newItems, newMarked) => {
    const todayKey = getTodayKey();
    localStorage.setItem('bloom-bingo-' + todayKey, JSON.stringify({
      items: newItems,
      marked: newMarked,
    }));
  }, []);

  const toggleMark = (index) => {
    let newMarked;
    if (marked.includes(index)) {
      newMarked = marked.filter(i => i !== index);
    } else {
      newMarked = [...marked, index];
    }
    setMarked(newMarked);
    save(items, newMarked);

    const line = checkBingo(newMarked);
    if (line && !celebrated) {
      setBingoLine(line);
      setCelebrated(true);
    } else if (!line) {
      setBingoLine(null);
    }
  };

  const resetBoard = () => {
    const shuffled = shuffle(ALL_ITEMS).slice(0, 25);
    setItems(shuffled);
    setMarked([]);
    setBingoLine(null);
    setCelebrated(false);
    save(shuffled, []);
  };

  return (
    <div className="gratitudebingo-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Gratitude Bingo 🎯</h1>
        <p className="page-subtitle">Mark off the things you've done today — celebrate your wins!</p>
      </header>

      <div className="gb-progress">
        ✅ {marked.length}/25 marked
      </div>

      {bingoLine && (
        <div className="gb-bingo card slide-up">
          🎉 BINGO! You got a line! You're taking amazing care of yourself!
        </div>
      )}

      <div className="gb-grid fade-in">
        {items.map((item, i) => (
          <button
            key={i}
            className={`gb-cell ${marked.includes(i) ? 'marked' : ''} ${bingoLine && bingoLine.includes(i) ? 'bingo' : ''}`}
            onClick={() => toggleMark(i)}
          >
            <span className="gb-cell-text">{item}</span>
            {marked.includes(i) && <span className="gb-check">✓</span>}
          </button>
        ))}
      </div>

      <button className="clear-btn" onClick={resetBoard}>
        <RotateCcw size={14} /> New Board
      </button>
    </div>
  );
}

export default GratitudeBingoPage;
