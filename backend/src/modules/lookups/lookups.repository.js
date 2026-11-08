// Database access for lookups. SQL only, no business rules.
// Schema: database/schema.sql
const pool = require('../../db/pool');

async function findAllCategories() {
  const result = await pool.query('SELECT id, name FROM categories ORDER BY id');
  return result.rows;
}

// One row per keyword kind with its predefined keywords nested, ordered by id.
async function findAllKeywords() {
  const result = await pool.query(`
    SELECT kk.id,
           kk.name,
           COALESCE(
             json_agg(json_build_object('id', k.id, 'name', k.name) ORDER BY k.id)
               FILTER (WHERE k.id IS NOT NULL),
             '[]'::json
           ) AS keywords
    FROM keyword_kinds kk
    LEFT JOIN keywords k ON k.kind_id = kk.id
    GROUP BY kk.id, kk.name
    ORDER BY kk.id`);
  return result.rows;
}

module.exports = {
  findAllCategories,
  findAllKeywords,
};
