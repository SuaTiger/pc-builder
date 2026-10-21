import { error } from '../findings';
import type { Rule } from '../types';

export const psuCaseFormFactor: Rule = {
  id: 'psu-case-form-factor',
  check({ psu, case: pcCase }) {
    if (!psu || !pcCase || pcCase.psuFormFactors.includes(psu.formFactor)) return [];
    return [
      error(
        `This ${psu.formFactor} power supply does not fit this case (supports ${pcCase.psuFormFactors.join(', ')}).`,
        'psu',
        'case',
      ),
    ];
  },
};
