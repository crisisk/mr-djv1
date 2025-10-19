// scripts/dbBackup.ts
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { format } from 'date-fns';

const execAsync = promisify(exec);

interface BackupConfig {
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  backupDir: string;
  maxBackups: number;
  compressBackups: boolean;
}

class DatabaseBackup {
  private config: BackupConfig;

  constructor(config: BackupConfig) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!fs.existsSync(this.config.backupDir)) {
      fs.mkdirSync(this.config.backupDir, { recursive: true });
    }

    if (this.config.maxBackups < 1) {
      throw new Error('maxBackups must be at least 1');
    }
  }

  /**
   * Generates a filename for the backup based on current timestamp
   */
  private generateBackupFilename(): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const ext = this.config.compressBackups ? 'sql.gz' : 'sql';
    return `backup_${this.config.dbName}_${timestamp}.${ext}`;
  }

  /**
   * Builds the pg_dump command based on configuration
   */
  private buildPgDumpCommand(filename: string): string {
    const { dbHost, dbPort, dbName, dbUser, dbPassword } = this.config;
    const outputPath = path.join(this.config.backupDir, filename);

    // Environment variables for pg_dump
    const envVars = `PGPASSWORD=${dbPassword}`;

    // Base command
    let command = `${envVars} pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName}`;

    // Add compression if enabled
    if (this.config.compressBackups) {
      command += ' | gzip';
    }

    // Add output redirection
    command += ` > ${outputPath}`;

    return command;
  }

  /**
   * Rotates old backups to maintain only maxBackups copies
   */
  private async rotateBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.config.backupDir)
        .filter(file => file.startsWith(`backup_${this.config.dbName}_`))
        .sort()
        .reverse();

      if (files.length > this.config.maxBackups) {
        const filesToDelete = files.slice(this.config.maxBackups);
        
        for (const file of filesToDelete) {
          const filePath = path.join(this.config.backupDir, file);
          fs.unlinkSync(filePath);
          console.log(`Deleted old backup: ${filePath}`);
        }
      }
    } catch (error) {
      console.error('Error rotating backups:', error);
      throw error;
    }
  }

  /**
   * Executes the database backup
   */
  public async runBackup(): Promise<string> {
    try {
      const filename = this.generateBackupFilename();
      const command = this.buildPgDumpCommand(filename);

      console.log(`Starting backup: ${filename}`);
      const { stderr } = await execAsync(command);

      if (stderr) {
        console.warn('pg_dump stderr:', stderr);
      }

      console.log(`Backup completed: ${filename}`);
      
      // Rotate backups after successful backup
      await this.rotateBackups();

      return filename;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }
}

// Example configuration - replace with your actual values
const config: BackupConfig = {
  dbHost: 'localhost',
  dbPort: 5432,
  dbName: 'mrdj_production',
  dbUser: 'mrdj_admin',
  dbPassword: 'secure_password', // In production, use environment variables
  backupDir: '/var/backups/mrdj_db',
  maxBackups: 7, // Keep 7 days of backups
  compressBackups: true
};

// Example usage
(async () => {
  try {
    const backup = new DatabaseBackup(config);
    const backupFile = await backup.runBackup();
    console.log(`Successfully created backup: ${backupFile}`);
  } catch (error) {
    console.error('Backup process failed:', error);
    process.exit(1);
  }
})();
