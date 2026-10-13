import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
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

export const getStoredFirebaseConfig = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('amsed_firebase_config');
      if (saved) return JSON.parse(saved);
    }
  } catch (e) {}
  return defaultFirebaseConfig;
};

const activeConfig = typeof window !== 'undefined' ? getStoredFirebaseConfig() : defaultFirebaseConfig;
const hasValidConfig = Boolean(
  activeConfig && 
  activeConfig.apiKey && 
  activeConfig.apiKey !== "dummy" &&
  activeConfig.projectId &&
  activeConfig.projectId !== "dummy"
);

let app = null;
let db = null;
let storage = null;
let isFirebaseConfigured = hasValidConfig;

if (hasValidConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(activeConfig) : getApp();
    db = initFirestoreDb(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn("Firebase initialization notice:", err);
    isFirebaseConfigured = false;
  }
}

export const initFirebase = (customConfig = null) => {
  const config = customConfig || getStoredFirebaseConfig();
  if (config && config.apiKey && config.apiKey !== "dummy" && config.projectId && config.projectId !== "dummy") {
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

export { app, db, storage, isFirebaseConfigured, defaultFirebaseConfig as firebaseConfig };
export default app;
