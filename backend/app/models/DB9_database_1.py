// src/database/postgres-indexes.ts
import { DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';

/**
 * Creates optimized indexes for PostgreSQL Booking table
 */
export async function createPostgresIndexes(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Create individual and compound indexes
    await queryRunner.query(`
      -- Index for date-based queries (common for booking systems)
      CREATE INDEX IF NOT EXISTS idx_booking_date ON booking(date);
      
      -- Index for status filtering (frequent operation)
      CREATE INDEX IF NOT EXISTS idx_booking_status ON booking(status);
      
      -- Compound index for common combined queries
      CREATE INDEX IF NOT EXISTS idx_booking_date_status ON booking(date, status);
    `);

    await queryRunner.commitTransaction();
    console.log('PostgreSQL indexes created successfully');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Failed to create PostgreSQL indexes:', error);
    throw new Error('PostgreSQL index creation failed');
  } finally {
    await queryRunner.release();
  }
}

// Example usage
(async () => {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Booking],
  });

  try {
    await AppDataSource.initialize();
    await createPostgresIndexes(AppDataSource);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
})();

/* TEST CASE:
1. Connect to a test database
2. Run the function
3. Verify indexes with:
   SELECT * FROM pg_indexes WHERE tablename = 'booking';
4. Should see the three new indexes
*/
