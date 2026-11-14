# Database

| File | What it does | Where to run it |
| --- | --- | --- |
| `schema.sql` | Tables, constraints, indexes, triggers and views | Every database |
| `seed.sql` | Categories, keyword kinds and keywords the app needs to work | Every database |
| `dev/sample-data.sql` | Two sample users and 8 sample posts | Local databases only |

All three files are safe to run again: existing data is kept and nothing is created twice.

## Setting up a database

Run from the `backend` folder, with `DATABASE_URL` set in `backend/.env` or in the shell:

```powershell
cd backend
npm install
npm run db:setup              # schema.sql + seed.sql
npm run db:setup -- --sample  # also the sample posts (refused for non-local databases)
```

The script prints how many categories, keywords, users and posts the database has afterwards.

**Local Docker:** `docker compose up` loads all three files on the first start of an empty database, so this step is not needed. To start over: `docker compose down -v`.

## Render (deployed database)

Render does not run these files by itself. Run the setup once after creating `app-db`, and again whenever `schema.sql` or `seed.sql` changes:

1. In the Render dashboard, open **app-db** > **Connect** and copy the **External Database URL**.
2. Run the setup from your computer with that URL. Do not put it in `.env` files that get committed.

   ```powershell
   cd backend
   $env:DATABASE_URL = "<External Database URL>"; npm run db:setup
   Remove-Item Env:DATABASE_URL
   ```

3. Check that the output shows `categories: 6` and `keywords: 15`.

The connection uses SSL automatically for any host that is not local. Set `DB_SSL=false` or `DB_SSL=true` to override.

## Changing the schema

`schema.sql` is written so that running it again brings an existing database up to date. After editing it, run `npm run db:setup` (locally and for Render); there is no need for `docker compose down -v`.

| Change | What to do in `schema.sql` |
| --- | --- |
| New column | Add an `ADD COLUMN IF NOT EXISTS` line to that table's `ALTER TABLE` in step 2. A `NOT NULL` column on a table that already has rows also needs a `DEFAULT`. |
| New table | `CREATE TABLE IF NOT EXISTS` with only the primary key, then its columns as `ADD COLUMN IF NOT EXISTS` (copy an existing table). |
| New or changed unique/check constraint | Step 3: `DROP CONSTRAINT IF EXISTS x, ADD CONSTRAINT x ...` |
| New foreign key | Drop it in step 1, add it in step 4 (same name in both). |
| Changed type, default or NOT NULL of an existing column | Change it in step 2 **and** add an `ALTER COLUMN` line in step 5; step 2 alone only affects new databases. |
| Remove a column | Delete its line in step 2 and add `ALTER TABLE ... DROP COLUMN IF EXISTS x;` in step 5. |
| Rename a column | Not safe to run twice: run `ALTER TABLE ... RENAME COLUMN` once by hand on each database, then update step 2. |

If a run fails (for example existing rows break a new rule), nothing from that run is saved. Fix the data or the rule and run it again.
