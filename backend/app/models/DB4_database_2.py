// prisma/migrate.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function migrateDatabase() {
  try {
    // Run Prisma Migrate to apply pending migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Database migrations applied successfully.');
  } catch (error) {
    console.error('Error applying database migrations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateDatabase();
