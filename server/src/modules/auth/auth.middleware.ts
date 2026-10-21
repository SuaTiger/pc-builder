import type { Request, RequestHandler } from 'express';
import { hasPermission, type AuthUser, type ErrorResponse, type Permission } from '@pc-builder/shared';
import type { ProfilesRepository } from './profiles.repository';
import type { TokenVerifier } from './token-verifier';

export interface AuthDependencies {
  tokenVerifier: TokenVerifier;
  profiles: ProfilesRepository;
}

type Authentication = { ok: true; user: AuthUser } | { ok: false; error: string };

/**
 * Returns the two middlewares that protect routes:
 *   authenticate          "who is this?"          -> 401 if there is no valid login
 *   authorize(permission) "may they do this?"     -> 403 if their role lacks the permission
 * Use them in that order: app.use(path, auth.authenticate, auth.authorize('x'), router).
 */
export function createAuth({ tokenVerifier, profiles }: AuthDependencies) {
  async function authenticateRequest(req: Request): Promise<Authentication> {
    const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')?.[1];
    if (!token) return { ok: false, error: 'Missing bearer token' };

    const verified = await tokenVerifier.verify(token);
    if (!verified) return { ok: false, error: 'Invalid or expired token' };

    // The role comes from OUR database, never from the token, so it can be changed instantly.
    const profile = await profiles.getOrCreate(verified);
    return { ok: true, user: { id: profile.id, email: profile.email, role: profile.role } };
  }

  const authenticate: RequestHandler = (req, res, next) => {
    authenticateRequest(req).then((result) => {
      if (!result.ok) {
        const body: ErrorResponse = { error: result.error };
        res.status(401).json(body);
        return;
      }
      req.user = result.user;
      next();
    }, next); // a thrown error (e.g. Supabase down) goes to the error handler as a 500
  };

  function authorize(permission: Permission): RequestHandler {
    return (req, res, next) => {
      if (!req.user) {
        const body: ErrorResponse = { error: 'Not authenticated' };
        res.status(401).json(body);
        return;
      }
      if (!hasPermission(req.user.role, permission)) {
        const body: ErrorResponse = { error: 'You do not have permission to do this' };
        res.status(403).json(body);
        return;
      }
      next();
    };
  }

  return { authenticate, authorize };
}

/** The logged-in user. Only call this in routes placed behind `authenticate`. */
export function currentUser(req: Request): AuthUser {
  if (!req.user) {
    throw new Error('currentUser() was called on a route that is not behind authenticate');
  }
  return req.user;
}
