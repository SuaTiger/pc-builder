import { USER_ROLES, type UserRole } from '@pc-builder/shared';
import { errorMessage } from '../../api/http';
import { useSetRoleMutation, useUsersQuery } from '../../api/admin.api';
import { useMe } from '../../api/me.api';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { formatDate } from '../../lib/format';

export function AdminPage() {
  const users = useUsersQuery();
  const me = useMe();
  const setRole = useSetRoleMutation();

  if (users.isPending) return <Loading label="Loading users" />;
  if (users.isError) return <ErrorMessage error={users.error} onRetry={() => void users.refetch()} />;

  return (
    <section aria-labelledby="users-title" className="max-w-3xl">
      <h1 id="users-title" className="title-wide text-2xl font-bold">
        Users
      </h1>
      <p className="mt-1 text-muted">Admins can manage users. Everyone else can build and save their own builds.</p>

      <ul className="mt-4 border-t border-line">
        {users.data.map((user) => {
          const isYou = user.id === me.data?.id;
          return (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {user.email ?? 'No email'}
                  {isYou && <span className="ml-2 font-normal text-muted">(you)</span>}
                </p>
                <p className="text-sm text-muted">Joined {formatDate(user.createdAt)}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span>Role</span>
                <select
                  value={user.role}
                  // You cannot change your own role: the server refuses it, so we do not offer it.
                  disabled={isYou || setRole.isPending}
                  onChange={(event) => setRole.mutate({ userId: user.id, role: event.target.value as UserRole })}
                  className="rounded-sm border border-line bg-surface px-2 py-1.5 disabled:opacity-60"
                >
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </li>
          );
        })}
      </ul>

      {setRole.isError && (
        <p role="alert" className="mt-3 text-sm text-fault">
          {errorMessage(setRole.error)}
        </p>
      )}
    </section>
  );
}
