import type { Profile, ProfilesRepository } from '../modules/auth/profiles.repository';
import type { TokenVerifier, VerifiedUser } from '../modules/auth/token-verifier';

/** Accepts only the tokens listed; anything else counts as invalid, like a real expired token. */
export function createFakeTokenVerifier(tokens: Record<string, VerifiedUser>): TokenVerifier {
  const byToken = new Map(Object.entries(tokens));
  return {
    async verify(token) {
      return byToken.get(token) ?? null;
    },
  };
}

/** In-memory profiles. Pass `seed` to start with existing users (e.g. an admin). */
export function createFakeProfilesRepository(seed: Profile[] = []): ProfilesRepository {
  const profiles = new Map(seed.map((profile) => [profile.id, profile]));

  return {
    async getOrCreate({ id, email }) {
      const existing = profiles.get(id);
      if (existing) return existing;
      const created: Profile = { id, email, role: 'user', createdAt: new Date() };
      profiles.set(id, created);
      return created;
    },
    async list() {
      return [...profiles.values()];
    },
    async setRole(id, role) {
      const existing = profiles.get(id);
      if (!existing) return undefined;
      const updated = { ...existing, role };
      profiles.set(id, updated);
      return updated;
    },
  };
}
