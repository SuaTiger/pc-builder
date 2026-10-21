import { describe, expect, it } from 'vitest';
import type { CpuSpec, GpuSpec } from '../part-specs';
import { GAMES } from './benchmarks';
import { estimateFps, fpsBand, findGame } from './estimate-fps';

const cpu = (brand: string, name: string) => ({ brand, name }) as CpuSpec;
const gpu = (brand: string, name: string) => ({ brand, name }) as GpuSpec;

const rtx4060 = gpu('NVIDIA', 'GeForce RTX 4060');
const ryzen5600 = cpu('AMD', 'Ryzen 5 5600');
const i7 = cpu('Intel', 'Core i7-14700K');

const cyberpunk = findGame('cyberpunk-2077')!;
const cs2 = findGame('counter-strike-2')!;
const elden = findGame('elden-ring')!;

describe('estimateFps', () => {
  it('needs a graphics card', () => {
    expect(estimateFps(cyberpunk, '1080p', { cpu: i7 })).toEqual({ status: 'needs-gpu' });
  });

  it('reports a card that is not in the table', () => {
    const result = estimateFps(cyberpunk, '1080p', { gpu: gpu('Acme', 'Mystery 9000') });
    expect(result).toEqual({ status: 'no-data', part: 'Acme Mystery 9000' });
  });

  it('uses the graphics card figure when the processor keeps up', () => {
    expect(estimateFps(cyberpunk, '1080p', { cpu: i7, gpu: rtx4060 })).toMatchObject({
      status: 'ok',
      fps: 75,
      limitedBy: 'gpu',
    });
  });

  it('is limited by the processor when it is the slower part', () => {
    const fast = gpu('NVIDIA', 'GeForce RTX 4070 SUPER');
    expect(estimateFps(cs2, '1080p', { cpu: ryzen5600, gpu: fast })).toMatchObject({
      fps: 330,
      limitedBy: 'cpu',
    });
  });

  it('gives a graphics-card-only estimate when no processor is chosen yet', () => {
    const result = estimateFps(cyberpunk, '1440p', { gpu: rtx4060 });
    expect(result).toMatchObject({ status: 'ok', fps: 50 });
    expect(result).not.toHaveProperty('limitedBy', 'cpu');
  });

  it('honours a game frame limit', () => {
    expect(estimateFps(elden, '1080p', { cpu: i7, gpu: rtx4060 })).toMatchObject({
      fps: 60,
      limitedBy: 'game',
    });
  });

  it('is lower at 1440p than at 1080p for the same parts', () => {
    const at = (resolution: '1080p' | '1440p') => {
      const result = estimateFps(cyberpunk, resolution, { cpu: i7, gpu: rtx4060 });
      return result.status === 'ok' ? result.fps : 0;
    };
    expect(at('1440p')).toBeLessThan(at('1080p'));
  });
});

describe('fpsBand', () => {
  it.each([
    [29, 'struggles'],
    [30, 'playable'],
    [59, 'playable'],
    [60, 'smooth'],
    [119, 'smooth'],
    [120, 'high-refresh'],
  ] as const)('%i fps is %s', (fps, band) => expect(fpsBand(fps)).toBe(band));
});

describe('benchmark table', () => {
  it('has a 1440p figure no higher than the 1080p one for every card', () => {
    for (const game of GAMES) {
      for (const [name, figures] of Object.entries(game.gpuFps)) {
        expect(figures['1440p'], `${game.id} / ${name}`).toBeLessThanOrEqual(figures['1080p']);
      }
    }
  });

  it('covers the same cards in every game', () => {
    const names = (game: (typeof GAMES)[number]) => Object.keys(game.gpuFps).sort();
    for (const game of GAMES) expect(names(game)).toEqual(names(GAMES[0]!));
  });
});
