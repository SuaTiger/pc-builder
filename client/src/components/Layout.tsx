import type { ReactNode } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { useHasPermission } from '../api/me.api';
import { useAuth } from '../features/auth/auth-context';
import { Button, buttonClass } from './Button';

function NavItem({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `border-b-2 py-1 ${isActive ? 'border-trace font-semibold' : 'border-transparent text-muted hover:text-ink'}`
      }
    >
      {children}
    </NavLink>
  );
}

/** The frame around every page: top bar with navigation and the login state. */
export function Layout() {
  const { status, session, signOut } = useAuth();
  const canManageUsers = useHasPermission('user:manage');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3">
          <Link to="/" className="title-wide text-xl font-bold">
            PC Builder
          </Link>

          <nav aria-label="Main" className="flex gap-6 text-sm">
            <NavItem to="/" end>
              Build
            </NavItem>
            {status === 'signed-in' && <NavItem to="/builds">My builds</NavItem>}
            {canManageUsers && <NavItem to="/admin">Users</NavItem>}
          </nav>

          <div className="ml-auto flex items-center gap-3 text-sm">
            {status === 'signed-in' ? (
              <>
                <span className="hidden text-muted sm:inline">{session?.user.email}</span>
                <Button variant="secondary" onClick={() => void signOut()}>
                  Log out
                </Button>
              </>
            ) : (
              status === 'signed-out' && (
                <Link to="/login" className={buttonClass('secondary')}>
                  Log in
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[88rem] flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
