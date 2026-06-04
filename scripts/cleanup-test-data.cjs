const { loadDotEnv } = require('../server/env.cjs');
const { getPool } = require('../server/db.cjs');

loadDotEnv();

const apply = process.argv.includes('--apply');
const testEmailPatterns = ['%@example.test', '%@restart.test'];
const testNamePatterns = ['%Databaze %', '%Test Klient%'];

async function countRows(connection, sql, params) {
  const [rows] = await connection.execute(sql, params);
  return Number(rows[0]?.count || 0);
}

(async () => {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    const userWhere = testEmailPatterns.map(() => 'email LIKE ?').join(' OR ');
    const clientWhere = [
      ...testEmailPatterns.map(() => 'email LIKE ?'),
      ...testNamePatterns.map(() => 'CONCAT(first_name, " ", last_name) LIKE ?')
    ].join(' OR ');

    const userCount = await countRows(connection, `SELECT COUNT(*) AS count FROM users WHERE ${userWhere}`, testEmailPatterns);
    const clientCount = await countRows(connection, `SELECT COUNT(*) AS count FROM clients WHERE ${clientWhere}`, [
      ...testEmailPatterns,
      ...testNamePatterns
    ]);

    console.log(`Test users matched: ${userCount}`);
    console.log(`Test clients matched: ${clientCount}`);

    if (!apply) {
      console.log('Dry-run only. Run `npm run db:cleanup-test-data -- --apply` to delete matched test data.');
      return;
    }

    await connection.beginTransaction();
    await connection.execute(`DELETE FROM clients WHERE ${clientWhere}`, [...testEmailPatterns, ...testNamePatterns]);
    await connection.execute(`DELETE FROM users WHERE ${userWhere}`, testEmailPatterns);
    await connection.commit();
    console.log('Matched test data deleted.');
  } catch (error) {
    await connection.rollback().catch(() => undefined);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
