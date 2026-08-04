import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

function isMissingValue(value: string | undefined) {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized.includes('your_') ||
    normalized.includes('replace_me') ||
    normalized.includes('<')
  );
}

function readEnvValue(key: string) {
  const envValue = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof envValue === 'string' ? envValue.trim() : undefined;
}

const missingFirebaseEnvKeys = FIREBASE_ENV_KEYS.filter((key) => isMissingValue(readEnvValue(key)));

const firebaseConfig = {
  apiKey: readEnvValue('VITE_FIREBASE_API_KEY') ?? '',
  authDomain: readEnvValue('VITE_FIREBASE_AUTH_DOMAIN') ?? '',
  projectId: readEnvValue('VITE_FIREBASE_PROJECT_ID') ?? '',
  storageBucket: readEnvValue('VITE_FIREBASE_STORAGE_BUCKET') ?? '',
  messagingSenderId: readEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID') ?? '',
  appId: readEnvValue('VITE_FIREBASE_APP_ID') ?? '',
  measurementId: readEnvValue('VITE_FIREBASE_MEASUREMENT_ID') ?? '',
};

export const isFirebaseConfigured = missingFirebaseEnvKeys.length === 0;

export let firebaseInitError: string | null = null;
export let auth: Auth | null = null;

try {
  if (!isFirebaseConfigured) {
    firebaseInitError =
      `Firebase environment variables are missing or invalid: ${missingFirebaseEnvKeys.join(', ')}. ` +
      'For local development, set them in .env. For Netlify production, add them in Site settings > Environment variables (must start with VITE_) and redeploy.';
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