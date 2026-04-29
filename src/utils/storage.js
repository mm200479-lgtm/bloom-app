// All data stays on device - localStorage only
const STORAGE_KEYS = {
  MOODS: 'bloom_moods',
  TASKS: 'bloom_tasks',
  JOURNAL: 'bloom_journal',
  ROUTINES: 'bloom_routines',
  SAFETY_PLAN: 'bloom_safety_plan',
  SETTINGS: 'bloom_settings',
  STREAKS: 'bloom_streaks',
};

export function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getMoods() {
  return getData(STORAGE_KEYS.MOODS) || [];
}

export function addMood(mood) {
  const moods = getMoods();
  moods.unshift({ ...mood, id: Date.now(), timestamp: new Date().toISOString() });
  setData(STORAGE_KEYS.MOODS, moods);
  return moods;
}

export function getTasks() {
  return getData(STORAGE_KEYS.TASKS) || [];
}

export function saveTasks(tasks) {
  setData(STORAGE_KEYS.TASKS, tasks);
}

export function getJournalEntries() {
  return getData(STORAGE_KEYS.JOURNAL) || [];
}

export function addJournalEntry(entry) {
  const entries = getJournalEntries();
  entries.unshift({ ...entry, id: Date.now(), timestamp: new Date().toISOString() });
  setData(STORAGE_KEYS.JOURNAL, entries);
  return entries;
}

export function deleteJournalEntry(id) {
  const entries = getJournalEntries().filter(e => e.id !== id);
  setData(STORAGE_KEYS.JOURNAL, entries);
  return entries;
}

export function getSafetyPlan() {
  return getData(STORAGE_KEYS.SAFETY_PLAN) || {
    calmingStrategies: [],
    safeContacts: [],
    safeSpaces: [],
    warningSignals: [],
    reasonsToKeepGoing: [],
  };
}

export function saveSafetyPlan(plan) {
  setData(STORAGE_KEYS.SAFETY_PLAN, plan);
}

export function getRoutines() {
  return getData(STORAGE_KEYS.ROUTINES) || {
    morning: [],
    evening: [],
  };
}

export function saveRoutines(routines) {
  setData(STORAGE_KEYS.ROUTINES, routines);
}

export function getStreaks() {
  return getData(STORAGE_KEYS.STREAKS) || {
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
    totalCheckIns: 0,
  };
}

export function updateStreaks() {
  const streaks = getStreaks();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (streaks.lastCheckIn === today) return streaks;

  streaks.totalCheckIns += 1;

  if (streaks.lastCheckIn === yesterday) {
    streaks.currentStreak += 1;
  } else if (streaks.lastCheckIn !== today) {
    streaks.currentStreak = 1;
  }

  if (streaks.currentStreak > streaks.longestStreak) {
    streaks.longestStreak = streaks.currentStreak;
  }

  streaks.lastCheckIn = today;
  setData(STORAGE_KEYS.STREAKS, streaks);
  return streaks;
}

export { STORAGE_KEYS };
