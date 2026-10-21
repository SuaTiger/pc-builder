import { error, warning } from '../findings';
import { estimateSystemWatts, PSU_HEADROOM } from '../power';
import type { Rule } from '../types';

export const psuWattage: Rule = {
  id: 'psu-wattage',
  check(build) {
    const { cpu, gpu, psu } = build;
    if (!psu) return [];

    // Hard limit: the graphics card maker's own minimum.
    if (gpu && psu.wattage < gpu.recommendedPsuWatts) {
      return [
        error(
          `The graphics card recommends at least ${gpu.recommendedPsuWatts} W but the PSU is ${psu.wattage} W.`,
          'gpu',
          'psu',
        ),
      ];
    }

    // Soft limit: our own estimate with headroom.
    if (cpu || gpu) {
      const recommended = Math.ceil(estimateSystemWatts(build) * PSU_HEADROOM);
      if (psu.wattage < recommended) {
        return [
          warning(
            `Estimated load suggests about ${recommended} W; this ${psu.wattage} W PSU leaves little headroom.`,
            'psu',
          ),
        ];
      }
    }
    return [];
  },
};
