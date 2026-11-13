# Lost & Found API

Base URL: `/api` on the frontend's own origin. The Vite dev server (`npm run dev`) and nginx (Docker, Render) proxy it to the backend, so the session cookie is first-party. The backend itself listens on `http://localhost:10000/api` locally.

## Sign-in (UC-003)

| Route | Body | Response |
| --- | --- | --- |
| `POST /api/auth/google` | `{ "idToken": "<credential from Google Identity Services>" }` | `200 { id, name, role }` and the `lf.sid` session cookie. `400` without `idToken`, `401` for an invalid token. |
| `GET /api/auth/me` | | `200 { id, name, role }`, or `401` when not signed in. |
| `POST /api/auth/logout` | | `204`, or `401` when not signed in. |

The session id is regenerated on every sign-in.
Errors always have the shape `{ "error": "message", "details": { ... } }`.
Endpoints not listed here still return `501 Not implemented`.

## GET /api/items — public post list (UC-001, F-001)

No sign-in needed. Returns public posts, newest first. Hidden details, authors and removed posts are never included.

From the frontend: `items.list(filters)` in `frontend/src/api/endpoints.js`. Empty values are ignored, so the whole filter form can be passed as-is.

### Query parameters (all optional)

| Parameter | Example | Meaning |
| --- | --- | --- |
| `q` | `black wallet` | Text search. Matches the start of words in the title and description (`headph` finds "headphones"), keyword names and "Other" text. Max 100 characters. |
| `type` | `lost` | `lost` or `found` |
| `categoryId` | `3` | Category id (from `GET /api/categories`) |
| `keywordIds` | `6,12` | Keyword ids, comma-separated or repeated. A post must have **all** of them. |
| `dateFrom`, `dateTo` | `2026-11-01` | Date the item was lost or found, inclusive, `YYYY-MM-DD` |
| `minLat`, `maxLat`, `minLng`, `maxLng` | `45.79` … | Visible map area. Send all four or none. With Leaflet: `map.getBounds()` → `getSouth()`, `getNorth()`, `getWest()`, `getEast()`. |
| `status` | `all` | `pending` (default), `handed_over` or `all` |
| `limit` | `20` | Page size, 1–100, default 20 |
| `offset` | `40` | Number of posts to skip, default 0 |

### Response `200`

```json
{
  "items": [
    {
      "id": 4,
      "type": "lost",
      "title": "Keys with a red keychain",
      "description": "Three keys on a ring with a red rubber keychain.",
      "status": "pending",
      "dateFoundLost": "2026-11-04",
      "timeFrom": "08:30",
      "timeTo": null,
      "imageUrl": null,
      "createdAt": "2026-11-04T16:23:39.737Z",
      "updatedAt": "2026-11-04T21:23:39.737Z",
      "category": { "id": 3, "name": "Keys" },
      "location": { "id": 5, "name": "Tram stop Vjesnik", "latitude": 45.7996, "longitude": 15.9678 },
      "keywords": [
        { "kindId": 1, "kind": "item_type", "keywordId": 6, "value": "keys", "isOther": false },
        { "kindId": 2, "kind": "color", "keywordId": 12, "value": "red", "isOther": false }
      ]
    }
  ],
  "total": 6,
  "limit": 20,
  "offset": 0
}
```

- `total` is the number of posts matching the filters across all pages. There are more pages while `offset + items.length < total`.
- `dateFoundLost` is a plain date (no time zone). `timeFrom`/`timeTo` are `HH:MM` or `null`.
- A keyword typed under "Other" has `keywordId: null`, `isOther: true` and the typed text in `value`.
- `imageUrl` is always `null` until photo upload exists.
- No results: `200` with `items: []` and `total: 0`. Show a message and keep the filters (UC-001).

### Response `400`

Any invalid parameter. `details` names each one:

```json
{
  "error": "Invalid query parameters",
  "details": {
    "type": "One of: lost, found",
    "bounds": "Provide all of minLat, maxLat, minLng, maxLng or none"
  }
}
```

## GET /api/categories — categories (UC-001, F-001)

No sign-in needed. From the frontend: `lookups.categories()`.

```json
[
  { "id": 1, "name": "Electronics" },
  { "id": 3, "name": "Keys" }
]
```

## GET /api/keywords — keyword kinds with their keywords (UC-001, UC-004)

No sign-in needed. From the frontend: `lookups.keywords()`. Use these ids for `keywordIds` and when saving a post; never hard-code them, because the ids depend on insert order in the database.

```json
[
  {
    "id": 1,
    "name": "item_type",
    "keywords": [
      { "id": 6, "name": "keys" },
      { "id": 7, "name": "wallet" }
    ]
  },
  {
    "id": 2,
    "name": "color",
    "keywords": [
      { "id": 12, "name": "red" }
    ]
  }
]
```

## POST /api/items — publish a post (UC-004) — agreed contract, not built yet

Signed-in users only. JSON body in camelCase, the same names the API returns. The frontend already builds this body in `frontend/src/pages/itemForm.js`.

A photo is uploaded first with `POST /api/uploads/photo` (multipart, field `photo`), which returns `{ "url": "..." }`. That URL goes into `imageUrl`. Without a photo, `imageUrl` is `null`.

```json
{
  "type": "lost",
  "title": "Black wallet",
  "description": "Leather wallet with a zip.",
  "categoryId": 4,
  "dateFoundLost": "2026-11-08",
  "timeFrom": "08:30",
  "timeTo": null,
  "hiddenDetail": "Initials on the inside",
  "imageUrl": null,
  "location": { "name": "FER, building D", "latitude": 45.8011, "longitude": 15.9709 },
  "keywords": [
    { "kindId": 1, "keywordId": 7, "otherText": null },
    { "kindId": 2, "keywordId": null, "otherText": "dark navy" }
  ]
}
```

- `timeFrom`, `timeTo`, `hiddenDetail`, `imageUrl` and `location.name` are optional (`null`).
- One entry in `keywords` per keyword kind: either `keywordId` (from `GET /api/keywords`) or `otherText`, never both.
- `location.latitude` and `location.longitude` are required by the database. Until the map picker exists the form can send `null`, and the backend must answer `400`.
- Response `201`: the created post in the same shape as one entry of `GET /api/items`, plus `hiddenDetail`.
- `PATCH /api/items/:itemId` (UC-005) takes the same fields; only the ones sent are changed.

## Sample data for local development

`database/dev/sample-data.sql` adds two sample users and 8 posts around FER: 6 visible by default, 1 handed over (shown with `status=all`) and 1 removed (never shown). `docker compose up` loads it automatically into a new database. To reload it from scratch, run `docker compose down -v` and start again.

## Tests

`npm test` runs the unit tests. The database tests are skipped unless you point them at a database that has the sample data loaded:

```powershell
$env:TEST_DATABASE_URL = "postgres://dbuser:password@localhost:5432/appdb"; npm test
```
