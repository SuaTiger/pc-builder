import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { MeResponse } from '@pc-builder/shared';
import { createApp } from '../../app';
import { createTestDependencies, loginAs, users } from '../../test/dependencies';

const app = () => createApp(createTestDependencies());

describe('GET /api/me', () => {
  it('returns 401 without a token', async () => {
    expect((await request(app()).get('/api/me')).status).toBe(401);
  });

  it('returns 401 for a token Supabase would reject', async () => {
    const res = await request(app()).get('/api/me').set({ Authorization: 'Bearer forged' });

    expect(res.status).toBe(401);
  });

  it('returns a normal user with only their own permissions', async () => {
    const res = await request(app()).get('/api/me').set(loginAs(users.alice));
    const body = res.body as MeResponse;

    expect(res.status).toBe(200);
    expect(body.email).toBe(users.alice.email);
    expect(body.role).toBe('user');
    expect(body.permissions).toEqual(['build:manage-own']);
  });

  it('returns an admin with the extra permission', async () => {
    const res = await request(app()).get('/api/me').set(loginAs(users.admin));
    const body = res.body as MeResponse;

    expect(body.role).toBe('admin');
    expect(body.permissions).toContain('user:manage');
  });
});
