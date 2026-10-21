/*
 * ROUGH benchmark figures used to estimate frame rates.
 *
 * These are approximate averages written from public review data, not measurements taken by this
 * project, and real results change with drivers, game patches, RAM speed and the scene tested.
 * The UI says "estimate" everywhere for that reason. Verify against current reviews before
 * treating a number as accurate.
 *
 * Parts are matched by "<brand> <name>" exactly as they appear in the database.
 */

export const RESOLUTIONS = ['1080p', '1440p'] as const;
export type Resolution = (typeof RESOLUTIONS)[number];

export interface Game {
  id: string;
  title: string;
  /** The settings the figures were taken at. */
  settings: string;
  /** In-game frame limit, if the game has one that cannot be turned off. */
  fpsCap?: number;
  /** Average fps of each graphics card with a fast CPU, per resolution. */
  gpuFps: Record<string, Record<Resolution, number>>;
  /** The most fps each processor can prepare, whatever the graphics card. */
  cpuFps: Record<string, number>;
}

export const GAMES: readonly Game[] = [
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    settings: 'Ultra, ray tracing off',
    gpuFps: {
      'NVIDIA GeForce RTX 4060': { '1080p': 75, '1440p': 50 },
      'NVIDIA GeForce RTX 4070 SUPER': { '1080p': 125, '1440p': 90 },
      'AMD Radeon RX 7800 XT': { '1080p': 120, '1440p': 88 },
    },
    cpuFps: {
      'AMD Ryzen 5 5600': 130,
      'AMD Ryzen 5 7600': 150,
      'Intel Core i5-12400F': 135,
      'Intel Core i7-14700K': 190,
    },
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    settings: 'High, DirectX 12, ray tracing off',
    gpuFps: {
      'NVIDIA GeForce RTX 4060': { '1080p': 150, '1440p': 100 },
      'NVIDIA GeForce RTX 4070 SUPER': { '1080p': 240, '1440p': 180 },
      'AMD Radeon RX 7800 XT': { '1080p': 230, '1440p': 170 },
    },
    cpuFps: {
      'AMD Ryzen 5 5600': 220,
      'AMD Ryzen 5 7600': 280,
      'Intel Core i5-12400F': 230,
      'Intel Core i7-14700K': 380,
    },
  },
  {
    id: 'counter-strike-2',
    title: 'Counter-Strike 2',
    settings: 'High',
    gpuFps: {
      'NVIDIA GeForce RTX 4060': { '1080p': 260, '1440p': 190 },
      'NVIDIA GeForce RTX 4070 SUPER': { '1080p': 400, '1440p': 300 },
      'AMD Radeon RX 7800 XT': { '1080p': 390, '1440p': 290 },
    },
    cpuFps: {
      'AMD Ryzen 5 5600': 330,
      'AMD Ryzen 5 7600': 450,
      'Intel Core i5-12400F': 340,
      'Intel Core i7-14700K': 500,
    },
  },
  {
    id: 'baldurs-gate-3',
    title: "Baldur's Gate 3",
    settings: 'Ultra',
    gpuFps: {
      'NVIDIA GeForce RTX 4060': { '1080p': 80, '1440p': 58 },
      'NVIDIA GeForce RTX 4070 SUPER': { '1080p': 125, '1440p': 95 },
      'AMD Radeon RX 7800 XT': { '1080p': 125, '1440p': 95 },
    },
    cpuFps: {
      'AMD Ryzen 5 5600': 110,
      'AMD Ryzen 5 7600': 140,
      'Intel Core i5-12400F': 115,
      'Intel Core i7-14700K': 170,
    },
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    settings: 'Maximum, ray tracing off',
    fpsCap: 60,
    gpuFps: {
      'NVIDIA GeForce RTX 4060': { '1080p': 60, '1440p': 57 },
      'NVIDIA GeForce RTX 4070 SUPER': { '1080p': 60, '1440p': 60 },
      'AMD Radeon RX 7800 XT': { '1080p': 60, '1440p': 60 },
    },
    cpuFps: {
      'AMD Ryzen 5 5600': 60,
      'AMD Ryzen 5 7600': 60,
      'Intel Core i5-12400F': 60,
      'Intel Core i7-14700K': 60,
    },
  },
];
