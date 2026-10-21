# PC Builder

A web app for choosing PC parts where every part has to actually fit together. Pick a CPU and the
motherboard list shows only boards with the same socket; pick a graphics card and the app checks
case clearance and power supply wattage. Log in to save builds and open them later.

**Live demo:** https://pc-builder-web-q9fi.onrender.com (the API on the free tier sleeps when idle,
so the first load can take about a minute).

Built phase by phase as a learning project; the reasoning behind each choice is written down in
[docs/decisions.md](docs/decisions.md).

## What it checks

14 rules, each one a small pure function in [`shared/src/compatibility/rules`](shared/src/compatibility/rules):

| Between                  | Checks                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| CPU and motherboard      | Socket match, supported memory type                                 |
| RAM and motherboard      | DDR generation, number of modules vs slots, total capacity          |
| Motherboard and case     | Form factor (ATX, mATX, ITX)                                        |
| Power supply and case    | Form factor (ATX, SFX)                                              |
| Graphics card and case   | Card length vs case clearance                                       |
| Power supply and GPU/CPU | Total wattage with headroom, PCIe power connectors                  |
| Cooler                   | CPU socket support, height vs case, cooling capacity vs CPU power   |
| Storage                  | NVMe and SATA ports on the motherboard                              |
| Display output           | Warns when there is no integrated or dedicated graphics             |

Errors mean the parts cannot work together; warnings are things worth knowing. An unfinished build is valid.
The same rules run in the browser (to sort the part lists) and on the server (the source of truth).

## Tech stack

| Layer    | Choice                                                    |
| -------- | --------------------------------------------------------- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, TanStack Query     |
| Backend  | Node.js, Express, TypeScript, zod                         |
| Database | PostgreSQL on Supabase, Drizzle ORM                       |
| Login    | Supabase Auth, roles and permissions stored in our own DB |
| Shared   | TypeScript types and the compatibility rules              |
| Tests    | Vitest, Supertest                                         |

## Project layout

```
shared/   Types, constants and the compatibility rules (used by client and server)
server/   Express API. Each feature is a folder in src/modules/
client/   React app. Each feature is a folder in src/features/
docs/     API, login, deployment and design decisions
```

## Run it locally

Requires Node.js 20 or newer and a free [Supabase](https://supabase.com) project.

```bash
npm install                          # installs shared, server and client together

cp server/.env.example server/.env   # fill in DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY
cp client/.env.example client/.env   # fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

npm run db:migrate -w server         # create the tables in Supabase
npm run db:seed -w server            # add sample parts
npm run db:secure -w server          # turn on row level security (see docs/auth.md)
npm run dev                          # API on :3001, web app on :5173
```

The values for the `.env` files come from the Supabase dashboard (the **Connect** button, Session pooler,
and Project Settings, API Keys). See [docs/auth.md](docs/auth.md) for how to make the first admin.
If you change the database schema, run `npm run db:generate -w server` to create a new migration.

Other commands: `npm test`, `npm run typecheck`, `npm run build`, `npm run format`.

## Documentation

- [docs/api.md](docs/api.md): the HTTP API
- [docs/auth.md](docs/auth.md): login, roles, permissions, first admin
- [docs/deploy.md](docs/deploy.md): free hosting on Render and Supabase
- [docs/decisions.md](docs/decisions.md): why each technology and design was chosen

## Roadmap

- [x] Project skeleton and shared types
- [x] Parts database with sample data
- [x] Compatibility rules engine (14 rules, unit tested)
- [x] Parts and build-check API
- [x] Login, roles, saved builds, admin endpoints
- [x] Part picker UI: slot rail, fitting parts first, saved builds, admin page
- [x] Deployment configuration (`render.yaml`)
- [ ] Build animation: each part sliding into place
- [ ] FPS estimation for a chosen game and graphics card
