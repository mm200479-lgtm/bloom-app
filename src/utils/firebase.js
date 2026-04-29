import { initializeApp } from 'firebase/app';
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
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

// Firebase config — set via environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

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

// --- Email Magic Link Auth ---

const EMAIL_STORAGE_KEY = 'bloom_signin_email';

export async function sendMagicLink(email) {
  if (!auth) throw new Error('Firebase not configured');

  const actionCodeSettings = {
    // This URL must be whitelisted in Firebase Console → Authentication → Settings → Authorized domains
    url: window.location.origin + window.location.pathname,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  // Save the email locally so we can complete sign-in when they click the link
  localStorage.setItem(EMAIL_STORAGE_KEY, email);
}

export async function completeMagicLinkSignIn() {
  if (!auth) return null;

  // Check if the current URL is a sign-in link
  if (!isSignInWithEmailLink(auth, window.location.href)) {
    return null;
  }

  let email = localStorage.getItem(EMAIL_STORAGE_KEY);

  // If they opened the link on a different device, ask for email
  if (!email) {
    email = window.prompt('Please enter your email to confirm sign-in:');
    if (!email) return null;
  }

  try {
    const result = await signInWithEmailLink(auth, email, window.location.href);
    localStorage.removeItem(EMAIL_STORAGE_KEY);

    // Clean up the URL (remove the sign-in parameters)
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, '', cleanUrl);

    return result.user;
  } catch (err) {
    console.error('Magic link sign-in failed:', err);
    localStorage.removeItem(EMAIL_STORAGE_KEY);
    throw err;
  }
}

export function getPendingEmail() {
  return localStorage.getItem(EMAIL_STORAGE_KEY);
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
