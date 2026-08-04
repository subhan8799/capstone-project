import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { AuthContextValue } from '../types/auth';
import { auth, firebaseInitError } from '../firebase/config';
import { AuthContext } from './auth-context';
import {
  forgotPassword,
  loginWithEmail,
  loginWithGoogle,
  logout,
  signUpWithEmail,
} from '../firebase/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signUp: signUpWithEmail,
      signIn: loginWithEmail,
      signInWithGoogle: loginWithGoogle,
      signOutUser: logout,
      resetPassword: forgotPassword,
    }),
    [loading, user],
  );

  useEffect(() => {
    if (firebaseInitError) {
      setLoading(false);
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}