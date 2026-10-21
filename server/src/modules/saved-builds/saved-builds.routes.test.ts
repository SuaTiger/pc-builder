import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SavedBuildDetail, SavedBuildsResponse } from '@pc-builder/shared';
import { createApp } from '../../app';
import { createTestDependencies, loginAs, users } from '../../test/dependencies';
import { fullSelection, ids } from '../../test/fixtures';
import { MAX_SAVED_BUILDS } from './saved-builds.service';

let app: ReturnType<typeof createApp>;
beforeEach(() => {
  app = createApp(createTestDependencies());
});

const save = (user: { token: string }, body: unknown) =>
  request(app).post('/api/me/builds').set(loginAs(user)).send(body as object);

describe('saved builds', () => {
  it('requires a login', async () => {
    expect((await request(app).get('/api/me/builds')).status).toBe(401);
    expect((await request(app).post('/api/me/builds').send({})).status).toBe(401);
  });

  it('saves a build and returns it with a fresh compatibility report', async () => {
    const res = await save(users.alice, { name: 'Gaming PC', selection: fullSelection });
    const body = res.body as SavedBuildDetail;

    expect(res.status).toBe(201);
    expect(body.name).toBe('Gaming PC');
    expect(body.report.ok).toBe(true);
    expect(body.totalPriceThb).toBe(12100);
  });

  it('allows saving an incompatible build as a work in progress', async () => {
    const res = await save(users.alice, {
      name: 'Draft',
      selection: { cpuId: ids.cpuAm4, motherboardId: ids.motherboard },
    });

    expect(res.status).toBe(201);
    expect((res.body as SavedBuildDetail).report.ok).toBe(false);
  });

  it('rejects parts that do not exist with 422', async () => {
    const res = await save(users.alice, { name: 'Ghost', selection: { gpuId: ids.unknown } });

    expect(res.status).toBe(422);
  });

  it('rejects an empty name with 400', async () => {
    expect((await save(users.alice, { name: '   ', selection: {} })).status).toBe(400);
  });

  it('lists only the logged-in user’s builds', async () => {
    await save(users.alice, { name: 'Alice PC', selection: {} });
    await save(users.bob, { name: 'Bob PC', selection: {} });

    const res = await request(app).get('/api/me/builds').set(loginAs(users.alice));
    const names = (res.body as SavedBuildsResponse).builds.map((build) => build.name);

    expect(names).toEqual(['Alice PC']);
  });

  it('hides another user’s build as if it did not exist', async () => {
    const created = await save(users.alice, { name: 'Private', selection: {} });
    const id = (created.body as SavedBuildDetail).id;

    expect((await request(app).get(`/api/me/builds/${id}`).set(loginAs(users.bob))).status).toBe(404);
    expect(
      (await request(app).delete(`/api/me/builds/${id}`).set(loginAs(users.bob))).status,
    ).toBe(404);
    expect(
      (
        await request(app)
          .put(`/api/me/builds/${id}`)
          .set(loginAs(users.bob))
          .send({ name: 'Stolen', selection: {} })
      ).status,
    ).toBe(404);
  });

  it('updates the owner’s build', async () => {
    const created = await save(users.alice, { name: 'Old', selection: {} });
    const id = (created.body as SavedBuildDetail).id;

    const res = await request(app)
      .put(`/api/me/builds/${id}`)
      .set(loginAs(users.alice))
      .send({ name: 'New', selection: fullSelection });

    expect(res.status).toBe(200);
    expect((res.body as SavedBuildDetail).name).toBe('New');
    expect((res.body as SavedBuildDetail).totalPriceThb).toBe(12100);
  });

  it('deletes the owner’s build, after which it is gone', async () => {
    const created = await save(users.alice, { name: 'Temp', selection: {} });
    const id = (created.body as SavedBuildDetail).id;

    expect((await request(app).delete(`/api/me/builds/${id}`).set(loginAs(users.alice))).status).toBe(204);
    expect((await request(app).get(`/api/me/builds/${id}`).set(loginAs(users.alice))).status).toBe(404);
  });

  it('treats a malformed id as not found', async () => {
    const res = await request(app).get('/api/me/builds/not-a-uuid').set(loginAs(users.alice));

    expect(res.status).toBe(404);
  });

  it('stops a user from saving more than the limit', async () => {
    for (let i = 0; i < MAX_SAVED_BUILDS; i++) {
      await save(users.alice, { name: `Build ${i}`, selection: {} });
    }

    expect((await save(users.alice, { name: 'One too many', selection: {} })).status).toBe(403);
    expect((await save(users.bob, { name: 'Bob is fine', selection: {} })).status).toBe(201);
  });
});
