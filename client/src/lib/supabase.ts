import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Supabase keeps the login session in the browser's local storage and refreshes it automatically.
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
