import { warning } from '../findings';
import type { Rule } from '../types';

export const displayOutput: Rule = {
  id: 'display-output',
  check({ cpu, gpu }) {
    if (!cpu || gpu || cpu.hasIntegratedGpu) return [];
    return [
      warning(
        'This CPU has no integrated graphics, so the build has no video output without a graphics card.',
        'cpu',
        'gpu',
      ),
    ];
  },
};
