import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAbNxvJmsm03DJtPQexpwLIAm8jryQOAAw",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "investment-e046c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "investment-e046c",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "investment-e046c.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "990077571171",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:990077571171:web:16e1b0fa4ff537dd25e856",
};

// Initialize Firebase only if config is provided
let app, auth, db;
const isFirebaseConfigured = !!firebaseConfig.apiKey;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db, isFirebaseConfigured };
