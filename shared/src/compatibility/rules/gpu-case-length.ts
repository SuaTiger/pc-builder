import { error } from '../findings';
import type { Rule } from '../types';

export const gpuCaseLength: Rule = {
  id: 'gpu-case-length',
  check({ gpu, case: pcCase }) {
    if (!gpu || !pcCase || gpu.lengthMm <= pcCase.maxGpuLengthMm) return [];
    return [
      error(
        `The graphics card is ${gpu.lengthMm} mm long but the case fits at most ${pcCase.maxGpuLengthMm} mm.`,
        'gpu',
        'case',
      ),
    ];
  },
};
