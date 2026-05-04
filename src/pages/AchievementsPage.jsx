import React, { useState, useEffect } from 'react';
import { Trophy, Lock, Unlock } from 'lucide-react';
import {
  getAchievements, unlockAchievement, getStreaks, getWins, getGarden,
  getJournalEntries, getSleepLogs, getHomework, getGoals, getLetters, getBrainDump
} from '../utils/storage';
import './AchievementsPage.css';

const ACHIEVEMENT_DEFS = [
  { id: 'first_checkin', name: 'First Check-in', emoji: '🌱', description: 'Complete your first mood check-in' },
  { id: 'streak_7', name: '7-Day Streak', emoji: '🔥', description: 'Check in 7 days in a row' },
  { id: 'streak_30', name: '30-Day Streak', emoji: '💎', description: 'Check in 30 days in a row' },
  { id: 'wins_10', name: '10 Wins', emoji: '🏆', description: 'Log 10 wins in your jar' },
  { id: 'wins_50', name: '50 Wins', emoji: '👑', description: 'Log 50 wins — you\'re amazing!' },
  { id: 'first_plant', name: 'First Garden Plant', emoji: '🌸', description: 'Plant your first flower' },
  { id: 'plants_10', name: '10 Plants', emoji: '🌻', description: 'Grow 10 flowers in your garden' },
  { id: 'first_journal', name: 'First Journal Entry', emoji: '📝', description: 'Write your first journal entry' },
  { id: 'journal_10', name: '10 Journal Entries', emoji: '📖', description: 'Write 10 journal entries' },
  { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Log your first sleep entry' },
  { id: 'homework_hero', name: 'Homework Hero', emoji: '📚', description: 'Complete 5 homework assignments' },
  { id: 'goal_getter', name: 'Goal Getter', emoji: '🎯', description: 'Complete your first goal' },
  { id: 'selfcare_star', name: 'Self-Care Star', emoji: '⭐', description: 'Complete all self-care in a day' },
  { id: 'letter_writer', name: 'Letter Writer', emoji: '💌', description: 'Write your first letter' },
  { id: 'brain_dumper', name: 'Brain Dumper', emoji: '🧠', description: 'Do your first brain dump' },
  { id: 'petals_100', name: '100 Petals', emoji: '🌺', description: 'Earn 100 petals total' },
  { id: 'petals_500', name: '500 Petals', emoji: '💐', description: 'Earn 500 petals — incredible!' },
];

function AchievementsPage({ onBack }) {
  const [achievements, setAchievements] = useState({ unlocked: [], seen: [] });
  const [newUnlocks, setNewUnlocks] = useState([]);

  useEffect(() => {
    const a = getAchievements();
    const streaks = getStreaks();
    const wins = getWins();
    const garden = getGarden();
    const journal = getJournalEntries();
    const sleep = getSleepLogs();
    const homework = getHomework();
    const goals = getGoals();
    const letters = getLetters();
    const brainDump = getBrainDump();

    const checks = {
      first_checkin: streaks.totalCheckIns >= 1,
      streak_7: streaks.currentStreak >= 7 || streaks.longestStreak >= 7,
      streak_30: streaks.currentStreak >= 30 || streaks.longestStreak >= 30,
      wins_10: wins.length >= 10,
      wins_50: wins.length >= 50,
      first_plant: garden.flowers?.length >= 1,
      plants_10: garden.flowers?.length >= 10,
      first_journal: journal.length >= 1,
      journal_10: journal.length >= 10,
      night_owl: sleep.length >= 1,
      homework_hero: homework.filter(h => h.done || h.completed).length >= 5,
      goal_getter: goals.some(g => g.done || g.completed),
      selfcare_star: false, // checked elsewhere
      letter_writer: letters.length >= 1,
      brain_dumper: brainDump.length >= 1,
      petals_100: garden.totalPetals >= 100,
      petals_500: garden.totalPetals >= 500,
    };

    const newlyUnlocked = [];
    Object.entries(checks).forEach(([id, earned]) => {
      if (earned && !a.unlocked.includes(id)) {
        unlockAchievement(id);
        newlyUnlocked.push(id);
      }
    });

    setAchievements(getAchievements());
    setNewUnlocks(newlyUnlocked);
  }, []);

  const unlockedCount = achievements.unlocked.length;

  return (
    <div className="achievements-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Achievements 🏆</h1>
        <p className="page-subtitle">Look how far you've come</p>
      </header>

      <div className="achievements-stats card fade-in">
        <Trophy size={20} color="var(--warning)" />
        <span className="achievements-count">{unlockedCount}/{ACHIEVEMENT_DEFS.length} unlocked</span>
        <div className="achievements-bar">
          <div className="achievements-fill" style={{ width: `${(unlockedCount / ACHIEVEMENT_DEFS.length) * 100}%` }} />
        </div>
      </div>

      {newUnlocks.length > 0 && (
        <div className="new-unlocks slide-up">
          <h3>🎉 New achievements unlocked!</h3>
          {newUnlocks.map(id => {
            const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
            return (
              <div key={id} className="new-unlock-item">
                <span className="unlock-emoji">{def?.emoji}</span>
                <span className="unlock-name">{def?.name}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="achievements-grid">
        {ACHIEVEMENT_DEFS.map(def => {
          const isUnlocked = achievements.unlocked.includes(def.id);
          const isNew = newUnlocks.includes(def.id);
          return (
            <div key={def.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${isNew ? 'new' : ''} fade-in`}>
              <span className="achievement-emoji">{def.emoji}</span>
              <span className="achievement-name">{def.name}</span>
              <span className="achievement-desc">{def.description}</span>
              <span className="achievement-status">
                {isUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
              </span>
            </div>
          );
        })}
      </div>

      <p className="achievements-footer">
        💜 Every achievement represents real effort. Be proud of each one.
      </p>
    </div>
  );
}

export default AchievementsPage;
