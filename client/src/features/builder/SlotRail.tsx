import { PART_CATEGORIES, type Build, type CompatibilityReport, type PartCategory } from '@pc-builder/shared';
import { formatBaht } from '../../lib/format';
import { CATEGORY_LABELS } from '../../lib/labels';
import { partsInSlot, slotStatus, type SlotStatus } from './build-state';

const PIN_COUNT = 6;

const pinColor: Record<SlotStatus, string> = {
  empty: 'bg-line',
  ok: 'bg-trace',
  warning: 'bg-caution',
  error: 'bg-fault',
};

const statusText: Record<SlotStatus, string> = {
  empty: 'Empty',
  ok: 'Fits',
  warning: 'Fits, with a note',
  error: 'Does not fit',
};

/**
 * The contact strip of a slot, drawn like the gold fingers of an expansion slot.
 * The pins fill with a colour once a part is seated. The status is also read out as text
 * for screen readers, because colour alone is not enough.
 */
function PinStrip({ status }: { status: SlotStatus }) {
  return (
    <span aria-hidden="true" className="flex w-2.5 shrink-0 flex-col justify-between self-stretch">
      {Array.from({ length: PIN_COUNT }, (_, index) => (
        <span
          key={index}
          className={`h-[3px] rounded-[1px] motion-safe:transition-colors ${pinColor[status]}`}
        />
      ))}
    </span>
  );
}

interface SlotRailProps {
  build: Build;
  report: CompatibilityReport;
  active: PartCategory;
  onActivate: (category: PartCategory) => void;
  onRemove: (category: PartCategory, storageIndex?: number) => void;
}

/** One row per kind of part. Choose a row to pick parts for it; the pins show if it fits. */
export function SlotRail({ build, report, active, onActivate, onRemove }: SlotRailProps) {
  return (
    <nav aria-label="Parts in this build">
      <ul className="border-t border-line">
        {PART_CATEGORIES.map((category) => {
          const parts = partsInSlot(build, category);
          const status = slotStatus(build, category, report);
          const isActive = category === active;

          return (
            <li
              key={category}
              className={`flex gap-3 border-b border-line px-3 py-3 ${isActive ? 'bg-surface' : ''}`}
            >
              <PinStrip status={status} />
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onActivate(category)}
                  aria-current={isActive ? 'true' : undefined}
                  className="block w-full text-left"
                >
                  <span className={`block ${isActive ? 'font-bold' : 'font-semibold'}`}>
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="block text-sm text-muted">
                    {parts.length === 0 ? 'Choose' : statusText[status]}
                  </span>
                </button>

                {parts.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {parts.map((part, index) => (
                      <li key={`${part.id}-${index}`} className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate" title={`${part.brand} ${part.name}`}>
                          {part.brand} {part.name}
                          <span className="ml-2 text-muted">{formatBaht(part.priceThb)}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemove(category, category === 'storage' ? index : undefined)}
                          className="shrink-0 text-muted underline underline-offset-2 hover:text-fault"
                        >
                          Remove<span className="sr-only"> {part.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
