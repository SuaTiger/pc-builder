import { useEffect, useState } from 'react';
import { errorMessage } from '../api/http';
import { Button } from './Button';

/** True once `active` has stayed true for `delayMs`. Used to explain long waits. */
function useDelayedFlag(active: boolean, delayMs: number): boolean {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (!active) {
      setElapsed(false);
      return;
    }
    const timer = setTimeout(() => setElapsed(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return active && elapsed;
}

/** Shown while data loads. After a few seconds it explains the free-hosting delay. */
export function Loading({ label = 'Loading' }: { label?: string }) {
  const slow = useDelayedFlag(true, 4000);

  return (
    <div role="status" className="py-8 text-muted">
      <p>{label}...</p>
      {slow && (
        <p className="mt-1 max-w-prose text-sm">
          The server sleeps when nobody is using it and can take up to a minute to wake up. Hang on, this happens only on the first
          visit.
        </p>
      )}
    </div>
  );
}

export function ErrorMessage({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="py-8">
      <p className="text-fault">{errorMessage(error)}</p>
      {onRetry && (
        <Button className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
