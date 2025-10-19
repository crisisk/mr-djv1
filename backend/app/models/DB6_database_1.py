// scripts/dbBackup.test.ts
import { DatabaseBackup } from './dbBackup';
import fs from 'fs';
import path from 'path';

// Mock config for testing
const testConfig = {
  dbHost: 'localhost',
  dbPort: 5432,
  dbName: 'test_db',
  dbUser: 'test_user',
  dbPassword: 'test_password',
  backupDir: './test_backups',
  maxBackups: 2,
  compressBackups: false
};

describe('DatabaseBackup', () => {
  let backup: DatabaseBackup;

  beforeAll(() => {
    // Ensure test directory exists
    if (!fs.existsSync(testConfig.backupDir)) {
      fs.mkdirSync(testConfig.backupDir, { recursive: true });
    }
    backup = new DatabaseBackup(testConfig);
  });

  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(testConfig.backupDir)) {
      fs.rmdirSync(testConfig.backupDir, { recursive: true });
    }
  });

  test('should validate config correctly', () => {
    expect(() => new DatabaseBackup({ ...testConfig, maxBackups: 0 }))
      .toThrow('maxBackups must be at least 1');
  });

  test('should generate proper backup filename', () => {
    const filename = backup['generateBackupFilename']();
    expect(filename).toMatch(/^backup_test_db_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.sql$/);
  });

  test('should build correct pg_dump command', () => {
    const command = backup['buildPgDumpCommand']('test.sql');
    expect(command).toContain('PGPASSWORD=test_password pg_dump');
    expect(command).toContain('-h localhost -p 5432 -U test_user -d test_db');
    expect(command).toContain('> ./test_backups/test.sql');
  });
});
