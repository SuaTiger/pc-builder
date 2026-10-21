import type { Permission } from '@pc-builder/shared';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useMe } from '../../api/me.api';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { useAuth } from './auth-context';

/** Sends visitors who are not logged in to the login page, then back here afterwards. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <Loading label="Checking your login" />;
  if (status === 'signed-out') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

/**
 * Hides a page from users without a permission. This is a courtesy only: the API refuses the
 * requests anyway, so a user who bypasses this screen still gets nothing.
 */
export function RequirePermission({ permission, children }: { permission: Permission; children: ReactNode }) {
  const me = useMe();

  if (me.isPending) return <Loading label="Checking your access" />;
  if (me.isError) return <ErrorMessage error={me.error} onRetry={() => void me.refetch()} />;
  if (!me.data.permissions.includes(permission)) {
    return (
      <div className="py-8">
        <h1 className="title-wide text-2xl font-bold">No access</h1>
        <p className="mt-2 text-muted">Your account cannot open this page.</p>
      </div>
    );
  }
  return children;
}
