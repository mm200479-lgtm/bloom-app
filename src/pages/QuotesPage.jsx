import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shuffle, Quote } from 'lucide-react';
import { getQuotes, addQuote, deleteQuote } from '../utils/storage';
import './QuotesPage.css';

const STARTER_QUOTES = [
  { text: "You don't have to be positive all the time. It's okay to feel sad, angry, annoyed, frustrated, scared, or anxious.", source: "Lori Deschene" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", source: "Sophia Bush" },
  { text: "Not everything that weighs you down is yours to carry.", source: "Unknown" },
  { text: "Healing is not linear.", source: "Unknown" },
  { text: "You survived 100% of your worst days. That's a pretty good track record.", source: "Unknown" },
  { text: "Be gentle with yourself. You're doing the best you can.", source: "Unknown" },
];

function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [randomQuote, setRandomQuote] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let q = getQuotes();
    if (q.length === 0) {
      STARTER_QUOTES.forEach(sq => { q = addQuote(sq); });
    }
    setQuotes(q);
  }, []);

  const handleAdd = () => {
    if (!text.trim()) return;
    const updated = addQuote({ text: text.trim(), source: source.trim() });
    setQuotes(updated);
    setText(''); setSource('');
    setShowAdd(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id) => { setQuotes(deleteQuote(id)); };

  const showRandom = () => {
    if (quotes.length === 0) return;
    const r = quotes[Math.floor(Math.random() * quotes.length)];
    setRandomQuote(r);
  };

  return (
    <div className="quotes-page">
      <header className="page-header">
        <h1>Quotes 💬</h1>
        <p className="page-subtitle">Words that remind you of what matters</p>
      </header>

      {saved && <div className="quote-saved slide-up">✨ Quote saved!</div>}

      {quotes.length > 0 && (
        <button className="random-quote-btn" onClick={showRandom}>
          <Shuffle size={16} /> Show me a random quote
        </button>
      )}

      {randomQuote && (
        <div className="random-quote-card card slide-up">
          <Quote size={20} color="var(--lavender-dark)" />
          <p className="random-quote-text">"{randomQuote.text}"</p>
          {randomQuote.source && <span className="random-quote-source">— {randomQuote.source}</span>}
        </div>
      )}

      {!showAdd ? (
        <button className="primary-btn" onClick={() => setShowAdd(true)} style={{ width: '100%', marginBottom: 16 }}>
          <Plus size={16} /> Add a quote
        </button>
      ) : (
        <div className="quote-form card slide-up">
          <textarea className="input-field" rows={3} placeholder="The quote..." value={text} onChange={e => setText(e.target.value)} />
          <input className="input-field" placeholder="Source (optional)" value={source} onChange={e => setSource(e.target.value)} />
          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>Save</button>
            <button className="back-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {quotes.length > 0 && (
        <div className="quotes-list">
          <h3 className="section-title">All quotes ({quotes.length})</h3>
          {quotes.map((q, i) => (
            <div key={q.id} className="quote-item fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="quote-content">
                <p className="quote-text">"{q.text}"</p>
                {q.source && <span className="quote-source">— {q.source}</span>}
              </div>
              <button className="delete-btn" onClick={() => handleDelete(q.id)} aria-label="Delete quote">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuotesPage;
