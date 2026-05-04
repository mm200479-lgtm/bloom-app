import React, { useState, useEffect } from 'react';
import { Copy, Plus, Trash2, ChevronDown, ChevronUp, Check, MessageSquare } from 'lucide-react';
import { getScripts, saveScripts } from '../utils/storage';
import './ScriptsPage.css';

const DEFAULT_SCRIPTS = [
  {
    category: 'Setting Boundaries',
    scripts: [
      { id: 'b1', text: "I care about you, but I need some space right now. It's not about you — I just need to recharge.", editable: false },
      { id: 'b2', text: "I'm not comfortable with that. I hope you can understand.", editable: false },
      { id: 'b3', text: "I can't do that right now, but I appreciate you thinking of me.", editable: false },
    ]
  },
  {
    category: 'Asking for Help',
    scripts: [
      { id: 'h1', text: "I'm struggling with something and could really use some support. Can we talk?", editable: false },
      { id: 'h2', text: "I don't fully understand this — could you help me figure it out?", editable: false },
      { id: 'h3', text: "I've been having a hard time lately. I'm not sure what I need, but I wanted you to know.", editable: false },
    ]
  },
  {
    category: 'Saying No',
    scripts: [
      { id: 'n1', text: "Thanks for inviting me, but I'm going to pass this time.", editable: false },
      { id: 'n2', text: "I wish I could, but I really can't take that on right now.", editable: false },
      { id: 'n3', text: "No, but thank you. I need to prioritize my own stuff today.", editable: false },
    ]
  },
  {
    category: 'Expressing Feelings',
    scripts: [
      { id: 'f1', text: "When you [action], I feel [emotion] because [reason]. I'd appreciate it if [request].", editable: false },
      { id: 'f2', text: "I want to be honest with you — I've been feeling [emotion] about [situation].", editable: false },
      { id: 'f3', text: "This is hard for me to say, but I need you to know how I'm feeling.", editable: false },
    ]
  },
  {
    category: 'At the Doctor',
    scripts: [
      { id: 'd1', text: "I've been experiencing [symptom] for [duration]. It's affecting my daily life by [impact].", editable: false },
      { id: 'd2', text: "I'd like to discuss my mental health. I've been feeling [description] and I think I might need support.", editable: false },
      { id: 'd3', text: "Can you explain that in simpler terms? I want to make sure I understand.", editable: false },
    ]
  },
  {
    category: 'With Teachers',
    scripts: [
      { id: 't1', text: "I'm having trouble keeping up with [subject]. Could we talk about ways I can get extra help?", editable: false },
      { id: 't2', text: "I've been dealing with some personal stuff that's affecting my schoolwork. Is there any flexibility with the deadline?", editable: false },
      { id: 't3', text: "I have a hard time with [specific thing] in class. Would it be possible to [accommodation]?", editable: false },
    ]
  },
];

function ScriptsPage({ onBack }) {
  const [allScripts, setAllScripts] = useState([]);
  const [openCat, setOpenCat] = useState(null);
  const [copied, setCopied] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newScript, setNewScript] = useState('');

  useEffect(() => {
    const saved = getScripts();
    if (saved.length > 0) {
      setAllScripts(saved);
    } else {
      setAllScripts(DEFAULT_SCRIPTS);
      saveScripts(DEFAULT_SCRIPTS);
    }
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddScript = (catIndex) => {
    if (!newScript.trim()) return;
    const updated = [...allScripts];
    updated[catIndex].scripts.push({
      id: `custom_${Date.now()}`,
      text: newScript.trim(),
      editable: true,
    });
    saveScripts(updated);
    setAllScripts(updated);
    setNewScript('');
    setAddingTo(null);
  };

  const handleDeleteScript = (catIndex, scriptId) => {
    const updated = [...allScripts];
    updated[catIndex].scripts = updated[catIndex].scripts.filter(s => s.id !== scriptId);
    saveScripts(updated);
    setAllScripts(updated);
  };

  return (
    <div className="scripts-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Conversation Scripts 💬</h1>
        <p className="page-subtitle">Words are hard sometimes — here are some to borrow</p>
      </header>

      <div className="scripts-list">
        {allScripts.map((cat, ci) => (
          <div key={ci} className={`script-category ${openCat === ci ? 'open' : ''}`}>
            <button className="script-cat-header" onClick={() => setOpenCat(openCat === ci ? null : ci)}>
              <MessageSquare size={16} />
              <span className="cat-name">{cat.category}</span>
              <span className="cat-count">{cat.scripts.length}</span>
              {openCat === ci ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openCat === ci && (
              <div className="script-cards slide-up">
                {cat.scripts.map(s => (
                  <div key={s.id} className="script-card">
                    <p className="script-text">{s.text}</p>
                    <div className="script-actions">
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(s.text, s.id)}
                      >
                        {copied === s.id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                      </button>
                      {s.editable && (
                        <button className="delete-btn" onClick={() => handleDeleteScript(ci, s.id)}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {addingTo === ci ? (
                  <div className="add-script-form">
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="Write your own script..."
                      value={newScript}
                      onChange={e => setNewScript(e.target.value)}
                    />
                    <div className="form-actions">
                      <button className="primary-btn" onClick={() => handleAddScript(ci)}>Add</button>
                      <button className="back-btn" onClick={() => { setAddingTo(null); setNewScript(''); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="add-script-btn" onClick={() => setAddingTo(ci)}>
                    <Plus size={14} /> Add your own
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="scripts-footer">
        💡 You can customize these or add your own. Having words ready makes hard conversations easier.
      </p>
    </div>
  );
}

export default ScriptsPage;
