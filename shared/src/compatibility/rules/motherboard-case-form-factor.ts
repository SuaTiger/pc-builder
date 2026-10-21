import { error } from '../findings';
import type { Rule } from '../types';

export const motherboardCaseFormFactor: Rule = {
  id: 'motherboard-case-form-factor',
  check({ motherboard, case: pcCase }) {
    if (!motherboard || !pcCase || pcCase.motherboardFormFactors.includes(motherboard.formFactor)) {
      return [];
    }
    return [
      error(
        `This ${motherboard.formFactor} motherboard does not fit this case (supports ${pcCase.motherboardFormFactors.join(', ')}).`,
        'motherboard',
        'case',
      ),
    ];
  },
};
