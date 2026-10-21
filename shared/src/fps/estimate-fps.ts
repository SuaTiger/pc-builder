import type { CpuSpec, GpuSpec } from '../part-specs';
import { GAMES, type Game, type Resolution } from './benchmarks';

export type FpsBand = 'struggles' | 'playable' | 'smooth' | 'high-refresh';

export type FpsEstimate =
  /** A graphics card is needed; integrated graphics are not benchmarked. */
  | { status: 'needs-gpu' }
  /** The card is not in the benchmark table (for example one an admin added later). */
  | { status: 'no-data'; part: string }
  | {
      status: 'ok';
      fps: number;
      band: FpsBand;
      /** What holds the frame rate back. Undefined when there is no processor to compare. */
      limitedBy?: 'gpu' | 'cpu' | 'game';
    };

const partKey = (part: { brand: string; name: string }) => `${part.brand} ${part.name}`;

export function findGame(gameId: string): Game | undefined {
  return GAMES.find((game) => game.id === gameId);
}

export function fpsBand(fps: number): FpsBand {
  if (fps < 30) return 'struggles';
  if (fps < 60) return 'playable';
  if (fps < 120) return 'smooth';
  return 'high-refresh';
}

/**
 * Estimated average fps: the graphics card's figure, held back by the processor when the
 * processor cannot prepare frames that fast, and by the game's own frame limit if it has one.
 * A processor missing from the table is ignored rather than guessed at.
 */
export function estimateFps(
  game: Game,
  resolution: Resolution,
  parts: { cpu?: CpuSpec; gpu?: GpuSpec },
): FpsEstimate {
  const { cpu, gpu } = parts;
  if (!gpu) return { status: 'needs-gpu' };

  const gpuFps = game.gpuFps[partKey(gpu)]?.[resolution];
  if (gpuFps === undefined) return { status: 'no-data', part: partKey(gpu) };

  const cpuFps = cpu ? game.cpuFps[partKey(cpu)] : undefined;

  let fps = gpuFps;
  let limitedBy: 'gpu' | 'cpu' | 'game' | undefined = cpuFps === undefined ? undefined : 'gpu';
  if (cpuFps !== undefined && cpuFps < fps) {
    fps = cpuFps;
    limitedBy = 'cpu';
  }
  if (game.fpsCap !== undefined && game.fpsCap <= fps) {
    fps = game.fpsCap;
    limitedBy = 'game';
  }

  return { status: 'ok', fps, band: fpsBand(fps), limitedBy };
}
