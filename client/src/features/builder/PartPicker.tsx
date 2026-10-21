import type { Build, PartCategory } from '@pc-builder/shared';
import { useMemo, useState } from 'react';
import { usePartsQuery } from '../../api/parts.api';
import { Button } from '../../components/Button';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { formatBaht } from '../../lib/format';
import { CATEGORY_LABELS } from '../../lib/labels';
import { partsInSlot, type AnyPartSpec } from './build-state';
import { annotateCandidates, fittingFirst, type Candidate } from './candidates';
import { describePart } from './part-details';

interface PartPickerProps {
  category: PartCategory;
  build: Build;
  onSelect: (part: AnyPartSpec) => void;
}

/** Lists the parts of one category, marking which ones fit the build chosen so far. */
export function PartPicker({ category, build, onSelect }: PartPickerProps) {
  const parts = usePartsQuery(category);
  const [showAll, setShowAll] = useState(false);

  const candidates = useMemo(
    () => (parts.data ? fittingFirst(annotateCandidates(build, category, parts.data)) : []),
    [build, category, parts.data],
  );

  if (parts.isPending) return <Loading label={`Loading ${CATEGORY_LABELS[category].toLowerCase()} options`} />;
  if (parts.isError) return <ErrorMessage error={parts.error} onRetry={() => void parts.refetch()} />;

  const hiddenCount = candidates.filter((c) => !c.fits).length;
  const visible = showAll ? candidates : candidates.filter((c) => c.fits);
  const selectedIds = new Set(partsInSlot(build, category).map((part) => part.id));
  const isStorage = category === 'storage';

  return (
    <section aria-labelledby="picker-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="picker-title" className="title-wide text-xl font-bold">
          {CATEGORY_LABELS[category]}
        </h2>
        {hiddenCount > 0 && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(event) => setShowAll(event.target.checked)}
              className="size-4 accent-[var(--trace)]"
            />
            Show {hiddenCount} that do not fit this build
          </label>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-8 text-muted">
          {candidates.length === 0
            ? 'No parts of this kind in the catalogue yet.'
            : 'Nothing here fits the parts you have chosen. Show the parts that do not fit, or remove a part to widen the choice.'}
        </p>
      ) : (
        <ul className="mt-3 border-t border-line">
          {visible.map((candidate) => (
            <PartRow
              key={candidate.part.id}
              category={category}
              candidate={candidate}
              selected={selectedIds.has(candidate.part.id)}
              actionLabel={isStorage ? 'Add' : 'Select'}
              onSelect={() => onSelect(candidate.part)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

interface PartRowProps {
  category: PartCategory;
  candidate: Candidate<PartCategory>;
  selected: boolean;
  actionLabel: string;
  onSelect: () => void;
}

function PartRow({ category, candidate, selected, actionLabel, onSelect }: PartRowProps) {
  const { part, issues, fits } = candidate;
  // A drive can be added again (two of the same model), so only single-part slots show "Selected".
  const alreadyChosen = selected && category !== 'storage';

  return (
    <li
      className={`grid gap-x-4 gap-y-2 border-b border-line py-3 sm:grid-cols-[minmax(0,1fr)_auto_6rem] sm:items-center ${
        fits ? '' : 'border-l-2 border-l-fault pl-3'
      } ${alreadyChosen ? 'bg-surface' : ''}`}
    >
      <div className="min-w-0">
        <p className="font-semibold">
          {part.brand} {part.name}
        </p>
        <p className="text-sm text-muted">{describePart(category, part).join(', ')}</p>
        {issues.length > 0 && (
          <ul className="mt-1 space-y-0.5 text-sm">
            {issues.map((issue) => (
              <li key={issue.message} className={issue.severity === 'error' ? 'text-fault' : 'text-caution'}>
                {issue.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="font-semibold sm:text-right">{formatBaht(part.priceThb)}</p>
      <Button
        variant={fits ? 'primary' : 'secondary'}
        disabled={alreadyChosen}
        onClick={onSelect}
        aria-label={`${actionLabel} ${part.brand} ${part.name}`}
      >
        {alreadyChosen ? 'Selected' : actionLabel}
      </Button>
    </li>
  );
}
