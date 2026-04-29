import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';

// Firebase config — replace with your own from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Only initialize if config is present
const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

let app = null;
let auth = null;
let db = null;

if (hasConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function isFirebaseConfigured() {
  return hasConfig;
}

export function getFirebaseAuth() {
  return auth;
}

// --- Auth ---
export async function signInWithGoogle() {
  if (!auth) return null;
  const provider = new GoogleAuthProvider();
  try {
    // Try popup first (works on desktop)
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      // Fall back to redirect (better for mobile/iPad)
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

export async function checkRedirectResult() {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch {
    return null;
  }
}

export async function firebaseSignOut() {
  if (!auth) return;
  await signOut(auth);
}

export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// --- Firestore sync ---
function userDocRef(userId, profileId) {
  return doc(db, 'users', userId, 'profiles', profileId);
}

export async function syncToCloud(userId, profileId, data) {
  if (!db || !userId || !profileId) return;
  try {
    await setDoc(userDocRef(userId, profileId), {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Cloud sync failed:', err.message);
  }
}

export async function fetchFromCloud(userId, profileId) {
  if (!db || !userId || !profileId) return null;
  try {
    const snap = await getDoc(userDocRef(userId, profileId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Cloud fetch failed:', err.message);
    return null;
  }
}

export function listenToCloud(userId, profileId, callback) {
  if (!db || !userId || !profileId) return () => {};
  return onSnapshot(userDocRef(userId, profileId), (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  }, (err) => {
    console.warn('Cloud listener error:', err.message);
  });
}

// --- Sync profiles list ---
function profilesDocRef(userId) {
  return doc(db, 'users', userId, 'meta', 'profiles');
}

export async function syncProfilesToCloud(userId, profiles) {
  if (!db || !userId) return;
  try {
    await setDoc(profilesDocRef(userId), { profiles, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Profile sync failed:', err.message);
  }
}

export async function fetchProfilesFromCloud(userId) {
  if (!db || !userId) return null;
  try {
    const snap = await getDoc(profilesDocRef(userId));
    return snap.exists() ? snap.data().profiles : null;
  } catch (err) {
    console.warn('Profile fetch failed:', err.message);
    return null;
  }
}
