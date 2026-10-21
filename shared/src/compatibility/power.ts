import type { Build } from './types';

/** Rough allowance for motherboard, RAM, drives and fans. */
export const OTHER_COMPONENTS_WATTS = 100;

/** A PSU should run well below its limit, so we ask for 25% extra capacity. */
export const PSU_HEADROOM = 1.25;

/** Estimated peak draw of the build. Exported because other features (e.g. a UI meter) need it too. */
export function estimateSystemWatts({ cpu, gpu }: Build): number {
  // With no CPU and no GPU there is nothing drawing power yet, so do not report the base allowance.
  if (!cpu && !gpu) return 0;
  return (cpu?.tdpWatts ?? 0) + (gpu?.tdpWatts ?? 0) + OTHER_COMPONENTS_WATTS;
}
