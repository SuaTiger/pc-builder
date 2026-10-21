import type { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export interface AuthContextValue {
  /** 'loading' lasts only while the saved session is being read from the browser. */
  status: 'loading' | 'signed-out' | 'signed-in';
  session: Session | null;
  /** Throws an Error with a readable message when the email or password is wrong. */
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<{ needsEmailConfirmation: boolean }>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
