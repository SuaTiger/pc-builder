import { error } from '../findings';
import type { Rule } from '../types';

export const coolerCaseHeight: Rule = {
  id: 'cooler-case-height',
  check({ cooler, case: pcCase }) {
    if (!cooler || !pcCase || cooler.heightMm <= pcCase.maxCoolerHeightMm) return [];
    return [
      error(
        `The cooler is ${cooler.heightMm} mm tall but the case allows at most ${pcCase.maxCoolerHeightMm} mm.`,
        'cooler',
        'case',
      ),
    ];
  },
};
