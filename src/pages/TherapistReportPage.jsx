import React, { useState, useMemo } from 'react';
import { ClipboardCopy, Download, Calendar } from 'lucide-react';
import { getMoods, getEnergyLogs, getSleepLogs, getTriggers, getMeds, getJournalEntries } from '../utils/storage';
import './TherapistReportPage.css';

function TherapistReportPage({ onBack }) {
  const [range, setRange] = useState(7);
  const [copied, setCopied] = useState(false);

  const report = useMemo(() => {
    const now = Date.now();
    const cutoff = now - range * 86400000;
    const inRange = (list) => (list || []).filter(i => new Date(i.timestamp).getTime() >= cutoff);

    const moods = inRange(getMoods());
    const energy = inRange(getEnergyLogs());
    const sleep = inRange(getSleepLogs());
    const triggers = inRange(getTriggers());
    const journal = inRange(getJournalEntries());
    const medsData = getMeds();
    const medsLogs = (medsData.logs || []).filter(l => new Date(l.date).getTime() >= cutoff);

    const avg = (arr, key) => {
      const vals = arr.map(i => typeof key === 'function' ? key(i) : i[key]).filter(v => typeof v === 'number');
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 'N/A';
    };

    const moodCounts = {};
    moods.forEach(m => { const label = m.label || m.mood; moodCounts[label] = (moodCounts[label] || 0) + 1; });
    const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

    const medsTaken = medsLogs.filter(l => l.taken === true).length;
    const medsAdherence = medsLogs.length > 0 ? Math.round((medsTaken / medsLogs.length) * 100) : 'N/A';

    return {
      moods, energy, sleep, triggers, journal, medsLogs,
      moodAvg: avg(moods, i => {
        const scale = { Happy: 5, Excited: 5, Loved: 5, Grateful: 4, Calm: 4, Okay: 3, Tired: 2, Stressed: 2, Anxious: 2, Sad: 1, Angry: 1, Crying: 1 };
        return scale[i.label] || 3;
      }),
      energyAvg: avg(energy, 'level'),
      sleepAvg: avg(sleep, 'quality'),
      topMoods, medsAdherence,
    };
  }, [range]);

  const generateText = () => {
    const lines = [
      `Bloom Wellness Report — Past ${range} days`,
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      `Mood entries: ${report.moods.length} | Average: ${report.moodAvg}/5`,
      `Energy entries: ${report.energy.length} | Average: ${report.energyAvg}/5`,
      `Sleep entries: ${report.sleep.length} | Average: ${report.sleepAvg}/5`,
      `Triggers logged: ${report.triggers.length}`,
      `Journal entries: ${report.journal.length}`,
      `Medication adherence: ${report.medsAdherence}${typeof report.medsAdherence === 'number' ? '%' : ''} (${report.medsLogs.length} logs)`,
      '',
      `Top moods: ${report.topMoods.map(([m, c]) => `${m} (${c}x)`).join(', ') || 'None'}`,
    ];
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(generateText()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const handleDownload = () => {
    const blob = new Blob([generateText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `bloom-report-${range}days.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="report-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <header className="page-header">
        <h1>Therapist Report 📋</h1>
        <p className="page-subtitle">A summary to share with your therapist or trusted adult</p>
      </header>

      <div className="report-range">
        <button className={`range-btn ${range === 7 ? 'active' : ''}`} onClick={() => setRange(7)}>
          <Calendar size={14} /> Past 7 days
        </button>
        <button className={`range-btn ${range === 30 ? 'active' : ''}`} onClick={() => setRange(30)}>
          <Calendar size={14} /> Past 30 days
        </button>
      </div>

      <div className="report-grid">
        <div className="report-stat card fade-in">
          <span className="report-stat-emoji">😊</span>
          <span className="report-stat-value">{report.moodAvg}/5</span>
          <span className="report-stat-label">Mood avg</span>
          <span className="report-stat-count">{report.moods.length} entries</span>
        </div>
        <div className="report-stat card fade-in">
          <span className="report-stat-emoji">⚡</span>
          <span className="report-stat-value">{report.energyAvg}/5</span>
          <span className="report-stat-label">Energy avg</span>
          <span className="report-stat-count">{report.energy.length} entries</span>
        </div>
        <div className="report-stat card fade-in">
          <span className="report-stat-emoji">🌙</span>
          <span className="report-stat-value">{report.sleepAvg}/5</span>
          <span className="report-stat-label">Sleep avg</span>
          <span className="report-stat-count">{report.sleep.length} entries</span>
        </div>
        <div className="report-stat card fade-in">
          <span className="report-stat-emoji">💊</span>
          <span className="report-stat-value">{report.medsAdherence}{typeof report.medsAdherence === 'number' ? '%' : ''}</span>
          <span className="report-stat-label">Med adherence</span>
          <span className="report-stat-count">{report.medsLogs.length} logs</span>
        </div>
        <div className="report-stat card fade-in">
          <span className="report-stat-emoji">⚠️</span>
          <span className="report-stat-value">{report.triggers.length}</span>
          <span className="report-stat-label">Triggers</span>
        </div>
        <div className="report-stat card fade-in">
          <span className="report-stat-emoji">📝</span>
          <span className="report-stat-value">{report.journal.length}</span>
          <span className="report-stat-label">Journal entries</span>
        </div>
      </div>

      {report.topMoods.length > 0 && (
        <div className="report-top-moods card">
          <h3 className="section-title">Top moods</h3>
          <div className="top-moods-list">
            {report.topMoods.map(([mood, count]) => (
              <span key={mood} className="top-mood-tag">{mood} ({count}x)</span>
            ))}
          </div>
        </div>
      )}

      <div className="report-actions">
        <button className="primary-btn" onClick={handleCopy}>
          <ClipboardCopy size={16} /> {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
        <button className="primary-btn" onClick={handleDownload} style={{ background: 'var(--sage)' }}>
          <Download size={16} /> Download as text
        </button>
      </div>
    </div>
  );
}

export default TherapistReportPage;
