import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import type { UserSummary, UsersResponse } from '@pc-builder/shared';
import { createApp } from '../../app';
import { createTestDependencies, loginAs, users } from '../../test/dependencies';

let app: ReturnType<typeof createApp>;
beforeEach(() => {
  app = createApp(createTestDependencies());
});

const setRole = (actor: { token: string }, targetId: string, body: unknown) =>
  request(app)
    .patch(`/api/admin/users/${targetId}/role`)
    .set(loginAs(actor))
    .send(body as object);

describe('admin routes', () => {
  it('rejects anonymous requests with 401', async () => {
    expect((await request(app).get('/api/admin/users')).status).toBe(401);
  });

  it('rejects normal users with 403', async () => {
    expect((await request(app).get('/api/admin/users').set(loginAs(users.alice))).status).toBe(403);
    expect((await setRole(users.alice, users.bob.id, { role: 'admin' })).status).toBe(403);
  });

  it('lets an admin list users', async () => {
    await request(app).get('/api/me').set(loginAs(users.alice)); // alice's first login creates her profile

    const res = await request(app).get('/api/admin/users').set(loginAs(users.admin));
    const emails = (res.body as UsersResponse).users.map((user) => user.email);

    expect(res.status).toBe(200);
    expect(emails).toContain(users.alice.email);
    expect(emails).toContain(users.admin.email);
  });

  it('lets an admin promote another user, who then gains admin access', async () => {
    await request(app).get('/api/me').set(loginAs(users.alice));

    const res = await setRole(users.admin, users.alice.id, { role: 'admin' });
    expect(res.status).toBe(200);
    expect((res.body as UserSummary).role).toBe('admin');

    expect((await request(app).get('/api/admin/users').set(loginAs(users.alice))).status).toBe(200);
  });

  it('stops an admin from changing their own role', async () => {
    expect((await setRole(users.admin, users.admin.id, { role: 'user' })).status).toBe(400);
  });

  it('returns 404 for a user that does not exist', async () => {
    const res = await setRole(users.admin, '00000000-0000-4000-8000-000000000999', { role: 'user' });

    expect(res.status).toBe(404);
  });

  it('returns 400 for a role that does not exist', async () => {
    expect((await setRole(users.admin, users.alice.id, { role: 'superuser' })).status).toBe(400);
  });
});
