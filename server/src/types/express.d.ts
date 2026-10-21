import type { AuthUser } from '@pc-builder/shared';

// Teaches TypeScript that the auth middleware attaches `user` to the request.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
