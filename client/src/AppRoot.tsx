import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useState } from 'react';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { createQueryClient } from './api/query-client';
import { AuthProvider } from './features/auth/AuthProvider';

/** Wraps the app in the things every page needs: data cache, URL routing and login state. */
export function AppRoot() {
  // useState keeps one client for the lifetime of the page, even if this component re-renders.
  const [queryClient] = useState(createQueryClient);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}
