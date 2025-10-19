// tests/migration.test.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

describe('Database Migrations', () => {
  beforeAll(async () => {
    // Ensure the database is clean before running tests
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Bookings";`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "DJs";`;
  });

  it('should apply migrations successfully', async () => {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Verify that tables were created
    const djsTableExists = await prisma.$queryRaw`SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'DJs');`;
    const bookingsTableExists = await prisma.$queryRaw`SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'Bookings');`;

    expect(djsTableExists[0].exists).toBe(true);
    expect(bookingsTableExists[0].exists).toBe(true);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
