import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123:web:abc"
};

const initFirestoreDb = (targetApp) => {
  try {
    return initializeFirestore(targetApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (e) {
    try {
      return getFirestore(targetApp);
    } catch (err) {
      return null;
    }
  }
};

let app = null;
let db = null;
let storage = null;
let isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "dummy"
);

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = initFirestoreDb(app);
  storage = getStorage(app);
} catch (err) {
  console.warn("Firebase initialization notice:", err);
}

export const getStoredFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('amsed_firebase_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return firebaseConfig;
};

export const initFirebase = (customConfig = null) => {
  const config = customConfig || getStoredFirebaseConfig();
  if (config && config.apiKey && config.apiKey !== "dummy") {
    try {
      app = getApps().length === 0 ? initializeApp(config) : getApp();
      db = initFirestoreDb(app);
      storage = getStorage(app);
      isFirebaseConfigured = true;
      return { app, db, storage, isConfigured: true };
    } catch (e) {
      console.warn("initFirebase error:", e);
      isFirebaseConfigured = false;
    }
  }
  return { app, db, storage, isConfigured: isFirebaseConfigured };
};

export { app, db, storage, isFirebaseConfigured, firebaseConfig };
export default app;
