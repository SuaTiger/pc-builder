import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router';
import { errorMessage } from '../../api/http';
import { Button } from '../../components/Button';
import { useAuth } from './auth-context';

type Mode = 'sign-in' | 'sign-up';

const inputClass = 'mt-1 w-full rounded-sm border border-line bg-surface px-3 py-2';

export function LoginPage() {
  const { status, signIn, signUp } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Once the login succeeds the auth state flips and this sends the user on their way.
  if (status === 'signed-in') return <Navigate to={from} replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === 'sign-in') {
        await signIn(email, password);
      } else {
        const { needsEmailConfirmation } = await signUp(email, password);
        if (needsEmailConfirmation) {
          setNotice(`We sent a confirmation link to ${email}. Open it, then log in.`);
          setMode('sign-in');
        }
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const signingIn = mode === 'sign-in';

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="title-wide text-2xl font-bold">{signingIn ? 'Log in' : 'Create an account'}</h1>
      <p className="mt-2 text-muted">
        {signingIn ? 'Log in to save builds and open them from any device.' : 'An account lets you save builds. Building and checking parts is free without one.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={signingIn ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-fault">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm text-trace">
            {notice}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={busy} className="w-full py-2">
          {signingIn ? 'Log in' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {signingIn ? 'No account yet? ' : 'Already have an account? '}
        <button
          type="button"
          onClick={() => {
            setMode(signingIn ? 'sign-up' : 'sign-in');
            setError(null);
          }}
          className="font-semibold text-trace underline underline-offset-2"
        >
          {signingIn ? 'Create one' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
