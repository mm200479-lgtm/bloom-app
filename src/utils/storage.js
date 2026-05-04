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
  STICKERS: 'stickers', CUSTOM_AFFIRMATIONS: 'custom_affirmations',
  COMFORT_MEDIA: 'comfort_media', SAFE_PEOPLE: 'safe_people',
  VALUES: 'values', STRENGTHS: 'strengths', IDENTITY: 'identity',
  BOUNDARIES: 'boundaries', TIME_CAPSULES: 'time_capsules',
  BAD_DAY_PROTOCOL: 'bad_day_protocol', PINNED: 'pinned',
  GAME_SCORES: 'game_scores',
};

const PROFILES_KEY = 'bloom_profiles';
const ACTIVE_PROFILE_KEY = 'bloom_active_profile';

// --- Profile Management ---
export function getProfiles() { try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || []; } catch { return []; } }
export function saveProfiles(p) { localStorage.setItem(PROFILES_KEY, JSON.stringify(p)); }
export function createProfile(name, avatar) {
  const profiles = getProfiles(); const id = `profile_${Date.now()}`;
  const profile = { id, name: name.trim(), avatar: avatar || '🌸', createdAt: new Date().toISOString() };
  profiles.push(profile); saveProfiles(profiles); setActiveProfile(id); return profile;
}
export function deleteProfile(id) {
  const profiles = getProfiles().filter(p => p.id !== id); saveProfiles(profiles);
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(`${id}_${k}`));
  if (getActiveProfileId() === id) localStorage.removeItem(ACTIVE_PROFILE_KEY); return profiles;
}
export function updateProfile(id, updates) {
  const profiles = getProfiles().map(p => p.id === id ? { ...p, ...updates } : p);
  saveProfiles(profiles); return profiles;
}
export function getActiveProfileId() { return localStorage.getItem(ACTIVE_PROFILE_KEY); }
export function setActiveProfile(id) { localStorage.setItem(ACTIVE_PROFILE_KEY, id); }
export function getActiveProfile() { const id = getActiveProfileId(); if (!id) return null; return getProfiles().find(p => p.id === id) || null; }

// --- Namespaced data access ---
function profileKey(key) { const id = getActiveProfileId(); return id ? `${id}_${key}` : `bloom_${key}`; }
export function getData(key) { try { const d = localStorage.getItem(profileKey(key)); return d ? JSON.parse(d) : null; } catch { return null; } }
export function setData(key, value) {
  try { localStorage.setItem(profileKey(key), JSON.stringify(value));
    try { import('./sync.js').then(({ scheduleSyncToCloud }) => scheduleSyncToCloud()); } catch {} return true;
  } catch { return false; }
}

// Generic helpers
function getList(key) { return getData(key) || []; }
function addToList(key, item) { const list = getList(key); list.unshift({ ...item, id: Date.now(), timestamp: new Date().toISOString() }); setData(key, list); return list; }
function removeFromList(key, id) { const list = getList(key).filter(i => i.id !== id); setData(key, list); return list; }
function saveList(key, list) { setData(key, list); }
function getObj(key, defaults) { return getData(key) || defaults; }

// --- All data accessors ---
export const getMoods = () => getList(STORAGE_KEYS.MOODS);
export const addMood = (m) => addToList(STORAGE_KEYS.MOODS, m);
export const getTasks = () => getList(STORAGE_KEYS.TASKS);
export const saveTasks = (t) => saveList(STORAGE_KEYS.TASKS, t);
export const getJournalEntries = () => getList(STORAGE_KEYS.JOURNAL);
export const addJournalEntry = (e) => addToList(STORAGE_KEYS.JOURNAL, e);
export const deleteJournalEntry = (id) => removeFromList(STORAGE_KEYS.JOURNAL, id);
export const getSafetyPlan = () => getObj(STORAGE_KEYS.SAFETY_PLAN, { calmingStrategies: [], safeContacts: [], safeSpaces: [], warningSignals: [], reasonsToKeepGoing: [] });
export const saveSafetyPlan = (p) => setData(STORAGE_KEYS.SAFETY_PLAN, p);
export const getRoutines = () => getObj(STORAGE_KEYS.ROUTINES, { morning: [], evening: [], completedToday: {} });
export const saveRoutines = (r) => setData(STORAGE_KEYS.ROUTINES, r);
export const getStreaks = () => getObj(STORAGE_KEYS.STREAKS, { currentStreak: 0, longestStreak: 0, lastCheckIn: null, totalCheckIns: 0 });
export function updateStreaks() {
  const s = getStreaks(); const today = new Date().toDateString(); const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (s.lastCheckIn === today) return s; s.totalCheckIns += 1;
  s.currentStreak = s.lastCheckIn === yesterday ? s.currentStreak + 1 : 1;
  if (s.currentStreak > s.longestStreak) s.longestStreak = s.currentStreak;
  s.lastCheckIn = today; setData(STORAGE_KEYS.STREAKS, s); return s;
}
export function freezeStreak() {
  const s = getStreaks(); s.lastCheckIn = new Date().toDateString(); setData(STORAGE_KEYS.STREAKS, s); return s;
}
export const getTriggers = () => getList(STORAGE_KEYS.TRIGGERS);
export const addTrigger = (t) => addToList(STORAGE_KEYS.TRIGGERS, t);
export const deleteTrigger = (id) => removeFromList(STORAGE_KEYS.TRIGGERS, id);
export const getWins = () => getList(STORAGE_KEYS.WINS);
export const addWin = (text) => addToList(STORAGE_KEYS.WINS, { text });
export const deleteWin = (id) => removeFromList(STORAGE_KEYS.WINS, id);
export const getEnergyLogs = () => getList(STORAGE_KEYS.ENERGY);
export const addEnergyLog = (level, note) => addToList(STORAGE_KEYS.ENERGY, { level, note });
export const getGarden = () => getObj(STORAGE_KEYS.GARDEN, { petals: 0, totalPetals: 0, flowers: [], unlockedItems: [] });
export function addPetals(n) { const g = getGarden(); g.petals += n; g.totalPetals += n; setData(STORAGE_KEYS.GARDEN, g); return g; }
export function spendPetals(n) { const g = getGarden(); if (g.petals < n) return null; g.petals -= n; setData(STORAGE_KEYS.GARDEN, g); return g; }
export function addFlower(f) { const g = getGarden(); g.flowers.push({ ...f, id: Date.now(), plantedAt: new Date().toISOString() }); setData(STORAGE_KEYS.GARDEN, g); return g; }
export const getPhotos = () => getList(STORAGE_KEYS.PHOTOS);
export const addPhoto = (p) => addToList(STORAGE_KEYS.PHOTOS, p);
export const deletePhoto = (id) => removeFromList(STORAGE_KEYS.PHOTOS, id);
export const getSleepLogs = () => getList(STORAGE_KEYS.SLEEP);
export const addSleepLog = (l) => addToList(STORAGE_KEYS.SLEEP, l);
export const getMeds = () => getObj(STORAGE_KEYS.MEDS, { medications: [], logs: [] });
export const saveMeds = (m) => setData(STORAGE_KEYS.MEDS, m);
export const getHomework = () => getList(STORAGE_KEYS.HOMEWORK);
export const saveHomework = (h) => saveList(STORAGE_KEYS.HOMEWORK, h);
export const getGoals = () => getList(STORAGE_KEYS.GOALS);
export const saveGoals = (g) => saveList(STORAGE_KEYS.GOALS, g);
export const getLetters = () => getList(STORAGE_KEYS.LETTERS);
export const addLetter = (l) => addToList(STORAGE_KEYS.LETTERS, l);
export const deleteLetter = (id) => removeFromList(STORAGE_KEYS.LETTERS, id);
export const getPeriodData = () => getObj(STORAGE_KEYS.PERIOD, { logs: [], cycleLength: 28 });
export const savePeriodData = (d) => setData(STORAGE_KEYS.PERIOD, d);
export const getAchievements = () => getObj(STORAGE_KEYS.ACHIEVEMENTS, { unlocked: [], seen: [] });
export const saveAchievements = (a) => setData(STORAGE_KEYS.ACHIEVEMENTS, a);
export function unlockAchievement(id) { const a = getAchievements(); if (!a.unlocked.includes(id)) { a.unlocked.push(id); saveAchievements(a); return true; } return false; }
export const getChatHistory = () => getData(STORAGE_KEYS.CHAT) || [];
export const saveChatHistory = (m) => setData(STORAGE_KEYS.CHAT, m.slice(-100));
export const getWaterLog = () => getObj(STORAGE_KEYS.WATER, { date: null, cups: 0, goal: 8, history: [] });
export const saveWaterLog = (w) => setData(STORAGE_KEYS.WATER, w);
export const getMealLog = () => getObj(STORAGE_KEYS.MEALS, { date: null, meals: {}, history: [] });
export const saveMealLog = (m) => setData(STORAGE_KEYS.MEALS, m);
export const getMovementLog = () => getObj(STORAGE_KEYS.MOVEMENT, { date: null, moved: false, type: '', history: [] });
export const saveMovementLog = (m) => setData(STORAGE_KEYS.MOVEMENT, m);
export const getSensoryKit = () => getData(STORAGE_KEYS.SENSORY) || [];
export const saveSensoryKit = (s) => setData(STORAGE_KEYS.SENSORY, s);
export const getSocialBattery = () => getList(STORAGE_KEYS.SOCIAL_BATTERY);
export const addSocialBattery = (e) => addToList(STORAGE_KEYS.SOCIAL_BATTERY, e);
export const getScripts = () => getData(STORAGE_KEYS.SCRIPTS) || [];
export const saveScripts = (s) => setData(STORAGE_KEYS.SCRIPTS, s);
export const getThoughtRecords = () => getList(STORAGE_KEYS.THOUGHT_RECORDS);
export const addThoughtRecord = (r) => addToList(STORAGE_KEYS.THOUGHT_RECORDS, r);
export const deleteThoughtRecord = (id) => removeFromList(STORAGE_KEYS.THOUGHT_RECORDS, id);
export const getNightmares = () => getList(STORAGE_KEYS.NIGHTMARES);
export const addNightmare = (n) => addToList(STORAGE_KEYS.NIGHTMARES, n);
export const getQuotes = () => getList(STORAGE_KEYS.QUOTES);
export const addQuote = (q) => addToList(STORAGE_KEYS.QUOTES, q);
export const deleteQuote = (id) => removeFromList(STORAGE_KEYS.QUOTES, id);
export const getDreams = () => getList(STORAGE_KEYS.DREAMS);
export const addDream = (d) => addToList(STORAGE_KEYS.DREAMS, d);
export const getBucketList = () => getList(STORAGE_KEYS.BUCKET_LIST);
export const saveBucketList = (b) => saveList(STORAGE_KEYS.BUCKET_LIST, b);
export const getBrainDump = () => getList(STORAGE_KEYS.BRAIN_DUMP);
export const addBrainDump = (text) => addToList(STORAGE_KEYS.BRAIN_DUMP, { text });
export const deleteBrainDump = (id) => removeFromList(STORAGE_KEYS.BRAIN_DUMP, id);
export const getAppointments = () => getList(STORAGE_KEYS.APPOINTMENTS);
export const saveAppointments = (a) => saveList(STORAGE_KEYS.APPOINTMENTS, a);
export const getRewardMenu = () => getData(STORAGE_KEYS.REWARD_MENU) || [];
export const saveRewardMenu = (r) => setData(STORAGE_KEYS.REWARD_MENU, r);
export const getPlaylists = () => getData(STORAGE_KEYS.PLAYLISTS) || [];
export const savePlaylists = (p) => setData(STORAGE_KEYS.PLAYLISTS, p);
export const getDistractionBox = () => getObj(STORAGE_KEYS.DISTRACTION_BOX, { quick: [], medium: [], long: [] });
export const saveDistractionBox = (d) => setData(STORAGE_KEYS.DISTRACTION_BOX, d);
export const getBodyMapEntries = () => getList(STORAGE_KEYS.BODY_MAP);
export const addBodyMapEntry = (e) => addToList(STORAGE_KEYS.BODY_MAP, e);
export const getDebriefs = () => getList(STORAGE_KEYS.DEBRIEF);
export const addDebrief = (d) => addToList(STORAGE_KEYS.DEBRIEF, d);
// New features
export const getStickers = () => getObj(STORAGE_KEYS.STICKERS, { earned: [], placed: [] });
export const saveStickers = (s) => setData(STORAGE_KEYS.STICKERS, s);
export const getCustomAffirmations = () => getData(STORAGE_KEYS.CUSTOM_AFFIRMATIONS) || [];
export const saveCustomAffirmations = (a) => setData(STORAGE_KEYS.CUSTOM_AFFIRMATIONS, a);
export const getComfortMedia = () => getData(STORAGE_KEYS.COMFORT_MEDIA) || [];
export const saveComfortMedia = (c) => setData(STORAGE_KEYS.COMFORT_MEDIA, c);
export const getSafePeople = () => getData(STORAGE_KEYS.SAFE_PEOPLE) || [];
export const saveSafePeople = (p) => setData(STORAGE_KEYS.SAFE_PEOPLE, p);
export const getValues = () => getData(STORAGE_KEYS.VALUES) || [];
export const saveValues = (v) => setData(STORAGE_KEYS.VALUES, v);
export const getStrengths = () => getData(STORAGE_KEYS.STRENGTHS) || [];
export const saveStrengths = (s) => setData(STORAGE_KEYS.STRENGTHS, s);
export const getIdentity = () => getData(STORAGE_KEYS.IDENTITY) || [];
export const saveIdentity = (i) => setData(STORAGE_KEYS.IDENTITY, i);
export const getBoundaries = () => getData(STORAGE_KEYS.BOUNDARIES) || [];
export const saveBoundaries = (b) => setData(STORAGE_KEYS.BOUNDARIES, b);
export const getTimeCapsules = () => getList(STORAGE_KEYS.TIME_CAPSULES);
export const addTimeCapsule = (t) => addToList(STORAGE_KEYS.TIME_CAPSULES, t);
export const getBadDayProtocol = () => getData(STORAGE_KEYS.BAD_DAY_PROTOCOL) || [];
export const saveBadDayProtocol = (b) => setData(STORAGE_KEYS.BAD_DAY_PROTOCOL, b);
export const getPinned = () => getData(STORAGE_KEYS.PINNED) || [];
export const savePinned = (p) => setData(STORAGE_KEYS.PINNED, p);
export const getGameScores = () => getObj(STORAGE_KEYS.GAME_SCORES, {});
export const saveGameScores = (g) => setData(STORAGE_KEYS.GAME_SCORES, g);

// --- Settings ---
export function getSettings() {
  return getObj(STORAGE_KEYS.SETTINGS, {
    theme: 'light', colorScheme: 'lavender', reminderTime: null,
    fontSize: 'medium', reduceMotion: false, highContrast: false,
  });
}
export const saveSettings = (s) => setData(STORAGE_KEYS.SETTINGS, s);

// --- Export ---
export function exportAllData() {
  const profile = getActiveProfile(); const data = { profile };
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => { data[name] = getData(key); });
  return JSON.stringify(data, null, 2);
}

export { STORAGE_KEYS };
