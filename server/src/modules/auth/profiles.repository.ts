import type { UserRole } from '@pc-builder/shared';
import type { VerifiedUser } from './token-verifier';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface ProfilesRepository {
  /** Returns the user's profile, creating it with the default role the first time they appear. */
  getOrCreate(identity: VerifiedUser): Promise<Profile>;
  list(): Promise<Profile[]>;
  /** Returns the updated profile, or undefined if there is no such user. */
  setRole(id: string, role: UserRole): Promise<Profile | undefined>;
}
