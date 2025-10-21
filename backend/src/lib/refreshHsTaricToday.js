const { runQuery } = require('./db');
const { logger } = require('./logger');

async function refreshHsTaricTodayMaterializedView() {
  try {
    await runQuery('REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hs_taric_today');
    logger.info('Refreshed mv_hs_taric_today successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to refresh mv_hs_taric_today');
    throw error;
  }
}

module.exports = {
  refreshHsTaricTodayMaterializedView
};
