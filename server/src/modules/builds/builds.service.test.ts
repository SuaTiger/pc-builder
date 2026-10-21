import { describe, expect, it } from 'vitest';
import { createTestRepository, fullSelection, ids } from '../../test/fixtures';
import { resolveBuild, summarizeBuild } from './builds.service';

const repo = createTestRepository();

describe('resolveBuild', () => {
  it('fills every slot from the ids', async () => {
    const { build, missing } = await resolveBuild(repo, fullSelection);

    expect(missing).toEqual([]);
    expect(build.cpu?.id).toBe(ids.cpu);
    expect(build.case?.id).toBe(ids.case);
    expect(build.storage).toHaveLength(1);
  });

  it('leaves slots empty when no id is sent', async () => {
    const { build, missing } = await resolveBuild(repo, {});

    expect(missing).toEqual([]);
    expect(build.cpu).toBe(undefined);
    expect(build.storage).toEqual([]);
  });

  it('reports ids that do not exist, with their category', async () => {
    const { missing } = await resolveBuild(repo, { gpuId: ids.unknown });

    expect(missing).toEqual([{ category: 'gpu', id: ids.unknown }]);
  });

  it('keeps duplicates, so a user can pick two of the same drive', async () => {
    const { build } = await resolveBuild(repo, { storageIds: [ids.storage, ids.storage] });

    expect(build.storage).toHaveLength(2);
  });
});

describe('summarizeBuild', () => {
  it('adds the price and power estimate to the report', async () => {
    const { build } = await resolveBuild(repo, fullSelection);
    const summary = summarizeBuild(build);

    expect(summary.report).toEqual({ ok: true, issues: [] });
    expect(summary.totalPriceThb).toBe(12100);
    expect(summary.estimatedWatts).toBe(65 + 115 + 100);
  });
});
