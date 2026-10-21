import { Link } from 'react-router';
import { errorMessage } from '../../api/http';
import { useDeleteBuildMutation, useSavedBuildsQuery } from '../../api/saved-builds.api';
import { Button, buttonClass } from '../../components/Button';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { formatDate } from '../../lib/format';

export function SavedBuildsPage() {
  const builds = useSavedBuildsQuery();
  const remove = useDeleteBuildMutation();

  if (builds.isPending) return <Loading label="Loading your builds" />;
  if (builds.isError) return <ErrorMessage error={builds.error} onRetry={() => void builds.refetch()} />;

  return (
    <section aria-labelledby="builds-title" className="max-w-3xl">
      <h1 id="builds-title" className="title-wide text-2xl font-bold">
        My builds
      </h1>

      {builds.data.length === 0 ? (
        <div className="py-8">
          <p className="text-muted">You have not saved a build yet.</p>
          <Link to="/" className={buttonClass('primary', 'mt-4')}>
            Start a build
          </Link>
        </div>
      ) : (
        <ul className="mt-4 border-t border-line">
          {builds.data.map((build) => (
            <li
              key={build.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-3"
            >
              <div className="min-w-0">
                <p className="font-semibold">{build.name}</p>
                <p className="text-sm text-muted">Last changed {formatDate(build.updatedAt)}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/builder/${build.id}`} className={buttonClass('primary')}>
                  Open
                </Link>
                <Button
                  variant="danger"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (window.confirm(`Delete "${build.name}"? This cannot be undone.`)) {
                      remove.mutate(build.id);
                    }
                  }}
                >
                  Delete<span className="sr-only"> {build.name}</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {remove.isError && (
        <p role="alert" className="mt-3 text-sm text-fault">
          {errorMessage(remove.error)}
        </p>
      )}
    </section>
  );
}
