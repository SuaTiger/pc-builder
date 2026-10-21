export interface VerifiedUser {
  id: string;
  email: string | null;
}

/**
 * Turns a login token into the user it belongs to.
 * Returns null when the token is invalid or expired. Throws when the check itself could not
 * be done (e.g. Supabase unreachable), so an outage is not mistaken for a bad token.
 */
export interface TokenVerifier {
  verify(token: string): Promise<VerifiedUser | null>;
}
