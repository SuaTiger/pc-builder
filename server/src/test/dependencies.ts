import type { AppDependencies } from '../app';
import { createFakeProfilesRepository, createFakeTokenVerifier } from './fake-auth';
import { createFakeSavedBuildsRepository } from './fake-saved-builds-repository';
import { createTestRepository, uuid } from './fixtures';

/** Three people the tests can log in as. `token` is what goes after "Bearer ". */
export const users = {
  alice: { id: uuid(101), email: 'alice@example.com', token: 'alice-token' },
  bob: { id: uuid(102), email: 'bob@example.com', token: 'bob-token' },
  admin: { id: uuid(103), email: 'admin@example.com', token: 'admin-token' },
};

/** The header that makes a request look like it comes from this user. */
export const loginAs = (user: { token: string }) => ({ Authorization: `Bearer ${user.token}` });

/** A fresh, fully fake backend. Create one per test so tests cannot affect each other. */
export function createTestDependencies(): AppDependencies {
  return {
    parts: createTestRepository(),
    tokenVerifier: createFakeTokenVerifier({
      [users.alice.token]: { id: users.alice.id, email: users.alice.email },
      [users.bob.token]: { id: users.bob.id, email: users.bob.email },
      [users.admin.token]: { id: users.admin.id, email: users.admin.email },
    }),
    // Alice and Bob get a normal profile on first request; the admin already exists as admin.
    profiles: createFakeProfilesRepository([
      { id: users.admin.id, email: users.admin.email, role: 'admin', createdAt: new Date() },
    ]),
    savedBuilds: createFakeSavedBuildsRepository(),
  };
}
