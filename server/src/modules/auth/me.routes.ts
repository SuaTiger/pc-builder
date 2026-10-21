import { Router } from 'express';
import { ROLE_PERMISSIONS, type MeResponse } from '@pc-builder/shared';
import { currentUser } from './auth.middleware';

/** GET /api/me tells the client who is logged in and what they may do. */
export function createMeRouter() {
  const router = Router();

  router.get('/', (req, res) => {
    const user = currentUser(req);
    const body: MeResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: [...ROLE_PERMISSIONS[user.role]],
    };
    res.json(body);
  });

  return router;
}
