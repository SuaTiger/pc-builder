import { createClient } from '@supabase/supabase-js';
import type { TokenVerifier } from './token-verifier';

/**
 * Verifies tokens by asking Supabase directly. One network call per request, but it works
 * with any Supabase signing-key setup and notices tokens that were revoked (e.g. after logout).
 */
export function createSupabaseTokenVerifier(config: {
  url: string;
  anonKey: string;
}): TokenVerifier {
  // The server never logs anyone in, so it keeps no session of its own.
  const client = createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return {
    async verify(token) {
      const { data, error } = await client.auth.getUser(token);

      if (error) {
        // 4xx means Supabase answered and rejected the token. Anything else means we could
        // not get an answer, which must not look like "wrong password" to the caller.
        const rejected = typeof error.status === 'number' && error.status >= 400 && error.status < 500;
        if (rejected) {
          // Shows up in the server terminal only, so a wrong key can be told apart from a bad token.
          console.warn(`Supabase rejected the token (${error.status}): ${error.message}`);
          return null;
        }
        throw error;
      }
      if (!data.user) return null;

      return { id: data.user.id, email: data.user.email ?? null };
    },
  };
}
