// Firebase configuration sourced dynamically from environment variables
const firebaseConfig = {
  apiKey: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_API_KEY) || '',
  authDomain: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_AUTH_DOMAIN) || 'cobalt-crowbar-18chg.firebaseapp.com',
  projectId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_PROJECT_ID) || 'cobalt-crowbar-18chg',
  storageBucket: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_STORAGE_BUCKET) || 'cobalt-crowbar-18chg.firebasestorage.app',
  messagingSenderId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || '874658421571',
  appId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_APP_ID) || '1:874658421571:web:74af6b7cec469043c5adf6',
  firestoreDatabaseId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID) || 'ai-studio-blazestore-a9947da7-e32b-4249-9bd1-394122e13134',
};

export default firebaseConfig;
