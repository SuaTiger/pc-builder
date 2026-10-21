import type { Build, CompatibilityReport } from '@pc-builder/shared';
import { IssueList } from '../../components/IssueList';
import { formatBaht } from '../../lib/format';
import { isEmptyBuild } from './build-state';
import { PowerMeter } from './PowerMeter';

interface BuildSummaryProps {
  build: Build;
  report: CompatibilityReport;
  totalPriceThb: number;
  estimatedWatts: number;
}

function headline(build: Build, report: CompatibilityReport): string {
  if (isEmptyBuild(build)) return 'Choose your first part';
  const errors = report.issues.filter((issue) => issue.severity === 'error').length;
  if (errors > 0) return errors === 1 ? '1 part does not fit' : `${errors} problems to fix`;
  return report.issues.length > 0 ? 'Fits, with notes' : 'Everything chosen so far fits';
}

export function BuildSummary({ build, report, totalPriceThb, estimatedWatts }: BuildSummaryProps) {
  // Errors first, because those are the ones that need action.
  const issues = [...report.issues].sort(
    (a, b) => Number(b.severity === 'error') - Number(a.severity === 'error'),
  );

  return (
    <section aria-labelledby="summary-title" className="space-y-5">
      <div>
        <h2 id="summary-title" className="title-wide text-xl font-bold">
          Your build
        </h2>
        <p className="mt-1 text-sm text-muted">Total price</p>
        <p className="title-wide text-3xl font-bold">{formatBaht(totalPriceThb)}</p>
      </div>

      <PowerMeter build={build} estimatedWatts={estimatedWatts} />

      <div aria-live="polite" className="space-y-3">
        <p className={`font-semibold ${report.ok ? '' : 'text-fault'}`}>{headline(build, report)}</p>
        <IssueList issues={issues} />
      </div>
    </section>
  );
}
