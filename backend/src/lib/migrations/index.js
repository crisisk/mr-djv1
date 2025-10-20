const path = require('node:path');
const knex = require('knex');
const config = require('../../config');
const { logger } = require('../logger');

function buildClient() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  return knex({
    client: 'pg',
    connection: config.databaseUrl,
    migrations: {
      directory: path.join(__dirname, 'versions'),
      tableName: 'knex_migrations'
    },
    pool: {
      min: 0,
      max: 5
    }
  });
}

async function migrateToLatest() {
  const client = buildClient();

  try {
    const [batch, log] = await client.migrate.latest();

    if (log.length) {
      logger.info({ batch, migrations: log }, 'Database migrations executed');
    } else {
      logger.debug('Database schema already up to date');
    }
  } catch (error) {
    logger.error({ err: error }, 'Database migration failed');
    throw error;
  } finally {
    await client.destroy();
  }
}

module.exports = {
  migrateToLatest
};
