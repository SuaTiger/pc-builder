import type { Build } from '@pc-builder/shared';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { errorMessage } from '../../api/http';
import { useSaveBuildMutation } from '../../api/saved-builds.api';
import { Button } from '../../components/Button';
import { useAuth } from '../auth/auth-context';
import { isEmptyBuild, toSelection } from './build-state';

interface SaveBuildFormProps {
  build: Build;
  /** Set when editing a build that is already saved; saving then updates it. */
  savedId?: string;
  initialName?: string;
}

export function SaveBuildForm({ build, savedId, initialName = '' }: SaveBuildFormProps) {
  const { status } = useAuth();
  const navigate = useNavigate();
  const save = useSaveBuildMutation();
  const [name, setName] = useState(initialName);

  if (status !== 'signed-in') {
    return (
      <p className="text-sm text-muted">
        <Link to="/login" className="font-semibold text-trace underline underline-offset-2">
          Log in
        </Link>{' '}
        to save this build and open it later.
      </p>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    save.mutate(
      { id: savedId, body: { name: name.trim(), selection: toSelection(build) } },
      {
        // A first save gets an address of its own, so the page can be reloaded or shared with yourself.
        onSuccess: (saved) => {
          if (!savedId) navigate(`/builder/${saved.id}`, { replace: true });
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block">
        <span className="text-sm font-semibold">Build name</span>
        <input
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-sm border border-line bg-surface px-3 py-2"
        />
      </label>
      <Button
        type="submit"
        variant="primary"
        className="w-full py-2"
        disabled={save.isPending || isEmptyBuild(build) || name.trim() === ''}
      >
        {savedId ? 'Save changes' : 'Save build'}
      </Button>
      {isEmptyBuild(build) && <p className="text-sm text-muted">Choose at least one part to save.</p>}
      {save.isError && (
        <p role="alert" className="text-sm text-fault">
          {errorMessage(save.error)}
        </p>
      )}
      {save.isSuccess && (
        <p role="status" className="text-sm text-trace">
          Saved.
        </p>
      )}
    </form>
  );
}
