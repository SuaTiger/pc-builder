import type { Request, RequestHandler, Response } from 'express';
import { describe, expect, it } from 'vitest';
import { createFakeProfilesRepository, createFakeTokenVerifier } from '../../test/fake-auth';
import { uuid } from '../../test/fixtures';
import { createAuth } from './auth.middleware';
import type { TokenVerifier } from './token-verifier';

/*
 * These tests call the middleware directly with stand-in request/response objects.
 * The login check is the most security-critical code in the app, so it is tested without
 * Express in the way: each case is only about the decision it makes.
 */

interface StubResponse {
  status(code: number): StubResponse;
  json(body: unknown): StubResponse;
}

interface Outcome {
  status?: number;
  body?: unknown;
  nextCalled: boolean;
  nextError?: unknown;
}

function run(handler: RequestHandler, req: Partial<Request>): Promise<Outcome> {
  return new Promise((resolve) => {
    const outcome: Outcome = { nextCalled: false };
    const res: StubResponse = {
      status(code) {
        outcome.status = code;
        return res;
      },
      json(body) {
        outcome.body = body;
        resolve(outcome);
        return res;
      },
    };
    handler(req as Request, res as unknown as Response, (error?: unknown) => {
      outcome.nextCalled = true;
      outcome.nextError = error;
      resolve(outcome);
    });
  });
}

const alice = { id: uuid(101), email: 'alice@example.com' };
const withHeader = (authorization?: string) => ({ headers: { authorization } }) as Partial<Request>;

function setup(verifier?: TokenVerifier) {
  const profiles = createFakeProfilesRepository([
    { id: uuid(103), email: 'admin@example.com', role: 'admin', createdAt: new Date() },
  ]);
  const tokenVerifier =
    verifier ??
    createFakeTokenVerifier({
      'alice-token': alice,
      'admin-token': { id: uuid(103), email: 'admin@example.com' },
    });
  return { profiles, ...createAuth({ tokenVerifier, profiles }) };
}

describe('authenticate', () => {
  it('rejects a request with no Authorization header', async () => {
    const { authenticate } = setup();
    const outcome = await run(authenticate, withHeader(undefined));

    expect(outcome.status).toBe(401);
    expect(outcome.nextCalled).toBe(false);
  });

  it('rejects a header that is not a Bearer token', async () => {
    const { authenticate } = setup();
    const outcome = await run(authenticate, withHeader('Basic alice-token'));

    expect(outcome.status).toBe(401);
    expect(outcome.nextCalled).toBe(false);
  });

  it('rejects a token the verifier does not recognise', async () => {
    const { authenticate } = setup();
    const outcome = await run(authenticate, withHeader('Bearer forged-token'));

    expect(outcome.status).toBe(401);
    expect(outcome.nextCalled).toBe(false);
  });

  it('accepts a valid token, attaches the user and creates a normal profile on first login', async () => {
    const { authenticate, profiles } = setup();
    const req = withHeader('Bearer alice-token');
    const outcome = await run(authenticate, req);

    expect(outcome.nextCalled).toBe(true);
    expect(req.user).toEqual({ id: alice.id, email: alice.email, role: 'user' });
    expect(await profiles.list()).toHaveLength(2);
  });

  it('takes the role from our database, so an existing admin stays admin', async () => {
    const { authenticate } = setup();
    const req = withHeader('Bearer admin-token');
    await run(authenticate, req);

    expect(req.user?.role).toBe('admin');
  });

  it('passes an outage of the verifier to the error handler instead of answering 401', async () => {
    const outage = new Error('Supabase unreachable');
    const { authenticate } = setup({
      async verify() {
        throw outage;
      },
    });
    const outcome = await run(authenticate, withHeader('Bearer alice-token'));

    expect(outcome.status).toBe(undefined);
    expect(outcome.nextError).toBe(outage);
  });
});

describe('authorize', () => {
  it('answers 401 when authenticate has not run', async () => {
    const { authorize } = setup();
    const outcome = await run(authorize('user:manage'), {});

    expect(outcome.status).toBe(401);
  });

  it('answers 403 when the role lacks the permission', async () => {
    const { authorize } = setup();
    const user = { id: alice.id, email: alice.email, role: 'user' as const };
    const outcome = await run(authorize('user:manage'), { user });

    expect(outcome.status).toBe(403);
    expect(outcome.nextCalled).toBe(false);
  });

  it('lets the request through when the role has the permission', async () => {
    const { authorize } = setup();
    const user = { id: uuid(103), email: null, role: 'admin' as const };
    const outcome = await run(authorize('user:manage'), { user });

    expect(outcome.nextCalled).toBe(true);
  });
});
