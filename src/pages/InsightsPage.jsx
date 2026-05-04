import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Moon, Zap, Calendar } from 'lucide-react';
import { getMoods, getEnergyLogs, getSleepLogs, getStreaks } from '../utils/storage';
import './InsightsPage.css';

const MOOD_EMOJIS = { 1: '😢', 2: '😟', 3: '😐', 4: '🙂', 5: '😊' };
const MOOD_LABELS = { 1: 'Awful', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great' };

function InsightsPage({ onBack }) {
  const [moods, setMoods] = useState([]);
  const [energy, setEnergy] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0, totalCheckIns: 0 });

  useEffect(() => {
    setMoods(getMoods());
    setEnergy(getEnergyLogs());
    setSleep(getSleepLogs());
    setStreaks(getStreaks());
  }, []);

  const now = Date.now();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * 86400000);
    return d.toDateString();
  });
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * 86400000);
    return d.toDateString();
  });

  const getMoodForDay = (dateStr) => {
    const dayMoods = moods.filter(m => new Date(m.timestamp).toDateString() === dateStr);
    if (dayMoods.length === 0) return null;
    const avg = dayMoods.reduce((sum, m) => sum + (m.level || m.mood || 3), 0) / dayMoods.length;
    return Math.round(avg);
  };

  const getEnergyForDay = (dateStr) => {
    const dayEnergy = energy.filter(e => new Date(e.timestamp).toDateString() === dateStr);
    if (dayEnergy.length === 0) return null;
    return Math.round(dayEnergy.reduce((sum, e) => sum + e.level, 0) / dayEnergy.length);
  };

  const mood7 = last7Days.map(d => ({ date: d, mood: getMoodForDay(d), energy: getEnergyForDay(d) }));
  const mood30 = last30Days.map(d => ({ date: d, mood: getMoodForDay(d) }));

  // Most common mood this week
  const weekMoods = mood7.filter(d => d.mood !== null).map(d => d.mood);
  const moodCounts = {};
  weekMoods.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // Best days insight
  const goodDays = mood7.filter(d => d.mood >= 4);
  const dayNames = goodDays.map(d => new Date(d.date).toLocaleDateString([], { weekday: 'long' }));

  // Sleep vs mood
  const sleepMoodCorrelation = sleep.length > 0 && moods.length > 0;

  const avgMood7 = weekMoods.length > 0
    ? (weekMoods.reduce((a, b) => a + b, 0) / weekMoods.length).toFixed(1)
    : null;

  return (
    <div className="insights-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Insights 📊</h1>
        <p className="page-subtitle">Patterns help you understand yourself better</p>
      </header>

      {/* Streak Stats */}
      <div className="insight-stats card fade-in">
        <div className="stat-item">
          <Calendar size={16} color="var(--lavender-dark)" />
          <span className="stat-value">{streaks.currentStreak}</span>
          <span className="stat-label">current streak</span>
        </div>
        <div className="stat-item">
          <TrendingUp size={16} color="var(--sage-dark)" />
          <span className="stat-value">{streaks.longestStreak}</span>
          <span className="stat-label">longest streak</span>
        </div>
        <div className="stat-item">
          <BarChart3 size={16} color="var(--blush-dark)" />
          <span className="stat-value">{streaks.totalCheckIns}</span>
          <span className="stat-label">total check-ins</span>
        </div>
      </div>

      {/* 7-Day Mood Chart */}
      <div className="insight-section card fade-in">
        <h3 className="section-title">Mood — Last 7 days</h3>
        <div className="bar-chart">
          {mood7.map((d, i) => (
            <div key={i} className="bar-col">
              <div className="bar-wrapper">
                {d.mood ? (
                  <div
                    className="bar mood-bar"
                    style={{ height: `${(d.mood / 5) * 100}%` }}
                    title={`${MOOD_LABELS[d.mood]}`}
                  >
                    <span className="bar-emoji">{MOOD_EMOJIS[d.mood]}</span>
                  </div>
                ) : (
                  <div className="bar empty-bar" />
                )}
              </div>
              <span className="bar-label">
                {new Date(d.date).toLocaleDateString([], { weekday: 'narrow' })}
              </span>
            </div>
          ))}
        </div>
        {avgMood7 && <p className="chart-note">Average: {avgMood7}/5 this week</p>}
      </div>

      {/* Energy alongside mood */}
      {energy.length > 0 && (
        <div className="insight-section card fade-in">
          <h3 className="section-title">Energy — Last 7 days</h3>
          <div className="bar-chart">
            {mood7.map((d, i) => (
              <div key={i} className="bar-col">
                <div className="bar-wrapper">
                  {d.energy ? (
                    <div
                      className="bar energy-bar"
                      style={{ height: `${(d.energy / 5) * 100}%` }}
                    >
                      <span className="bar-value">{d.energy}</span>
                    </div>
                  ) : (
                    <div className="bar empty-bar" />
                  )}
                </div>
                <span className="bar-label">
                  {new Date(d.date).toLocaleDateString([], { weekday: 'narrow' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 30-Day Mood Overview */}
      {moods.length > 7 && (
        <div className="insight-section card fade-in">
          <h3 className="section-title">Mood — Last 30 days</h3>
          <div className="month-grid">
            {mood30.map((d, i) => (
              <div
                key={i}
                className={`month-cell ${d.mood ? `mood-${d.mood}` : 'no-data'}`}
                title={`${new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}: ${d.mood ? MOOD_LABELS[d.mood] : 'No data'}`}
              />
            ))}
          </div>
          <div className="month-legend">
            <span>😢 1</span><span>😟 2</span><span>😐 3</span><span>🙂 4</span><span>😊 5</span>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="insight-cards">
        {mostCommonMood && (
          <div className="insight-card card fade-in">
            <span className="insight-icon">{MOOD_EMOJIS[mostCommonMood[0]]}</span>
            <div>
              <span className="insight-title">Most common mood this week</span>
              <span className="insight-value">{MOOD_LABELS[mostCommonMood[0]]} ({mostCommonMood[1]} times)</span>
            </div>
          </div>
        )}

        {goodDays.length > 0 && (
          <div className="insight-card card fade-in">
            <span className="insight-icon">✨</span>
            <div>
              <span className="insight-title">Your best days tend to be</span>
              <span className="insight-value">{[...new Set(dayNames)].join(', ')}</span>
            </div>
          </div>
        )}

        {sleepMoodCorrelation && (
          <div className="insight-card card fade-in">
            <span className="insight-icon"><Moon size={18} /></span>
            <div>
              <span className="insight-title">Sleep & mood</span>
              <span className="insight-value">You're tracking both sleep and mood — keep it up! Patterns will emerge over time.</span>
            </div>
          </div>
        )}
      </div>

      {moods.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>📊</span>
          <p>Start logging moods to see your insights.</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>The more you track, the more patterns you'll discover.</p>
        </div>
      )}
    </div>
  );
}

export default InsightsPage;
