const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Names of required settings that are empty. main.tsx shows a setup screen if any are missing. */
export const missingEnv = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
].filter((name): name is string => Boolean(name));

export const env = {
  /** Empty in development (Vite proxies /api); the deployed API's address in production. */
  apiUrl: ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, ''),
  supabaseUrl: supabaseUrl ?? '',
  supabaseAnonKey: supabaseAnonKey ?? '',
};
