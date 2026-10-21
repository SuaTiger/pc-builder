import { allRules } from './rules';
import type { Build, CompatibilityReport, Rule } from './types';

/**
 * Runs every rule against the build. Pure function: same input, same output,
 * no database or network, so it runs in the browser (instant feedback)
 * and on the server (never trust the browser) with identical results.
 */
export function checkBuild(build: Build, rules: readonly Rule[] = allRules): CompatibilityReport {
  const issues = rules.flatMap((rule) =>
    rule.check(build).map((finding) => ({ ruleId: rule.id, ...finding })),
  );
  return { ok: issues.every((issue) => issue.severity !== 'error'), issues };
}
