import { Router } from 'express';
import { z } from 'zod';
import {
  USER_ROLES,
  type ErrorResponse,
  type SetRoleRequest,
  type UserSummary,
  type UsersResponse,
} from '@pc-builder/shared';
import { asyncHandler } from '../../middleware/async-handler';
import { validationErrorBody } from '../../middleware/validation-error';
import { currentUser } from '../auth/auth.middleware';
import type { Profile, ProfilesRepository } from '../auth/profiles.repository';

const setRoleSchema: z.ZodType<SetRoleRequest> = z.object({ role: z.enum(USER_ROLES) }).strict();
const idSchema = z.string().uuid();

const toUserSummary = (profile: Profile): UserSummary => ({
  id: profile.id,
  email: profile.email,
  role: profile.role,
  createdAt: profile.createdAt.toISOString(),
});

const errorBody = (error: string): ErrorResponse => ({ error });

/** Mounted at /api/admin, behind authenticate + authorize('user:manage'). */
export function createAdminRouter(profiles: ProfilesRepository) {
  const router = Router();

  router.get(
    '/users',
    asyncHandler(async (_req, res) => {
      const body: UsersResponse = { users: (await profiles.list()).map(toUserSummary) };
      res.json(body);
    }),
  );

  router.patch(
    '/users/:id/role',
    asyncHandler(async (req, res) => {
      const id = idSchema.safeParse(req.params.id);
      const input = setRoleSchema.safeParse(req.body);
      if (!input.success) {
        res.status(400).json(validationErrorBody(input.error));
        return;
      }
      if (id.success && id.data === currentUser(req).id) {
        // Stops the last admin from locking everyone out by demoting themselves.
        res.status(400).json(errorBody('You cannot change your own role'));
        return;
      }

      const updated = id.success ? await profiles.setRole(id.data, input.data.role) : undefined;
      if (!updated) {
        res.status(404).json(errorBody('User not found'));
        return;
      }
      res.json(toUserSummary(updated));
    }),
  );

  return router;
}
