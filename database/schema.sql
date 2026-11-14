-- Lost & Found database schema (PostgreSQL 15+).
-- Safe to run again on an existing database: data is kept and nothing is created twice.
-- Run it with: cd backend && npm run db:setup   (see database/README.md)
--
-- How the file is laid out, so that changes reach databases that already exist:
--   1. Foreign keys and views are dropped (re-created in steps 4 and 6).
--   2. Each table is created with only its primary key; every other column is added with
--      ADD COLUMN IF NOT EXISTS. To add a column, add one line to its table's ALTER TABLE.
--   3. Unique and check constraints are dropped and re-added, so edits to them apply.
--   4. Foreign keys are added again.
--   5. Changes to existing columns (type, default, NULL) go in step 5 as ALTER COLUMN.
--   6. Indexes, triggers and views.
-- If anything fails (for example existing rows break a new rule), the whole run is
-- rolled back and the database stays as it was.

BEGIN;

-- 1. Drop foreign keys and views ------------------------------------------------------

ALTER TABLE IF EXISTS public.items
    DROP CONSTRAINT IF EXISTS items_user_id_fkey,
    DROP CONSTRAINT IF EXISTS items_category_id_fkey,
    DROP CONSTRAINT IF EXISTS items_location_id_fkey,
    DROP CONSTRAINT IF EXISTS items_removed_by_fkey;

ALTER TABLE IF EXISTS public.keywords
    DROP CONSTRAINT IF EXISTS keywords_kind_id_fkey;

ALTER TABLE IF EXISTS public.item_keywords
    DROP CONSTRAINT IF EXISTS item_keywords_item_id_fkey,
    DROP CONSTRAINT IF EXISTS item_keywords_kind_id_fkey,
    DROP CONSTRAINT IF EXISTS item_keywords_keyword_id_kind_id_fkey;

ALTER TABLE IF EXISTS public.claims
    DROP CONSTRAINT IF EXISTS claims_item_id_fkey,
    DROP CONSTRAINT IF EXISTS claims_user_id_fkey;

ALTER TABLE IF EXISTS public.messages
    DROP CONSTRAINT IF EXISTS messages_claim_id_fkey,
    DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE IF EXISTS public.post_reports
    DROP CONSTRAINT IF EXISTS post_reports_item_id_fkey,
    DROP CONSTRAINT IF EXISTS post_reports_reporter_id_fkey,
    DROP CONSTRAINT IF EXISTS post_reports_reviewed_by_fkey;

ALTER TABLE IF EXISTS public.notifications
    DROP CONSTRAINT IF EXISTS notifications_user_id_fkey,
    DROP CONSTRAINT IF EXISTS notifications_lost_item_id_fkey,
    DROP CONSTRAINT IF EXISTS notifications_found_item_id_fkey;

-- Views depend on items columns; dropping them lets step 5 change those columns.
DROP VIEW IF EXISTS public.item_match_scores;
DROP VIEW IF EXISTS public.items_public;

-- 2. Tables and columns ---------------------------------------------------------------
-- A NOT NULL column added to a table that already has rows needs a DEFAULT,
-- otherwise the run fails for that database.

CREATE TABLE IF NOT EXISTS public.users (id serial PRIMARY KEY);
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS name character varying(100) NOT NULL,
    ADD COLUMN IF NOT EXISTS email text,
    ADD COLUMN IF NOT EXISTS identity_provider text NOT NULL,
    ADD COLUMN IF NOT EXISTS provider_user_id text NOT NULL,
    ADD COLUMN IF NOT EXISTS role character varying NOT NULL DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS match_notifications_enabled boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.categories (id serial PRIMARY KEY);
ALTER TABLE public.categories
    ADD COLUMN IF NOT EXISTS name character varying(50) NOT NULL;

CREATE TABLE IF NOT EXISTS public.locations (id serial PRIMARY KEY);
ALTER TABLE public.locations
    ADD COLUMN IF NOT EXISTS name character varying(100),
    ADD COLUMN IF NOT EXISTS latitude numeric(9, 6) NOT NULL,
    ADD COLUMN IF NOT EXISTS longitude numeric(9, 6) NOT NULL;

CREATE TABLE IF NOT EXISTS public.keyword_kinds (id serial PRIMARY KEY);
ALTER TABLE public.keyword_kinds
    ADD COLUMN IF NOT EXISTS name character varying(50) NOT NULL,
    ADD COLUMN IF NOT EXISTS match_points integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.keywords (id serial PRIMARY KEY);
ALTER TABLE public.keywords
    ADD COLUMN IF NOT EXISTS kind_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS name character varying(50) NOT NULL;

CREATE TABLE IF NOT EXISTS public.items (id serial PRIMARY KEY);
ALTER TABLE public.items
    ADD COLUMN IF NOT EXISTS title character varying(100) NOT NULL,
    ADD COLUMN IF NOT EXISTS description text NOT NULL,
    ADD COLUMN IF NOT EXISTS type character varying(20) NOT NULL,
    ADD COLUMN IF NOT EXISTS category_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS location_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS user_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS date_found_lost date NOT NULL,
    ADD COLUMN IF NOT EXISTS image_url text,
    ADD COLUMN IF NOT EXISTS hidden_detail text,
    ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS status character varying(20) NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS time_from time without time zone,
    ADD COLUMN IF NOT EXISTS time_to time without time zone,
    ADD COLUMN IF NOT EXISTS removed_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS removed_by integer,
    -- Full-text search over title and description (GET /api/items?q=)
    ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
    ) STORED;

CREATE TABLE IF NOT EXISTS public.item_keywords (
    item_id integer NOT NULL,
    kind_id integer NOT NULL,
    PRIMARY KEY (item_id, kind_id)
);
ALTER TABLE public.item_keywords
    ADD COLUMN IF NOT EXISTS keyword_id integer,
    ADD COLUMN IF NOT EXISTS other_text character varying(100);

CREATE TABLE IF NOT EXISTS public.claims (id serial PRIMARY KEY);
ALTER TABLE public.claims
    ADD COLUMN IF NOT EXISTS item_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS user_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS message text NOT NULL,
    ADD COLUMN IF NOT EXISTS status character varying(20) NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS decided_at timestamp with time zone;

CREATE TABLE IF NOT EXISTS public.messages (id serial PRIMARY KEY);
ALTER TABLE public.messages
    ADD COLUMN IF NOT EXISTS claim_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS sender_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS message text NOT NULL,
    ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.post_reports (id serial PRIMARY KEY);
ALTER TABLE public.post_reports
    ADD COLUMN IF NOT EXISTS item_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS reporter_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS reason text NOT NULL,
    ADD COLUMN IF NOT EXISTS status character varying(20) NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS reviewed_by integer,
    ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.notifications (
    id serial,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS user_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS lost_item_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS found_item_id integer NOT NULL,
    ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

-- Server sessions (connect-pg-simple, backend/src/config/session.js)
CREATE TABLE IF NOT EXISTS public.session (
    sid character varying NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
);
ALTER TABLE public.session
    ADD COLUMN IF NOT EXISTS sess json NOT NULL,
    ADD COLUMN IF NOT EXISTS expire timestamp(6) without time zone NOT NULL;

-- 3. Unique and check constraints -----------------------------------------------------

ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_identity_unique,
    ADD CONSTRAINT users_identity_unique UNIQUE (identity_provider, provider_user_id),
    -- Allowed user roles
    DROP CONSTRAINT IF EXISTS users_role_check,
    ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

ALTER TABLE public.categories
    DROP CONSTRAINT IF EXISTS categories_name_unique,
    ADD CONSTRAINT categories_name_unique UNIQUE (name);

-- Valid geographical coordinates
ALTER TABLE public.locations
    DROP CONSTRAINT IF EXISTS locations_latitude_check,
    ADD CONSTRAINT locations_latitude_check CHECK (latitude BETWEEN -90 AND 90),
    DROP CONSTRAINT IF EXISTS locations_longitude_check,
    ADD CONSTRAINT locations_longitude_check CHECK (longitude BETWEEN -180 AND 180);

ALTER TABLE public.keyword_kinds
    DROP CONSTRAINT IF EXISTS keyword_kinds_name_unique,
    ADD CONSTRAINT keyword_kinds_name_unique UNIQUE (name),
    DROP CONSTRAINT IF EXISTS keyword_kinds_points_check,
    ADD CONSTRAINT keyword_kinds_points_check CHECK (match_points >= 0);

ALTER TABLE public.keywords
    DROP CONSTRAINT IF EXISTS keywords_kind_name_unique,
    ADD CONSTRAINT keywords_kind_name_unique UNIQUE (kind_id, name),
    -- Target of the item_keywords (keyword_id, kind_id) foreign key
    DROP CONSTRAINT IF EXISTS keywords_id_kind_unique,
    ADD CONSTRAINT keywords_id_kind_unique UNIQUE (id, kind_id);

ALTER TABLE public.items
    -- Allowed post types and statuses
    DROP CONSTRAINT IF EXISTS items_type_check,
    ADD CONSTRAINT items_type_check CHECK (type IN ('lost', 'found')),
    DROP CONSTRAINT IF EXISTS items_status_check,
    ADD CONSTRAINT items_status_check CHECK (status IN ('pending', 'handed_over')),
    DROP CONSTRAINT IF EXISTS items_time_window_check,
    ADD CONSTRAINT items_time_window_check CHECK (time_to IS NULL OR time_from IS NOT NULL),
    DROP CONSTRAINT IF EXISTS items_removed_by_check,
    ADD CONSTRAINT items_removed_by_check CHECK (removed_by IS NULL OR removed_at IS NOT NULL);

ALTER TABLE public.item_keywords
    -- Either a suggested keyword or "Other" text, never both
    DROP CONSTRAINT IF EXISTS item_keywords_one_value_check,
    ADD CONSTRAINT item_keywords_one_value_check CHECK ((keyword_id IS NULL) <> (other_text IS NULL)),
    DROP CONSTRAINT IF EXISTS item_keywords_other_not_blank_check,
    ADD CONSTRAINT item_keywords_other_not_blank_check CHECK (other_text IS NULL OR btrim(other_text) <> '');

-- Allowed return request statuses
ALTER TABLE public.claims
    DROP CONSTRAINT IF EXISTS claims_status_check,
    ADD CONSTRAINT claims_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    DROP CONSTRAINT IF EXISTS claims_decided_at_check,
    ADD CONSTRAINT claims_decided_at_check CHECK ((status IN ('accepted', 'rejected')) = (decided_at IS NOT NULL));

-- Allowed moderation statuses
ALTER TABLE public.post_reports
    DROP CONSTRAINT IF EXISTS post_reports_status_check,
    ADD CONSTRAINT post_reports_status_check CHECK (status IN ('pending', 'dismissed', 'removed'));

ALTER TABLE public.notifications
    DROP CONSTRAINT IF EXISTS notifications_match_unique,
    ADD CONSTRAINT notifications_match_unique UNIQUE (user_id, lost_item_id, found_item_id),
    -- Lost and found posts must be different
    DROP CONSTRAINT IF EXISTS notifications_different_items_check,
    ADD CONSTRAINT notifications_different_items_check CHECK (lost_item_id != found_item_id);

-- 4. Foreign keys ---------------------------------------------------------------------

ALTER TABLE public.items
    ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id),
    ADD CONSTRAINT items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories (id),
    ADD CONSTRAINT items_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations (id),
    ADD CONSTRAINT items_removed_by_fkey FOREIGN KEY (removed_by) REFERENCES public.users (id);

ALTER TABLE public.keywords
    ADD CONSTRAINT keywords_kind_id_fkey FOREIGN KEY (kind_id) REFERENCES public.keyword_kinds (id);

ALTER TABLE public.item_keywords
    ADD CONSTRAINT item_keywords_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items (id) ON DELETE CASCADE,
    ADD CONSTRAINT item_keywords_kind_id_fkey FOREIGN KEY (kind_id) REFERENCES public.keyword_kinds (id),
    -- The keyword must belong to the same kind; skipped when keyword_id is NULL ("Other")
    ADD CONSTRAINT item_keywords_keyword_id_kind_id_fkey FOREIGN KEY (keyword_id, kind_id)
        REFERENCES public.keywords (id, kind_id);

ALTER TABLE public.claims
    ADD CONSTRAINT claims_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items (id),
    ADD CONSTRAINT claims_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE public.messages
    ADD CONSTRAINT messages_claim_id_fkey FOREIGN KEY (claim_id) REFERENCES public.claims (id),
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users (id);

ALTER TABLE public.post_reports
    ADD CONSTRAINT post_reports_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items (id),
    ADD CONSTRAINT post_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users (id),
    ADD CONSTRAINT post_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users (id);

ALTER TABLE public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id),
    ADD CONSTRAINT notifications_lost_item_id_fkey FOREIGN KEY (lost_item_id) REFERENCES public.items (id),
    ADD CONSTRAINT notifications_found_item_id_fkey FOREIGN KEY (found_item_id) REFERENCES public.items (id);

-- 5. Changes to existing columns ------------------------------------------------------
-- ADD COLUMN IF NOT EXISTS skips columns that already exist, so a changed type, default
-- or NOT NULL in step 2 does not reach existing databases by itself. Change the column
-- in step 2 (for new databases) AND add a line here (for existing ones), for example:
--
--   ALTER TABLE public.items ALTER COLUMN image_url SET DEFAULT NULL;
--   ALTER TABLE public.locations ALTER COLUMN name TYPE character varying(150);
--   ALTER TABLE public.users ALTER COLUMN email SET NOT NULL;   -- fails while a row has NULL
--
-- These lines are safe to leave in: running them again changes nothing.
-- items.title and items.description are used by search_vector, so changing their type
-- also needs search_vector dropped and added again.

-- 6. Indexes, triggers and views ------------------------------------------------------

-- One open (pending or accepted) request per user and post
CREATE UNIQUE INDEX IF NOT EXISTS claims_one_open_per_user
    ON public.claims (item_id, user_id)
    WHERE status IN ('pending', 'accepted');

-- At most one accepted request per post
CREATE UNIQUE INDEX IF NOT EXISTS claims_one_accepted
    ON public.claims (item_id)
    WHERE status = 'accepted';

CREATE INDEX IF NOT EXISTS item_keywords_keyword_idx ON public.item_keywords (keyword_id);
CREATE INDEX IF NOT EXISTS items_search_idx ON public.items USING gin (search_vector);
CREATE INDEX IF NOT EXISTS session_expire_idx ON public.session (expire);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER users_set_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER items_set_updated_at
    BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Use for public endpoints: hides hidden_detail and removed posts
CREATE VIEW public.items_public AS
SELECT id, title, description, type, category_id, location_id, user_id,
       date_found_lost, time_from, time_to, image_url, status,
       created_at, updated_at, search_vector
FROM public.items
WHERE removed_at IS NULL;

-- Keyword score per lost/found pair; add other points in the query
CREATE VIEW public.item_match_scores AS
SELECT lost.id AS lost_item_id,
       found.id AS found_item_id,
       SUM(kk.match_points) AS score
FROM public.items lost
JOIN public.items found
  ON found.type = 'found' AND found.user_id <> lost.user_id
JOIN public.item_keywords lk ON lk.item_id = lost.id
JOIN public.item_keywords fk
  ON fk.item_id = found.id
 AND fk.kind_id = lk.kind_id
 AND (fk.keyword_id = lk.keyword_id
      OR lower(btrim(fk.other_text)) = lower(btrim(lk.other_text)))
JOIN public.keyword_kinds kk ON kk.id = lk.kind_id
WHERE lost.type = 'lost'
  AND lost.status = 'pending' AND lost.removed_at IS NULL
  AND found.status = 'pending' AND found.removed_at IS NULL
GROUP BY lost.id, found.id
HAVING SUM(kk.match_points) > 0;

COMMIT;
