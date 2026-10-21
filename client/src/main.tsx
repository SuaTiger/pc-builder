import { createRoot } from 'react-dom/client';
import { SetupNotice } from './components/SetupNotice';
import { missingEnv } from './lib/env';
import './index.css';

const root = createRoot(document.getElementById('root')!);

if (missingEnv.length > 0) {
  // Settings are missing: explain how to fix that. The real app is not even loaded, because
  // creating the Supabase client without a URL would throw and leave a blank page.
  root.render(<SetupNotice missing={missingEnv} />);
} else {
  void import('./AppRoot').then(({ AppRoot }) => root.render(<AppRoot />));
}
