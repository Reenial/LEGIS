// Database access for items. SQL only, no business rules.
// Schema: database/schema.sql
const pool = require('../../db/pool');

// Public posts come from the items_public view, which already excludes removed posts
// and hidden_detail (NF-001). Author (user_id) is deliberately not selected.
const PUBLIC_FROM = `
  FROM items_public i
  JOIN categories c ON c.id = i.category_id
  JOIN locations l ON l.id = i.location_id`;

const PUBLIC_COLUMNS = `
  i.id,
  i.type,
  i.title,
  i.description,
  i.status,
  i.date_found_lost::text AS "dateFoundLost",
  to_char(i.time_from, 'HH24:MI') AS "timeFrom",
  to_char(i.time_to, 'HH24:MI') AS "timeTo",
  i.image_url AS "imageUrl",
  i.created_at AS "createdAt",
  i.updated_at AS "updatedAt",
  json_build_object('id', c.id, 'name', c.name) AS category,
  json_build_object(
    'id', l.id,
    'name', l.name,
    'latitude', l.latitude::float8,
    'longitude', l.longitude::float8
  ) AS location,
  COALESCE((
    SELECT json_agg(json_build_object(
      'kindId', kk.id,
      'kind', kk.name,
      'keywordId', k.id,
      'value', COALESCE(k.name, ik.other_text),
      'isOther', ik.keyword_id IS NULL
    ) ORDER BY kk.id)
    FROM item_keywords ik
    JOIN keyword_kinds kk ON kk.id = ik.kind_id
    LEFT JOIN keywords k ON k.id = ik.keyword_id
    WHERE ik.item_id = i.id
  ), '[]'::json) AS keywords`;

// "black wal" -> "black:* & wal:*" so partial words match. Tokens contain only
// letters and digits, so the result is always a valid tsquery.
function toPrefixTsQuery(text) {
  const tokens = text.match(/[\p{L}\p{N}]+/gu) || [];
  return tokens.length ? tokens.map((t) => `${t.toLowerCase()}:*`).join(' & ') : null;
}

function escapeLike(text) {
  return text.replace(/[\\%_]/g, '\\$&');
}

// Builds the WHERE clause shared by the page query and the count query.
function buildWhere(filters) {
  const clauses = [];
  const params = [];
  const add = (value) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (filters.status !== 'all') clauses.push(`i.status = ${add(filters.status)}`);
  if (filters.type) clauses.push(`i.type = ${add(filters.type)}`);
  if (filters.categoryId) clauses.push(`i.category_id = ${add(filters.categoryId)}`);
  if (filters.dateFrom) clauses.push(`i.date_found_lost >= ${add(filters.dateFrom)}::date`);
  if (filters.dateTo) clauses.push(`i.date_found_lost <= ${add(filters.dateTo)}::date`);

  if (filters.bounds) {
    const { minLat, maxLat, minLng, maxLng } = filters.bounds;
    clauses.push(`l.latitude BETWEEN ${add(minLat)} AND ${add(maxLat)}`);
    clauses.push(`l.longitude BETWEEN ${add(minLng)} AND ${add(maxLng)}`);
  }

  if (filters.keywordIds.length) {
    // Post must have every selected keyword (one value per keyword kind)
    clauses.push(`(
      SELECT count(*) FROM item_keywords ik
      WHERE ik.item_id = i.id AND ik.keyword_id = ANY(${add(filters.keywordIds)}::int[])
    ) = ${add(filters.keywordIds.length)}`);
  }

  if (filters.q) {
    const like = add(`%${escapeLike(filters.q)}%`);
    const keywordMatch = `EXISTS (
      SELECT 1 FROM item_keywords ik
      LEFT JOIN keywords k ON k.id = ik.keyword_id
      WHERE ik.item_id = i.id AND (k.name ILIKE ${like} OR ik.other_text ILIKE ${like})
    )`;
    const tsQuery = toPrefixTsQuery(filters.q);
    clauses.push(tsQuery
      ? `(i.search_vector @@ to_tsquery('simple', ${add(tsQuery)}) OR ${keywordMatch})`
      : keywordMatch);
  }

  return { where: clauses.length ? `WHERE ${clauses.join('\n    AND ')}` : '', params };
}

// Returns { rows, total } for one page of public posts, newest first.
async function search(filters) {
  const { where, params } = buildWhere(filters);
  const pageParams = [...params, filters.limit, filters.offset];

  const [page, count] = await Promise.all([
    pool.query(
      `SELECT ${PUBLIC_COLUMNS}
       ${PUBLIC_FROM}
       ${where}
       ORDER BY i.created_at DESC, i.id DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      pageParams,
    ),
    pool.query(`SELECT count(*)::int AS total ${PUBLIC_FROM} ${where}`, params),
  ]);

  return { rows: page.rows, total: count.rows[0].total };
}

// TODO: SELECT from items WHERE user_id AND removed_at IS NULL
async function findByAuthor(userId) {
  throw new Error('Not implemented: itemsRepository.findByAuthor');
}

// TODO: SELECT from items_public
async function findPublicById(itemId) {
  throw new Error('Not implemented: itemsRepository.findPublicById');
}

// TODO: SELECT from items (includes hidden_detail; internal use only)
async function findById(itemId) {
  throw new Error('Not implemented: itemsRepository.findById');
}

// The author's view of one post: public columns plus hiddenDetail. Excludes removed posts.
// Only call this after checking that the caller is the author.
async function findOwnById(itemId, db = pool) {
  const result = await db.query(
    `SELECT ${PUBLIC_COLUMNS},
            i.hidden_detail AS "hiddenDetail"
     FROM items i
     JOIN categories c ON c.id = i.category_id
     JOIN locations l ON l.id = i.location_id
     WHERE i.id = $1 AND i.removed_at IS NULL`,
    [itemId],
  );
  return result.rows[0] || null;
}

async function categoryExists(categoryId, db = pool) {
  const result = await db.query('SELECT 1 FROM categories WHERE id = $1', [categoryId]);
  return result.rowCount > 0;
}

async function findAllKeywordKindIds(db = pool) {
  const result = await db.query('SELECT id FROM keyword_kinds ORDER BY id');
  return result.rows.map((row) => row.id);
}

// Returns [{ id, kindId }] for the keyword ids that exist
async function findKeywordsByIds(keywordIds, db = pool) {
  if (keywordIds.length === 0) return [];
  const result = await db.query(
    'SELECT id, kind_id AS "kindId" FROM keywords WHERE id = ANY($1::int[])',
    [keywordIds],
  );
  return result.rows;
}

// Returns the new location id
async function insertLocation(client, location) {
  const result = await client.query(
    'INSERT INTO locations (name, latitude, longitude) VALUES ($1, $2, $3) RETURNING id',
    [location.name, location.latitude, location.longitude],
  );
  return result.rows[0].id;
}

// Returns the new item id. `item` is the output of parseNewItem plus userId and locationId.
async function insert(client, item) {
  const result = await client.query(
    `INSERT INTO items (
       type, title, description, category_id, location_id, user_id,
       date_found_lost, time_from, time_to, image_url, hidden_detail
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      item.type,
      item.title,
      item.description,
      item.categoryId,
      item.locationId,
      item.userId,
      item.dateFoundLost,
      item.timeFrom,
      item.timeTo,
      item.imageUrl,
      item.hiddenDetail,
    ],
  );
  return result.rows[0].id;
}

// TODO: UPDATE items
async function update(itemId, fields) {
  throw new Error('Not implemented: itemsRepository.update');
}

// TODO: UPDATE items SET removed_at, removed_by
async function markRemoved(itemId, removedBy) {
  throw new Error('Not implemented: itemsRepository.markRemoved');
}

// Replaces all keywords of a post. keywords: [{ kindId, keywordId, otherText }]
async function replaceKeywords(client, itemId, keywords) {
  await client.query('DELETE FROM item_keywords WHERE item_id = $1', [itemId]);
  if (keywords.length === 0) return;
  await client.query(
    `INSERT INTO item_keywords (item_id, kind_id, keyword_id, other_text)
     SELECT $1, k.kind_id, k.keyword_id, k.other_text
     FROM unnest($2::int[], $3::int[], $4::text[]) AS k(kind_id, keyword_id, other_text)`,
    [
      itemId,
      keywords.map((k) => k.kindId),
      keywords.map((k) => k.keywordId),
      keywords.map((k) => k.otherText),
    ],
  );
}

module.exports = {
  buildWhere, // exported for tests
  search,
  findByAuthor,
  findPublicById,
  findById,
  findOwnById,
  categoryExists,
  findAllKeywordKindIds,
  findKeywordsByIds,
  insertLocation,
  insert,
  update,
  markRemoved,
  replaceKeywords,
};
