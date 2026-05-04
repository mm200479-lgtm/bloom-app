// All data stays on device - localStorage only
// Multi-profile support: each user gets their own data namespace

const STORAGE_KEYS = {
  MOODS: 'moods', TASKS: 'tasks', JOURNAL: 'journal', ROUTINES: 'routines',
  SAFETY_PLAN: 'safety_plan', SETTINGS: 'settings', STREAKS: 'streaks',
  TRIGGERS: 'triggers', WINS: 'wins', ENERGY: 'energy', GARDEN: 'garden',
  PHOTOS: 'photos', SLEEP: 'sleep', MEDS: 'meds', HOMEWORK: 'homework',
  GOALS: 'goals', LETTERS: 'letters', PERIOD: 'period', ACHIEVEMENTS: 'achievements',
  CHAT: 'chat', WATER: 'water', MEALS: 'meals', MOVEMENT: 'movement',
  SENSORY: 'sensory', SOCIAL_BATTERY: 'social_battery', SCRIPTS: 'scripts',
  THOUGHT_RECORDS: 'thought_records', NIGHTMARES: 'nightmares', QUOTES: 'quotes',
  DREAMS: 'dreams', BUCKET_LIST: 'bucket_list', BRAIN_DUMP: 'brain_dump',
  APPOINTMENTS: 'appointments', REWARD_MENU: 'reward_menu', PLAYLISTS: 'playlists',
  DISTRACTION_BOX: 'distraction_box', BODY_MAP: 'body_map', DEBRIEF: 'debrief',
};

const PROFILES_KEY = 'bloom_profiles';
const ACTIVE_PROFILE_KEY = 'bloom_active_profile';

export function getProfiles() { try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || []; } catch { return []; } }
export function saveProfiles(p) { localStorage.setItem(PROFILES_KEY, JSON.stringify(p)); }
export function createProfile(name, avatar) {
  const profiles = getProfiles();
  const id = `profile_${Date.now()}`;
  const profile = { id, name: name.trim(), avatar: avatar || '🌸', createdAt: new Date().toISOString() };
  profiles.push(profile); saveProfiles(profiles); setActiveProfile(id); return profile;
}
export function deleteProfile(id) {
  const profiles = getProfiles().filter(p => p.id !== id); saveProfiles(profiles);
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(`${id}_${k}`));
  if (getActiveProfileId() === id) localStorage.removeItem(ACTIVE_PROFILE_KEY);
  return profiles;
}
export function updateProfile(id, updates) {
  const profiles = getProfiles().map(p => p.id === id ? { ...p, ...updates } : p);
  saveProfiles(profiles); return profiles;
}
export function getActiveProfileId() { return localStorage.getItem(ACTIVE_PROFILE_KEY); }
export function setActiveProfile(id) { localStorage.setItem(ACTIVE_PROFILE_KEY, id); }
export function getActiveProfile() {
  const id = getActiveProfileId(); if (!id) return null;
  return getProfiles().find(p => p.id === id) || null;
}

function profileKey(key) { const id = getActiveProfileId(); return id ? `${id}_${key}` : `bloom_${key}`; }
export function getData(key) { try { const d = localStorage.getItem(profileKey(key)); return d ? JSON.parse(d) : null; } catch { return null; } }
export function setData(key, value) {
  try {
    localStorage.setItem(profileKey(key), JSON.stringify(value));
    try { import('./sync.js').then(({ scheduleSyncToCloud }) => scheduleSyncToCloud()); } catch {}
    return true;
  } catch { return false; }
}

// Generic list helpers
function getList(key) { return getData(key) || []; }
function addToList(key, item) { const list = getList(key); list.unshift({ ...item, id: Date.now(), timestamp: new Date().toISOString() }); setData(key, list); return list; }
function removeFromList(key, id) { const list = getList(key).filter(i => i.id !== id); setData(key, list); return list; }
function saveList(key, list) { setData(key, list); }

// --- Moods ---
export function getMoods() { return getList(STORAGE_KEYS.MOODS); }
export function addMood(mood) { return addToList(STORAGE_KEYS.MOODS, mood); }

// --- Tasks ---
export function getTasks() { return getList(STORAGE_KEYS.TASKS); }
export function saveTasks(t) { saveList(STORAGE_KEYS.TASKS, t); }

// --- Journal ---
export function getJournalEntries() { return getList(STORAGE_KEYS.JOURNAL); }
export function addJournalEntry(e) { return addToList(STORAGE_KEYS.JOURNAL, e); }
export function deleteJournalEntry(id) { return removeFromList(STORAGE_KEYS.JOURNAL, id); }

// --- Safety Plan ---
export function getSafetyPlan() {
  return getData(STORAGE_KEYS.SAFETY_PLAN) || { calmingStrategies: [], safeContacts: [], safeSpaces: [], warningSignals: [], reasonsToKeepGoing: [] };
}
export function saveSafetyPlan(p) { setData(STORAGE_KEYS.SAFETY_PLAN, p); }

// --- Routines ---
export function getRoutines() { return getData(STORAGE_KEYS.ROUTINES) || { morning: [], evening: [], completedToday: {} }; }
export function saveRoutines(r) { setData(STORAGE_KEYS.ROUTINES, r); }

// --- Streaks ---
export function getStreaks() { return getData(STORAGE_KEYS.STREAKS) || { currentStreak: 0, longestStreak: 0, lastCheckIn: null, totalCheckIns: 0 }; }
export function updateStreaks() {
  const s = getStreaks(); const today = new Date().toDateString(); const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (s.lastCheckIn === today) return s; s.totalCheckIns += 1;
  s.currentStreak = s.lastCheckIn === yesterday ? s.currentStreak + 1 : 1;
  if (s.currentStreak > s.longestStreak) s.longestStreak = s.currentStreak;
  s.lastCheckIn = today; setData(STORAGE_KEYS.STREAKS, s); return s;
}

// --- Triggers ---
export function getTriggers() { return getList(STORAGE_KEYS.TRIGGERS); }
export function addTrigger(t) { return addToList(STORAGE_KEYS.TRIGGERS, t); }
export function deleteTrigger(id) { return removeFromList(STORAGE_KEYS.TRIGGERS, id); }

// --- Wins ---
export function getWins() { return getList(STORAGE_KEYS.WINS); }
export function addWin(text) { return addToList(STORAGE_KEYS.WINS, { text }); }
export function deleteWin(id) { return removeFromList(STORAGE_KEYS.WINS, id); }

// --- Energy ---
export function getEnergyLogs() { return getList(STORAGE_KEYS.ENERGY); }
export function addEnergyLog(level, note) { return addToList(STORAGE_KEYS.ENERGY, { level, note }); }

// --- Garden ---
export function getGarden() { return getData(STORAGE_KEYS.GARDEN) || { petals: 0, totalPetals: 0, flowers: [], unlockedItems: [] }; }
export function addPetals(n) { const g = getGarden(); g.petals += n; g.totalPetals += n; setData(STORAGE_KEYS.GARDEN, g); return g; }
export function spendPetals(n) { const g = getGarden(); if (g.petals < n) return null; g.petals -= n; setData(STORAGE_KEYS.GARDEN, g); return g; }
export function addFlower(f) { const g = getGarden(); g.flowers.push({ ...f, id: Date.now(), plantedAt: new Date().toISOString() }); setData(STORAGE_KEYS.GARDEN, g); return g; }

// --- Photos ---
export function getPhotos() { return getList(STORAGE_KEYS.PHOTOS); }
export function addPhoto(p) { return addToList(STORAGE_KEYS.PHOTOS, p); }
export function deletePhoto(id) { return removeFromList(STORAGE_KEYS.PHOTOS, id); }

// --- Sleep ---
export function getSleepLogs() { return getList(STORAGE_KEYS.SLEEP); }
export function addSleepLog(log) { return addToList(STORAGE_KEYS.SLEEP, log); }

// --- Meds ---
export function getMeds() { return getData(STORAGE_KEYS.MEDS) || { medications: [], logs: [] }; }
export function saveMeds(m) { setData(STORAGE_KEYS.MEDS, m); }

// --- Homework ---
export function getHomework() { return getList(STORAGE_KEYS.HOMEWORK); }
export function saveHomework(h) { saveList(STORAGE_KEYS.HOMEWORK, h); }

// --- Goals ---
export function getGoals() { return getList(STORAGE_KEYS.GOALS); }
export function saveGoals(g) { saveList(STORAGE_KEYS.GOALS, g); }

// --- Letters ---
export function getLetters() { return getList(STORAGE_KEYS.LETTERS); }
export function addLetter(l) { return addToList(STORAGE_KEYS.LETTERS, l); }
export function deleteLetter(id) { return removeFromList(STORAGE_KEYS.LETTERS, id); }

// --- Period ---
export function getPeriodData() { return getData(STORAGE_KEYS.PERIOD) || { logs: [], cycleLength: 28 }; }
export function savePeriodData(d) { setData(STORAGE_KEYS.PERIOD, d); }

// --- Achievements ---
export function getAchievements() { return getData(STORAGE_KEYS.ACHIEVEMENTS) || { unlocked: [], seen: [] }; }
export function saveAchievements(a) { setData(STORAGE_KEYS.ACHIEVEMENTS, a); }
export function unlockAchievement(id) { const a = getAchievements(); if (!a.unlocked.includes(id)) { a.unlocked.push(id); saveAchievements(a); return true; } return false; }

// --- Chat ---
export function getChatHistory() { return getData(STORAGE_KEYS.CHAT) || []; }
export function saveChatHistory(m) { setData(STORAGE_KEYS.CHAT, m.slice(-100)); }

// --- Water ---
export function getWaterLog() { return getData(STORAGE_KEYS.WATER) || { date: null, cups: 0, goal: 8, history: [] }; }
export function saveWaterLog(w) { setData(STORAGE_KEYS.WATER, w); }

// --- Meals ---
export function getMealLog() { return getData(STORAGE_KEYS.MEALS) || { date: null, meals: {}, history: [] }; }
export function saveMealLog(m) { setData(STORAGE_KEYS.MEALS, m); }

// --- Movement ---
export function getMovementLog() { return getData(STORAGE_KEYS.MOVEMENT) || { date: null, moved: false, type: '', history: [] }; }
export function saveMovementLog(m) { setData(STORAGE_KEYS.MOVEMENT, m); }

// --- Sensory Kit ---
export function getSensoryKit() { return getData(STORAGE_KEYS.SENSORY) || []; }
export function saveSensoryKit(s) { setData(STORAGE_KEYS.SENSORY, s); }

// --- Social Battery ---
export function getSocialBattery() { return getList(STORAGE_KEYS.SOCIAL_BATTERY); }
export function addSocialBattery(entry) { return addToList(STORAGE_KEYS.SOCIAL_BATTERY, entry); }

// --- Scripts ---
export function getScripts() { return getData(STORAGE_KEYS.SCRIPTS) || []; }
export function saveScripts(s) { setData(STORAGE_KEYS.SCRIPTS, s); }

// --- Thought Records ---
export function getThoughtRecords() { return getList(STORAGE_KEYS.THOUGHT_RECORDS); }
export function addThoughtRecord(r) { return addToList(STORAGE_KEYS.THOUGHT_RECORDS, r); }
export function deleteThoughtRecord(id) { return removeFromList(STORAGE_KEYS.THOUGHT_RECORDS, id); }

// --- Nightmares ---
export function getNightmares() { return getList(STORAGE_KEYS.NIGHTMARES); }
export function addNightmare(n) { return addToList(STORAGE_KEYS.NIGHTMARES, n); }

// --- Quotes ---
export function getQuotes() { return getList(STORAGE_KEYS.QUOTES); }
export function addQuote(q) { return addToList(STORAGE_KEYS.QUOTES, q); }
export function deleteQuote(id) { return removeFromList(STORAGE_KEYS.QUOTES, id); }

// --- Dreams ---
export function getDreams() { return getList(STORAGE_KEYS.DREAMS); }
export function addDream(d) { return addToList(STORAGE_KEYS.DREAMS, d); }

// --- Bucket List ---
export function getBucketList() { return getList(STORAGE_KEYS.BUCKET_LIST); }
export function saveBucketList(b) { saveList(STORAGE_KEYS.BUCKET_LIST, b); }

// --- Brain Dump ---
export function getBrainDump() { return getList(STORAGE_KEYS.BRAIN_DUMP); }
export function addBrainDump(text) { return addToList(STORAGE_KEYS.BRAIN_DUMP, { text }); }
export function deleteBrainDump(id) { return removeFromList(STORAGE_KEYS.BRAIN_DUMP, id); }

// --- Appointments ---
export function getAppointments() { return getList(STORAGE_KEYS.APPOINTMENTS); }
export function saveAppointments(a) { saveList(STORAGE_KEYS.APPOINTMENTS, a); }

// --- Reward Menu ---
export function getRewardMenu() { return getData(STORAGE_KEYS.REWARD_MENU) || []; }
export function saveRewardMenu(r) { setData(STORAGE_KEYS.REWARD_MENU, r); }

// --- Playlists ---
export function getPlaylists() { return getData(STORAGE_KEYS.PLAYLISTS) || []; }
export function savePlaylists(p) { setData(STORAGE_KEYS.PLAYLISTS, p); }

// --- Distraction Box ---
export function getDistractionBox() { return getData(STORAGE_KEYS.DISTRACTION_BOX) || { quick: [], medium: [], long: [] }; }
export function saveDistractionBox(d) { setData(STORAGE_KEYS.DISTRACTION_BOX, d); }

// --- Body Map ---
export function getBodyMapEntries() { return getList(STORAGE_KEYS.BODY_MAP); }
export function addBodyMapEntry(e) { return addToList(STORAGE_KEYS.BODY_MAP, e); }

// --- Debrief ---
export function getDebriefs() { return getList(STORAGE_KEYS.DEBRIEF); }
export function addDebrief(d) { return addToList(STORAGE_KEYS.DEBRIEF, d); }

// --- Settings ---
export function getSettings() { return getData(STORAGE_KEYS.SETTINGS) || { theme: 'light', colorScheme: 'lavender', reminderTime: null }; }
export function saveSettings(s) { setData(STORAGE_KEYS.SETTINGS, s); }

// --- Export ---
export function exportAllData() {
  const profile = getActiveProfile(); const data = { profile };
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => { data[name] = getData(key); });
  return JSON.stringify(data, null, 2);
}

export { STORAGE_KEYS };
