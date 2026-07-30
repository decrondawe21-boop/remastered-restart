const mysql = require('mysql2/promise');

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

function assertDatabaseEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

let pool;

function getPool() {
  assertDatabaseEnv();
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
      connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 4000),
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
}

const transientConnectionErrors = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
  'PROTOCOL_CONNECTION_LOST'
]);

function isReadOnlyQuery(sql) {
  return /^(?:SELECT|SHOW|DESCRIBE|EXPLAIN|WITH)\b/i.test(String(sql || '').trim());
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function query(sql, params = []) {
  const attempts = isReadOnlyQuery(sql) ? 2 : 1;
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const [rows] = await getPool().execute(sql, params);
      return rows;
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !transientConnectionErrors.has(error?.code)) throw error;

      const stalePool = pool;
      pool = undefined;
      stalePool?.end().catch(() => {});
      await wait(150 * attempt);
    }
  }

  throw lastError;
}

module.exports = { getPool, query };
