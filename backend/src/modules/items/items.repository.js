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

// "crna nov" -> "crna:* & nov:*" so partial words match. Tokens contain only
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

// TODO: INSERT into items
async function insert(client, item) {
  throw new Error('Not implemented: itemsRepository.insert');
}

// TODO: UPDATE items
async function update(itemId, fields) {
  throw new Error('Not implemented: itemsRepository.update');
}

// TODO: UPDATE items SET removed_at, removed_by
async function markRemoved(itemId, removedBy) {
  throw new Error('Not implemented: itemsRepository.markRemoved');
}

// TODO: DELETE + INSERT item_keywords
async function replaceKeywords(client, itemId, keywords) {
  throw new Error('Not implemented: itemsRepository.replaceKeywords');
}

module.exports = {
  buildWhere, // exported for tests
  search,
  findByAuthor,
  findPublicById,
  findById,
  insert,
  update,
  markRemoved,
  replaceKeywords,
};
