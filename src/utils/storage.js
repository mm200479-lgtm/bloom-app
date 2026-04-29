// All data stays on device - localStorage only
const STORAGE_KEYS = {
  MOODS: 'bloom_moods',
  TASKS: 'bloom_tasks',
  JOURNAL: 'bloom_journal',
  ROUTINES: 'bloom_routines',
  SAFETY_PLAN: 'bloom_safety_plan',
  SETTINGS: 'bloom_settings',
  STREAKS: 'bloom_streaks',
  TRIGGERS: 'bloom_triggers',
  WINS: 'bloom_wins',
  ENERGY: 'bloom_energy',
  GARDEN: 'bloom_garden',
  PHOTOS: 'bloom_photos',
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

// --- Moods ---
export function getMoods() {
  return getData(STORAGE_KEYS.MOODS) || [];
}

export function addMood(mood) {
  const moods = getMoods();
  moods.unshift({ ...mood, id: Date.now(), timestamp: new Date().toISOString() });
  setData(STORAGE_KEYS.MOODS, moods);
  return moods;
}

// --- Tasks ---
export function getTasks() {
  return getData(STORAGE_KEYS.TASKS) || [];
}

export function saveTasks(tasks) {
  setData(STORAGE_KEYS.TASKS, tasks);
}

// --- Journal ---
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

// --- Safety Plan ---
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

// --- Routines ---
export function getRoutines() {
  return getData(STORAGE_KEYS.ROUTINES) || {
    morning: [],
    evening: [],
    completedToday: {},
  };
}

export function saveRoutines(routines) {
  setData(STORAGE_KEYS.ROUTINES, routines);
}

// --- Streaks ---
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

// --- Triggers ---
export function getTriggers() {
  return getData(STORAGE_KEYS.TRIGGERS) || [];
}

export function addTrigger(trigger) {
  const triggers = getTriggers();
  triggers.unshift({ ...trigger, id: Date.now(), timestamp: new Date().toISOString() });
  setData(STORAGE_KEYS.TRIGGERS, triggers);
  return triggers;
}

export function deleteTrigger(id) {
  const triggers = getTriggers().filter(t => t.id !== id);
  setData(STORAGE_KEYS.TRIGGERS, triggers);
  return triggers;
}

// --- Win Jar ---
export function getWins() {
  return getData(STORAGE_KEYS.WINS) || [];
}

export function addWin(win) {
  const wins = getWins();
  wins.unshift({ text: win, id: Date.now(), timestamp: new Date().toISOString() });
  setData(STORAGE_KEYS.WINS, wins);
  return wins;
}

export function deleteWin(id) {
  const wins = getWins().filter(w => w.id !== id);
  setData(STORAGE_KEYS.WINS, wins);
  return wins;
}

// --- Energy ---
export function getEnergyLogs() {
  return getData(STORAGE_KEYS.ENERGY) || [];
}

export function addEnergyLog(level, note) {
  const logs = getEnergyLogs();
  logs.unshift({ level, note, id: Date.now(), timestamp: new Date().toISOString() });
  setData(STORAGE_KEYS.ENERGY, logs);
  return logs;
}

// --- Garden (reward system) ---
export function getGarden() {
  return getData(STORAGE_KEYS.GARDEN) || {
    petals: 0,
    totalPetals: 0,
    flowers: [],
    unlockedItems: [],
  };
}

export function addPetals(amount) {
  const garden = getGarden();
  garden.petals += amount;
  garden.totalPetals += amount;
  setData(STORAGE_KEYS.GARDEN, garden);
  return garden;
}

export function spendPetals(amount) {
  const garden = getGarden();
  if (garden.petals < amount) return null;
  garden.petals -= amount;
  setData(STORAGE_KEYS.GARDEN, garden);
  return garden;
}

export function addFlower(flower) {
  const garden = getGarden();
  garden.flowers.push({ ...flower, id: Date.now(), plantedAt: new Date().toISOString() });
  setData(STORAGE_KEYS.GARDEN, garden);
  return garden;
}

// --- Photos ---
export function getPhotos() {
  return getData(STORAGE_KEYS.PHOTOS) || [];
}

export function addPhoto(photoData) {
  const photos = getPhotos();
  photos.unshift({ ...photoData, id: Date.now(), timestamp: new Date().toISOString() });
  setData(STORAGE_KEYS.PHOTOS, photos);
  return photos;
}

export function deletePhoto(id) {
  const photos = getPhotos().filter(p => p.id !== id);
  setData(STORAGE_KEYS.PHOTOS, photos);
  return photos;
}

// --- Settings ---
export function getSettings() {
  return getData(STORAGE_KEYS.SETTINGS) || {
    theme: 'light',
    colorScheme: 'lavender',
    reminderTime: null,
    name: '',
  };
}

export function saveSettings(settings) {
  setData(STORAGE_KEYS.SETTINGS, settings);
}

// --- Export ---
export function exportAllData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = getData(key);
  });
  return JSON.stringify(data, null, 2);
}

export { STORAGE_KEYS };
