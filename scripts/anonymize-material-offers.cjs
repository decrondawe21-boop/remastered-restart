const { loadDotEnv } = require('../server/env.cjs');
const { getPool, query } = require('../server/db.cjs');

loadDotEnv();

(async () => {
  try {
    const expired = await query(
      `SELECT id FROM material_offers
       WHERE anonymized_at IS NULL
         AND retention_until IS NOT NULL
         AND retention_until < CURDATE()
         AND status IN ('declined', 'closed', 'received')`
    );
    for (const offer of expired) {
      await query('DELETE FROM material_offer_photos WHERE offer_id = ?', [offer.id]);
      await query(
        `UPDATE material_offers
         SET donor_name = 'Anonymizovaný dárce',
             email = NULL,
             phone = NULL,
             pickup_address = NULL,
             note = NULL,
             admin_note = NULL,
             anonymized_at = NOW()
         WHERE id = ?`,
        [offer.id]
      );
      await query(
        `INSERT INTO material_offer_events (id, offer_id, event_type, note)
         VALUES (UUID(), ?, 'anonymized', 'Automatická anonymizace po uplynutí retenční lhůty.')`,
        [offer.id]
      );
    }
    await query('DELETE FROM material_offer_rate_limits WHERE updated_at < DATE_SUB(NOW(), INTERVAL 1 DAY)');
    console.log(`Material offers anonymized: ${expired.length}`);
  } finally {
    await getPool().end();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
