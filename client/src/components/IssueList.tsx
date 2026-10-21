import type { CompatibilityIssue } from '@pc-builder/shared';

/** Compatibility problems, colour-coded and also labelled in text so colour is never the only cue. */
export function IssueList({ issues }: { issues: CompatibilityIssue[] }) {
  if (issues.length === 0) return null;

  return (
    <ul className="space-y-2">
      {issues.map((issue) => {
        const isError = issue.severity === 'error';
        return (
          <li
            key={`${issue.ruleId}-${issue.message}`}
            className={`border-l-2 pl-3 text-sm ${isError ? 'border-fault' : 'border-caution'}`}
          >
            <span className={`font-semibold ${isError ? 'text-fault' : 'text-caution'}`}>
              {isError ? 'Does not fit: ' : 'Check: '}
            </span>
            {issue.message}
          </li>
        );
      })}
    </ul>
  );
}
