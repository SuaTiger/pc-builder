# Design decisions

Each entry records what was chosen, what was rejected, and why.

## 1. React (Vite) + Express as separate projects

- **Chosen:** separate `client/` and `server/` with a `shared/` package for types.
- **Rejected:** Next.js full-stack (less visible request flow; the goal is to learn how a client
  talks to an API).
- **Why:** the API is independent of the UI, so a future mobile app or other client can reuse it.

## 2. PostgreSQL on Supabase

- **Chosen:** hosted PostgreSQL (Supabase free plan).
- **Rejected:** SQLite (free hosts lose local files on restart, so it would need a migration later).
- **Why:** data persists, no machine of ours has to stay on, same engine as production setups.
- **Known limit:** free projects pause after about a week of inactivity.

## 3. Supabase Auth for login

- **Chosen:** Supabase Auth issues tokens; Express only verifies them. Roles (user/admin) are
  our own data so permissions stay under our control.
- **Rejected:** hand-written password handling (more security risk, more code to maintain).

## 4. Drizzle ORM

- **Chosen:** Drizzle, because queries stay close to SQL and are easy to read while learning.
- **Rejected:** Prisma (heavier, hides more SQL), raw Supabase client (weak typing for the
  multi-table compatibility queries).

## 5. One table per part category

- **Chosen:** `cpus`, `motherboards`, `ram_kits`, `gpus`, ... each with typed columns for the
  specs that matter for compatibility.
- **Rejected:** one `parts` table with a JSON `specs` column (flexible, but the database could not
  validate values and queries would be harder to write and read).
- **Extending:** add the category to `PART_CATEGORIES` in `shared`, then add its table file.
  TypeScript fails the build until `part-tables.ts` includes it.

## 6. Allowed values live in `shared`

Sockets, memory types and form factors are defined once in `shared/src/parts.ts`. The database
enums, the compatibility rules and the UI all read the same lists.

## 7. Compatibility rules are TypeScript functions in `shared`

- **Chosen:** one file per rule in `shared/src/compatibility/rules/`, each a pure function
  `build -> findings`. `checkBuild()` runs them all.
- **Rejected:** rules stored as database rows (admins could edit them without a deploy, but
  conditions like "total wattage" become hard to express, and every rule gets harder to test).
- **Why in `shared`:** the browser runs the same code for instant feedback while the user picks
  parts, and the server runs it on every check and every read of a saved build, because the
  browser can never be trusted.
- **Two severities:** `error` means it cannot work; `warning` means it works but is a poor idea.
  Only errors make a build invalid.
- **Incomplete builds are valid:** a rule returns nothing if a part it needs is not picked yet.
- **Adding a rule:** create the file, add it to the list in `rules/index.ts`, add one row to
  `brokenBuilds` in the test. A test fails if a rule has no test row.

## 8. The API receives ids, never specs

- **Chosen:** `POST /api/builds/check` takes part ids and the server loads the specs.
- **Rejected:** letting the client send full specs (saves a few database lookups, but anyone could
  send fake specs and get a "compatible" answer saved).
- **Cost:** 8 primary-key lookups, run in parallel. The browser still checks instantly while the
  user picks parts, using specs it already has, so this cost is paid only on save or share.

## 9. Routes depend on a `PartsRepository` interface

- **Chosen:** `createApp({ parts })` receives the data source as an argument. The real one wraps
  Drizzle; tests pass an in-memory fake.
- **Why:** tests run in milliseconds with no database or network, and the HTTP layer can be
  tested for real (status codes, validation) without Supabase being reachable.
- **Where the real database is connected:** only `server/src/index.ts`.

## 10. Roles live in our `profiles` table, not in the token

- **Chosen:** Supabase proves *who* someone is; our `profiles.role` decides *what they may do*.
- **Rejected:** roles inside the Supabase token (a changed role would not apply until the old
  token expires, and we could not join roles with our own data).
- **Cost:** one extra database read per authenticated request. A profile is created lazily on the
  first request, so there is no sign-up hook to keep in sync.

## 11. Routes check permissions, not roles

`authorize('user:manage')` instead of `if (role === 'admin')`. Adding a "moderator" role is then
one row in `ROLE_PERMISSIONS`, with no change to any route.

## 12. Saved builds store ids and are re-checked on every read

- **Chosen:** a saved build holds only the selected part ids. Specs, prices and the compatibility
  report are computed when it is read.
- **Why:** prices and rules change; a stored report would silently go stale. It also means an
  incompatible build can be saved as a draft without ever being shown as "compatible".
- **Cost:** no foreign keys (the ids sit in a jsonb column), so a part removed later shows up in
  `missingParts` instead of blocking the removal.

## 13. Ownership is enforced inside the repository

Every saved-build method takes the user id and filters by it. Forgetting an ownership check in a
route is then impossible, and a build owned by someone else is indistinguishable from a missing one.

## 14. Tokens are verified by asking Supabase

- **Chosen:** `supabase.auth.getUser(token)` behind a `TokenVerifier` interface.
- **Rejected for now:** verifying the JWT locally (no network call, but depends on the project's
  signing-key setup and cannot see revoked sessions).
- **Cost:** one request to Supabase per authenticated call. If that becomes a bottleneck, only
  `supabase-token-verifier.ts` changes.
- An outage is reported as a server error, never as `401`, so users are not told their
  login is wrong when Supabase is down.

## 15. Row Level Security is on for every table

Supabase serves `public` tables through a REST API that the public anon key can reach. RLS with no
policies makes that API see nothing, while our server (a direct Postgres connection) is unaffected.
`npm run db:secure` applies it to all tables.

## 16. Server data is read with TanStack Query

- **Chosen:** TanStack Query for everything that comes from the API (loading, errors, caching,
  refetching after a save). Retries only happen for network and 5xx errors, never for 4xx.
- **Rejected:** `useEffect` + `useState` per screen (repeats the same loading/error code everywhere).
- **Cost:** one more dependency to learn.

## 17. Tailwind CSS with design tokens

- **Chosen:** Tailwind v4 with the colours defined once as CSS variables (`index.css`) and mapped
  into Tailwind with `@theme inline`. Dark mode follows the system setting by redefining the variables.
- **Why:** components use names like `text-muted` and `border-line`, so changing the look is a
  one-file edit.

## 18. The builder filters parts with the same rules as the server

`candidates.ts` runs `checkBuild` from `shared` on "current build + this part" for each candidate,
so the list can show fitting parts first and say why another does not fit. The server still checks
everything again, so the browser is a convenience, never the authority.

## 19. Pure logic is kept out of components

`build-state.ts` and `candidates.ts` contain no React, so they are unit-tested without a browser.
Components only display what these return.

## 20. Design: the slot rail

The one bold element is a vertical rail of part slots with pin strips, like a motherboard's
traces. Everything else is flat, bordered and quiet: no shadows, no all-caps labels.

## 21. Hosting: Render for the API and the web app

- **Chosen:** Render, both services from one `render.yaml`. The web app is a static site (never sleeps), the API a free web service.
- **Rejected:** Fly.io (no free tier any more). Putting the API inside Supabase Edge Functions would mean rewriting it.
- **Cost:** the free API sleeps after ~15 minutes idle, so the first request takes about a minute.
- Secrets are entered in Render's dashboard (`sync: false`), never committed.
