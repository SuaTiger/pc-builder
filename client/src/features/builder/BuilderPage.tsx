import { useParams } from 'react-router';
import { ApiError } from '../../api/http';
import { useSavedBuildQuery } from '../../api/saved-builds.api';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { Builder } from './Builder';

/** Route `/` starts an empty build; `/builder/:buildId` opens one the user saved earlier. */
export function BuilderPage() {
  const { buildId } = useParams();
  const saved = useSavedBuildQuery(buildId);

  if (!buildId) return <Builder />;

  if (saved.isPending) return <Loading label="Opening your build" />;
  if (saved.isError) {
    const notFound = saved.error instanceof ApiError && saved.error.status === 404;
    return notFound ? (
      <div className="py-8">
        <h1 className="title-wide text-2xl font-bold">Build not found</h1>
        <p className="mt-2 text-muted">It may have been deleted, or it belongs to another account.</p>
      </div>
    ) : (
      <ErrorMessage error={saved.error} onRetry={() => void saved.refetch()} />
    );
  }

  // `key` makes React start a fresh editor when a different build is opened.
  return <Builder key={saved.data.id} saved={saved.data} />;
}
