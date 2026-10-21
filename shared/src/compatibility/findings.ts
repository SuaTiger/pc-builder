import type { PartCategory } from '../parts';
import type { RuleFinding } from './types';

export const error = (message: string, ...categories: PartCategory[]): RuleFinding => ({
  severity: 'error',
  message,
  categories,
});

export const warning = (message: string, ...categories: PartCategory[]): RuleFinding => ({
  severity: 'warning',
  message,
  categories,
});
