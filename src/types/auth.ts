export interface AuthFormFields {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}

export interface AuthContextValue {
  user: import('firebase/auth').User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}