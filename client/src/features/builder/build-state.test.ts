import { checkBuild } from '@pc-builder/shared';
import {
  cooler,
  cpu,
  gpu,
  motherboard,
  psu,
  storage,
} from '@pc-builder/shared/src/compatibility/test-fixtures';
import { describe, expect, it } from 'vitest';
import { isEmptyBuild, partsInSlot, slotStatus, toSelection, withoutPart, withPart } from './build-state';

describe('withPart', () => {
  it('replaces the part in a single-part slot', () => {
    const next = withPart({ cpu: cpu({ id: 'old' }) }, 'cpu', cpu({ id: 'new' }));

    expect(next.cpu?.id).toBe('new');
  });

  it('adds another drive instead of replacing', () => {
    const next = withPart({ storage: [storage({ id: 'a' })] }, 'storage', storage({ id: 'b' }));

    expect(next.storage?.map((drive) => drive.id)).toEqual(['a', 'b']);
  });

  it('does not change the build it was given', () => {
    const original = { cpu: cpu({ id: 'old' }) };
    withPart(original, 'cpu', cpu({ id: 'new' }));

    expect(original.cpu.id).toBe('old');
  });
});

describe('withoutPart', () => {
  it('empties a single-part slot', () => {
    expect(withoutPart({ cpu: cpu(), gpu: gpu() }, 'cpu').cpu).toBe(undefined);
  });

  it('removes only the chosen drive', () => {
    const build = { storage: [storage({ id: 'a' }), storage({ id: 'b' }), storage({ id: 'c' })] };

    expect(withoutPart(build, 'storage', 1).storage?.map((drive) => drive.id)).toEqual(['a', 'c']);
  });

  it('removes all drives when no index is given', () => {
    expect(withoutPart({ storage: [storage()] }, 'storage').storage).toBe(undefined);
  });
});

describe('partsInSlot and isEmptyBuild', () => {
  it('reports empty slots and builds', () => {
    expect(partsInSlot({}, 'cpu')).toEqual([]);
    expect(isEmptyBuild({})).toBe(true);
    expect(isEmptyBuild({ storage: [] })).toBe(true);
  });

  it('counts a single part as a build', () => {
    expect(isEmptyBuild({ psu: psu() })).toBe(false);
  });
});

describe('toSelection', () => {
  it('keeps only ids, including each drive', () => {
    const selection = toSelection({
      cpu: cpu({ id: 'cpu-1' }),
      storage: [storage({ id: 'ssd-1' }), storage({ id: 'ssd-1' })],
    });

    expect(selection.cpuId).toBe('cpu-1');
    expect(selection.storageIds).toEqual(['ssd-1', 'ssd-1']);
    expect(selection.gpuId).toBe(undefined);
  });
});

describe('slotStatus', () => {
  it('is empty when nothing is chosen', () => {
    expect(slotStatus({}, 'cpu', checkBuild({}))).toBe('empty');
  });

  it('is ok when the part has no issues', () => {
    const build = { cpu: cpu(), motherboard: motherboard() };

    expect(slotStatus(build, 'cpu', checkBuild(build))).toBe('ok');
  });

  it('is error when the part is involved in an error', () => {
    const build = { cpu: cpu({ socket: 'AM4', memoryTypes: ['DDR4'] }), motherboard: motherboard() };
    const report = checkBuild(build);

    expect(slotStatus(build, 'cpu', report)).toBe('error');
    expect(slotStatus(build, 'motherboard', report)).toBe('error');
  });

  it('is warning when the only issues are warnings', () => {
    const build = { cpu: cpu(), cooler: cooler({ maxTdpWatts: 10 }) };

    expect(slotStatus(build, 'cooler', checkBuild(build))).toBe('warning');
  });
});
