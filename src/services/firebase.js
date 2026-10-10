import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Default Firebase Configuration (can be updated via /admin/firebase or .env)
const getStoredFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('amsed_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading firebase config from storage', e);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
  };
};

let app = null;
let db = null;
let storage = null;
let isFirebaseConfigured = false;

export const initFirebase = (customConfig = null) => {
  const config = customConfig || getStoredFirebaseConfig();
  
  if (config && config.apiKey && config.projectId) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(config);
      } else {
        app = getApp();
      }
      db = getFirestore(app);
      storage = getStorage(app);
      isFirebaseConfigured = true;
      return { app, db, storage, isConfigured: true };
    } catch (err) {
      console.warn('Firebase initialization error, running in local CMS mode:', err);
      isFirebaseConfigured = false;
    }
  } else {
    isFirebaseConfigured = false;
  }

  return { app: null, db: null, storage: null, isConfigured: false };
};

// Initialize on load
initFirebase();

export { app, db, storage, isFirebaseConfigured, getStoredFirebaseConfig };
