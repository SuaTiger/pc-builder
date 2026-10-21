import { Link, Route, Routes } from 'react-router';
import { AdminPage } from './features/admin/AdminPage';
import { LoginPage } from './features/auth/LoginPage';
import { RequireAuth, RequirePermission } from './features/auth/RequireAuth';
import { BuilderPage } from './features/builder/BuilderPage';
import { SavedBuildsPage } from './features/saved-builds/SavedBuildsPage';
import { Layout } from './components/Layout';
import { buttonClass } from './components/Button';

function NotFoundPage() {
  return (
    <div className="py-8">
      <h1 className="title-wide text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">The address may be mistyped, or the page may have moved.</p>
      <Link to="/" className={buttonClass('primary', 'mt-4')}>
        Back to the builder
      </Link>
    </div>
  );
}

/** Every page of the site. A page that needs a login is wrapped in <RequireAuth>. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BuilderPage />} />
        <Route
          path="builder/:buildId"
          element={
            <RequireAuth>
              <BuilderPage />
            </RequireAuth>
          }
        />
        <Route
          path="builds"
          element={
            <RequireAuth>
              <SavedBuildsPage />
            </RequireAuth>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAuth>
              <RequirePermission permission="user:manage">
                <AdminPage />
              </RequirePermission>
            </RequireAuth>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
