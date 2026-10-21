# Login, roles and permissions

## How it works

```
Browser ──login──► Supabase Auth ──► access token (a signed proof of who you are)
Browser ──request + "Authorization: Bearer <token>"──► our API
our API ──"is this token valid?"──► Supabase ──► user id + email
our API ──look up user id──► profiles table ──► role (user / admin)
our API ──role ► permissions──► allow (200) or refuse (401 / 403)
```

- **Supabase owns** passwords, sign-up, email confirmation and the token. We never store passwords.
- **We own** the `profiles` table: one row per person, holding their `role`. A row is created
  automatically the first time that person makes an authenticated request.
- The role is read from our database on every request, not from the token, so changing a role
  takes effect immediately.
- `401` means "we do not know who you are" (no token, bad token, expired token).
  `403` means "we know who you are, and you may not do this".

## Roles and permissions

Defined in `shared/src/auth.ts`. Routes check **permissions**, never role names.

| Role  | Permissions                         |
| ----- | ----------------------------------- |
| user  | `build:manage-own`                  |
| admin | `build:manage-own`, `user:manage`   |

To add a role: add it to `USER_ROLES` and give it a row in `ROLE_PERMISSIONS` (TypeScript fails
until you do), then create a database migration. To protect a new route, add
`auth.authorize('some:permission')` in `app.ts`.

## Setup

1. In the Supabase dashboard open **Project Settings > API** and copy the project URL and the
   `anon` / publishable key into `server/.env` as `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
   Never put the `service_role` / secret key in this project: it bypasses all security.
2. Create a test user: **Authentication > Users > Add user**, tick *Auto Confirm User*.
3. Apply the database changes and lock the tables down:

   ```bash
   npm run db:generate -w server
   npm run db:migrate -w server
   npm run db:secure -w server
   ```

   `db:secure` turns on Row Level Security for every table. Supabase also exposes tables through
   its own REST API, which anyone holding the public anon key can call; with RLS on and no
   policies that API sees nothing. Our server connects directly to Postgres and is not affected.
   Run it again after any migration that adds a table.

## Trying it without a front end

```bash
# 1. Log in and copy "access_token" from the response
curl -s "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"your-password"}'

# 2. Call our API with it (this also creates your profile)
curl -s http://localhost:3001/api/me -H "Authorization: Bearer <access_token>"
```

Tokens expire after about an hour; repeat step 1 to get a new one.

## Making the first admin

Log in once (step 2 above), then:

```bash
npm run db:make-admin -w server -- you@example.com
```

After that, admins can promote other users through `PATCH /api/admin/users/:id/role`.
An admin cannot change their own role, so the last admin cannot lock everyone out by accident.
