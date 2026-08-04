import {
  type Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, firebaseInitError } from './config';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

function ensureAuth(currentAuth: Auth | null): Auth {
  if (!currentAuth) {
    throw new Error(
      firebaseInitError ??
        'Firebase auth is not configured. Check your .env values and restart the dev server.',
    );
  }
  return currentAuth;
}

function toFriendlyAuthError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    if (error.code === 'auth/configuration-not-found') {
      return new Error(
        'Firebase Authentication is not initialized for this project. In Firebase Console: go to Authentication, click Get started, enable Email/Password and Google providers, set a support email, then add localhost and your production domain in Authorized domains.',
      );
    }

    if (error.code === 'auth/operation-not-allowed') {
      return new Error(
        'This sign-in method is disabled in Firebase Console. Enable the provider under Authentication > Sign-in method.',
      );
    }

    if (error.code === 'auth/unauthorized-domain') {
      return new Error(
        'This domain is not authorized for Firebase Auth. Add the current host to Authentication > Settings > Authorized domains.',
      );
    }

    return new Error(error.message);
  }

  return error instanceof Error ? error : new Error('Authentication failed. Please verify Firebase setup.');
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  try {
    const configuredAuth = ensureAuth(auth);
    const credential = await createUserWithEmailAndPassword(configuredAuth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
  } catch (error) {
    throw toFriendlyAuthError(error);
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    const configuredAuth = ensureAuth(auth);
    await signInWithEmailAndPassword(configuredAuth, email, password);
  } catch (error) {
    throw toFriendlyAuthError(error);
  }
}

export async function loginWithGoogle() {
  try {
    const configuredAuth = ensureAuth(auth);
    await signInWithPopup(configuredAuth, provider);
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'auth/popup-blocked') {
      const configuredAuth = ensureAuth(auth);
      await signInWithRedirect(configuredAuth, provider);
      return;
    }

    throw toFriendlyAuthError(error);
  }
}

export async function logout() {
  try {
    const configuredAuth = ensureAuth(auth);
    await signOut(configuredAuth);
  } catch (error) {
    throw toFriendlyAuthError(error);
  }
}

export async function forgotPassword(email: string) {
  try {
    const configuredAuth = ensureAuth(auth);
    await sendPasswordResetEmail(configuredAuth, email);
  } catch (error) {
    throw toFriendlyAuthError(error);
  }
}