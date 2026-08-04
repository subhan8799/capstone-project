import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredFirebaseKeys.every(
  (value) => typeof value === 'string' && value.trim().length > 0,
);

export let firebaseInitError: string | null = null;
export let auth: Auth | null = null;

try {
  if (!isFirebaseConfigured) {
    firebaseInitError =
      'Firebase environment variables are missing. Add valid Firebase values to your .env file.';
  } else {
    const firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
  }
} catch (error) {
  firebaseInitError =
    error instanceof Error
      ? `Firebase initialization failed: ${error.message}`
      : 'Firebase initialization failed due to an unknown error.';
}

if (firebaseInitError) {
  console.warn(firebaseInitError);
}