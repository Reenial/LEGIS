-- Sample posts for LOCAL DEVELOPMENT ONLY. Do not run against the deployed database.
-- Requires schema.sql and seed.sql to be loaded first.
-- docker compose runs it automatically on the first start of an empty database;
-- otherwise: psql "$DATABASE_URL" -f database/dev/sample-data.sql
-- Safe to run twice: it does nothing if the sample users already exist.
-- Coordinates are approximate locations around FER, Zagreb.

DO $$
DECLARE
  ana   integer;
  marko integer;
  loc_fer_d     integer;
  loc_fer_food  integer;
  loc_sc        integer;
  loc_nsk       integer;
  loc_tram      integer;
  loc_jarun     integer;
  loc_parking   integer;
  item_id integer;
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE identity_provider = 'sample') THEN
    RAISE NOTICE 'Sample data already loaded, skipping';
    RETURN;
  END IF;

  INSERT INTO users (name, email, identity_provider, provider_user_id)
  VALUES ('Ana (sample)', 'ana.sample@example.com', 'sample', 'sample-1')
  RETURNING id INTO ana;

  INSERT INTO users (name, email, identity_provider, provider_user_id)
  VALUES ('Marko (sample)', 'marko.sample@example.com', 'sample', 'sample-2')
  RETURNING id INTO marko;

  INSERT INTO locations (name, latitude, longitude) VALUES ('FER, building D', 45.801100, 15.970900) RETURNING id INTO loc_fer_d;
  INSERT INTO locations (name, latitude, longitude) VALUES ('FER student restaurant', 45.800700, 15.971600) RETURNING id INTO loc_fer_food;
  INSERT INTO locations (name, latitude, longitude) VALUES ('Studentski centar, Savska 25', 45.804300, 15.965800) RETURNING id INTO loc_sc;
  INSERT INTO locations (name, latitude, longitude) VALUES ('National and University Library', 45.795800, 15.977300) RETURNING id INTO loc_nsk;
  INSERT INTO locations (name, latitude, longitude) VALUES ('Tram stop Vjesnik', 45.799600, 15.967800) RETURNING id INTO loc_tram;
  INSERT INTO locations (name, latitude, longitude) VALUES ('Jarun lake', 45.783500, 15.922000) RETURNING id INTO loc_jarun;
  INSERT INTO locations (name, latitude, longitude) VALUES ('FER parking', 45.801600, 15.972400) RETURNING id INTO loc_parking;

  -- 1. Found headphones (with hidden detail)
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost,
                     time_from, time_to, hidden_detail, created_at)
  VALUES ('Black headphones found in lecture hall D1',
          'Over-ear headphones left on a desk after the morning lecture.',
          'found', (SELECT id FROM categories WHERE name = 'Electronics'), loc_fer_d, ana,
          current_date - 2, '10:00', '12:00', 'Scratch on the left ear cup',
          now() - interval '2 days')
  RETURNING id INTO item_id;
  INSERT INTO item_keywords (item_id, kind_id, keyword_id)
  SELECT item_id, k.kind_id, k.id FROM keywords k
  JOIN keyword_kinds kk ON kk.id = k.kind_id
  WHERE (kk.name, k.name) IN (('item_type', 'headphones'), ('color', 'black'));

  -- 2. Lost wallet
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost, created_at)
  VALUES ('Lost brown wallet',
          'Leather wallet, probably lost in the queue at the student centre.',
          'lost', (SELECT id FROM categories WHERE name = 'Wallets and bags'), loc_sc, marko,
          current_date - 3, now() - interval '3 days')
  RETURNING id INTO item_id;
  INSERT INTO item_keywords (item_id, kind_id, keyword_id)
  SELECT item_id, k.kind_id, k.id FROM keywords k
  JOIN keyword_kinds kk ON kk.id = k.kind_id
  WHERE (kk.name, k.name) IN (('item_type', 'wallet'), ('color', 'brown'));

  -- 3. Found student ID card
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost,
                     hidden_detail, created_at)
  VALUES ('Student ID card found near the library',
          'Found on the stairs at the library entrance.',
          'found', (SELECT id FROM categories WHERE name = 'Documents and cards'), loc_nsk, marko,
          current_date - 1, 'Name starts with the letter M', now() - interval '1 day')
  RETURNING id INTO item_id;
  INSERT INTO item_keywords (item_id, kind_id, keyword_id)
  SELECT item_id, k.kind_id, k.id FROM keywords k
  JOIN keyword_kinds kk ON kk.id = k.kind_id
  WHERE (kk.name, k.name) IN (('item_type', 'student ID card'), ('color', 'blue'));

  -- 4. Lost keys
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost,
                     time_from, created_at)
  VALUES ('Keys with a red keychain',
          'Three keys on a ring with a red rubber keychain.',
          'lost', (SELECT id FROM categories WHERE name = 'Keys'), loc_tram, ana,
          current_date, '08:30', now() - interval '5 hours')
  RETURNING id INTO item_id;
  INSERT INTO item_keywords (item_id, kind_id, keyword_id)
  SELECT item_id, k.kind_id, k.id FROM keywords k
  JOIN keyword_kinds kk ON kk.id = k.kind_id
  WHERE (kk.name, k.name) IN (('item_type', 'keys'), ('color', 'red'));

  -- 5. Found jacket
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost,
                     hidden_detail, created_at)
  VALUES ('Grey jacket left in the cafeteria',
          'Hooded jacket left on a chair at lunchtime.',
          'found', (SELECT id FROM categories WHERE name = 'Clothing and accessories'), loc_fer_food, marko,
          current_date - 4, 'Size M, something in the left pocket', now() - interval '4 days')
  RETURNING id INTO item_id;
  INSERT INTO item_keywords (item_id, kind_id, keyword_id)
  SELECT item_id, k.kind_id, k.id FROM keywords k
  JOIN keyword_kinds kk ON kk.id = k.kind_id
  WHERE (kk.name, k.name) IN (('item_type', 'jacket'), ('color', 'grey'));

  -- 6. Lost phone outside the FER area, colour entered under "Other"
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost, created_at)
  VALUES ('Phone in a mint green case',
          'Lost during a walk around the lake on Sunday afternoon.',
          'lost', (SELECT id FROM categories WHERE name = 'Electronics'), loc_jarun, ana,
          current_date - 6, now() - interval '6 days')
  RETURNING id INTO item_id;
  INSERT INTO item_keywords (item_id, kind_id, keyword_id)
  SELECT item_id, k.kind_id, k.id FROM keywords k
  JOIN keyword_kinds kk ON kk.id = k.kind_id
  WHERE (kk.name, k.name) = ('item_type', 'phone');
  INSERT INTO item_keywords (item_id, kind_id, other_text)
  SELECT item_id, id, 'mint green' FROM keyword_kinds WHERE name = 'color';

  -- 7. Already handed over: hidden from the default list (status filter)
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost,
                     status, created_at)
  VALUES ('Car keys found in the parking lot',
          'Returned to the owner.',
          'found', (SELECT id FROM categories WHERE name = 'Keys'), loc_parking, marko,
          current_date - 8, 'handed_over', now() - interval '8 days')
  RETURNING id INTO item_id;
  INSERT INTO item_keywords (item_id, kind_id, keyword_id)
  SELECT item_id, k.kind_id, k.id FROM keywords k
  JOIN keyword_kinds kk ON kk.id = k.kind_id
  WHERE (kk.name, k.name) = ('item_type', 'keys');

  -- 8. Removed post: must never appear publicly
  INSERT INTO items (title, description, type, category_id, location_id, user_id, date_found_lost,
                     removed_at, removed_by, created_at)
  VALUES ('Removed sample post',
          'This post was removed and must not appear in any public list.',
          'found', (SELECT id FROM categories WHERE name = 'Other'), loc_fer_d, ana,
          current_date - 1, now(), ana, now() - interval '1 hour');

  RAISE NOTICE 'Sample data loaded';
END $$;
