# API reference

Base URL in development: `http://localhost:3001`. All bodies are JSON. Every error has the shape
`{ "error": string, "details"?: unknown }`. Types live in `shared/src/api.ts`.

## GET /api/health

`200` → `{ "status": "ok", "uptimeSeconds": 12, "timestamp": "2026-10-13T..." }`

## GET /api/parts/:category

`:category` is one of `cpu`, `motherboard`, `ram`, `gpu`, `storage`, `psu`, `case`, `cooler`.

| Status | Meaning                                                      |
| ------ | ------------------------------------------------------------ |
| 200    | `{ "category": "cpu", "parts": [ ...specs ] }`, sorted by brand then name |
| 404    | Unknown category. `details.validCategories` lists the valid ones |

## POST /api/builds/check

Checks whether the selected parts work together. Send **ids only**; the server loads the specs
itself, so a client cannot lie about a part's specifications. Every field is optional because a
build can be unfinished.

```json
{
  "cpuId": "uuid",
  "motherboardId": "uuid",
  "ramId": "uuid",
  "gpuId": "uuid",
  "storageIds": ["uuid", "uuid"],
  "psuId": "uuid",
  "caseId": "uuid",
  "coolerId": "uuid"
}
```

| Status | Meaning                                                                  |
| ------ | ------------------------------------------------------------------------ |
| 200    | `{ build, report, totalPriceThb, estimatedWatts }` (see below)           |
| 400    | Body is not valid JSON, an id is not a UUID, or there is an unknown field |
| 422    | Valid request, but some ids do not exist. `details` lists `{ category, id }` |

An incompatible build is still a `200`: the request worked, and the answer is in `report`.

```json
{
  "report": {
    "ok": false,
    "issues": [
      {
        "ruleId": "cpu-motherboard-socket",
        "severity": "error",
        "message": "CPU socket AM4 does not match motherboard socket AM5.",
        "categories": ["cpu", "motherboard"]
      }
    ]
  },
  "totalPriceThb": 12100,
  "estimatedWatts": 280
}
```

`build` (omitted above) holds the full spec of every part found. `ok` is `false` only when at
least one issue has severity `error`; warnings alone keep it `true`.

---

# Endpoints that need a login

Send `Authorization: Bearer <access_token>` (see [auth.md](auth.md)). Without a valid token the
answer is `401`; with a valid token but too few permissions it is `403`.

## GET /api/me

`200` → `{ "id", "email", "role": "user" | "admin", "permissions": ["build:manage-own", ...] }`

## Saved builds (permission `build:manage-own`)

All routes touch only the logged-in user's builds. Someone else's build behaves exactly like a
build that does not exist (`404`).

| Method and path             | What it does                                         | Success |
| --------------------------- | ---------------------------------------------------- | ------- |
| `GET /api/me/builds`        | List your builds (`{ builds: [...] }`, newest edit first) | 200 |
| `POST /api/me/builds`       | Save a build                                         | 201     |
| `GET /api/me/builds/:id`    | One build with parts, report and totals              | 200     |
| `PUT /api/me/builds/:id`    | Replace its name and selection                       | 200     |
| `DELETE /api/me/builds/:id` | Delete it                                            | 204     |

Body for `POST` and `PUT`: `{ "name": "Gaming PC", "selection": { ...same ids as /api/builds/check } }`.
The name is 1-80 characters.

- An **incompatible build can be saved** (it may be a work in progress). Its compatibility report
  is recomputed every time the build is read, so it is never out of date.
- `422` if a selected part does not exist, `400` for an invalid body, `403` after 50 saved builds.
- The detail response is the `/api/builds/check` response plus `id`, `name`, `selection`,
  `createdAt`, `updatedAt` and `missingParts` (parts removed from the catalogue since saving).

## Admin (permission `user:manage`)

| Method and path                    | What it does                                   |
| ---------------------------------- | ---------------------------------------------- |
| `GET /api/admin/users`             | `{ users: [{ id, email, role, createdAt }] }`  |
| `PATCH /api/admin/users/:id/role`  | Body `{ "role": "user" \| "admin" }`; returns the user |

`400` for an invalid role or when you try to change your own role; `404` for an unknown user.
