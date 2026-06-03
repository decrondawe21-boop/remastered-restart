const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');
const { loadDotEnv } = require('../server/env.cjs');

loadDotEnv();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');

(async () => {
  const schema = await fs.readFile(schemaPath, 'utf8');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  try {
    await connection.query(schema);
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`Migration completed. Tables available: ${tables.length}`);
    for (const row of tables) {
      console.log(`- ${Object.values(row)[0]}`);
    }
  } finally {
    await connection.end();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
