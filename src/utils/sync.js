import { syncToCloud, fetchFromCloud, syncProfilesToCloud, fetchProfilesFromCloud } from './firebase';
import { getActiveProfileId, getProfiles, saveProfiles, getData, setData, STORAGE_KEYS } from './storage';

let syncTimeout = null;
let currentUserId = null;

export function setSyncUserId(userId) {
  currentUserId = userId;
}

// Debounced sync — waits 2 seconds after last change before syncing
export function scheduleSyncToCloud() {
  if (!currentUserId) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    performSync();
  }, 2000);
}

async function performSync() {
  if (!currentUserId) return;
  const profileId = getActiveProfileId();
  if (!profileId) return;

  // Gather all data for this profile
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const val = getData(key);
    if (val !== null) {
      data[name] = val;
    }
  });

  await syncToCloud(currentUserId, profileId, data);

  // Also sync profiles list
  const profiles = getProfiles();
  await syncProfilesToCloud(currentUserId, profiles);
}

// Pull data from cloud and merge into localStorage
export async function pullFromCloud() {
  if (!currentUserId) return false;

  // Pull profiles
  const cloudProfiles = await fetchProfilesFromCloud(currentUserId);
  if (cloudProfiles && cloudProfiles.length > 0) {
    const localProfiles = getProfiles();
    // Merge: cloud wins for profiles that exist in cloud, keep local-only ones
    const merged = [...cloudProfiles];
    localProfiles.forEach(lp => {
      if (!merged.find(cp => cp.id === lp.id)) {
        merged.push(lp);
      }
    });
    saveProfiles(merged);
  }

  // Pull active profile data
  const profileId = getActiveProfileId();
  if (!profileId) return false;

  const cloudData = await fetchFromCloud(currentUserId, profileId);
  if (!cloudData) return false;

  // Merge cloud data into local (cloud wins for newer data)
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (cloudData[name] !== undefined) {
      const localData = getData(key);
      const cloudVal = cloudData[name];

      // For arrays (moods, tasks, etc), merge by id
      if (Array.isArray(cloudVal) && Array.isArray(localData)) {
        const mergedMap = new Map();
        // Local first, then cloud overwrites
        localData.forEach(item => {
          if (item.id) mergedMap.set(item.id, item);
        });
        cloudVal.forEach(item => {
          if (item.id) mergedMap.set(item.id, item);
        });
        const merged = Array.from(mergedMap.values())
          .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        setData(key, merged);
      } else if (typeof cloudVal === 'object' && cloudVal !== null && !Array.isArray(cloudVal)) {
        // For objects (settings, safety plan, etc), merge
        const merged = { ...localData, ...cloudVal };
        setData(key, merged);
      } else {
        // For primitives, cloud wins
        setData(key, cloudVal);
      }
    }
  });

  return true;
}

// Force a full sync now
export async function forceSync() {
  await performSync();
}
