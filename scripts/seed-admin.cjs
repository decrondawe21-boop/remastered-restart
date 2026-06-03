const { loadDotEnv } = require('../server/env.cjs');
const { getPool, query } = require('../server/db.cjs');
const { hashPassword, randomId } = require('../server/security.cjs');

loadDotEnv();

const required = ['ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

(async () => {
  try {
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const name = process.env.ADMIN_NAME?.trim() || 'Administrátor REST||ART';
    const rows = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    const id = rows[0]?.id || randomId();
    await query(
      `INSERT INTO users (id, role, name, email, phone, password_hash, password_algo, is_active)
       VALUES (?, 'admin', ?, ?, '', ?, 'scrypt', 1)
       ON DUPLICATE KEY UPDATE
         role = 'admin',
         name = VALUES(name),
         password_hash = VALUES(password_hash),
         password_algo = 'scrypt',
         is_active = 1`,
      [id, name, email, hashPassword(process.env.ADMIN_PASSWORD)]
    );
    console.log(`Admin account ready: ${email}`);
  } finally {
    await getPool().end();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
