// Runs `work(client)` inside one transaction: COMMIT if it resolves, ROLLBACK if it throws.
// NF-005: a failed save leaves no partial data behind.
const pool = require('./pool');

async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

module.exports = withTransaction;
