import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { AuthContext, type AuthContextValue } from './auth-context';

/** Keeps the Supabase session in React state so any component can ask who is logged in. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Fires on login, logout and token refresh, including from another browser tab.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: loading ? 'loading' : session ? 'signed-in' : 'signed-out',
      session,

      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },

      async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // With email confirmation on (the Supabase default) there is no session until the link is clicked.
        return { needsEmailConfirmation: data.session === null };
      },

      async signOut() {
        await supabase.auth.signOut();
        // Forget everything private, so the next person on this browser never sees it.
        queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'parts' });
      },
    }),
    [loading, session, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
