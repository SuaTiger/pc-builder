# Deploying

The database and login already live on Supabase, so only the API and the web app need a host.
Render runs both for free from the same GitHub repository (see `render.yaml`).

## What runs where

| Part     | Host                | Notes                                              |
| -------- | ------------------- | -------------------------------------------------- |
| Database | Supabase            | Already set up. Pauses after ~1 week of no use.    |
| Login    | Supabase Auth       | Already set up.                                    |
| API      | Render web service  | Free tier sleeps after ~15 min; first call ~1 min. |
| Web app  | Render static site  | Always on.                                         |

## Steps

1. **Push the project to GitHub.** Check that `server/.env` and `client/.env` are NOT included
   (`.gitignore` already lists `.env`; `git status` must not show them).
2. **Render > New > Blueprint**, pick the repository. Render reads `render.yaml` and creates two services.
3. **Fill the secret values** when asked:
   - `pc-builder-api`: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (same as `server/.env`).
   - `pc-builder-web`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (same as `client/.env`).
   - The two addresses depend on each other, so leave them empty at first (step 4).
4. **Wait for the first deploy, then copy the two addresses** shown on each service page
   (`https://pc-builder-api-xxxx.onrender.com` and `https://pc-builder-web-xxxx.onrender.com`):
   - API service: `CLIENT_ORIGIN` = the web address.
   - Web service: `VITE_API_URL` = the API address.
   - No trailing slash on either. Save; the services redeploy. `VITE_` values are baked in at build
     time, so the web app must be redeployed after changing them (Render does this on save).
5. **Supabase > Authentication > URL Configuration**: set Site URL to the web address and add it to
   Redirect URLs. Without this, links in confirmation emails point to localhost.
6. **Check**: open `<api address>/api/health`, then the web address, then register and save a build.

## Things to know

- **First request after idle is slow** (~1 minute) while the free API wakes up. The web app shows a
  hint after 4 seconds. Opening the site once before showing it to someone avoids this.
- **A free Supabase project pauses after about a week without activity.** Resume it from the dashboard.
- **Changing the schema later**: run `npm run db:generate -w server` and `db:migrate` from your own computer
  (it needs `server/.env`). Deploys do not migrate the database.
- **Changing an admin**: `db:make-admin` is also run from your own computer.
- **If login works but every request fails with a CORS error**, `CLIENT_ORIGIN` does not exactly match
  the web address (check `https`, spelling, and the missing trailing slash).
